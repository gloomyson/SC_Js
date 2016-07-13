var Map={
    currentMap:'Switchback',//By default
    ready:false,
    offsetX:0,
    offsetY:0,
    speed:40,
    triggerMargin:20,
    //To synchronize drawing map and units, will not refresh immediately
    needRefresh:false,
    fogFlag:true,
    fogUnits:[],//Units need to draw fog on screen
    allUnits:[],//Units need to draw fog on minimap
    batchSize:0,//Draw fog by each batch
    miniCxt:$('canvas[name="mini_map"]')[0].getContext('2d'),
    fogCanvas:document.createElement('canvas'),
    miniFogCanvas:document.createElement('canvas'),
    shadowCanvas:document.createElement('canvas'),//Pre-render for fog shadow
    insideStroke:{
        width:0,
        height:0
    },
    //Init map
    setCurrentMap:function(name){
        Map.currentMap=name;
        $('canvas[name="mini_map"]').attr('class',name);
        //Init inside stroke size
        Map.insideStroke.width=(130*Game.HBOUND/Map.getCurrentMap().width)>>0;
        Map.insideStroke.height=(130*Game.VBOUND/Map.getCurrentMap().height)>>0;
        //Init fog relative
        Map.fogCxt=Map.fogCanvas.getContext('2d');
        Map.miniFogCanvas.width=Map.miniFogCanvas.height=130;
        Map.miniFogCxt=Map.miniFogCanvas.getContext('2d');
        Map.shadowCanvas.width=Map.shadowCanvas.height=100;
        Map.shadowCxt=Map.shadowCanvas.getContext('2d');
        //Prepared fog shadow for quick render
        var radial=Map.shadowCxt.createRadialGradient(50,50,25,50,50,50);
        radial.addColorStop(0,'rgba(0,0,0,1)');
        radial.addColorStop(1,'rgba(0,0,0,0)');
        Map.shadowCxt.fillStyle=radial;
        Map.shadowCxt.beginPath();
        Map.shadowCxt.arc(50,50,50,0,Math.PI*2);
        Map.shadowCxt.fill();
        //Map is ready after current map set
        Map.ready=true;
    },
    getCurrentMap:function(){
        return sourceLoader.sources['Map_'+Map.currentMap];
    },
    refreshFogs:function(immediate){
        var N=immediate?1:10;
        //Initial if needed
        if (Map.refreshFogs.step==null){
            //Reset composite operation
            Map.fogCxt.globalCompositeOperation=Map.miniFogCxt.globalCompositeOperation='source-over';
            //Brush black fog to clean old fog
            Map.fogCxt.fillStyle=Map.miniFogCxt.fillStyle='rgba(0,0,0,1)';
            Map.fogCxt.fillRect(0,0,Map.fogCanvas.width,Map.fogCanvas.height);
            Map.miniFogCxt.fillRect(0,0,130,130);
            //Other things have sight
            var parasitedEnemies=Unit.allEnemyUnits().filter(function(chara){
                return chara.buffer.Parasite==Game.team;
            });
            var scannerSweeps=Burst.allEffects.filter(function(anime){
                return Animation.getName(anime)=="ScannerSweep" && anime.team==Game.team;
            });
            var addInObjs=parasitedEnemies.concat(scannerSweeps);
            //Clear fog
            Map.fogCxt.globalCompositeOperation=Map.miniFogCxt.globalCompositeOperation='destination-out';
            //Initial
            Map.allUnits=Unit.allOurUnits().concat(Building.ourBuildings()).concat(addInObjs);
            Map.fogUnits=Map.allUnits.filter(function(chara){
                return chara.sightInsideScreen();
            });
            Map.batchSize=Math.ceil(Map.fogUnits.length/N);
            Map.refreshFogs.step=0;//Initial step
            Map.fogReady=false;
        }
        var batchUnits=[];
        if (Map.fogUnits.length>Map.batchSize) {
            batchUnits=Map.fogUnits.slice(0,Map.batchSize);
            Map.fogUnits=Map.fogUnits.slice(Map.batchSize);
        }
        else {
            batchUnits=Map.fogUnits;
            Map.fogUnits=[];
        }
        //Draw fog
        //console.log('BeforeInsideScreen:'+(new Date().getTime()));//test
        Map.fogCxt.fillStyle='rgba(0,0,0,1)';
        batchUnits.forEach(function(chara){
            //Clear fog on screen for our units inside screen
            var centerX=chara.posX()-Map.offsetX;
            var centerY=chara.posY()-Map.offsetY;
            var radius=chara.get('sight')<<1;//*2
            Map.fogCxt.drawImage(Map.shadowCanvas,0,0,100,100,centerX-radius,centerY-radius,radius<<1,radius<<1);
        });
        Map.refreshFogs.step++;
        if (Map.refreshFogs.step==N) {
            delete Map.refreshFogs.step;//Return to initial
            Map.fogReady=true;
        }
        //console.log('AfterInsideScreen-BeforeMinimap:'+(new Date().getTime()));//test
        if (Map.fogReady){
            Map.allUnits.forEach(function(chara){
                //Clear fog on mini-map for all our units
                var offsetX=(chara.posX()*130/Map.getCurrentMap().width)>>0;
                var offsetY=(chara.posY()*130/Map.getCurrentMap().height)>>0;
                var sight=(chara.get('sight')*130/Map.getCurrentMap().height)>>0;
                Map.miniFogCxt.beginPath();
                Map.miniFogCxt.drawImage(Map.shadowCanvas,0,0,100,100,offsetX-(sight<<1),offsetY-(sight<<1),sight<<2,sight<<2);
            });
            //console.log('AfterMinimap:'+(new Date().getTime()));//test
        }
    },
    drawFogAndMinimap:function(immediate){
        if (Map.fogFlag){
            //Peformance: Refresh fog by 10 steps
            Map.refreshFogs(immediate);
            //Fogs are ready, now draw main fog and mini-map
            if (Map.fogReady) {
                //Draw fog on main map
                Game.fogCxt.clearRect(0,0,Game.HBOUND,Game.VBOUND);
                Game.fogCxt.drawImage(Map.fogCanvas,0,0);
                //Draw mini-map
                Map.drawMiniMap();
            }
        }
        else {
            if (immediate) Map.drawMiniMap();
            else {
                if (Game.mainTick%10==1) Map.drawMiniMap();
            }
        }
    },
    //Bad performance, very slow operation
    drawFogsImmediate:function(){
        delete Map.refreshFogs.step;
        Map.drawFogAndMinimap(true);
    },
    //Red-Green block and white stroke
    drawMiniMap:function(){
        //Selected map size
        var mapWidth=Map.getCurrentMap().width;
        var mapHeight=Map.getCurrentMap().height;
        //Clear mini-map
        Map.miniCxt.clearRect(0,0,130,130);
        //Re-draw mini-map points
        var miniX,miniY,rectSize;
        Building.allBuildings.concat(Unit.allUnits).forEach(function(chara){
            //Filter out invisible enemy
            if (chara['isInvisible'+Game.team] && chara.isEnemy()) return;
            miniX=(130*chara.x/mapWidth)>>0;
            miniY=(130*chara.y/mapHeight)>>0;
            Map.miniCxt.fillStyle=(chara.isEnemy())?'red':'lime';
            rectSize=(chara instanceof Building)?4:3;
            Map.miniCxt.fillRect(miniX,miniY,rectSize,rectSize);
        });
        //Re-draw fog on mini-map
        if (Map.fogFlag && Map.miniFogCxt){
            //Draw fog on mini-map
            Map.miniCxt.drawImage(Map.miniFogCanvas,0,0);
        }
        //Re-draw inside stroke
        Map.miniCxt.strokeStyle='white';
        Map.miniCxt.lineWidth=2;
        Map.miniCxt.strokeRect((130*Map.offsetX/mapWidth)>>0,(130*Map.offsetY/mapHeight)>>0,Map.insideStroke.width,Map.insideStroke.height);
    },
    drawMud:function(){
        var _increments=[[0,1],[-1,0],[0,-1],[1,0]];
        var mudRadius=120;
        var mudIncrements=_$.mapTraverse(_increments,function(x){
            return x*mudRadius/2;
        });
        Game.backCxt.save();
        Game.backCxt.beginPath();
        //Create fill style for mud
        var mudPattern=Game.backCxt.createPattern(sourceLoader.sources['Mud'],"repeat");
        Game.backCxt.fillStyle=mudPattern;
        Building.allBuildings.filter(function(chara){
            return (chara instanceof Building.ZergBuilding) && !chara.noMud && chara.insideScreen();
        }).forEach(function(chara){
            var centerX=chara.posX()-Map.offsetX;
            var centerY=chara.posY()-Map.offsetY;
            var pos=[centerX+mudRadius,centerY-mudRadius];
            Game.backCxt.moveTo(pos[0],pos[1]);
            for(var M=0,angle=-Math.PI/4;M<4;M++,angle+=Math.PI/2){
                for(var N=0;N<5;N++){
                    Game.backCxt.arc(pos[0],pos[1],mudRadius/4,angle,angle+Math.PI/2);
                    if (N<4) {
                        pos[0]+=mudIncrements[M][0];
                        pos[1]+=mudIncrements[M][1];
                    }
                }
            }
        });
        //Stroke edge clearly
        Game.backCxt.strokeStyle="#212";
        Game.backCxt.lineWidth=3;
        Game.backCxt.stroke();
        //Fill mud
        Game.backCxt.fill();
        Game.backCxt.restore();
    },
    drawBg:function(){
        //Clear background
        Game.backCxt.clearRect(0,0,Game.HBOUND,Game.VBOUND);
        //Draw map as background
        Game.backCxt.drawImage(Map.getCurrentMap(),Map.offsetX,Map.offsetY,Game.HBOUND,Game.VBOUND-Game.infoBox.height+5,
            0,0,Game.HBOUND,Game.VBOUND-Game.infoBox.height+5);
        //Draw mud for ZergBuildings
        Map.drawMud();
    },
    refresh:function(direction){
        var edgeX=Map.getCurrentMap().width-Game.HBOUND;
        var edgeY=Map.getCurrentMap().height-Game.VBOUND+Game.infoBox.height-5;
        var onlyMap;
        switch (direction){
            case "LEFT":
                Map.offsetX-=Map.speed;
                if (Map.offsetX<0) Map.offsetX=0;
                break;
            case "RIGHT":
                Map.offsetX+=Map.speed;
                if (Map.offsetX>edgeX) Map.offsetX=edgeX;
                break;
            case "TOP":
                Map.offsetY-=Map.speed;
                if (Map.offsetY<0) Map.offsetY=0;
                break;
            case "BOTTOM":
                Map.offsetY+=Map.speed;
                if (Map.offsetY>edgeY) Map.offsetY=edgeY;
                break;
            case "MAP":
                onlyMap=true;
                break;
        }
        Map.drawBg();
        //Need re-calculate fog when screen moves
        if (!onlyMap) Map.drawFogsImmediate();
    },
    clickHandler:function(event){
        //Mouse at (clickX,clickY)
        var clickX=event.pageX-$('canvas[name="mini_map"]').offset().left;
        var clickY=event.pageY-$('canvas[name="mini_map"]').offset().top;
        //Relocate map center
        Map.relocateAt(Map.getCurrentMap().width*clickX/130,Map.getCurrentMap().height*clickY/130);
    },
    dblClickHandler:function(event){
        //Mouse at (clickX,clickY)
        var clickX=event.pageX-$('canvas[name="mini_map"]').offset().left;
        var clickY=event.pageY-$('canvas[name="mini_map"]').offset().top;
        //Map (clickX,clickY) to position (mapX,mapY) on map
        var mapX=Map.getCurrentMap().width*clickX/130;
        var mapY=Map.getCurrentMap().height*clickY/130;
        //Move selected units to (mapX,mapY)
        Unit.allUnits.filter(function(chara){
            return (chara.team==Game.team) && chara.selected;
        }).forEach(function(chara){
            if (chara.attack) chara.stopAttack();
            chara.targetLock=true;
            chara.moveTo(mapX,mapY);
        });
    },
    relocateAt:function(centerX,centerY){
        //Get map edge
        var edgeX=Map.getCurrentMap().width-Game.HBOUND;
        var edgeY=Map.getCurrentMap().height-Game.VBOUND+Game.infoBox.height-5;
        //Map (centerX,centerY) to position (offsetX,offsetY) on top-left in map
        var offsetX=(centerX-Game.HBOUND/2)>>0;
        if (offsetX<0) offsetX=0;
        if (offsetX>edgeX) offsetX=edgeX;
        var offsetY=(centerY-(Game.VBOUND-Game.infoBox.height+5)/2)>>0;
        if (offsetY<0) offsetY=0;
        if (offsetY>edgeY) offsetY=edgeY;
        //Relocate map
        Map.offsetX=offsetX;
        Map.offsetY=offsetY;
        Map.needRefresh=true;//For synchronize
    }
};