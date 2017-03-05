import { Game } from '../GameRule/Game';
import { Map } from './Map';
import { Building } from './Building';
import { Burst } from './Burst';

//Gobj is original object used in StarCraft
export class Gobj {

    x: number;
    y: number;
    action: number;
    status: string;


    static init = function (props) {
        this.x = props.x;
        this.y = props.y;
        if (props.target instanceof Gobj) {
            this.x = (props.target.posX() - this.width / 2) >> 0;
            this.y = (props.target.posY() - this.height / 2) >> 0;
        }
        this.action = 0; //Only for moving
        this.status = "";
        this.buffer = {};//Buffer names
        this.override = {};//Buffer effects
        this.bufferObjs = [];
        this.allFrames = {};
        this.team = props.team ? props.team : 0;//team 0 by default
    };

    //Default value used if not initialize properly
    name = "Gobj";
    width = 0;
    height = 0;

    isEnemy = function () {
        return this.team != Game.team;
    };
    posX = function () {
        return this.x + this.width / 2;
    };
    posY = function () {
        return this.y + this.height / 2;
    };
    imgPos = {
        moving: {
            left: [0, 0, 0, 0, 0, 0, 0, 0],
            top: [0, 0, 0, 0, 0, 0, 0, 0]
        }
    };
    //Only for moving
    frame = {
        moving: 1
    };
    //Better only for moving
    speed = { x: 0, y: 0 };

    //Basic behaviors
    detectOutOfBound = function () {
        //Do nothing here
    };
    //Only for moving
    updateLocation = function () {
        //Override here
    };
    animeFrame = function () {
        //Animation play
        this.action++;
        if (this.action >= this.frame[this.status]) {
            this.action = 0;
        }
    };
    moving = function () {
        //Clear old timer
        this.stop();
        //Launch new moving timer
        this.status = "moving";
        var myself = this;
        var movingFrame = function () {
            myself.animeFrame();
            //Relocate character
            myself.updateLocation();
            //Detect OutOfBound
            myself.detectOutOfBound();
        };
        this.allFrames['moving'] = movingFrame;
        var animateFrame = function () {
            //Only play animation, will not move
            myself.animeFrame();
        };
        this.allFrames['animate'] = animateFrame;
    };
    stop = function () {
        //Clear both kinds of timer
        delete this.allFrames['moving'];
        delete this.allFrames['dock'];
        delete this.allFrames['animate'];
    };
    playFrames = function () {
        var frames = this.allFrames;
        for (var type in frames) {
            frames[type]();
        }
    };
    die = function () {
        //Clear old timer
        this.stop();
        this.status = "dead";
        this.action = 0;
        //If has die animation
        if (this.dieEffect) {
            new this.dieEffect({ x: this.posX(), y: this.posY() });
        }
    };
    include = function (obj) {
        return (obj.posY() > this.y) && (obj.posY() < this.y + this.height) && (obj.posX() > this.x) && (obj.posX() < this.x + this.width);
    };
    includePoint = function (x, y) {
        return (y > this.y) && (y < this.y + this.height) && (x > this.x) && (x < this.x + this.width);
    };
    //rect={centerX:?,centerY:?,radius:?} or {centerX:?,centerY:?,radius:[?,?]}
    insideSquare = function (rect) {
        if (rect.radius instanceof Array)
            return Math.abs(rect.centerX - this.posX()) < rect.radius[0] && Math.abs(rect.centerY - this.posY()) < rect.radius[1];
        else return Math.abs(rect.centerX - this.posX()) < rect.radius && Math.abs(rect.centerY - this.posY()) < rect.radius;
    };
    //rect={start:{x:?,y:?},end:{x:?,y:?}}
    insideRect = function (rect) {
        return (this.posX() > rect.start.x) && (this.posX() < rect.end.x) &&
            (this.posY() > rect.start.y) && (this.posY() < rect.end.y);
    };

    //circle={centerX:?,centerY:?,radius:?}
    insideCircle = function (circle) {
        return Math.pow(circle.centerX - this.posX(), 2) + Math.pow(circle.centerY - this.posY(), 2) < Math.pow(circle.radius, 2);
    };
    //Default is circle mode
    inside = function (circle) {
        return Math.pow(circle.centerX - this.posX(), 2) + Math.pow(circle.centerY - this.posY(), 2) < Math.pow(circle.radius, 2);
    };
    //Radius
    radius = function () {
        return (this.width < this.height) ? (this.width / 2) : (this.height / 2);//Math.min
    };
    //Distance
    distanceFrom = function (obj) {
        if (obj instanceof Gobj) {
            return Math.pow((this.posX() - obj.posX()) * (this.posX() - obj.posX()) +
                (this.posY() - obj.posY()) * (this.posY() - obj.posY()), 0.5);
        }
        else {
            return Math.pow((this.posX() - obj.x) * (this.posX() - obj.x) +
                (this.posY() - obj.y) * (this.posY() - obj.y), 0.5);
        }
    };
    insideScreen = function () {
        return ((this.x + this.width) > Map.offsetX) && (this.x < (Map.offsetX + Game.HBOUND))
            && ((this.y + this.height) > Map.offsetY) && (this.y < (Map.offsetY + Game.VBOUND));
    };
    sightInsideScreen = function () {
        return ((this.x + this.width) > (Map.offsetX - this.get('sight'))) && (this.x < (Map.offsetX + Game.HBOUND + this.get('sight')))
            && ((this.y + this.height) > (Map.offsetY - this.get('sight'))) && (this.y < (Map.offsetY + Game.VBOUND + this.get('sight')));
    };
    softCollideWith = function (chara, N) {
        if (N == null) N = 1;
        //Twice radius of hard collision
        return chara.insideSquare({ centerX: this.posX(), centerY: this.posY(), radius: [this.width * N, this.height * N] });
    };
    collideWith = function (chara) {
        //Bounding box: right-left-down-up
        return !((this.x > (chara.x + chara.width)) || (chara.x > (this.x + this.width))
            || (this.y > (chara.y + chara.height)) || (chara.y > (this.y + this.height)));
    };
    isIdle = function () {
        return this.status == "dock";
    };
    canSee = function (enemy) {
        return enemy.inside({ centerX: this.posX(), centerY: this.posY(), radius: this.get('sight') });
    };
    get = function (prop) {
        //Currently only support upgrade for unit properties, no buildings
        var result = eval('this.' + prop);//Can get A.B.C
        //ShareFlag is symbol for team sharing array, not speed matrix array
        if (result instanceof Array) return result[this.team];
        else return result;
    };
    addBuffer = function (bufferObj, onAll) {
        for (var prop in bufferObj) {
            //Register in override if not exist
            if (!this.override[prop]) this.override[prop] = [];
            var buffer = bufferObj[prop];
            //Add buffer into override list
            this.override[prop].unshift(buffer);
            //Override unit property by time sequence if has
            if (this[prop] != null || prop.indexOf('isInvisible') != -1 || onAll) this[prop] = buffer;
        }
        this.bufferObjs.push(bufferObj);
        //Refresh
        if (this == Game.selectedUnit) Game.refreshInfo();
    };
    removeBuffer = function (bufferObj) {
        var bufferObjIndex = this.bufferObjs.indexOf(bufferObj);
        //Buffer obj still exist, prevent remove twice
        if (bufferObjIndex != -1) {
            for (var prop in bufferObj) {
                var buffer = bufferObj[prop];
                var overrideList = this.override[prop];
                //Remove buffer from override list
                var index = overrideList.indexOf(buffer);
                if (index != -1) overrideList.splice(index, 1);
                //Have other buffer, apply it by time sequence
                if (overrideList.length > 0) this[prop] = overrideList[0];
                else delete this[prop];
            }
            //Remove from bufferObjs
            this.bufferObjs.splice(bufferObjIndex, 1);
            //Refresh
            if (this == Game.selectedUnit) Game.refreshInfo();
            //Remove successfully
            return true;
        }
        //Remove failure
        else return false;
    };
    cannotMove = function () {
        return (this instanceof Building) || Boolean(this.burrowBuffer);
    };
    evolveTo = function (props) {
        //Init
        var charaType = props.type, burstArr = props.burstArr, mixin = props.mixin, rallyPoint = props.rallyPoint;
        var newTypeChara = null, selectedStatus = [this.selected, (this == Game.selectedUnit)], team = this.team;
        //Hide die burst and sound for old unit, then die
        this.dieEffect = this.sound.death = null;
        this.die();
        if (this.processing && !props.chain) delete this.processing;
        //Birth function
        var bornAt = function (chara) {
            var prop = { target: chara, team: team };
            if (mixin) _$.mixin(prop, mixin);
            newTypeChara = new charaType(prop);
            if (rallyPoint) newTypeChara.destination = rallyPoint;
            //Fix cannot select egg issue
            Game.commandTimeout(function () {
                if (selectedStatus[0]) Game.addIntoAllSelected(newTypeChara);
                if (selectedStatus[1]) Game.changeSelectedTo(newTypeChara);
            }, 0);
        };
        //Burst chain
        if (burstArr) {
            var pos = { x: this.posX(), y: this.posY() };
            var birth = new Burst[burstArr[0]](pos);
            var evolveChain = function (N) {
                return function () {
                    birth = new Burst[burstArr[N]](pos);
                    if ((N + 1) < burstArr.length) birth.callback = evolveChain(N + 1);
                    //Finish evolve chain
                    else birth.callback = function () {
                        var times = charaType.prototype.birthCount;
                        if (times == null) times = 1;
                        for (var N = 0; N < times; N++) {
                            bornAt(birth);
                        }
                    };
                };
            };
            //Start evolve chain
            if (burstArr.length > 1) birth.callback = evolveChain(1);
            //Finish evolve chain
            else birth.callback = function () {
                var times = charaType.prototype.birthCount;
                if (times == null) times = 1;
                for (var N = 0; N < times; N++) {
                    bornAt(birth);
                }
            };
        }
        else bornAt(this);
        return newTypeChara;
    };
    //This buffer makes invisible units visible
    //  Gobj.detectorBuffer = [];
}