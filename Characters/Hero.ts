/******* Define Hero units *******/
var Hero={};
Hero.HeroCruiser=AttackableUnit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        //Override
        this.magic=this.get('MP');
    },
    prototypePlus: {
        //Add basic unit info
        name: "HeroCruiser",
        imgPos: {
            moving: {
                left: [10,130,250,370,490,610,730,850,10,130,250,370,490,610,730,850],
                top: [10,10,10,10,10,10,10,10,130,130,130,130,130,130,130,130]
            }
        },
        width: 100,//120N+10
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
        recover:function(){
            if (this.magic<this.get('MP')) {
                this.magic+=3;
                if (this.magic>this.get('MP')) this.magic=this.get('MP');
            }
        },
        items:{
            '6':{name:'Yamato'},
            '7':{name:'DefensiveMatrix'},
            '8':{name:'EMPShockwave'},
            '9':{name:'Irradiate'}
        },
        cost:{
            man:8
        },
        //Override
        dock:function(){
            //Use the same behavior
            Zerg.Devourer.prototype.dock.call(this);
        }
    }
});
Hero.Tassadar=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        //Override
        this.magic=this.get('MP');
    },
    prototypePlus: {
        //Add basic unit info
        name: "Tassadar",
        imgPos: {
            moving: {
                left: [0,95,190,285,380,475,570,665,0,95,190,285,380,475,570,665],
                top: [90,90,90,90,90,90,90,90,0,0,0,0,0,0,0,0]
            }
        },
        width: 95,//95N
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
        recover:function(){
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
        },
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
        },
        //Override
        dock:function(){
            //Use the same behavior
            Zerg.Devourer.prototype.dock.call(this);
        }
    }
});
Hero.Kerrigan=AttackableUnit.extends({
    constructorPlus:function(props){
        //Override
        this.magic=this.get('MP');
    },
    prototypePlus: {
        //Add basic unit info
        name: "Kerrigan",
        imgPos: {
            moving: {
                left: [
                    [0,0,0,0,0,0,0,0,0],[36,36,36,36,36,36,36,36,36],
                    [73,73,73,73,73,73,73,73,73],[109,109,109,109,109,109,109,109,109],
                    [146,146,146,146,146,146,146,146,146],[182,182,182,182,182,182,182,182,182],
                    [219,219,219,219,219,219,219,219,219],[255,255,255,255,255,255,255,255,255],
                    [292,292,292,292,292,292,292,292,292],[365,365,365,365,365,365,365,365,365],
                    [401,401,401,401,401,401,401,401,401],[438,438,438,438,438,438,438,438,438],
                    [474,474,474,474,474,474,474,474,474],[511,511,511,511,511,511,511,511,511],
                    [547,547,547,547,547,547,547,547,547],[584,584,584,584,584,584,584,584,584]
                ],
                top: [
                    [0,43,86,129,172,215,258,301,344],[0,43,86,129,172,215,258,301,344],
                    [0,43,86,129,172,215,258,301,344],[0,43,86,129,172,215,258,301,344],
                    [0,43,86,129,172,215,258,301,344],[0,43,86,129,172,215,258,301,344],
                    [0,43,86,129,172,215,258,301,344],[0,43,86,129,172,215,258,301,344],
                    [0,43,86,129,172,215,258,301,344],[0,43,86,129,172,215,258,301,344],
                    [0,43,86,129,172,215,258,301,344],[0,43,86,129,172,215,258,301,344],
                    [0,43,86,129,172,215,258,301,344],[0,43,86,129,172,215,258,301,344],
                    [0,43,86,129,172,215,258,301,344],[0,43,86,129,172,215,258,301,344]
                ]
            },
            attack: {
                left: [
                    [0,0,0,0],[36,36,36,36],
                    [73,73,73,73],[109,109,109,109],
                    [146,146,146,146],[182,182,182,182],
                    [219,219,219,219],[255,255,255,255],
                    [292,292,292,292],[365,365,365,365],
                    [401,401,401,401],[438,438,438,438],
                    [474,474,474,474],[511,511,511,511],
                    [547,547,547,547],[584,584,584,584]
                ],
                top: [
                    [387,430,473,516],[387,430,473,516],
                    [387,430,473,516],[387,430,473,516],
                    [387,430,473,516],[387,430,473,516],
                    [387,430,473,516],[387,430,473,516],
                    [387,430,473,516],[387,430,473,516],
                    [387,430,473,516],[387,430,473,516],
                    [387,430,473,516],[387,430,473,516],
                    [387,430,473,516],[387,430,473,516]
                ]
            },
            dock: {
                left: [0,36,73,109,146,182,219,255,292,365,401,438,474,511,547,584],
                top: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            }
        },
        width: 36,//36.5N>>0
        height: 43,//43N
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
        recover:function(){
            if (this.magic<this.get('MP')) {
                this.magic+=2;
                if (this.magic>this.get('MP')) this.magic=this.get('MP');
            }
        },
        cost:{
            man:1
        },
        items:{
            '6':{name:'StimPacks'},
            '7':{name:'Cloak'},
            '8':{name:'Lockdown'}
        },
        //Override
        dock:function(){
            //Use the same behavior
            AttackableUnit.turnAround.call(this);
        }
    }
});
Hero.Sarah=AttackableUnit.extends({
    constructorPlus:function(props){
        //Override
        this.magic=this.get('MP');
    },
    prototypePlus: {
        //Add basic unit info
        name: "Sarah",
        imgPos: {
            moving: {
                left: [
                    [0,0,0,0,0,0,0,0],[62,62,62,62,62,62,62,62],
                    [124,124,124,124,124,124,124,124],[186,186,186,186,186,186,186,186],
                    [248,248,248,248,248,248,248,248],[310,310,310,310,310,310,310,310],
                    [372,372,372,372,372,372,372,372],[434,434,434,434,434,434,434,434],
                    [496,496,496,496,496,496,496,496],[620,620,620,620,620,620,620,620],
                    [682,682,682,682,682,682,682,682],[744,744,744,744,744,744,744,744],
                    [806,806,806,806,806,806,806,806],[868,868,868,868,868,868,868,868],
                    [930,930,930,930,930,930,930,930],[992,992,992,992,992,992,992,992]
                ],
                top: [
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406]
                ]
            },
            attack: {
                left: [
                    [0,0,0,0,0,0,0,0],[62,62,62,62,62,62,62,62],
                    [124,124,124,124,124,124,124,124],[186,186,186,186,186,186,186,186],
                    [248,248,248,248,248,248,248,248],[310,310,310,310,310,310,310,310],
                    [372,372,372,372,372,372,372,372],[434,434,434,434,434,434,434,434],
                    [496,496,496,496,496,496,496,496],[620,620,620,620,620,620,620,620],
                    [682,682,682,682,682,682,682,682],[744,744,744,744,744,744,744,744],
                    [806,806,806,806,806,806,806,806],[868,868,868,868,868,868,868,868],
                    [930,930,930,930,930,930,930,930],[992,992,992,992,992,992,992,992]
                ],
                top: [
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870]
                ]
            },
            dock: {
                left: [0,62,124,186,248,310,372,434,496,620,682,744,806,868,930,992],
                top: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
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
        recover:function(){
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
        },
        cost:{
            man:2
        },
        items:{
            '6':{name:'Cloak'},
            '7':{name:'PsionicStorm'},
            '8':{name:'Plague'},
            '9':{name:'Ensnare'}
        },
        //Override
        dock:function(){
            //Use the same behavior
            AttackableUnit.turnAround.call(this);
        }
    }
});
Hero.DevilHunter=AttackableUnit.extends({
    constructorPlus:function(props){
        //Override
        this.magic=this.get('MP');
    },
    prototypePlus: {
        //Add basic unit info
        name: "DevilHunter",
        imgPos: {
            moving: {
                left: [
                    [0,0,0,0,0,0,0,0],[62,62,62,62,62,62,62,62],
                    [124,124,124,124,124,124,124,124],[186,186,186,186,186,186,186,186],
                    [248,248,248,248,248,248,248,248],[310,310,310,310,310,310,310,310],
                    [372,372,372,372,372,372,372,372],[434,434,434,434,434,434,434,434],
                    [496,496,496,496,496,496,496,496],[620,620,620,620,620,620,620,620],
                    [682,682,682,682,682,682,682,682],[744,744,744,744,744,744,744,744],
                    [806,806,806,806,806,806,806,806],[868,868,868,868,868,868,868,868],
                    [930,930,930,930,930,930,930,930],[992,992,992,992,992,992,992,992]
                ],
                top: [
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406],
                    [0,58,116,174,232,290,348,406],[0,58,116,174,232,290,348,406]
                ]
            },
            attack: {
                left: [
                    [0,0,0,0,0,0,0,0],[62,62,62,62,62,62,62,62],
                    [124,124,124,124,124,124,124,124],[186,186,186,186,186,186,186,186],
                    [248,248,248,248,248,248,248,248],[310,310,310,310,310,310,310,310],
                    [372,372,372,372,372,372,372,372],[434,434,434,434,434,434,434,434],
                    [496,496,496,496,496,496,496,496],[620,620,620,620,620,620,620,620],
                    [682,682,682,682,682,682,682,682],[744,744,744,744,744,744,744,744],
                    [806,806,806,806,806,806,806,806],[868,868,868,868,868,868,868,868],
                    [930,930,930,930,930,930,930,930],[992,992,992,992,992,992,992,992]
                ],
                top: [
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870],
                    [464,522,580,638,696,754,812,870],[464,522,580,638,696,754,812,870]
                ]
            },
            dock: {
                left: [0,62,124,186,248,310,372,434,496,620,682,744,806,868,930,992],
                top: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
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
        recover:function(){
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
        },
        cost:{
            man:8
        },
        upgrade:['UpgradeGroundWeapons','UpgradeGroundArmor','UpgradePlasmaShields'],
        //Override
        dock:function(){
            //Use the same behavior
            AttackableUnit.turnAround.call(this);
        }
    }
});
