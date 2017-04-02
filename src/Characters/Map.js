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
        Map.fogCanvas.width=130;
        Map.fogCanvas.height=Math.round(130*Map.getCurrentMap().height/Map.getCurrentMap().width);
        Map.fogCanvas.ratio=130/Map.getCurrentMap().width;
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
    //Draw interface call
    drawFogAndMinimap:function(){
        if (Map.fogFlag){
            Map.refreshFog();
            //Draw fog on main map
            var ratio=Map.fogCanvas.ratio;
            Game.fogCxt.clearRect(0,0,Game.HBOUND,Game.VBOUND);
            Game.fogCxt.drawImage(Map.fogCanvas,Math.round(Map.offsetX*ratio),Math.round(Map.offsetY*ratio),
                Math.round(Game.HBOUND*ratio),Math.round(Game.VBOUND*ratio),0,0,Game.HBOUND,Game.VBOUND);
        }
        //Draw mini-map
        Map.drawMiniMap();
    },
    //Used by drawFogAndMinimap
    refreshFog:function(){
        //Reset composite operation
        Map.fogCxt.globalCompositeOperation='source-over';
        //Brush black fog to clean old fog
        Map.fogCxt.fillStyle='rgba(0,0,0,1)';
        Map.fogCxt.fillRect(0,0,Map.fogCanvas.width,Map.fogCanvas.height);
        //Other things have sight
        var parasitedEnemies=Unit.allEnemyUnits().filter(function(chara){
            return chara.buffer.Parasite==Game.team;
        });
        var scannerSweeps=Burst.allEffects.filter(function(anime){
            return anime.constructor.name=="ScannerSweep" && anime.team==Game.team;
        });
        var addInObjs=parasitedEnemies.concat(scannerSweeps);
        //Clear fog
        Map.fogCxt.globalCompositeOperation='destination-out';
        //Initial
        Map.allUnits=Unit.allOurUnits().concat(Building.ourBuildings()).concat(addInObjs);
        //Draw fog
        Map.fogCxt.fillStyle='rgba(0,0,0,1)';
        var ratio=Map.fogCanvas.ratio;
        Map.allUnits.forEach(function(chara){
            //Clear fog on screen for our units inside screen
            var centerX=Math.round(chara.posX()*ratio);
            var centerY=Math.round(chara.posY()*ratio);
            var radius=Math.round(chara.get('sight')*ratio<<1);
            Map.fogCxt.drawImage(Map.shadowCanvas,0,0,100,100,centerX-radius,centerY-radius,radius<<1,radius<<1);
        });
    },
    //Used by drawFogAndMinimap: draw red&green block and white stroke
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
        //Draw fog on mini-map
        if (Map.fogFlag) Map.miniCxt.drawImage(Map.fogCanvas,0,0,Map.fogCanvas.width,Map.fogCanvas.height,0,0,130,130);
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
        if (!onlyMap) Map.drawFogAndMinimap();
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