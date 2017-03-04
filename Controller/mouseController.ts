var mouseController={
    down:false,
    drag:false,
    startPoint:{x:0,y:0},
    endPoint:{x:0,y:0},
    isMultiSelect:function(){
      return keyController.shift;
    },
    isJoinTeam:function(){
        return keyController.ctrl;
    },
    leftClick:function(event){
        //Mouse at (clickX,clickY)
        var offset=$('#fogCanvas').offset();
        var clickX=event.pageX-offset.left;
        var clickY=event.pageY-offset.top;
        //Intercept event inside infoBox
        if (clickY>Game.infoBox.y) return;
        //Selection mode
        if (Button.callback==null) {
            //Find selected one, convert position
            var selectedOne=Game.getSelectedOne(clickX+Map.offsetX,clickY+Map.offsetY);
            //Cannot select enemy invisible unit
            if ((selectedOne instanceof Gobj) && selectedOne['isInvisible'+Game.team] && selectedOne.isEnemy()) return;
            //Single select will unselect all units and only choose selected one
            //Multi select will keep selected status and do nothing
            if (!mouseController.isMultiSelect())
                Game.unselectAll();
            //If has selected one
            if (selectedOne instanceof Gobj) {
                //Sound effect
                if (!(selectedOne.isEnemy())) selectedOne.sound.selected.play();
                //Cannot multiSelect with enemy
                if (selectedOne.isEnemy() || (Game.selectedUnit.isEnemy && Game.selectedUnit.isEnemy()))
                    Game.unselectAll();
                //Only selected one to show portrait
                Game.changeSelectedTo(selectedOne);
                //Add into allSelected if not included
                Game.addIntoAllSelected(selectedOne);
            }
            else {
                //Click null
                Game.changeSelectedTo({});
                Game.unselectAll();
            }
        }
        //Button mode
        else {
            //Callback
            Button.execute(event);
        }
        //Hide tooltip when click
        $('div.tooltip_Box').hide();
        //Login user statistic
        if (Multiplayer.statistic!=null) Multiplayer.statistic.left++;
    },
    rightClick:function(event,unlock,btn){
        //Mouse at (clickX,clickY)
        var offset=$('#fogCanvas').offset();
        var clickX=event.pageX-offset.left;
        var clickY=event.pageY-offset.top;
        //Intercept event inside infoBox
        if (clickY>Game.infoBox.y) return;
        //Show right click cursor
        var pos={x:(clickX+Map.offsetX),y:(clickY+Map.offsetY)};
        new Burst.RightClickCursor(pos);
        var charas=Game.allSelected.filter(function(chara){
            //Can only control our alive unit
            return chara.team==Game.team && chara.status!="dead";
        });
        //Handle user right click
        Multiplayer.cmds.push(JSON.stringify({
            uids:Multiplayer.getUIDs(charas),
            type:'rightClick',
            pos:pos,
            unlock:Boolean(unlock),
            btn:btn
        }));
        //Login user statistic
        if (Multiplayer.statistic!=null) Multiplayer.statistic.right++;
    },
    rightClickHandler:function(charas,pos,unlock,btn){
        //Find selected one or nothing
        var selectedEnemy=(charas.length>0)?Game.getSelectedOne(pos.x,pos.y,charas[0].team.toString()):null;
        charas.forEach(function(chara){
            //Sound effect
            if (!chara.isEnemy() && chara.sound.moving) chara.sound.moving.play();
            //Interrupt old destination routing
            if (chara.destination) {
                //Break possible dead lock
                if (chara.destination.next) chara.destination.next=null;
                delete chara.destination;
            }
            //Cancel possible hold
            if (chara.hold) {
                delete chara.AI;
                delete chara.findNearbyTargets;
                delete chara.hold;
                Button.refreshButtons();
            }
            //Unit cannot attack will always choose move mode
            var attackOrMove=(chara.attack)?(selectedEnemy instanceof Gobj):false;
            //Attack mode
            if (attackOrMove) {
                if (chara.cannotMove() && !(chara.isInAttackRange(selectedEnemy))) return;
                //Intercept invisible enemy
                if (selectedEnemy['isInvisible'+Game.team]) {
                    if (!chara.isEnemy()) Referee.voice('pError').play();
                    return;
                }
                chara.targetLock=true;
                chara.attack(selectedEnemy);
            }
            //Move mode
            else {
                if (chara.cannotMove()) return;
                //Only attackable units can stop attack
                if (chara.attack) chara.stopAttack();
                //Lock destination by default
                chara.targetLock=!unlock;
                chara.moveTo(pos.x,pos.y);
                //Record destination
                if (btn=='attack') {
                    chara.destination={x:pos.x,y:pos.y};
                }
                if (btn=='patrol') {
                    //Patrol dead lock
                    chara.destination={x:pos.x,y:pos.y};
                    chara.destination.next={x:chara.posX(),y:chara.posY(),next:chara.destination};
                }
            }
        });
    },
    dblClick:function(){
        //Multi select same type units
        if (!(Game.selectedUnit.isEnemy && Game.selectedUnit.isEnemy())) {
            var charas=Unit.allUnits.filter(function(chara){
                return !(chara.isEnemy()) && chara.insideScreen() && (chara.name==Game.selectedUnit.name);
            });
            Game.addIntoAllSelected(charas);
        }
    },
    //Can control all units
    toControlAll:function(){
        //For desktop
        if (!Game.isApp){
            //Mouse left click
            $('#fogCanvas')[0].onclick=function(event){
                event.preventDefault();
                if (mouseController.drag) {
                    //End drag, onclick triggered after onmouseup, don't do default left click action
                    mouseController.drag=false;
                }
                else {
                    mouseController.leftClick(event);
                }
            };
            //Mouse right click
            $('#fogCanvas')[0].oncontextmenu=function(event){
                //Prevent context menu show
                event.preventDefault();
                //Should not control units during replay
                if (Game.replayFlag) return;
                mouseController.rightClick(event);
                //Cancel pointer
                $('div.GameLayer').removeAttr('status');
                //Cancel callback
                Button.callback=null;
            };
            //Double click
            $('#fogCanvas')[0].ondblclick=function(event){
                //Prevent screen select
                event.preventDefault();
                mouseController.dblClick();
            };
            //Mouse click start
            $('#fogCanvas')[0].onmousedown=function(event){
                event.preventDefault();
                //Do not allow rectangular-multi-select with right click, only left clicks
                if (event.which === 3){
                    return;
                }
                if (!mouseController.down) {
                    //Mouse at (clickX,clickY)
                    var clickX=event.pageX-$('#fogCanvas').offset().left;
                    var clickY=event.pageY-$('#fogCanvas').offset().top;
                    mouseController.startPoint={x:clickX,y:clickY};
                    mouseController.down=true;
                }
            };
            //Mouse drag
            $('#fogCanvas')[0].onmousemove=function(event){
                event.preventDefault();
                if (mouseController.down) {
                    //Mouse at (clickX,clickY)
                    var clickX=event.pageX-$('#fogCanvas').offset().left;
                    var clickY=event.pageY-$('#fogCanvas').offset().top;
                    mouseController.endPoint={x:clickX,y:clickY};
                    if (Math.abs(clickX-mouseController.startPoint.x)>5 &&
                        Math.abs(clickY-mouseController.startPoint.y)>5) {
                        mouseController.drag=true;
                    }
                }
            };
            //Global client refresh map
            window.onmousemove=function(event){
                event.preventDefault();
                //Mouse at (clickX,clickY)
                mouseController.mouseX=event.clientX;
                mouseController.mouseY=event.clientY;
            };
            //Mouse click end
            $('#fogCanvas')[0].onmouseup=function(event){
                event.preventDefault();
                mouseController.down=false;
                if (mouseController.drag) {
                    //Multi select inside rect
                    Game.multiSelectInRect();
                }
            };
        }
        //For mobile
        else {
            $('#fogCanvas')[0].ontouchstart=function(event){
                event.preventDefault();
                //Drag rectangle
                if (event.touches.length==2){
                    var offsetX=$('#fogCanvas').offset().left;
                    var offsetY=$('#fogCanvas').offset().top;
                    mouseController.drag=true;
                    mouseController.startPoint={x:event.touches[0].pageX-offsetX,y:event.touches[0].pageY-offsetY};
                    mouseController.endPoint={x:event.touches[1].pageX-offsetX,y:event.touches[1].pageY-offsetY};
                }
            };
            $('#fogCanvas')[0].ontouchend=function(event){
                event.preventDefault();
                if (mouseController.drag) {
                    //Multi select inside rect
                    Game.multiSelectInRect();
                    //End drag
                    mouseController.drag=false;
                }
            };
            mouseController.mobileScreen=new Hammer(window);
            mouseController.canvasScreen=new Hammer($('#fogCanvas')[0]);
            mouseController.canvasScreen.on('tap',function(event){
                event.preventDefault();
                //Callback
                mouseController.leftClick(event.pointers[0]);
            });
            mouseController.canvasScreen.on('doubletap',function(event){
                event.preventDefault();
                mouseController.dblClick();
            });
            mouseController.canvasScreen.on('press',function(event){
                //Prevent context menu show
                event.preventDefault();
                //Should not control units during replay
                if (Game.replayFlag) return;
                mouseController.rightClick(event.changedPointers[0]);
                //Cancel handler
                $('div.GameLayer').removeAttr('status');
                Button.callback=null;
            });
            mouseController.canvasScreen.on('panleft',function(event){
                Map.needRefresh="RIGHT";
            });
            mouseController.canvasScreen.on('panright',function(event){
                Map.needRefresh="LEFT";
            });
            mouseController.mobileScreen.on('panup',function(event){
                Map.needRefresh="BOTTOM";
            });
            mouseController.mobileScreen.on('pandown',function(event){
                Map.needRefresh="TOP";
            });
        }
        //Both sides
        $('div#GamePlay div').on('contextmenu',function(event){
            event.preventDefault();
        });
        $('canvas[name="mini_map"]').on('click',function(event){
            event.preventDefault();
            Map.clickHandler(event);
        });
        $('canvas[name="mini_map"]').on('contextmenu',function(event){
            event.preventDefault();
            Map.dblClickHandler(event);
        });
    }
};
