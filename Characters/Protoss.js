/******* Define Protoss units *******/
var Protoss={};
Protoss.Probe=class Probe extends AttackableUnit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    };
    buildProtossBuilding(location){
        //Has location callback info or nothing
        if (location){
            //Move toward target to fire Ensnare
            this.targetLock=true;
            const myself=this;
            this.moveTo(location.x,location.y,40,function(){
                if (Resource.payCreditBill.call(myself)){
                    let transfer=new Building.ProtossBuilding.WrapRift({x:location.x-32,y:location.y-32,team:myself.team});
                    transfer.buildName=myself.buildName;
                    //Calculate duration
                    let duration=Resource.getCost(myself.buildName).time;
                    //Cheat:Operation cwal
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
        //If missing location info,mark Button.callback,MouseController will call back with location
        else {
            Button.callback=arguments.callee;
            Button.callback.farmer=this;
            Button.callback.buildType='ProtossBuilding';
            $('div.GameLayer').attr('status','button');
        }
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Probe",
            imgPos:{
                moving:{
                    left:Array.gen(15).copyWithin(9,1).map(n=>n*32),
                    top:[...new Array(9).fill(0),...new Array(7).fill(32)]
                },
                attack:{
                    left:Array.gen(15).copyWithin(9,1).map(n=>n*32),
                    top:[...new Array(9).fill(0),...new Array(7).fill(32)]
                }
            },
            width:32,//32N
            height:32,//32N
            frame:{
                moving:1
            },
            //Only for moving status,override
            speed:12,
            HP:20,
            SP:20,
            damage:5,
            armor:0,
            plasma:0,
            sight:280,
            meleeAttack:true,
            attackInterval:2200,
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
            }
        }
    };
};
Protoss.Zealot=class Zealot extends AttackableUnit{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Zealot",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*42).map(n=>new Array(8).fill(n)),
                    top:new Array(16).fill(Array.gen(7).map(n=>n*44))
                },
                dock:{
                    left:Array.gen(16).del(9,1).map(n=>n*42),
                    top:new Array(16).fill(0)
                },
                attack:{
                    left:Array.gen(16).del(9,1).map(n=>n*42).map(n=>new Array(5).fill(n)),
                    top:new Array(16).fill(Array.gen(12,8).map(n=>n*44))
                }
            },
            width:42,//42N
            height:44,//44N
            frame:{
                moving:8,
                dock:1,
                attack:5
            },
            //Only for moving status,override
            speed:10,
            HP:80,
            SP:80,
            damage:16,
            armor:1,
            plasma:0,
            sight:245,
            meleeAttack:true,
            attackInterval:2200,
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
    };
};
Protoss.Dragoon=class Dragoon extends AttackableUnit{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Dragoon",
            imgPos:{
                moving:{
                    left:[...new Array(9).fill(Array.gen(7).map(n=>n*96+15)),
                        ...new Array(7).fill(Array.gen(7).map(n=>n*96+15).reverse())],
                    top:[1,1,...new Array(5).fill(2),...new Array(3).fill(4),...new Array(5).fill(3),1]
                        .map(n=>n*96+15).map(n=>new Array(8).fill(n))
                },
                dock:{
                    left:new Array(16).fill(Array.gen(7).map(n=>n*96+15)),
                    top:new Array(16).fill(new Array(8).fill(15))
                },
                attack:{
                    left:new Array(16).fill(Array.gen(7).concat(new Array(4).fill(5)).map(n=>n*96+15)),
                    top:new Array(16).fill(new Array(12).fill(495))
                }
            },
            width:66,//96N+15
            height:66,//96N+15
            frame:{
                moving:8,
                dock:8,
                attack:12
            },
            //Only for moving status,override
            speed:12,
            HP:100,
            SP:80,
            damage:20,
            armor:1,
            plasma:0,
            sight:280,
            attackRange:140,
            attackInterval:3000,
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
    };
};
Protoss.Templar=class Templar extends AttackableUnit{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Templar",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*128+30).map(n=>new Array(4).fill(n)),
                    top:new Array(16).fill(Array.gen(15,13).concat(5).map(n=>n*128+30))
                },
                dock:{
                    left:Array.gen(16).del(9,1).map(n=>n*128+30).map(n=>new Array(7).fill(n)),
                    top:new Array(16).fill(Array.gen(12,6).map(n=>n*128+30))
                },
                attack:{
                    left:Array.gen(16).del(9,1).map(n=>n*128+30).map(n=>new Array(5).fill(n)),
                    top:new Array(16).fill(Array.gen(4).map(n=>n*128+30))
                }
            },
            width:68,//128N+30
            height:68,//128N+30
            frame:{
                moving:4,//3 or 4
                dock:7,//7 or 8
                attack:5
            },
            //Only for moving status,override
            speed:8,
            HP:40,
            SP:40,
            damage:10,
            armor:0,
            plasma:0,
            MP:200,
            sight:245,
            attackRange:100,
            attackInterval:2000,
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
    };
};
Protoss.DarkTemplar=class DarkTemplar extends AttackableUnit{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"DarkTemplar",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*57+3).map(n=>new Array(9).fill(n)),
                    top:new Array(16).fill(Array.gen(8).map(n=>n*62))
                },
                dock:{
                    left:Array.gen(16).del(9,1).map(n=>n*57+3),
                    top:new Array(16).fill(248)
                },
                attack:{
                    left:Array.gen(16).del(9,1).map(n=>n*57+3).map(n=>new Array(9).fill(n)),
                    top:new Array(16).fill(Array.gen(8).map(n=>n+9).map(n=>n*62))
                }
            },
            width:57,//57N+3
            height:62,//62N
            frame:{
                moving:9,
                dock:1,
                attack:9
            },
            //Only for moving status,override
            speed:12,
            HP:80,
            SP:40,
            damage:40,
            armor:1,
            plasma:0,
            sight:245,
            meleeAttack:true,
            attackInterval:3000,
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
    };
};
Protoss.Archon=class Archon extends AttackableUnit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        this.direction=6;
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Archon",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*120+20).map(n=>new Array(4).fill(n)),
                    top:new Array(16).fill(Array.gen(13,10).map(n=>n*120+20))
                },
                attack:{
                    left:Array.gen(16).del(9,1).map(n=>n*120+20).map(n=>new Array(10).fill(n)),
                    top:new Array(16).fill(Array.gen(9).map(n=>n*120+20))
                }
            },
            width:80,//120N+20
            height:80,//120N+20
            frame:{
                moving:4,
                attack:10
            },
            //Only for moving status,override
            speed:12,
            HP:10,
            SP:350,
            damage:30,
            armor:0,
            plasma:0,
            sight:280,
            attackRange:70,
            attackInterval:1000,
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
    };
};
Protoss.DarkArchon=class DarkArchon extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
        this.direction=6;
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"DarkArchon",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*120+20).map(n=>new Array(10).fill(n)),
                    top:new Array(16).fill(Array.gen(9).map(n=>n*120+20))
                }
            },
            width:80,//120N+20
            height:80,//120N+20
            frame:{
                moving:10
            },
            //Only for moving status,override
            speed:12,
            HP:25,
            SP:200,
            armor:1,
            plasma:0,
            MP:200,
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
    };
};
Protoss.Shuttle=class Shuttle extends Unit{
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
            name:"Shuttle",
            imgPos:{
                moving:{
                    left:Array.gen(15).copyWithin(9,1).map(n=>n*60+5),
                    top:[...new Array(9).fill(5),...new Array(7).fill(65)]
                }
            },
            width:50,//60N+5
            height:50,//60N+5
            frame:{
                moving:1
            },
            //Only for moving status,override
            speed:11,
            HP:80,
            SP:60,
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
            die:Zerg.Overlord.prototype.die
        }
    };
};
Protoss.Reaver=class Reaver extends AttackableUnit{
    constructor(props){
        super(props);
        this.imgPos.attack=this.imgPos.dock;
        this.frame.attack=this.frame.dock;
        if (Multiplayer.ON) this.scarabNum=0;
        else this.scarabNum=(props.team!=Game.team)?999:0;
        //Override
        this.isReloaded=function(){
            return this.coolDown && this.scarabNum>0;
        };
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Reaver",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*84).map(n=>new Array(9).fill(n)),
                    top:new Array(16).fill(Array.gen(8).map(n=>n*84))
                },
                dock:{
                    left:Array.gen(16).del(9,1).map(n=>n*84),
                    top:new Array(16).fill(0)
                }
            },
            width:84,//84N
            height:84,//84N
            frame:{
                moving:9,
                dock:1
            },
            //Only for moving status,override
            speed:4,
            HP:100,
            SP:80,
            damage:100,
            armor:0,
            plasma:0,
            sight:350,
            attackRange:280,
            attackInterval:6000,
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
    };
};
Protoss.Observer=class Observer extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    };
    //Override
    dock(){
        //Use the same behavior
        Unit.hover.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Observer",
            imgPos:{
                moving:{
                    left:Array.gen(15).copyWithin(9,1).map(n=>n*40),
                    top:[...new Array(9).fill(0),...new Array(7).fill(40)]
                }
            },
            width:40,//40N
            height:40,//40N
            frame:{
                moving:1
            },
            //Only for moving status,override
            speed:8,
            HP:40,
            SP:20,
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
            upgrade:['UpgradeAirArmor','UpgradePlasmaShields']
        }
    };
};
Protoss.Scout=class Scout extends AttackableUnit{
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
            name:"Scout",
            imgPos:{
                moving:{
                    left:Array.gen(15).copyWithin(9,1).map(n=>n*72+8),
                    top:[...new Array(9).fill(8),...new Array(7).fill(152)]
                },
                attack:{
                    left:Array.gen(15).copyWithin(9,1).map(n=>n*72+8).map(n=>[n,n]),
                    top:[...new Array(9).fill([8,80]),...new Array(7).fill([152,224])]
                }
            },
            width:56,//72N+8
            height:56,//72N+8
            frame:{
                moving:1,
                attack:2
            },
            //Only for moving status,override
            speed:12,
            HP:150,
            SP:100,
            attackMode:{
                flying:{
                    attackRange:210,
                    attackInterval:2200,
                    damage:28,
                    attackType:AttackableUnit.BURST_ATTACK
                },
                ground:{
                    attackRange:105,
                    attackEffect:Burst.BlueShootSpark,
                    attackInterval:2200,
                    damage:8,
                    attackType:AttackableUnit.NORMAL_ATTACK
                },
                status:false
            },
            //Default
            damage:8,
            armor:0,
            plasma:0,
            sight:280,
            attackRange:105,
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
            upgrade:['UpgradeAirWeapons','UpgradeAirArmor','UpgradePlasmaShields']
        }
    };
};
Protoss.Carrier=class Carrier extends AttackableUnit{
    constructor(props){
        super(props);
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
    };
    //Override
    dock(){
        //Use the same behavior
        AttackableUnit.hover.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Carrier",
            imgPos:{
                moving:{
                    left:[0,2,4,6,8,11,13,15].repeat(2).map(n=>n*128),
                    top:[0,128].repeat(8,true)
                }
            },
            width:128,//128N(0,2,4,6,8,11,13,15)
            height:128,//128N
            frame:{
                moving:1
            },
            //Only for moving status,override
            speed:8,
            HP:300,
            SP:150,
            damage:6,
            armor:4,
            plasma:0,
            sight:385,
            attackRange:280,
            attackInterval:1000,
            recover:Building.ProtossBuilding.prototype.recover,
            interceptorCapacity:4,
            continuousAttack:{
                count:4,//8
                layout:function(bullet,num){
                    //Reassign location,surround target
                    let [centerX,centerY,radius]=[bullet.target.posX(),bullet.target.posY(),120];
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
            }
        }
    };
};
Protoss.Arbiter=class Arbiter extends AttackableUnit{
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
            name:"Arbiter",
            imgPos:{
                moving:{
                    left:Array.gen(15).copyWithin(9,1).map(n=>n*76),
                    top:[...new Array(9).fill(0),...new Array(7).fill(76)]
                }
            },
            width:76,//76N
            height:76,//76N
            frame:{
                moving:1
            },
            //Only for moving status,override
            speed:12,
            HP:200,
            SP:150,
            damage:10,
            armor:1,
            plasma:0,
            MP:200,
            sight:315,
            attackRange:175,
            attackInterval:4500,
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
            //Special skill:make nearby units invisible,need initial
            bufferObj:{}
        }
    };
};
Protoss.Corsair=class Corsair extends AttackableUnit{
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
            name:"Corsair",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*60),
                    top:new Array(16).fill(0)
                },
                attack:{
                    left:Array.gen(16).del(9,1).map(n=>n*60).map(n=>new Array(5).fill(n)),
                    top:new Array(16).fill(Array.gen(4).map(n=>n*60))
                }
            },
            width:60,//60N
            height:60,//60N
            frame:{
                moving:1,
                attack:5
            },
            //Only for moving status,override
            speed:16,
            HP:100,
            SP:80,
            damage:5,
            armor:1,
            plasma:0,
            MP:200,
            sight:315,
            attackRange:175,
            attackInterval:800,
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
            }
        }
    };
};
//Apply all protoProps
_$.classPackagePatch(Protoss);
