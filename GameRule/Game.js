var Game={
    //Global variables
    HBOUND:innerWidth,//$('body')[0].scrollWidth
    VBOUND:innerHeight,//$('body')[0].scrollHeight
    infoBox:{
        x:145,
        y:innerHeight-110,
        width:innerWidth-295,
        height:110
    },
    team:0,
    playerNum:2,//By default
    teams:{},
    multiplayer:false,//By default
    cxt:document.querySelector('#middleCanvas').getContext('2d'),
    frontCxt:document.querySelector('#frontCanvas').getContext('2d'),
    backCxt:document.querySelector('#backCanvas').getContext('2d'),
    fogCxt:document.querySelector('#fogCanvas').getContext('2d'),
    _timer:-1,
    _frameInterval:100,
    mainTick:0,
    serverTick:0,
    commands:{},
    replay:{},
    randomSeed:0,//For later use
    selectedUnit:{},
    allSelected:[],
    _oldAllSelected:[],
    hackMode:false,
    isApp:false,
    addIntoAllSelected:function(chara,override){
        if (chara instanceof Gobj){
            //Add into allSelected if not included
            if (Game.allSelected.indexOf(chara)==-1) {
                if (override) Game.allSelected=chara;
                else Game.allSelected.push(chara);
                chara.selected=true;
            }
        }
        //Override directly
        if (chara instanceof Array) {
            if (override) Game.allSelected=chara;
            else chara.forEach(function(char){
                //Add into allSelected if not included
                if (Game.allSelected.indexOf(char)==-1) Game.allSelected.push(char);
            });
            chara.forEach(function(char){
                char.selected=true;
            });
        }
        //Sort allSelected by its name order
        Game.allSelected.sort(function(chara1,chara2){
            //Need sort building icon together
            let name1=(chara1 instanceof Building)?`${chara1.portrait}.${chara1.name}`:chara1.name;
            let name2=(chara2 instanceof Building)?`${chara2.portrait}.${chara2.name}`:chara2.name;
            return ([name1,name2].sort()[0]!=name1)?1:-1;
        });
        //Notify referee to redraw
        Referee.alterSelectionMode();
    },
    //To replace setTimeout
    commandTimeout:function(func,delay){
        let dueTick=Game.mainTick+(delay/100>>0);
        if (!Game.commands[dueTick]) Game.commands[dueTick]=[];
        Game.commands[dueTick].push(func);
    },
    //To replace setInterval
    commandInterval:function(func,interval){
        let funcAdjust=function(){
            func();
            Game.commandTimeout(funcAdjust,interval);
        };
        Game.commandTimeout(funcAdjust,interval);
    },
    race:{
        selected:'Terran',//Terran race by default
        choose:function(race){
            this.selected=race;
            $('div#GamePlay').attr('race',race);
        }
    },
    layerSwitchTo:function(layerName){
        $('div.GameLayer').hide();
        $(`#${layerName}`).show(); //show('slow')
    },
    init:function(){
        //Prevent full select
        $('div.GameLayer').on("selectstart",function(event){
            event.preventDefault();
        });
        //Bind resize canvas handler
        window.onresize=Game.resizeWindow;
        /*window.requestAnimationFrame=requestAnimationFrame || webkitRequestAnimationFrame
         || mozRequestAnimationFrame || msRequestAnimationFrame || oRequestAnimationFrame;//Old browser compatible*/
        //Start loading
        Game.layerSwitchTo("GameLoading");
        //Zerg
        sourceLoader.load("img","img/Charas/Mutalisk.png","Mutalisk");
        sourceLoader.load("img","img/Charas/Devourer.png","Devourer");
        sourceLoader.load("img","img/Charas/Guardian.png","Guardian");
        sourceLoader.load("img","img/Charas/Overlord.png","Overlord");
        sourceLoader.load("img","img/Charas/Drone.png","Drone");
        sourceLoader.load("img","img/Charas/Zergling.png","Zergling");
        sourceLoader.load("img","img/Charas/Hydralisk.png","Hydralisk");
        sourceLoader.load("img","img/Charas/Scourge.png","Scourge");
        sourceLoader.load("img","img/Charas/Lurker.png","Lurker");
        sourceLoader.load("img","img/Charas/Ultralisk.png","Ultralisk");
        sourceLoader.load("img","img/Charas/Broodling.png","Broodling");
        sourceLoader.load("img","img/Charas/InfestedTerran.png","InfestedTerran");
        sourceLoader.load("img","img/Charas/Queen.png","Queen");
        sourceLoader.load("img","img/Charas/Defiler.png","Defiler");
        sourceLoader.load("img","img/Charas/Larva.png","Larva");
        //Terran
        sourceLoader.load("img","img/Charas/BattleCruiser.png","BattleCruiser");
        sourceLoader.load("img","img/Charas/Wraith.png","Wraith");
        sourceLoader.load("img","img/Charas/SCV.png","SCV");
        sourceLoader.load("img","img/Charas/Civilian.png","Civilian");
        sourceLoader.load("img","img/Charas/Marine.png","Marine");
        sourceLoader.load("img","img/Charas/Firebat.png","Firebat");
        sourceLoader.load("img","img/Charas/Ghost.png","Ghost");
        sourceLoader.load("img","img/Charas/Vulture.png","Vulture");
        sourceLoader.load("img","img/Charas/Tank.png","Tank");
        sourceLoader.load("img","img/Charas/Goliath.png","Goliath");
        sourceLoader.load("img","img/Charas/Medic.png","Medic");
        sourceLoader.load("img","img/Charas/Dropship.png","Dropship");
        sourceLoader.load("img","img/Charas/Vessel.png","Vessel");
        sourceLoader.load("img","img/Charas/Valkyrie.png","Valkyrie");
        //Protoss
        sourceLoader.load("img","img/Charas/Probe.png","Probe");
        sourceLoader.load("img","img/Charas/Zealot.png","Zealot");
        sourceLoader.load("img","img/Charas/Dragoon.png","Dragoon");
        sourceLoader.load("img","img/Charas/Templar.png","Templar");
        sourceLoader.load("img","img/Charas/DarkTemplar.png","DarkTemplar");
        sourceLoader.load("img","img/Charas/Reaver.png","Reaver");
        sourceLoader.load("img","img/Charas/Archon.png","Archon");
        sourceLoader.load("img","img/Charas/DarkArchon.png","DarkArchon");
        sourceLoader.load("img","img/Charas/Shuttle.png","Shuttle");
        sourceLoader.load("img","img/Charas/Observer.png","Observer");
        sourceLoader.load("img","img/Charas/Arbiter.png","Arbiter");
        sourceLoader.load("img","img/Charas/Scout.png","Scout");
        sourceLoader.load("img","img/Charas/Carrier.png","Carrier");
        sourceLoader.load("img","img/Charas/Corsair.png","Corsair");
        //Neuture
        sourceLoader.load("img","img/Charas/Ragnasaur.png","Ragnasaur");
        sourceLoader.load("img","img/Charas/Rhynsdon.png","Rhynsdon");
        sourceLoader.load("img","img/Charas/Ursadon.png","Ursadon");
        sourceLoader.load("img","img/Charas/Bengalaas.png","Bengalaas");
        sourceLoader.load("img","img/Charas/Scantid.png","Scantid");
        sourceLoader.load("img","img/Charas/Kakaru.png","Kakaru");
        //Hero
        sourceLoader.load("img","img/Charas/HeroCruiser.png","HeroCruiser");
        sourceLoader.load("img","img/Charas/Sarah.png","Sarah");
        sourceLoader.load("img","img/Charas/Kerrigan.png","Kerrigan");
        sourceLoader.load("img","img/Charas/DevilHunter.png","DevilHunter");
        sourceLoader.load("img","img/Charas/Tassadar.png","Tassadar");
        //Building
        sourceLoader.load("img","img/Charas/ZergBuilding.png","ZergBuilding");
        sourceLoader.load("img","img/Charas/TerranBuilding.png","TerranBuilding");
        sourceLoader.load("img","img/Charas/ProtossBuilding.png","ProtossBuilding");
        /*sourceLoader.load("audio","bgm/PointError.wav","PointError");*/
        //Map
        sourceLoader.load("img","img/Maps/(2)Switchback.jpg","Map_Switchback");
        sourceLoader.load("img","img/Maps/(2)Volcanis.jpg","Map_Volcanis");
        sourceLoader.load("img","img/Maps/(3)Trench wars.jpg","Map_TrenchWars");
        sourceLoader.load("img","img/Maps/(4)Blood Bath.jpg","Map_BloodBath");
        sourceLoader.load("img","img/Maps/(4)Orbital Relay.jpg","Map_OrbitalRelay");
        sourceLoader.load("img","img/Maps/(4)TowerDefense.jpg","Map_TowerDefense");
        sourceLoader.load("img","img/Maps/(6)Thin Ice.jpg","Map_ThinIce");
        sourceLoader.load("img","img/Maps/(8)BigGameHunters.jpg","Map_BigGameHunters");
        sourceLoader.load("img","img/Maps/(8)TheHunters.jpg","Map_TheHunters");
        sourceLoader.load("img","img/Maps/(8)Turbo.jpg","Map_Turbo");
        sourceLoader.load("img","img/Maps/Map_Grass.jpg","Map_Grass");
        sourceLoader.load("img","img/Charas/Mud.png","Mud");
        //Extra
        sourceLoader.load("img","img/Charas/Burst.png","Burst");
        sourceLoader.load("img","img/Charas/BuildingBurst.png","BuildingBurst");
        sourceLoader.load("img","img/Charas/Portrait.png","Portrait");
        sourceLoader.load("img","img/Charas/Magic.png","Magic");
        sourceLoader.load("img","img/Menu/ControlPanel.png","ControlPanel");
        sourceLoader.load("img","img/Bg/GameStart.jpg","GameStart");
        sourceLoader.load("img","img/Bg/GameWin.jpg","GameWin");
        sourceLoader.load("img","img/Bg/GameLose.jpg","GameLose");

        sourceLoader.allOnLoad(function(){
            $('#GameStart').prepend(sourceLoader.sources['GameStart']);
            $('#GameWin').prepend(sourceLoader.sources['GameWin']);
            $('#GameLose').prepend(sourceLoader.sources['GameLose']);
            $('#GamePlay>canvas').attr('width',Game.HBOUND);//Canvas width adjust
            $('#GamePlay>canvas').attr('height',Game.VBOUND-Game.infoBox.height+5);//Canvas height adjust
            for (let N=1;N<=9;N++){
                $('div.panel_Control').append(`<button num="${N}"></button>`);
            }
            Game.start();
        })
    },
    start:function(){
        //Game start
        Game.layerSwitchTo("GameStart");
        //Init level selector
        for (let level=1; level<=Levels.length; level++){
            $('.levelSelectionBg').append("<div class='levelItem'>" +
                "<input type='radio' value='"+level+"' name='levelSelect'>"+
                (Levels[level-1].label?(Levels[level-1].label):("Level "+level))
                +"</input></div>");
        }
        //Wait for user select level and play game
        $('input[name="levelSelect"]').click(function(){
            //Prevent vibration
            if (Game.level!=null) return;
            Game.level=Number.parseInt(this.value);
            Game.play();
        });
    },
    play:function(){
        //Load level to initial when no error occurs
        if (!(Levels[Game.level-1].load())){
            //Need Game.playerNum before expansion
            Game.expandUnitProps();
            Resource.init();
            //Game background
            Game.layerSwitchTo("GamePlay");
            Game.resizeWindow();
            //Collect login user info
            if (Game.hackMode) Multiplayer.sendUserInfo();
            //Bind controller
            mouseController.toControlAll();//Can control all units
            keyController.start();//Start monitor
            Game.pauseWhenHide();//Hew H5 feature:Page Visibility
            Game.initIndexDB();//Hew H5 feature:Indexed DB
            Game.animation();
        }
    },
    getPropArray:function(prop){
        let result=[];
        for (let N=0;N<Game.playerNum;N++){
            result.push(typeof(prop)=='object'?(_$.clone(prop)):prop);
        }
        return result;
    },
    //Do we need this because we only support Zerg vs Terran vs Protoss?
    expandUnitProps:function(){
        //Post-operation for all unit types, prepare basic properties for different team numbers, init in level.js
        _$.traverse([Zerg,Terran,Protoss,Neutral,Hero],function(unitType){
            ['HP','SP','MP','damage','armor','speed','attackRange','attackInterval','plasma','sight'].forEach(function(prop){
                //Prop array, first one for us, second for enemy
                if (unitType.prototype[prop]!=undefined) {
                    unitType.prototype[prop]=Game.getPropArray(unitType.prototype[prop]);
                    unitType.prototype[prop].shareFlag=true;
                }
            });
            if (unitType.prototype.isInvisible){
                for (let N=0;N<Game.playerNum;N++){
                    unitType.prototype[`isInvisible${N}`]=unitType.prototype.isInvisible;
                }
            }
            delete unitType.prototype.isInvisible;//No need anymore
            if (unitType.prototype.attackMode) {
                ['damage','attackRange','attackInterval'].forEach(function(prop){
                    //Prop array, first one for us, second for enemy
                    unitType.prototype.attackMode.flying[prop]=Game.getPropArray(unitType.prototype.attackMode.flying[prop]);
                    unitType.prototype.attackMode.flying[prop].shareFlag=true;
                    unitType.prototype.attackMode.ground[prop]=Game.getPropArray(unitType.prototype.attackMode.ground[prop]);
                    unitType.prototype.attackMode.ground[prop].shareFlag=true;
                });
            }
            unitType.upgrade=function(prop,value,team){
                switch (team){
                    case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
                    eval(`unitType.prototype.${prop}`)[team]=value;
                    break;
                    default:
                        unitType.prototype[prop]=value;
                        break;
                }
            };
        });
        Protoss.Carrier.prototype.interceptorCapacity=Game.getPropArray(Protoss.Carrier.prototype.interceptorCapacity);
        Protoss.Carrier.prototype.interceptorCapacity.shareFlag=true;
        Protoss.Reaver.prototype.scarabCapacity=Game.getPropArray(Protoss.Reaver.prototype.scarabCapacity);
        Protoss.Reaver.prototype.scarabCapacity.shareFlag=true;
        Referee.underArbiterUnits=Game.getPropArray([]);
        Referee.detectedUnits=Game.getPropArray([]);
        for (let N=0;N<Game.playerNum;N++){
            //Initial detector buffer
            let buffer={};
            buffer[`isInvisible${N}`]=false;
            Gobj.detectorBuffer.push(buffer);
            //Initial arbiter buffer
            Protoss.Arbiter.prototype.bufferObj[`isInvisible${N}`]=true;
        }
        for (let grade in Upgrade){
            if (Upgrade[grade].level!=null) {
                Upgrade[grade].level=Game.getPropArray(Upgrade[grade].level);
            }
        }
    },
    addSelectedIntoTeam:function(teamNum){
        //Build a new team
        Game.teams[teamNum]=_$.mixin([],Game.allSelected);
    },
    callTeam:function(teamNum){
        let team=_$.mixin([],Game.teams[teamNum]);
        //When team already exist
        if (team instanceof Array){
            Game.unselectAll();
            //GC
            $.extend([],team).forEach(chara=>{
                if (chara.status=='dead') team.splice(team.indexOf(chara),1);
            });
            Game.addIntoAllSelected(team,true);
            if (team[0] instanceof Gobj){
                Game.changeSelectedTo(team[0]);
                //Sound effect
                team[0].sound.selected.play();
                //Relocate map center
                Map.relocateAt(team[0].posX(),team[0].posY());
            }
        }
    },
    unselectAll:function(){
        //Unselect all
        [...Unit.allUnits,...Building.allBuildings].forEach(chara=>{
            chara.selected=false
        });
        Game.addIntoAllSelected([],true);
    },
    multiSelectInRect:function(){
        Game.unselectAll();
        //Multi select in rect
        let startPoint={x:Map.offsetX+Math.min(mouseController.startPoint.x,mouseController.endPoint.x),
            y:Map.offsetY+Math.min(mouseController.startPoint.y,mouseController.endPoint.y)};
        let endPoint={x:Map.offsetX+Math.max(mouseController.startPoint.x,mouseController.endPoint.x),
            y:Map.offsetY+Math.max(mouseController.startPoint.y,mouseController.endPoint.y)};
        let inRectUnits=Unit.allOurUnits().filter(chara=>{
            return chara.insideRect({start:(startPoint),end:(endPoint)})
        });
        if (inRectUnits.length>0) Game.changeSelectedTo(inRectUnits[0]);
        else Game.changeSelectedTo({});
        Game.addIntoAllSelected(inRectUnits,true);
    },
    getSelectedOne:function(clickX,clickY,isEnemyFilter,unitBuildingFilter,isFlyingFilter,customFilter){
        let distance=function(chara){
            return (clickX-chara.posX())*(clickX-chara.posX())+(clickY-chara.posY())*(clickY-chara.posY());//Math.pow2
        };
        //Initial
        let selectedOne={},charas=[];
        switch (unitBuildingFilter){
            case true:
                charas=Unit.allUnits;
                break;
            case false:
                charas=Building.allBuildings;
                break;
            default:
                charas=[...Unit.allUnits,...Building.allBuildings];
        }
        switch (isEnemyFilter){
            case true:case false:
                charas=charas.filter(chara=>(chara.isEnemy()==isEnemyFilter));
                break;
            case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
                charas=charas.filter(chara=>(chara.team==isEnemyFilter));
                break;
            case '0':case '1':case '2':case '3':case '4':case '5':case '6':case '7':
                charas=charas.filter(chara=>(chara.team!=isEnemyFilter));
        }
        if (isFlyingFilter!=null) {
            charas=charas.filter(chara=>(chara.isFlying==isFlyingFilter));
        }
        //customFilter is filter function
        if (customFilter!=null){
            charas=charas.filter(customFilter);
        }
        //Find nearest one
        selectedOne=charas.filter(chara=>{
            return chara.status!='dead' && chara.includePoint(clickX,clickY);
        }).sort(function(chara1,chara2){
            return distance(chara1)-distance(chara2);
        })[0];
        if (!selectedOne) selectedOne={};
        return selectedOne;
    },
    getInRangeOnes:function(clickX,clickY,range,isEnemyFilter,unitBuildingFilter,isFlyingFilter,customFilter){
        //Initial
        let selectedOnes=[],charas=[];
        switch (unitBuildingFilter){
            case true:
                charas=Unit.allUnits;
                break;
            case false:
                charas=Building.allBuildings;
                break;
            default:
                charas=[...Unit.allUnits,...Building.allBuildings];
        }
        switch (isEnemyFilter){
            case true:case false:
                charas=charas.filter(chara=>(chara.isEnemy()==isEnemyFilter));
                break;
            case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
                charas=charas.filter(chara=>(chara.team==isEnemyFilter));
                break;
            case '0':case '1':case '2':case '3':case '4':case '5':case '6':case '7':
                charas=charas.filter(chara=>(chara.team!=isEnemyFilter));
        }
        if (isFlyingFilter!=null) {
            charas=charas.filter(chara=>(chara.isFlying==isFlyingFilter));
        }
        //customFilter is filter function
        if (customFilter!=null){
            charas=charas.filter(customFilter);
        }
        //Find in range ones
        selectedOnes=charas.filter(chara=>{
            return chara.status!='dead' && chara.insideSquare({centerX:clickX,centerY:clickY,radius:range});
        });
        return selectedOnes;
    },
    //For test use
    getSelected:function(){
        return [...Unit.allUnits,...Building.allBuildings].filter(chara=>chara.selected);
    },
    showInfoFor:function(chara){
        //Show selected living unit info
        if (Game.selectedUnit instanceof Gobj && Game.selectedUnit.status!="dead") {
            //Display info
            $('div.panel_Info>div[class*="info"]').show();
            //Draw selected unit portrait
            $('div.infoLeft div[name="portrait"]')[0].className=(chara.portrait)?chara.portrait:chara.name;
            //Show selected unit HP,SP and MP
            $('div.infoLeft span._Health')[0].style.color=Game.selectedUnit.lifeStatus();
            $('div.infoLeft span.life')[0].innerHTML=Game.selectedUnit.life>>0;
            $('div.infoLeft span.HP')[0].innerHTML=Game.selectedUnit.get('HP');
            if (Game.selectedUnit.SP) {
                $('div.infoLeft span.shield')[0].innerHTML=Game.selectedUnit.shield>>0;
                $('div.infoLeft span.SP')[0].innerHTML=Game.selectedUnit.get('SP');
                $('div.infoLeft span._Shield').show();
            }
            else {
                $('div.infoLeft span._Shield').hide();
            }
            if (Game.selectedUnit.MP) {
                $('div.infoLeft span.magic')[0].innerHTML=Game.selectedUnit.magic>>0;
                $('div.infoLeft span.MP')[0].innerHTML=Game.selectedUnit.get('MP');
                $('div.infoLeft span._Magic').show();
            }
            else {
                $('div.infoLeft span._Magic').hide();
            }
            //Draw selected unit name,kill,damage,armor and shield
            $('div.infoCenter h3.name')[0].innerHTML=Game.selectedUnit.name;
            if (Game.selectedUnit.detector) {
                $('div.infoCenter p.detector').show();
            }
            else {
                $('div.infoCenter p.detector').hide();
            }
            if (Game.selectedUnit.attack){
                $('div.infoCenter p.kill span')[0].innerHTML=Game.selectedUnit.kill;
                if (Game.selectedUnit.attackMode) {
                    $('div.infoCenter p.damage span')[0].innerHTML=(Game.selectedUnit.get('attackMode.ground.damage')+'/'+Game.selectedUnit.get('attackMode.flying.damage'));
                }
                else {
                    $('div.infoCenter p.damage span')[0].innerHTML=(Game.selectedUnit.get('damage')+(Game.selectedUnit.suicide?' (1)':''));
                }
                //Show kill and damage
                $('div.infoCenter p.kill').show();
                $('div.infoCenter p.damage').show();
            }
            else {
                //Hide kill and damage
                $('div.infoCenter p.kill').hide();
                $('div.infoCenter p.damage').hide();
            }
            $('div.infoCenter p.armor span')[0].innerHTML=Game.selectedUnit.get('armor');
            if (Game.selectedUnit.get('plasma')!=undefined) {
                $('div.infoCenter p.plasma span')[0].innerHTML=Game.selectedUnit.get('plasma');
                $('div.infoCenter p.plasma').show();
            }
            else {
                $('div.infoCenter p.plasma').hide();
            }
            //Can disable this filter for testing
            if (Game.selectedUnit.loadedUnits && Game.selectedUnit.team==Game.team) {
                $('div.infoCenter p.passenger span')[0].innerHTML=Game.selectedUnit.loadedUnits.length;
                $('div.infoCenter p.passenger').show();
                //Clear old icons
                $('div.infoCenter p.icons')[0].innerHTML='';
                //Show passenger icons
                Game.selectedUnit.loadedUnits.forEach(function(passenger){
                    $('div.infoCenter p.icons').append($('<span></span>')
                        .attr('class',passenger.name).css('border-color',passenger.lifeStatus()));
                });
                $('div.infoCenter p.icons').show();
            }
            else {
                $('div.infoCenter p.passenger').hide();
                $('div.infoCenter p.icons').hide();
            }
            //Draw upgraded
            let {upgrade:upgraded,team}=Game.selectedUnit;
            if (upgraded){
                for (let N=0;N<3;N++){
                    let upgradeIcon=$('div.upgraded div[name="icon"]')[N];
                    upgradeIcon.innerHTML='';
                    upgradeIcon.style.display='none';
                    if (N<upgraded.length){
                        upgradeIcon.className=upgradeIcon.title=upgraded[N];
                        upgradeIcon.innerHTML=Upgrade[upgraded[N]].level[team];
                        if (Upgrade[upgraded[N]].level[team]){
                            upgradeIcon.setAttribute('disabled','false');
                            upgradeIcon.style.color='aqua';
                        }
                        else {
                            upgradeIcon.setAttribute('disabled','true');
                            upgradeIcon.style.color='red';
                        }
                        upgradeIcon.style.display='inline-block';
                    }
                }
                $('div.upgraded').show();
            }
            else {
                //$('div.upgraded div[name="icon"]').html('').removeAttr('title').hide();
                $('div.upgraded').hide();
            }
        }
        else {
            //Hide info
            $('div.panel_Info>div').hide();
        }
    },
    refreshInfo:function(){
        Game.showInfoFor(Game.selectedUnit);
    },
    changeSelectedTo:function(chara){
        Game.selectedUnit=chara;
        Button.equipButtonsFor(chara);
        if (chara instanceof Gobj){
            chara.selected=true;
        }
        Game.showInfoFor(chara);
    },
    draw:function(chara){
        //Can draw units and no-rotate bullets
        if (!(chara instanceof Gobj)) return;//Will only show Gobj
        if (chara.status=="dead") return;//Will not show dead
        //Won't draw units outside screen
        if (!chara.insideScreen()) return;
        //Choose context
        let cxt=((chara instanceof Unit) || (chara instanceof Building))?Game.cxt:Game.frontCxt;
        //Draw shadow
        cxt.save();
        //cxt.shadowBlur=50;//Different blur level on Firefox and Chrome, bad performance
        cxt.shadowOffsetX=(chara.isFlying)?5:3;
        cxt.shadowOffsetY=(chara.isFlying)?20:8;
        cxt.shadowColor="rgba(0,0,0,0.4)";
        //Close shadow for burrowed
        if (chara.buffer.Burrow) cxt.shadowOffsetX=cxt.shadowOffsetY=0;
        //Draw invisible
        if (chara[`isInvisible${Game.team}`]!=null){
            cxt.globalAlpha=(chara.isEnemy() && chara[`isInvisible${Game.team}`])?0:0.5;
            if (chara.burrowBuffer){
                if (chara.isEnemy()){
                    if (!chara[`isInvisible${Game.team}`]) cxt.globalAlpha=1;
                }
                else cxt.globalAlpha=1;
            }
        }
        //Draw unit or building
        let imgSrc;
        if (chara instanceof Building) imgSrc=sourceLoader.sources[chara.source];
        //Unit, not building
        else imgSrc=sourceLoader.sources[chara.source?chara.source:chara.name];
        //Convert position
        let [charaX,charaY]=[((chara.x-Map.offsetX)>>0),((chara.y-Map.offsetY)>>0)];
        //Same image in different directions
        if (chara.direction==undefined){
            let {left:_left,top:_top}=chara.imgPos[chara.status];
            //Multiple actions status
            if (_left instanceof Array || _top instanceof Array){
                cxt.drawImage(imgSrc,
                    _left[chara.action],_top[chara.action],chara.width,chara.height,
                    charaX,charaY,chara.width,chara.height);
            }
            //One action status
            else{
                cxt.drawImage(imgSrc,
                    _left,_top,chara.width,chara.height,
                    charaX,charaY,chara.width,chara.height);
            }
        }
        //Different image in different directions
        else{
            let _left=chara.imgPos[chara.status].left[chara.direction];
            let _top=chara.imgPos[chara.status].top[chara.direction];
            //Multiple actions status
            if (_left instanceof Array || _top instanceof Array){
                cxt.drawImage(imgSrc,
                    _left[chara.action],_top[chara.action],chara.width,chara.height,
                    charaX,charaY,chara.width,chara.height);
            }
            //One action status
            else{
                cxt.drawImage(imgSrc,
                    _left,_top,chara.width,chara.height,
                    charaX,charaY,chara.width,chara.height);
            }
        }
        //Remove shadow
        cxt.restore();
        //Draw HP if has selected and is true
        if (chara.selected==true){
            cxt=Game.frontCxt;
            //Draw selected circle
            cxt.strokeStyle=(chara.isEnemy())?"red":"green";//Distinguish enemy
            cxt.lineWidth=2;//Cannot see 1px width circle clearly
            cxt.beginPath();
            cxt.arc(chara.posX()-Map.offsetX,chara.posY()-Map.offsetY,chara.radius(),0,2*Math.PI);
            cxt.stroke();
            //Draw HP bar and SP bar and magic bar
            cxt.globalAlpha=1;
            cxt.lineWidth=1;
            let offsetY=-6-(chara.MP?5:0)-(chara.SP?5:0);
            let lifeRatio=chara.life/chara.get('HP');
            cxt.strokeStyle="black";
            if (chara.SP) {
                //Draw HP and SP
                cxt.fillStyle="blue";
                cxt.fillRect(chara.x-Map.offsetX,chara.y-Map.offsetY+offsetY,chara.width*chara.shield/chara.get('SP'),5);
                cxt.strokeRect(chara.x-Map.offsetX,chara.y-Map.offsetY+offsetY,chara.width,5);
                cxt.fillStyle=(lifeRatio>0.7)?"green":(lifeRatio>0.3)?"yellow":"red";//Distinguish life
                cxt.fillRect(chara.x-Map.offsetX,chara.y-Map.offsetY+offsetY+5,chara.width*lifeRatio,5);
                cxt.strokeRect(chara.x-Map.offsetX,chara.y-Map.offsetY+offsetY+5,chara.width,5);
            }
            else {
                //Only draw HP
                cxt.fillStyle=(lifeRatio>0.7)?"green":(lifeRatio>0.3)?"yellow":"red";//Distinguish life
                cxt.fillRect(chara.x-Map.offsetX,chara.y-Map.offsetY+offsetY,chara.width*lifeRatio,5);
                cxt.strokeRect(chara.x-Map.offsetX,chara.y-Map.offsetY+offsetY,chara.width,5);
            }
            if (chara.MP) {
                //Draw MP
                cxt.fillStyle="darkviolet";
                cxt.fillRect(chara.x-Map.offsetX,chara.y-Map.offsetY+offsetY+(chara.SP?10:5),chara.width*chara.magic/chara.get('MP'),5);
                cxt.strokeRect(chara.x-Map.offsetX,chara.y-Map.offsetY+offsetY+(chara.SP?10:5),chara.width,5);
            }
        }
    },
    drawEffect:function(chara){
        //Can draw units and no-rotate bullets
        if (!(chara instanceof Burst)) return;//Will only show Burst
        if (chara.status=="dead") return;//Will not show dead
        //Won't draw units outside screen
        if (!chara.insideScreen()) return;
        //Choose context
        let cxt=Game.frontCxt;
        //Draw shadow
        cxt.save();
        //cxt.shadowBlur=50;//Different blur level on Firefox and Chrome, bad performance
        cxt.shadowOffsetX=(chara.isFlying)?5:3;
        cxt.shadowOffsetY=(chara.isFlying)?20:8;
        cxt.shadowColor="rgba(0,0,0,0.4)";
        let imgSrc=sourceLoader.sources[chara.name];
        //Convert position
        let [charaX,charaY]=[((chara.x-Map.offsetX)>>0),((chara.y-Map.offsetY)>>0)];
        let {left:_left,top:_top}=chara.imgPos[chara.status];
        //Will stretch effect if scale
        let times=chara.scale?chara.scale:1;
        //Multiple actions status
        if (_left instanceof Array || _top instanceof Array){
            cxt.drawImage(imgSrc,
                _left[chara.action],_top[chara.action],chara.width,chara.height,
                charaX,charaY,chara.width*times>>0,chara.height*times>>0);
        }
        //One action status
        else{
            cxt.drawImage(imgSrc,
                _left,_top,chara.width,chara.height,
                charaX,charaY,chara.width*times>>0,chara.height*times>>0);
        }
        //Remove shadow
        cxt.restore();
    },
    drawBullet:function(chara){
        //Can draw bullets need rotate
        if (!(chara instanceof Bullets)) return;//Will only show bullet
        if (chara.status=="dead") return;//Will not show dead
        //Won't draw bullets outside screen
        if (!chara.insideScreen()) return;
        //Draw unit
        let imgSrc=sourceLoader.sources[chara.name];
        let {left:_left,top:_top}=chara.imgPos[chara.status];
        //Convert position
        let [centerX,centerY]=[((chara.posX()-Map.offsetX)>>0),((chara.posY()-Map.offsetY)>>0)];
        //Rotate canvas
        Game.frontCxt.save();
        //Rotate to draw bullet
        Game.frontCxt.translate(centerX,centerY);
        Game.frontCxt.rotate(-chara.angle);
        //Draw shadow
        //Game.frontCxt.shadowBlur=50;//Different blur level on Firefox and Chrome, bad performance
        Game.frontCxt.shadowOffsetX=(chara.owner.isFlying)?5:3;
        Game.frontCxt.shadowOffsetY=(chara.owner.isFlying)?20:5;
        Game.frontCxt.shadowColor="rgba(0,0,0,0.4)";
        //Game.frontCxt.shadowColor="rgba(255,0,0,1)";
        //Multiple actions status
        if (_left instanceof Array || _top instanceof Array){
            Game.frontCxt.drawImage(imgSrc,
                _left[chara.action],_top[chara.action],chara.width,chara.height,
                -chara.width/2>>0,-chara.height/2>>0,chara.width,chara.height);
        }
        //One action status
        else{
            Game.frontCxt.drawImage(imgSrc,
                _left,_top,chara.width,chara.height,
                -chara.width/2>>0,-chara.height/2>>0,chara.width,chara.height);
        }
        //Rotate canvas back and remove shadow
        Game.frontCxt.restore();
        //Below 2 separated steps might cause mess
        //Game.frontCxt.translate(-centerX,-centerY);
        //Game.frontCxt.rotate(chara.angle);
    },
    drawInfoBox:function(){
        //Update selected unit active info which need refresh
        if (Game.selectedUnit instanceof Gobj && Game.selectedUnit.status!="dead") {
            //Update selected unit life,shield and magic
            let lifeRatio=Game.selectedUnit.life/Game.selectedUnit.get('HP');
            $('div.infoLeft span._Health')[0].style.color=((lifeRatio>0.7)?"green":(lifeRatio>0.3)?"yellow":"red");
            $('div.infoLeft span.life')[0].innerHTML=Game.selectedUnit.life>>0;
            if (Game.selectedUnit.SP) {
                $('div.infoLeft span.shield')[0].innerHTML=Game.selectedUnit.shield>>0;
            }
            if (Game.selectedUnit.MP) {
                $('div.infoLeft span.magic')[0].innerHTML=Game.selectedUnit.magic>>0;
            }
            //Update selected unit kill
            if (Game.selectedUnit.kill!=null){
                $('div.infoCenter p.kill span')[0].innerHTML=Game.selectedUnit.kill;
            }
        }
    },
    drawSourceBox:function(){
        //Update min, gas, curMan and totalMan
        $('div.resource_Box span.mineNum')[0].innerHTML=Resource[Game.team].mine;
        $('div.resource_Box span.gasNum')[0].innerHTML=Resource[Game.team].gas;
        $('div.resource_Box span.manNum>span')[0].innerHTML=Resource[Game.team].curMan;
        $('div.resource_Box span.manNum>span')[1].innerHTML=Resource[Game.team].totalMan;
        //Check if man overflow
        $('div.resource_Box span.manNum')[0].style.color=(Resource[Game.team].curMan>Resource[Game.team].totalMan)?"red":"#00ff00";
    },
    drawProcessingBox:function(){
        //Show processing box if it's processing
        let processing=Game.selectedUnit.processing;
        //Can disable this filter for testing
        if (processing && Game.selectedUnit.team==Game.team){
            $('div.upgrading div[name="icon"]')[0].className=processing.name;
            //let percent=((new Date().getTime()-processing.startTime)/(processing.time)+0.5)>>0;
            let percent=((Game.mainTick-processing.startTime)*100/(processing.time)+0.5)>>0;
            $('div.upgrading div[name="processing"] span')[0].innerHTML=percent;
            $('div.upgrading div[name="processing"] div.processedBar')[0].style.width=percent+'%';
            $('div.upgrading').attr('title',processing.name).show();
        }
        else {
            //Select nothing, show replay progress
            if (Game.replayFlag && Game.endTick>0){
                $('div.upgrading div[name="icon"]')[0].className='Replay';
                let percent=(Game.mainTick*100/(Game.endTick)+0.5)>>0;
                $('div.upgrading div[name="processing"] span')[0].innerHTML=percent;
                $('div.upgrading div[name="processing"] div.processedBar')[0].style.width=percent+'%';
                $('div.upgrading').attr('title','Replay Progress').show();
                if (!(Game.selectedUnit instanceof Gobj)){
                    $('div.infoRight').show();
                    $('div.upgraded').hide();
                }
            }
            else $('div.upgrading').removeAttr('title').hide();
        }
    },
    refreshMultiSelectBox:function(){
        let divs=$('div.override div.multiSelection div');
        //Only refresh border color on current multiSelect box
        for (let n=0;n<divs.length;n++){
            divs[n].style.borderColor=Game.allSelected[n].lifeStatus();
        }
    },
    drawMultiSelectBox:function(){
        //Clear old icons
        $('div.override div.multiSelection')[0].innerHTML='';
        //Redraw all icons
        Game.allSelected.forEach(function(chara,N){
            let node=document.createElement('div');
            node.setAttribute('name','portrait');
            //Override portrait
            node.className=(chara.portrait)?chara.portrait:chara.name;
            node.title=chara.name;
            node.style.borderColor=chara.lifeStatus();
            node.onclick=function(){
                //Selection execute
                Game.unselectAll();
                Game.changeSelectedTo(chara);
                //Single selection mode
                $('div.override').hide();
                $('div.override div.multiSelection').hide();
            };
            $('div.override div.multiSelection')[0].appendChild(node);
        });
        let iconNum=$('div.override div.multiSelection div').length;
        //Adjust width if unit icon space overflow
        $('div.override div.multiSelection').css('width',(iconNum>12?Math.ceil(iconNum/2)*55:330)+'px');
        //Adjust background position after added into DOM, nth starts from 1st(no 0th)
        for (let n=1;n<=iconNum;n++){
            let bgPosition=$(`div.override div.multiSelection div:nth-child(${n})`).css('background-position');
            bgPosition=bgPosition.split(' ').map(function(pos){
                return Number.parseInt(pos)*0.75+'px';
            }).join(' ');
            $(`div.override div.multiSelection div:nth-child(${n})`).css('background-position',bgPosition);
        }
    },
    animation:function(){
        Game.animation.loop=function(){
            //console.log('BeforeCommand:'+(new Date().getTime()));//test
            //Process due commands for current frame before drawing
            let commands=Game.commands[Game.mainTick];
            if (commands instanceof Array){
                for (let N=0;N<commands.length;N++){
                    commands[N]();
                }
                delete Game.commands[Game.mainTick];
            }
            /************ Draw part *************/
            //console.log('AfterCommand-BeforeDrawFrame:'+(new Date().getTime()));//test
            //Clear all canvas
            Game.cxt.clearRect(0,0,Game.HBOUND,Game.VBOUND);
            Game.frontCxt.clearRect(0,0,Game.HBOUND,Game.VBOUND);
            //DrawLayer0: Refresh map if needed
            if (mouseController.mouseX<Map.triggerMargin) Map.needRefresh="LEFT";
            if (mouseController.mouseX>(Game.HBOUND-Map.triggerMargin)) Map.needRefresh="RIGHT";
            if (mouseController.mouseY<Map.triggerMargin) Map.needRefresh="TOP";
            if (mouseController.mouseY>(Game.VBOUND-Map.triggerMargin)) Map.needRefresh="BOTTOM";
            if (Map.needRefresh) {
                Map.refresh(Map.needRefresh);
                Map.needRefresh=false;
            }
            //DrawLayer1: Show all buildings
            for (let N=0;N<Building.allBuildings.length;N++){
                let build=Building.allBuildings[N];
                //GC
                if (build.status=="dead") {
                    Building.allBuildings.splice(N,1);
                    N--;//Next unit come to this position
                    continue;
                }
                //Draw
                Game.draw(build);
            }
            //DrawLayer2: Show all existed units
            for (let N=0;N<Unit.allUnits.length;N++){
                let chara=Unit.allUnits[N];
                //GC
                if (chara.status=="dead") {
                    Unit.allUnits.splice(N,1);
                    N--;
                    continue;
                }
                //Draw
                Game.draw(chara);
            }
            //DrawLayer3: Draw all bullets
            for (let N=0;N<Bullets.allBullets.length;N++){
                let bullet=Bullets.allBullets[N];
                //GC
                if (bullet.status=="dead" && bullet.used) {
                    Bullets.allBullets.splice(N,1);
                    N--;
                    continue;
                }
                Game.drawBullet(bullet);
            }
            //DrawLayer4: Draw effects above units
            for (let N=0;N<Burst.allEffects.length;N++){
                let effect=Burst.allEffects[N];
                //GC
                if (effect.status=="dead" || (effect.target && effect.target.status=="dead")) {
                    Burst.allEffects.splice(N,1);
                    N--;
                    continue;
                }
                Game.drawEffect(effect);
            }
            //DrawLayer5: Draw drag rect
            if (mouseController.drag) {
                Game.cxt.lineWidth=3;
                Game.cxt.strokeStyle="green";
                Game.cxt.strokeRect(mouseController.startPoint.x,mouseController.startPoint.y,
                    mouseController.endPoint.x-mouseController.startPoint.x,
                    mouseController.endPoint.y-mouseController.startPoint.y);
            }
            //DrawLayerBottom: Draw info box and resource box
            Game.drawInfoBox();
            Game.drawSourceBox();
            Game.drawProcessingBox();
            /************ Calculate for next frame *************/
            //console.log('AfterDrawFrame-BeforeCalculateNextFrame:'+(new Date().getTime()));//test
            //Clock ticking
            Game.mainTick++;
            //For network mode
            if (Multiplayer.ON){
                //Send current tick to server
                Multiplayer.webSocket.send(JSON.stringify({
                    type:'tick',
                    tick:Game.mainTick,
                    cmds:(Multiplayer.cmds.length?Multiplayer.cmds:null)
                }));
            }
            else {
                //Record user moves and execute if have
                if (Multiplayer.cmds.length>0) {
                    //MainTick++ just before this code piece
                    Game.replay[Game.mainTick]=$.extend([],Multiplayer.cmds);
                    //Execute command
                    Multiplayer.parseTickCmd({
                        tick:Game.mainTick,
                        cmds:Multiplayer.cmds
                    });
                }
            }
            //Clear commands
            if (Multiplayer.cmds.length>0){
                Multiplayer.cmds=[];
            }
            //Postpone play frames and AI after drawing (consume time)
            [...Building.allBuildings,...Unit.allUnits,...Bullets.allBullets,...Burst.allEffects].forEach(chara=>{
                //Add this makes chara intelligent for attack
                if (chara.AI) chara.AI();
                //Judge reach destination
                if (chara instanceof Unit) Referee.judgeReachDestination(chara);
                //Join timers together
                chara.playFrames();
            });
            //Will invite Mr.Referee to make some judgments
            for (let task of Referee.tasks){
                Referee[task]();
            }
            //Release selected unit when unit died or is invisible enemy
            if (Game.selectedUnit instanceof Gobj){
                if (Game.selectedUnit.status=="dead" || (Game.selectedUnit[`isInvisible${Game.team}`] && Game.selectedUnit.isEnemy())) {
                    Game.selectedUnit.selected=false;
                    Game.changeSelectedTo({});
                }
            }
            //console.log('AfterCalculateNextFrame:'+(new Date().getTime()));//test
        };
        if (Multiplayer.ON){
            Game._timer=setInterval(function(){
                if (Game.mainTick<Game.serverTick) Game.animation.loop();
            },Game._frameInterval);
        }
        else Game.startAnimation();
    },
    stopAnimation:function(){
        if (Game._timer!=-1) clearInterval(Game._timer);
        Game._timer=-1;
    },
    startAnimation:function(){
        if (Game._timer==-1) Game._timer=setInterval(Game.animation.loop,Game._frameInterval);
    },
    stop:function(charas){
        charas.forEach(chara=>{
            chara.stop();
        });
        Game.stopAnimation();
    },
    win:function(){
        if (Multiplayer.ON){
            Multiplayer.webSocket.send(JSON.stringify({
                type:'getReplay'
            }));
        }
        else {
            Game.saveReplay();
            Game.saveReplayIntoDB();
        }
        $('div#GamePlay').fadeOut(3000,function(){
            Game.stop(Unit.allUnits);
            //Win poster
            Game.layerSwitchTo("GameWin");
            new Audio('bgm/GameWin.wav').play();
        });
        //Self destruction to prevent duplicate fadeout
        Game.win=function(){};
    },
    lose:function(){
        if (Multiplayer.ON){
            Multiplayer.webSocket.send(JSON.stringify({
                type:'getReplay'
            }));
        }
        else {
            Game.saveReplay();
            Game.saveReplayIntoDB();
        }
        $('div#GamePlay').fadeOut(3000,function(){
            Game.stop(Unit.allUnits);
            //Lose poster
            Game.layerSwitchTo("GameLose");
            new Audio('bgm/GameLose.wav').play();
        });
        //Self destruction to prevent duplicate fadeout
        Game.lose=function(){};
    },
    saveReplay:function(replayData){
        if (!Game.replayFlag) {
            localStorage.setItem('lastReplay',JSON.stringify({
                level:Game.level,
                team:Game.team,
                //Save Game.replay by default
                cmds:(replayData!=null)?replayData:(Game.replay),
                end:Game.mainTick
            }));
        }
    },
    showWarning:function(msg,interval){
        //Default interval
        if (!interval) interval=3000;
        //Show message for a period
        $('div.warning_Box').html(msg).show();
        //Hide message after a period
        setTimeout(function(){
            $('div.warning_Box').html('').hide();
        },interval);
    },
    showMessage:function(){
        //Clossure timer
        let _timer=0;
        return function(msg,interval){
            //Default interval
            if (!interval) interval=3000;
            //Show message for a period
            $('div.message_Box').append(`<p>${msg}</p>`).show();
            //Can show multiple lines together
            if (_timer) clearTimeout(_timer);
            //Hide message after a period
            _timer=setTimeout(function(){
                $('div.message_Box').html('').hide();
            },interval);
        };
    }(),
    //Return from 0 to 0.99
    getNextRandom:(function(){
        //Clossure variable and function
        let rands=[];
        let getRands=function(){
            //Use current tick as seed
            let seed=Game.mainTick+Game.randomSeed;
            let rands=[];
            for (let N=0;N<100;N++){
                //Seed grows up in range 100
                seed=(seed*21+3)%100;
                rands.push(seed);
            }
            return rands;
        };
        return function(){
            //If all rands used, generate new ones
            if (rands.length==0) rands=getRands();
            return rands.shift()/100;
        };
    })(),
    resizeWindow:function(){
        //Update parameters
        Game.HBOUND=innerWidth;//$('body')[0].scrollWidth
        Game.VBOUND=innerHeight;//$('body')[0].scrollHeight
        Game.infoBox.width=Game.HBOUND-295;
        Game.infoBox.y=Game.VBOUND-110;
        //Resize canvas
        $('#GamePlay>canvas').attr('width',Game.HBOUND);//Canvas width adjust
        $('#GamePlay>canvas').attr('height',Game.VBOUND-Game.infoBox.height+5);//Canvas height adjust
        Map.fogCanvas.width=Game.HBOUND;
        Map.fogCanvas.height=Game.VBOUND-Game.infoBox.height+5;
        //Resize panel_Info
        $('div.panel_Info')[0].style.width=((Game.HBOUND-295)+'px');
        if (Map.ready){
            //Update map inside-stroke size
            Map.insideStroke.width=(130*Game.HBOUND/Map.getCurrentMap().width)>>0;
            Map.insideStroke.height=(130*Game.VBOUND/Map.getCurrentMap().height)>>0;
            //Redraw background
            Map.drawBg();
            //Need re-calculate fog immediately
            Map.drawFogsImmediate();
        }
    },
    getCurrentTs:function(){
        let now=new Date();
        let formatNum=function(num){
            if (num<10) return `0${num}`;
            else return num.toString();
        };
        let timestamp=now.getFullYear()+'-'+formatNum(now.getMonth()+1)+'-'+formatNum(now.getDate())+' '
            +formatNum(now.getHours())+':'+formatNum(now.getMinutes())+':'+formatNum(now.getSeconds());
        return timestamp;
    },
    //New H5 features demo
    pauseWhenHide:function(){
        //Add pause when hide window
        $(document).on('visibilitychange',function(){
            if ($(document).attr('hidden')!=null){
                if ($(document).attr('hidden')){
                    Button.pauseHandler();
                    $('title').html('Paused...');
                }
                else {
                    Button.playHandler();
                    $('title').html('StarCraft');
                }
            }
        });
    },
    initIndexDB:function(){
        window.indexedDB=(indexedDB || webkitIndexedDB || mozIndexedDB || msIndexedDB);
        let connect=indexedDB.open('StarCraftHTML5',1);
        connect.onupgradeneeded=function(evt){
            let db=evt.target.result;
            let objStore=db.createObjectStore('Replays',{keyPath:'id',autoIncrement:true});
            objStore.createIndex('levelIndex','level',{unique:false});
            objStore.createIndex('teamIndex','team',{unique:false});
            objStore.createIndex('endIndex','end',{unique:false});
            objStore.createIndex('msIndex','millisec',{unique:false});
            objStore.createIndex('tsIndex','timestamp',{unique:false});
            objStore.createIndex('offlineIndex','offline',{unique:false});
            db.close();
        }
    },
    saveReplayIntoDB:function(){
        let connect=indexedDB.open('StarCraftHTML5',1);
        connect.onsuccess=function(evt){
            let db=evt.target.result;
            let objStore=db.transaction(['Replays'],'readwrite').objectStore('Replays');
            objStore.add({
                level:Game.level,
                team:Game.team,
                cmds:Game.replay,
                end:Game.mainTick,
                millisec:new Date().getTime(),
                timestamp:Game.getCurrentTs(),
                offline:Boolean(Game.offline).toString()
            });
            db.close();
        }
    }
};
