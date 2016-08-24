/******* Define Neutral units *******/
var Neutral={};
Neutral.Ragnasaur=class Ragnasaur extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
    };
    //Override
    dock(){
        //Use the same behavior
        Unit.walkAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Ragnasaur",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*104+26).map(n=>new Array(9).fill(n)),
                    top:new Array(16).fill(Array.gen(8).map(n=>n*104+26))
                }
            },
            width:52,//104N+26
            height:52,
            frame:{
                moving:9,
                dock:1
            },
            //Only for moving status,override
            speed:6,
            HP:60,
            armor:0,
            sight:175,
            dieEffect:Burst.RagnasaurDeath,
            isFlying:false,
            unitType:Unit.SMALL,
            recover:Building.ZergBuilding.prototype.recover
        }
    };
};
Neutral.Rhynsdon=class Rhynsdon extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
    };
    //Override
    dock(){
        //Use the same behavior
        Unit.walkAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Rhynsdon",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*104+26).map(n=>new Array(11).fill(n)),
                    top:new Array(16).fill(Array.gen(10).map(n=>n*104+26))
                }
            },
            width:52,//104N+26
            height:52,
            frame:{
                moving:11,
                dock:1
            },
            //Only for moving status,override
            speed:6,
            HP:60,
            armor:0,
            sight:175,
            dieEffect:Burst.RhynsdonDeath,
            isFlying:false,
            unitType:Unit.SMALL,
            recover:Building.ZergBuilding.prototype.recover
        }
    };
};
Neutral.Ursadon=class Ursadon extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
    };
    //Override
    dock(){
        //Use the same behavior
        Unit.walkAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Ursadon",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*92+15).map(n=>new Array(8).fill(n)),
                    top:new Array(16).fill(Array.gen(7).map(n=>n*92+15))
                }
            },
            width:62,//92N+15
            height:62,
            frame:{
                moving:8,
                dock:1
            },
            //Only for moving status,override
            speed:6,
            HP:60,
            armor:0,
            sight:175,
            dieEffect:Burst.UrsadonDeath,
            isFlying:false,
            unitType:Unit.SMALL,
            recover:Building.ZergBuilding.prototype.recover
        }
    };
};
Neutral.Bengalaas=class Bengalaas extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
    };
    //Override
    dock(){
        //Use the same behavior
        Unit.walkAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Bengalaas",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*128+38).map(n=>new Array(12).fill(n)),
                    top:new Array(16).fill(Array.gen(11).map(n=>n*128+38))
                }
            },
            width:52,
            height:52,//128N+38
            frame:{
                moving:12,
                dock:1
            },
            //Only for moving status,override
            speed:6,
            HP:60,
            armor:0,
            sight:175,
            dieEffect:Burst.BengalaasDeath,
            isFlying:false,
            unitType:Unit.SMALL,
            recover:Building.ZergBuilding.prototype.recover
        }
    };
};
Neutral.Scantid=class Scantid extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
    };
    //Override
    dock(){
        //Use the same behavior
        Unit.walkAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Scantid",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*92+12).map(n=>new Array(12).fill(n)),
                    top:new Array(16).fill(Array.gen(11).map(n=>n*92+12))
                }
            },
            width:68,//92N+12
            height:68,
            frame:{
                moving:12,
                dock:1
            },
            //Only for moving status,override
            speed:6,
            HP:60,
            armor:0,
            sight:175,
            dieEffect:Burst.ScantidDeath,
            isFlying:false,
            unitType:Unit.SMALL,
            recover:Building.ZergBuilding.prototype.recover
        }
    };
};
Neutral.Kakaru=class Kakaru extends Unit{
    constructor(props){
        super(props);
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    };
    //Override
    dock(){
        //Use the same behavior
        Unit.walkAround.call(this);
    };
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Kakaru",
            imgPos:{
                moving:{
                    left:Array.gen(16).del(9,1).map(n=>n*92+12).map(n=>new Array(12).fill(n)),
                    top:new Array(16).fill(Array.gen(11).map(n=>n*92+12))
                }
            },
            width:68,//92N+12
            height:68,
            frame:{
                moving:12
            },
            //Only for moving status,override
            speed:6,
            HP:60,
            armor:0,
            sight:210,
            dieEffect:Burst.KakaruDeath,
            isFlying:true,
            unitType:Unit.SMALL,
            recover:Building.ZergBuilding.prototype.recover
        }
    };
};
//Apply all protoProps for Neutral
_$.classPackagePatch(Neutral);
