var Cheat={
    isShown:false,
    cwal:false,
    gathering:false,
    manUnlimited:false,
    handler:function(){
        if (Cheat.isShown){
            if (Multiplayer.ON){
                Multiplayer.webSocket.send(JSON.stringify({
                    type:'chat',
                    from:Game.team,
                    msg:$('input#cheatInput').val()
                }));
            }
            else {
                //Forbid cheating during replay
                if (!Game.replayFlag){
                    let cheatFlag=Cheat.execute($('input#cheatInput').val().toLowerCase());
                    if (cheatFlag) {
                        //Refresh control panel
                        Game.changeSelectedTo(Game.selectedUnit);
                        Game.showMessage('Cheat enabled');
                    }
                }
            }
            $('#cheat_Box').hide();
            $('input#cheatInput').val('');
            Cheat.isShown=false;
            KeyController.disable=false;
        }
        else {
            $('#cheat_Box').show();
            $('input#cheatInput').focus();
            Cheat.isShown=true;
            KeyController.disable=true;
        }
    },
    execute:function(cheatCode){
        //Forbid cheating when multiplayer mode
        if (Multiplayer.ON) return;
        let cheatFlag=true;
        switch (cheatCode){
            case "show me the money":
                Resource[Game.team].mine+=10000;
                Resource[Game.team].gas+=10000;
                break;
            case "black sheep wall":
                //Switch between show fog or not show
                Map.fogFlag=!Map.fogFlag;
                if (Map.fogFlag==false){
                    //Clear old fog on screen
                    Game.fogCxt.clearRect(0,0,Game.HBOUND,Game.VBOUND);
                    //Redraw mini-map
                    Map.drawFogAndMinimap();
                }
                break;
            case "something for nothing":
                //Upgrade all grades
                for (let grade in Upgrade){
                    Upgrade[grade].effect(Game.team);
                }
                break;
            case "full recovery":
                [...Unit.allOurUnits(),...Building.ourBuildings()].forEach(chara=>{
                    chara.life=chara.get('HP');
                    if (chara.SP) chara.shield=chara.get('SP');
                    if (chara.MP) chara.magic=chara.get('MP');
                });
                break;
            case "staying alive":
                Referee.winCondition=Referee.loseCondition=function(){
                    return false;
                };
                break;
            case "operation cwal":
                Cheat.cwal=!(Cheat.cwal);
                break;
            case "the gathering":
                Cheat.gathering=!(Cheat.gathering);
                break;
            case "food for thought":
                Cheat.manUnlimited=!(Cheat.manUnlimited);
                break;
            case "power overwhelming":
                if (Cheat.oldCalculateDamageBy){
                    let tempCalculateDamageBy= $.extend([],Cheat.oldCalculateDamageBy);
                    Cheat.oldCalculateDamageBy=[Unit.prototype.calculateDamageBy,Building.prototype.calculateDamageBy];
                    Unit.prototype.calculateDamageBy=tempCalculateDamageBy[0];
                    Building.prototype.calculateDamageBy=tempCalculateDamageBy[1];
                }
                else {
                    Cheat.oldCalculateDamageBy=[Unit.prototype.calculateDamageBy,Building.prototype.calculateDamageBy];
                    Unit.prototype.calculateDamageBy=function(enemyObj){
                        if (enemyObj.isEnemy && enemyObj.isEnemy()) return 0;
                        else return Cheat.oldCalculateDamageBy[0].call(this,enemyObj);
                    };
                    Building.prototype.calculateDamageBy=function(enemyObj){
                        if (enemyObj.isEnemy && enemyObj.isEnemy()) return 0;
                        else return Cheat.oldCalculateDamageBy[1].call(this,enemyObj);
                    };
                }
                break;
            case "big daddy":
                let daddy=new Hero.HeroCruiser({x:Map.offsetX+Game.HBOUND/2,y:Map.offsetY+Game.VBOUND/2});
                Game.changeSelectedTo(daddy);
                break;
            case "big mommy":
                let mommy=new Hero.Sarah({x:Map.offsetX+Game.HBOUND/2,y:Map.offsetY+Game.VBOUND/2});
                Game.changeSelectedTo(mommy);
                break;
            case "game over man":
            case "gg":
                Game.lose();
                break;
            case "there is no cow level":
            case "your gg":
                Game.win();
                break;
            case "fuck your mother":
                [...Unit.allEnemyUnits(),...Building.enemyBuildings()].forEach(chara=>{
                    chara.die();
                });
                break;
            case "fuck my asshole":
                [...Unit.allOurUnits(),...Building.ourBuildings()].forEach(chara=>{
                    chara.die();
                });
                break;
            case "liuda is god":
                Cheat.execute('black sheep wall');
                Referee.winCondition=Referee.loseCondition=function(){
                    return false;
                };
                [...Unit.allUnits,...Building.allBuildings].forEach(chara=>{
                    chara.die();
                });
                break;
            default:
                //Not match any of above cheating code
                cheatFlag=false;
                break;
        }
        return cheatFlag;
    }
};
