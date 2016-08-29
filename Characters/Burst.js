//One animation period which only play for a while and die
class Burst extends Gobj{
    constructor(props){
        super(props);
        //Override if has props.scale
        if (props.scale) this.scale=props.scale;
        //Resize drawing by scale
        let times=this.scale?(this.scale):1;
        //Behavior like effect on target
        if (props.target) {
            this.target=props.target;
            //Ahead of owner
            if (props.above) this.above=true;
            //Animation duration
            //Match owner size
            if (props.autoSize) this.autoSize=true;
            if (this.autoSize!=null) {
                //Can mix autoSize with scale
                switch(this.autoSize){
                    case 'MAX':
                        this.scale=Math.max(this.target.width,this.target.height)*2*times/(this.width+this.height);
                        break;
                    case 'MIN':
                        this.scale=Math.min(this.target.width,this.target.height)*2*times/(this.width+this.height);
                        break;
                    default:
                        this.scale=(this.target.width+this.target.height)*times/(this.width+this.height);
                }
                times=this.scale;
            }
            //Location
            this.x=(this.target.posX()-this.width*times/2)>>0;
            this.y=(this.target.posY()-this.height*times/2)>>0;
            //Onfire or bleed will have offset
            if (props.offset){
                this.x+=props.offset.x;
                this.y+=props.offset.y;
            }
        }
        //Independent burst
        else {
            //Target location,from centerP to top-left
            this.x=props.x-this.width*times/2;
            this.y=props.y-this.height*times/2;
        }
        //Play duration
        if (this.forever) this.duration=-1;//Keep playing until killed
        if (props.duration!=null) this.duration=props.duration;//Override duration
        //Restore callback after burst finish
        if (props.callback) this.callback=props.callback;
        //By default it will burst
        this.burst();
        //Will show after constructed
        Burst.allEffects.push(this);
    };
    //Override Gobj method
    animeFrame(){
        //Animation play
        this.action++;
        //Override Gobj here,can have hidden frames
        let arrLimit=(this.imgPos[this.status].left instanceof Array)?(this.imgPos[this.status].left.length):1;
        if (this.action==this.frame[this.status] || this.action==arrLimit) {
            this.action=0;
        }
        //Update location here
        if (this.above && this.target) {
            //Update location: copied from constructor
            let times=this.scale?(this.scale):1;
            this.x=(this.target.posX()-this.width*times/2)>>0;
            this.y=(this.target.posY()-this.height*times/2)>>0;
        }
    };
    burst(){
        this.status="burst";
        //Start play burst animation
        const myself=this;
        let animateFrame=function(){
            //Only play animation,will not move
            myself.animeFrame();
        };
        this.allFrames['animate']=animateFrame;
        //Will die(stop playing) after time limit arrive
        let duration=this.duration?this.duration:(this.frame['burst']*100);
        //Last forever if duration<0 (-1)
        if (duration>0){
            Game.commandTimeout(function(){
                myself.die();
            },duration);
        }
    };
    die(){
        //Run callback when burst die
        if (this.callback) this.callback();
        super.die();
    }
};
//All burst effects here for show
Burst.allEffects=[];
Object.defineProperty(Burst,'allEffects',{enumerable:false});

//Define different bursts
Burst.GreenFog=class GreenFog extends Burst{
    constructor(props){
        super(props);
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/GreenFog.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Mutalisk",//Source img inside Mutalisk.png
            imgPos:{
                burst:{
                    left:[8,68,134,198,263].repeat(2),
                    top:[468,532].repeat(5,true)
                }
            },
            width:52,
            height:57,
            frame:{
                burst:10
            }
        }
    };
};
Burst.Parasite=class Parasite extends Burst{
    constructor(props){
        super(props);
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/Magic.Parasite.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Mutalisk",
            imgPos:{
                burst:{
                    left:[8,68,134,198,263].repeat(2),
                    top:[468,532].repeat(5,true)
                }
            },
            width:52,
            height:57,
            frame:{
                burst:10
            }
        }
    };
};
Burst.Spore=class Spore extends Burst{
    constructor(props){
        super(props);
        //No sound
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Mutalisk",
            imgPos:{
                burst:{
                    left:[8,68,134,198,263].repeat(2),
                    top:[468,532].repeat(5,true)
                }
            },
            width:52,
            height:57,
            frame:{
                burst:10
            }
        }
    };
};
Burst.GreenBallBroken=class GreenBallBroken extends Burst{
    constructor(props){
        super(props);
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/Greenball.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Guardian",
            imgPos:{
                burst:{
                    left:[0,56,119,182,252,322,396,470],
                    top:new Array(8).fill(556)
                }
            },
            width:60,
            height:60,
            frame:{
                burst:8
            }
        }
    };
};
Burst.PurpleCloudSpread=class PurpleCloudSpread extends Burst{
    constructor(props){
        super(props);
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/PurpleCloud.burst.wav').play();
    };
    callback(){
        let chara=this.target;
        //Fix all spored issue
        if (chara.status=='dead' || chara.status==null) return;
        //Effect:PurpleBuffer when cloud spread on target chara
        //Buffer flag,can add up
        if (chara.buffer.PurpleCloud==9) return;//9 at max
        if (chara.buffer.PurpleCloud>0) chara.buffer.PurpleCloud++;
        else chara.buffer.PurpleCloud=1;
        //Decrease defense and slow down attack rate
        let bufferObj={
            armor:chara.get('armor')-1
        };
        if (chara.plasma!=null) bufferObj.plasma=chara.get('plasma')-1;
        if (chara.attackInterval) bufferObj.attackInterval=Math.round(chara.get('attackInterval')*1.1);
        //Apply buffer
        chara.addBuffer(bufferObj);
        if (!chara.purpleBuffer) chara.purpleBuffer=[];
        chara.purpleBuffer.push(bufferObj);
        //Purple effect
        new Animation.PurpleEffect({team:this.team,target:chara,callback:function(){
            //Restore in 30 seconds,Last In First Out
            if (chara.purpleBuffer && chara.removeBuffer(chara.purpleBuffer.pop())) {
                chara.buffer.PurpleCloud--;
            }
            //Full restore
            if (chara.buffer.PurpleCloud==0) {
                delete chara.buffer.PurpleCloud;
                delete chara.purpleBuffer;
            }
        }});
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Devourer",
            imgPos:{
                burst:{
                    left:[17,70,122,174,230,280,335,390,452],
                    top:new Array(9).fill(1022)
                }
            },
            width:50,
            height:60,
            frame:{
                burst:9
            }
        }
    };
};
Burst.Sunken=class Sunken extends Burst{
    constructor(props){
        super(props);
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/Sunken.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:[46,174,302,432,560,688],
                    top:new Array(6).fill(626)
                }
            },
            width:28,
            height:40,
            frame:{
                burst:6
            }
        }
    };
};
Burst.SmallFireSpark=class SmallFireSpark extends Burst{
    constructor(props){
        super(props);
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/FireSpark.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Wraith",
            imgPos:{
                burst:{
                    left:[64,106,64],
                    top:new Array(3).fill(132)
                }
            },
            width:32,
            height:30,
            frame:{
                burst:3
            }
        }
    };
};
Burst.FireSpark=class FireSpark extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Ghost",
            imgPos:{
                burst:{
                    left:Array.gen(9).map(n=>n*38),
                    top:new Array(10).fill(596)
                }
            },
            width:38,//38N
            height:36,
            frame:{
                burst:10
            }
        }
    };
};
Burst.FireSparkSound=class FireSparkSound extends Burst.FireSpark{
    constructor(props){
        super(props);
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/FireSpark.burst.wav').play();
    };
};
Burst.LaserSpark=class LaserSpark extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:[18,70,128,182],
                    top:new Array(4).fill(50)
                }
            },
            width:30,
            height:30,
            frame:{
                burst:4
            }
        }
    };
};
Burst.VultureSpark=class VultureSpark extends Burst.LaserSpark{
    constructor(props){
        super(props);
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/VultureSpark.burst.wav').play();
    };
};
Burst.HydraSpark=class HydraSpark extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Hydralisk",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*34),
                    top:new Array(8).fill(801)
                }
            },
            width:34,//34N
            height:35,
            frame:{
                burst:8
            }
        }
    };
};
Burst.CorsairCloud=class CorsairCloud extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:[5,57],//[1,64,128]
                    top:new Array(2).fill(576)
                }
            },
            width:40,//62
            height:44,//44
            frame:{
                burst:2
            }
        }
    };
};
Burst.ArchonBurst=class ArchonBurst extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:Array.gen(5).map(n=>n*80),
                    top:new Array(6).fill(779)
                }
            },
            width:80,//80N
            height:80,
            frame:{
                burst:6
            }
        }
    };
};
Burst.DragoonBallBroken=class DragoonBallBroken extends Burst{
    constructor(props){
        super(props);
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/DragoonBall.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:Array.gen(13).map(n=>n*40),
                    top:new Array(14).fill(891)
                }
            },
            width:38,//40N
            height:40,
            frame:{
                burst:14
            }
        }
    };
};
Burst.ShootSpark=class ShootSpark extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:Array.gen(9).map(n=>n*40),
                    top:new Array(10).fill(1011)
                }
            },
            width:40,//40N
            height:40,
            frame:{
                burst:10
            }
        }
    };
};
Burst.BlueShootSpark=class BlueShootSpark extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*32+32),
                    top:new Array(8).fill(1115)
                }
            },
            width:32,
            height:32,
            frame:{
                burst:8
            }
        }
    };
};
Burst.SCVSpark=class SCVSpark extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:Array.gen(9).map(n=>n*48),
                    top:new Array(10).fill(1147)
                }
            },
            width:48,//48N
            height:48,
            frame:{
                burst:10
            }
        }
    };
};
Burst.ProbeSpark=class ProbeSpark extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*48),
                    top:new Array(7).fill(672)
                }
            },
            width:48,
            height:32,
            frame:{
                burst:7
            }
        }
    };
};
Burst.ReaverBurst=class ReaverBurst extends Burst{
    constructor(props){
        super(props);
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/ReaverBomb.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:Array.gen(9).map(n=>n*80),
                    top:new Array(10).fill(931)
                }
            },
            width:78,//80N
            height:64,
            frame:{
                burst:10
            }
        }
    };
};
Burst.PurpleFog=class PurpleFog extends Burst{
    constructor(props){
        super(props);
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/ReaverBomb.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Mutalisk",
            imgPos:{
                burst:{
                    left:[338,398,464,528,593].repeat(2),
                    top:[468,532].repeat(5,true)
                }
            },
            width:52,
            height:57,
            frame:{
                burst:10
            }
        }
    };
};

Burst.InfestedBomb=class InfestedBomb extends Burst{
    constructor(props){
        super(props);
        //Has burst sound effect
        if (this.insideScreen()) new Audio(Game.CDN+'bgm/ReaverBomb.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"InfestedTerran",
            imgPos:{
                burst:{
                    left:Array.gen(4).repeat(2).map(n=>n*78),
                    top:[432,496].repeat(5,true)
                }
            },
            width:78,//78N
            height:64,
            frame:{
                burst:10
            }
        }
    };
};
Burst.ScourgeBomb=class ScourgeBomb extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Scourge",
            imgPos:{
                burst:{
                    left:Array.gen(8).map(n=>n*52),
                    top:new Array(9).fill(218)
                }
            },
            width:52,//52N
            height:46,
            frame:{
                burst:9
            }
        }
    };
};

Burst.SmallExplode=class SmallExplode extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[56,156,256,360],
                    top:new Array(4).fill(1686)
                }
            },
            width:80,
            height:60,
            frame:{
                burst:4
            }
        }
    };
};
Burst.MiddleExplode=class MiddleExplode extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[44,192,342,498],
                    top:new Array(4).fill(1754)
                }
            },
            width:120,
            height:90,
            frame:{
                burst:4
            }
        }
    };
};
Burst.BigExplode=class BigExplode extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[26,226,424,632],
                    top:new Array(4).fill(1846)
                }
            },
            width:160,
            height:120,
            frame:{
                burst:4
            }
        }
    };
};
Burst.SmallBlueExplode=class SmallBlueExplode extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[50,150,250,356],
                    top:new Array(4).fill(1424)
                }
            },
            width:80,
            height:60,
            frame:{
                burst:4
            }
        }
    };
};
Burst.MiddleBlueExplode=class MiddleBlueExplode extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[36,184,338,494],
                    top:new Array(4).fill(1484)
                }
            },
            width:120,
            height:90,
            frame:{
                burst:4
            }
        }
    };
};
Burst.BigBlueExplode=class BigBlueExplode extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[22,222,420,632],
                    top:new Array(4).fill(1566)
                }
            },
            width:160,
            height:120,
            frame:{
                burst:4
            }
        }
    };
};
Burst.ZergBuildingBurst=class ZergBuildingBurst extends Burst{
    constructor(props){
        super(props);
        //Need clear mud when ZergBuildingBurst finished
        this.callback=function(){
            Map.needRefresh="MAP";
        };
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[...Array.gen(4).repeat(2),...Array.gen(4).repeat(2,true).del(1,2)].map(n=>n*200),
                    top:[...[0,200].repeat(5,true),...new Array(8).fill(400)]
                }
            },
            width:200,
            height:200,
            frame:{
                burst:18
            }
        }
    };
};
Burst.TerranBuildingBurst=class TerranBuildingBurst extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:Array.gen(4).repeat(2,true).repeat(2).del(18,2).map(n=>n*200),
                    top:[...new Array(10).fill(600),...new Array(8).fill(800)]
                }
            },
            width:200,
            height:200,
            frame:{
                burst:18
            }
        }
    };
};
Burst.ProtossBuildingBurst=class ProtossBuildingBurst extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:Array.gen(4).repeat(2,true).repeat(2).del(18,2).map(n=>n*200),
                    top:[...new Array(10).fill(1000),...new Array(8).fill(1200)]
                }
            },
            width:200,
            height:200,
            frame:{
                burst:18
            }
        }
    };
};
Burst.HumanDeath=class HumanDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Civilian",
            imgPos:{
                burst:{
                    left:[6,58,106,158,6,54,102,152],
                    top:[286,320].repeat(4,true)
                }
            },
            width:42,
            height:30,
            frame:{
                burst:8
            }
        }
    };
};
Burst.MedicDeath=class MedicDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Medic",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*64),
                    top:new Array(8).fill(832)
                }
            },
            width:64,
            height:64,
            frame:{
                burst:8
            }
        }
    };
};
Burst.SmallZergFlyingDeath=class SmallZergFlyingDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Mutalisk",
            imgPos:{
                burst:{
                    left:[71,143,215,283,355,432,502],
                    top:new Array(7).fill(372)
                }
            },
            width:64,
            height:62,
            frame:{
                burst:7
            }
        }
    };
};
Burst.BigZergFlyingDeath=class BigZergFlyingDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Devourer",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*114),
                    top:new Array(8).fill(860)
                }
            },
            width:114,//114N
            height:102,
            frame:{
                burst:8
            }
        }
    };
};
Burst.DroneDeath=class DroneDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Drone",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*128),
                    top:new Array(8).fill(1280)
                }
            },
            width:128,
            height:128,
            frame:{
                burst:8
            }
        }
    };
};
Burst.ZerglingDeath=class ZerglingDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Zergling",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*68),
                    top:new Array(7).fill(506)
                }
            },
            width:68,
            height:55,
            frame:{
                burst:7
            }
        }
    };
};
Burst.HydraliskDeath=class HydraliskDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Hydralisk",
            imgPos:{
                burst:{
                    left:Array.gen(11).map(n=>n*66),
                    top:new Array(12).fill(704)
                }
            },
            width:66,
            height:50,
            frame:{
                burst:12
            }
        }
    };
};
Burst.LurkerDeath=class LurkerDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Lurker",
            imgPos:{
                burst:{
                    left:[...Array.gen(4,1),...Array.gen(4)].map(n=>n*85),
                    top:[...new Array(4).fill(582),...new Array(5).fill(646)]
                }
            },
            width:85,
            height:64,
            frame:{
                burst:9
            }
        }
    };
};
Burst.UltraliskDeath=class UltraliskDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Ultralisk",
            imgPos:{
                burst:{
                    left:Array.gen(9).map(n=>n*101),
                    top:new Array(10).fill(1620)
                }
            },
            width:101,
            height:108,
            frame:{
                burst:10
            }
        }
    };
};
Burst.DefilerDeath=class DefilerDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Defiler",
            imgPos:{
                burst:{
                    left:Array.gen(9).map(n=>n*70),
                    top:new Array(10).fill(558)
                }
            },
            width:70,
            height:46,
            frame:{
                burst:10
            }
        }
    };
};
Burst.BroodlingDeath=class BroodlingDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Queen",
            imgPos:{
                burst:{
                    left:Array.gen(4).map(n=>n*40),
                    top:new Array(5).fill(782)
                }
            },
            width:40,
            height:22,
            frame:{
                burst:5
            }
        }
    };
};
Burst.LarvaDeath=class LarvaDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:Array.gen(8).map(n=>n*50),
                    top:new Array(9).fill(146)
                }
            },
            width:50,
            height:26,
            frame:{
                burst:9
            }
        }
    };
};
Burst.EggDeath=class EggDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:Array.gen(5).map(n=>n*70).repeat(2),
                    top:[254,312].repeat(6,true)
                }
            },
            width:70,
            height:59,
            frame:{
                burst:12
            }
        }
    };
};
Burst.EggBirth=class EggBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*36+2),
                    top:new Array(8).fill(372)
                }
            },
            width:36,//36N+2
            height:40,
            frame:{
                burst:8
            }
        }
    };
};
Burst.DroneBirth=class DroneBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*67+1),
                    top:new Array(7).fill(442)
                }
            },
            width:67,//67N+1
            height:44,
            frame:{
                burst:7
            }
        }
    };
};
Burst.OverlordBirth=class OverlordBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*63),
                    top:new Array(7).fill(486)
                }
            },
            width:63,
            height:95,
            frame:{
                burst:7
            }
        }
    };
};
Burst.ZerglingBirth=class ZerglingBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*59),
                    top:new Array(7).fill(582)
                }
            },
            width:59,
            height:45,
            frame:{
                burst:7
            }
        }
    };
};
Burst.HydraliskBirth=class HydraliskBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*63),
                    top:new Array(7).fill(666)
                }
            },
            width:63,
            height:45,
            frame:{
                burst:7
            }
        }
    };
};
Burst.MutaliskBirth=class MutaliskBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*66),
                    top:new Array(7).fill(712)
                }
            },
            width:66,
            height:88,
            frame:{
                burst:7
            }
        }
    };
};
Burst.ScourgeBirth=class ScourgeBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*62),
                    top:new Array(7).fill(798)
                }
            },
            width:62,
            height:70,
            frame:{
                burst:7
            }
        }
    };
};
Burst.QueenBirth=class QueenBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*62),
                    top:new Array(7).fill(867)
                }
            },
            width:62,
            height:84,
            frame:{
                burst:7
            }
        }
    };
};
Burst.UltraliskBirth=class UltraliskBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*72),
                    top:new Array(7).fill(950)
                }
            },
            width:72,
            height:60,
            frame:{
                burst:7
            }
        }
    };
};
Burst.DefilerBirth=class DefilerBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*64),
                    top:new Array(7).fill(1011)
                }
            },
            width:64,
            height:48,
            frame:{
                burst:7
            }
        }
    };
};
Burst.LurkerBirth=class LurkerBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Lurker",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*72+650),
                    top:new Array(7).fill(480)
                }
            },
            width:72,
            height:67,
            frame:{
                burst:7
            }
        }
    };
};
Burst.GuardianBirth=class GuardianBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Guardian",
            imgPos:{
                burst:{
                    left:Array.gen(5).map(n=>n*81+656),
                    top:new Array(6).fill(538)
                }
            },
            width:81,
            height:74,
            frame:{
                burst:6
            }
        }
    };
};
Burst.DevourerBirth=class DevourerBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Devourer",
            imgPos:{
                burst:{
                    left:Array.gen(5).map(n=>n*98+666),
                    top:new Array(6).fill(998)
                }
            },
            width:73,
            height:86,
            frame:{
                burst:6
            }
        }
    };
};
Burst.SmallProtossDeath=class SmallProtossDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Zealot",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*57),
                    top:new Array(7).fill(575)
                }
            },
            width:57,
            height:84,
            frame:{
                burst:7
            }
        }
    };
};
Burst.DragoonDeath=class DragoonDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Dragoon",
            imgPos:{
                burst:{
                    left:Array.gen(6).map(n=>n*96+15),
                    top:new Array(7).fill(591)
                }
            },
            width:57,
            height:84,
            frame:{
                burst:7
            }
        }
    };
};
Burst.TemplarDeath=class TemplarDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Templar",
            imgPos:{
                burst:{
                    left:Array.gen(5).map(n=>n*128+30),
                    top:new Array(6).fill(2078)
                }
            },
            width:57,
            height:84,
            frame:{
                burst:6
            }
        }
    };
};
Burst.HallucinationDeath=class HallucinationDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(2).map(n=>n*79+514).repeat(4),
                    top:Array.gen(3).repeat(3,true).map(n=>n*66+460)
                }
            },
            width:79,
            height:66,
            frame:{
                burst:12
            }
        }
    };
};
Burst.ArchonBirth=class ArchonBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Archon",
            imgPos:{
                burst:{
                    left:Array.gen(8).map(n=>n*120+20),
                    top:new Array(9).fill(1700)
                }
            },
            width:80,
            height:80,
            frame:{
                burst:9
            }
        }
    };
};
Burst.DarkArchonBirth=class DarkArchonBirth extends Burst{
    constructor(props){
        super(props);
        //Mixin
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"DarkArchon",
            imgPos:{
                burst:{
                    left:Array.gen(8).map(n=>n*120+20),
                    top:new Array(9).fill(1220)
                }
            },
            width:80,
            height:80,
            frame:{
                burst:9
            }
        }
    };
};

Burst.RagnasaurDeath=class RagnasaurDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Ragnasaur",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*104),
                    top:new Array(8).fill(936)
                }
            },
            width:128,
            height:128,
            frame:{
                burst:8
            }
        }
    };
};
Burst.RhynsdonDeath=class RhynsdonDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Rhynsdon",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*104),
                    top:new Array(8).fill(1144)
                }
            },
            width:104,
            height:128,
            frame:{
                burst:8
            }
        }
    };
};
Burst.UrsadonDeath=class UrsadonDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Ursadon",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*92),
                    top:new Array(8).fill(736)
                }
            },
            width:92,
            height:92,
            frame:{
                burst:8
            }
        }
    };
};
Burst.BengalaasDeath=class BengalaasDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Bengalaas",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*128),
                    top:new Array(8).fill(1536)
                }
            },
            width:128,
            height:128,
            frame:{
                burst:8
            }
        }
    };
};
Burst.ScantidDeath=class ScantidDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Scantid",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*92),
                    top:new Array(8).fill(1104)
                }
            },
            width:92,
            height:92,
            frame:{
                burst:8
            }
        }
    };
};
Burst.KakaruDeath=class KakaruDeath extends Burst{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Kakaru",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*92),
                    top:new Array(8).fill(1104)
                }
            },
            width:92,
            height:92,
            frame:{
                burst:8
            }
        }
    };
};
