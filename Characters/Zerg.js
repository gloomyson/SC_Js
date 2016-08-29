/******* Define Zerg units *******/
var Zerg={};
Zerg.Drone=class Drone extends AttackableUnit{
    constructor(props){
        super(props);
        this.sound.burrow=new Audio(Game.CDN+'bgm/Zerg.burrow.wav');
        this.sound.unburrow=new Audio(Game.CDN+'bgm/Zerg.unburrow.wav');
        this.direction=7;
    };
    buildZergBuilding(location){
        //Has location callback info or nothing
        if (location){
            //Move toward target to fire Ensnare
            this.targetLock=true;
            const myself=this;
            this.moveTo(location.x,location.y,20,function(){
                if (Resource.payCreditBill.call(myself)){
                    let target=Building.ZergBuilding[myself.buildName];
                    //Adjust location
                    myself.x=(location.x-myself.width/2)>>0;
                    myself.y=(location.y-myself.height/2)>>0;
                    let mutation=myself.evolveTo({
                        type:eval('Building.'+target.prototype.evolves[0].step),
                        chain:true
                    });
                    mutation.buildName=myself.buildName;
                    //Calculate duration
                    let duration=Resource.getCost(myself.buildName).time;
                    //Cheat:Operation cwal
                    if (Cheat.cwal) duration=40;
                    //Processing flag on transfer
                    mutation.processing={
                        name:mutation.buildName,
                        startTime:Game.mainTick,//new Date().getTime()
                        time:duration
                    };
                    //Evolve chain
                    for (let N=1;N<target.prototype.evolves.length;N++){
                        let evolveInfo=target.prototype.evolves[N];
                        Game.commandTimeout(function(){
                            if (mutation.status!='dead'){
                                //Evolve
                                let evolveTarget=(eval(`Building.${evolveInfo.step}`));
                                //Step is constructor function
                                if (evolveTarget){
                                    let old=mutation;
                                    mutation=mutation.evolveTo({
                                        type:evolveTarget,
                                        chain:true
                                    });
                                    mutation.processing=old.processing;
                                    mutation.buildName=old.buildName;
                                }
                                //Step is status string
                                else {
                                    mutation.status=evolveInfo.step;
                                }
                            }
                        },duration*100*evolveInfo.percent);
                    }
                    //Final evolve
                    Game.commandTimeout(function(){
                        if (mutation.status!='dead'){
                            //Evolve
                            mutation.evolveTo({
                                type:Building.ZergBuilding[mutation.buildName],
                                burstArr:mutation.evolveEffect
                            });
                        }
                    },duration*100);
                }
            });
        }
        //If missing location info,mark Button.callback,MouseController will call back with location
        else {
            Button.callback=arguments.callee;
            Button.callback.farmer=this;
            Button.callback.buildType='ZergBuilding';
            $('div.GameLayer').attr('status','button');
        }
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Drone",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*128+36).map(n=>new Array(3).fill(n)),
                    top:new Array(16).fill([36,164,292])
                },
                attack:{
                    left:Array.gen(16).del(9,1).map(n=>n*128+36).map(n=>new Array(7).fill(n)),
                    top:new Array(16).fill(Array.gen(9,3).map(n=>n*128+36))
                },
                dock:{
                    left:Array.gen(16).del(9,1).map(n=>n*128+36),
                    top:new Array(16).fill(36)
                },
                burrow:{
                    left:new Array(16).fill([1700,-1,1188,1316,1444,1572]),
                    top:new Array(16).fill([1316,-1,1316,1316,1316,1316])
                },
                unburrow:{
                    left:new Array(16).fill([12,11,10,9,9,9].map(n=>n*128+36)),
                    top:new Array(16).fill(new Array(6).fill(1316))
                }
            },
            width:56,//128N+36
            height:56,
            frame:{
                moving:3,
                dock:1,
                attack:7,
                burrow:1,
                unburrow:6
            },
            //Only for moving status,override
            speed:12,
            HP:40,
            damage:5,
            armor:0,
            sight:245,
            meleeAttack:true,
            attackInterval:2200,
            dieEffect:Burst.DroneDeath,
            isFlying:false,
            attackLimit:"ground",
            unitType:Unit.SMALL,
            attackType:AttackableUnit.NORMAL_ATTACK,
            recover:Building.ZergBuilding.prototype.recover,
            cost:{
                mine:50,
                man:1,
                time:200
            },
            upgrade:['EvolveCarapace'],
            items:{'4':undefined,
                '5':{name:'gather'},
                '7':{name:'BasicMutation'},
                '8':{name:'AdvancedMutation'},
                '9':{name:'Burrow',condition:function(){
                    return Magic.Burrow.enabled
                }}
            }
        }
    };
};
Zerg.Zergling=class Zergling extends AttackableUnit{
    constructor(props){
        super(props);
        this.sound.burrow=new Audio(Game.CDN+'bgm/Zerg.burrow.wav');
        this.sound.unburrow=new Audio(Game.CDN+'bgm/Zerg.unburrow.wav');
        this.direction=5;
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Zergling",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*43).map(n=>new Array(7).fill(n)),
                    top:new Array(16).fill(Array.gen(6).map(n=>n*42))
                },
                dock:{
                    left:Array.gen(16).del(9,1).map(n=>n*43),
                    top:new Array(16).fill(0)
                },
                attack:{
                    left:Array.gen(16).del(9,1).map(n=>n*43).map(n=>new Array(5).fill(n)),
                    top:new Array(16).fill(Array.gen(11,7).map(n=>n*42))
                },
                burrow:{
                    left:new Array(16).fill([678,-1,504,546,592,636]),
                    top:new Array(16).fill([512,-1,512,512,512,512])
                },
                unburrow:{
                    left:new Array(16).fill([636,592,546,504,504,504]),
                    top:new Array(16).fill(new Array(6).fill(512))
                }
            },
            width:43,//43N
            height:42,//42N
            frame:{
                moving:7,
                dock:1,
                attack:5,
                burrow:1,
                unburrow:6
            },
            //Only for moving status,override
            speed:13,
            HP:35,
            damage:5,
            armor:0,
            sight:175,
            meleeAttack:true,
            attackInterval:800,
            dieEffect:Burst.ZerglingDeath,
            isFlying:false,
            attackLimit:"ground",
            unitType:Unit.SMALL,
            attackType:AttackableUnit.NORMAL_ATTACK,
            recover:Building.ZergBuilding.prototype.recover,
            cost:{
                mine:25,
                man:0.5,
                time:140
            },
            birthCount:2,
            upgrade:['UpgradeMeleeAttacks','EvolveCarapace'],
            items:{
                '9':{name:'Burrow',condition:function(){
                    return Magic.Burrow.enabled
                }}
            }
        }
    };
};
Zerg.Overlord=class Overlord extends Unit{
    constructor(props){
        super(props);
        this.direction=6;
        this.y-=12;//(OverlordBirth.height-Overlord.height)/2
        //Transport
        this.loadedUnits=[];
    };
    //Override
    dock(){
        //Use the same behavior
        Unit.hover.call(this);
    };
    die(){
        //Use the same behavior
        super.die();
        //All passenger will die too
        this.loadedUnits.forEach(chara=>{
            chara.die();
        });
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Overlord",
            imgPos:{
                moving:{
                    left:[...new Array(9).fill(Array.gen(3).repeat(2,true).map(n=>n*84)),
                        ...new Array(7).fill(Array.gen(7,4).repeat(2,true).reverse().map(n=>n*84))],
                    top:[...Array.gen(8),...Array.gen(7,1).reverse()].map(n=>n*84).map(n=>new Array(8).fill(n))
                },
                dock:{
                    left:[...new Array(9).fill(0),...new Array(7).fill(588)],
                    top:Array.gen(15).copyWithin(9,1).map(n=>n*84)
                }
            },
            width:84,//84N
            height:84,//84N
            frame:{
                moving:8,
                dock:1
            },
            //Only for moving status,override
            speed:2,
            HP:200,
            armor:0,
            sight:315,
            dieEffect:Burst.BigZergFlyingDeath,
            isFlying:true,
            unitType:Unit.BIG,
            detector:Gobj.detectorBuffer,
            recover:Building.ZergBuilding.prototype.recover,
            cost:{
                mine:100,
                time:400
            },
            upgrade:['UpgradeFlyerCarapace'],
            manPlus:8,
            items:{
                '8':{name:'Load',condition:function(){
                    return Magic.Load.enabled
                }},
                '9':{name:'UnloadAll',condition:function(){
                    return Magic.UnloadAll.enabled
                }}
            }
        }
    };
};
Zerg.Hydralisk=class Hydralisk extends AttackableUnit{
    constructor(props){
        super(props);
        this.sound.burrow=new Audio(Game.CDN+'bgm/Zerg.burrow.wav');
        this.sound.unburrow=new Audio(Game.CDN+'bgm/Zerg.unburrow.wav');
        this.direction=6;
    };
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.turnAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Hydralisk",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*45).map(n=>new Array(7).fill(n)),
                    top:new Array(16).fill(Array.gen(6).map(n=>n*58))
                },
                dock:{
                    left:Array.gen(16).del(9,1).map(n=>n*45),
                    top:new Array(16).fill(0)
                },
                attack:{
                    left:Array.gen(16).del(9,1).map(n=>n*45).map(n=>new Array(5).fill(n)),
                    top:new Array(16).fill(Array.gen(11,7).map(n=>n*58))
                },
                burrow:{
                    left:new Array(16).fill([464,-1,280,326,374,418]),
                    top:new Array(16).fill([758,-1,758,758,758,758])
                },
                unburrow:{
                    left:new Array(16).fill([418,374,326,280,280,280]),
                    top:new Array(16).fill(new Array(6).fill(758))
                }
            },
            width:45,//45N
            height:58,//58N
            frame:{
                moving:7,
                dock:1,
                attack:5,
                burrow:1,
                unburrow:6
            },
            //Only for moving status,override
            speed:9,
            HP:80,
            damage:10,
            armor:0,
            sight:210,
            attackRange:140,
            attackInterval:1500,
            dieEffect:Burst.HydraliskDeath,
            isFlying:false,
            unitType:Unit.MIDDLE,
            attackType:AttackableUnit.BURST_ATTACK,
            recover:Building.ZergBuilding.prototype.recover,
            cost:{
                mine:75,
                gas:25,
                man:1,
                time:280
            },
            upgrade:['UpgradeMissileAttacks','EvolveCarapace'],
            items:{
                '7':{name:'Lurker',condition:function(){
                    return Magic.Lurker.enabled
                }},
                '9':{name:'Burrow',condition:function(){
                    return Magic.Burrow.enabled
                }}
            }
        }
    };
};
Zerg.Lurker=class Lurker extends Unit{
    constructor(props){
        super(props);
        //Same as attackable unit
        this.bullet={};
        this.kill=0;
        this.target={};
        //Idle by default
        this.targetLock=false;
        //Can fire by default
        this.coolDown=true;
        //Add attack sound for AttackableUnit
        this.sound.attack=new Audio(Game.CDN+'bgm/Lurker.attack.wav');
        this.sound.burrow=new Audio(Game.CDN+'bgm/Lurker.burrow.wav');
        this.sound.unburrow=new Audio(Game.CDN+'bgm/Zerg.unburrow.wav');
        this.direction=6;
    };
    //New type AI for enemy Lurker
    reactionWhenAttackedBy(...args){
        //Will burrow and attack
        if (!Multiplayer.ON && !this.burrowBuffer && this.isEnemy()) Magic.Burrow.spell.call(this);
        super.reactionWhenAttackedBy(...args);
    };
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.turnAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Lurker",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*72).map(n=>new Array(7).fill(n)),
                    top:new Array(16).fill(Array.gen(6).map(n=>n*67+1))
                },
                dock:{
                    left:Array.gen(16).del(9,1).map(n=>n*72),
                    top:new Array(16).fill(1)
                },
                burrow:{
                    left:new Array(16).fill([502,-1,2,66,130,192,256,2,66,130,192,256,318,380,444]),
                    top:new Array(16).fill([482,-1,...new Array(13).fill(482)])
                },
                unburrow:{
                    left:new Array(16).fill([450,510,570,632,700,764,764,764]),
                    top:new Array(16).fill(new Array(8).fill(570))
                }
            },
            width:72,//72N
            height:67,//67N+1
            frame:{
                moving:7,
                dock:1,
                burrow:1,
                unburrow:8
            },
            //Only for moving status,override
            speed:14,
            HP:125,
            damage:20,
            armor:0,
            sight:280,
            attackRange:210,
            attackInterval:3700,
            continuousAttack:{
                count:5,
                layout:function(bullet,num){
                    //Reassign location
                    bullet.x+=bullet.speed.x*(num);
                    bullet.y+=bullet.speed.y*(num);
                    //Reassign each action
                    bullet.action=(bullet.action+num)%(bullet.frame.moving);
                    //Fix action
                    bullet.animeFrame=function(){};
                },
                onlyOnce:true
            },
            dieEffect:Burst.LurkerDeath,
            isFlying:false,
            attackLimit:"ground",
            unitType:Unit.MIDDLE,
            attackType:AttackableUnit.NORMAL_ATTACK,
            recover:Building.ZergBuilding.prototype.recover,
            AOE:{
                type:"LINE",
                hasEffect:false,
                radius:35
            },
            cost:{
                mine:50,
                gas:100,
                man:2,
                time:400
            },
            upgrade:['UpgradeMissileAttacks','EvolveCarapace'],
            items:{
                '9':{name:'Burrow'}
            }
        }
    };
};
Zerg.Mutalisk=class Mutalisk extends AttackableUnit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        this.direction=7;
        //Adjust for multi frames
        this.y-=12;
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Mutalisk",
            imgPos:{
                moving:{
                    left:[0,67,134,201,268,335,401,468,535,602,669,736,802,869,936,1003].map(n=>new Array(5).fill(n)),
                    top:new Array(16).fill(Array.gen(4).map(n=>n*75))
                }
            },
            width:66,//67N?
            height:75,
            frame:{
                moving:5
            },
            //Only for moving status,override
            speed:16,
            HP:120,
            damage:9,
            armor:0,
            sight:245,
            attackRange:105,
            attackInterval:2200,//3000
            dieEffect:Burst.SmallZergFlyingDeath,
            isFlying:true,
            unitType:Unit.SMALL,
            attackType:AttackableUnit.NORMAL_ATTACK,
            recover:Building.ZergBuilding.prototype.recover,
            cost:{
                mine:100,
                gas:100,
                man:2,
                time:400
            },
            upgrade:['UpgradeFlyerAttacks','UpgradeFlyerCarapace'],
            items:{
                '7':{name:'Guardian',condition:function(){
                    return Building.allBuildings.some(chara=>{
                        return !(chara.isEnemy()) && chara.name=='GreaterSpire';
                    })
                }},
                '8':{name:'Devourer',condition:function(){
                    return Building.allBuildings.some(chara=>{
                        return !(chara.isEnemy()) && chara.name=='GreaterSpire';
                    })
                }}
            }
        }
    };
};
Zerg.Guardian=class Guardian extends AttackableUnit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        this.direction=7;
    };
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.hover.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Guardian",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*81).map(n=>new Array(7).fill(n)),
                    top:new Array(16).fill(Array.gen(6).map(n=>n*74))
                }
            },
            width:81,//81N
            height:74,//74N
            frame:{
                moving:7
            },
            //Only for moving status,override
            speed:6,
            HP:150,
            damage:20,
            armor:2,
            sight:385,
            attackRange:280,
            attackInterval:3000,
            dieEffect:Burst.BigZergFlyingDeath,
            isFlying:true,
            attackLimit:"ground",
            unitType:Unit.BIG,
            attackType:AttackableUnit.NORMAL_ATTACK,
            recover:Building.ZergBuilding.prototype.recover,
            cost:{
                mine:50,
                gas:100,
                man:2,
                time:400
            },
            upgrade:['UpgradeFlyerAttacks','UpgradeFlyerCarapace']
        }
    };
};
Zerg.Devourer=class Devourer extends AttackableUnit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        this.direction=6;
    };
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.hover.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Devourer",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*73).map(n=>new Array(6).fill(n)),
                    top:new Array(16).fill(Array.gen(5).map(n=>n*86))
                },
                attack:{
                    left:Array.gen(16).del(9,1).map(n=>n*73).map(n=>new Array(8).fill(n)),
                    top:new Array(16).fill(Array.gen(9,6).repeat(2,true).map(n=>n*86))
                }
            },
            width:73,//73N
            height:86,//86N
            frame:{
                moving:6,
                attack:8
            },
            //Only for moving status,override
            speed:12,
            HP:250,
            damage:25,
            armor:2,
            sight:350,
            attackRange:175,//210
            attackInterval:5000,//10000
            dieEffect:Burst.BigZergFlyingDeath,
            isFlying:true,
            attackLimit:"flying",
            unitType:Unit.BIG,
            attackType:AttackableUnit.BURST_ATTACK,
            recover:Building.ZergBuilding.prototype.recover,
            AOE:{
                hasEffect:true,
                radius:60
            },
            cost:{
                mine:150,
                gas:50,
                man:2,
                time:400
            },
            upgrade:['UpgradeFlyerAttacks','UpgradeFlyerCarapace']
        }
    };
};
Zerg.Scourge=class Scourge extends AttackableUnit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.attack=this.imgPos.dock=this.imgPos.moving;
        this.frame.attack=this.frame.dock=this.frame.moving;
        this.direction=0;
        //Adjust for multi frames
        this.y-=20;
    };
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.hover.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Scourge",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*34).map(n=>new Array(5).fill(n)),
                    top:new Array(16).fill(Array.gen(4).map(n=>n*30))
                }
            },
            width:34,//34N
            height:30,//30N
            frame:{
                moving:5
            },
            //Only for moving status,override
            speed:16,
            HP:25,
            damage:110,//Suicide
            armor:0,
            sight:175,
            meleeAttack:true,
            attackRange:35,
            attackInterval:1000,//Suicide
            dieEffect:Burst.SmallZergFlyingDeath,
            attackEffect:Burst.ScourgeBomb,
            isFlying:true,
            attackLimit:"flying",
            suicide:true,
            unitType:Unit.SMALL,
            attackType:AttackableUnit.NORMAL_ATTACK,
            recover:Building.ZergBuilding.prototype.recover,
            cost:{
                mine:12.5,
                gas:37.5,
                man:0.5,
                time:150
            },
            birthCount:2,
            upgrade:['UpgradeFlyerCarapace']
        }
    };
};
Zerg.Queen=class Queen extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        this.direction=7;
        //Adjust for multi frames
        this.y-=16;
    };
    //Override
    dock(){
        //Use the same behavior
        Unit.hover.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Queen",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*78).map(n=>new Array(5).fill(n)),
                    top:new Array(16).fill(Array.gen(4).map(n=>n*71))
                }
            },
            width:78,//78N
            height:71,//71N
            frame:{
                moving:5
                //attack:6//Reserved
            },
            //Only for moving status,override
            speed:16,
            HP:120,
            armor:0,
            MP:200,
            sight:350,
            dieEffect:Burst.BigZergFlyingDeath,
            isFlying:true,
            unitType:Unit.MIDDLE,
            recover:Building.ZergBuilding.prototype.recover,
            cost:{
                mine:100,
                gas:150,
                man:2,
                time:500
            },
            upgrade:['UpgradeFlyerCarapace'],
            items:{
                '6':{name:'InfestTerranCommandCenter'},
                '7':{name:'Parasite'},
                '8':{name:'SpawnBroodlings',condition:function(){
                    return Magic.SpawnBroodlings.enabled
                }},
                '9':{name:'Ensnare',condition:function(){
                    return Magic.Ensnare.enabled
                }}
            }
        }
    };
};
Zerg.Broodling=class Broodling extends AttackableUnit{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Broodling",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*48+5).map(n=>new Array(7).fill(n)),
                    top:new Array(16).fill(Array.gen(6).map(n=>n*48+5))
                },
                dock:{
                    left:Array.gen(16).del(9,1).map(n=>n*48+5),
                    top:new Array(16).fill(5)
                },
                attack:{
                    left:Array.gen(16).del(9,1).map(n=>n*48+5).map(n=>new Array(5).fill(n)),
                    top:new Array(16).fill(Array.gen(11,7).map(n=>n*48+5))
                }
            },
            width:38,//48N+5
            height:38,
            frame:{
                moving:7,
                dock:1,
                attack:5
            },
            //Only for moving status,override
            speed:6,
            HP:30,
            damage:4,
            armor:0,
            sight:175,
            meleeAttack:true,
            attackInterval:1500,
            dieEffect:Burst.BroodlingDeath,
            isFlying:false,
            attackLimit:"ground",
            unitType:Unit.SMALL,
            recover:Building.ZergBuilding.prototype.recover,
            upgrade:['UpgradeMeleeAttacks','EvolveCarapace'],
            attackType:AttackableUnit.NORMAL_ATTACK,
            //Override
            dock:function(){
                //Use the same behavior
                AttackableUnit.walkAround.call(this);
            }
        }
    };
};
Zerg.Ultralisk=class Ultralisk extends AttackableUnit{
    constructor(props){
        super(props);
        this.direction=7;
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Ultralisk",
            imgPos:{
                moving:{
                    left:Array.gen(18).del(10,1).map(n=>n*101).map(n=>new Array(9).fill(n)),
                    top:new Array(16).fill(Array.gen(8).map(n=>n*108))
                },
                dock:{
                    left:Array.gen(18).del(10,1).map(n=>n*101),
                    top:new Array(16).fill(0)
                },
                attack:{
                    left:Array.gen(18).del(10,1).map(n=>n*101).map(n=>new Array(6).fill(n)),
                    top:new Array(16).fill(Array.gen(14,9).map(n=>n*108))
                }
            },
            width:101,//101N
            height:108,//108N
            frame:{
                moving:9,
                dock:1,
                attack:6
            },
            //Only for moving status,override
            speed:12,
            HP:400,
            damage:20,
            armor:1,
            sight:245,
            meleeAttack:true,
            attackInterval:1500,
            dieEffect:Burst.UltraliskDeath,
            isFlying:false,
            attackLimit:"ground",
            unitType:Unit.BIG,
            attackType:AttackableUnit.NORMAL_ATTACK,
            recover:Building.ZergBuilding.prototype.recover,
            cost:{
                mine:200,
                gas:200,
                man:6,
                time:600
            },
            upgrade:['UpgradeMeleeAttacks','EvolveCarapace']
        }
    };
};
Zerg.Defiler=class Defiler extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        this.sound.burrow=new Audio(Game.CDN+'bgm/Zerg.burrow.wav');
        this.sound.unburrow=new Audio(Game.CDN+'bgm/Zerg.unburrow.wav');
        this.direction=6;
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Defiler",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*72).map(n=>new Array(8).fill(n)),
                    top:new Array(16).fill(Array.gen(7).map(n=>n*62))
                },
                burrow:{
                    left:new Array(16).fill([288,-1,0,72,144,216]),
                    top:new Array(16).fill([496,-1,496,496,496,496])
                },
                unburrow:{
                    left:new Array(16).fill([3,2,1,0,0,0].map(n=>n*72)),
                    top:new Array(16).fill(new Array(6).fill(496))
                }
            },
            width:72,//72N
            height:62,//62N
            frame:{
                moving:8,
                burrow:1,
                unburrow:6
            },
            //Only for moving status,override
            speed:10,
            HP:80,
            armor:1,
            MP:200,
            sight:350,
            dieEffect:Burst.DefilerDeath,
            isFlying:false,
            unitType:Unit.MIDDLE,
            recover:Building.ZergBuilding.prototype.recover,
            cost:{
                mine:50,
                gas:150,
                man:2,
                time:500
            },
            upgrade:['EvolveCarapace'],
            items:{
                '6':{name:'Consume',condition:function(){
                    return Magic.Consume.enabled
                }},
                '7':{name:'DarkSwarm'},
                '8':{name:'Plague',condition:function(){
                    return Magic.Plague.enabled
                }},
                '9':{name:'Burrow',condition:function(){
                    return Magic.Burrow.enabled
                }}
            }
        }
    };
};
Zerg.InfestedTerran=class InfestedTerran extends AttackableUnit{
    constructor(props){
        super(props);
        this.sound.burrow=new Audio(Game.CDN+'bgm/Zerg.burrow.wav');
        this.sound.unburrow=new Audio(Game.CDN+'bgm/Zerg.unburrow.wav');
    };
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.turnAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"InfestedTerran",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*41).map(n=>new Array(8).fill(n)),
                    top:new Array(16).fill(Array.gen(7).map(n=>n*54))
                },
                dock:{
                    left:Array.gen(16).del(9,1).map(n=>n*41),
                    top:new Array(16).fill(0)
                },
                burrow:{
                    left:new Array(16).fill([616,-1,410,452,494,535,576]),
                    top:new Array(16).fill([436,-1,436,436,436,436,436])
                },
                unburrow:{
                    left:new Array(16).fill([576,535,494,452,410,410,410]),
                    top:new Array(16).fill(new Array(7).fill(436))
                }
            },
            width:41,//41N
            height:44,//54N
            frame:{
                moving:8,
                dock:1,
                burrow:1,
                unburrow:7
            },
            //Only for moving status,override
            speed:10,
            HP:60,
            damage:500,//Suicide
            armor:0,
            sight:175,
            meleeAttack:true,
            attackRange:35,
            attackInterval:1000,//Suicide
            dieEffect:Burst.HumanDeath,
            attackEffect:Burst.InfestedBomb,
            isFlying:false,
            attackLimit:"ground",
            suicide:true,
            unitType:Unit.SMALL,
            attackType:AttackableUnit.NORMAL_ATTACK,
            recover:Building.ZergBuilding.prototype.recover,
            AOE:{
                hasEffect:false,
                radius:80
            },
            cost:{
                mine:100,
                gas:50,
                man:1,
                time:400
            },
            upgrade:['EvolveCarapace'],
            items:{
                '9':{name:'Burrow',condition:function(){
                    return Magic.Burrow.enabled
                }}
            }
        }
    };
};
Zerg.Larva=class Larva extends Unit{
    constructor(props){
        super(props);
        this.imgPos.dock=this.imgPos.moving;
        //Cannot leave from this point
        this.originX=this.posX();
        this.originY=this.posY();
        this.moved=false;
    };
    //Prevent user control moving
    moveTo(){};
    moveToward(){};
    //Override
    dock(){
        Unit.walkAroundLarva.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                moving:{
                    left:Array.gen(15).map(n=>n*33+1).map(n=>new Array(5).fill(n)),
                    top:new Array(16).fill(Array.gen(4).map(n=>n*29+1))
                }
            },
            width:32,//33X+1 (0~15)
            height:28,//29X+1
            frame:{
                moving:5,
                dock:1
            },
            //Only for moving status,override
            speed:4,
            HP:25,
            armor:10,
            sight:70,
            dieEffect:Burst.LarvaDeath,
            unitType:Unit.SMALL,
            isFlying:false,
            recover:Building.ZergBuilding.prototype.recover,
            upgrade:['EvolveCarapace'],
            items:{
                '1':{name:'Drone'},
                '2':{name:'Zergling',condition:function(){
                    return Building.allBuildings.some(chara=>{
                        return !(chara.isEnemy()) && chara.name=='SpawningPool';
                    })
                }},
                '3':{name:'Overlord'},
                '4':{name:'Hydralisk',condition:function(){
                    return Building.allBuildings.some(chara=>{
                        return !(chara.isEnemy()) && chara.name=='HydraliskDen';
                    })
                }},
                '5':{name:'Mutalisk',condition:function(){
                    return Building.allBuildings.some(chara=>{
                        return !(chara.isEnemy()) && (chara.name=='Spire' || chara.name=='GreaterSpire');
                    })
                }},
                '6':{name:'Scourge',condition:function(){
                    return Building.allBuildings.some(chara=>{
                        return !(chara.isEnemy()) && (chara.name=='Spire' || chara.name=='GreaterSpire');
                    })
                }},
                '7':{name:'Queen',condition:function(){
                    return Building.allBuildings.some(chara=>{
                        return !(chara.isEnemy()) && chara.name=='QueenNest';
                    })
                }},
                '8':{name:'Ultralisk',condition:function(){
                    return Building.allBuildings.some(chara=>{
                        return !(chara.isEnemy()) && chara.name=='UltraliskCavern';
                    })
                }},
                '9':{name:'Defiler',condition:function(){
                    return Building.allBuildings.some(chara=>{
                        return !(chara.isEnemy()) && chara.name=='DefilerMound';
                    })
                }}
            }
        }
    };
};
//Apply all protoProps
_$.classPackagePatch(Zerg);
