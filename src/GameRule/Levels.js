var Levels=[
    {
        level:1,
        load:function(){
            //Load map
            Map.setCurrentMap('Switchback');
            //Choose side and apply race style
            var races=['Terran','Zerg'];
            var startPoint=[{x:50,y:50},{x:200,y:50}];
            if (!Game.replayFlag) Game.team=Math.random()*2>>0;
            Game.race.choose(races[Game.team]);
            Map.offsetX=startPoint[Game.team].x;
            Map.offsetY=startPoint[Game.team].y;
            //Load units
            new Terran.BattleCruiser({x:100,y:100});
            new Terran.Wraith({x:200,y:100});
            new Terran.BattleCruiser({x:100,y:200});
            new Terran.Wraith({x:200,y:200});
            new Terran.BattleCruiser({x:100,y:300});
            new Terran.Wraith({x:200,y:300});
            new Terran.SCV({x:100,y:400});
            new Building.TerranBuilding.MissileTurret({x:100,y:150});
            new Building.ProtossBuilding.PhotonCannon({x:100,y:250});
            //Add enemy
            new Zerg.Drone({x:600,y:400,team:1});
            new Zerg.Mutalisk({x:700,y:100,team:1});
            new Zerg.Devourer({x:800,y:100,team:1});
            new Zerg.Guardian({x:900,y:100,team:1});
            new Zerg.Mutalisk({x:700,y:200,team:1});
            new Zerg.Devourer({x:800,y:200,team:1});
            new Zerg.Guardian({x:900,y:200,team:1});
            new Zerg.Mutalisk({x:700,y:300,team:1});
            new Zerg.Devourer({x:800,y:300,team:1});
            new Zerg.Guardian({x:900,y:300,team:1});
            //Apply cheat for testing
            Game.commandTimeout(function(){
                Cheat.execute('show me the money');
            },0);
        }
    },
    {
        level:2,
        load:function(){
            //Test multiplayer
            if (!Game.replayFlag && confirm('Want enter multiplayer mode?')){
                //Enable multiplayer
                Multiplayer.enable();//Has fog for level2
            }
            //Load map
            Map.setCurrentMap('Volcanis');
            Map.offsetX=120;
            Map.offsetY=50;
            //Apply race style
            Game.race.choose('Zerg');
            //Load units
            new Zerg.Overlord({x:100,y:100});
            new Zerg.Guardian({x:100,y:200});
            new Zerg.Devourer({x:100,y:300});
            new Zerg.Mutalisk({x:200,y:100});
            new Zerg.Devourer({x:200,y:200});
            new Zerg.Guardian({x:200,y:300});
            new Zerg.Mutalisk({x:300,y:100});
            new Zerg.Devourer({x:300,y:200});
            new Zerg.Guardian({x:300,y:300});
            new Building.ZergBuilding.SporeColony({x:100,y:200});
            //Add enemy
            new Terran.Wraith({x:700,y:100,team:1});
            new Terran.Wraith({x:800,y:100,team:1});
            new Terran.Wraith({x:900,y:100,team:1});
            new Terran.Civilian({x:700,y:200,team:1});
            new Terran.Civilian({x:800,y:200,team:1});
            new Terran.Civilian({x:900,y:200,team:1});
            new Terran.BattleCruiser({x:700,y:300,team:1});
            new Terran.BattleCruiser({x:800,y:300,team:1});
            new Terran.BattleCruiser({x:900,y:300,team:1});
        }
    },
    {
        level:3,
        load:function(){
            //Load map
            Map.setCurrentMap('TrenchWars');
            //Apply race style
            Game.race.choose('Zerg');
            //Load units
            new Neutral.Ragnasaur({x:100,y:100});
            new Neutral.Rhynsdon({x:200,y:100});
            new Neutral.Ursadon({x:100,y:200});
            new Neutral.Bengalaas({x:200,y:200});
            new Neutral.Scantid({x:100,y:300});
            new Neutral.Kakaru({x:200,y:300});
            new Zerg.Hydralisk({x:150,y:100});
            new Zerg.Lurker({x:150,y:200});
            new Zerg.Ultralisk({x:150,y:300});
            //Add enemy
            new Neutral.Ragnasaur({x:700,y:100,team:1});
            new Neutral.Rhynsdon({x:700,y:200,team:1});
            new Neutral.Ursadon({x:700,y:300,team:1});
            new Neutral.Bengalaas({x:800,y:100,team:1});
            new Neutral.Scantid({x:800,y:200,team:1});
            new Neutral.Kakaru({x:800,y:300,team:1});
        }
    },
    {
        level:4,
        load:function(){
            //Test multiplayer
            /*if (!Game.replayFlag && confirm('Want enter multiplayer mode?')){
                //Enable multiplayer
                Multiplayer.enable();
                Game.commandTimeout(function(){
                    //Upgrade all grades
                    for (var grade in Upgrade){
                        Upgrade[grade].effect(0);
                        Upgrade[grade].effect(1);
                    }
                    Resource[0].mine=Resource[1].mine=10000;
                    Resource[0].gas=Resource[1].gas=10000;
                },0);
                Cheat.manUnlimited=true;
                Map.fogFlag=false;
            }*/
            //Load map
            Map.setCurrentMap('BloodBath');
            //Choose side and apply race style
            var races=['Zerg','Terran'];
            var startPoint=[{x:0,y:50},{x:200,y:50}];
            if (!Game.replayFlag) Game.team=Math.random()*2>>0;
            Game.race.choose(races[Game.team]);
            Map.offsetX=startPoint[Game.team].x;
            Map.offsetY=startPoint[Game.team].y;
            //Load units
            new Zerg.Drone({x:100,y:100});
            new Zerg.Zergling({x:200,y:100});
            new Zerg.Hydralisk({x:100,y:200});
            new Zerg.Scourge({x:200,y:200});
            new Zerg.Lurker({x:100,y:300});
            new Zerg.Ultralisk({x:200,y:300});
            new Zerg.Broodling({x:100,y:400});
            new Zerg.InfestedTerran({x:200,y:400});
            new Zerg.Queen({x:100,y:50});
            new Zerg.Defiler({x:200,y:50});
            new Hero.Sarah({x:100,y:150});
            new Zerg.Mutalisk({x:50,y:50});
            new Zerg.Guardian({x:50,y:150});
            new Zerg.Devourer({x:50,y:250});
            new Zerg.Overlord({x:50,y:350});
            //Add enemy
            new Terran.Marine({x:700,y:100,team:1});
            new Terran.Firebat({x:700,y:200,team:1});
            new Terran.Vulture({x:700,y:300,team:1});
            new Terran.Tank({x:800,y:100,team:1});
            new Terran.Goliath({x:800,y:200,team:1});
            new Terran.Dropship({x:800,y:300,team:1});
            new Terran.Ghost({x:700,y:50,team:1});
            new Terran.Vessel({x:700,y:150,team:1});
            new Terran.Valkyrie({x:700,y:250,team:1});
            new Terran.Medic({x:750,y:50,team:1});
            new Terran.Wraith({x:750,y:150,team:1});
            new Terran.BattleCruiser({x:750,y:250,team:1});
            new Terran.SCV({x:750,y:300,team:1});
            //Apply cheat for testing
            Game.commandTimeout(function(){
                Cheat.execute('show me the money');
                Cheat.execute('something for nothing');
                Cheat.execute('full recovery');
            },0);
        }
    },
    {
        level:5,
        load:function(){
            //Load map
            Map.setCurrentMap('OrbitalRelay');
            //Choose side and apply race style
            var races=['Terran','Protoss'];
            var startPoint=[{x:0,y:50},{x:200,y:50}];
            if (!Game.replayFlag) Game.team=Math.random()*2>>0;
            Game.race.choose(races[Game.team]);
            Map.offsetX=startPoint[Game.team].x;
            Map.offsetY=startPoint[Game.team].y;
            //Load units
            new Terran.Marine({x:100,y:100});
            new Terran.Firebat({x:200,y:100});
            new Terran.Ghost({x:100,y:200});
            new Terran.Vulture({x:200,y:200});
            new Terran.Tank({x:100,y:300});
            new Terran.Goliath({x:200,y:300});
            new Terran.Medic({x:100,y:400});
            new Terran.Dropship({x:200,y:400});
            new Terran.Vessel({x:100,y:50});
            new Terran.Valkyrie({x:200,y:50});
            new Hero.Kerrigan({x:100,y:150});
            new Terran.Wraith({x:200,y:150});
            new Terran.SCV({x:50,y:250});
            new Terran.BattleCruiser({x:150,y:250});
            //Add enemy
            new Protoss.Probe({x:700,y:100,team:1});
            new Protoss.Zealot({x:700,y:200,team:1});
            new Protoss.Dragoon({x:700,y:300,team:1});
            new Protoss.Templar({x:800,y:100,team:1});
            new Protoss.DarkTemplar({x:800,y:200,team:1});
            new Protoss.Observer({x:800,y:300,team:1});
            new Protoss.Reaver({x:800,y:300,team:1});
            new Protoss.Arbiter({x:700,y:250,team:1});
            new Protoss.Scout({x:750,y:250,team:1});
            new Protoss.Carrier({x:700,y:150,team:1});
            new Protoss.Corsair({x:700,y:200,team:1});
            new Protoss.Archon({x:750,y:50,team:1});
            new Protoss.DarkArchon({x:750,y:150,team:1});
            new Protoss.Shuttle({x:850,y:150,team:1});
            new Protoss.Observer({x:850,y:250,team:1});
            //Apply cheat for testing magic
            Game.commandTimeout(function(){
                Cheat.execute('show me the money');
                Cheat.execute('something for nothing');
                Cheat.execute('full recovery');
            },0);
        }
    },
    {
        level:6,
        load:function(){
            //Load map
            Map.setCurrentMap('ThinIce');
            //Choose side and apply race style
            var races=['Protoss','Zerg'];
            var startPoint=[{x:0,y:50},{x:200,y:50}];
            if (!Game.replayFlag) Game.team=Math.random()*2>>0;
            Game.race.choose(races[Game.team]);
            Map.offsetX=startPoint[Game.team].x;
            Map.offsetY=startPoint[Game.team].y;
            //Load units
            new Protoss.Probe({x:100,y:100});
            new Protoss.Zealot({x:200,y:100});
            new Protoss.Dragoon({x:100,y:200});
            new Protoss.Templar({x:200,y:200});
            new Protoss.DarkTemplar({x:100,y:300});
            new Protoss.Reaver({x:200,y:300});
            new Protoss.Archon({x:100,y:400});
            new Protoss.DarkArchon({x:200,y:400});
            new Protoss.Shuttle({x:100,y:50});
            new Protoss.Observer({x:200,y:50});
            new Protoss.Observer({x:200,y:100});
            new Protoss.Arbiter({x:100,y:150});
            new Protoss.Scout({x:200,y:150});
            new Protoss.Carrier({x:100,y:250});
            new Protoss.Corsair({x:200,y:250});
            //Add enemy
            new Zerg.Drone({x:700,y:100,team:1});
            new Zerg.Zergling({x:700,y:200,team:1});
            new Zerg.Hydralisk({x:700,y:300,team:1});
            new Zerg.Scourge({x:800,y:100,team:1});
            new Zerg.Lurker({x:800,y:200,team:1});
            new Zerg.Ultralisk({x:800,y:300,team:1});
            new Zerg.Broodling({x:700,y:150,team:1});
            new Zerg.InfestedTerran({x:700,y:250,team:1});
            new Zerg.Queen({x:800,y:150,team:1});
            new Zerg.Defiler({x:800,y:250,team:1});
            new Zerg.Mutalisk({x:750,y:50,team:1});
            new Zerg.Guardian({x:750,y:150,team:1});
            new Zerg.Devourer({x:750,y:250,team:1});
            new Zerg.Overlord({x:850,y:150,team:1});
            //Apply cheat for testing magic
            Game.commandTimeout(function(){
                Cheat.execute('show me the money');
                Cheat.execute('something for nothing');
                Cheat.execute('full recovery');
            },0);
        }
    },
    {
        level:7,
        load:function(){
            //Load map
            Map.setCurrentMap('BigGameHunters');
            //Apply race style
            Game.race.choose('Protoss');
            //Add buildings
            //Zerg buildings
            new Building.ZergBuilding.Hatchery({x:0,y:520});
            new Building.ZergBuilding.Lair({x:0,y:670}).life=150;
            new Building.ZergBuilding.Hive({x:0,y:820});
            new Building.ZergBuilding.CreepColony({x:150,y:520});
            new Building.ZergBuilding.SunkenColony({x:150,y:670});
            new Building.ZergBuilding.SporeColony({x:150,y:820,team:1});
            new Building.ZergBuilding.Extractor({x:300,y:520});
            new Building.ZergBuilding.SpawningPool({x:300,y:670});
            new Building.ZergBuilding.EvolutionChamber({x:300,y:820});
            new Building.ZergBuilding.HydraliskDen({x:450,y:520});
            new Building.ZergBuilding.Spire({x:450,y:670});
            new Building.ZergBuilding.GreaterSpire({x:450,y:820});
            new Building.ZergBuilding.QueenNest({x:600,y:520});
            new Building.ZergBuilding.NydusCanal({x:600,y:670});
            new Building.ZergBuilding.UltraliskCavern({x:600,y:820});
            new Building.ZergBuilding.DefilerMound({x:750,y:520});
            new Building.ZergBuilding.InfestedBase({x:750,y:670});
            new Building.ZergBuilding.OvermindI({x:750,y:820});
            new Building.ZergBuilding.OvermindII({x:900,y:520});
            //Terran buildings
            new Building.TerranBuilding.CommandCenter({x:0,y:1020,team:1}).life=375;
            new Building.TerranBuilding.SupplyDepot({x:0,y:1170,team:1});
            new Building.TerranBuilding.Refinery({x:0,y:1320});
            new Building.TerranBuilding.Barracks({x:150,y:1020});
            new Building.TerranBuilding.EngineeringBay({x:150,y:1170});
            new Building.TerranBuilding.MissileTurret({x:150,y:1320});
            new Building.TerranBuilding.Academy({x:300,y:1020});
            new Building.TerranBuilding.Bunker({x:300,y:1170});
            new Building.TerranBuilding.Factory({x:300,y:1320});
            new Building.TerranBuilding.Starport({x:450,y:1020});
            new Building.TerranBuilding.ScienceFacility({x:450,y:1170});
            new Building.TerranBuilding.Armory({x:450,y:1320});
            new Building.TerranBuilding.ComstatStation({x:600,y:1020});
            new Building.TerranBuilding.NuclearSilo({x:600,y:1170});
            new Building.TerranBuilding.MachineShop({x:600,y:1320});
            new Building.TerranBuilding.ControlTower({x:750,y:1020});
            new Building.TerranBuilding.PhysicsLab({x:750,y:1170});
            new Building.TerranBuilding.ConvertOps({x:750,y:1320});
            new Building.TerranBuilding.CrashCruiser({x:900,y:1020});
            new Building.TerranBuilding.BigCannon({x:900,y:1170});
            //Protoss buildings
            new Building.ProtossBuilding.Nexus({x:0,y:20}).life=150;
            new Building.ProtossBuilding.Pylon({x:0,y:170,team:1});
            new Building.ProtossBuilding.Assimilator({x:0,y:320});
            new Building.ProtossBuilding.Gateway({x:150,y:20});
            new Building.ProtossBuilding.Forge({x:150,y:170});
            new Building.ProtossBuilding.PhotonCannon({x:150,y:320});
            new Building.ProtossBuilding.CyberneticsCore({x:300,y:20});
            new Building.ProtossBuilding.ShieldBattery({x:300,y:170});
            new Building.ProtossBuilding.RoboticsFacility({x:300,y:320});
            new Building.ProtossBuilding.StarGate({x:450,y:20});
            new Building.ProtossBuilding.CitadelOfAdun({x:450,y:170});
            new Building.ProtossBuilding.RoboticsSupportBay({x:450,y:320});
            new Building.ProtossBuilding.FleetBeacon({x:600,y:20});
            new Building.ProtossBuilding.TemplarArchives({x:600,y:170});
            new Building.ProtossBuilding.Observatory({x:600,y:320});
            new Building.ProtossBuilding.ArbiterTribunal({x:750,y:20});
            new Building.ProtossBuilding.TeleportGate({x:750,y:170});
            new Building.ProtossBuilding.Pyramid({x:750,y:320});
            new Building.ProtossBuilding.TeleportPoint({x:900,y:20});
            //Apply cheat for testing magic
            Game.commandTimeout(function(){
                Cheat.execute('show me the money');
            },0);
        }
    },
    {
        level:8,
        label:'Campaign',
        load:function(){
            //Load map
            Map.setCurrentMap('TheHunters');
            Map.offsetX=0;
            Map.offsetY=3424;
            //Multiplayer
            Game.playerNum=4;
            //Choose side and apply race style
            var races=['Terran','Zerg','Terran','Protoss'];
            var startPoint=[{x:100,y:4000-innerHeight},{x:4000-innerWidth,y:4000-innerHeight},{x:100,y:100},{x:4000-innerWidth,y:100}];
            if (!Game.replayFlag) Game.team=Math.random()*4>>0;
            Game.race.choose(races[Game.team]);
            Map.offsetX=startPoint[Game.team].x;
            Map.offsetY=startPoint[Game.team].y;
            //Apply cheat
            Cheat.execute('black sheep wall');
            //Our buildings and units
            new Building.ZergBuilding.OvermindI({x:662,y:3828});
            new Building.ZergBuilding.OvermindII({x:300,y:3694});
            new Building.TerranBuilding.CrashCruiser({x:820,y:3600});
            new Building.TerranBuilding.BigCannon({x:260,y:3560});
            new Building.ProtossBuilding.Pyramid({x:560,y:3690});
            new Building.ProtossBuilding.TeleportGate({x:560,y:3558});
            new Building.ProtossBuilding.TeleportPoint({x:534,y:3884});
            new Hero.HeroCruiser({x:300,y:3455});
            new Hero.HeroCruiser({x:690,y:3500});
            new Hero.HeroCruiser({x:866,y:3744});
            new Hero.Sarah({x:434,y:3600});
            new Hero.Sarah({x:700,y:3730});
            new Hero.Kerrigan({x:464,y:3568});
            new Hero.Kerrigan({x:694,y:3690});
            new Protoss.Observer({x:484,y:3824});
            new Protoss.Observer({x:524,y:3824});
            //Zerg
            new Building.ZergBuilding.Hatchery({x:3470,y:3720,team:1});
            new Building.ZergBuilding.Lair({x:3265,y:3795,team:1});
            new Building.ZergBuilding.Hive({x:3650,y:3700,team:1});
            new Building.ZergBuilding.CreepColony({x:3488,y:3552,team:1});
            new Building.ZergBuilding.CreepColony({x:3264,y:3552,team:1});
            new Building.ZergBuilding.SunkenColony({x:3328,y:3552,team:1});
            new Building.ZergBuilding.SunkenColony({x:3392,y:3552,team:1});
            new Building.ZergBuilding.SporeColony({x:3136,y:3552,team:1});
            new Building.ZergBuilding.Extractor({x:3420,y:3800,team:1});
            new Building.ZergBuilding.SpawningPool({x:3440,y:3616,team:1});
            new Building.ZergBuilding.EvolutionChamber({x:3248,y:3616,team:1});
            new Building.ZergBuilding.HydraliskDen({x:3344,y:3616,team:1});
            new Building.ZergBuilding.Spire({x:3744,y:3552,team:1});
            new Building.ZergBuilding.GreaterSpire({x:3808,y:3616,team:1});
            new Building.ZergBuilding.QueenNest({x:3728,y:3616,team:1});
            new Building.ZergBuilding.NydusCanal({x:3200,y:3552,team:1});
            new Building.ZergBuilding.UltraliskCavern({x:3824,y:3520,team:1});
            new Building.ZergBuilding.DefilerMound({x:3104,y:3776,team:1});
            new Building.ZergBuilding.InfestedBase({x:3264,y:3920,team:1});
            new Zerg.Drone({x:3828,y:3724,team:1});
            new Zerg.Drone({x:3832,y:3826,team:1});
            new Zerg.Drone({x:3700,y:3850,team:1});
            new Zerg.Zergling({x:3473,y:3500,team:1});
            new Zerg.Zergling({x:3541,y:3535,team:1});
            new Zerg.Hydralisk({x:3314,y:3500,team:1});
            new Zerg.Hydralisk({x:3353,y:3500,team:1});
            new Zerg.Overlord({x:3044,y:3632,team:1});
            new Zerg.Overlord({x:3522,y:3438,team:1});
            new Zerg.Mutalisk({x:3135,y:3615,team:1});
            new Zerg.Mutalisk({x:3870,y:3596,team:1});
            new Zerg.Devourer({x:3292,y:3675,team:1});
            new Zerg.Devourer({x:3644,y:3535,team:1});
            new Zerg.Guardian({x:3138,y:3675,team:1});
            new Zerg.Guardian({x:3580,y:3585,team:1});
            new Zerg.Scourge({x:3154,y:3490,team:1});
            new Zerg.Scourge({x:3213,y:3668,team:1});
            new Zerg.Lurker({x:3260,y:3500,team:1});
            new Zerg.Lurker({x:3408,y:3500,team:1});
            new Zerg.Ultralisk({x:3638,y:3463,team:1});
            new Zerg.Broodling({x:3602,y:3666,team:1});
            new Zerg.InfestedTerran({x:3184,y:3950,team:1});
            new Zerg.Queen({x:3647,y:3610,team:1});
            new Zerg.Defiler({x:3047,y:3710,team:1});
            //Terran
            new Building.TerranBuilding.CommandCenter({x:320,y:180,team:2});
            new Building.TerranBuilding.ComstatStation({x:434,y:220,team:2});
            new Building.TerranBuilding.SupplyDepot({x:368,y:416,team:2});
            new Building.TerranBuilding.SupplyDepot({x:464,y:416,team:2});
            new Building.TerranBuilding.SupplyDepot({x:368,y:480,team:2});
            new Building.TerranBuilding.SupplyDepot({x:464,y:480,team:2});
            new Building.TerranBuilding.Refinery({x:96,y:246,team:2});
            new Building.TerranBuilding.Barracks({x:576,y:432,team:2});
            new Building.TerranBuilding.EngineeringBay({x:576,y:336,team:2});
            new Building.TerranBuilding.MissileTurret({x:384,y:576,team:2});
            new Building.TerranBuilding.MissileTurret({x:544,y:576,team:2});
            new Building.TerranBuilding.Academy({x:272,y:416,team:2});
            new Building.TerranBuilding.Bunker({x:636,y:556,team:2});
            new Building.TerranBuilding.Bunker({x:764,y:460,team:2});
            new Building.TerranBuilding.Factory({x:732,y:220,team:2});
            new Building.TerranBuilding.MachineShop({x:832,y:256,team:2});
            new Building.TerranBuilding.Starport({x:732,y:316,team:2});
            new Building.TerranBuilding.ControlTower({x:832,y:352,team:2});
            new Building.TerranBuilding.ScienceFacility({x:60,y:390,team:2});
            new Building.TerranBuilding.PhysicsLab({x:160,y:416,team:2});
            new Building.TerranBuilding.Armory({x:272,y:480,team:2});
            new Terran.SCV({x:246,y:116,team:2});
            new Terran.SCV({x:400,y:114,team:2});
            new Terran.SCV({x:222,y:220,team:2});
            new Terran.Marine({x:816,y:528,team:2});
            new Terran.Marine({x:726,y:590,team:2});
            new Terran.Firebat({x:692,y:618,team:2});
            new Terran.Firebat({x:846,y:526,team:2});
            new Terran.Ghost({x:690,y:530,team:2});
            new Terran.Medic({x:725,y:528,team:2});
            new Terran.Vulture({x:918,y:373,team:2});
            new Terran.Vulture({x:920,y:512,team:2});
            new Terran.Tank({x:922,y:325,team:2});
            new Terran.Tank({x:920,y:468,team:2});
            new Terran.Goliath({x:918,y:270,team:2});
            new Terran.Goliath({x:940,y:420,team:2});
            new Terran.Wraith({x:672,y:400,team:2});
            new Terran.Wraith({x:728,y:400,team:2});
            new Terran.Dropship({x:475,y:548,team:2});
            new Terran.Vessel({x:692,y:472,team:2});
            new Terran.BattleCruiser({x:500,y:326,team:2});
            new Terran.BattleCruiser({x:580,y:510,team:2});
            new Terran.Valkyrie({x:790,y:400,team:2});
            new Terran.Valkyrie({x:854,y:400,team:2});
            new Terran.Civilian({x:400,y:350,team:2});
            new Terran.Civilian({x:580,y:250,team:2});
            //Protoss
            new Building.ProtossBuilding.Nexus({x:3614,y:222,team:3});
            new Building.ProtossBuilding.Pylon({x:3296,y:512,team:3});
            new Building.ProtossBuilding.Pylon({x:3424,y:288,team:3});
            new Building.ProtossBuilding.Pylon({x:3648,y:512,team:3});
            new Building.ProtossBuilding.Assimilator({x:3582,y:86,team:3});
            new Building.ProtossBuilding.Gateway({x:3648,y:624,team:3});
            new Building.ProtossBuilding.Forge({x:3504,y:448,team:3});
            new Building.ProtossBuilding.PhotonCannon({x:3200,y:448,team:3});
            new Building.ProtossBuilding.PhotonCannon({x:3200,y:608,team:3});
            new Building.ProtossBuilding.PhotonCannon({x:3392,y:608,team:3});
            new Building.ProtossBuilding.CyberneticsCore({x:3760,y:448,team:3});
            new Building.ProtossBuilding.ShieldBattery({x:3728,y:544,team:3});
            new Building.ProtossBuilding.RoboticsFacility({x:3344,y:224,team:3});
            new Building.ProtossBuilding.StarGate({x:3232,y:304,team:3});
            new Building.ProtossBuilding.CitadelOfAdun({x:3632,y:408,team:3});
            new Building.ProtossBuilding.RoboticsSupportBay({x:3344,y:384,team:3});
            new Building.ProtossBuilding.FleetBeacon({x:3438,y:182,team:3});
            new Building.ProtossBuilding.TemplarArchives({x:3504,y:544,team:3});
            new Building.ProtossBuilding.Observatory({x:3504,y:320,team:3});
            new Building.ProtossBuilding.ArbiterTribunal({x:3216,y:192,team:3});
            new Protoss.Probe({x:3668,y:202,team:3});
            new Protoss.Probe({x:3794,y:244,team:3});
            new Protoss.Probe({x:3796,y:338,team:3});
            new Protoss.Zealot({x:3535,y:640,team:3});
            new Protoss.Zealot({x:3635,y:736,team:3});
            new Protoss.Dragoon({x:3536,y:688,team:3});
            new Protoss.Dragoon({x:3585,y:720,team:3});
            new Protoss.Templar({x:3472,y:655,team:3});
            new Protoss.DarkTemplar({x:3730,y:712,team:3});
            new Protoss.Reaver({x:3358,y:475,team:3});
            new Protoss.Archon({x:3478,y:722,team:3});
            new Protoss.DarkArchon({x:3780,y:636,team:3});
            new Protoss.Shuttle({x:3296,y:612,team:3});
            new Protoss.Observer({x:3250,y:398,team:3});
            new Protoss.Observer({x:3378,y:692,team:3});
            new Protoss.Arbiter({x:3350,y:296,team:3});
            new Protoss.Scout({x:3132,y:390,team:3});
            new Protoss.Scout({x:3100,y:636,team:3});
            new Protoss.Carrier({x:3102,y:470,team:3});
            new Protoss.Corsair({x:3106,y:580,team:3});
            new Protoss.Corsair({x:3838,y:544,team:3});
            //Apply cheat for testing magic
            Game.commandTimeout(function(){
                Cheat.execute('show me the money');
            },0);
        }
    },
    {
        level:9,
        label:'ProtectAthena',
        load:function(){
            //Load map
            Map.setCurrentMap('OrbitalRelay');
            Map.offsetX=(1536-Game.HBOUND/2)>>0;
            Map.offsetY=(1536-Game.VBOUND/2)>>0;
            Map.fogFlag=false;
            //Apply race style
            Game.race.choose('Protoss');
            //Single player
            Multiplayer.ON=false;
            //Add our buildings and units
            //Override
            Building.ProtossBuilding.Pyramid.prototype.HP=3000;
            Building.ProtossBuilding.Pyramid.prototype.SP=3000;
            Building.ProtossBuilding.Pyramid.prototype.detector=Gobj.detectorBuffer;
            //Patch: Overlord speed up
            Game.commandTimeout(function() {
                Upgrade.EvolvePneumatizedCarapace.effect(1);
                Upgrade.IncreaseCarrierCapacity.effect(1);
            },0);
            //Patch: Larva can move
            Zerg.Larva.prototype.moveTo=Unit.prototype.moveTo;
            Zerg.Larva.prototype.moveToward=Unit.prototype.moveToward;
            var Pyramid=new Building.ProtossBuilding.Pyramid({x:1450,y:1480});
            for (var N=0;N<6;N++){
                new Hero.HeroCruiser({x:1470,y:1500});
            }
            //Override win and lose condition
            Referee.winCondition=function(){
                return false;
            };
            Referee.loseCondition=function(){
                return Pyramid.status=='dead';//Closure
            };
            //Enemy coming
            var offsets=[{x:1536,y:36},{x:1536,y:3036},{x:36,y:1536},{x:3036,y:1536},
                {x:486,y:486},{x:486,y:2586},{x:2586,y:486},{x:2586,y:2586}];
            var num=0, wave=1;
            var interval=20000;//20 seconds per wave
            _$.traverse([Neutral,Zerg,Terran,Protoss],function(enemyType){
                Game.commandTimeout(function(){
                    offsets.forEach(function(offset){
                        offset.team=1;
                        new enemyType(offset).attackGround({x:1536,y:1536});
                    });
                    Game.showWarning('Wave '+ wave++ +': '+enemyType.prototype.name);
                },interval*num++);
            });
            //Game win when time reach
            Game.commandTimeout(function(){
                Game.win();
            },interval*num+interval);
        }
    },
    {
        level:10,
        label:'HUNTERxHUNTER',
        /*Once upon a time there was a young hunter lost in strange jungle, and was warmly welcome by forest friends.
        # About 200 units in the map, designed for stress test
        # You have 6 random kinds of magic, and will refresh when you killed each 50 units
        # You can use magic freely without MP consumption
        # Kill 10 units will upgrade, enemies will upgrade every 1 minute
        # Infinite enemy number and unlimited upgrade level
        # Two different modes: easy and nightmare*/
        load:function(){
            /*var isNightmare=confirm('Want challenge nightmare mode?');
            if (!isNightmare){
                //Make it easy
                Hero.DevilHunter.prototype.HP=9999;
                Hero.DevilHunter.prototype.SP=9999;
                Hero.DevilHunter.prototype.MP=999;
                Hero.DevilHunter.prototype.damage=50;
                Hero.DevilHunter.prototype.isInvisible=true;
            }*/
            var isNightmare=true;
            //Load map
            Map.setCurrentMap('Grass');
            var mapSize=Map.getCurrentMap();
            Map.offsetX=(mapSize.width-Game.HBOUND)/2>>0;
            Map.offsetY=(mapSize.height-Game.VBOUND)/2>>0;
            //Apply race style
            Game.race.choose('Zerg');
            //Single player
            Multiplayer.ON=false;
            //Show me the money
            Game.commandTimeout(function(){
                Resource[0].mine=Resource[0].gas=9999;
            },0);
            //Fulfill nuclear bombs
            Magic.NuclearStrike.enabled=999;
            //Change kill to EXP:
            $('p.kill').html('<b style="color:red">EXP:</b><span></span>');
            //Magic infinite
            Cheat.execute('the gathering');
            //Patch: Overlord speed up
            Game.commandTimeout(function(){
                Upgrade.EvolvePneumatizedCarapace.effect(1);
                Upgrade.IncreaseCarrierCapacity.effect(1);
            },0);
            //Override win and lose condition
            Referee.winCondition=function(){
                //Infinite enemies
                if (Unit.allUnits.length<150) {
                    Game.showWarning('Refreshing...');
                    Levels.enemyWave();
                    Levels.refreshMagic();
                }
                //Upgrade your hunter
                var curLevel=Levels.DevilHunter.kill/10>>0;
                if (curLevel>Levels.DevilHunter.level){
                    for (var N=0;N<curLevel-Levels.DevilHunter.level;N++){
                        //Upgraded
                        if (isNightmare){
                            Hero.DevilHunter.prototype.HP[0]+=100;
                            Hero.DevilHunter.prototype.SP[0]+=100;
                            Hero.DevilHunter.prototype.MP[0]+=10;
                        }
                        Cheat.execute("something for nothing");
                        Cheat.execute("full recovery");
                        Levels.DevilHunter.level=curLevel;
                        Game.refreshInfo();
                        Referee.voice('upgrade')[Game.race.selected].play();
                        Game.showMessage('Upgrade complete');
                    }
                }
                return false;
            };
            //Random magics for hunter
            Levels.refreshMagic=function(){
                var magics=["Parasite","SpawnBroodlings","Ensnare","DarkSwarm","Plague","StimPacks","Lockdown","NuclearStrike",
                    "Restoration","OpticalFlare","DefensiveMatrix","EMPShockwave","Irradiate","Yamato","ScannerSweep","PsionicStorm",
                    "Hallucination","Feedback","MindControl","MaelStorm","Recall","StasisField","DisruptionWeb","RechargeShields"];
                var items={};
                for (var N=4;N<=9;N++){
                    //Doesn't affect replay here
                    var index=Math.random()*magics.length>>0;
                    items[N]={name:magics[index]};
                    magics.splice(index,1);
                }
                Hero.DevilHunter.prototype.items=items;
                Button.refreshButtons();
            };
            Levels.refreshMagic();
            //Add units on map
            Levels.DevilHunter=new Hero.DevilHunter({x:mapSize.width/2,y:mapSize.height/2});
            Levels.DevilHunter.level=0;
            Game.commandTimeout(function(){
                Game.changeSelectedTo(Levels.DevilHunter);
            },0);
            //Enemy coming
            Levels.enemyWave=function(){
                var pos={team:1};
                _$.traverse([Neutral,Zerg,Terran,Protoss],function(enemyType){
                    pos.x=(Game.getNextRandom()*mapSize.width)>>0;
                    pos.y=(Game.getNextRandom()*mapSize.height)>>0;
                    var enemy=new enemyType(pos);
                    if (enemy.attack){
                        enemy.attackLimit=null;
                    }
                });
            };
            for(var N=0;N<4;N++){
                Levels.enemyWave();
            }
            //Enemies will becomes stronger and stronger
            Game.commandInterval(function(){
                Game.showWarning('Enemies become stronger!');
                //Upgrade all grades for enemy
                for (var grade in Upgrade){
                    Upgrade[grade].effect(1);
                }
            },isNightmare?90000:60000);
            //Baby hunter will talk every 30s
            var speech=[
                "What the hell is going on? Where am I?",
                "This world is weird! There must be some mistake!",
                "Hey, gloomyson, you sent me to the wrong game!",
                "I'm so scared! I want my mummy!",
                "Let me out! I wanna go home! Plz!",
                "You dare fool me? I'm blind not deaf!",
                "Do you know who I am? My papa is GinBliz!",
                "Let me out of here! Or I'll tell papa to sue you!",
                "At least let me pass hunter exam and get license first!",
                "Nen power, release!",
                "Help me, Killua, Kurapika!",
                "(T_T) cry~~~"
            ];
            for (var N=0;N<speech.length;N++){
                (function(n){
                    Game.commandTimeout(function(){
                        Game.showMessage('HunterBoy: '+speech[n],5000);
                    },n*30000+10000);
                })(N);
            }
        }
    },
    {
        level:11,
        label:'TowerDefense',
        load:function(){
            //Load map
            Map.setCurrentMap('TowerDefense');
            Map.offsetX=4096-Game.HBOUND;
            Map.offsetY=3072-Game.VBOUND;
            Map.fogFlag=false;
            //Apply race style
            Game.race.choose('Terran');
            //Single player
            Multiplayer.ON=false;
            //Patch
            Game.commandTimeout(function(){
                Upgrade.EvolvePneumatizedCarapace.effect(1);
            },0);
            Building.prototype.sight=1000;
            Map.drawMud=function(){};
            Zerg.Lurker.prototype.reactionWhenAttackedBy=Unit.prototype.reactionWhenAttackedBy;
            Zerg.Larva.prototype.moveTo=Unit.prototype.moveTo;
            Zerg.Larva.prototype.moveToward=Unit.prototype.moveToward;
            //Missile fixed duration, original behavior
            Bullets.Spore.prototype.duration=500;
            delete Bullets.Spore.prototype.speedVal;
            Bullets.SingleMissile.prototype.duration=600;
            delete Bullets.SingleMissile.prototype.speedVal;
            Bullets.DragoonBall.prototype.duration=800;
            delete Bullets.DragoonBall.prototype.speedVal;
            //Upgrade utility
            Building.ProtossBuilding.TeleportPoint.prototype.items={
                '1':{name:'UpgradeSunkenDamage'},
                '2':{name:'EnlargeSunkenArea'},
                '3':{name:'UpgradeSporeDamage'},
                '4':{name:'EnlargeSporeChain'},
                '5':{name:'UpgradeMissileDamage'},
                '6':{name:'IncreaseMissileCount'},
                '7':{name:'UpgradePhotonCannonDamage'},
                '8':{name:'IncreasePhotonCannonCount'},
                '9':{name:'CleanScreen'}
            };
            //#######Transform defensing tower#######
            //Circle attack: 1 VS N
            Building.ZergBuilding.SunkenColony.prototype.AOE={
                type:"CIRCLE",
                hasEffect:true,
                radius:50
            };
            Building.ZergBuilding.SunkenColony.prototype.upgrade=['UpgradeSunkenDamage','EnlargeSunkenArea'];
            Building.ZergBuilding.SporeColony.prototype.upgrade=['UpgradeSporeDamage','EnlargeSporeChain'];
            Building.TerranBuilding.MissileTurret.prototype.upgrade=['UpgradeMissileDamage','IncreaseMissileCount'];
            Building.ProtossBuilding.PhotonCannon.prototype.upgrade=['UpgradePhotonCannonDamage','IncreasePhotonCannonCount'];
            //Chain attack: 1 VS 1+1+1
            Bullets.Spore.prototype.fire=function(){
                this.life=this.traceTimes;
                Bullets.prototype.fire.apply(this,arguments);
            };
            Bullets.Spore.prototype.die=Bullets.Darts.prototype.die;
            Bullets.Spore.prototype.traceTimes=1;
            Bullets.Spore.prototype.traceRadius=100;
            Bullets.Spore.prototype.noDamage=true;
            //Multiple bullets attack: N VS N
            Building.TerranBuilding.MissileTurret.prototype.AOE={
                type:"MULTIPLE",
                hasEffect:false,
                radius:150,
                count:1
            };
            //Multiple times attack: N VS 1
            Building.ProtossBuilding.PhotonCannon.prototype.continuousAttack={
                count:1,
                layout:function(bullet,num){
                    //Reassign location
                    if (Math.abs(bullet.speed.x)>Math.abs(bullet.speed.y)){
                        if (bullet.speed.x>0) {
                            bullet.x+=(20*num);
                            bullet.y+=(20*num*bullet.speed.y/bullet.speed.x)>>0;
                        }
                        else {
                            bullet.x-=(20*num);
                            bullet.y-=(20*num*bullet.speed.y/bullet.speed.x)>>0;
                        }
                    }
                    else {
                        if (bullet.speed.y>0) {
                            bullet.y+=(20*num);
                            bullet.x+=(20*num*bullet.speed.x/bullet.speed.y)>>0;
                        }
                        else {
                            bullet.y-=(20*num);
                            bullet.x-=(20*num*bullet.speed.x/bullet.speed.y)>>0;
                        }
                    }
                }
            };
            //Add our buildings
            Building.ZergBuilding.SunkenColony.prototype.attackLimit=null;
            Building.ZergBuilding.SunkenColony.prototype.attackRange=700;
            Building.ZergBuilding.SunkenColony.prototype.HP=9999;
            new Building.ZergBuilding.SunkenColony({x:2524,y:452});
            new Building.ZergBuilding.SunkenColony({x:60,y:1500});
            new Building.ZergBuilding.SunkenColony({x:2438,y:2320});
            Building.ZergBuilding.SporeColony.prototype.attackLimit=null;
            Building.ZergBuilding.SporeColony.prototype.attackRange=700;
            Building.ZergBuilding.SporeColony.prototype.HP=9999;
            new Building.ZergBuilding.SporeColony({x:3980,y:1500});
            new Building.ZergBuilding.SporeColony({x:1476,y:452});
            new Building.ZergBuilding.SporeColony({x:1240,y:2956});
            Building.TerranBuilding.MissileTurret.prototype.attackLimit=null;
            Building.TerranBuilding.MissileTurret.prototype.attackRange=700;
            Building.TerranBuilding.MissileTurret.prototype.HP=9999;
            new Building.TerranBuilding.MissileTurret({x:3228,y:2632});
            new Building.TerranBuilding.MissileTurret({x:2000,y:80});
            new Building.TerranBuilding.MissileTurret({x:784,y:2320});
            Building.ProtossBuilding.PhotonCannon.prototype.attackLimit=null;
            Building.ProtossBuilding.PhotonCannon.prototype.attackRange=700;
            Building.ProtossBuilding.PhotonCannon.prototype.SP=9999;
            new Building.ProtossBuilding.PhotonCannon({x:3228,y:1054});
            new Building.ProtossBuilding.PhotonCannon({x:784,y:1054});
            new Building.ProtossBuilding.PhotonCannon({x:1684,y:2320});
            Building.ProtossBuilding.TeleportPoint.prototype.SP=9999;
            new Building.ProtossBuilding.TeleportPoint({x:2060,y:1586});
            //Add our unit
            new Hero.Tassadar({x:3200,y:3072-Game.VBOUND/2}).magic=999;
            //Override win and lose condition
            var killCount=0;//Closure
            Referee.winCondition=function(){
                var kills=0;
                Building.ourBuildings().forEach(function(build){
                    if (build.kill) kills+=build.kill;
                });
                if (kills>killCount){
                    Resource[0].mine+=(kills-killCount);
                    killCount=kills;
                }
                return (wave>num && Unit.allEnemyUnits().length==0);
            };
            var LIFE=20;
            Referee.loseCondition=function(){
                //Closure LIFE
                Unit.allEnemyUnits().forEach(function(chara){
                    if (chara.inside({centerX:2048,centerY:1536,radius:200})){
                        LIFE--;
                        Game.showMessage('Remaining life: '+LIFE);
                        chara.die();
                    }
                });
                return (LIFE<=0);
            };
            //Enemy coming
            var num=0, wave=1;
            var interval=30000;//30 seconds per wave
            _$.traverse([Neutral,Zerg,Terran,Protoss],function(enemyType){
                Game.commandTimeout(function(){
                    for (var N=0;N<15;N++){
                        (function(n){
                            Game.commandTimeout(function(){
                                var enemy=new enemyType({x:3622,y:2916,team:1});
                                //Focus on routing
                                if (enemy.attack) enemy.attack=function(){
                                    this.targetLock=true;
                                };
                                //Enemies route
                                Game.commandTimeout(function(){
                                    enemy.targetLock=true;
                                    enemy.destination={x:3622,y:280};
                                    enemy.destination.next={x:422,y:280};
                                    enemy.destination.next.next={x:422,y:2800};
                                    enemy.destination.next.next.next={x:2100,y:2800};
                                    enemy.destination.next.next.next.next={x:2100,y:1500};
                                },0);
                            },n*1000);
                        })(N);
                    }
                    Game.showWarning('Wave '+ wave++ +': '+enemyType.prototype.name);
                },interval*num++);
            });
            //Game win when time reach
            Game.commandTimeout(function(){
                Game.win();
            },interval*num+60000);
        }
    },
    {
        level:12,
        label:'Replay',
        load:function(){
            //Load replay
            var lastReplay=localStorage.getItem('lastReplay');
            if (lastReplay!=null){
                Game.replayFlag=true;
                //Map.fogFlag=false;
                // Should not click buttons or trigger key control during replay
                Button.equipButtonsFor=function(){};
                //Equip with replay buttons
                Button.equipButtonsForReplay();
                //Parse last replay data
                lastReplay=JSON.parse(lastReplay);
                //Select same team
                if (lastReplay.hasOwnProperty('team')) Game.team=lastReplay.team;
                Levels[lastReplay.level-1].load();
                Game.replayLevel=lastReplay.level;
                //Parse user moves
                var recordCmds=lastReplay.cmds;
                for (var tick in recordCmds){
                    Multiplayer.parseTickCmd({tick:parseInt(tick),cmds:recordCmds[tick]});
                }
                //Replay ends
                Game.endTick=lastReplay.end;
                Game.commandTimeout(function(){
                    Game.stopAnimation();
                    $('div.panel_Control button').attr('disabled',true);
                    Game.showMessage('Replay ended...',10000);
                },100*Game.endTick);
            }
            else {
                alert('Cannot find any replay!');
                //Error occurs
                delete Game.level;
                return true;
            }
        }
    }
];