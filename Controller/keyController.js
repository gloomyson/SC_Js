var KeyController={
	shift:false,
    ctrl:false,
    disable:false,
    start:function(){
        //Keyboard settings
        window.onkeydown=function(event){
            //Will not switch page by Ctrl+N,cannot debug
            //event.preventDefault();
            //Sometimes need to disable shortcut key
            if (KeyController.disable && event.keyCode!=13) return;
            switch (event.keyCode){
                //Press SHIFT down
                case 16:
                    KeyController.shift=true;
                    break;
                //Press CTRL down
                case 17:
                    KeyController.ctrl=true;
                    break;
                //Press number: '0~9'.charCodeAt()
                case 48:case 49:case 50:case 51:case 52:
                case 53:case 54:case 55:case 56:case 57:
                    let teamNum=String.fromCharCode(event.keyCode);
                    //Building team
                    if (KeyController.ctrl) {
                        Game.addSelectedIntoTeam(teamNum);
                    }
                    //Call team
                    else {
                        Game.callTeam(teamNum);
                    }
                    break;
                //Move map
                case 37:
                    Map.needRefresh="LEFT";
                    break;
                case 38:
                    Map.needRefresh="TOP";
                    break;
                case 39:
                    Map.needRefresh="RIGHT";
                    break;
                case 40:
                    Map.needRefresh="BOTTOM";
                    break;
                //Replay speed control
                case 107:
                case 33:
                    //Speed up + or pageUp
                    Button.speedUpHandler();
                    break;
                case 109:
                case 34:
                    //Slow down - or pageDown
                    Button.slowDownHandler();
                    break;
                //Shortcut keys:
                //Press M
                case 77://'M'.charCodeAt()
                    if (Array.from($('div.panel_Control button')).some(function(btn){
                        return btn.className=='move'
                    })) Button.moveHandler();
                    break;
                //Press S
                case 83://'S'.charCodeAt()
                    if (Array.from($('div.panel_Control button')).some(function(btn){
                        return btn.className=='stop'
                    })) Button.stopHandler();
                    break;
                //Press A
                case 65://'A'.charCodeAt()
                    if (Array.from($('div.panel_Control button')).some(function(btn){
                        return btn.className=='attack'
                    })) Button.attackHandler();
                    break;
                //Press P
                case 80://'P'.charCodeAt()
                    if (Array.from($('div.panel_Control button')).some(function(btn){
                        return btn.className=='patrol'
                    })) Button.patrolHandler();
                    break;
                //Press H
                case 72://'H'.charCodeAt()
                    if (Array.from($('div.panel_Control button')).some(function(btn){
                        return btn.className=='hold'
                    })) Button.holdHandler();
                    break;
                //Press ENTER
                case 13://'\r'.charCodeAt()
                    Cheat.handler();
                    break;
            }
        };
        window.onkeyup=function(event){
            switch (event.keyCode){
                //Press SHIFT up
                case 16:
                    KeyController.shift=false;
                    break;
                //Press CTRL up
                case 17:
                    KeyController.ctrl=false;
                    break;
            }
        };
    }
};