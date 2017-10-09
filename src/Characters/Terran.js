/******* Define Terran units *******/
var Terran={};
Terran.SCV=AttackableUnit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "SCV",
        imgPos: {
            moving: {
                left: [5,77,149,221,293,365,437,509,581,725,797,869,941,1013,1085,1157],
                top: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
            },
            attack: {
                left: [
                    [5,5,5,5,5],[77,77,77,77,77],
                    [149,149,149,149,149],[221,221,221,221,221],
                    [293,293,293,293,293],[365,365,365,365,365],
                    [437,437,437,437,437],[509,509,509,509,509],
                    [581,581,581,581,581],[725,725,725,725,725],
                    [797,797,797,797,797],[869,869,869,869,869],
                    [941,941,941,941,941],[1013,1013,1013,1013,1013],
                    [1085,1085,1085,1085,1085],[1157,1157,1157,1157,1157]
                ],
                top: [
                    [77,77,149,149,149],[77,77,149,149,149],
                    [77,77,149,149,149],[77,77,149,149,149],
                    [77,77,149,149,149],[77,77,149,149,149],
                    [77,77,149,149,149],[77,77,149,149,149],
                    [77,77,149,149,149],[77,77,149,149,149],
                    [77,77,149,149,149],[77,77,149,149,149],
                    [77,77,149,149,149],[77,77,149,149,149],
                    [77,77,149,149,149],[77,77,149,149,149]
                ]
            }
        },
        width: 62,//72N+5
        height: 62,//72N+5
        frame: {
            moving: 1,
            attack:5
        },
        //Only for moving status, override
        speed:12,
        HP: 60,
        damage: 5,
        armor:0,
        sight:245,
        meleeAttack: true,
        attackInterval: 1500,
        dieEffect:Burst.SmallExplode,
        attackEffect:Burst.SCVSpark,
        isFlying:false,
        attackLimit:"ground",
        unitType:Unit.SMALL,
        attackType:AttackableUnit.NORMAL_ATTACK,
        recover:Building.TerranBuilding.prototype.recover,
        cost:{
            mine:50,
            man:1,
            time:200
        },
        upgrade:['UpgradeInfantryArmors'],
        items:{
            '4':{name:'repair'},
            '5':{name:'gather'},
            '7':{name:'BasicBuilding'},
            '8':{name:'AdvancedBuilding'}
        },
        buildTerranBuilding:function(location){
            //Has location callback info or nothing
            if (location){
                //Move toward target to fire Ensnare
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,40,function(){
                    if (Resource.payCreditBill.call(myself)){
                        var target=Building.TerranBuilding[myself.buildName];
                        var construction=new (eval('Building.'+target.prototype.evolves[0].step))
                            ({x:location.x-target.prototype.width/2,y:location.y-target.prototype.height/2,team:myself.team});
                        construction.buildName=myself.buildName;
                        //Calculate duration
                        var duration=Resource.getCost(myself.buildName).time;
                        //Cheat: Operation cwal
                        if (Cheat.cwal) duration=40;
                        //Processing flag on transfer
                        construction.processing={
                            name:construction.buildName,
                            startTime:Game.mainTick,//new Date().getTime()
                            time:duration
                        };
                        //Evolve chain
                        for (var N=1;N<target.prototype.evolves.length;N++){
                            (function(n){
                                var evolveInfo=target.prototype.evolves[n];
                                Game.commandTimeout(function(){
                                    if (construction.status!='dead'){
                                        //Evolve
                                        var evolveTarget=(eval('Building.'+evolveInfo.step));
                                        //Step is constructor function
                                        if (evolveTarget){
                                            var old=construction;
                                            construction=construction.evolveTo({
                                                type:evolveTarget,
                                                mixin:(evolveTarget.prototype.name=='ConstructionSkeleton')?{type:construction.buildName}:null,
                                                chain:true
                                            });
                                            construction.processing=old.processing;
                                            construction.buildName=old.buildName;
                                        }
                                        //Step is status string
                                        else {
                                            construction.status=evolveInfo.step;
                                        }
                                    }
                                },duration*100*evolveInfo.percent);
                            })(N);
                        }
                        //Final evolve
                        Game.commandTimeout(function(){
                            if (construction.status!='dead'){
                                //Evolve
                                construction.evolveTo({type:Building.TerranBuilding[construction.buildName]});
                            }
                        },duration*100);
                    }
                });
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=arguments.callee;
                Button.callback.farmer=this;
                Button.callback.buildType='TerranBuilding';
                $('div.GameLayer').attr('status','button');
            }
        }
    }
});
Terran.Marine=AttackableUnit.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Marine",
        imgPos: {
            moving: {
                left: [
                    [10,10,10,10,10,10,10,10,10],[74,74,74,74,74,74,74,74,74],
                    [138,138,138,138,138,138,138,138,138],[202,202,202,202,202,202,202,202,202],
                    [266,266,266,266,266,266,266,266,266],[330,330,330,330,330,330,330,330,330],
                    [394,394,394,394,394,394,394,394,394],[458,458,458,458,458,458,458,458,458],
                    [522,522,522,522,522,522,522,522,522],[650,650,650,650,650,650,650,650,650],
                    [714,714,714,714,714,714,714,714,714],[778,778,778,778,778,778,778,778,778],
                    [842,842,842,842,842,842,842,842,842],[906,906,906,906,906,906,906,906,906],
                    [970,970,970,970,970,970,970,970,970],[1034,1034,1034,1034,1034,1034,1034,1034,1034]
                ],
                top: [
                    [266,330,394,458,522,586,650,714,778],[266,330,394,458,522,586,650,714,778],
                    [266,330,394,458,522,586,650,714,778],[266,330,394,458,522,586,650,714,778],
                    [266,330,394,458,522,586,650,714,778],[266,330,394,458,522,586,650,714,778],
                    [266,330,394,458,522,586,650,714,778],[266,330,394,458,522,586,650,714,778],
                    [266,330,394,458,522,586,650,714,778],[266,330,394,458,522,586,650,714,778],
                    [266,330,394,458,522,586,650,714,778],[266,330,394,458,522,586,650,714,778],
                    [266,330,394,458,522,586,650,714,778],[266,330,394,458,522,586,650,714,778],
                    [266,330,394,458,522,586,650,714,778],[266,330,394,458,522,586,650,714,778]
                ]
            },
            attack: {
                left: [
                    [10,10,10,10,10,10,10],[74,74,74,74,74,74,74],
                    [138,138,138,138,138,138,138],[202,202,202,202,202,202,202],
                    [266,266,266,266,266,266,266],[330,330,330,330,330,330,330],
                    [394,394,394,394,394,394,394],[458,458,458,458,458,458,458],
                    [522,522,522,522,522,522,522],[650,650,650,650,650,650,650],
                    [714,714,714,714,714,714,714],[778,778,778,778,778,778,778],
                    [842,842,842,842,842,842,842],[906,906,906,906,906,906,906],
                    [970,970,970,970,970,970,970],[1034,1034,1034,1034,1034,1034,1034]
                ],
                top: [
                    [74,138,202,138,202,138,202],[74,138,202,138,202,138,202],
                    [74,138,202,138,202,138,202],[74,138,202,138,202,138,202],
                    [74,138,202,138,202,138,202],[74,138,202,138,202,138,202],
                    [74,138,202,138,202,138,202],[74,138,202,138,202,138,202],
                    [74,138,202,138,202,138,202],[74,138,202,138,202,138,202],
                    [74,138,202,138,202,138,202],[74,138,202,138,202,138,202],
                    [74,138,202,138,202,138,202],[74,138,202,138,202,138,202],
                    [74,138,202,138,202,138,202],[74,138,202,138,202,138,202]
                ]
            },
            dock: {
                left: [10,74,138,202,266,330,394,458,522,650,714,778,842,906,970,1034],
                top: [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10]
            }
        },
        width: 44,//64N+10
        height: 44,
        frame: {
            moving: 9,
            dock: 1,
            attack: 7
        },
        //Only for moving status, override
        speed:10,
        HP: 40,
        damage: 6,
        armor:0,
        sight:245,
        attackRange: 140,
        attackInterval: 1500,
        dieEffect:Burst.HumanDeath,
        attackEffect:Burst.ShootSpark,
        isFlying:false,
        unitType:Unit.SMALL,
        attackType:AttackableUnit.NORMAL_ATTACK,
        recover:Building.TerranBuilding.prototype.recover,
        cost:{
            mine:50,
            man:1,
            time:240
        },
        upgrade:['UpgradeInfantryWeapons','UpgradeInfantryArmors'],
        items:{
            '7':{name:'StimPacks',condition:function(){
                return Magic.StimPacks.enabled
            }}
        },
        //Override
        dock:function(){
            //Use the same behavior
            AttackableUnit.turnAround.call(this);
        }
    }
});
Terran.Firebat=AttackableUnit.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Firebat",
        imgPos: {
            moving: {
                left: [
                    [0,0,0,0,0,0,0,0],[32,32,32,32,32,32,32,32],
                    [64,64,64,64,64,64,64,64],[96,96,96,96,96,96,96,96],
                    [128,128,128,128,128,128,128,128],[160,160,160,160,160,160,160,160],
                    [192,192,192,192,192,192,192,192],[224,224,224,224,224,224,224,224],
                    [256,256,256,256,256,256,256,256],[320,320,320,320,320,320,320,320],
                    [352,352,352,352,352,352,352,352],[384,384,384,384,384,384,384,384],
                    [416,416,416,416,416,416,416,416],[448,448,448,448,448,448,448,448],
                    [480,480,480,480,480,480,480,480],[512,512,512,512,512,512,512,512]
                ],
                top: [
                    [64,96,128,160,192,224,256,288],[64,96,128,160,192,224,256,288],
                    [64,96,128,160,192,224,256,288],[64,96,128,160,192,224,256,288],
                    [64,96,128,160,192,224,256,288],[64,96,128,160,192,224,256,288],
                    [64,96,128,160,192,224,256,288],[64,96,128,160,192,224,256,288],
                    [64,96,128,160,192,224,256,288],[64,96,128,160,192,224,256,288],
                    [64,96,128,160,192,224,256,288],[64,96,128,160,192,224,256,288],
                    [64,96,128,160,192,224,256,288],[64,96,128,160,192,224,256,288],
                    [64,96,128,160,192,224,256,288],[64,96,128,160,192,224,256,288]
                ]
            },
            dock: {
                left: [0,32,64,96,128,160,192,224,256,320,352,384,416,448,480,512],
                top: [64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64]
            },
            attack: {
                left: [
                    [0,0,0,0,0,0],[32,32,32,32,32,32],
                    [64,64,64,64,64,64],[96,96,96,96,96,96],
                    [128,128,128,128,128,128],[160,160,160,160,160,160],
                    [192,192,192,192,192,192],[224,224,224,224,224,224],
                    [256,256,256,256,256,256],[320,320,320,320,320,320],
                    [352,352,352,352,352,352],[384,384,384,384,384,384],
                    [416,416,416,416,416,416],[448,448,448,448,448,448],
                    [480,480,480,480,480,480],[512,512,512,512,512,512]
                ],
                top: [
                    [0,32,32,32,32,32],[0,32,32,32,32,32],
                    [0,32,32,32,32,32],[0,32,32,32,32,32],
                    [0,32,32,32,32,32],[0,32,32,32,32,32],
                    [0,32,32,32,32,32],[0,32,32,32,32,32],
                    [0,32,32,32,32,32],[0,32,32,32,32,32],
                    [0,32,32,32,32,32],[0,32,32,32,32,32],
                    [0,32,32,32,32,32],[0,32,32,32,32,32],
                    [0,32,32,32,32,32],[0,32,32,32,32,32]
                ]
            }
        },
        width: 32,//32N
        height: 32,//32N
        frame: {
            moving: 8,
            dock: 1,
            attack:6
        },
        //Only for moving status, override
        speed:10,
        HP: 50,
        damage: 16,
        armor:1,
        sight:245,
        attackRange: 70,
        attackInterval: 2200,
        dieEffect:Burst.SmallExplode,
        isFlying:false,
        attackLimit:"ground",
        unitType:Unit.SMALL,
        attackType:AttackableUnit.WAVE_ATTACK,
        recover:Building.TerranBuilding.prototype.recover,
        AOE:{
            type:"LINE",
            hasEffect:false,
            radius:35
        },
        cost:{
            mine:50,
            gas:25,
            man:1,
            time:240
        },
        upgrade:['UpgradeInfantryWeapons','UpgradeInfantryArmors'],
        items:{
            '7':{name:'StimPacks',condition:function(){
                return Magic.StimPacks.enabled
            }}
        },
        //Override
        dock:function(){
            //Use the same behavior
            AttackableUnit.turnAround.call(this);
        }
    }
});
Terran.Ghost=AttackableUnit.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Ghost",
        imgPos: {
            moving: {
                left: [
                    [0,0,0,0,0,0,0,0,0],[43,43,43,43,43,43,43,43,43],
                    [86,86,86,86,86,86,86,86,86],[129,129,129,129,129,129,129,129,129],
                    [172,172,172,172,172,172,172,172,172],[215,215,215,215,215,215,215,215,215],
                    [258,258,258,258,258,258,258,258,258],[301,301,301,301,301,301,301,301,301],
                    [344,344,344,344,344,344,344,344,344],[430,430,430,430,430,430,430,430,430],
                    [473,473,473,473,473,473,473,473,473],[516,516,516,516,516,516,516,516,516],
                    [559,559,559,559,559,559,559,559,559],[602,602,602,602,602,602,602,602,602],
                    [645,645,645,645,645,645,645,645,645],[688,688,688,688,688,688,688,688,688]
                ],
                top: [
                    [0,39,78,117,156,195,234,273,312],[0,39,78,117,156,195,234,273,312],
                    [0,39,78,117,156,195,234,273,312],[0,39,78,117,156,195,234,273,312],
                    [0,39,78,117,156,195,234,273,312],[0,39,78,117,156,195,234,273,312],
                    [0,39,78,117,156,195,234,273,312],[0,39,78,117,156,195,234,273,312],
                    [0,39,78,117,156,195,234,273,312],[0,39,78,117,156,195,234,273,312],
                    [0,39,78,117,156,195,234,273,312],[0,39,78,117,156,195,234,273,312],
                    [0,39,78,117,156,195,234,273,312],[0,39,78,117,156,195,234,273,312],
                    [0,39,78,117,156,195,234,273,312],[0,39,78,117,156,195,234,273,312]
                ]
            },
            attack: {
                left: [
                    [0,0,0,0],[43,43,43,43],
                    [86,86,86,86],[129,129,129,129],
                    [172,172,172,172],[215,215,215,215],
                    [258,258,258,258],[301,301,301,301],
                    [344,344,344,344],[430,430,430,430],
                    [473,473,473,473],[516,516,516,516],
                    [559,559,559,559],[602,602,602,602],
                    [645,645,645,645],[688,688,688,688]
                ],
                top: [
                    [351,390,429,468],[351,390,429,468],
                    [351,390,429,468],[351,390,429,468],
                    [351,390,429,468],[351,390,429,468],
                    [351,390,429,468],[351,390,429,468],
                    [351,390,429,468],[351,390,429,468],
                    [351,390,429,468],[351,390,429,468],
                    [351,390,429,468],[351,390,429,468],
                    [351,390,429,468],[351,390,429,468]
                ]
            },
            dock: {
                left: [0,43,86,129,172,215,258,301,344,430,473,516,559,602,645,688],
                top: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            }
        },
        width: 43,//43N
        height: 39,//39N
        frame: {
            moving: 9,
            dock: 1,
            attack:4
        },
        //Only for moving status, override
        speed:10,
        HP: 45,
        damage: 10,
        armor:0,
        MP: 200,
        sight:315,
        attackRange: 210,
        attackInterval: 2200,
        dieEffect:Burst.HumanDeath,
        attackEffect:Burst.FireSpark,
        isFlying:false,
        unitType:Unit.SMALL,
        attackType:AttackableUnit.WAVE_ATTACK,
        recover:Building.TerranBuilding.prototype.recover,
        cost:{
            mine:25,
            gas:75,
            man:1,
            time:500
        },
        upgrade:['UpgradeInfantryWeapons','UpgradeInfantryArmors'],
        items:{
            '7':{name:'Cloak',condition:function(){
                return Magic.PersonalCloak.enabled
            }},
            '8':{name:'Lockdown',condition:function(){
                return Magic.Lockdown.enabled
            }},
            '9':{name:'NuclearStrike',condition:function(){
                return Magic.NuclearStrike.enabled
            }}
        },
        //Override
        dock:function(){
            //Use the same behavior
            AttackableUnit.turnAround.call(this);
        }
    }
});
Terran.Medic=Unit.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Medic",
        imgPos: {
            moving: {
                left: [
                    [16,16,16,16,16,16,16],[80,80,80,80,80,80,80],
                    [144,144,144,144,144,144,144],[208,208,208,208,208,208,208],
                    [272,272,272,272,272,272,272],[336,336,336,336,336,336,336],
                    [400,400,400,400,400,400,400],[464,464,464,464,464,464,464],
                    [528,528,528,528,528,528,528],[656,656,656,656,656,656,656],
                    [720,720,720,720,720,720,720],[784,784,784,784,784,784,784],
                    [848,848,848,848,848,848,848],[912,912,912,912,912,912,912],
                    [976,976,976,976,976,976,976],[1040,1040,1040,1040,1040,1040,1040]
                ],
                top: [
                    [400,464,528,592,656,720,784],[400,464,528,592,656,720,784],
                    [400,464,528,592,656,720,784],[400,464,528,592,656,720,784],
                    [400,464,528,592,656,720,784],[400,464,528,592,656,720,784],
                    [400,464,528,592,656,720,784],[400,464,528,592,656,720,784],
                    [400,464,528,592,656,720,784],[400,464,528,592,656,720,784],
                    [400,464,528,592,656,720,784],[400,464,528,592,656,720,784],
                    [400,464,528,592,656,720,784],[400,464,528,592,656,720,784],
                    [400,464,528,592,656,720,784],[400,464,528,592,656,720,784]
                ]
            },
            dock: {
                left: [16,80,144,208,272,336,400,464,528,656,720,784,848,912,976,1040],
                top: [400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400]
            },
            attack: {
                left: [
                    [16,16,16,16,16,16],[80,80,80,80,80,80],
                    [144,144,144,144,144,144],[208,208,208,208,208,208],
                    [272,272,272,272,272,272],[336,336,336,336,336,336],
                    [400,400,400,400,400,400],[464,464,464,464,464,464],
                    [528,528,528,528,528,528],[656,656,656,656,656,656],
                    [720,720,720,720,720,720],[784,784,784,784,784,784],
                    [848,848,848,848,848,848],[912,912,912,912,912,912],
                    [976,976,976,976,976,976],[1040,1040,1040,1040,1040,1040]
                ],
                top: [
                    [16,80,144,208,272,336],[16,80,144,208,272,336],
                    [16,80,144,208,272,336],[16,80,144,208,272,336],
                    [16,80,144,208,272,336],[16,80,144,208,272,336],
                    [16,80,144,208,272,336],[16,80,144,208,272,336],
                    [16,80,144,208,272,336],[16,80,144,208,272,336],
                    [16,80,144,208,272,336],[16,80,144,208,272,336],
                    [16,80,144,208,272,336],[16,80,144,208,272,336],
                    [16,80,144,208,272,336],[16,80,144,208,272,336]
                ]
            }
        },
        width: 32,//64N+16
        height: 32,//64N+16
        frame: {
            moving: 7,
            dock: 1,
            attack: 6 //Reserved
        },
        //Only for moving status, override
        speed:10,
        HP: 60,
        armor:1,
        MP: 200,
        sight:315,
        dieEffect:Burst.MedicDeath,
        isFlying:false,
        unitType:Unit.SMALL,
        recover:Building.TerranBuilding.prototype.recover,
        cost:{
            mine:50,
            gas:25,
            man:1,
            time:300
        },
        upgrade:['UpgradeInfantryArmors'],
        items:{
            '7':{name:'Heal'},
            '8':{name:'Restoration',condition:function(){
                return Magic.Restoration.enabled
            }},
            '9':{name:'OpticalFlare',condition:function(){
                return Magic.OpticalFlare.enabled
            }}
        },
        //Override
        dock:function(){
            //Use the same behavior
            Unit.turnAround.call(this);
        }
    }
});
Terran.Vulture=AttackableUnit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.attack=this.imgPos.dock=this.imgPos.moving;
        this.frame.attack=this.frame.dock=this.frame.moving;
        this.spiderMines=3;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Vulture",
        imgPos: {
            moving: {
                left: [10,110,210,310,410,510,610,710,810,110,210,310,410,510,610,710],
                top: [10,10,10,10,10,10,10,10,10,110,110,110,110,110,110,110]
            }
        },
        width: 80,//100N+10
        height: 80,//100N+10
        frame: {
            moving: 1
        },
        //Only for moving status, override
        speed:16,
        HP: 80,
        damage: 20,
        armor:0,
        sight:280,
        attackRange: 175,
        attackInterval: 3000,
        dieEffect:Burst.MiddleExplode,
        isFlying:false,
        attackLimit:"ground",
        unitType:Unit.MIDDLE,
        attackType:AttackableUnit.WAVE_ATTACK,
        recover:Building.TerranBuilding.prototype.recover,
        cost:{
            mine:75,
            man:2,
            time:300
        },
        upgrade:['UpgradeVehicleWeapons','UpgradeVehicleArmors'],
        items:{
            '7':{name:'SpiderMines',condition:function(){
                return Magic.SpiderMines.enabled
            }}
        }
    }
});
Terran.Tank=AttackableUnit.extends({
    constructorPlus:function(props){
        this.imgPos.attack=this.imgPos.dock;
        this.frame.attack=this.frame.dock;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Tank",
        imgPos: {
            moving: {
                left: [
                    [24,24,24],[152,152,152],
                    [280,280,280],[408,408,408],
                    [536,536,536],[664,664,664],
                    [792,792,792],[920,920,920],
                    [1048,1048,1048],[1304,1304,1304],
                    [1432,1432,1432],[1560,1560,1560],
                    [1688,1688,1688],[1816,1816,1816],
                    [1944,1944,1944],[2072,2072,2072]
                ],
                top: [
                    [24,152,280],[24,152,280],
                    [24,152,280],[24,152,280],
                    [24,152,280],[24,152,280],
                    [24,152,280],[24,152,280],
                    [24,152,280],[24,152,280],
                    [24,152,280],[24,152,280],
                    [24,152,280],[24,152,280],
                    [24,152,280],[24,152,280]
                ]
            },
            dock: {
                left: [24,152,280,408,536,664,792,920,1048,1304,1432,1560,1688,1816,1944,2072],
                top: [24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24]
            }
        },
        width: 80,//128N+24
        height: 80,//128N+24
        frame: {
            moving: 3,
            dock: 1
        },
        //Only for moving status, override
        speed:10,
        HP: 150,
        damage: 30,
        armor:1,
        sight:350,
        attackRange: 210,
        attackInterval: 3700,
        dieEffect:Burst.BigExplode,
        attackEffect:Burst.FireSpark,
        isFlying:false,
        attackLimit:"ground",
        unitType:Unit.BIG,
        attackType:AttackableUnit.BURST_ATTACK,
        recover:Building.TerranBuilding.prototype.recover,
        cost:{
            mine:150,
            gas:100,
            man:2,
            time:500
        },
        upgrade:['UpgradeVehicleWeapons','UpgradeVehicleArmors'],
        items:{
            '7':{name:'SeigeMode',condition:function(){
                return Magic.SeigeMode.enabled
            }}
        }
    }
});
Terran.Goliath=AttackableUnit.extends({
    constructorPlus:function(props){
        //Bind bgm
        this.sound.attackG=new Audio(Game.CDN+'bgm/'+this.name+'.attack.wav');
        this.sound.attackF=new Audio(Game.CDN+'bgm/'+this.name+'.attackF.wav');
    },
    prototypePlus: {
        //Add basic unit info
        name: "Goliath",
        imgPos: {
            moving: {
                left: [
                    [0,0,0,0,0,0,0,0,0,0],[76,76,76,76,76,76,76,76,76,76],
                    [152,152,152,152,152,152,152,152,152,152],[228,228,228,228,228,228,228,228,228,228],
                    [304,304,304,304,304,304,304,304,304,304],[380,380,380,380,380,380,380,380,380,380],
                    [456,456,456,456,456,456,456,456,456,456],[532,532,532,532,532,532,532,532,532,532],
                    [608,608,608,608,608,608,608,608,608,608],[760,760,760,760,760,760,760,760,760,760],
                    [836,836,836,836,836,836,836,836,836,836],[912,912,912,912,912,912,912,912,912,912],
                    [988,988,988,988,988,988,988,988,988,988],[1064,1064,1064,1064,1064,1064,1064,1064,1064,1064],
                    [1140,1140,1140,1140,1140,1140,1140,1140,1140,1140],[1216,1216,1216,1216,1216,1216,1216,1216,1216,1216]
                ],
                top: [
                    [0,76,152,228,304,380,456,532,608,684],[0,76,152,228,304,380,456,532,608,684],
                    [0,76,152,228,304,380,456,532,608,684],[0,76,152,228,304,380,456,532,608,684],
                    [0,76,152,228,304,380,456,532,608,684],[0,76,152,228,304,380,456,532,608,684],
                    [0,76,152,228,304,380,456,532,608,684],[0,76,152,228,304,380,456,532,608,684],
                    [0,76,152,228,304,380,456,532,608,684],[0,76,152,228,304,380,456,532,608,684],
                    [0,76,152,228,304,380,456,532,608,684],[0,76,152,228,304,380,456,532,608,684],
                    [0,76,152,228,304,380,456,532,608,684],[0,76,152,228,304,380,456,532,608,684],
                    [0,76,152,228,304,380,456,532,608,684],[0,76,152,228,304,380,456,532,608,684]
                ]
            },
            attack: {
                left: [
                    [0,0],[76,76],
                    [152,152],[228,228],
                    [304,304],[380,380],
                    [456,456],[532,532],
                    [608,608],[760,760],
                    [836,836],[912,912],
                    [988,988],[1064,1064],
                    [1140,1140],[1216,1216]
                ],
                top: [
                    [608,760],[608,760],
                    [608,760],[608,760],
                    [608,760],[608,760],
                    [608,760],[608,760],
                    [608,760],[608,760],
                    [608,760],[608,760],
                    [608,760],[608,760],
                    [608,760],[608,760]
                ]
            },
            dock: {
                left: [0,76,152,228,304,380,456,532,608,760,836,912,988,1064,1140,1216],
                top: [608,608,608,608,608,608,608,608,608,608,608,608,608,608,608,608]
            }
        },
        width: 76,//76N
        height: 76,//76N
        frame: {
            moving: 10,
            dock: 1,
            attack:2
        },
        //Only for moving status, override
        speed:11,
        HP: 125,
        attackMode:{
            flying:{
                attackRange:175,
                attackInterval: 2200,
                damage:20,
                attackType:AttackableUnit.BURST_ATTACK
            },
            ground:{
                attackRange:175,
                attackEffect:Burst.ShootSpark,
                attackInterval: 2200,
                damage:12,
                attackType:AttackableUnit.NORMAL_ATTACK
            },
            status:false
        },
        //Default
        damage: 12,
        armor:1,
        sight:280,
        attackRange: 175,
        dieEffect:Burst.MiddleExplode,
        isFlying:false,
        unitType:Unit.BIG,
        recover:Building.TerranBuilding.prototype.recover,
        cost:{
            mine:100,
            gas:50,
            man:2,
            time:400
        },
        upgrade:['UpgradeVehicleWeapons','UpgradeVehicleArmors']
    }
});
Terran.Wraith=AttackableUnit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        //Bind bgm
        this.sound.attackG=new Audio(Game.CDN+'bgm/'+this.name+'.attack.wav');
        this.sound.attackF=new Audio(Game.CDN+'bgm/'+this.name+'.attackF.wav');
    },
    prototypePlus: {
        //Add basic unit info
        name: "Wraith",
        imgPos: {
            moving: {
                left: [5,69,133,197,261,325,389,453,517,69,133,197,261,325,389,453],
                top: [5,5,5,5,5,5,5,5,5,69,69,69,69,69,69,69]
            }
        },
        width: 54,//64N+5
        height: 54,//64N+5
        frame: {
            moving: 1
        },
        //Only for moving status, override
        speed:16,
        HP: 120,
        armor:0,
        MP: 200,
        sight:245,
        attackMode:{
            flying:{
                attackRange:175,
                attackInterval: 2200,
                damage:20,
                attackType:AttackableUnit.BURST_ATTACK
            },
            ground:{
                attackRange:105,
                attackInterval: 2200,
                damage:8,
                attackType:AttackableUnit.NORMAL_ATTACK
            },
            status:false
        },
        //Default
        damage: 8,
        attackRange: 105,
        dieEffect:Burst.MiddleExplode,
        isFlying:true,
        unitType:Unit.BIG,
        recover:Building.TerranBuilding.prototype.recover,
        cost:{
            mine:150,
            gas:100,
            man:2,
            time:600
        },
        upgrade:['UpgradeShipWeapons','UpgradeShipArmors'],
        items:{
            '7':{name:'Cloak',condition:function(){
                return Magic.Cloak.enabled
            }}
        },
        //Override
        dock:function(){
            //Use the same behavior
            AttackableUnit.hover.call(this);
        }
    }
});
Terran.Dropship=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        //Transport
        this.loadedUnits=[];
    },
    prototypePlus: {
        //Add basic unit info
        name: "Dropship",
        imgPos: {
            moving: {
                left: [0,60,120,180,240,300,360,420,480,60,120,180,240,300,360,420],
                top: [0,0,0,0,0,0,0,0,0,60,60,60,60,60,60,60]
            }
        },
        width: 60,//N-1
        height: 60,//N-1
        frame: {
            moving: 1
        },
        //Only for moving status, override
        speed:13,
        HP: 150,
        armor:1,
        sight:280,
        dieEffect:Burst.MiddleExplode,
        isFlying:true,
        unitType:Unit.BIG,
        recover:Building.TerranBuilding.prototype.recover,
        cost:{
            mine:100,
            gas:100,
            man:2,
            time:500
        },
        upgrade:['UpgradeShipArmors'],
        items:{
            '8':{name:'Load'},
            '9':{name:'UnloadAll'}
        },
        //Override
        dock:function(){
            //Use the same behavior
            Unit.hover.call(this);
        },
        die:Zerg.Overlord.prototype.die
    }
});
Terran.Vessel=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Vessel",
        imgPos: {
            moving: {
                left: [14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14],
                top: [24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24]
            }
        },
        width: 70,
        height: 55,
        frame: {
            moving: 1
        },
        //Only for moving status, override
        speed:12,
        HP: 200,
        armor:1,
        MP: 200,
        sight:350,
        dieEffect:Burst.BigExplode,
        isFlying:true,
        unitType:Unit.BIG,
        detector:Gobj.detectorBuffer,
        recover:Building.TerranBuilding.prototype.recover,
        cost:{
            mine:100,
            gas:225,
            man:2,
            time:800
        },
        upgrade:['UpgradeShipArmors'],
        items:{
            '7':{name:'DefensiveMatrix'},
            '8':{name:'EMPShockwave',condition:function(){
                return Magic.EMPShockwave.enabled
            }},
            '9':{name:'Irradiate',condition:function(){
                return Magic.Irradiate.enabled
            }}
        },
        //Override
        dock:function(){
            //Use the same behavior
            Unit.hover.call(this);
        }
    }
});
Terran.BattleCruiser=AttackableUnit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "BattleCruiser",
        imgPos: {
            moving: {
                left: [13,133,253,373,493,613,733,853,973,133,253,373,493,613,733,853],
                top: [13,13,13,13,13,13,13,13,13,133,133,133,133,133,133,133]
            }
        },
        width: 94,//120N+13
        height: 94,//120N+13
        frame: {
            moving: 1
        },
        //Only for moving status, override
        speed:6,
        HP: 500,
        damage: 25,
        armor:3,
        MP: 200,
        sight:385,
        attackRange: 210,
        attackInterval: 3000,
        dieEffect:Burst.BigExplode,
        isFlying:true,
        unitType:Unit.BIG,
        attackType:AttackableUnit.NORMAL_ATTACK,
        recover:Building.TerranBuilding.prototype.recover,
        cost:{
            mine:400,
            gas:300,
            man:8,
            time:1330
        },
        upgrade:['UpgradeShipWeapons','UpgradeShipArmors'],
        items:{
            '7':{name:'Yamato',condition:function(){
                return Magic.Yamato.enabled
            }}
        },
        //Override
        dock:function(){
            //Use the same behavior
            AttackableUnit.hover.call(this);
        }
    }
});
Terran.Valkyrie=AttackableUnit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.attack=this.imgPos.dock=this.imgPos.moving;
        this.frame.attack=this.frame.dock=this.frame.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Valkyrie",
        imgPos: {
            moving: {
                left: [35,163,291,419,547,675,803,931,1059,163,291,419,547,675,803,931],
                top: [35,35,35,35,35,35,35,35,35,163,163,163,163,163,163,163]
            }
        },
        width: 58,//128N+35
        height: 58,//128N+35
        frame: {
            moving: 1
        },
        //Only for moving status, override
        speed:16,
        HP: 200,
        damage: 6,//6*3
        armor:2,
        sight:280,
        attackRange: 210,
        attackInterval: 600,
        dieEffect:Burst.MiddleExplode,
        isFlying:true,
        attackLimit:"flying",
        unitType:Unit.BIG,
        attackType:AttackableUnit.BURST_ATTACK,
        recover:Building.TerranBuilding.prototype.recover,
        AOE:{
            type:"LINE",
            hasEffect:true,
            radius:50
        },
        cost:{
            mine:250,
            gas:125,
            man:3,
            time:500
        },
        upgrade:['UpgradeShipWeapons','UpgradeShipArmors'],
        //Override
        dock:function(){
            //Use the same behavior
            AttackableUnit.hover.call(this);
        }
    }
});
Terran.Civilian=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Civilian",
        imgPos: {
            moving: {
                left: [
                    [11,11,11,11,11,11,11,11],[35,35,35,35,35,35,35,35],
                    [60,60,60,60,60,60,60,60],[84,84,84,84,84,84,84,84],
                    [108,108,108,108,108,108,108,108],[131,131,131,131,131,131,131,131],
                    [154,154,154,154,154,154,154,154],[177,177,177,177,177,177,177,177],
                    [200,200,200,200,200,200,200,200],[224,224,224,224,224,224,224,224],
                    [248,248,248,248,248,248,248,248],[272,272,272,272,272,272,272,272],
                    [293,293,293,293,293,293,293,293],[317,317,317,317,317,317,317,317],
                    [342,342,342,342,342,342,342,342],[366,366,366,366,366,366,366,366]
                ],
                top: [
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211],
                    [246,0,37,70,105,142,176,211],[246,0,37,70,105,142,176,211]
                ]
            }
        },
        width: 21,
        height: 31,
        frame: {
            moving: 8,
            dock: 1
        },
        //Only for moving status, override
        speed:6,
        HP: 60,
        armor:0,
        sight:245,
        dieEffect:Burst.HumanDeath,
        isFlying:false,
        unitType:Unit.SMALL,
        recover:Building.TerranBuilding.prototype.recover,
        upgrade:['UpgradeInfantryArmors'],
        //Override
        dock:function(){
            //Use the same behavior
            Unit.turnAround.call(this);
        }
    }
});