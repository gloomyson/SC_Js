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
            //Target location, from centerP to top-left
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
        //Override Gobj here, can have hidden frames
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
            //Only play animation, will not move
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
        if (this.insideScreen()) new Audio('bgm/GreenFog.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Mutalisk",//Source img inside Mutalisk.png
            imgPos:{
                burst:{
                    left:[8,68,134,198,263,8,68,134,198,263],
                    top:[468,468,468,468,468,532,532,532,532,532]
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
        if (this.insideScreen()) new Audio('bgm/Magic.Parasite.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Mutalisk",
            imgPos:{
                burst:{
                    left:[8,68,134,198,263,8,68,134,198,263],
                    top:[468,468,468,468,468,532,532,532,532,532]
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
                    left:[8,68,134,198,263,8,68,134,198,263],
                    top:[468,468,468,468,468,532,532,532,532,532]
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
        if (this.insideScreen()) new Audio('bgm/Greenball.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Guardian",
            imgPos:{
                burst:{
                    left:[0,56,119,182,252,322,396,470],
                    top:[556,556,556,556,556,556,556,556]
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
        if (this.insideScreen()) new Audio('bgm/PurpleCloud.burst.wav').play();
    };
    callback(){
        let chara=this.target;
        //Fix all spored issue
        if (chara.status=='dead' || chara.status==null) return;
        //Effect:PurpleBuffer when cloud spread on target chara
        //Buffer flag, can add up
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
            //Restore in 30 seconds, Last In First Out
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
                    top:[1022,1022,1022,1022,1022,1022,1022,1022,1022]
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
        if (this.insideScreen()) new Audio('bgm/Sunken.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:[46,174,302,432,560,688],
                    top:[626,626,626,626,626,626]
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
        if (this.insideScreen()) new Audio('bgm/FireSpark.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Wraith",
            imgPos:{
                burst:{
                    left:[64,106,64],
                    top:[91,91,91]
                }
            },
            width:32,
            height:28,
            frame:{
                burst:3
            }
        }
    };
};
Burst.FireSpark=class FireSpark extends Burst{
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Ghost",
            imgPos:{
                burst:{
                    left:[0, 38, 76, 114, 152, 190, 228, 266, 304, 342],
                    top:[596,596,596,596,596,596,596,596,596,596]
                }
            },
            width:38,
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
        if (this.insideScreen()) new Audio('bgm/FireSpark.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Nothing
        }
    };
};
Burst.LaserSpark=class LaserSpark extends Burst{
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:[18,70,128,182],
                    top:[50,50,50,50]
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
        if (this.insideScreen()) new Audio('bgm/VultureSpark.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Nothing
        }
    };
};
Burst.HydraSpark=class HydraSpark extends Burst{
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Hydralisk",
            imgPos:{
                burst:{
                    left:[0, 34, 68, 102, 136, 170, 204, 238],
                    top:[801,801,801,801,801,801,801,801]
                }
            },
            width:34,
            height:35,
            frame:{
                burst:8
            }
        }
    };
};
Burst.CorsairCloud=class CorsairCloud extends Burst{
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:[5,57],//[1, 64, 128]
                    top:[576,576]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:[0, 80, 160, 240, 320, 400],
                    top:[779,779,779,779,779,779]
                }
            },
            width:80,
            height:80,
            frame:{
                burst:8
            }
        }
    };
};
Burst.DragoonBallBroken=class DragoonBallBroken extends Burst{
    constructor(props){
        super(props);
        //Has burst sound effect
        if (this.insideScreen()) new Audio('bgm/DragoonBall.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:[0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520],
                    top:[891,891,891,891,891,891,891,891,891,891,891,891,891,891]
                }
            },
            width:38,
            height:40,
            frame:{
                burst:14
            }
        }
    };
};
Burst.ShootSpark=class ShootSpark extends Burst{
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:[0, 40, 80, 120, 160, 200, 240, 280, 320, 360],
                    top:[1011,1011,1011,1011,1011,1011,1011,1011,1011,1011]
                }
            },
            width:40,
            height:40,
            frame:{
                burst:10
            }
        }
    };
};
Burst.BlueShootSpark=class BlueShootSpark extends Burst{
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:[32, 64, 96, 128, 160, 192, 224, 256],
                    top:[1115,1115,1115,1115,1115,1115,1115,1115]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:[0, 48, 96, 144, 192, 240, 288, 336, 384, 432],
                    top:[1147,1147,1147,1147,1147,1147,1147,1147,1147,1147]
                }
            },
            width:48,
            height:48,
            frame:{
                burst:10
            }
        }
    };
};
Burst.ProbeSpark=class ProbeSpark extends Burst{
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:[0, 48, 96, 144, 192, 240, 288],
                    top:[672,672,672,672,672,672,672]
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
        if (this.insideScreen()) new Audio('bgm/ReaverBomb.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:[0, 80, 160, 240, 320, 400, 480, 560, 640, 720],
                    top:[931,931,931,931,931,931,931,931,931,931]
                }
            },
            width:78,
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
        if (this.insideScreen()) new Audio('bgm/ReaverBomb.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Mutalisk",
            imgPos:{
                burst:{
                    left:[338,398,464,528,593,338,398,464,528,593],
                    top:[468,468,468,468,468,532,532,532,532,532]
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
        if (this.insideScreen()) new Audio('bgm/ReaverBomb.burst.wav').play();
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"InfestedTerran",
            imgPos:{
                burst:{
                    left:[0, 78, 156, 234, 312, 0, 78, 156, 234, 312],
                    top:[432,432,432,432,432,496,496,496,496,496]
                }
            },
            width:78,
            height:64,
            frame:{
                burst:10
            }
        }
    };
};
Burst.ScourgeBomb=class ScourgeBomb extends Burst{
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Scourge",
            imgPos:{
                burst:{
                    left:[0, 52, 104, 156, 208, 260, 312, 364, 416],
                    top:[218,218,218,218,218,218,218,218,218]
                }
            },
            width:52,
            height:46,
            frame:{
                burst:9
            }
        }
    };
};

Burst.SmallExplode=class SmallExplode extends Burst{
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[56,156,256,360],
                    top:[1686,1686,1686,1686]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[44,192,342,498],
                    top:[1754,1754,1754,1754]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[26,226,424,632],
                    top:[1846,1846,1846,1846]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[50,150,250,356],
                    top:[1424,1424,1424,1424]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[36,184,338,494],
                    top:[1484,1484,1484,1484]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[22,222,420,632],
                    top:[1566,1566,1566,1566]
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
                    left:[0,200,400,600,800,0,200,400,600,800,0,200,400,400,600,600,800,800],
                    top:[0,0,0,0,0,200,200,200,200,200,400,400,400,400,400,400,400,400]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[0,0,200,200,400,400,600,600,800,800,0,0,200,200,400,400,600,600],
                    top:[600,600,600,600,600,600,600,600,600,600,800,800,800,800,800,800,800,800]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"BuildingBurst",
            imgPos:{
                burst:{
                    left:[0,0,200,200,400,400,600,600,800,800,0,0,200,200,400,400,600,600],
                    top:[1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1200,1200,1200,1200,1200,1200,1200,1200]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Civilian",
            imgPos:{
                burst:{
                    left:[6,58,106,158,6,54,102,152],
                    top:[286,286,286,286,320,320,320,320]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Medic",
            imgPos:{
                burst:{
                    left:[0, 64, 128, 192, 256, 320, 384, 448],
                    top:[832,832,832,832,832,832,832,832]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Mutalisk",
            imgPos:{
                burst:{
                    left:[71,143,215,283,355,432,502],
                    top:[372,372,372,372,372,372,372]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Devourer",
            imgPos:{
                burst:{
                    left:[0, 114, 228, 342, 456, 570, 684, 798],
                    top:[860,860,860,860,860,860,860,860]
                }
            },
            width:114,
            height:102,
            frame:{
                burst:8
            }
        }
    };
};
Burst.DroneDeath=class DroneDeath extends Burst{
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Drone",
            imgPos:{
                burst:{
                    left:[0, 128, 256, 384, 512, 640, 768, 896],
                    top:[1280,1280,1280,1280,1280,1280,1280,1280]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Zergling",
            imgPos:{
                burst:{
                    left:[0, 68, 136, 204, 272, 340, 408],
                    top:[506,506,506,506,506,506,506]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Hydralisk",
            imgPos:{
                burst:{
                    left:[0, 66, 132, 198, 264, 330, 396, 462, 528, 594, 660, 726],
                    top:[704,704,704,704,704,704,704,704,704,704,704,704]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Lurker",
            imgPos:{
                burst:{
                    left:[85, 170, 255, 340, 0, 85, 170, 255, 340],
                    top:[582,582,582,582,646,646,646,646,646]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Ultralisk",
            imgPos:{
                burst:{
                    left:[0, 101, 202, 303, 404, 505, 606, 707, 808, 909],
                    top:[1620,1620,1620,1620,1620,1620,1620,1620,1620,1620]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Defiler",
            imgPos:{
                burst:{
                    left:[0, 70, 140, 210, 280, 350, 420, 490, 560, 630],
                    top:[558,558,558,558,558,558,558,558,558,558]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Queen",
            imgPos:{
                burst:{
                    left:[0, 40, 80, 120, 160],
                    top:[782,782,782,782,782]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:[0,50,100,150,200,250,300,350,400],
                    top:[146,146,146,146,146,146,146,146,146]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Larva",
            imgPos:{
                burst:{
                    left:[0,70,140,210,280,350,0,70,140,210,280,350],
                    top:[254,254,254,254,254,254,312,312,312,312,312,312]
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
                    left:[2,38,74,110,146,182,218,254],
                    top:[372,372,372,372,372,372,372,372]
                }
            },
            width:36,
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
                    left:[1,68,135,202,269,336,403],
                    top:[442,442,442,442,442,442,442]
                }
            },
            width:67,
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
                    left:[0,63,126,189,252,315,378],
                    top:[486,486,486,486,486,486,486]
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
                    left:[0,59,118,177,236,295,354],
                    top:[582,582,582,582,582,582,582]
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
                    left:[0,63,126,189,252,315,378],
                    top:[666,666,666,666,666,666,666]
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
                    left:[0,66,132,198,264,330,396],
                    top:[712,712,712,712,712,712,712]
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
                    left:[0,62,124,186,248,310,372],
                    top:[798,798,798,798,798,798,798]
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
                    left:[0,62,124,186,248,310,372],
                    top:[867,867,867,867,867,867,867]
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
                    left:[0,72,144,216,288,360,432],
                    top:[950,950,950,950,950,950,950]
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
                    left:[0,64,128,192,256,320,384],
                    top:[1011,1011,1011,1011,1011,1011,1011]
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
                    left:[650, 722, 794, 866, 938, 1010, 1082],
                    top:[480, 480, 480, 480, 480, 480, 480]
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
                    left:[656, 737, 818, 899, 980, 1061],
                    top:[538, 538, 538, 538, 538, 538]
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
                    left:[666,764,862,960,1058,1156],
                    top:[998,998,998,998,998,998]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Zealot",
            imgPos:{
                burst:{
                    left:[0, 57, 114, 171, 228, 285, 342],
                    top:[575,575,575,575,575,575,575]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Dragoon",
            imgPos:{
                burst:{
                    left:[15, 111, 207, 303, 399, 495, 591],
                    top:[591,591,591,591,591,591,591]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Templar",
            imgPos:{
                burst:{
                    left:[30, 158, 286, 414, 542, 670],
                    top:[2078,2078,2078,2078,2078,2078]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:[514, 593, 672, 514, 593, 672, 514, 593, 672, 514, 593, 672],
                    top:[460,460,460,526,526,526,592,592,592,658,658,658]
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
                    left:[20,140,260,380,500,620,740,860,980],
                    top:[1700,1700,1700,1700,1700,1700,1700,1700,1700]
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
                    left:[20,140,260,380,500,620,740,860,980],
                    top:[1220,1220,1220,1220,1220,1220,1220,1220,1220]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Ragnasaur",
            imgPos:{
                burst:{
                    left:[0, 104, 208, 312, 416, 520, 624, 728],
                    top:[936,936,936,936,936,936,936,936]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Rhynsdon",
            imgPos:{
                burst:{
                    left:[0, 104, 208, 312, 416, 520, 624, 728],
                    top:[1144,1144,1144,1144,1144,1144,1144,1144]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Ursadon",
            imgPos:{
                burst:{
                    left:[0, 92, 184, 276, 368, 460, 552, 644],
                    top:[736,736,736,736,736,736,736,736]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Bengalaas",
            imgPos:{
                burst:{
                    left:[0, 128, 256, 384, 512, 640, 768, 896],
                    top:[1536,1536,1536,1536,1536,1536,1536,1536]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Scantid",
            imgPos:{
                burst:{
                    left:[0, 92, 184, 276, 368, 460, 552, 644],
                    top:[1104,1104,1104,1104,1104,1104,1104,1104]
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
    constructor(props){
        super(props);
        //Nothing
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Kakaru",
            imgPos:{
                burst:{
                    left:[0, 92, 184, 276, 368, 460, 552, 644],
                    top:[1104,1104,1104,1104,1104,1104,1104,1104]
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
