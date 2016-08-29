/******* Define Protoss units *******/
var Protoss={};
Protoss.Probe=AttackableUnit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Probe",
        imgPos: {
            moving: {
                left: [0,32,64,96,128,160,192,224,256,32,64,96,128,160,192,224],
                top: [0,0,0,0,0,0,0,0,0,32,32,32,32,32,32,32]
            },
            attack: {
                left: [0,32,64,96,128,160,192,224,256,32,64,96,128,160,192,224],
                top: [0,0,0,0,0,0,0,0,0,32,32,32,32,32,32,32]
            }
        },
        width: 32,//32N
        height: 32,//32N
        frame: {
            moving: 1
        },
        //Only for moving status, override
        speed:12,
        HP: 20,
        SP: 20,
        damage: 5,
        armor:0,
        plasma:0,
        sight:280,
        meleeAttack: true,
        attackInterval: 2200,
        dieEffect:Burst.SmallBlueExplode,
        attackEffect:Burst.ProbeSpark,
        isFlying:false,
        attackLimit:"ground",
        unitType:Unit.SMALL,
        attackType:AttackableUnit.NORMAL_ATTACK,
        recover:Building.ProtossBuilding.prototype.recover,
        cost:{
            mine:50,
            man:1,
            time:200
        },
        upgrade:['UpgradeGroundArmor','UpgradePlasmaShields'],
        items:{'4':undefined,
            '5':{name:'gather'},
            '7':{name:'BasicStructure'},
            '8':{name:'AdvancedStructure'}
        },
        buildProtossBuilding:function(location){
            //Has location callback info or nothing
            if (location){
                //Move toward target to fire Ensnare
                this.targetLock=true;
                var myself=this;
                this.moveTo(location.x,location.y,40,function(){
                    if (Resource.payCreditBill.call(myself)){
                        var transfer=new Building.ProtossBuilding.WrapRift({x:location.x-32,y:location.y-32,team:myself.team});
                        transfer.buildName=myself.buildName;
                        //Calculate duration
                        var duration=Resource.getCost(myself.buildName).time;
                        //Cheat: Operation cwal
                        if (Cheat.cwal) duration=20;
                        Game.commandTimeout(function(){
                            if (transfer.status!='dead'){
                                //Evolve
                                transfer.evolveTo({
                                    type:Building.ProtossBuilding[transfer.buildName],
                                    burstArr:['ProtossBuildingComplete']
                                });
                            }
                        },duration*100);
                        //Processing flag on transfer
                        transfer.processing={
                            name:transfer.buildName,
                            startTime:Game.mainTick,//new Date().getTime()
                            time:duration
                        };
                    }
                });
            }
            //If missing location info, mark Button.callback, mouseController will call back with location
            else {
                Button.callback=arguments.callee;
                Button.callback.farmer=this;
                Button.callback.buildType='ProtossBuilding';
                $('div.GameLayer').attr('status','button');
            }
        }
    }
});
Protoss.Zealot=AttackableUnit.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Zealot",
        imgPos: {
            moving: {
                left: [
                    [0,0,0,0,0,0,0,0],[42,42,42,42,42,42,42,42],
                    [84,84,84,84,84,84,84,84],[126,126,126,126,126,126,126,126],
                    [168,168,168,168,168,168,168,168],[210,210,210,210,210,210,210,210],
                    [252,252,252,252,252,252,252,252],[294,294,294,294,294,294,294,294],
                    [336,336,336,336,336,336,336,336],[420,420,420,420,420,420,420,420],
                    [462,462,462,462,462,462,462,462],[504,504,504,504,504,504,504,504],
                    [546,546,546,546,546,546,546,546],[588,588,588,588,588,588,588,588],
                    [630,630,630,630,630,630,630,630],[672,672,672,672,672,672,672,672]
                ],
                top: [
                    [0,44,88,132,176,220,264,308],[0,44,88,132,176,220,264,308],
                    [0,44,88,132,176,220,264,308],[0,44,88,132,176,220,264,308],
                    [0,44,88,132,176,220,264,308],[0,44,88,132,176,220,264,308],
                    [0,44,88,132,176,220,264,308],[0,44,88,132,176,220,264,308],
                    [0,44,88,132,176,220,264,308],[0,44,88,132,176,220,264,308],
                    [0,44,88,132,176,220,264,308],[0,44,88,132,176,220,264,308],
                    [0,44,88,132,176,220,264,308],[0,44,88,132,176,220,264,308],
                    [0,44,88,132,176,220,264,308],[0,44,88,132,176,220,264,308]
                ]
            },
            dock: {
                left: [0,42,84,126,168,210,252,294,336,420,462,504,546,588,630,672],
                top: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            },
            attack:{
                left: [
                    [0,0,0,0,0],[42,42,42,42,42],
                    [84,84,84,84,84],[126,126,126,126,126],
                    [168,168,168,168,168],[210,210,210,210,210],
                    [252,252,252,252,252],[294,294,294,294,294],
                    [336,336,336,336,336],[420,420,420,420,420],
                    [462,462,462,462,462],[504,504,504,504,504],
                    [546,546,546,546,546],[588,588,588,588,588],
                    [630,630,630,630,630],[672,672,672,672,672]
                ],
                top: [
                    [352,396,440,484,528],[352,396,440,484,528],
                    [352,396,440,484,528],[352,396,440,484,528],
                    [352,396,440,484,528],[352,396,440,484,528],
                    [352,396,440,484,528],[352,396,440,484,528],
                    [352,396,440,484,528],[352,396,440,484,528],
                    [352,396,440,484,528],[352,396,440,484,528],
                    [352,396,440,484,528],[352,396,440,484,528],
                    [352,396,440,484,528],[352,396,440,484,528]
                ]
            }
        },
        width: 42,//42N
        height: 44,//44N
        frame: {
            moving: 8,
            dock: 1,
            attack: 5
        },
        //Only for moving status, override
        speed:10,
        HP: 80,
        SP: 80,
        damage: 16,
        armor:1,
        plasma:0,
        sight:245,
        meleeAttack: true,
        attackInterval: 2200,
        dieEffect:Burst.SmallProtossDeath,
        isFlying:false,
        attackLimit:"ground",
        unitType:Unit.SMALL,
        attackType:AttackableUnit.NORMAL_ATTACK,
        recover:Building.ProtossBuilding.prototype.recover,
        cost:{
            mine:100,
            man:2,
            time:400
        },
        upgrade:['UpgradeGroundWeapons','UpgradeGroundArmor','UpgradePlasmaShields']
    }
});
Protoss.Dragoon=AttackableUnit.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Dragoon",
        imgPos: {
            moving: {
                left: [
                    [15,111,207,303,399,495,591,687],[15,111,207,303,399,495,591,687],
                    [15,111,207,303,399,495,591,687],[15,111,207,303,399,495,591,687],
                    [15,111,207,303,399,495,591,687],[15,111,207,303,399,495,591,687],
                    [15,111,207,303,399,495,591,687],[15,111,207,303,399,495,591,687],
                    [15,111,207,303,399,495,591,687],[687,591,495,399,303,207,111,15],
                    [687,591,495,399,303,207,111,15],[687,591,495,399,303,207,111,15],
                    [687,591,495,399,303,207,111,15],[687,591,495,399,303,207,111,15],
                    [687,591,495,399,303,207,111,15],[687,591,495,399,303,207,111,15]
                ],
                top: [
                    [111,111,111,111,111,111,111,111],[111,111,111,111,111,111,111,111],
                    [207,207,207,207,207,207,207,207],[207,207,207,207,207,207,207,207],
                    [207,207,207,207,207,207,207,207],[207,207,207,207,207,207,207,207],
                    [207,207,207,207,207,207,207,207],[399,399,399,399,399,399,399,399],
                    [399,399,399,399,399,399,399,399],[399,399,399,399,399,399,399,399],
                    [303,303,303,303,303,303,303,303],[303,303,303,303,303,303,303,303],
                    [303,303,303,303,303,303,303,303],[303,303,303,303,303,303,303,303],
                    [303,303,303,303,303,303,303,303],[111,111,111,111,111,111,111,111]
                ]
            },
            dock: {
                left: [
                    [15,111,207,303,399,495,591,687],[15,111,207,303,399,495,591,687],
                    [15,111,207,303,399,495,591,687],[15,111,207,303,399,495,591,687],
                    [15,111,207,303,399,495,591,687],[15,111,207,303,399,495,591,687],
                    [15,111,207,303,399,495,591,687],[15,111,207,303,399,495,591,687],
                    [15,111,207,303,399,495,591,687],[15,111,207,303,399,495,591,687],
                    [15,111,207,303,399,495,591,687],[15,111,207,303,399,495,591,687],
                    [15,111,207,303,399,495,591,687],[15,111,207,303,399,495,591,687],
                    [15,111,207,303,399,495,591,687],[15,111,207,303,399,495,591,687]
                ],
                top: [
                    [15,15,15,15,15,15,15,15],[15,15,15,15,15,15,15,15],
                    [15,15,15,15,15,15,15,15],[15,15,15,15,15,15,15,15],
                    [15,15,15,15,15,15,15,15],[15,15,15,15,15,15,15,15],
                    [15,15,15,15,15,15,15,15],[15,15,15,15,15,15,15,15],
                    [15,15,15,15,15,15,15,15],[15,15,15,15,15,15,15,15],
                    [15,15,15,15,15,15,15,15],[15,15,15,15,15,15,15,15],
                    [15,15,15,15,15,15,15,15],[15,15,15,15,15,15,15,15],
                    [15,15,15,15,15,15,15,15],[15,15,15,15,15,15,15,15]
                ]
            },
            attack: {
                left: [
                    [15,111,207,303,399,495,591,687,495,495,495,495],[15,111,207,303,399,495,591,687,495,495,495,495],
                    [15,111,207,303,399,495,591,687,495,495,495,495],[15,111,207,303,399,495,591,687,495,495,495,495],
                    [15,111,207,303,399,495,591,687,495,495,495,495],[15,111,207,303,399,495,591,687,495,495,495,495],
                    [15,111,207,303,399,495,591,687,495,495,495,495],[15,111,207,303,399,495,591,687,495,495,495,495],
                    [15,111,207,303,399,495,591,687,495,495,495,495],[15,111,207,303,399,495,591,687,495,495,495,495],
                    [15,111,207,303,399,495,591,687,495,495,495,495],[15,111,207,303,399,495,591,687,495,495,495,495],
                    [15,111,207,303,399,495,591,687,495,495,495,495],[15,111,207,303,399,495,591,687,495,495,495,495],
                    [15,111,207,303,399,495,591,687,495,495,495,495],[15,111,207,303,399,495,591,687,495,495,495,495]
                ],
                top: [
                    [495,495,495,495,495,495,495,495,495,495,495,495],[495,495,495,495,495,495,495,495,495,495,495,495],
                    [495,495,495,495,495,495,495,495,495,495,495,495],[495,495,495,495,495,495,495,495,495,495,495,495],
                    [495,495,495,495,495,495,495,495,495,495,495,495],[495,495,495,495,495,495,495,495,495,495,495,495],
                    [495,495,495,495,495,495,495,495,495,495,495,495],[495,495,495,495,495,495,495,495,495,495,495,495],
                    [495,495,495,495,495,495,495,495,495,495,495,495],[495,495,495,495,495,495,495,495,495,495,495,495],
                    [495,495,495,495,495,495,495,495,495,495,495,495],[495,495,495,495,495,495,495,495,495,495,495,495],
                    [495,495,495,495,495,495,495,495,495,495,495,495],[495,495,495,495,495,495,495,495,495,495,495,495],
                    [495,495,495,495,495,495,495,495,495,495,495,495],[495,495,495,495,495,495,495,495,495,495,495,495]
                ]
            }
        },
        width: 66,//96N+15
        height: 66,//96N+15
        frame: {
            moving: 8,
            dock: 8,
            attack: 12
        },
        //Only for moving status, override
        speed:12,
        HP: 100,
        SP: 80,
        damage: 20,
        armor:1,
        plasma:0,
        sight:280,
        attackRange: 140,
        attackInterval: 3000,
        fireDelay:800,
        dieEffect:Burst.DragoonDeath,
        isFlying:false,
        unitType:Unit.BIG,
        attackType:AttackableUnit.BURST_ATTACK,
        recover:Building.ProtossBuilding.prototype.recover,
        cost:{
            mine:125,
            gas:50,
            man:2,
            time:500
        },
        upgrade:['UpgradeGroundWeapons','UpgradeGroundArmor','UpgradePlasmaShields']
    }
});
Protoss.Templar=AttackableUnit.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Templar",
        imgPos: {
            moving: {
                left: [
                    [30,30,30,30],[158,158,158,158],
                    [286,286,286,286],[414,414,414,414],
                    [542,542,542,542],[670,670,670,670],
                    [798,798,798,798],[926,926,926,926],
                    [1054,1054,1054,1054],[1310,1310,1310,1310],
                    [1438,1438,1438,1438],[1566,1566,1566,1566],
                    [1694,1694,1694,1694],[1822,1822,1822,1822],
                    [1950,1950,1950,1950],[2078,2078,2078,2078]
                ],
                top: [
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670],
                    [1694,1822,1950,670],[1694,1822,1950,670]
                ]
            },
            dock: {
                left: [
                    [30,30,30,30,30,30,30],[158,158,158,158,158,158,158],
                    [286,286,286,286,286,286,286],[414,414,414,414,414,414,414],
                    [542,542,542,542,542,542,542],[670,670,670,670,670,670,670],
                    [798,798,798,798,798,798,798],[926,926,926,926,926,926,926],
                    [1054,1054,1054,1054,1054,1054,1054],[1310,1310,1310,1310,1310,1310,1310],
                    [1438,1438,1438,1438,1438,1438,1438],[1566,1566,1566,1566,1566,1566,1566],
                    [1694,1694,1694,1694,1694,1694,1694],[1822,1822,1822,1822,1822,1822,1822],
                    [1950,1950,1950,1950,1950,1950,1950],[2078,2078,2078,2078,2078,2078,2078]
                ],
                top: [
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566],
                    [798,926,1054,1182,1310,1438,1566],[798,926,1054,1182,1310,1438,1566]
                ]
            },
            attack: {
                left: [
                    [30,30,30,30,30],[158,158,158,158,158],
                    [286,286,286,286,286],[414,414,414,414,414],
                    [542,542,542,542,542],[670,670,670,670,670],
                    [798,798,798,798,798],[926,926,926,926,926],
                    [1054,1054,1054,1054,1054],[1310,1310,1310,1310,1310],
                    [1438,1438,1438,1438,1438],[1566,1566,1566,1566,1566],
                    [1694,1694,1694,1694,1694],[1822,1822,1822,1822,1822],
                    [1950,1950,1950,1950,1950],[2078,2078,2078,2078,2078]
                ],
                top: [
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542],
                    [30,158,286,414,542],[30,158,286,414,542]
                ]
            }
        },
        width: 68,//128N+30
        height: 68,//128N+30
        frame: {
            moving: 4,//3 or 4
            dock: 7,//7 or 8
            attack: 5
        },
        //Only for moving status, override
        speed:8,
        HP: 40,
        SP: 40,
        damage: 10,
        armor:0,
        plasma:0,
        MP: 200,
        sight:245,
        attackRange: 100,
        attackInterval: 2000,
        dieEffect:Burst.TemplarDeath,
        attackEffect:Burst.FireSpark,
        isFlying:false,
        unitType:Unit.SMALL,
        attackType:AttackableUnit.WAVE_ATTACK,
        recover:Building.ProtossBuilding.prototype.recover,
        cost:{
            mine:50,
            gas:150,
            man:2,
            time:500
        },
        upgrade:['UpgradeGroundWeapons','UpgradeGroundArmor','UpgradePlasmaShields'],
        items:{
            '7':{name:'PsionicStorm',condition:function(){
                return Magic.PsionicStorm.enabled
            }},
            '8':{name:'Hallucination',condition:function(){
                return Magic.Hallucination.enabled
            }},
            '9':{name:'Archon'}
        }
    }
});
Protoss.DarkTemplar=AttackableUnit.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "DarkTemplar",
        imgPos: {
            moving: {
                left: [
                    [3,3,3,3,3,3,3,3,3],[60,60,60,60,60,60,60,60,60],
                    [117,117,117,117,117,117,117,117,117],[174,174,174,174,174,174,174,174,174],
                    [231,231,231,231,231,231,231,231,231],[288,288,288,288,288,288,288,288,288],
                    [345,345,345,345,345,345,345,345,345],[402,402,402,402,402,402,402,402,402],
                    [459,459,459,459,459,459,459,459,459],[573,573,573,573,573,573,573,573,573],
                    [630,630,630,630,630,630,630,630,630],[687,687,687,687,687,687,687,687,687],
                    [744,744,744,744,744,744,744,744,744],[801,801,801,801,801,801,801,801,801],
                    [858,858,858,858,858,858,858,858,858],[915,915,915,915,915,915,915,915,915]
                ],
                top: [
                    [0,62,124,186,248,310,372,434,496],[0,62,124,186,248,310,372,434,496],
                    [0,62,124,186,248,310,372,434,496],[0,62,124,186,248,310,372,434,496],
                    [0,62,124,186,248,310,372,434,496],[0,62,124,186,248,310,372,434,496],
                    [0,62,124,186,248,310,372,434,496],[0,62,124,186,248,310,372,434,496],
                    [0,62,124,186,248,310,372,434,496],[0,62,124,186,248,310,372,434,496],
                    [0,62,124,186,248,310,372,434,496],[0,62,124,186,248,310,372,434,496],
                    [0,62,124,186,248,310,372,434,496],[0,62,124,186,248,310,372,434,496],
                    [0,62,124,186,248,310,372,434,496],[0,62,124,186,248,310,372,434,496]
                ]
            },
            dock: {
                left: [3,60,117,174,231,288,345,402,459,573,630,687,744,801,858,915],
                top: [248,248,248,248,248,248,248,248,248,248,248,248,248,248,248,248]
            },
            attack: {
                left: [
                    [3,3,3,3,3,3,3,3,3],[60,60,60,60,60,60,60,60,60],
                    [117,117,117,117,117,117,117,117,117],[174,174,174,174,174,174,174,174,174],
                    [231,231,231,231,231,231,231,231,231],[288,288,288,288,288,288,288,288,288],
                    [345,345,345,345,345,345,345,345,345],[402,402,402,402,402,402,402,402,402],
                    [459,459,459,459,459,459,459,459,459],[573,573,573,573,573,573,573,573,573],
                    [630,630,630,630,630,630,630,630,630],[687,687,687,687,687,687,687,687,687],
                    [744,744,744,744,744,744,744,744,744],[801,801,801,801,801,801,801,801,801],
                    [858,858,858,858,858,858,858,858,858],[915,915,915,915,915,915,915,915,915]
                ],
                top: [
                    [558,620,682,744,806,868,930,992,1054],[558,620,682,744,806,868,930,992,1054],
                    [558,620,682,744,806,868,930,992,1054],[558,620,682,744,806,868,930,992,1054],
                    [558,620,682,744,806,868,930,992,1054],[558,620,682,744,806,868,930,992,1054],
                    [558,620,682,744,806,868,930,992,1054],[558,620,682,744,806,868,930,992,1054],
                    [558,620,682,744,806,868,930,992,1054],[558,620,682,744,806,868,930,992,1054],
                    [558,620,682,744,806,868,930,992,1054],[558,620,682,744,806,868,930,992,1054],
                    [558,620,682,744,806,868,930,992,1054],[558,620,682,744,806,868,930,992,1054],
                    [558,620,682,744,806,868,930,992,1054],[558,620,682,744,806,868,930,992,1054]
                ]
            }
        },
        width: 57,//57N+3
        height: 62,//62N
        frame: {
            moving: 9,
            dock: 1,
            attack: 9
        },
        //Only for moving status, override
        speed:12,
        HP: 80,
        SP: 40,
        damage: 40,
        armor:1,
        plasma:0,
        sight:245,
        meleeAttack: true,
        attackInterval: 3000,
        dieEffect:Burst.SmallProtossDeath,
        isFlying:false,
        isInvisible:true,
        attackLimit:"ground",
        unitType:Unit.SMALL,
        attackType:AttackableUnit.NORMAL_ATTACK,
        recover:Building.ProtossBuilding.prototype.recover,
        cost:{
            mine:125,
            gas:100,
            man:2,
            time:500
        },
        upgrade:['UpgradeGroundWeapons','UpgradeGroundArmor','UpgradePlasmaShields'],
        items:{
            '9':{name:'DarkArchon'}
        }
    }
});
Protoss.Archon=AttackableUnit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        this.direction=6;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Archon",
        imgPos: {
            moving: {
                left: [
                    [2060,2060,2060,2060],[140,140,140,140],
                    [260,260,260,260],[380,380,380,380],
                    [500,500,500,500],[620,620,620,620],
                    [740,740,740,740],[860,860,860,860],
                    [980,980,980,980],[1220,1220,1220,1220],
                    [1340,1340,1340,1340],[1460,1460,1460,1460],
                    [1580,1580,1580,1580],[1700,1700,1700,1700],
                    [1820,1820,1820,1820],[1940,1940,1940,1940]
                ],
                top: [
                    [1220,1340,1460,1580],[1220,1340,1460,1580],
                    [1220,1340,1460,1580],[1220,1340,1460,1580],
                    [1220,1340,1460,1580],[1220,1340,1460,1580],
                    [1220,1340,1460,1580],[1220,1340,1460,1580],
                    [1220,1340,1460,1580],[1220,1340,1460,1580],
                    [1220,1340,1460,1580],[1220,1340,1460,1580],
                    [1220,1340,1460,1580],[1220,1340,1460,1580],
                    [1220,1340,1460,1580],[1220,1340,1460,1580]
                ]
            },
            attack: {
                left: [
                    [2060,2060,2060,2060,2060,2060,2060,2060,2060,2060],[140,140,140,140,140,140,140,140,140,140],
                    [260,260,260,260,260,260,260,260,260,260],[380,380,380,380,380,380,380,380,380,380],
                    [500,500,500,500,500,500,500,500,500,500],[620,620,620,620,620,620,620,620,620,620],
                    [740,740,740,740,740,740,740,740,740,740],[860,860,860,860,860,860,860,860,860,860],
                    [980,980,980,980,980,980,980,980,980,980],[1220,1220,1220,1220,1220,1220,1220,1220,1220,1220],
                    [1340,1340,1340,1340,1340,1340,1340,1340,1340,1340],[1460,1460,1460,1460,1460,1460,1460,1460,1460,1460],
                    [1580,1580,1580,1580,1580,1580,1580,1580,1580,1580],[1700,1700,1700,1700,1700,1700,1700,1700,1700,1700],
                    [1820,1820,1820,1820,1820,1820,1820,1820,1820,1820],[1940,1940,1940,1940,1940,1940,1940,1940,1940,1940]
                ],
                top: [
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100]
                ]
            }
        },
        width: 80,//120N+20
        height: 80,//120N+20
        frame: {
            moving: 4,
            attack: 10
        },
        //Only for moving status, override
        speed:12,
        HP: 10,
        SP: 350,
        damage: 30,
        armor:0,
        plasma:0,
        sight:280,
        attackRange: 70,
        attackInterval: 1000,
        attackEffect:Burst.ArchonBurst,
        dieEffect:Burst.BigBlueExplode,
        isFlying:false,
        unitType:Unit.BIG,
        attackType:AttackableUnit.NORMAL_ATTACK,
        recover:Building.ProtossBuilding.prototype.recover,
        cost:{
            mine:50,
            gas:150,
            man:4,
            time:200
        },
        upgrade:['UpgradeGroundWeapons','UpgradeGroundArmor','UpgradePlasmaShields'],
        AOE:{
            hasEffect:false,
            radius:20
        }
    }
});
Protoss.DarkArchon=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        this.direction=3;
    },
    prototypePlus: {
        //Add basic unit info
        name: "DarkArchon",
        imgPos: {
            moving: {
                left: [
                    [20,20,20,20,20,20,20,20,20,20],[140,140,140,140,140,140,140,140,140,140],
                    [260,260,260,260,260,260,260,260,260,260],[380,380,380,380,380,380,380,380,380,380],
                    [500,500,500,500,500,500,500,500,500,500],[620,620,620,620,620,620,620,620,620,620],
                    [740,740,740,740,740,740,740,740,740,740],[860,860,860,860,860,860,860,860,860,860],
                    [980,980,980,980,980,980,980,980,980,980],[1220,1220,1220,1220,1220,1220,1220,1220,1220,1220],
                    [1340,1340,1340,1340,1340,1340,1340,1340,1340,1340],[1460,1460,1460,1460,1460,1460,1460,1460,1460,1460],
                    [1580,1580,1580,1580,1580,1580,1580,1580,1580,1580],[1700,1700,1700,1700,1700,1700,1700,1700,1700,1700],
                    [1820,1820,1820,1820,1820,1820,1820,1820,1820,1820],[1940,1940,1940,1940,1940,1940,1940,1940,1940,1940]
                ],
                top: [
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100],
                    [20,140,260,380,500,620,740,860,980,1100],[20,140,260,380,500,620,740,860,980,1100]
                ]
            }
        },
        width: 80,//120N+20
        height: 80,//120N+20
        frame: {
            moving: 10
        },
        //Only for moving status, override
        speed:12,
        HP: 25,
        SP: 200,
        armor:1,
        plasma:0,
        MP: 200,
        sight:350,
        dieEffect:Burst.BigBlueExplode,
        isFlying:false,
        unitType:Unit.BIG,
        recover:Building.ProtossBuilding.prototype.recover,
        cost:{
            mine:125,
            gas:100,
            man:4,
            time:200
        },
        upgrade:['UpgradeGroundArmor','UpgradePlasmaShields'],
        items:{
            '7':{name:'Feedback'},
            '8':{name:'MindControl',condition:function(){
                return Magic.MindControl.enabled
            }},
            '9':{name:'MaelStorm',condition:function(){
                return Magic.MaelStorm.enabled
            }}
        }
    }
});
Protoss.Shuttle=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        //Transport
        this.loadedUnits=[];
    },
    prototypePlus: {
        //Add basic unit info
        name: "Shuttle",
        imgPos: {
            moving: {
                left: [5,65,125,185,245,305,365,425,485,65,125,185,245,305,365,425],
                top: [5,5,5,5,5,5,5,5,5,65,65,65,65,65,65,65]
            }
        },
        width: 50,//60N+5
        height: 50,//60N+5
        frame: {
            moving: 1
        },
        //Only for moving status, override
        speed:11,
        HP: 80,
        SP: 60,
        armor:1,
        plasma:0,
        sight:280,
        dieEffect:Burst.MiddleBlueExplode,
        isFlying:true,
        unitType:Unit.BIG,
        recover:Building.ProtossBuilding.prototype.recover,
        cost:{
            mine:200,
            man:2,
            time:600
        },
        upgrade:['UpgradeAirArmor','UpgradePlasmaShields'],
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
Protoss.Reaver=AttackableUnit.extends({
    constructorPlus:function(props){
        this.imgPos.attack=this.imgPos.dock;
        this.frame.attack=this.frame.dock;
        if (Multiplayer.ON) this.scarabNum=0;
        else this.scarabNum=(props.team!=Game.team)?999:0;
        //Override
        this.isReloaded=function(){
            return this.coolDown && this.scarabNum>0;
        };
    },
    prototypePlus: {
        //Add basic unit info
        name: "Reaver",
        imgPos: {
            moving: {
                left: [
                    [0,0,0,0,0,0,0,0,0],[84,84,84,84,84,84,84,84,84],
                    [168,168,168,168,168,168,168,168,168],[252,252,252,252,252,252,252,252,252],
                    [336,336,336,336,336,336,336,336,336],[420,420,420,420,420,420,420,420,420],
                    [504,504,504,504,504,504,504,504,504],[588,588,588,588,588,588,588,588,588],
                    [672,672,672,672,672,672,672,672,672],[840,840,840,840,840,840,840,840,840],
                    [924,924,924,924,924,924,924,924,924],[1008,1008,1008,1008,1008,1008,1008,1008,1008],
                    [1092,1092,1092,1092,1092,1092,1092,1092,1092],[1176,1176,1176,1176,1176,1176,1176,1176,1176],
                    [1260,1260,1260,1260,1260,1260,1260,1260,1260],[1344,1344,1344,1344,1344,1344,1344,1344,1344]
                ],
                top: [
                    [0,84,168,252,336,420,504,588,672],[0,84,168,252,336,420,504,588,672],
                    [0,84,168,252,336,420,504,588,672],[0,84,168,252,336,420,504,588,672],
                    [0,84,168,252,336,420,504,588,672],[0,84,168,252,336,420,504,588,672],
                    [0,84,168,252,336,420,504,588,672],[0,84,168,252,336,420,504,588,672],
                    [0,84,168,252,336,420,504,588,672],[0,84,168,252,336,420,504,588,672],
                    [0,84,168,252,336,420,504,588,672],[0,84,168,252,336,420,504,588,672],
                    [0,84,168,252,336,420,504,588,672],[0,84,168,252,336,420,504,588,672],
                    [0,84,168,252,336,420,504,588,672],[0,84,168,252,336,420,504,588,672]
                ]
            },
            dock: {
                left: [0,84,168,252,336,420,504,588,672,840,924,1008,1092,1176,1260,1344],
                top: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            }
        },
        width: 84,//84N
        height: 84,//84N
        frame: {
            moving: 9,
            dock: 1
        },
        //Only for moving status, override
        speed:4,
        HP: 100,
        SP: 80,
        damage: 100,
        armor:0,
        plasma:0,
        sight:350,
        attackRange: 280,
        attackInterval: 6000,
        dieEffect:Burst.BigBlueExplode,
        isFlying:false,
        attackLimit:"ground",
        unitType:Unit.BIG,
        attackType:AttackableUnit.NORMAL_ATTACK,
        recover:Building.ProtossBuilding.prototype.recover,
        scarabCapacity:5,
        cost:{
            mine:200,
            gas:100,
            man:4,
            time:700
        },
        upgrade:['UpgradeGroundArmor','UpgradePlasmaShields'],
        items:{
            '7':{name:'Scarab',condition:function(){
                if (!Game.selectedUnit.scarabNum) $('button.attack').attr('disabled',true);
                else $('button.attack').removeAttr('disabled');
                return Game.selectedUnit.scarabNum<Game.selectedUnit.get('scarabCapacity');
            }}
        },
        AOE:{
            hasEffect:false,
            radius:80
        }
    }
});
Protoss.Observer=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Observer",
        imgPos: {
            moving: {
                left: [0,40,80,120,160,200,240,280,320,40,80,120,160,200,240,280],
                top: [0,0,0,0,0,0,0,0,0,40,40,40,40,40,40,40]
            }
        },
        width: 40,//40N
        height: 40,//40N
        frame: {
            moving: 1
        },
        //Only for moving status, override
        speed:8,
        HP: 40,
        SP: 20,
        armor:0,
        plasma:0,
        sight:315,
        dieEffect:Burst.SmallBlueExplode,
        isFlying:true,
        isInvisible:true,
        unitType:Unit.SMALL,
        recover:Building.ProtossBuilding.prototype.recover,
        detector:Gobj.detectorBuffer,
        cost:{
            mine:25,
            gas:75,
            man:1,
            time:400
        },
        upgrade:['UpgradeAirArmor','UpgradePlasmaShields'],
        //Override
        dock:function(){
            //Use the same behavior
            Unit.hover.call(this);
        }
    }
});
Protoss.Scout=AttackableUnit.extends({
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
        name: "Scout",
        imgPos: {
            moving: {
                left: [8,80,152,224,296,368,440,512,584,80,152,224,296,368,440,512],
                top: [8,8,8,8,8,8,8,8,8,152,152,152,152,152,152,152]
            },
            attack: {
                left: [
                    [8,8],[80,80],
                    [152,152],[224,224],
                    [296,296],[368,368],
                    [440,440],[512,512],
                    [584,584],[80,80],
                    [152,152],[224,224],
                    [296,296],[368,368],
                    [440,440],[512,512]
                ],
                top: [
                    [8,80],[8,80],
                    [8,80],[8,80],
                    [8,80],[8,80],
                    [8,80],[8,80],
                    [8,80],[152,224],
                    [152,224],[152,224],
                    [152,224],[152,224],
                    [152,224],[152,224]
                ]
            }
        },
        width: 56,//72N+8
        height: 56,//72N+8
        frame: {
            moving: 1,
            attack: 2
        },
        //Only for moving status, override
        speed:12,
        HP: 150,
        SP: 100,
        attackMode:{
            flying:{
                attackRange:210,
                attackInterval: 2200,
                damage:28,
                attackType:AttackableUnit.BURST_ATTACK
            },
            ground:{
                attackRange:105,
                attackEffect:Burst.BlueShootSpark,
                attackInterval: 2200,
                damage:8,
                attackType:AttackableUnit.NORMAL_ATTACK
            },
            status:false
        },
        //Default
        damage: 8,
        armor:0,
        plasma:0,
        sight:280,
        attackRange: 105,
        dieEffect:Burst.MiddleBlueExplode,
        isFlying:true,
        unitType:Unit.BIG,
        recover:Building.ProtossBuilding.prototype.recover,
        cost:{
            mine:300,
            gas:150,
            man:3,
            time:800
        },
        upgrade:['UpgradeAirWeapons','UpgradeAirArmor','UpgradePlasmaShields'],
        //Override
        dock:function(){
            //Use the same behavior
            AttackableUnit.hover.call(this);
        }
    }
});
Protoss.Carrier=AttackableUnit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.attack=this.imgPos.dock=this.imgPos.moving;
        this.frame.attack=this.frame.dock=this.frame.moving;
        //Override
        this.continuousAttack={
            count:(Multiplayer.ON)?0:((props.team!=Game.team)?(this.get('interceptorCapacity')):0),
            layout:this.continuousAttack.layout
        };
        this.isReloaded=function(){
            return this.coolDown && this.continuousAttack.count>0;
        };
    },
    prototypePlus: {
        //Add basic unit info
        name: "Carrier",
        imgPos: {
            moving: {
                left: [0,256,512,768,1024,1408,1664,1920,0,256,512,768,1024,1408,1664,1920],
                top: [0,0,0,0,0,0,0,0,128,128,128,128,128,128,128,128]
            }
        },
        width: 128,//128N(0,2,4,6,8,11,13,15)
        height: 128,//128N
        frame: {
            moving: 1
        },
        //Only for moving status, override
        speed:8,
        HP: 300,
        SP: 150,
        damage: 6,
        armor:4,
        plasma:0,
        sight:385,
        attackRange: 280,
        attackInterval: 1000,
        recover:Building.ProtossBuilding.prototype.recover,
        interceptorCapacity:4,
        continuousAttack:{
            count:4,//8
            layout:function(bullet,num){
                //Reassign location, surround target
                var centerX=bullet.target.posX();
                var centerY=bullet.target.posY();
                var radius=120;
                switch (num){
                    //Left
                    case 0:
                        bullet.x=centerX-radius-bullet.width/2;
                        bullet.y=centerY-bullet.height/2;
                        bullet.speed={x:radius/4,y:0};
                        bullet.angle=0;
                        break;
                    //Right
                    case 1:
                        bullet.x=centerX+radius-bullet.width/2;
                        bullet.y=centerY-bullet.height/2;
                        bullet.speed={x:-radius/4,y:0};
                        bullet.angle=Math.PI;
                        break;
                    //Top
                    case 2:
                        bullet.x=centerX-bullet.width/2;
                        bullet.y=centerY-radius-bullet.height/2;
                        bullet.speed={x:0,y:radius/4};
                        bullet.angle=-Math.PI/2;
                        break;
                    //Bottom
                    case 3:
                        bullet.x=centerX-bullet.width/2;
                        bullet.y=centerY+radius-bullet.height/2;
                        bullet.speed={x:0,y:-radius/4};
                        bullet.angle=Math.PI/2;
                        break;
                    //Top-left
                    case 4:
                        bullet.x=centerX-radius*0.7-bullet.width/2;
                        bullet.y=centerY-radius*0.7-bullet.height/2;
                        bullet.speed={x:0.7*radius/4,y:0.7*radius/4};
                        bullet.angle=-Math.PI/4;
                        break;
                    //Top-right
                    case 5:
                        bullet.x=centerX+radius*0.7-bullet.width/2;
                        bullet.y=centerY-radius*0.7-bullet.height/2;
                        bullet.speed={x:-0.7*radius/4,y:0.7*radius/4};
                        bullet.angle=-Math.PI*3/4;
                        break;
                    //Bottom-left
                    case 6:
                        bullet.x=centerX-radius*0.7-bullet.width/2;
                        bullet.y=centerY+radius*0.7-bullet.height/2;
                        bullet.speed={x:0.7*radius/4,y:-0.7*radius/4};
                        bullet.angle=Math.PI/4;
                        break;
                    //Bottom-right
                    case 7:
                        bullet.x=centerX+radius*0.7-bullet.width/2;
                        bullet.y=centerY+radius*0.7-bullet.height/2;
                        bullet.speed={x:-0.7*radius/4,y:-0.7*radius/4};
                        bullet.angle=Math.PI*3/4;
                        break;
                }
            }
        },
        dieEffect:Burst.BigBlueExplode,
        isFlying:true,
        unitType:Unit.BIG,
        attackType:AttackableUnit.NORMAL_ATTACK,
        cost:{
            mine:350,
            gas:250,
            man:8,
            time:1400
        },
        upgrade:['UpgradeAirWeapons','UpgradeAirArmor','UpgradePlasmaShields'],
        items:{
            '7':{name:'Interceptor',condition:function(){
                if (!Game.selectedUnit.continuousAttack.count) $('button.attack').attr('disabled',true);
                else $('button.attack').removeAttr('disabled');
                return Game.selectedUnit.continuousAttack.count<Game.selectedUnit.get('interceptorCapacity');
            }}
        },
        //Override
        dock:function(){
            //Use the same behavior
            AttackableUnit.hover.call(this);
        }
    }
});
Protoss.Arbiter=AttackableUnit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Arbiter",
        imgPos: {
            moving: {
                left: [0,76,152,228,304,380,456,532,608,76,152,228,304,380,456,532],
                top: [0,0,0,0,0,0,0,0,0,76,76,76,76,76,76,76]
            }
        },
        width: 76,//76N
        height: 76,//76N
        frame: {
            moving: 1
        },
        //Only for moving status, override
        speed:12,
        HP: 200,
        SP: 150,
        damage: 10,
        armor:1,
        plasma:0,
        MP: 200,
        sight:315,
        attackRange: 175,
        attackInterval: 4500,
        dieEffect:Burst.MiddleBlueExplode,
        isFlying:true,
        unitType:Unit.BIG,
        attackType:AttackableUnit.BURST_ATTACK,
        recover:Building.ProtossBuilding.prototype.recover,
        cost:{
            mine:100,
            gas:350,
            man:4,
            time:1600
        },
        upgrade:['UpgradeAirWeapons','UpgradeAirArmor','UpgradePlasmaShields'],
        items:{
            '7':{name:'Recall',condition:function(){
                return Magic.Recall.enabled
            }},
            '8':{name:'StasisField',condition:function(){
                return Magic.StasisField.enabled
            }}
        },
        //Special skill: make nearby units invisible, need initial
        bufferObj:{},
        //Override
        dock:function(){
            //Use the same behavior
            AttackableUnit.hover.call(this);
        }
    }
});
Protoss.Corsair=AttackableUnit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Corsair",
        imgPos: {
            moving: {
                left: [0,60,120,180,240,300,360,420,480,600,660,720,780,840,900,960],
                top: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            },
            attack: {
                left: [
                    [0,0,0,0,0],[60,60,60,60,60],
                    [120,120,120,120,120],[180,180,180,180,180],
                    [240,240,240,240,240],[300,300,300,300,300],
                    [360,360,360,360,360],[420,420,420,420,420],
                    [480,480,480,480,480],[600,600,600,600,600],
                    [660,660,660,660,660],[720,720,720,720,720],
                    [780,780,780,780,780],[840,840,840,840,840],
                    [900,900,900,900,900],[960,960,960,960,960]
                ],
                top: [
                    [0,60,120,180,240],[0,60,120,180,240],
                    [0,60,120,180,240],[0,60,120,180,240],
                    [0,60,120,180,240],[0,60,120,180,240],
                    [0,60,120,180,240],[0,60,120,180,240],
                    [0,60,120,180,240],[0,60,120,180,240],
                    [0,60,120,180,240],[0,60,120,180,240],
                    [0,60,120,180,240],[0,60,120,180,240],
                    [0,60,120,180,240],[0,60,120,180,240]
                ]
            }
        },
        width: 60,//60N
        height: 60,//60N
        frame: {
            moving: 1,
            attack: 5
        },
        //Only for moving status, override
        speed:16,
        HP: 100,
        SP: 80,
        damage: 5,
        armor:1,
        plasma:0,
        MP: 200,
        sight:315,
        attackRange: 175,
        attackInterval: 800,
        dieEffect:Burst.MiddleBlueExplode,
        attackEffect:Burst.CorsairCloud,
        isFlying:true,
        attackLimit:"flying",
        unitType:Unit.MIDDLE,
        attackType:AttackableUnit.BURST_ATTACK,
        recover:Building.ProtossBuilding.prototype.recover,
        cost:{
            mine:150,
            gas:100,
            man:2,
            time:400
        },
        upgrade:['UpgradeAirWeapons','UpgradeAirArmor','UpgradePlasmaShields'],
        items:{
            '7':{name:'DisruptionWeb',condition:function(){
                return Magic.DisruptionWeb.enabled
            }}
        },
        AOE:{
            hasEffect:true,
            radius:100
        },
        //Override
        dock:function(){
            //Use the same behavior
            AttackableUnit.hover.call(this);
        }
    }
});