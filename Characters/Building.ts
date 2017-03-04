var Building=Gobj.extends({
    constructorPlus:function(props){
        //Add id for building
        this.id=Unit.currentID++;
        this.life=this.get('HP');
        if (this.SP) this.shield=this.get('SP');
        if (this.MP) this.magic=50;
        this.selected=false;
        this.isFlying=false;
        this.injuryAnimations=[];
        // Finish below after fully constructed, postpone
        var myself=this;
        Game.commandTimeout(function(){
            //Add this unit into Game
            Building.allBuildings.push(myself);
            //Show unit
            myself.dock();
        },0);
    },
    prototypePlus:{
        name:"Building",
        armor:0,
        sight:385,
        //Override to support multiple hidden frames
        animeFrame:function(){
            //Animation play
            this.action++;
            //Override Gobj here, building doesn't have direction
            var arrLimit=(this.imgPos[this.status].left instanceof Array)?(this.imgPos[this.status].left.length):1;
            if (this.action==this.frame[this.status] || this.action>=arrLimit) this.action=0;
            //Multiple hidden frames support
            if (this.imgPos[this.status].left[this.action]==-1) this.action=0;
        },
        //Dock means stop moving but keep animation
        dock:function(){
            //Clear old timer
            this.stop();
            //Launch new dock timer
            this.status="dock";
            var myself=this;
            var animateFrame=function(){
                //Only play animation, will not move
                myself.animeFrame();
            };
            this.allFrames['animate']=animateFrame;
        },
        //Cannot move
        moving:function(){
            //Nothing
        },
        //Override for sound effect
        die:function(){
            //Old behavior
            Gobj.prototype.die.call(this);
            this.life=0;
            //Clear all injury animations
            this.injuryAnimations.forEach(function(anime){
                anime.die();
            });
            //If has sound effect
            if (this.sound.death && this.insideScreen()) {
                this.sound.death.play();
            }
        },
        reactionWhenAttackedBy:function(enemy){
            //Cannot fight back or escape
            //Resign and give reward to enemy if has no life before dead
            if (this.life<=0) {
                //If multiple target, only die once and give reward
                if (this.status!="dead") {
                    //Killed by enemy
                    this.die();
                    //Give enemy reward
                    enemy.kill++;
                }
            }
        },
        //Fix bug, for consistent, cause 100% damage on building
        calculateDamageBy:function(enemyObj){
            return (enemyObj instanceof Gobj)?enemyObj.get('damage'):enemyObj;
        },
        //Calculate damage, for consistence
        getDamageBy:function(enemy,percent){
            if (percent==undefined) percent=1;//100% by default
            var damage=0;
            //If has SP and shield remain
            if (this.shield>0) {
                damage=((this.calculateDamageBy(enemy)-this.get('plasma'))*percent)>>0;
                if (damage<1) damage=1;
                this.shield-=damage;
                if (this.shield<0) {
                    //Inherit damage
                    this.life+=(this.shield);
                    this.shield=0;
                }
            }
            else {
                damage=((enemy.get('damage')-this.get('armor'))*percent)>>0;
                if (damage<1) damage=1;
                this.life-=damage;
            }
        },
        //Life status
        lifeStatus:function(){
            var lifeRatio=this.life/this.get('HP');
            return ((lifeRatio>0.7)?"green":(lifeRatio>0.3)?"yellow":"red");
        }
    }
});
//Store all buildings
Building.allBuildings=[];
Building.ourBuildings=function(){
    return Building.allBuildings.filter(function(chara){
        return !(chara.isEnemy());
    });
};
Building.enemyBuildings=function(){
    return Building.allBuildings.filter(function(chara){
        return chara.isEnemy();
    });
};

//Zerg buildings
Building.ZergBuilding=Building.extends({
    constructorPlus:function(props){
        this.sound={
            selected:new Audio(Game.CDN+'bgm/ZergBuilding.selected.wav'),
            death:new Audio(Game.CDN+'bgm/ZergBuilding.death.wav')
        };
        //Need draw mud for it
        Map.needRefresh="MAP";
    },
    prototypePlus: {
        //Add basic unit info
        name: "ZergBuilding",
        dieEffect:Burst.ZergBuildingBurst,
        injuryNames:['bloodA','bloodB','bloodC'],
        recover:function(){
            if (this.life<this.get('HP')) this.life+=0.5;
            if (this.magic!=null && this.magic<this.get('MP')) this.magic+=0.5;
        }
    }
});
//Terran buildings
Building.TerranBuilding=Building.extends({
    constructorPlus:function(props){
        this.sound={
            normal:new Audio(Game.CDN+'bgm/TerranBuilding.selected.wav'),
            onfire:new Audio(Game.CDN+'bgm/Building.onfire.wav'),
            death:new Audio(Game.CDN+'bgm/TerranBuilding.death.wav')
        };
        this.sound.selected=this.sound.normal;
    },
    prototypePlus: {
        //Add basic unit info
        name: "TerranBuilding",
        dieEffect:Burst.TerranBuildingBurst,
        injuryNames:['redFireL','redFireM','redFireR'],
        recover:function(){
            if (this.life<(this.get('HP')/4) && (this instanceof Building)) this.life--;
            if (this.magic!=null && this.magic<this.get('MP')) this.magic+=0.5;
        }
    }
});
//Protoss buildings
Building.ProtossBuilding=Building.extends({
    constructorPlus:function(props){
        this.sound={
            normal:new Audio(Game.CDN+'bgm/ProtossBuilding.selected.wav'),
            onfire:new Audio(Game.CDN+'bgm/Building.onfire.wav'),
            death:new Audio(Game.CDN+'bgm/ProtossBuilding.death.wav')
        };
        this.sound.selected=this.sound.normal;
    },
    prototypePlus: {
        //Add basic unit info
        name: "ProtossBuilding",
        plasma:0,
        dieEffect:Burst.ProtossBuildingBurst,
        injuryNames:['blueFireL','blueFireM','blueFireR'],
        recover:function(){
            if (this.shield<this.get('SP')) this.shield+=0.5;
            if (this.magic!=null && this.magic<this.get('MP')) this.magic+=0.5;
        }
    }
});
//Attackable interface
Building.Attackable={
    constructorPlus:function(props){
        this.bullet={};
        this.kill=0;
        this.target={};
        //Idle by default
        this.targetLock=false;
        //Can fire by default
        this.coolDown=true;
    },
    prototypePlus: {
        //Add basic unit info
        name:"AttackableBuilding",
        isInAttackRange:AttackableUnit.prototype.isInAttackRange,
        matchAttackLimit:AttackableUnit.prototype.matchAttackLimit,
        attack:function(enemy){
            //Cannot attack invisible unit or unit who mismatch your attack type
            if (enemy['isInvisible'+this.team] || !(this.matchAttackLimit(enemy))) {
                Referee.voice('pError').play();
                this.stopAttack();
                return;
            }
            if (enemy instanceof Gobj && enemy.status!="dead") {
                //Stop old attack and moving
                this.stopAttack();
                this.dock();
                //New attack
                this.target=enemy;
                var myself=this;
                var attackFrame=function(){
                    //If enemy already dead or becomes invisible or we just miss enemy
                    if (enemy.status=="dead" || enemy['isInvisible'+myself.team] || (myself.isMissingTarget && myself.isMissingTarget())) {
                        myself.stopAttack();
                        myself.dock();
                    }
                    else {
                        //Cannot come in until reload cool down, only dock down can finish attack animation
                        if (myself.isReloaded && myself.isReloaded()) {
                            //Load bullet
                            myself.coolDown=false;
                            //Cool down after attack interval
                            Game.commandTimeout(function(){
                                myself.coolDown=true;
                            },myself.get('attackInterval'));
                            //If AOE, init enemies
                            var enemies;
                            if (myself.AOE) {
                                //Get possible targets
                                switch(myself.attackLimit){
                                    case "flying":
                                        enemies=Unit.allUnits.filter(function(chara){
                                            return chara.team!=myself.team && chara.isFlying;
                                        });
                                        break;
                                    case "ground":
                                        var enemyUnits=Unit.allUnits.filter(function(chara){
                                            return chara.team!=myself.team && !(chara.isFlying);
                                        });
                                        var enemyBuildings=Building.allBuildings.filter(function(chara){
                                            return chara.team!=myself.team;
                                        });
                                        enemies=enemyUnits.concat(enemyBuildings);
                                        break;
                                    default:
                                        enemies=(Unit.allUnits.concat(Building.allBuildings)).filter(function(chara){
                                            return chara.team!=myself.team;
                                        });
                                        break;
                                }
                                //Range filter
                                switch (myself.AOE.type) {
                                    case "LINE":
                                        //Calculate inter-points between enemy
                                        var N=Math.ceil(myself.distanceFrom(enemy)/(myself.AOE.radius));
                                        enemies=enemies.filter(function(chara){
                                            for (var n=1;n<=N;n++){
                                                var X=myself.posX()+n*(enemy.posX()-myself.posX())/N;
                                                var Y=myself.posY()+n*(enemy.posY()-myself.posY())/N;
                                                if (chara.insideCircle({centerX:X>>0,centerY:Y>>0,radius:myself.AOE.radius})
                                                    && !chara['isInvisible'+myself.team]) {
                                                    return true;
                                                }
                                            }
                                            return false;
                                        });
                                        break;
                                    case "MULTIPLE":
                                    case "CIRCLE":
                                    //Default type is CIRCLE
                                    default:
                                        enemies=enemies.filter(function(chara){
                                            return chara.insideCircle(
                                                {centerX:enemy.posX(),centerY:enemy.posY(),radius:myself.AOE.radius})
                                                && !chara['isInvisible'+myself.team];
                                        })
                                }
                            }
                            //Show attack animation if has
                            if (myself.imgPos.attack) {
                                myself.action=0;
                                //Change status to show attack frame
                                myself.status="attack";
                                //Will return to dock after attack
                                Game.commandTimeout(function(){
                                    //If still show attack
                                    if (myself.status=="attack") {
                                        myself.status="dock";
                                        myself.action=0;
                                    }
                                },myself.frame.attack*100);//attackAnimation < attackInterval
                            }
                            //If has bullet
                            if (myself.Bullet) {
                                var fireBullet=function(){
                                    //Will shoot multiple bullets in one time
                                    if (myself.continuousAttack) {
                                        myself.bullet=[];
                                        for (var N=0;N<myself.continuousAttack.count;N++){
                                            var bullet=new myself.Bullet({
                                                from:myself,
                                                to:enemy
                                            });
                                            //Reassign bullets location
                                            if (myself.continuousAttack.layout) myself.continuousAttack.layout(bullet,N);
                                            if (myself.continuousAttack.onlyOnce && N!=(myself.continuousAttack.count/2>>0)) {
                                                bullet.noDamage=true;
                                            }
                                            bullet.fire();
                                            myself.bullet.push(bullet);
                                        }
                                    }
                                    else {
                                        if (myself.AOE && myself.AOE.type=="MULTIPLE"){
                                            for (var N=0;N<Math.min(myself.AOE.count,enemies.length);N++){
                                                new myself.Bullet({
                                                    from:myself,
                                                    to:enemies[N]
                                                }).fire();
                                            }
                                        }
                                        else {
                                            //Reload one new bullet
                                            myself.bullet=new myself.Bullet({
                                                from:myself,
                                                to:enemy
                                            });
                                            myself.bullet.fire();
                                        }
                                    }
                                };
                                if (myself.fireDelay) Game.commandTimeout(function(){
                                    fireBullet();
                                },myself.fireDelay);
                                else fireBullet();
                            }
                            //Else will cause damage immediately (melee attack)
                            else {
                                //Cause damage when burst appear, after finish whole melee attack action
                                if (myself.AOE) {
                                    enemies.forEach(function(chara){
                                        chara.getDamageBy(myself);
                                        chara.reactionWhenAttackedBy(myself);
                                    })
                                }
                                else {
                                    //Cause damage after finish whole melee attack action
                                    Game.commandTimeout(function(){
                                        enemy.getDamageBy(myself);
                                        enemy.reactionWhenAttackedBy(myself);
                                    },myself.frame.attack*100);
                                }
                            }
                            //If has attack effect (burst)
                            if (myself.attackEffect) {
                                if (myself.AOE && myself.AOE.hasEffect) {
                                    enemies.forEach(function(chara){
                                        new myself.attackEffect({x:chara.posX(),y:chara.posY()});
                                    })
                                }
                                else {
                                    new myself.attackEffect({x:enemy.posX(),y:enemy.posY()});
                                }
                            }
                            //Sound effect, missile attack unit will play sound when bullet fire
                            if (!myself.Bullet && myself.insideScreen()) myself.sound.attack.play();
                        }
                    }
                };
                this.allFrames['attack']=attackFrame;
            }
        },
        stopAttack:AttackableUnit.prototype.stopAttack,
        findNearbyTargets:function(){
            //Initial
            var myself=this;
            var units=Unit.allUnits.filter(function(chara){
                return chara.team!=myself.team;
            });
            var buildings=Building.allBuildings.filter(function(chara){
                return chara.team!=myself.team;
            });
            var results=[];
            var myX=myself.posX();
            var myY=myself.posY();
            [units,buildings].forEach(function(charas){
                charas=charas.filter(function(chara){
                    return !chara['isInvisible'+myself.team] && myself.isInAttackRange(chara) && myself.matchAttackLimit(chara);
                }).sort(function(chara1,chara2){
                    var X1=chara1.posX(),Y1=chara1.posY(),X2=chara2.posX(),Y2=chara1.posY();
                    return (X1-myX)*(X1-myX)+(Y1-myY)*(Y1-myY)-(X2-myX)*(X2-myX)-(Y2-myY)*(Y2-myY);
                });
                results=results.concat(charas);
            });
            //Only attack nearest one, unit prior to building
            return results;
        },
        highestPriorityTarget:AttackableUnit.prototype.highestPriorityTarget,
        AI:function(){
            //Dead unit doesn't have following AI
            if (this.status=='dead') return;
            //AI:Attack insight enemy automatically when alive
            if (this.isAttacking()) {
                // target ran out of attack range
                if (this.cannotReachTarget()) {
                    //Forgive target and find other target
                    this.stopAttack();
                    this.targetLock=false;
                }
            }
            else {
                //Find another in-range enemy
                var enemy=this.highestPriorityTarget();
                //Change target if has one
                if (enemy) this.attack(enemy);
            }
        },
        isAttacking:AttackableUnit.prototype.isAttacking,
        cannotReachTarget:function(){
            return !(this.isInAttackRange(this.target));
        },
        isMissingTarget:AttackableUnit.prototype.isMissingTarget,
        isReloaded:AttackableUnit.prototype.isReloaded,
        //Override for attackable unit
        die:function(){
            //Old behavior
            Building.prototype.die.call(this);
            //Clear new timer for unit
            this.stopAttack();
            this.selected=false;
        }
    }
};
//Define all buildings
Building.ZergBuilding.Hatchery=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        this.larvas=[];
    },
    prototypePlus: {
        //Add basic unit info
        name: "Hatchery",
        imgPos: {
            dock: {
                left: 20,
                top: 44
            }
        },
        width: 128,
        height: 94,
        frame: {
            dock: 1
        },
        HP: 1250,
        manPlus: 10,
        produceLarva:true,
        cost:{
            mine:300,
            time:1200
        },
        items: {
            '1':{name:'SelectLarva'},
            '2':{name:'SetRallyPoint'},
            '3':{name:'EvolveBurrow'},
            '7':{name:'Lair',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='SpawningPool';
                })
            }}
        },
        injuryOffsets:[{x:-18,y:12},{x:-12,y:-22},{x:18,y:12}],
        evolves: [
            {step:'ZergBuilding.MutationS',percent:0},
            {step:'ZergBuilding.MutationM',percent:0.5}
        ],
        buildZergBuilding:function(){
            var target=Building.ZergBuilding[this.buildName];
            var mutation=this.evolveTo({
                type:eval('Building.'+target.prototype.evolves[0].step),
                chain:true
            });
            mutation.buildName=this.buildName;
            //Calculate duration
            var duration=Resource.getCost(this.buildName).time;
            //Cheat: Operation cwal
            if (Cheat.cwal) duration=40;
            //Processing flag on transfer
            mutation.processing={
                name:mutation.buildName,
                startTime:Game.mainTick,//new Date().getTime()
                time:duration
            };
            //Evolve chain
            for (var N=1;N<target.prototype.evolves.length;N++){
                (function(n){
                    var evolveInfo=target.prototype.evolves[n];
                    Game.commandTimeout(function(){
                        if (mutation.status!='dead'){
                            //Evolve
                            var evolveTarget=(eval('Building.'+evolveInfo.step));
                            //Step is constructor function
                            if (evolveTarget){
                                var old=mutation;
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
                })(N);
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
    }
});
Building.ZergBuilding.Lair=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        this.larvas=[];
    },
    prototypePlus: {
        //Add basic unit info
        name: "Lair",
        imgPos: {
            dock: {
                left: 22,
                top: 172
            }
        },
        width: 136,
        height: 114,
        frame: {
            dock: 1
        },
        HP: 1800,
        manPlus: 10,
        produceLarva:true,
        cost:{
            mine:150,
            gas:100,
            time:1000
        },
        items: {
            '1':{name:'SelectLarva'},
            '2':{name:'SetRallyPoint'},
            '3':{name:'EvolveBurrow'},
            '4':{name:'EvolveVentralSacs'},
            '5':{name:'EvolveAntennas'},
            '6':{name:'EvolvePneumatizedCarapace'},
            '7':{name:'Hive',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='QueenNest';
                })
            }}
        },
        injuryOffsets:[{x:-22,y:14},{x:-12,y:-22},{x:22,y:14}],
        evolves: [
            {step:'ZergBuilding.MutationM',percent:0}
        ],
        buildZergBuilding:function(){
            Building.ZergBuilding.Hatchery.prototype.buildZergBuilding.call(this);
        }
    }
});
Building.ZergBuilding.Hive=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        this.larvas=[];
    },
    prototypePlus: {
        //Add basic unit info
        name: "Hive",
        imgPos: {
            dock: {
                left: 26,
                top: 300
            }
        },
        width: 130,
        height: 132,
        frame: {
            dock: 1
        },
        HP: 2500,
        manPlus: 10,
        produceLarva:true,
        cost:{
            mine:200,
            gas:150,
            time:1200
        },
        items: {
            '1':{name:'SelectLarva'},
            '2':{name:'SetRallyPoint'},
            '3':{name:'EvolveBurrow'},
            '4':{name:'EvolveVentralSacs'},
            '5':{name:'EvolveAntennas'},
            '6':{name:'EvolvePneumatizedCarapace'}
        },
        injuryOffsets:[{x:-26,y:16},{x:2,y:-32},{x:26,y:16}],
        evolves: [
            {step:'ZergBuilding.MutationM',percent:0},
            {step:'ZergBuilding.MutationL',percent:0.5}
        ]
    }
});
Building.ZergBuilding.CreepColony=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "CreepColony",
        imgPos: {
            dock: {
                left: 924,
                top: 544
            }
        },
        width: 72,
        height: 66,
        frame: {
            dock: 1
        },
        HP: 400,
        cost:{
            mine:75,
            time:200
        },
        items: {
            '7':{name:'SporeColony',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='EvolutionChamber';
                })
            }},
            '8':{name:'SunkenColony',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='SpawningPool';
                })
            }}
        },
        injuryOffsets:[{x:-14,y:8},{x:-4,y:-16},{x:20,y:8}],
        evolves: [
            {step:'ZergBuilding.MutationS',percent:0}
        ],
        buildZergBuilding:function(){
            Building.ZergBuilding.Hatchery.prototype.buildZergBuilding.call(this);
        }
    }
});
Building.ZergBuilding.SunkenColony=Building.ZergBuilding.extends(Building.Attackable).extends({
    constructorPlus:function(props){
        this.sound.attack=new Audio(Game.CDN+'bgm/Colony.attack.wav');
    },
    prototypePlus: {
        //Add basic unit info
        name: "SunkenColony",
        imgPos: {
            dock:{
                left:916,
                top:714
            },
            attack: {
                left:[20,116,212,308,404,500,596,692,788,884],
                top:[802,802,802,802,802,802,802,802,802,802]
            }
        },
        width: 84,//96N+20
        height: 66,
        frame: {
            dock: 1,
            attack:10
        },
        HP: 300,
        cost:{
            mine:50,
            time:200
        },
        //Attackable
        damage:40,
        attackRange: 245,
        attackInterval:2200,
        attackLimit:"ground",
        attackEffect:Burst.Sunken,
        attackType:AttackableUnit.BURST_ATTACK,
        injuryOffsets:[{x:-14,y:8},{x:-4,y:-12},{x:20,y:8}],
        evolves: [
            {step:'ZergBuilding.MutationS',percent:0}
        ]
    }
});
Building.ZergBuilding.SporeColony=Building.ZergBuilding.extends(Building.Attackable).extends({
    constructorPlus:function(props){
        this.imgPos.attack=this.imgPos.dock;
        this.frame.attack=this.frame.dock;
        this.sound.attack=new Audio(Game.CDN+'bgm/Colony.attack.wav');
    },
    prototypePlus: {
        //Add basic unit info
        name: "SporeColony",
        imgPos: {
            dock: {
                left: 924,
                top: 618
            }
        },
        width: 70,
        height: 80,
        frame: {
            dock: 1
        },
        HP: 400,
        detector:Gobj.detectorBuffer,
        cost:{
            mine:50,
            time:200
        },
        //Attackable
        damage:15,
        attackRange:245,
        attackInterval:1500,
        attackLimit:"flying",
        attackType:AttackableUnit.NORMAL_ATTACK,
        injuryOffsets:[{x:-14,y:8},{x:-12,y:-16},{x:14,y:8}],
        evolves: [
            {step:'ZergBuilding.MutationS',percent:0}
        ]
    }
});
Building.ZergBuilding.Extractor=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Extractor",
        imgPos: {
            dock: {
                left: 768,
                top: 26
            }
        },
        width: 128,
        height: 116,
        frame: {
            dock: 1
        },
        HP: 750,
        cost:{
            mine:50,
            time:400
        },
        injuryOffsets:[{x:-24,y:14},{x:-18,y:-16},{x:24,y:14}],
        evolves: [
            {step:'ZergBuilding.MutationL',percent:0}
        ]
    }
});
Building.ZergBuilding.SpawningPool=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "SpawningPool",
        imgPos: {
            dock: {
                left: 784,
                top: 210
            }
        },
        width: 100,
        height: 78,
        frame: {
            dock: 1
        },
        HP: 750,
        cost:{
            mine:150,
            time:800
        },
        items: {
            '1':{name:'EvolveMetabolicBoost'},
            '2':{name:'EvolveAdrenalGlands'}
        },
        injuryOffsets:[{x:-15,y:10},{x:0,y:-18},{x:15,y:10}],
        evolves: [
            {step:'ZergBuilding.MutationS',percent:0},
            {step:'ZergBuilding.MutationM',percent:0.5}
        ]
    }
});
Building.ZergBuilding.EvolutionChamber=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "EvolutionChamber",
        imgPos: {
            dock: {
                left: 1468,
                top: 684
            }
        },
        width: 100,
        height: 94,
        frame: {
            dock: 1
        },
        HP: 750,
        cost:{
            mine:75,
            time: 400
        },
        items: {
            '1':{name:'UpgradeMeleeAttacks'},
            '2':{name:'UpgradeMissileAttacks'},
            '3':{name:'EvolveCarapace'}
        },
        injuryOffsets:[{x:-18,y:12},{x:0,y:-22},{x:18,y:12}],
        evolves: [
            {step:'ZergBuilding.MutationS',percent:0},
            {step:'ZergBuilding.MutationM',percent:0.5}
        ]
    }
});
Building.ZergBuilding.HydraliskDen=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "HydraliskDen",
        imgPos: {
            dock: {
                left: 1472,
                top: 8
            }
        },
        width: 96,
        height: 104,
        frame: {
            dock: 1
        },
        HP: 850,
        cost:{
            mine:100,
            gas:50,
            time:400
        },
        items: {
            '1':{name:'EvolveMuscularAugments'},
            '2':{name:'EvolveGroovedSpines'},
            '4':{name:'EvolveLurkerAspect'}
        },
        injuryOffsets:[{x:-20,y:12},{x:0,y:-24},{x:20,y:12}],
        evolves: [
            {step:'ZergBuilding.MutationS',percent:0},
            {step:'ZergBuilding.MutationM',percent:0.5}
        ]
    }
});
Building.ZergBuilding.Spire=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Spire",
        imgPos: {
            dock: {
                left: 1486,
                top: 444
            }
        },
        width: 68,
        height: 102,
        frame: {
            dock: 1
        },
        HP: 600,
        cost:{
            mine:200,
            gas:150,
            time:1200
        },
        items: {
            '1':{name:'UpgradeFlyerAttacks'},
            '2':{name:'UpgradeFlyerCarapace'},
            '7':{name:'GreaterSpire',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='Hive';
                })
            }}
        },
        injuryOffsets:[{x:-20,y:18},{x:-12,y:-16},{x:20,y:18}],
        evolves: [
            {step:'ZergBuilding.MutationS',percent:0},
            {step:'ZergBuilding.MutationM',percent:0.5}
        ],
        buildZergBuilding:function(){
            Building.ZergBuilding.Hatchery.prototype.buildZergBuilding.call(this);
        }
    }
});
Building.ZergBuilding.GreaterSpire=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "GreaterSpire",
        imgPos: {
            dock: {
                left: 1484,
                top: 558
            }
        },
        width: 78,
        height: 102,
        frame: {
            dock: 1
        },
        HP: 1000,
        cost:{
            mine:100,
            gas:150,
            time: 1200
        },
        items: {
            '1':{name:'UpgradeFlyerAttacks'},
            '2':{name:'UpgradeFlyerCarapace'}
        },
        injuryOffsets:[{x:-20,y:22},{x:-12,y:-16},{x:20,y:22}],
        evolves: [
            {step:'ZergBuilding.MutationM',percent:0}
        ]
    }
});
Building.ZergBuilding.QueenNest=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "QueenNest",
        imgPos: {
            dock: {
                left: 1462,
                top: 236
            }
        },
        width: 84,
        height: 90,
        frame: {
            dock: 1
        },
        HP: 850,
        cost:{
            mine:150,
            gas:100,
            time: 600
        },
        items: {
            '1':{name:'EvolveSpawnBroodling'},
            '2':{name:'EvolveEnsnare'},
            '3':{name:'EvolveGameteMeiosis'}
        },
        injuryOffsets:[{x:-16,y:10},{x:-12,y:-20},{x:16,y:10}],
        evolves: [
            {step:'ZergBuilding.MutationS',percent:0},
            {step:'ZergBuilding.MutationM',percent:0.5}
        ]
    }
});
Building.ZergBuilding.NydusCanal=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "NydusCanal",
        imgPos: {
            dock: {
                left: 908,
                top: 444
            }
        },
        width: 72,
        height: 76,
        frame: {
            dock: 1
        },
        HP: 250,
        cost:{
            mine:150,
            time: 400
        },
        items: {
            '1':{name:'NydusCanal'}
        },
        injuryOffsets:[{x:-14,y:14},{x:-18,y:-18},{x:14,y:14}],
        evolves: [
            {step:'ZergBuilding.MutationS',percent:0},
            {step:'ZergBuilding.MutationM',percent:0.5}
        ]
    }
});
Building.ZergBuilding.UltraliskCavern=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "UltraliskCavern",
        imgPos: {
            dock: {
                left: 1468,
                top: 122
            }
        },
        width: 102,
        height: 98,
        frame: {
            dock: 1
        },
        HP: 600,
        cost:{
            mine:150,
            gas:200,
            time: 800
        },
        items: {
            '1':{name:'EvolveAnabolicSynthesis'},
            '2':{name:'EvolveChitinousPlating'}
        },
        injuryOffsets:[{x:-20,y:12},{x:-12,y:-24},{x:20,y:12}],
        evolves: [
            {step:'ZergBuilding.MutationS',percent:0},
            {step:'ZergBuilding.MutationM',percent:0.5}
        ]
    }
});
Building.ZergBuilding.DefilerMound=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "DefilerMound",
        imgPos: {
            dock: {
                left: 1458,
                top: 344
            }
        },
        width: 118,
        height: 90,
        frame: {
            dock: 1
        },
        HP: 850,
        cost:{
            mine:100,
            gas:100,
            time: 600
        },
        items: {
            '1':{name:'EvolvePlague'},
            '2':{name:'EvolveConsume'},
            '3':{name:'EvolveMetasynapticNode'}
        },
        injuryOffsets:[{x:-18,y:12},{x:-12,y:-22},{x:18,y:12}],
        evolves: [
            {step:'ZergBuilding.MutationS',percent:0},
            {step:'ZergBuilding.MutationM',percent:0.5}
        ]
    }
});
Building.ZergBuilding.InfestedBase=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "InfestedBase",
        noMud:true,
        imgPos: {
            dock: {
                left: 1160,
                top: 328
            }
        },
        width: 134,
        height: 108,
        frame: {
            dock: 1
        },
        HP: 1500,
        items: {
            '1':{name:'InfestedTerran'},
            '6':{name:'SetRallyPoint'}
        },
        injuryOffsets:[{x:-22,y:14},{x:-6,y:-26},{x:22,y:14}]
    }
});
Building.ZergBuilding.OvermindI=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "OvermindI",
        imgPos: {
            dock: {
                left: 6,
                top: 476
            }
        },
        width: 208,
        height: 122,
        frame: {
            dock: 1
        },
        HP: 3000,
        injuryOffsets:[{x:-24,y:15},{x:-6,y:-30},{x:24,y:15}]
    }
});
Building.ZergBuilding.OvermindII=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "OvermindII",
        imgPos: {
            dock: {
                left: 6,
                top: 626
            }
        },
        width: 208,
        height: 136,
        frame: {
            dock: 1
        },
        HP: 3000,
        injuryOffsets:[{x:-28,y:18},{x:-6,y:-34},{x:28,y:18}]
    }
});

Building.TerranBuilding.CommandCenter=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "CommandCenter",
        imgPos: {
            dock: {
                left: 0,
                top: 6
            }
        },
        width: 129,
        height: 106,
        frame: {
            dock: 1
        },
        HP: 1500,
        manPlus: 10,
        cost:{
            mine:400,
            time:1200
        },
        items: {
            '1':{name:'SCV'},
            '6':{name:'SetRallyPoint'},
            '7':{name:'ComstatStation',condition:function(){
                return (!Game.selectedUnit.attachment || Game.selectedUnit.attachment.status=='dead') && Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='Academy';
                })
            }},
            '8':{name:'NuclearSilo',condition:function(){
                return (!Game.selectedUnit.attachment || Game.selectedUnit.attachment.status=='dead') && Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='ConvertOps';
                })
            }},
            '9':{name:'LiftOff'}
        },
        injuryOffsets:[{x:-35,y:-30},{x:-2,y:-15},{x:35,y:-15}],
        evolves: [
            {step:'TerranBuilding.ConstructionL',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ],
        buildTerranBuilding:function(){
            var target=Building.TerranBuilding[this.buildName];
            var construction=new (eval('Building.'+target.prototype.evolves[0].step))
                ({x:this.x+this.width,y:this.y+this.height-target.prototype.height,team:this.team});
            construction.buildName=this.buildName;
            this.attachment=construction;
            Button.reset();
            //Calculate duration
            var duration=Resource.getCost(this.buildName).time;
            //Cheat: Operation cwal
            if (Cheat.cwal) duration=40;
            //Processing flag on transfer
            construction.processing={
                name:construction.buildName,
                startTime:Game.mainTick,//new Date().getTime()
                time:duration
            };
            var myself=this;
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
                                myself.attachment=construction;
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
                    myself.attachment=construction.evolveTo({
                        type:Building.TerranBuilding[construction.buildName]
                    });
                }
            },duration*100);
        }
    }
});
Building.TerranBuilding.SupplyDepot=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "SupplyDepot",
        imgPos: {
            dock: {
                left: [0,95,190,285,380],
                top: [292,292,292,292,292]
            }
        },
        width: 96,
        height: 76,
        frame: {
            dock: 5
        },
        HP: 500,
        manPlus: 8,
        cost:{
            mine:100,
            time:400
        },
        injuryOffsets:[{x:-20,y:-25},{x:0,y:-10},{x:25,y:-10}],
        injuryScale:0.8,
        evolves: [
            {step:'TerranBuilding.ConstructionS',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ]
    }
});
Building.TerranBuilding.Refinery=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Refinery",
        imgPos: {
            dock: {
                left: 256,
                top: 16
            }
        },
        width: 124,
        height: 96,
        frame: {
            dock: 1
        },
        HP: 500,
        cost:{
            mine:100,
            time:400
        },
        injuryOffsets:[{x:-26,y:-36},{x:0,y:10},{x:38,y:5}],
        evolves: [
            {step:'TerranBuilding.ConstructionR',percent:0},
            {step:'step2',percent:0.3},
            {step:'TerranBuilding.ConstructionF',percent:0.7}
        ]
    }
});
Building.TerranBuilding.Barracks=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Barracks",
        imgPos: {
            dock: {
                left: 128,
                top: 0
            }
        },
        width: 126,
        height: 110,
        frame: {
            dock: 1
        },
        HP: 1000,
        cost:{
            mine:150,
            time:800
        },
        items: {
            '1':{name:'Marine'},
            '2':{name:'Firebat',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='Academy';
                })
            }},
            '3':{name:'Ghost',condition:function(){
                //Has ScienceFacility with attachment ConvertOps
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='ScienceFacility'
                        && (chara.attachment && chara.attachment.status!='dead' && chara.attachment.name=='ConvertOps');
                });
            }},
            '4':{name:'Medic',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='Academy';
                })
            }},
            '6':{name:'SetRallyPoint'},
            '9':{name:'LiftOff'}
        },
        injuryOffsets:[{x:-25,y:-40},{x:35,y:0},{x:5,y:-5}],
        evolves: [
            {step:'TerranBuilding.ConstructionL',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ]
    }
});
Building.TerranBuilding.EngineeringBay=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "EngineeringBay",
        imgPos: {
            dock: {
                left: 380,
                top: 14
            }
        },
        width: 144,
        height: 98,
        frame: {
            dock: 1
        },
        HP: 850,
        cost:{
            mine:125,
            time:600
        },
        items: {
            '1':{name:'UpgradeInfantryWeapons'},
            '2':{name:'UpgradeInfantryArmors'}
        },
        injuryOffsets:[{x:-25,y:-40},{x:25,y:-10},{x:15,y:-50}],
        evolves: [
            {step:'TerranBuilding.ConstructionM',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ]
    }
});
Building.TerranBuilding.MissileTurret=Building.TerranBuilding.extends(Building.Attackable).extends({
    constructorPlus:function(props){
        this.imgPos.attack=this.imgPos.dock;
        this.frame.attack=this.frame.dock;
        this.sound.attack=new Audio(Game.CDN+'bgm/Wraith.attackF.wav');
    },
    prototypePlus: {
        //Add basic unit info
        name: "MissileTurret",
        imgPos: {
            dock: {
                left: [0, 44, 88, 132, 176, 220, 264, 308, 352, 396,
                    440, 484, 528, 572, 616, 660, 704, 748, 792],
                top: [368,368,368,368,368,368,368,368,368,368,
                    368,368,368,368,368,368,368,368,368]
            }
        },
        width: 44,
        height: 56,
        frame: {
            dock: 19
        },
        HP: 200,
        detector:Gobj.detectorBuffer,
        cost:{
            mine:100,
            time:300
        },
        //Attackable
        damage:20,
        attackRange: 245,
        attackInterval:1500,
        attackLimit:"flying",
        attackType:AttackableUnit.BURST_ATTACK,
        injuryOffsets:[{x:-10,y:-15},{x:10,y:-10},{x:0,y:12}],
        injuryScale:0.6,
        evolves: [
            {step:'TerranBuilding.ConstructionS',percent:0},
            {step:'TerranBuilding.ConstructionF',percent:0.5}
        ]
    }
});
Building.TerranBuilding.Academy=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Academy",
        imgPos: {
            dock: {
                left: 526,
                top: 16
            }
        },
        width: 92,
        height: 96,
        frame: {
            dock: 1
        },
        HP: 600,
        cost:{
            mine:150,
            time:800
        },
        items: {
            '1':{name:'ResearchU238Shells'},
            '2':{name:'ResearchStimPackTech'},
            '4':{name:'ResearchRestoration'},
            '5':{name:'ResearchOpticalFlare'},
            '6':{name:'ResearchCaduceusReactor'}
        },
        injuryOffsets:[{x:-20,y:-28},{x:26,y:-46},{x:16,y:12}],
        evolves: [
            {step:'TerranBuilding.ConstructionM',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ]
    }
});
Building.TerranBuilding.Bunker=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Bunker",
        imgPos: {
            dock: {
                left: 620,
                top: 50
            }
        },
        width: 96,
        height: 62,
        frame: {
            dock: 1
        },
        HP: 350,
        cost:{
            mine:100,
            time:300
        },
        items: {
            '8':{name:'Load'}
        },
        injuryOffsets:[{x:4,y:-24},{x:-26,y:-18},{x:20,y:-2}],
        injuryScale:0.8,
        evolves: [
            {step:'TerranBuilding.ConstructionS',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ]
    }
});
Building.TerranBuilding.Factory=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Factory",
        imgPos: {
            dock: {
                left: 716,
                top: 0
            }
        },
        width: 114,
        height: 112,
        frame: {
            dock: 1
        },
        HP: 1250,
        cost:{
            mine:200,
            gas:100,
            time:800
        },
        items: {
            '1':{name:'Vulture'},
            '2':{name:'Tank',condition:function(){
                var attach=Game.selectedUnit.attachment;
                return (attach && attach.status!='dead' && attach.name=='MachineShop');
            }},
            '3':{name:'Goliath',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='Armory';
                })
            }},
            '6':{name:'SetRallyPoint'},
            '7':{name:'MachineShop',condition:function(){
                return (!Game.selectedUnit.attachment || Game.selectedUnit.attachment.status=='dead');
            }},
            '9':{name:'LiftOff'}
        },
        injuryOffsets:[{x:-32,y:-38},{x:45,y:-26},{x:10,y:-32}],
        evolves: [
            {step:'TerranBuilding.ConstructionM',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ],
        buildTerranBuilding:function(){
            Building.TerranBuilding.CommandCenter.prototype.buildTerranBuilding.call(this);
        }
    }
});
Building.TerranBuilding.Starport=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Starport",
        imgPos: {
            dock: {
                left: 830,
                top: 4
            }
        },
        width: 108,
        height: 108,
        frame: {
            dock: 1
        },
        HP: 1300,
        cost:{
            mine:150,
            gas:100,
            time:700
        },
        items: {
            '1':{name:'Wraith'},
            '2':{name:'Dropship',condition:function(){
                var attach=Game.selectedUnit.attachment;
                return (attach && attach.status!='dead' && attach.name=='ControlTower');
            }},
            '3':{name:'Vessel',condition:function(){
                var attach=Game.selectedUnit.attachment;
                //Has attachment ControlTower, and has ScienceFacility
                return (attach && attach.status!='dead' && attach.name=='ControlTower')
                    && Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='ScienceFacility';
                })
            }},
            '4':{name:'BattleCruiser',condition:function(){
                var attach=Game.selectedUnit.attachment;
                //Has attachment ControlTower, and has ScienceFacility with attachment PhysicsLab
                return (attach && attach.status!='dead' && attach.name=='ControlTower')
                    && Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='ScienceFacility'
                        && (chara.attachment && chara.attachment.status!='dead' && chara.attachment.name=='PhysicsLab');
                    });
            }},
            '5':{name:'Valkyrie',condition:function(){
                var attach=Game.selectedUnit.attachment;
                //Has attachment ControlTower, and has Armory
                return (attach && attach.status!='dead' && attach.name=='ControlTower')
                    && Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='Armory';
                })
            }},
            '6':{name:'SetRallyPoint'},
            '7':{name:'ControlTower',condition:function(){
                return (!Game.selectedUnit.attachment || Game.selectedUnit.attachment.status=='dead');
            }},
            '9':{name:'LiftOff'}
        },
        injuryOffsets:[{x:-32,y:-10},{x:0,y:-10},{x:24,y:-35}],
        evolves: [
            {step:'TerranBuilding.ConstructionL',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ],
        buildTerranBuilding:function(){
            Building.TerranBuilding.CommandCenter.prototype.buildTerranBuilding.call(this);
        }
    }
});
Building.TerranBuilding.ScienceFacility=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ScienceFacility",
        imgPos: {
            dock: {
                left: 1042,
                top: 20
            }
        },
        width: 108,
        height: 92,
        frame: {
            dock: 1
        },
        HP: 850,
        cost:{
            mine:100,
            gas:150,
            time:600
        },
        items: {
            '1':{name:'ResearchEMPShockwaves'},
            '2':{name:'ResearchIrradiate'},
            '3':{name:'ResearchTitanReactor'},
            '7':{name:'ConvertOps',condition:function(){
                return (!Game.selectedUnit.attachment || Game.selectedUnit.attachment.status=='dead');
            }},
            '8':{name:'PhysicsLab',condition:function(){
                return (!Game.selectedUnit.attachment || Game.selectedUnit.attachment.status=='dead');
            }},
            '9':{name:'LiftOff'}
        },
        injuryOffsets:[{x:-28,y:-40},{x:28,y:-32},{x:-20,y:5}],
        evolves: [
            {step:'TerranBuilding.ConstructionM',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ],
        buildTerranBuilding:function(){
            Building.TerranBuilding.CommandCenter.prototype.buildTerranBuilding.call(this);
        }
    }
});
Building.TerranBuilding.Armory=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Armory",
        imgPos: {
            dock: {
                left: 938,
                top: 14
            }
        },
        width: 102,
        height: 98,
        frame: {
            dock: 1
        },
        HP: 750,
        cost:{
            mine:100,
            gas:50,
            time: 800
        },
        items: {
            '1':{name:'UpgradeVehicleWeapons'},
            '2':{name:'UpgradeShipWeapons'},
            '4':{name:'UpgradeVehicleArmors'},
            '5':{name:'UpgradeShipArmors'}
        },
        injuryOffsets:[{x:-30,y:12},{x:-8,y:-22},{x:20,y:-12}],
        evolves: [
            {step:'TerranBuilding.ConstructionM',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ]
    }
});
Building.TerranBuilding.ComstatStation=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ComstatStation",
        imgPos: {
            dock: {
                left: 0,
                top: 122
            }
        },
        width: 68,
        height: 62,
        frame: {
            dock: 1
        },
        HP: 750,
        MP: 200,
        cost:{
            mine:50,
            gas:50,
            time: 400
        },
        items:{
            '1':{name:'ScannerSweep'}
        },
        injuryOffsets:[{x:-12,y:-26},{x:16,y:0},{x:16,y:-20}],
        injuryScale:0.8,
        evolves: [
            {step:'TerranBuilding.ConstructionS',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ]
    }
});
Building.TerranBuilding.NuclearSilo=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "NuclearSilo",
        imgPos: {
            dock: {
                left: 282,
                top: 124
            }
        },
        width: 64,
        height: 60,
        frame: {
            dock: 1
        },
        HP: 600,
        cost:{
            mine:100,
            gas:100,
            time: 800
        },
        items:{
            '1':{name:'ArmNuclearSilo'}
        },
        injuryOffsets:[{x:-12,y:-26},{x:16,y:0},{x:16,y:-20}],
        injuryScale:0.8,
        evolves: [
            {step:'TerranBuilding.ConstructionS',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ]
    }
});
Building.TerranBuilding.MachineShop=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "MachineShop",
        imgPos: {
            dock: {
                left: 208,
                top: 112
            }
        },
        width: 74,
        height: 72,
        frame: {
            dock: 1
        },
        HP: 750,
        cost:{
            mine:50,
            gas:50,
            time: 400
        },
        items: {
            '1':{name:'ResearchIonThrusters'},
            '2':{name:'ResearchSpiderMines'},
            '3':{name:'ResearchSiegeTech'},
            '4':{name:'ResearchCharonBoosters'}
        },
        injuryOffsets:[{x:-12,y:-26},{x:16,y:0},{x:16,y:-20}],
        injuryScale:0.8,
        evolves: [
            {step:'TerranBuilding.ConstructionM',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ]
    }
});
Building.TerranBuilding.ControlTower=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ControlTower",
        imgPos: {
            dock: {
                left: 68,
                top: 120
            }
        },
        width: 72,
        height: 64,
        frame: {
            dock: 1
        },
        HP: 750,
        cost:{
            mine:50,
            gas:50,
            time: 400
        },
        items: {
            '1':{name:'ResearchCloakingField'},
            '2':{name:'ResearchApolloReactor'}
        },
        injuryOffsets:[{x:-12,y:-26},{x:16,y:0},{x:16,y:-20}],
        injuryScale:0.8,
        evolves: [
            {step:'TerranBuilding.ConstructionM',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ]
    }
});
Building.TerranBuilding.PhysicsLab=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "PhysicsLab",
        imgPos: {
            dock: {
                left: 348,
                top: 120
            }
        },
        width: 66,
        height: 64,
        frame: {
            dock: 1
        },
        HP: 600,
        cost:{
            mine:50,
            gas:50,
            time: 400
        },
        items: {
            '1':{name:'ResearchYamatoGun'},
            '2':{name:'ResearchColossusReactor'}
        },
        injuryOffsets:[{x:-12,y:-26},{x:16,y:0},{x:16,y:-20}],
        injuryScale:0.8,
        evolves: [
            {step:'TerranBuilding.ConstructionS',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ]
    }
});
Building.TerranBuilding.ConvertOps=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ConvertOps",
        imgPos: {
            dock: {
                left: 140,
                top: 132
            }
        },
        width: 68,
        height: 52,
        frame: {
            dock: 1
        },
        HP: 750,
        cost:{
            mine:50,
            gas:50,
            time: 400
        },
        items: {
            '1':{name:'ResearchLockdown'},
            '2':{name:'ResearchPersonalCloaking'},
            '4':{name:'ResearchOcularImplants'},
            '5':{name:'ResearchMoebiusReactor'}
        },
        injuryOffsets:[{x:-12,y:-26},{x:16,y:0},{x:16,y:-20}],
        injuryScale:0.8,
        evolves: [
            {step:'TerranBuilding.ConstructionS',percent:0},
            {step:'step2',percent:0.25},
            {step:'step3',percent:0.5},
            {step:'TerranBuilding.ConstructionF',percent:0.75}
        ]
    }
});
Building.TerranBuilding.CrashCruiser=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "CrashCruiser",
        imgPos: {
            dock: {
                left: 154,
                top: 440
            }
        },
        width: 106,
        height: 108,
        frame: {
            dock: 1
        },
        HP: 250,
        injuryOffsets:[{x:-8,y:-38},{x:24,y:-20},{x:-22,y:6}]
    }
});
Building.TerranBuilding.BigCannon=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "BigCannon",
        imgPos: {
            dock: {
                left: 0,
                top: 423
            }
        },
        width: 152,
        height: 110,
        frame: {
            dock: 1
        },
        HP: 500,
        injuryOffsets:[{x:-10,y:-40},{x:42,y:-30},{x:8,y:26}]
    }
});

Building.ProtossBuilding.Nexus=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Nexus",
        imgPos: {
            dock: {
                left: 24,
                top: 12
            }
        },
        width: 146,
        height: 136,
        frame: {
            dock: 1
        },
        HP: 750,
        SP: 750,
        manPlus: 10,
        cost:{
            mine:400,
            time:1200
        },
        items: {
            '1':{name:'Probe'},
            '6':{name:'SetRallyPoint'}
        },
        injuryOffsets:[{x:-10,y:-30},{x:0,y:36},{x:38,y:30}]
    }
});
Building.ProtossBuilding.Pylon=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Pylon",
        imgPos: {
            dock: {
                left: 454,
                top: 314
            }
        },
        width: 60,
        height: 68,
        frame: {
            dock: 1
        },
        HP: 300,
        SP: 300,
        manPlus: 8,
        cost:{
            mine:100,
            time:300
        },
        injuryOffsets:[{x:8,y:6},{x:0,y:-16},{x:0,y:0}],
        injuryScale:0.8
    }
});
Building.ProtossBuilding.Assimilator=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Assimilator",
        imgPos: {
            dock: {
                left: 300,
                top: 36
            }
        },
        width: 126,
        height: 100,
        frame: {
            dock: 1
        },
        HP: 450,
        SP: 450,
        cost:{
            mine:100,
            time:400
        },
        injuryOffsets:[{x:-18,y:-38},{x:40,y:-26},{x:20,y:-38}]
    }
});
Building.ProtossBuilding.Gateway=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Gateway",
        imgPos: {
            dock: {
                left: 580,
                top: 20
            }
        },
        width: 128,
        height: 110,
        frame: {
            dock: 1
        },
        HP: 500,
        SP: 500,
        cost:{
            mine:150,
            time:600
        },
        items: {
            '1':{name:'Zealot'},
            '2':{name:'Dragoon',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='CyberneticsCore';
                })
            }},
            '3':{name:'Templar',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='TemplarArchives';
                })
            }},
            '4':{name:'DarkTemplar',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='TemplarArchives';
                })
            }},
            '6':{name:'SetRallyPoint'}
        },
        injuryOffsets:[{x:0,y:-54},{x:-42,y:-24},{x:36,y:16}]
    }
});
Building.ProtossBuilding.Forge=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Forge",
        imgPos: {
            dock: {
                left: 210,
                top: 178
            }
        },
        width: 102,
        height: 80,
        frame: {
            dock: 1
        },
        HP: 550,
        SP: 550,
        cost:{
            mine:150,
            time:400
        },
        items: {
            '1':{name:'UpgradeGroundWeapons'},
            '2':{name:'UpgradeGroundArmor'},
            '3':{name:'UpgradePlasmaShields'}
        },
        injuryOffsets:[{x:23,y:-47},{x:-23,y:-4},{x:25,y:1}]
    }
});
Building.ProtossBuilding.PhotonCannon=Building.ProtossBuilding.extends(Building.Attackable).extends({
    constructorPlus:function(props){
        this.imgPos.attack=this.imgPos.dock;
        this.sound.attack=new Audio(Game.CDN+'bgm/Dragoon.attack.wav');
    },
    prototypePlus: {
        //Add basic unit info
        name: "PhotonCannon",
        imgPos: {
            dock: {
                left: [98,162,226,290,290,290,290,290,290],
                top: [320,320,320,320,320,320,320,320,320]
            }
        },
        width: 62,
        height: 54,
        frame: {
            dock: 1,
            attack: 9
        },
        HP: 100,
        SP: 100,
        detector:Gobj.detectorBuffer,
        cost:{
            mine:150,
            time:500
        },
        //Attackable
        damage:20,
        attackRange: 245,
        attackInterval:2200,
        attackType:AttackableUnit.NORMAL_ATTACK,
        fireDelay:400,
        injuryOffsets:[{x:-12,y:-18},{x:12,y:0},{x:12,y:-20}],
        injuryScale:0.8
    }
});
Building.ProtossBuilding.CyberneticsCore=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "CyberneticsCore",
        imgPos: {
            dock: {
                left: 314,
                top: 168
            }
        },
        width: 90,
        height: 88,
        frame: {
            dock: 1
        },
        HP: 500,
        SP: 500,
        cost:{
            mine:200,
            time:600
        },
        items: {
            '1':{name:'UpgradeAirWeapons'},
            '2':{name:'UpgradeAirArmor'},
            '3':{name:'DevelopSingularityCharge'}
        },
        injuryOffsets:[{x:-8,y:-36},{x:28,y:10},{x:-18,y:4}]
    }
});
Building.ProtossBuilding.ShieldBattery=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ShieldBattery",
        imgPos: {
            dock: {
                left: 360,
                top: 318
            }
        },
        width: 90,
        height: 64,
        frame: {
            dock: 1
        },
        HP: 200,
        SP: 200,
        MP: 200,
        cost:{
            mine:100,
            time:300
        },
        items:{
            '1':{name:'RechargeShields'}
        },
        injuryOffsets:[{x:-12,y:-32},{x:0,y:-20},{x:12,y:-8}],
        injuryScale:0.8
    }
});
Building.ProtossBuilding.RoboticsFacility=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "RoboticsFacility",
        imgPos: {
            dock: {
                left: 504,
                top: 166
            }
        },
        width: 96,
        height: 92,
        frame: {
            dock: 1
        },
        HP: 500,
        SP: 500,
        cost:{
            mine:200,
            gas:200,
            time:800
        },
        items: {
            '1':{name:'Shuttle'},
            '2':{name:'Reaver',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='RoboticsSupportBay';
                })
            }},
            '3':{name:'Observer',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='Observatory';
                })
            }},
            '6':{name:'SetRallyPoint'}
        },
        injuryOffsets:[{x:-18,y:-25},{x:12,y:10},{x:18,y:-15}]
    }
});
Building.ProtossBuilding.StarGate=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "StarGate",
        imgPos: {
            dock: {
                left: 708,
                top: 10
            }
        },
        width: 124,
        height: 116,
        frame: {
            dock: 1
        },
        HP: 600,
        SP: 600,
        cost:{
            mine:150,
            gas:150,
            time:700
        },
        items: {
            '1':{name:'Scout'},
            '2':{name:'Carrier',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='FleetBeacon';
                })
            }},
            '3':{name:'Arbiter',condition:function(){
                return Building.allBuildings.some(function(chara){
                    return !(chara.isEnemy()) && chara.name=='ArbiterTribunal';
                })
            }},
            '4':{name:'Corsair'},
            '6':{name:'SetRallyPoint'}
        },
        injuryOffsets:[{x:10,y:-65},{x:35,y:12},{x:-20,y:-42}]
    }
});
Building.ProtossBuilding.CitadelOfAdun=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "CitadelOfAdun",
        imgPos: {
            dock: {
                left: 114,
                top: 172
            }
        },
        width: 98,
        height: 86,
        frame: {
            dock: 1
        },
        HP: 450,
        SP: 450,
        cost:{
            mine:150,
            gas:100,
            time:600
        },
        items: {
            '1':{name:'DevelopLegEnhancements'}
        },
        injuryOffsets:[{x:-20,y:-30},{x:28,y:-40},{x:25,y:-8}]
    }
});
Building.ProtossBuilding.RoboticsSupportBay=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "RoboticsSupportBay",
        imgPos: {
            dock: {
                left: 6,
                top: 168
            }
        },
        width: 100,
        height: 88,
        frame: {
            dock: 1
        },
        HP: 450,
        SP: 450,
        cost:{
            mine:150,
            gas:100,
            time:300
        },
        items: {
            '1':{name:'UpgradeScarabDamage'},
            '2':{name:'IncreaseReaverCapacity'},
            '3':{name:'DevelopGraviticDrive'}
        },
        injuryOffsets:[{x:-20,y:-5},{x:5,y:10},{x:25,y:-5}],
        injuryScale:0.8
    }
});
Building.ProtossBuilding.FleetBeacon=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "FleetBeacon",
        imgPos: {
            dock: {
                left: 440,
                top: 26
            }
        },
        width: 136,
        height: 100,
        frame: {
            dock: 1
        },
        HP: 500,
        SP: 500,
        cost:{
            mine:300,
            gas:200,
            time: 600
        },
        items: {
            '1':{name:'DevelopApialSensors'},
            '2':{name:'DevelopGraviticThrusters'},
            '3':{name:'IncreaseCarrierCapacity'},
            '4':{name:'DevelopDistruptionWeb'},
            '5':{name:'DevelopArgusJewel'}
        },
        injuryOffsets:[{x:0,y:-55},{x:38,y:-42},{x:-26,y:-4}]
    }
});
Building.ProtossBuilding.TemplarArchives=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "TemplarArchives",
        imgPos: {
            dock: {
                left: 180,
                top: 24
            }
        },
        width: 114,
        height: 104,
        frame: {
            dock: 1
        },
        HP: 500,
        SP: 500,
        cost:{
            mine:150,
            gas:200,
            time:600
        },
        items: {
            '1':{name:'DevelopPsionicStorm'},
            '2':{name:'DevelopHallucination'},
            '3':{name:'DevelopKhaydarinAmulet'},
            '4':{name:'DevelopMindControl'},
            '5':{name:'DevelopMaelStorm'},
            '6':{name:'DevelopArgusTalisman'}
        },
        injuryOffsets:[{x:-18,y:-28},{x:42,y:18},{x:14,y:10}]
    }
});
Building.ProtossBuilding.Observatory=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Observatory",
        imgPos: {
            dock: {
                left: 0,
                top: 302
            }
        },
        width: 96,
        height: 82,
        frame: {
            dock: 1
        },
        HP: 250,
        SP: 250,
        cost:{
            mine:50,
            gas:100,
            time:300
        },
        items: {
            '1':{name:'DevelopGraviticBooster'},
            '2':{name:'DevelopSensorArray'}
        },
        injuryOffsets:[{x:32,y:-33},{x:-12,y:-26},{x:-16,y:10}]
    }
});
Building.ProtossBuilding.ArbiterTribunal=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ArbiterTribunal",
        imgPos: {
            dock: {
                left: 408,
                top: 176
            }
        },
        width: 94,
        height: 80,
        frame: {
            dock: 1
        },
        HP: 500,
        SP: 500,
        cost:{
            mine:200,
            gas:150,
            time: 600
        },
        items: {
            '1':{name:'DevelopRecall'},
            '2':{name:'DevelopStasisField'},
            '3':{name:'DevelopKhaydarinCore'}
        },
        injuryOffsets:[{x:-20,y:0},{x:5,y:-20},{x:28,y:8}],
        injuryScale:0.8
    }
});
Building.ProtossBuilding.TeleportGate=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "TeleportGate",
        imgPos: {
            dock: {
                left: 602,
                top: 132
            }
        },
        width: 126,
        height: 148,
        frame: {
            dock: 1
        },
        HP: 500,
        SP: 500,
        injuryOffsets:[{x:-14,y:30},{x:5,y:-16},{x:30,y:30}]
    }
});
Building.ProtossBuilding.Pyramid=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Pyramid",
        imgPos: {
            dock: {
                left: 620,
                top: 284
            }
        },
        width: 128,
        height: 120,
        frame: {
            dock: 1
        },
        HP: 1500,
        SP: 1500,
        injuryOffsets:[{x:-20,y:15},{x:5,y:-5},{x:28,y:23}]
    }
});
Building.ProtossBuilding.TeleportPoint=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "TeleportPoint",
        imgPos: {
            dock: {
                left: 516,
                top: 320
            }
        },
        width: 100,
        height: 64,
        frame: {
            dock: 1
        },
        HP: 100,
        SP: 100,
        injuryOffsets:[{x:-20,y:-10},{x:5,y:-30},{x:28,y:-2}],
        injuryScale:0.8
    }
});
//Evolve related
Building.ZergBuilding.Egg=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        this.sound={
            selected:new Audio(Game.CDN+'bgm/Egg.selected.wav'),
            death:new Audio(Game.CDN+'bgm/Egg.death.wav')
        };
        //Hidden frames
        this.action=13;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Egg",
        source: "Larva",
        portrait: "Egg",
        noMud:true,
        imgPos: {
            dock: {
                left: [2,38,74,110,146,182,218,254,290,326,362,398,-1,2,38,74,110,-1,291,329,367,405,442,480],
                top: [213,213,213,213,213,213,213,213,213,213,213,213,-1,173,173,173,173,-1,372,372,372,372,372,372]
            }
        },
        width: 36,
        height: 40,
        frame: {
            dock: 12
        },
        HP: 200,
        armor: 10,
        sight: 35,
        dieEffect: Burst.EggDeath
    }
});
Building.ZergBuilding.Cocoon=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        this.sound={
            selected:new Audio(Game.CDN+'bgm/Cocoon.selected.wav'),
            death:new Audio(Game.CDN+'bgm/Mutalisk.death.wav')
        };
        //Override default flyingFlag for building
        this.isFlying=true;
        //Hidden frames
        this.action=10;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Cocoon",
        source: "Larva",
        portrait: "Cocoon",
        noMud:true,
        imgPos: {
            dock: {
                left: [0,63,126,189,252,315,378,441,504,-1,0,63,126,189,252,315],
                top: [1105,1105,1105,1105,1105,1105,1105,1105,1105,-1,1060,1060,1060,1060,1060,1060]
            }
        },
        width: 62,
        height: 45,
        frame: {
            dock: 9
        },
        HP: 200,
        armor: 10,
        sight: 35,
        dieEffect: Burst.SmallZergFlyingDeath
    }
});
Building.ZergBuilding.MutationS=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Hidden frames
        this.action=7;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Mutation",
        imgPos: {
            dock: {
                left: [356, 516, 676, 836, 996, 1156, -1, 36, 36, 196, 196],
                top: [962, 962, 962, 962, 962, 962, -1, 962, 962, 962, 962]
            }
        },
        width: 88,//160N+36
        height: 84,
        frame: {
            dock: 6
        },
        HP: 200,
        armor: 0,
        sight: 350,
        evolveEffect: ['SmallMutationComplete']
    }
});
Building.ZergBuilding.MutationM=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Mutation",
        imgPos: {
            dock: {
                left: [20, 180, 340, 500, 660, 820],
                top: [1048,1048,1048,1048,1048,1048]
            }
        },
        width: 120,//160N+20
        height: 112,
        frame: {
            dock: 6
        },
        HP: 400,
        armor: 0,
        sight: 350,
        evolveEffect: ['MiddleMutationComplete']
    }
});
Building.ZergBuilding.MutationL=Building.ZergBuilding.extends({
    constructorPlus:function(props){
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Mutation",
        imgPos: {
            dock: {
                left: [0, 160, 320, 480, 640, 800],
                top: [1160,1160,1160,1160,1160,1160]
            }
        },
        width: 160,//160N
        height: 150,
        frame: {
            dock: 6
        },
        HP: 600,
        armor: 0,
        sight: 350,
        evolveEffect: ['LargeMutationComplete']
    }
});
Building.TerranBuilding.ConstructionS=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        this.imgPos.dock=this.imgPos.step1;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Construction",
        imgPos: {
            step1: {
                left: 798,
                top: 296
            },
            step2: {
                left: 894,
                top: 296
            },
            step3: {
                left: 990,
                top: 296
            }
        },
        width: 72,
        height: 70,
        frame: {
            step1: 1,
            step2: 1,
            step3: 1,
            dock: 1
        },
        HP: 400,
        armor: 0,
        sight: 350
    }
});
Building.TerranBuilding.ConstructionM=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        this.imgPos.dock=this.imgPos.step1;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Construction",
        imgPos: {
            step1: {
                left: 498,
                top: 296
            },
            step2: {
                left: 594,
                top: 296
            },
            step3: {
                left: 690,
                top: 296
            }
        },
        width: 96,
        height: 70,
        frame: {
            step1: 1,
            step2: 1,
            step3: 1,
            dock: 1
        },
        HP: 400,
        armor: 0,
        sight: 350
    }
});
Building.TerranBuilding.ConstructionL=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        this.imgPos.dock=this.imgPos.step1;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Construction",
        imgPos: {
            step1: {
                left: 276,
                top: 442
            },
            step2: {
                left: 404,
                top: 442
            },
            step3: {
                left: 540,
                top: 442
            }
        },
        width: 124,
        height: 86,
        frame: {
            step1: 1,
            step2: 1,
            step3: 1,
            dock: 1
        },
        HP: 400,
        armor: 0,
        sight: 350
    }
});
Building.TerranBuilding.ConstructionR=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        this.imgPos.dock=this.imgPos.step1;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Construction",
        imgPos: {
            step1: {
                left: 848,
                top: 366
            },
            step2: {
                left: 956,
                top: 366
            }
        },
        width: 108,
        height: 70,
        frame: {
            step1: 1,
            step2: 1,
            dock: 1
        },
        HP: 400,
        armor: 0,
        sight: 350
    }
});
Building.TerranBuilding.ConstructionF=Building.TerranBuilding.extends({
    constructorPlus:function(props){
        this.type=props.type;
        //Override imgPos
        this.imgPos=_$.clone(this.imgPos);
        this.imgPos.dock=this.imgPos[this.type];
        this.width=Building.TerranBuilding[this.type].prototype.width;
        this.height=Building.TerranBuilding[this.type].prototype.height;
        //Continue adjusting position after initialize
        if (props.target instanceof Gobj){
            this.x-=(this.width/2);
            this.y-=(this.height/2);
        }
    },
    prototypePlus: {
        //Add basic unit info
        name: "ConstructionSkeleton",
        imgPos: {
            CommandCenter: {
                left: 674,
                top: 440
            },
            SupplyDepot: {
                left: 1034,
                top: 118
            },
            Refinery: {
                left: 950,
                top: 434
            },
            Barracks: {
                left: 812,
                top: 432
            },
            EngineeringBay: {
                left: 772,
                top: 542
            },
            MissileTurret: {
                left: 877,
                top: 118
            },
            Academy: {
                left: 1042,
                top: 536
            },
            Bunker: {
                left: 930,
                top: 123
            },
            Factory: {
                left: 917,
                top: 530
            },
            Starport: {
                left: 782,
                top: 635
            },
            ScienceFacility: {
                left: 907,
                top: 641
            },
            Armory: {
                left: 1027,
                top: 634
            },
            ComstatStation: {
                left: 426,
                top: 122
            },
            NuclearSilo: {
                left: 576,
                top: 120
            },
            MachineShop: {
                left: 724,
                top: 114
            },
            ControlTower: {
                left: 648,
                top: 118
            },
            PhysicsLab: {
                left: 504,
                top: 116
            },
            ConvertOps: {
                left: 797,
                top: 122
            }
        },
        width: 0,
        height: 0,
        frame: {
            dock: 1
        },
        HP: 400,
        armor: 0,
        sight: 350
    }
});
Building.ProtossBuilding.ArchonEvolve=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Hidden frames
        this.action=7;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Archon",
        source: "Archon",
        portrait: "Archon",
        imgPos: {
            dock: {
                left: [1340,1460,1580,1700,1820,1940,-1,1100,1220],
                top: [1700,1700,1700,1700,1700,1700,-1,1700,1700]
            }
        },
        width: 80,
        height: 80,
        frame: {
            dock: 6
        },
        HP: 10,
        SP: 350,
        armor: 0,
        plasma:0,
        sight: 280,
        dieEffect: Burst.BigBlueExplode
    }
});
Building.ProtossBuilding.DarkArchonEvolve=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Hidden frames
        this.action=7;
    },
    prototypePlus: {
        //Add basic unit info
        name: "DarkArchon",
        source: "DarkArchon",
        portrait: "DarkArchon",
        imgPos: {
            dock: {
                left: [1340,1460,1580,1700,1820,1940,-1,1100,1220],
                top: [1220,1220,1220,1220,1220,1220,-1,1220,1220]
            }
        },
        width: 80,
        height: 80,
        frame: {
            dock: 6
        },
        HP: 25,
        SP: 200,
        armor: 1,
        plasma:0,
        sight: 350,
        dieEffect: Burst.BigBlueExplode
    }
});
Building.ProtossBuilding.WrapRift=Building.ProtossBuilding.extends({
    constructorPlus:function(props){
        //Hidden frames
        this.action=7;
    },
    prototypePlus: {
        //Add basic unit info
        name: "WrapRift",
        imgPos: {
            dock: {
                left: [10,74,150,234,328,418,-1,10,74,150,234,328,418],
                top: [722,722,722,722,722,722,-1,658,658,658,658,658,658]
            }
        },
        width: 64,
        height: 64,
        frame: {
            dock: 6
        },
        HP: 200,
        SP: 200,
        armor: 0,
        plasma:0,
        sight: 350
    }
});