/******* Define Terran units *******/
var Terran={};
Terran.SCV=class SCV extends AttackableUnit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    };
    buildTerranBuilding(location){
        //Has location callback info or nothing
        if (location){
            //Move toward target to fire Ensnare
            this.targetLock=true;
            const myself=this;
            this.moveTo(location.x,location.y,40,function(){
                if (Resource.payCreditBill.call(myself)){
                    let target=Building.TerranBuilding[myself.buildName];
                    let construction=new (eval('Building.'+target.prototype.evolves[0].step))
                    ({x:location.x-target.prototype.width/2,y:location.y-target.prototype.height/2,team:myself.team});
                    construction.buildName=myself.buildName;
                    //Calculate duration
                    let duration=Resource.getCost(myself.buildName).time;
                    //Cheat: Operation cwal
                    if (Cheat.cwal) duration=40;
                    //Processing flag on transfer
                    construction.processing={
                        name:construction.buildName,
                        startTime:Game.mainTick,//new Date().getTime()
                        time:duration
                    };
                    //Evolve chain
                    for (let N=1;N<target.prototype.evolves.length;N++){
                        let evolveInfo=target.prototype.evolves[N];
                        Game.commandTimeout(function(){
                            if (construction.status!='dead'){
                                //Evolve
                                let evolveTarget=(eval(`Building.${evolveInfo.step}`));
                                //Step is constructor function
                                if (evolveTarget){
                                    let old=construction;
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
        //If missing location info, mark Button.callback, MouseController will call back with location
        else {
            Button.callback=arguments.callee;
            Button.callback.farmer=this;
            Button.callback.buildType='TerranBuilding';
            $('div.GameLayer').attr('status','button');
        }
    }
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "SCV",
            imgPos: {
                moving: {
                    left: [2, 54, 107, 154, 202, 252, 296, 344],
                    top: [1, 1, 1, 1, 1, 1, 1, 1]
                },
                attack: {
                    left: [[2,2,2,2,2], [54,54,54,54,54], [107,107,107,107,107], [154,154,154,154,154],
                        [202,202,202,202,202], [252,252,252,252,252], [296,296,296,296,296], [344,344,344,344,344]],
                    top: [[55,55,105,105,105], [55,55,105,105,105], [55,55,105,105,105], [55,55,105,105,105],
                        [55,55,105,105,105], [55,55,105,105,105], [55,55,105,105,105], [55,55,105,105,105]]
                }
            },
            width: 40,
            height: 44,
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
            }
        }
    };
};
Terran.Marine=class Marine extends AttackableUnit{
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.turnAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Marine",
            imgPos: {
                moving: {
                    left: [
                        [10, 10, 10, 10, 10, 10, 10, 10, 10],
                        [138, 138, 138, 138, 138, 138, 138, 138, 138],
                        [266, 266, 266, 266, 266, 266, 266, 266, 266],
                        [394, 394, 394, 394, 394, 394, 394, 394, 394],
                        [522, 522, 522, 522, 522, 522, 522, 522, 522],
                        [714, 714, 714, 714, 714, 714, 714, 714, 714],
                        [842, 842, 842, 842, 842, 842, 842, 842, 842],
                        [970, 970, 970, 970, 970, 970, 970, 970, 970]
                    ],
                    top: [
                        [266, 330, 394, 458, 522, 586, 650, 714, 778],
                        [266, 330, 394, 458, 522, 586, 650, 714, 778],
                        [266, 330, 394, 458, 522, 586, 650, 714, 778],
                        [266, 330, 394, 458, 522, 586, 650, 714, 778],
                        [266, 330, 394, 458, 522, 586, 650, 714, 778],
                        [266, 330, 394, 458, 522, 586, 650, 714, 778],
                        [266, 330, 394, 458, 522, 586, 650, 714, 778],
                        [266, 330, 394, 458, 522, 586, 650, 714, 778]
                    ]
                },
                attack: {
                    left: [
                        [10, 10, 10, 10, 10, 10, 10],
                        [138, 138, 138, 138, 138, 138, 138],
                        [266, 266, 266, 266, 266, 266, 266],
                        [394, 394, 394, 394, 394, 394, 394],
                        [522, 522, 522, 522, 522, 522, 522],
                        [714, 714, 714, 714, 714, 714, 714],
                        [842, 842, 842, 842, 842, 842, 842],
                        [970, 970, 970, 970, 970, 970, 970]
                    ],
                    top: [
                        [74, 138, 202, 138, 202, 138, 202],
                        [74, 138, 202, 138, 202, 138, 202],
                        [74, 138, 202, 138, 202, 138, 202],
                        [74, 138, 202, 138, 202, 138, 202],
                        [74, 138, 202, 138, 202, 138, 202],
                        [74, 138, 202, 138, 202, 138, 202],
                        [74, 138, 202, 138, 202, 138, 202],
                        [74, 138, 202, 138, 202, 138, 202]
                    ]
                },
                dock: {
                    left: [10, 138, 266, 394, 522, 714, 842, 970],
                    top: [10, 10, 10, 10, 10, 10, 10, 10]
                }
            },
            width: 44,//64N-54
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
            }
        }
    };
};
Terran.Firebat=class Firebat extends AttackableUnit{
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.turnAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Firebat",
            imgPos: {
                moving: {
                    left: [
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        [64, 64, 64, 64, 64, 64, 64, 64],
                        [128, 128, 128, 128, 128, 128, 128, 128],
                        [192, 192, 192, 192, 192, 192, 192, 192],
                        [256, 256, 256, 256, 256, 256, 256, 256],
                        [352, 352, 352, 352, 352, 352, 352, 352],
                        [416, 416, 416, 416, 416, 416, 416, 416],
                        [480, 480, 480, 480, 480, 480, 480, 480]
                    ],
                    top: [
                        [64, 96, 128, 160, 192, 224, 256, 288],
                        [64, 96, 128, 160, 192, 224, 256, 288],
                        [64, 96, 128, 160, 192, 224, 256, 288],
                        [64, 96, 128, 160, 192, 224, 256, 288],
                        [64, 96, 128, 160, 192, 224, 256, 288],
                        [64, 96, 128, 160, 192, 224, 256, 288],
                        [64, 96, 128, 160, 192, 224, 256, 288],
                        [64, 96, 128, 160, 192, 224, 256, 288]
                    ]
                },
                dock: {
                    left: [0, 64, 128, 192, 256, 352, 416, 480],
                    top: [64, 64, 64, 64, 64, 64, 64, 64]
                },
                attack: {
                    left: [
                        [0, 0, 0, 0, 0, 0],
                        [64, 64, 64, 64, 64, 64],
                        [128, 128, 128, 128, 128, 128],
                        [192, 192, 192, 192, 192, 192],
                        [256, 256, 256, 256, 256, 256],
                        [352, 352, 352, 352, 352, 352],
                        [416, 416, 416, 416, 416, 416],
                        [480, 480, 480, 480, 480, 480]
                    ],
                    top: [
                        [0, 32, 32, 32, 32, 32],
                        [0, 32, 32, 32, 32, 32],
                        [0, 32, 32, 32, 32, 32],
                        [0, 32, 32, 32, 32, 32],
                        [0, 32, 32, 32, 32, 32],
                        [0, 32, 32, 32, 32, 32],
                        [0, 32, 32, 32, 32, 32],
                        [0, 32, 32, 32, 32, 32]
                    ]
                }
            },
            width: 32,//(N-1)
            height: 32,//(N-1)
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
            }
        }
    };
};
Terran.Ghost=class Ghost extends AttackableUnit{
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.turnAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Ghost",
            imgPos: {
                moving: {
                    left: [
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [86, 86, 86, 86, 86, 86, 86, 86, 86],
                        [172, 172, 172, 172, 172, 172, 172, 172, 172],
                        [258, 258, 258, 258, 258, 258, 258, 258, 258],
                        [344, 344, 344, 344, 344, 344, 344, 344, 344],
                        [473, 473, 473, 473, 473, 473, 473, 473, 473],
                        [559, 559, 559, 559, 559, 559, 559, 559, 559],
                        [645, 645, 645, 645, 645, 645, 645, 645, 645]
                    ],
                    top: [
                        [0, 39, 78, 117, 156, 195, 234, 273, 312],
                        [0, 39, 78, 117, 156, 195, 234, 273, 312],
                        [0, 39, 78, 117, 156, 195, 234, 273, 312],
                        [0, 39, 78, 117, 156, 195, 234, 273, 312],
                        [0, 39, 78, 117, 156, 195, 234, 273, 312],
                        [0, 39, 78, 117, 156, 195, 234, 273, 312],
                        [0, 39, 78, 117, 156, 195, 234, 273, 312],
                        [0, 39, 78, 117, 156, 195, 234, 273, 312]
                    ]
                },
                attack: {
                    left: [
                        [0, 0, 0, 0],
                        [86, 86, 86, 86],
                        [172, 172, 172, 172],
                        [258, 258, 258, 258],
                        [344, 344, 344, 344],
                        [473, 473, 473, 473],
                        [559, 559, 559, 559],
                        [645, 645, 645, 645]
                    ],
                    top: [
                        [351, 390, 429, 468],
                        [351, 390, 429, 468],
                        [351, 390, 429, 468],
                        [351, 390, 429, 468],
                        [351, 390, 429, 468],
                        [351, 390, 429, 468],
                        [351, 390, 429, 468],
                        [351, 390, 429, 468]
                    ]
                },
                dock: {
                    left: [0, 86, 172, 258, 344, 473, 559, 645],
                    top: [0, 0, 0, 0, 0, 0, 0, 0]
                }
            },
            width: 43,//(N-1)
            height: 39,//(N-1)
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
            }
        }
    };
};
Terran.Medic=class Medic extends Unit{
    //Override
    dock(){
        //Use the same behavior
        Unit.turnAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Medic",
            imgPos: {
                moving: {
                    left: [
                        [16, 16, 16, 16, 16, 16, 16],
                        [144, 144, 144, 144, 144, 144, 144],
                        [272, 272, 272, 272, 272, 272, 272],
                        [400, 400, 400, 400, 400, 400, 400],
                        [528, 528, 528, 528, 528, 528, 528],
                        [720, 720, 720, 720, 720, 720, 720],
                        [848, 848, 848, 848, 848, 848, 848],
                        [976, 976, 976, 976, 976, 976, 976]
                    ],
                    top: [
                        [400, 464, 528, 592, 656, 720, 784],
                        [400, 464, 528, 592, 656, 720, 784],
                        [400, 464, 528, 592, 656, 720, 784],
                        [400, 464, 528, 592, 656, 720, 784],
                        [400, 464, 528, 592, 656, 720, 784],
                        [400, 464, 528, 592, 656, 720, 784],
                        [400, 464, 528, 592, 656, 720, 784],
                        [400, 464, 528, 592, 656, 720, 784]
                    ]
                },
                dock: {
                    left: [16, 144, 272, 400, 528, 720, 848, 976],
                    top: [400, 400, 400, 400, 400, 400, 400, 400]
                },
                attack: {
                    left: [
                        [16, 16, 16, 16, 16, 16],
                        [144, 144, 144, 144, 144, 144],
                        [272, 272, 272, 272, 272, 272],
                        [400, 400, 400, 400, 400, 400],
                        [528, 528, 528, 528, 528, 528],
                        [720, 720, 720, 720, 720, 720],
                        [848, 848, 848, 848, 848, 848],
                        [976, 976, 976, 976, 976, 976]
                    ],
                    top: [
                        [16, 80, 144, 208, 272, 336],
                        [16, 80, 144, 208, 272, 336],
                        [16, 80, 144, 208, 272, 336],
                        [16, 80, 144, 208, 272, 336],
                        [16, 80, 144, 208, 272, 336],
                        [16, 80, 144, 208, 272, 336],
                        [16, 80, 144, 208, 272, 336],
                        [16, 80, 144, 208, 272, 336]
                    ]
                }
            },
            width: 32,//64N-48
            height: 32,//64N-48
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
            }
        }
    };
};
Terran.Vulture=class Vulture extends AttackableUnit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.attack=this.imgPos.dock=this.imgPos.moving;
        this.frame.attack=this.frame.dock=this.frame.moving;
        this.spiderMines=3;
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Vulture",
            imgPos: {
                moving: {
                    left: [10, 210, 410, 610, 810, 210, 410, 610],
                    top: [10, 10, 10, 10, 10, 110, 110, 110]
                }
            },
            width: 80,//100N-90
            height: 80,//100N-90
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
    };
};
Terran.Tank=class Tank extends AttackableUnit{
    constructor(props){
        super(props);
        this.imgPos.attack=this.imgPos.dock;
        this.frame.attack=this.frame.dock;
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Tank",
            imgPos: {
                moving: {
                    left: [
                        [24, 24, 24],
                        [280, 280, 280],
                        [536, 536, 536],
                        [792, 792, 792],
                        [1048, 1048, 1048],
                        [1432, 1432, 1432],
                        [1688, 1688, 1688],
                        [1944, 1944, 1944]
                    ],
                    top: [
                        [24, 152, 280],
                        [24, 152, 280],
                        [24, 152, 280],
                        [24, 152, 280],
                        [24, 152, 280],
                        [24, 152, 280],
                        [24, 152, 280],
                        [24, 152, 280]
                    ]
                },
                dock: {
                    left: [24, 280, 536, 792, 1048, 1432, 1688, 1944],
                    top: [24, 24, 24, 24, 24, 24, 24, 24]
                }
            },
            width: 80,//128N-104
            height: 80,//128N-104
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
    };
};
Terran.Goliath=class Goliath extends AttackableUnit{
    constructor(props){
        super(props);
        //Bind bgm
        this.sound.attackG=new Audio(`bgm/${this.name}.attack.wav`);
        this.sound.attackF=new Audio(`bgm/${this.name}.attackF.wav`);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Goliath",
            imgPos: {
                moving: {
                    left: [
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [152, 152, 152, 152, 152, 152, 152, 152, 152, 152],
                        [304, 304, 304, 304, 304, 304, 304, 304, 304, 304],
                        [456, 456, 456, 456, 456, 456, 456, 456, 456, 456],
                        [608, 608, 608, 608, 608, 608, 608, 608, 608, 608],
                        [836, 836, 836, 836, 836, 836, 836, 836, 836, 836],
                        [988, 988, 988, 988, 988, 988, 988, 988, 988, 988],
                        [1140, 1140, 1140, 1140, 1140, 1140, 1140, 1140, 1140, 1140]
                    ],
                    top: [
                        [0, 76, 152, 228, 304, 380, 456, 532, 608, 684],
                        [0, 76, 152, 228, 304, 380, 456, 532, 608, 684],
                        [0, 76, 152, 228, 304, 380, 456, 532, 608, 684],
                        [0, 76, 152, 228, 304, 380, 456, 532, 608, 684],
                        [0, 76, 152, 228, 304, 380, 456, 532, 608, 684],
                        [0, 76, 152, 228, 304, 380, 456, 532, 608, 684],
                        [0, 76, 152, 228, 304, 380, 456, 532, 608, 684],
                        [0, 76, 152, 228, 304, 380, 456, 532, 608, 684]
                    ]
                },
                attack: {
                    left: [
                        [0, 0],
                        [152, 152],
                        [304, 304],
                        [456, 456],
                        [608, 608],
                        [836, 836],
                        [988, 988],
                        [1140, 1140]
                    ],
                    top: [
                        [684, 760],
                        [684, 760],
                        [684, 760],
                        [684, 760],
                        [684, 760],
                        [684, 760],
                        [684, 760],
                        [684, 760]
                    ]
                },
                dock: {
                    left: [0, 152, 304, 456, 608, 836, 988, 1140],
                    top: [228, 228, 228, 228, 228, 228, 228, 228]
                }
            },
            width: 76,//N-1
            height: 76,//N-1
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
    };
};
Terran.Wraith=class Wraith extends AttackableUnit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        //Bind bgm
        this.sound.attackG=new Audio(`bgm/${this.name}.attack.wav`);
        this.sound.attackF=new Audio(`bgm/${this.name}.attackF.wav`);
    };
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.hover.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Wraith",
            imgPos: {
                moving: {
                    left: [5, 167, 112, 59, 5, 167, 112, 59],
                    top: [43, 3, 3, 3, 3, 41, 41, 41]
                }
            },
            width: 50,
            height: 41,
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
            }
        }
    };
};
Terran.Dropship=class Dropship extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        //Transport
        this.loadedUnits=[];
    };
    //Override
    dock(){
        //Use the same behavior
        Unit.hover.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Dropship",
            imgPos: {
                moving: {
                    left: [0, 60, 120, 180, 240, 60, 120, 180],
                    top: [0, 0, 0, 0, 0, 60, 60, 60]
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
            die:Zerg.Overlord.prototype.die
        }
    };
};
Terran.Vessel=class Vessel extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Vessel",
            imgPos: {
                moving: {
                    left: [14, 14, 14, 14, 14, 14, 14, 14],
                    top: [24, 24, 24, 24, 24, 24, 24, 24]
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
    };
};
Terran.BattleCruiser=class BattleCruiser extends AttackableUnit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    };
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.hover.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "BattleCruiser",
            imgPos: {
                moving: {
                    left: [0, 95, 195, 297, 0, 99, 201, 301],
                    top: [81, 81, 81, 81, 0, 0, 0, 0]
                }
            },
            width: 94,
            height: 80,
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
            }
        }
    };
};
Terran.Valkyrie=class Valkyrie extends AttackableUnit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.attack=this.imgPos.dock=this.imgPos.moving;
        this.frame.attack=this.frame.dock=this.frame.moving;
    };
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.hover.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Valkyrie",
            imgPos: {
                moving: {
                    left: [35, 163, 291, 419, 547, 163, 291, 419],
                    top: [35, 35, 35, 35, 35, 163, 163, 163]
                }
            },
            width: 58,//128N-93
            height: 58,//128N-93
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
            upgrade:['UpgradeShipWeapons','UpgradeShipArmors']
        }
    };
};
Terran.Civilian=class Civilian extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
    };
    //Override
    dock(){
        //Use the same behavior
        Unit.turnAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Civilian",
            imgPos: {
                moving: {
                    left: [
                        [11, 11, 11, 11, 11, 11, 11, 11],
                        [60, 60, 60, 60, 60, 60, 60, 60],
                        [108, 108, 108, 108, 108, 108, 108, 108],
                        [154, 154, 154, 154, 154, 154, 154, 154],
                        [200, 200, 200, 200, 200, 200, 200, 200],
                        [248, 248, 248, 248, 248, 248, 248, 248],
                        [293, 293, 293, 293, 293, 293, 293, 293],
                        [342, 342, 342, 342, 342, 342, 342, 342]
                    ],
                    top: [
                        [246, 0, 37, 70, 105, 142, 176, 211],
                        [246, 0, 37, 70, 105, 142, 176, 211],
                        [246, 0, 37, 70, 105, 142, 176, 211],
                        [246, 0, 37, 70, 105, 142, 176, 211],
                        [246, 0, 37, 70, 105, 142, 176, 211],
                        [246, 0, 37, 70, 105, 142, 176, 211],
                        [246, 0, 37, 70, 105, 142, 176, 211],
                        [246, 0, 37, 70, 105, 142, 176, 211]
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
            upgrade:['UpgradeInfantryArmors']
        }
    }
};
//Apply all protoProps
_$.classPackagePatch(Terran);
