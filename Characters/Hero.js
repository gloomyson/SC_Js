/******* Define Hero units *******/
var Hero={};
Hero.HeroCruiser=class HeroCruiser extends AttackableUnit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        //Override
        this.magic=this.get('MP');
    };
    recover(){
        if (this.magic<this.get('MP')) {
            this.magic+=3;
            if (this.magic>this.get('MP')) this.magic=this.get('MP');
        }
    };
    //Override
    dock(){
        //Use the same behavior
        Zerg.Devourer.prototype.dock.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "HeroCruiser",
            imgPos: {
                moving: {
                    left: [10, 250, 490, 730, 10, 250, 490, 730],
                    top: [10, 10, 10, 10, 130, 130, 130, 130]
                }
            },
            width: 100,
            height: 100,
            frame: {
                moving: 1,
                stop: 1
            },
            //Only for moving status, override
            speed:9,
            HP: 1000,
            damage: 50,
            armor:3,
            MP: 500,
            sight:385,
            attackRange: 250,
            attackInterval: 3000,
            dieEffect:Burst.BigExplode,
            isFlying:true,
            unitType:Unit.BIG,
            attackType:AttackableUnit.NORMAL_ATTACK,
            items:{
                '6':{name:'Yamato'},
                '7':{name:'DefensiveMatrix'},
                '8':{name:'EMPShockwave'},
                '9':{name:'Irradiate'}
            },
            cost:{
                man:8
            }
        }
    };
};
Hero.Tassadar=class Tassadar extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        //Override
        this.magic=this.get('MP');
    };
    recover(){
        if (this.life<this.get('HP')) {
            this.life+=3;
            if (this.life>this.get('HP')) this.life=this.get('HP');
        }
        if (this.shield<this.get('SP')) {
            this.shield+=3;
            if (this.shield>this.get('SP')) this.shield=this.get('SP');
        }
        if (this.magic<this.get('MP')) {
            this.magic+=3;
            if (this.magic>this.get('MP')) this.magic=this.get('MP');
        }
    };
    //Override
    dock(){
        //Use the same behavior
        Zerg.Devourer.prototype.dock.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Tassadar",
            imgPos: {
                moving: {
                    left: [0, 190, 380, 570, 0, 190, 380, 570],
                    top: [0, 0, 0, 0, 90, 90, 90, 90]
                }
            },
            width: 95,
            height: 90,
            frame: {
                moving: 1,
                stop: 1
            },
            //Only for moving status, override
            speed:15,
            HP: 999,
            SP: 999,
            armor:3,
            MP: 999,
            sight:385,
            detector: Gobj.detectorBuffer,
            dieEffect:Burst.BigBlueExplode,
            isFlying:true,
            unitType:Unit.BIG,
            attackType:AttackableUnit.NORMAL_ATTACK,
            items:{
                '2':{name:'Ensnare'},
                '3':{name:'Plague'},
                '4':{name:'Lockdown'},
                '5':{name:'EMPShockwave'},
                '6':{name:'Irradiate'},
                '7':{name:'PsionicStorm'},
                '8':{name:'MaelStorm'},
                '9':{name:'StasisField'}
            },
            cost:{
                man:8
            }
        }
    };
};
Hero.Kerrigan=class Kerrigan extends AttackableUnit{
    constructor(props){
        super(props);
        //Override
        this.magic=this.get('MP');
    };
    recover(){
        if (this.magic<this.get('MP')) {
            this.magic+=2;
            if (this.magic>this.get('MP')) this.magic=this.get('MP');
        }
    };
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.turnAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Kerrigan",
            imgPos: {
                moving: {
                    left: [
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [74, 74, 74, 74, 74, 74, 74, 74, 74],
                        [148, 148, 148, 148, 148, 148, 148, 148, 148],
                        [222, 222, 222, 222, 222, 222, 222, 222, 222],
                        [296, 296, 296, 296, 296, 296, 296, 296, 296],
                        [407, 407, 407, 407, 407, 407, 407, 407, 407],
                        [481, 481, 481, 481, 481, 481, 481, 481, 481],
                        [555, 555, 555, 555, 555, 555, 555, 555, 555]
                    ],
                    top: [
                        [0, 43, 86, 129, 172, 215, 258, 301, 344],
                        [0, 43, 86, 129, 172, 215, 258, 301, 344],
                        [0, 43, 86, 129, 172, 215, 258, 301, 344],
                        [0, 43, 86, 129, 172, 215, 258, 301, 344],
                        [0, 43, 86, 129, 172, 215, 258, 301, 344],
                        [0, 43, 86, 129, 172, 215, 258, 301, 344],
                        [0, 43, 86, 129, 172, 215, 258, 301, 344],
                        [0, 43, 86, 129, 172, 215, 258, 301, 344]
                    ]
                },
                attack: {
                    left: [
                        [0, 0, 0, 0],
                        [74, 74, 74, 74],
                        [148, 148, 148, 148],
                        [222, 222, 222, 222],
                        [296, 296, 296, 296],
                        [407, 407, 407, 407],
                        [481, 481, 481, 481],
                        [555, 555, 555, 555]
                    ],
                    top: [
                        [387, 430, 473, 516],
                        [387, 430, 473, 516],
                        [387, 430, 473, 516],
                        [387, 430, 473, 516],
                        [387, 430, 473, 516],
                        [387, 430, 473, 516],
                        [387, 430, 473, 516],
                        [387, 430, 473, 516]
                    ]
                },
                dock: {
                    left: [0, 74, 148, 222, 296, 407, 481, 555],
                    top: [0, 0, 0, 0, 0, 0, 0, 0]
                }
            },
            width: 37,//(N-1)
            height: 43,//(N-1)
            frame: {
                moving: 9,
                dock: 1,
                attack:4
            },
            //Only for moving status, override
            speed:10,
            HP: 300,
            damage: 20,
            armor:1,
            MP: 300,
            sight:315,
            attackRange: 210,
            attackInterval: 2200,
            dieEffect:Burst.HumanDeath,
            attackEffect:Burst.FireSpark,
            isFlying:false,
            unitType:Unit.SMALL,
            attackType:AttackableUnit.WAVE_ATTACK,
            cost:{
                man:1
            },
            items:{
                '6':{name:'StimPacks'},
                '7':{name:'Cloak'},
                '8':{name:'Lockdown'}
            }
        }
    };
};
Hero.Sarah=class Sarah extends AttackableUnit{
    constructor(props){
        super(props);
        //Override
        this.magic=this.get('MP');
    };
    recover(){
        if (this.life<this.get('HP')) {
            this.life+=3;
            if (this.life>this.get('HP')) this.life=this.get('HP');
        }
        if (this.shield<this.get('SP')) {
            this.shield+=3;
            if (this.shield>this.get('SP')) this.shield=this.get('SP');
        }
        if (this.magic<this.get('MP')) {
            this.magic+=3;
            if (this.magic>this.get('MP')) this.magic=this.get('MP');
        }
    };
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.turnAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "Sarah",
            imgPos: {
                moving: {
                    left: [
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        [124, 124, 124, 124, 124, 124, 124, 124],
                        [248, 248, 248, 248, 248, 248, 248, 248],
                        [372, 372, 372, 372, 372, 372, 372, 372],
                        [496, 496, 496, 496, 496, 496, 496, 496],
                        [682, 682, 682, 682, 682, 682, 682, 682],
                        [806, 806, 806, 806, 806, 806, 806, 806],
                        [930, 930, 930, 930, 930, 930, 930, 930]
                    ],
                    top: [
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406]
                    ]
                },
                attack: {
                    left: [
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        [124, 124, 124, 124, 124, 124, 124, 124],
                        [248, 248, 248, 248, 248, 248, 248, 248],
                        [372, 372, 372, 372, 372, 372, 372, 372],
                        [496, 496, 496, 496, 496, 496, 496, 496],
                        [682, 682, 682, 682, 682, 682, 682, 682],
                        [806, 806, 806, 806, 806, 806, 806, 806],
                        [930, 930, 930, 930, 930, 930, 930, 930]
                    ],
                    top: [
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870]
                    ]
                },
                dock: {
                    left: [0, 124, 248, 372, 496, 682, 806, 930],
                    top: [0, 0, 0, 0, 0, 0, 0, 0]
                }
            },
            width: 62,//(N-1)
            height: 58,//(N-1)
            frame: {
                moving: 8,
                dock: 1,
                attack: 8
            },
            //Only for moving status, override
            speed:10,
            HP: 500,
            SP: 500,
            damage: 40,
            armor:2,
            plasma:0,
            MP: 500,
            sight:315,
            attackRange: 70,
            attackInterval: 2000,
            dieEffect:Burst.HumanDeath,
            attackEffect:Burst.FireSpark,
            isFlying:false,
            unitType:Unit.SMALL,
            attackType:AttackableUnit.NORMAL_ATTACK,
            cost:{
                man:2
            },
            items:{
                '6':{name:'Cloak'},
                '7':{name:'PsionicStorm'},
                '8':{name:'Plague'},
                '9':{name:'Ensnare'}
            }
        }
    };
};
Hero.DevilHunter=class DevilHunter extends AttackableUnit{
    constructor(props){
        super(props);
        //Override
        this.magic=this.get('MP');
    };
    recover(){
        if (this.life<this.get('HP')) {
            this.life+=5;
            if (this.life>this.get('HP')) this.life=this.get('HP');
        }
        if (this.shield<this.get('SP')) {
            this.shield+=5;
            if (this.shield>this.get('SP')) this.shield=this.get('SP');
        }
        if (this.magic<this.get('MP')) {
            this.magic+=5;
            if (this.magic>this.get('MP')) this.magic=this.get('MP');
        }
    };
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.turnAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name: "DevilHunter",
            imgPos: {
                moving: {
                    left: [
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        [124, 124, 124, 124, 124, 124, 124, 124],
                        [248, 248, 248, 248, 248, 248, 248, 248],
                        [372, 372, 372, 372, 372, 372, 372, 372],
                        [496, 496, 496, 496, 496, 496, 496, 496],
                        [682, 682, 682, 682, 682, 682, 682, 682],
                        [806, 806, 806, 806, 806, 806, 806, 806],
                        [930, 930, 930, 930, 930, 930, 930, 930]
                    ],
                    top: [
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406],
                        [0, 58, 116, 174, 232, 290, 348, 406]
                    ]
                },
                attack: {
                    left: [
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        [124, 124, 124, 124, 124, 124, 124, 124],
                        [248, 248, 248, 248, 248, 248, 248, 248],
                        [372, 372, 372, 372, 372, 372, 372, 372],
                        [496, 496, 496, 496, 496, 496, 496, 496],
                        [682, 682, 682, 682, 682, 682, 682, 682],
                        [806, 806, 806, 806, 806, 806, 806, 806],
                        [930, 930, 930, 930, 930, 930, 930, 930]
                    ],
                    top: [
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870],
                        [464, 522, 580, 638, 696, 754, 812, 870]
                    ]
                },
                dock: {
                    left: [0, 124, 248, 372, 496, 682, 806, 930],
                    top: [0, 0, 0, 0, 0, 0, 0, 0]
                }
            },
            width: 62,//(N-1)
            height: 58,//(N-1)
            frame: {
                moving: 8,
                dock: 1,
                attack: 8
            },
            //Only for moving status, override
            speed:10,
            HP: 2000,
            SP: 2000,
            MP: 200,
            damage: 30,
            armor:0,
            plasma:0,
            sight:315,
            detector:Gobj.detectorBuffer,
            attackRange: 210,
            attackInterval: 1500,
            fireDelay:600,
            dieEffect:Burst.SmallZergFlyingDeath,
            isFlying:false,
            unitType:Unit.SMALL,
            attackType:AttackableUnit.NORMAL_ATTACK,
            cost:{
                man:8
            },
            upgrade:['UpgradeGroundWeapons','UpgradeGroundArmor','UpgradePlasmaShields']
        }
    };
};
//Apply all protoProps for Hero
_$.classPackagePatch(Hero);
