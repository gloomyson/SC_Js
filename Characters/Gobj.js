//Gobj is original object used in StarCraft
class Gobj{
    constructor({x=0,y=0,target,team=0}={}){
        this.x=x;
        this.y=y;
        if (target instanceof Gobj){
            this.x=(target.posX()-this.width/2)>>0;
            this.y=(target.posY()-this.height/2)>>0;
        }
        this.action=0;//Only for moving
        this.status="";
        this.buffer={};//Buffer names
        this.override={};//Buffer effects
        this.bufferObjs=[];
        this.allFrames={};
        this.team=team;//team 0 by default
    };
    isEnemy(){
        return this.team!=Game.team;
    };
    posX(){
        return this.x+this.width/2;
    };
    posY(){
        return this.y+this.height/2;
    };
    //Basic behaviors
    detectOutOfBound(){
        //Do nothing here
    };
    //Only for moving
    updateLocation(){
        //Override here
    };
    animeFrame(){
        //Animation play
        this.action++;
        if (this.action>=this.frame[this.status]) {
            this.action=0;
        }
    };
    moving(){
        //Clear old timer
        this.stop();
        //Launch new moving timer
        this.status="moving";
        const myself=this;
        let movingFrame=function(){
            myself.animeFrame();
            //Relocate character
            myself.updateLocation();
            //Detect OutOfBound
            myself.detectOutOfBound();
        };
        this.allFrames['moving']=movingFrame;
        let animateFrame=function(){
            //Only play animation, will not move
            myself.animeFrame();
        };
        this.allFrames['animate']=animateFrame;
    };
    stop(){
        //Clear both kinds of timer
        delete this.allFrames['moving'];
        delete this.allFrames['dock'];
        delete this.allFrames['animate'];
    };
    playFrames(){
        let frames=this.allFrames;
        for (let type in frames){
            frames[type]();
        }
    };
    die(){
        //Clear old timer
        this.stop();
        this.status="dead";
        this.action=0;
        //If has die animation
        if (this.dieEffect) {
            new this.dieEffect({x:this.posX(),y:this.posY()});
        }
    };
    include(obj){
        return (obj.posY()>this.y)&&(obj.posY()<this.y+this.height)&&(obj.posX()>this.x)&&(obj.posX()<this.x+this.width);
    };
    includePoint(x,y){
        return (y>this.y)&&(y<this.y+this.height)&&(x>this.x)&&(x<this.x+this.width);
    };
    //rect={centerX:?,centerY:?,radius:?} or {centerX:?,centerY:?,radius:[?,?]}
    insideSquare({centerX,centerY,radius}){
        if (radius instanceof Array)
            return Math.abs(centerX-this.posX())<radius[0] && Math.abs(centerY-this.posY())<radius[1];
        else return Math.abs(centerX-this.posX())<radius && Math.abs(centerY-this.posY())<radius;
    };
    //rect={start:{x:?,y:?},end:{x:?,y:?}}
    insideRect({start,end}){
        return (this.posX()>start.x) && (this.posX()<end.x) &&
            (this.posY()>start.y) && (this.posY()<end.y);
    };
    //circle={centerX:?,centerY:?,radius:?}
    insideCircle({centerX,centerY,radius}){
        return Math.pow(centerX-this.posX(),2)+Math.pow(centerY-this.posY(),2)<Math.pow(radius,2);
    };
    //Default is circle mode
    inside(...args){
        return this.insideCircle(...args);
    };
    //Radius
    radius(){
        return (this.width<this.height)?(this.width/2):(this.height/2);//Math.min
    };
    //Distance
    distanceFrom(obj){
        if (obj instanceof Gobj){
            return Math.sqrt((this.posX()-obj.posX())*(this.posX()-obj.posX())+
                (this.posY()-obj.posY())*(this.posY()-obj.posY()));
        }
        else {
            return Math.sqrt((this.posX()-obj.x)*(this.posX()-obj.x)+
                (this.posY()-obj.y)*(this.posY()-obj.y));
        }
    };
    insideScreen(){
        return ((this.x+this.width)>Map.offsetX) && (this.x<(Map.offsetX+Game.HBOUND))
            && ((this.y+this.height)>Map.offsetY) && (this.y<(Map.offsetY+Game.VBOUND));
    };
    sightInsideScreen(){
        return ((this.x+this.width)>(Map.offsetX-this.get('sight'))) && (this.x<(Map.offsetX+Game.HBOUND+this.get('sight')))
            && ((this.y+this.height)>(Map.offsetY-this.get('sight'))) && (this.y<(Map.offsetY+Game.VBOUND+this.get('sight')));
    };
    collideWith(chara){
        //Bounding box: right-left-down-up
        return !((this.x>(chara.x+chara.width)) || (chara.x>(this.x+this.width))
        || (this.y>(chara.y+chara.height)) || (chara.y>(this.y+this.height)));
    };
    softCollideWith(chara,N=1){
        //Twice radius of hard collision
        return chara.insideSquare({centerX:this.posX(),centerY:this.posY(),radius:[this.width*N,this.height*N]});
    };
    isIdle(){
        return this.status=="dock";
    };
    canSee(enemy){
        return enemy.inside({centerX:this.posX(),centerY:this.posY(),radius:this.get('sight')});
    };
    get(prop){
        //Currently only support upgrade for unit properties, no buildings
        let result=eval(`this.${prop}`);//Can get A.B.C
        //ShareFlag is symbol for team sharing array, not speed matrix array
        if (result instanceof Array) return result[this.team];
        else return result;
    };
    addBuffer(bufferObj,onAll){
        for (let prop in bufferObj){
            //Register in override if not exist
            if (!this.override[prop]) this.override[prop]=[];
            let buffer=bufferObj[prop];
            //Add buffer into override list
            this.override[prop].unshift(buffer);
            //Override unit property by time sequence if has
            if (this[prop]!=null || prop.indexOf('isInvisible')!=-1 || onAll) this[prop]=buffer;
        }
        this.bufferObjs.push(bufferObj);
        //Refresh
        if (this==Game.selectedUnit) Game.refreshInfo();
    };
    removeBuffer(bufferObj){
        let bufferObjIndex=this.bufferObjs.indexOf(bufferObj);
        //Buffer obj still exist, prevent remove twice
        if (bufferObjIndex!=-1){
            for (let prop in bufferObj){
                let [buffer,overrideList]=[bufferObj[prop],this.override[prop]];
                //Remove buffer from override list
                let index=overrideList.indexOf(buffer);
                if (index!=-1) overrideList.splice(index,1);
                //Have other buffer, apply it by time sequence
                if (overrideList.length>0) this[prop]=overrideList[0];
                else delete this[prop];
            }
            //Remove from bufferObjs
            this.bufferObjs.splice(bufferObjIndex,1);
            //Refresh
            if (this==Game.selectedUnit) Game.refreshInfo();
            //Remove successfully
            return true;
        }
        //Remove failure
        else return false;
    };
    cannotMove(){
        return (this instanceof Building) || Boolean(this.burrowBuffer);
    };
    evolveTo(props){
        //Init
        let [charaType,burstArr,mixin,rallyPoint,newTypeChara,selectedStatus,team]=[
            props.type,props.burstArr,props.mixin,props.rallyPoint,null,
            [this.selected,(this==Game.selectedUnit)],this.team
        ];
        //Hide die burst and sound for old unit, then die
        this.dieEffect=this.sound.death=null;
        this.die();
        if (this.processing && !props.chain) delete this.processing;
        //Birth function
        let bornAt=function(chara){
            let prop={target:chara,team:team};
            if (mixin) _$.mixin(prop,mixin);
            newTypeChara=new charaType(prop);
            if (rallyPoint) newTypeChara.destination=rallyPoint;
            //Fix cannot select egg issue
            Game.commandTimeout(function(){
                if (selectedStatus[0]) Game.addIntoAllSelected(newTypeChara);
                if (selectedStatus[1]) Game.changeSelectedTo(newTypeChara);
            },0);
        };
        //Burst chain
        if (burstArr){
            let pos={x:this.posX(),y:this.posY()};
            let birth=new Burst[burstArr[0]](pos);
            let evolveChain=function(N){
                return function(){
                    birth=new Burst[burstArr[N]](pos);
                    if ((N+1)<burstArr.length) birth.callback=evolveChain(N+1);
                    //Finish evolve chain
                    else birth.callback=function(){
                        let times=charaType.prototype.birthCount;
                        if (times==null) times=1;
                        for (let N=0;N<times;N++){
                            bornAt(birth);
                        }
                    };
                };
            };
            //Start evolve chain
            if (burstArr.length>1) birth.callback=evolveChain(1);
            //Finish evolve chain
            else birth.callback=function(){
                let times=charaType.prototype.birthCount;
                if (times==null) times=1;
                for (let N=0;N<times;N++){
                    bornAt(birth);
                }
            };
        }
        else bornAt(this);
        return newTypeChara;
    };
    //Default value used if not initialize properly
    static [_$.protoProps](){
        return {
            name:"Gobj",
            width:0,
            height:0,
            imgPos:{
                moving:{
                    left:new Array(8).fill(0),
                    top:new Array(8).fill(0)
                }
            },
            frame:{
                moving:1
            },
            speed:{x:0,y:0}
        }
    };
};
//This buffer makes invisible units visible
Gobj.detectorBuffer=[];
Object.defineProperty(Gobj,'detectorBuffer',{enumerable:false});
//Apply protoProps
_$.classPatch(Gobj);
