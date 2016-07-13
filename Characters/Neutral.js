/******* Define Neutral units *******/
var Neutral={};
Neutral.Ragnasaur=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Ragnasaur",
        imgPos: {
            moving: {
                left: [
                    [26, 26, 26, 26, 26, 26, 26, 26, 26],
                    [234, 234, 234, 234, 234, 234, 234, 234, 234],
                    [442, 442, 442, 442, 442, 442, 442, 442, 442],
                    [650, 650, 650, 650, 650, 650, 650, 650, 650],
                    [858, 858, 858, 858, 858, 858, 858, 858, 858],
                    [1170, 1170, 1170, 1170, 1170, 1170, 1170, 1170, 1170],
                    [1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378],
                    [1586, 1586, 1586, 1586, 1586, 1586, 1586, 1586, 1586]
                ],
                top: [
                    [26, 130, 234, 338, 442, 546, 650, 754, 858],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858]
                ]
            }
        },
        width: 52,
        height: 52,
        frame: {
            moving: 9,
            dock: 1
        },
        //Only for moving status, override
        speed:Unit.getSpeedMatrixBy(6),
        HP: 60,
        armor:0,
        sight:175,
        dieEffect:Burst.RagnasaurDeath,
        isFlying:false,
        unitType:Unit.SMALL,
        recover:Building.ZergBuilding.prototype.recover,
        //Override
        dock:function(){
            //Use the same behavior
            Unit.walkAround.call(this);
        }
    }
});
Neutral.Rhynsdon=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Rhynsdon",
        imgPos: {
            moving: {
                left: [
                    [26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26],
                    [234, 234, 234, 234, 234, 234, 234, 234, 234, 234, 234],
                    [442, 442, 442, 442, 442, 442, 442, 442, 442, 442, 442],
                    [650, 650, 650, 650, 650, 650, 650, 650, 650, 650, 650],
                    [858, 858, 858, 858, 858, 858, 858, 858, 858, 858, 858],
                    [1170, 1170, 1170, 1170, 1170, 1170, 1170, 1170, 1170, 1170, 1170],
                    [1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378],
                    [1586, 1586, 1586, 1586, 1586, 1586, 1586, 1586, 1586, 1586, 1586]
                ],
                top: [
                    [26, 130, 234, 338, 442, 546, 650, 754, 858, 962, 1066],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858, 962, 1066],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858, 962, 1066],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858, 962, 1066],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858, 962, 1066],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858, 962, 1066],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858, 962, 1066],
                    [26, 130, 234, 338, 442, 546, 650, 754, 858, 962, 1066]
                ]
            }
        },
        width: 52,
        height: 52,
        frame: {
            moving: 11,
            dock: 1
        },
        //Only for moving status, override
        speed:Unit.getSpeedMatrixBy(6),
        HP: 60,
        armor:0,
        sight:175,
        dieEffect:Burst.RhynsdonDeath,
        isFlying:false,
        unitType:Unit.SMALL,
        recover:Building.ZergBuilding.prototype.recover,
        //Override
        dock:function(){
            //Use the same behavior
            Unit.walkAround.call(this);
        }
    }
});
Neutral.Ursadon=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Ursadon",
        imgPos: {
            moving: {
                left: [
                    [15, 15, 15, 15, 15, 15, 15, 15],
                    [199, 199, 199, 199, 199, 199, 199, 199],
                    [383, 383, 383, 383, 383, 383, 383, 383],
                    [567, 567, 567, 567, 567, 567, 567, 567],
                    [751, 751, 751, 751, 751, 751, 751, 751],
                    [1027, 1027, 1027, 1027, 1027, 1027, 1027, 1027],
                    [1211, 1211, 1211, 1211, 1211, 1211, 1211, 1211],
                    [1395, 1395, 1395, 1395, 1395, 1395, 1395, 1395]
                ],
                top: [
                    [15, 107, 199, 291, 383, 475, 567, 659],
                    [15, 107, 199, 291, 383, 475, 567, 659],
                    [15, 107, 199, 291, 383, 475, 567, 659],
                    [15, 107, 199, 291, 383, 475, 567, 659],
                    [15, 107, 199, 291, 383, 475, 567, 659],
                    [15, 107, 199, 291, 383, 475, 567, 659],
                    [15, 107, 199, 291, 383, 475, 567, 659],
                    [15, 107, 199, 291, 383, 475, 567, 659]
                ]
            }
        },
        width: 62,
        height: 62,
        frame: {
            moving: 8,
            dock: 1
        },
        //Only for moving status, override
        speed:Unit.getSpeedMatrixBy(6),
        HP: 60,
        armor:0,
        sight:175,
        dieEffect:Burst.UrsadonDeath,
        isFlying:false,
        unitType:Unit.SMALL,
        recover:Building.ZergBuilding.prototype.recover,
        //Override
        dock:function(){
            //Use the same behavior
            Unit.walkAround.call(this);
        }
    }
});
Neutral.Bengalaas=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Bengalaas",
        imgPos: {
            moving: {
                left: [
                    [38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38],
                    [294, 294, 294, 294, 294, 294, 294, 294, 294, 294, 294, 294],
                    [550, 550, 550, 550, 550, 550, 550, 550, 550, 550, 550, 550],
                    [806, 806, 806, 806, 806, 806, 806, 806, 806, 806, 806, 806],
                    [1062, 1062, 1062, 1062, 1062, 1062, 1062, 1062, 1062, 1062, 1062, 1062],
                    [1446, 1446, 1446, 1446, 1446, 1446, 1446, 1446, 1446, 1446, 1446, 1446],
                    [1702, 1702, 1702, 1702, 1702, 1702, 1702, 1702, 1702, 1702, 1702, 1702],
                    [1958, 1958, 1958, 1958, 1958, 1958, 1958, 1958, 1958, 1958, 1958, 1958]
                ],
                top: [
                    [38, 166, 294, 422, 550, 678, 806, 934, 1062, 1190, 1318, 1446],
                    [38, 166, 294, 422, 550, 678, 806, 934, 1062, 1190, 1318, 1446],
                    [38, 166, 294, 422, 550, 678, 806, 934, 1062, 1190, 1318, 1446],
                    [38, 166, 294, 422, 550, 678, 806, 934, 1062, 1190, 1318, 1446],
                    [38, 166, 294, 422, 550, 678, 806, 934, 1062, 1190, 1318, 1446],
                    [38, 166, 294, 422, 550, 678, 806, 934, 1062, 1190, 1318, 1446],
                    [38, 166, 294, 422, 550, 678, 806, 934, 1062, 1190, 1318, 1446],
                    [38, 166, 294, 422, 550, 678, 806, 934, 1062, 1190, 1318, 1446]
                ]
            }
        },
        width: 52,
        height: 52,//128N-90
        frame: {
            moving: 12,
            dock: 1
        },
        //Only for moving status, override
        speed:Unit.getSpeedMatrixBy(6),
        HP: 60,
        armor:0,
        sight:175,
        dieEffect:Burst.BengalaasDeath,
        isFlying:false,
        unitType:Unit.SMALL,
        recover:Building.ZergBuilding.prototype.recover,
        //Override
        dock:function(){
            //Use the same behavior
            Unit.walkAround.call(this);
        }
    }
});
Neutral.Scantid=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Scantid",
        imgPos: {
            moving: {
                left: [
                    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
                    [196, 196, 196, 196, 196, 196, 196, 196, 196, 196, 196, 196],
                    [380, 380, 380, 380, 380, 380, 380, 380, 380, 380, 380, 380],
                    [564, 564, 564, 564, 564, 564, 564, 564, 564, 564, 564, 564],
                    [748, 748, 748, 748, 748, 748, 748, 748, 748, 748, 748, 748],
                    [1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024],
                    [1208, 1208, 1208, 1208, 1208, 1208, 1208, 1208, 1208, 1208, 1208, 1208],
                    [1392, 1392, 1392, 1392, 1392, 1392, 1392, 1392, 1392, 1392, 1392, 1392]
                ],
                top: [
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024]
                ]
            }
        },
        width: 68,
        height: 68,
        frame: {
            moving: 12,
            dock: 1
        },
        //Only for moving status, override
        speed:Unit.getSpeedMatrixBy(6),
        HP: 60,
        armor:0,
        sight:175,
        dieEffect:Burst.ScantidDeath,
        isFlying:false,
        unitType:Unit.SMALL,
        recover:Building.ZergBuilding.prototype.recover,
        //Override
        dock:function(){
            //Use the same behavior
            Unit.walkAround.call(this);
        }
    }
});
Neutral.Kakaru=Unit.extends({
    constructorPlus:function(props){
        //Same action mapping
        this.imgPos.dock=this.imgPos.moving;
        this.frame.dock=this.frame.moving;
    },
    prototypePlus: {
        //Add basic unit info
        name: "Kakaru",
        imgPos: {
            moving: {
                left: [
                    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
                    [196, 196, 196, 196, 196, 196, 196, 196, 196, 196, 196, 196],
                    [380, 380, 380, 380, 380, 380, 380, 380, 380, 380, 380, 380],
                    [564, 564, 564, 564, 564, 564, 564, 564, 564, 564, 564, 564],
                    [748, 748, 748, 748, 748, 748, 748, 748, 748, 748, 748, 748],
                    [1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024, 1024],
                    [1208, 1208, 1208, 1208, 1208, 1208, 1208, 1208, 1208, 1208, 1208, 1208],
                    [1392, 1392, 1392, 1392, 1392, 1392, 1392, 1392, 1392, 1392, 1392, 1392]
                ],
                top: [
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024],
                    [12, 104, 196, 288, 380, 472, 564, 656, 748, 840, 932, 1024]
                ]
            }
        },
        width: 68,
        height: 68,
        frame: {
            moving: 12
        },
        //Only for moving status, override
        speed:Unit.getSpeedMatrixBy(6),
        HP: 60,
        armor:0,
        sight:210,
        dieEffect:Burst.KakaruDeath,
        isFlying:true,
        unitType:Unit.SMALL,
        recover:Building.ZergBuilding.prototype.recover,
        //Override
        dock:function(){
            //Use the same behavior
            Unit.walkAround.call(this);
        }
    }
});