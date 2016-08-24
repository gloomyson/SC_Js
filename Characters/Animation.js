//Alias
var Animation=Burst;
Animation.RightClickCursor=class RightClickCursor extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Burst",
            imgPos:{
                burst:{
                    left:Array.gen(3).map(n=>n*44),
                    top:new Array(4).fill(1087)
                }
            },
            width:44,
            height:28,
            frame:{
                burst:4
            }
        }
    };
};
Animation.PsionicStorm=class PsionicStorm extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(3).map(n=>n*188).repeat(4).del(14,2),
                    top:Array.gen(3).map(n=>n*153).repeat(4,true).del(14,2)
                }
            },
            width:188,
            height:153,
            scale:1.2,
            duration:7000,
            frame:{
                burst:14
            }
        }
    };
};
Animation.Hallucination=class Hallucination extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(8).map(n=>n*63+752).repeat(2),
                    top:[0,63].repeat(9,true)
                }
            },
            width:63,
            height:63,
            above:true,
            frame:{
                burst:18
            }
        }
    };
};
Animation.Consume=class Consume extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(8).map(n=>n*74+752).repeat(2),
                    top:[126,196].repeat(9,true)
                }
            },
            width:74,
            height:70,
            above:true,
            autoSize:true,
            frame:{
                burst:18
            }
        }
    };
};
Animation.StasisField=class StasisField extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:376,
                    top:459
                }
            },
            width:130,
            height:110,
            above:true,
            autoSize:'MAX',
            scale:1.25,
            duration:30000,
            frame:{
                burst:1
            }
        }
    };
};
Animation.Lockdown=class Lockdown extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:[3,0,1,2,3,0,0,0,1,2,3,0,1,2].map(n=>n*110),
                    top:[723,834,834,834,834,945,0,612,612,612,612,723,723,723]
                }
            },
            width:110,
            height:111,
            above:true,
            autoSize:'MAX',
            duration:60000,
            frame:{
                burst:6
            }
        }
    };
};
Animation.DarkSwarm=class DarkSwarm extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:[1260,752,1006,1260,752,0,752,1006,1260,752,1006],
                    top:[456,645,645,645,834,0,267,267,267,456,456]
                }
            },
            width:254,
            height:189,
            scale:1.2,
            duration:60000,
            frame:{
                burst:5
            }
        }
    };
};
Animation.Plague=class Plague extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(5).repeat(3).slice(3,17).map(n=>n*130+754),
                    top:[...new Array(3).fill(0),...new Array(6).fill(1),...new Array(5).fill(2)].map(n=>n*130+892)
                }
            },
            width:130,
            height:130,
            scale:1.2,
            frame:{
                burst:14
            }
        }
    };
};
Animation.PurpleEffect=class PurpleEffect extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(3).map(n=>n*59+440),
                    top:new Array(4).fill(902)
                }
            },
            width:59,
            height:60,
            above:true,
            autoSize:'MIN',
            duration:30000,
            frame:{
                burst:4
            }
        }
    };
};
Animation.RedEffect=class RedEffect extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(3).map(n=>n*62+1006),
                    top:new Array(4).fill(836)
                }
            },
            width:62,
            height:50,
            above:true,
            autoSize:'MIN',
            duration:30000,
            frame:{
                burst:4
            }
        }
    };
};
Animation.GreenEffect=class GreenEffect extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(3).map(n=>n*57+1256),
                    top:new Array(4).fill(836)
                }
            },
            width:57,
            height:46,
            above:true,
            autoSize:'MIN',
            duration:30000,
            frame:{
                burst:4
            }
        }
    };
};
Animation.Ensnare=class Ensnare extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(4).map(n=>n*131).repeat(3),
                    top:Array.gen(2).map(n=>n*125+1056).repeat(5,true)
                }
            },
            width:131,
            height:125,
            scale:1.2,
            frame:{
                burst:15
            }
        }
    };
};
Animation.ScannerSweep=class ScannerSweep extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(2).map(n=>n*155+1012).repeat(2).repeat(2,true),
                    top:[2220,2335].repeat(6,true)
                }
            },
            width:155,
            height:115,
            scale:1.5,
            duration:15600,
            sight:350,
            frame:{
                burst:12
            }
        }
    };
};
Animation.Feedback=class Feedback extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(11).map(n=>n*70+632),
                    top:new Array(12).fill(2872)
                }
            },
            width:70,
            height:70,
            above:true,
            autoSize:true,
            frame:{
                burst:12
            }
        }
    };
};
Animation.HellFire=class HellFire extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(9).map(n=>n*75+655),
                    top:new Array(10).fill(1284)
                }
            },
            width:75,
            height:75,
            above:true,
            autoSize:true,
            frame:{
                burst:10
            }
        }
    };
};
Animation.MindControl=class MindControl extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(11).map(n=>n*62+658),
                    top:new Array(12).fill(1378)
                }
            },
            width:62,
            height:40,
            above:true,
            autoSize:true,
            frame:{
                burst:12
            }
        }
    };
};
Animation.RechargeShields=class RechargeShields extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*64).repeat(2),
                    top:[1432,1496].repeat(8,true)
                }
            },
            width:64,
            height:64,
            above:true,
            autoSize:true,
            frame:{
                burst:16
            }
        }
    };
};
Animation.DisruptionWeb=class DisruptionWeb extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:[1396,1396,1088,1242,1392,1392].repeat(2,true),
                    top:[1194,1322,1432,1432,1432,1538].repeat(2,true)
                }
            },
            width:154,
            height:112,
            scale:1.2,
            duration:25000,
            frame:{
                burst:12
            }
        }
    };
};
Animation.DefensiveMatrix=class DefensiveMatrix extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:[1327,1427].repeat(3).del(5,1),
                    top:Array.gen(2).map(n=>n*87+1664).repeat(2,true).del(5,1)
                }
            },
            width:90,
            height:84,
            above:true,
            autoSize:true,
            duration:60000,
            frame:{
                burst:5
            }
        }
    };
};
Animation.BlueShield=class BlueShield extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(4).map(n=>n*130).repeat(2),
                    top:[1560,1690].repeat(5,true)
                }
            },
            width:130,
            height:130,
            above:true,
            autoSize:true,
            duration:60000,
            frame:{
                burst:10
            }
        }
    };
};
Animation.MaelStorm=class MaelStorm extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:[2,70,130,195,252,312,372,430,492,554],
                    top:new Array(10).fill(2870)
                }
            },
            width:60,
            height:60,
            above:true,
            autoSize:true,
            duration:18000,//Normal 12 sec
            frame:{
                burst:10
            }
        }
    };
};
Animation.RedShield=class RedShield extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(4).map(n=>n*130+650).repeat(2),
                    top:[1560,1690].repeat(5,true)
                }
            },
            width:130,
            height:130,
            above:true,
            autoSize:true,
            duration:18000,//Normal 12 sec
            frame:{
                burst:10
            }
        }
    };
};
Animation.BurningCircle=class BurningCircle extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(5).map(n=>n*112),
                    top:new Array(6).fill(1820)
                }
            },
            width:112,
            height:126,
            above:true,
            autoSize:true,
            duration:18000,
            frame:{
                burst:6
            }
        }
    };
};
Animation.Irradiate=class Irradiate extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:[668,792,916,1042,1172],
                    top:new Array(5).fill(1820)
                }
            },
            width:126,
            height:110,
            above:true,
            autoSize:true,
            duration:30000,
            frame:{
                burst:5
            }
        }
    };
};
Animation.Recall=class Recall extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:[0,86,188,282,386,488,588,688,788,894],
                    top:new Array(10).fill(1938)
                }
            },
            width:98,
            height:98,
            frame:{
                burst:10
            }
        }
    };
};
Animation.Ice=class Ice extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(3).map(n=>n*140+1024),
                    top:new Array(4).fill(1942)
                }
            },
            width:78,
            height:88,
            above:true,
            autoSize:true,
            duration:30000,
            frame:{
                burst:4
            }
        }
    };
};
Animation.EMPShockwave=class EMPShockwave extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:[0,180,356,534,708,886,1068],
                    top:new Array(7).fill(2038)
                }
            },
            width:180,
            height:146,
            scale:1.5,
            frame:{
                burst:7
            }
        }
    };
};
Animation.StasisFieldSpell=class StasisFieldSpell extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:[1384,1250,1250,1384],
                    top:new Array(4).fill(2044)
                }
            },
            width:128,
            height:84,
            frame:{
                burst:4
            }
        }
    };
};
Animation.MaelStormSpell=class MaelStormSpell extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:[1384,1250,1250,1384],
                    top:new Array(4).fill(2134)
                }
            },
            width:128,
            height:84,
            frame:{
                burst:4
            }
        }
    };
};
Animation.Restoration=class Restoration extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(7).map(n=>n*128).repeat(2),
                    top:[2190,2318].repeat(8,true)
                }
            },
            width:128,
            height:128,
            above:true,
            autoSize:true,
            frame:{
                burst:16
            }
        }
    };
};
Animation.Shockwave=class Shockwave extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(10).map(n=>n*135),
                    top:new Array(11).fill(2446)
                }
            },
            width:135,
            height:120,
            frame:{
                burst:11
            }
        }
    };
};
Animation.NuclearStrike=class NuclearStrike extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(9).map(n=>n*154).repeat(2),
                    top:[2562,2716].repeat(10,true)
                }
            },
            width:154,
            height:154,
            scale:2.5,
            frame:{
                burst:20
            }
        }
    };
};
//Evolve related
Animation.EvolveGroundUnit=class EvolveGroundUnit extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(5).map(n=>n*38+524).repeat(2),
                    top:[724,766].repeat(6,true)
                }
            },
            width:38,
            height:43,
            frame:{
                burst:12
            }
        }
    };
};
Animation.EvolveFlyingUnit=class EvolveFlyingUnit extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"Magic",
            imgPos:{
                burst:{
                    left:Array.gen(4).map(n=>n*63+438).repeat(2).del(9,1),
                    top:[...new Array(5).fill(810),...new Array(4).fill(855)]
                }
            },
            width:63,
            height:46,
            frame:{
                burst:9
            }
        }
    };
};
Animation.SmallMutationComplete=class SmallMutationComplete extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"ZergBuilding",
            imgPos:{
                burst:{
                    left:Array.gen(3).map(n=>n*160+1316),
                    top:new Array(4).fill(962)
                }
            },
            width:88,
            height:84,
            frame:{
                burst:4
            }
        }
    };
};
Animation.MiddleMutationComplete=class MiddleMutationComplete extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"ZergBuilding",
            imgPos:{
                burst:{
                    left:Array.gen(2).map(n=>n*160+980),
                    top:new Array(3).fill(1048)
                }
            },
            width:120,
            height:112,
            frame:{
                burst:3
            }
        }
    };
};
Animation.LargeMutationComplete=class LargeMutationComplete extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"ZergBuilding",
            imgPos:{
                burst:{
                    left:Array.gen(2).map(n=>n*160+960),
                    top:new Array(3).fill(1160)
                }
            },
            width:160,
            height:150,
            frame:{
                burst:3
            }
        }
    };
};
Animation.ProtossBuildingComplete=class ProtossBuildingComplete extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"ProtossBuilding",
            imgPos:{
                burst:{
                    left:[486,636].repeat(2,true),
                    top:new Array(4).fill(648)
                }
            },
            width:152,
            height:152,
            frame:{
                burst:4
            }
        }
    };
};
//Damaged related
Animation.RedFireL=class RedFireL extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"TerranBuilding",
            imgPos:{
                burst:{
                    left:Array.gen(11).map(n=>n*64+14),
                    top:new Array(12).fill(546)
                }
            },
            width:40,//64N+14
            height:70,
            //above:true,
            //Keep playing until killed
            forever:true,
            frame:{
                burst:12
            }
        }
    };
};
Animation.RedFireM=class RedFireM extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"TerranBuilding",
            imgPos:{
                burst:{
                    left:Array.gen(11).map(n=>n*64+14),
                    top:new Array(12).fill(632)
                }
            },
            width:40,//64N+14
            height:70,
            //above:true,
            forever:true,
            frame:{
                burst:12
            }
        }
    };
};
Animation.RedFireR=class RedFireR extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"TerranBuilding",
            imgPos:{
                burst:{
                    left:Array.gen(11).map(n=>n*64+10),
                    top:new Array(12).fill(722)
                }
            },
            width:48,//64N+10
            height:60,
            //above:true,
            forever:true,
            frame:{
                burst:12
            }
        }
    };
};
Animation.BlueFireL=class BlueFireL extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"ProtossBuilding",
            imgPos:{
                burst:{
                    left:Array.gen(11).map(n=>n*64+14),
                    top:new Array(12).fill(424)
                }
            },
            width:40,//64N+14
            height:70,
            //above:true,
            forever:true,
            frame:{
                burst:12
            }
        }
    };
};
Animation.BlueFireM=class BlueFireM extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"ProtossBuilding",
            imgPos:{
                burst:{
                    left:Array.gen(11).map(n=>n*64+14),
                    top:new Array(12).fill(506)
                }
            },
            width:40,//64N+14
            height:70,
            //above:true,
            forever:true,
            frame:{
                burst:12
            }
        }
    };
};
Animation.BlueFireR=class BlueFireR extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"ProtossBuilding",
            imgPos:{
                burst:{
                    left:Array.gen(11).map(n=>n*64+10),
                    top:new Array(12).fill(588)
                }
            },
            width:48,//64N+10
            height:60,
            //above:true,
            forever:true,
            frame:{
                burst:12
            }
        }
    };
};
Animation.BloodA=class BloodA extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"ZergBuilding",
            imgPos:{
                burst:{
                    left:Array.gen(11).map(n=>n*64+768),
                    top:new Array(12).fill(1320)
                }
            },
            width:64,
            height:50,
            //above:true,
            forever:true,
            frame:{
                burst:12
            }
        }
    };
};
Animation.BloodB=class BloodB extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"ZergBuilding",
            imgPos:{
                burst:{
                    left:Array.gen(11).map(n=>n*64+768),
                    top:new Array(12).fill(1376)
                }
            },
            width:64,
            height:50,
            //above:true,
            forever:true,
            frame:{
                burst:12
            }
        }
    };
};
Animation.BloodC=class BloodC extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"ZergBuilding",
            imgPos:{
                burst:{
                    left:Array.gen(11).map(n=>n*64),
                    top:new Array(12).fill(1376)
                }
            },
            width:64,
            height:50,
            //above:true,
            forever:true,
            frame:{
                burst:12
            }
        }
    };
};
Animation.BloodD=class BloodD extends Animation{
    static [_$.protoProps](){
        return {
            //Add basic unit info
            name:"ZergBuilding",
            imgPos:{
                burst:{
                    left:Array.gen(11).map(n=>n*64),
                    top:new Array(12).fill(1320)
                }
            },
            width:64,
            height:50,
            //above:true,
            forever:true,
            frame:{
                burst:12
            }
        }
    };
};
//Apply all protoProps for both Burst and Animation
_$.classPackagePatch(Animation);
