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
            name:"HeroCruiser",
            imgPos:{
                moving:{
                    left:Array.gen(7).repeat(2).map(n=>n*120+10),
                    top:[10,130].repeat(8,true)
                }
            },
            width:100,//120N+10
            height:100,
            frame:{
                moving:1,
                stop:1
            },
            //Only for moving status,override
            speed:9,
            HP:1000,
            damage:50,
            armor:3,
            MP:500,
            sight:385,
            attackRange:250,
            attackInterval:3000,
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
            name:"Tassadar",
            imgPos:{
                moving:{
                    left:Array.gen(7).repeat(2).map(n=>n*95),
                    top:[90,0].repeat(8,true)
                }
            },
            width:95,//95N
            height:90,
            frame:{
                moving:1,
                stop:1
            },
            //Only for moving status,override
            speed:15,
            HP:999,
            SP:999,
            armor:3,
            MP:999,
            sight:385,
            detector:Gobj.detectorBuffer,
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
            name:"Kerrigan",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*36.5>>0).map(n=>new Array(9).fill(n)),
                    top:new Array(16).fill(Array.gen(8).map(n=>n*43))
                },
                attack:{
                    left:Array.gen(16).del(9,1).map(n=>n*36.5>>0).map(n=>new Array(4).fill(n)),
                    top:new Array(16).fill(Array.gen(12,9).map(n=>n*43))
                },
                dock:{
                    left:Array.gen(16).del(9,1).map(n=>n*36.5>>0),
                    top:new Array(16).fill(0)
                }
            },
            width:36,//36.5N>>0
            height:43,//43N
            frame:{
                moving:9,
                dock:1,
                attack:4
            },
            //Only for moving status,override
            speed:10,
            HP:300,
            damage:20,
            armor:1,
            MP:300,
            sight:315,
            attackRange:210,
            attackInterval:2200,
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
            name:"Sarah",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*62).map(n=>new Array(8).fill(n)),
                    top:new Array(16).fill(Array.gen(7).map(n=>n*58))
                },
                attack:{
                    left:Array.gen(16).del(9,1).map(n=>n*62).map(n=>new Array(8).fill(n)),
                    top:new Array(16).fill(Array.gen(15,8).map(n=>n*58))
                },
                dock:{
                    left:Array.gen(16).del(9,1).map(n=>n*62),
                    top:new Array(16).fill(0)
                }
            },
            width:62,//(N-1)
            height:58,//(N-1)
            frame:{
                moving:8,
                dock:1,
                attack:8
            },
            //Only for moving status,override
            speed:10,
            HP:500,
            SP:500,
            damage:40,
            armor:2,
            plasma:0,
            MP:500,
            sight:315,
            attackRange:70,
            attackInterval:2000,
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
            name:"DevilHunter",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*62).map(n=>new Array(8).fill(n)),
                    top:new Array(16).fill(Array.gen(7).map(n=>n*58))
                },
                attack:{
                    left:Array.gen(16).del(9,1).map(n=>n*62).map(n=>new Array(8).fill(n)),
                    top:new Array(16).fill(Array.gen(15,8).map(n=>n*58))
                },
                dock:{
                    left:Array.gen(16).del(9,1).map(n=>n*62),
                    top:new Array(16).fill(0)
                }
            },
            width:62,//(N-1)
            height:58,//(N-1)
            frame:{
                moving:8,
                dock:1,
                attack:8
            },
            //Only for moving status,override
            speed:10,
            HP:2000,
            SP:2000,
            MP:200,
            damage:30,
            armor:0,
            plasma:0,
            sight:315,
            detector:Gobj.detectorBuffer,
            attackRange:210,
            attackInterval:1500,
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
