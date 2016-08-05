var Multiplayer={
    ON:false,//by default
    webSocket:null,
    cmds:[],
    snapshotFlag:false,
    replaySnapshotFlag:true,
    getSocket:function(){
        if (window.WebSocket) {
            //ServerList: (1)HongKong:nvhae.com (3)Canada:104.128.82.12
            let webSocket=Multiplayer.webSocket=new WebSocket('ws://www.nvhae.com:28082');
            webSocket.onerror=function(){
                //Offline flag for Store&Forward
                Game.offline=true;
            };
            return webSocket;
        }
        else return null;
    },
    sendUserInfo:function(){
        let webSocket=Multiplayer.getSocket();
        if (webSocket) {
            webSocket.onopen=function(){
                webSocket.send(JSON.stringify({type:'login',level:Game.level,team:Game.team,version:navigator.userAgent,
                    platform:navigator.platform,language:navigator.language,size:{x:innerWidth,y:innerHeight}}));
                Multiplayer.statistic={left:0,right:0};
                //Test parse info
                let url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_='+Math.random();
                $.getJSON(url, function(data){
                    webSocket.send(JSON.stringify({
                        type:'log',log:"Isp("+data.Isp+"), Browser("+data.Browser+"), OS("+data.OS+")"}));
                });
                //Test snapshot
                if (Multiplayer.snapshotFlag){
                    let N=1;
                    setInterval(function(){
                        webSocket.send(JSON.stringify({
                            type:'snapshot',
                            units:Unit.allUnits.sort(function(u1,u2){
                                if (u1.team==u2.team) return u1.name.localeCompare(u2.name);
                                else return u1.team-u2.team;
                            }).map(chara=>{
                                let result=(chara.name+' HP'+chara.life+' T'+chara.team+' ['+(chara.x>>0)+','+(chara.y>>0)+']');
                                if (chara.magic!=null) result+=' M'+chara.magic;
                                return result;
                            }),
                            buildings:Building.allBuildings.sort(function(b1,b2){
                                if (b1.team==b2.team) return b1.name.localeCompare(b2.name);
                                else return b1.team-b2.team;
                            }).map(chara=>{
                                return chara.name+' HP'+chara.life+' T'+chara.team+' ['+(chara.x>>0)+','+(chara.y>>0)+']';
                            }),
                            click:{left:Multiplayer.statistic.left,right:Multiplayer.statistic.right},
                            count:{ourUnits:Unit.allOurUnits().length,enemyUnits:Unit.allEnemyUnits().length,
                                ourBuildings:Building.ourBuildings().length,enemyBuildings:Building.enemyBuildings().length},
                            num:N
                        }));
                        //Reset click statistic
                        Multiplayer.statistic={left:0,right:0};
                        N++;
                    },60000);
                }
                //Test replay record every 10 seconds
                if (Multiplayer.replaySnapshotFlag) {
                    setInterval(function(){
                        webSocket.send(JSON.stringify({
                            type:'replaySnapshot',
                            replaySnapshot:{
                                team:Game.team,
                                level:Game.level,
                                cmds:Game.replay,
                                end:Game.mainTick
                            }
                        }));
                    },10000);
                }
            };
        }
    },
    enable:function(){
        let webSocket=Multiplayer.getSocket();
        if (webSocket) {
            webSocket.onopen=function(){
                Game.showMessage("Already connected to server!");
            };
            webSocket.onclose=function(){
                Game.showMessage("You've disconnected from server!");
            };
            webSocket.onerror=function(){
                Game.showMessage("Cannot connect to server...");
            };
            webSocket.onmessage=function(message){
                let msgObj=JSON.parse(message.data);
                switch(msgObj.type){
                    case "ping":
                        Multiplayer.webSocket.send(JSON.stringify({type:'pong'}));
                        console.log('Receive ping');
                        break;
                    case "notice":
                        Game.showMessage(msgObj.msg);
                        break;
                    case "start":
                        //Choose team
                        Game.team=msgObj.team;
                        //Bind controller
                        MouseController.toControlAll();//Can control all units
                        KeyController.start();//Start monitor
                        Game.animation();
                        break;
                    case "replay":
                        Game.saveReplay(msgObj.replay);
                        break;
                    case "tick":
                        Game.serverTick=msgObj.tick;
                        Multiplayer.parseTickCmd(msgObj);
                        break;
                }
            };
            Multiplayer.ON=true;
        }
        else {
            Game.showMessage("Your browser doesn't support WebSocket...");
        }
    },
    parseTickCmd:function({cmds,tick}){
        if (cmds){
            if (!Game.commands[tick]) Game.commands[tick]=[];
            cmds.forEach(function(cmdStr){
                let cmd=JSON.parse(cmdStr);
                switch (cmd.type){
                    case 'rightClick':
                        Game.commands[tick].push(function(){
                            //Closures
                            let {uids,pos,unlock,btn}=cmd;
                            return function(){
                                let charas=Multiplayer.getUnitsByUIDs(uids);
                                MouseController.rightClickHandler(charas,pos,unlock,btn);
                            };
                        }());
                        break;
                    case 'stop':
                        Game.commands[tick].push(function(){
                            //Closures
                            let uids=cmd.uids;
                            return function(){
                                let charas=Multiplayer.getUnitsByUIDs(uids);
                                Button.stopHandler(charas);
                            };
                        }());
                        break;
                    case 'hold':
                        Game.commands[tick].push(function(){
                            //Closures
                            let uids=cmd.uids;
                            return function(){
                                let charas=Multiplayer.getUnitsByUIDs(uids);
                                Button.holdHandler(charas);
                            };
                        }());
                        break;
                    case 'magic':
                        //Scarab and Interceptor
                        if (cmd.duration){
                            Game.commands[tick].push(function(){
                                //Closures
                                let {uids,name,duration}=cmd;
                                return function(){
                                    let owner=Multiplayer.getUnitsByUIDs(uids)[0];
                                    if (owner && Resource.paypal.call(owner,Resource.getCost(name))){
                                        //Cheat: Operation cwal
                                        if (Cheat.cwal) duration=0;
                                        Game.commandTimeout(function(){
                                            Magic[name].spell.call(owner);
                                            delete owner.processing;
                                        },duration*100);
                                        //Occupy flag
                                        owner.processing={
                                            name:name,
                                            startTime:Game.mainTick,
                                            time:duration
                                        };
                                    }
                                };
                            }());
                        }
                        //Normal magic
                        else {
                            Game.commands[tick].push(function(){
                                //Closures
                                let {uids,name,pos,creditBill}=cmd;
                                return function(){
                                    let owner=Multiplayer.getUnitsByUIDs(uids)[0];
                                    if (owner){
                                        //Need callback with location
                                        if (pos) {
                                            //Spell magic with location in multiplayer mode
                                            if (creditBill) owner.creditBill=creditBill;
                                            Magic[name].spell.call(owner,pos);
                                        }
                                        //Execute magic immediately
                                        else {
                                            if (Resource.paypal.call(owner,Resource.getCost(name))){
                                                Magic[name].spell.call(owner);
                                            }
                                        }
                                    }
                                };
                            }());
                        }
                        break;
                    case 'upgrade':
                        if (cmd.duration){
                            Game.commands[tick].push(function(){
                                //Closures
                                let {uids,name,duration,team}=cmd;
                                return function(){
                                    let owner=Multiplayer.getUnitsByUIDs(uids)[0];
                                    //Still owner alive and can afford payment
                                    if (owner && Resource.paypal.call(owner,Resource.getCost(name))){
                                        //Cheat: Operation cwal
                                        if (Cheat.cwal) duration=0;
                                        Game.commandTimeout(function(){
                                            Upgrade[name].effect(team);
                                            delete owner.processing;
                                            if (team==Game.team){
                                                Referee.voice.upgrade[Game.race.selected].play();
                                                Game.refreshInfo();
                                                Game.showMessage('Upgrade complete');
                                            }
                                        },duration*100);
                                        //Occupy flag
                                        owner.processing={
                                            name:name,
                                            startTime:Game.mainTick,
                                            time:duration
                                        };
                                    }
                                };
                            }());
                        }
                        else {
                            Game.commands[tick].push(function(){
                                //Closures
                                let {name,team}=cmd;
                                return function(){
                                    //Will effect immediately
                                    Upgrade[name].effect(team);
                                };
                            }());
                        }
                        break;
                    case 'unit':
                        if (cmd.evolve){
                            Game.commands[tick].push(function(){
                                //Closures
                                let {uids,name:unitType,duration}=cmd;
                                switch (cmd.evolve){
                                    case 'archon':
                                        return function(){
                                            let chara=Multiplayer.getUnitsByUIDs(uids)[0];
                                            if (chara && Resource.paypal.call(chara,Resource.getCost(unitType))){
                                                //Evolve as Archon or DarkArchon
                                                let evolve=chara.evolveTo({type:Building.ProtossBuilding[unitType+'Evolve']});
                                                Game.commandTimeout(function(){
                                                    if (evolve.status!='dead'){
                                                        evolve.evolveTo({type:Protoss[unitType],burstArr:[unitType+'Birth']});
                                                    }
                                                },duration*100);
                                                //Processing flag
                                                evolve.processing={
                                                    name:unitType,
                                                    startTime:Game.mainTick,
                                                    time:duration
                                                };
                                            }
                                        };
                                    case 'zerg':
                                        let exceptions=['Guardian','Devourer'];//Closure
                                        return function(){
                                            let chara=Multiplayer.getUnitsByUIDs(uids)[0];
                                            if (chara && Resource.paypal.call(chara,Resource.getCost(unitType))){
                                                //Evolve as egg
                                                let egg;
                                                //Clossure: which base larvas belong to
                                                let base=chara.owner;
                                                //Evolve as cocoon
                                                if (exceptions.indexOf(unitType)!=-1){
                                                    egg=chara.evolveTo({type:Building.ZergBuilding.Cocoon});
                                                }
                                                else {
                                                    egg=chara.evolveTo({type:Building.ZergBuilding.Egg});
                                                    if (unitType=='Lurker') egg.action=18;
                                                }
                                                //Cheat: Operation cwal
                                                if (Cheat.cwal) duration=0;
                                                Game.commandTimeout(function(){
                                                    if (egg.status!='dead'){
                                                        //Evolve
                                                        if (exceptions.indexOf(unitType)!=-1){
                                                            //Cocoon
                                                            egg.evolveTo({type:Zerg[unitType],burstArr:[unitType+'Birth']});
                                                        }
                                                        else {
                                                            //Egg
                                                            egg.evolveTo({type:Zerg[unitType],burstArr:['EggBirth',unitType+'Birth'],rallyPoint:base?base.rallyPoint:null});
                                                        }
                                                    }
                                                },duration*100);
                                                //Processing flag on egg
                                                egg.processing={
                                                    name:unitType,
                                                    startTime:Game.mainTick,//new Date().getTime()
                                                    time:duration
                                                };
                                            }
                                        };
                                }
                            }());
                        }
                        else Game.commands[tick].push(function(){
                            //Closures
                            let {uids,name:unitType,duration}=cmd;
                            //Find unit name from which race
                            let Race;
                            [Zerg,Terran,Protoss,Hero].forEach(function(race){
                                if (race[unitType]!=null) Race=race;
                            });
                            return function(){
                                let owner=Multiplayer.getUnitsByUIDs(uids)[0];
                                if (owner && Resource.paypal.call(owner,Resource.getCost(unitType))){
                                    //Cheat: Operation cwal
                                    if (Cheat.cwal) duration=0;
                                    Game.commandTimeout(function(){
                                        let trainedUnit;
                                        if (Race[unitType].prototype.isFlying)
                                            trainedUnit=new Race[unitType]({x:owner.x,y:owner.y,team:owner.team});
                                        else
                                            trainedUnit=new Race[unitType]({x:owner.x,y:owner.y+owner.height,team:owner.team});
                                        delete owner.processing;
                                        if (owner.rallyPoint) trainedUnit.destination=owner.rallyPoint;
                                    },duration*100);
                                    //Occupy flag
                                    owner.processing={
                                        name:unitType,
                                        startTime:Game.mainTick,
                                        time:duration
                                    };
                                }
                            };
                        }());
                        break;
                    case 'build':
                        Game.commands[tick].push(function(){
                            //Closures
                            let {uids,name:buildName,buildType:BuildType,pos}=cmd;
                            return function(){
                                let farmer=Multiplayer.getUnitsByUIDs(uids)[0];
                                if (farmer && Resource.paypal.call(farmer,Resource.getCost(buildName))){
                                    //Destination building name
                                    farmer.buildName=buildName;
                                    //Farmer build with location
                                    if (pos) farmer[`build${BuildType}`](pos);
                                    //Evolve to another building
                                    else farmer[`build${BuildType}`]();
                                }
                            };
                        }());
                        break;
                }
            });
        }
    },
    getUIDs:function(charas){
        return charas.map(chara=>chara.id);
    },
    getUnitsByUIDs:function(uids){
        return [...Unit.allUnits,...Building.allBuildings].filter(chara=>{
            //Need filter out dead units to execute commands
            return uids.indexOf(chara.id)!=-1 && chara.status!='dead';
        });
    }
};