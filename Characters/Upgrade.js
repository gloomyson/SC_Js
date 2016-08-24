var Upgrade={
    //Terran
    UpgradeInfantryWeapons:{
        name:"UpgradeInfantryWeapons",
        cost:{
            mine:[100,175,250],
            gas:[100,175,250],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Terran.Marine.prototype.damage[team]+=1;
            Terran.Firebat.prototype.damage[team]+=2;
            Terran.Ghost.prototype.damage[team]+=1;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.TerranBuilding.EngineeringBay.prototype.items[1];
        }
    },
    UpgradeInfantryArmors:{
        name:"UpgradeInfantryArmors",
        cost:{
            mine:[100,175,250],
            gas:[100,175,250],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Terran.SCV.prototype.armor[team]+=1;
            Terran.Marine.prototype.armor[team]+=1;
            Terran.Firebat.prototype.armor[team]+=1;
            Terran.Ghost.prototype.armor[team]+=1;
            Terran.Medic.prototype.armor[team]+=1;
            Terran.Civilian.prototype.armor[team]+=1;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.TerranBuilding.EngineeringBay.prototype.items[2];
        }
    },
    ResearchU238Shells:{
        name:"ResearchU238Shells",
        cost:{
            mine:150,
            gas:150,
            time:1000
        },
        effect:function(team){
            Terran.Marine.prototype.attackRange[team]=175;
            delete Building.TerranBuilding.Academy.prototype.items[1];
        }
    },
    ResearchStimPackTech:{
        name:"ResearchStimPackTech",
        cost:{
            mine:100,
            gas:100,
            time:800
        },
        effect:function(){
            Magic.StimPacks.enabled=true;
            delete Building.TerranBuilding.Academy.prototype.items[2];
        }
    },
    ResearchRestoration:{
        name:"ResearchRestoration",
        cost:{
            mine:100,
            gas:100,
            time:800
        },
        effect:function(){
            Magic.Restoration.enabled=true;
            delete Building.TerranBuilding.Academy.prototype.items[4];
        }
    },
    ResearchOpticalFlare:{
        name:"ResearchOpticalFlare",
        cost:{
            mine:100,
            gas:100,
            time:1200
        },
        effect:function(){
            Magic.OpticalFlare.enabled=true;
            delete Building.TerranBuilding.Academy.prototype.items[5];
        }
    },
    ResearchCaduceusReactor:{
        name:"ResearchCaduceusReactor",
        cost:{
            mine:150,
            gas:150,
            time:1660
        },
        effect:function(team){
            Terran.Medic.prototype.MP[team]=250;
            delete Building.TerranBuilding.Academy.prototype.items[6];
        }
    },
    ResearchIonThrusters:{
        name:"ResearchIonThrusters",
        cost:{
            mine:100,
            gas:100,
            time:1000
        },
        effect:function(team){
            Terran.Vulture.prototype.speed[team]=20;
            delete Building.TerranBuilding.MachineShop.prototype.items[1];
        }
    },
    ResearchSpiderMines:{
        name:"ResearchSpiderMines",
        cost:{
            mine:100,
            gas:100,
            time:800
        },
        effect:function(){
            Magic.SpiderMines.enabled=true;
            delete Building.TerranBuilding.MachineShop.prototype.items[2];
        }
    },
    ResearchSiegeTech:{
        name:"ResearchSiegeTech",
        cost:{
            mine:150,
            gas:150,
            time:800
        },
        effect:function(){
            Magic.SeigeMode.enabled=true;
            delete Building.TerranBuilding.MachineShop.prototype.items[3];
        }
    },
    ResearchCharonBoosters:{
        name:"ResearchCharonBoosters",
        cost:{
            mine:150,
            gas:150,
            time:1330
        },
        effect:function(team){
            Terran.Goliath.prototype.attackMode.flying.attackRange[team]=300;
            delete Building.TerranBuilding.MachineShop.prototype.items[4];
        }
    },
    ResearchCloakingField:{
        name:"ResearchCloakingField",
        cost:{
            mine:150,
            gas:150,
            time:1000
        },
        effect:function(){
            Magic.Cloak.enabled=true;
            delete Building.TerranBuilding.ControlTower.prototype.items[1];
        }
    },
    ResearchApolloReactor:{
        name:"ResearchApolloReactor",
        cost:{
            mine:200,
            gas:200,
            time:1660
        },
        effect:function(team){
            Terran.Wraith.prototype.MP[team]=250;
            delete Building.TerranBuilding.ControlTower.prototype.items[2];
        }
    },
    ResearchEMPShockwaves:{
        name:"ResearchEMPShockwaves",
        cost:{
            mine:200,
            gas:200,
            time:1200
        },
        effect:function(){
            Magic.EMPShockwave.enabled=true;
            delete Building.TerranBuilding.ScienceFacility.prototype.items[1];
        }
    },
    ResearchIrradiate:{
        name:"ResearchIrradiate",
        cost:{
            mine:150,
            gas:150,
            time:800
        },
        effect:function(){
            Magic.Irradiate.enabled=true;
            delete Building.TerranBuilding.ScienceFacility.prototype.items[2];
        }
    },
    ResearchTitanReactor:{
        name:"ResearchTitanReactor",
        cost:{
            mine:150,
            gas:150,
            time:1660
        },
        effect:function(team){
            Terran.Vessel.prototype.MP[team]=250;
            delete Building.TerranBuilding.ScienceFacility.prototype.items[3];
        }
    },
    ResearchLockdown:{
        name:"ResearchLockdown",
        cost:{
            mine:200,
            gas:200,
            time:1000
        },
        effect:function(){
            Magic.Lockdown.enabled=true;
            delete Building.TerranBuilding.ConvertOps.prototype.items[1];
        }
    },
    ResearchPersonalCloaking:{
        name:"ResearchPersonalCloaking",
        cost:{
            mine:100,
            gas:100,
            time:800
        },
        effect:function(){
            Magic.PersonalCloak.enabled=true;
            delete Building.TerranBuilding.ConvertOps.prototype.items[2];
        }
    },
    ResearchOcularImplants:{
        name:"ResearchOcularImplants",
        cost:{
            mine:100,
            gas:100,
            time:1660
        },
        effect:function(team){
            Terran.Ghost.prototype.sight[team]=385;
            delete Building.TerranBuilding.ConvertOps.prototype.items[4];
        }
    },
    ResearchMoebiusReactor:{
        name:"ResearchMoebiusReactor",
        cost:{
            mine:150,
            gas:150,
            time:1660
        },
        effect:function(team){
            Terran.Ghost.prototype.MP[team]=250;
            delete Building.TerranBuilding.ConvertOps.prototype.items[5];
        }
    },
    ResearchYamatoGun:{
        name:"ResearchYamatoGun",
        cost:{
            mine:200,
            gas:200,
            time:1200
        },
        effect:function(){
            Magic.Yamato.enabled=true;
            delete Building.TerranBuilding.PhysicsLab.prototype.items[1];
        }
    },
    ResearchColossusReactor:{
        name:"ResearchColossusReactor",
        cost:{
            mine:150,
            gas:150,
            time:1600
        },
        effect:function(team){
            Terran.BattleCruiser.prototype.MP[team]=250;
            delete Building.TerranBuilding.PhysicsLab.prototype.items[2];
        }
    },
    UpgradeVehicleWeapons:{
        name:"UpgradeVehicleWeapons",
        cost:{
            mine:[100,175,250],
            gas:[100,175,250],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Terran.Vulture.prototype.damage[team]+=2;
            Terran.Tank.prototype.damage[team]+=3;
            Terran.Goliath.prototype.attackMode.ground.damage[team]+=2;
            Terran.Goliath.prototype.attackMode.flying.damage[team]+=4;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.TerranBuilding.Armory.prototype.items[1];
        }
    },
    UpgradeShipWeapons:{
        name:"UpgradeShipWeapons",
        cost:{
            mine:[100,150,200],
            gas:[100,150,200],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Terran.Wraith.prototype.attackMode.ground.damage[team]+=1;
            Terran.Wraith.prototype.attackMode.flying.damage[team]+=2;
            Terran.BattleCruiser.prototype.damage[team]+=3;
            Terran.Valkyrie.prototype.damage[team]+=1;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.TerranBuilding.Armory.prototype.items[2];
        }
    },
    UpgradeVehicleArmors:{
        name:"UpgradeVehicleArmors",
        cost:{
            mine:[100,175,250],
            gas:[100,175,250],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Terran.Vulture.prototype.armor[team]+=1;
            Terran.Tank.prototype.armor[team]+=1;
            Terran.Goliath.prototype.armor[team]+=1;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.TerranBuilding.Armory.prototype.items[4];
        }
    },
    UpgradeShipArmors:{
        name:"UpgradeShipArmors",
        cost:{
            mine:[150,225,300],
            gas:[150,225,300],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Terran.Wraith.prototype.armor[team]+=1;
            Terran.Dropship.prototype.armor[team]+=1;
            Terran.BattleCruiser.prototype.armor[team]+=1;
            Terran.Vessel.prototype.armor[team]+=1;
            Terran.Valkyrie.prototype.armor[team]+=1;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.TerranBuilding.Armory.prototype.items[5];
        }
    },
    //Zerg
    EvolveBurrow:{
        name:"EvolveBurrow",
        cost:{
            mine:100,
            gas:100,
            time:800
        },
        effect:function(){
            Magic.Burrow.enabled=Magic.Unburrow.enabled=true;
            delete Building.ZergBuilding.Hatchery.prototype.items[3];
            delete Building.ZergBuilding.Lair.prototype.items[3];
            delete Building.ZergBuilding.Hive.prototype.items[3];
        }
    },
    EvolveVentralSacs:{
        name:"EvolveVentralSacs",
        cost:{
            mine:200,
            gas:200,
            time:1600
        },
        effect:function(){
            Magic.Load.enabled=Magic.UnloadAll.enabled=true;
            delete Building.ZergBuilding.Lair.prototype.items[4];
            delete Building.ZergBuilding.Hive.prototype.items[4];
        }
    },
    EvolveAntennas:{
        name:"EvolveAntennas",
        cost:{
            mine:150,
            gas:150,
            time:1330
        },
        effect:function(team){
            Zerg.Overlord.prototype.sight[team]=385;
            delete Building.ZergBuilding.Lair.prototype.items[5];
            delete Building.ZergBuilding.Hive.prototype.items[5];
        }
    },
    EvolvePneumatizedCarapace:{
        name:"EvolvePneumatizedCarapace",
        cost:{
            mine:150,
            gas:150,
            time:1330
        },
        effect:function(team){
            Zerg.Overlord.prototype.speed[team]=8;
            delete Building.ZergBuilding.Lair.prototype.items[6];
            delete Building.ZergBuilding.Hive.prototype.items[6];
        }
    },
    EvolveMetabolicBoost:{
        name:"EvolveMetabolicBoost",
        cost:{
            mine:100,
            gas:100,
            time:1000
        },
        effect:function(team){
            Zerg.Zergling.prototype.speed[team]=18;
            delete Building.ZergBuilding.SpawningPool.prototype.items[1];
        }
    },
    EvolveAdrenalGlands:{
        name:"EvolveAdrenalGlands",
        cost:{
            mine:200,
            gas:200,
            time:1000
        },
        effect:function(team){
            Zerg.Zergling.prototype.attackInterval[team]=600;
            delete Building.ZergBuilding.SpawningPool.prototype.items[2];
        }
    },
    UpgradeMeleeAttacks:{
        name:"UpgradeMeleeAttacks",
        cost:{
            mine:[100,150,200],
            gas:[100,150,200],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Zerg.Zergling.prototype.damage[team]+=1;
            Zerg.Ultralisk.prototype.damage[team]+=3;
            Zerg.Broodling.prototype.damage[team]+=1;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.ZergBuilding.EvolutionChamber.prototype.items[1];
        }
    },
    UpgradeMissileAttacks:{
        name:"UpgradeMissileAttacks",
        cost:{
            mine:[100,150,200],
            gas:[100,150,200],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Zerg.Hydralisk.prototype.damage[team]+=1;
            Zerg.Lurker.prototype.damage[team]+=2;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.ZergBuilding.EvolutionChamber.prototype.items[2];
        }
    },
    EvolveCarapace:{
        name:"EvolveCarapace",
        cost:{
            mine:[150,225,300],
            gas:[150,225,300],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Zerg.Drone.prototype.armor[team]+=1;
            Zerg.Zergling.prototype.armor[team]+=1;
            Zerg.Hydralisk.prototype.armor[team]+=1;
            Zerg.Lurker.prototype.armor[team]+=1;
            Zerg.Ultralisk.prototype.armor[team]+=1;
            Zerg.Defiler.prototype.armor[team]+=1;
            Zerg.Broodling.prototype.armor[team]+=1;
            Zerg.InfestedTerran.prototype.armor[team]+=1;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.ZergBuilding.EvolutionChamber.prototype.items[3];
        }
    },
    EvolveMuscularAugments:{
        name:"EvolveMuscularAugments",
        cost:{
            mine:100,
            gas:100,
            time:1000
        },
        effect:function(team){
            Zerg.Hydralisk.prototype.speed[team]=13;
            delete Building.ZergBuilding.HydraliskDen.prototype.items[1];
        }
    },
    EvolveGroovedSpines:{
        name:"EvolveGroovedSpines",
        cost:{
            mine:150,
            gas:150,
            time:1000
        },
        effect:function(team){
            Zerg.Hydralisk.prototype.attackRange[team]=175;
            delete Building.ZergBuilding.HydraliskDen.prototype.items[2];
        }
    },
    EvolveLurkerAspect:{
        name:"EvolveLurkerAspect",
        cost:{
            mine:125,
            gas:125,
            time:1200
        },
        effect:function(){
            Magic.Lurker.enabled=true;
            delete Building.ZergBuilding.HydraliskDen.prototype.items[4];
        }
    },
    UpgradeFlyerAttacks:{
        name:"UpgradeFlyerAttacks",
        cost:{
            mine:[100,175,250],
            gas:[100,175,250],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Zerg.Mutalisk.prototype.damage[team]+=1;
            Zerg.Guardian.prototype.damage[team]+=2;
            Zerg.Devourer.prototype.damage[team]+=2;
            this.level[team]++;
            if (this.level[Game.team]>=3) {
                delete Building.ZergBuilding.Spire.prototype.items[1];
                delete Building.ZergBuilding.GreaterSpire.prototype.items[1];
            }
        }
    },
    UpgradeFlyerCarapace:{
        name:"UpgradeFlyerCarapace",
        cost:{
            mine:[150,225,300],
            gas:[150,225,300],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Zerg.Overlord.prototype.armor[team]+=1;
            Zerg.Mutalisk.prototype.armor[team]+=1;
            Zerg.Guardian.prototype.armor[team]+=1;
            Zerg.Devourer.prototype.armor[team]+=1;
            Zerg.Scourge.prototype.armor[team]+=1;
            Zerg.Queen.prototype.armor[team]+=1;
            this.level[team]++;
            if (this.level[Game.team]>=3) {
                delete Building.ZergBuilding.Spire.prototype.items[2];
                delete Building.ZergBuilding.GreaterSpire.prototype.items[2];
            }
        }
    },
    EvolveSpawnBroodling:{
        name:"EvolveSpawnBroodling",
        cost:{
            mine:200,
            gas:200,
            time:800
        },
        effect:function(){
            Magic.SpawnBroodlings.enabled=true;
            delete Building.ZergBuilding.QueenNest.prototype.items[1];
        }
    },
    EvolveEnsnare:{
        name:"EvolveEnsnare",
        cost:{
            mine:100,
            gas:100,
            time:800
        },
        effect:function(){
            Magic.Ensnare.enabled=true;
            delete Building.ZergBuilding.QueenNest.prototype.items[2];
        }
    },
    EvolveGameteMeiosis:{
        name:"EvolveGameteMeiosis",
        cost:{
            mine:150,
            gas:150,
            time:1660
        },
        effect:function(team){
            Zerg.Queen.prototype.MP[team]=250;
            delete Building.ZergBuilding.QueenNest.prototype.items[3];
        }
    },
    EvolveAnabolicSynthesis:{
        name:"EvolveAnabolicSynthesis",
        cost:{
            mine:200,
            gas:200,
            time:1330
        },
        effect:function(team){
            Zerg.Ultralisk.prototype.speed[team]=18;
            delete Building.ZergBuilding.UltraliskCavern.prototype.items[1];
        }
    },
    EvolveChitinousPlating:{
        name:"EvolveChitinousPlating",
        cost:{
            mine:150,
            gas:150,
            time:1330
        },
        effect:function(team){
            Zerg.Ultralisk.prototype.armor[team]+=2;
            delete Building.ZergBuilding.UltraliskCavern.prototype.items[2];
        }
    },
    EvolvePlague:{
        name:"EvolvePlague",
        cost:{
            mine:200,
            gas:200,
            time:1000
        },
        effect:function(){
            Magic.Plague.enabled=true;
            delete Building.ZergBuilding.DefilerMound.prototype.items[1];
        }
    },
    EvolveConsume:{
        name:"EvolveConsume",
        cost:{
            mine:100,
            gas:100,
            time:1000
        },
        effect:function(){
            Magic.Consume.enabled=true;
            delete Building.ZergBuilding.DefilerMound.prototype.items[2];
        }
    },
    EvolveMetasynapticNode:{
        name:"EvolveMetasynapticNode",
        cost:{
            mine:150,
            gas:150,
            time:1660
        },
        effect:function(team){
            Zerg.Defiler.prototype.MP[team]=250;
            delete Building.ZergBuilding.DefilerMound.prototype.items[3];
        }
    },
    //Protoss
    UpgradeGroundWeapons:{
        name:"UpgradeGroundWeapons",
        cost:{
            mine:[100,150,200],
            gas:[100,150,200],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Protoss.Zealot.prototype.damage[team]+=2;
            Protoss.Dragoon.prototype.damage[team]+=2;
            Protoss.Templar.prototype.damage[team]+=1;
            Protoss.DarkTemplar.prototype.damage[team]+=3;
            Protoss.Archon.prototype.damage[team]+=3;
            //New RPG level
            Hero.DevilHunter.prototype.damage[team]+=2;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.ProtossBuilding.Forge.prototype.items[1];
        }
    },
    UpgradeGroundArmor:{
        name:"UpgradeGroundArmor",
        cost:{
            mine:[100,175,250],
            gas:[100,175,250],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Protoss.Probe.prototype.armor[team]+=1;
            Protoss.Zealot.prototype.armor[team]+=1;
            Protoss.Dragoon.prototype.armor[team]+=1;
            Protoss.Templar.prototype.armor[team]+=1;
            Protoss.DarkTemplar.prototype.armor[team]+=1;
            Protoss.Archon.prototype.armor[team]+=1;
            Protoss.DarkArchon.prototype.armor[team]+=1;
            Protoss.Reaver.prototype.armor[team]+=1;
            //New RPG level
            Hero.DevilHunter.prototype.armor[team]+=2;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.ProtossBuilding.Forge.prototype.items[2];
        }
    },
    UpgradePlasmaShields:{
        name:"UpgradePlasmaShields",
        cost:{
            mine:[200,300,400],
            gas:[200,300,400],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            for (var unitType in Protoss){
                Protoss[unitType].prototype.plasma[team]+=1;
            }
            //New RPG level
            Hero.DevilHunter.prototype.plasma[team]+=2;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.ProtossBuilding.Forge.prototype.items[3];
        }
    },
    UpgradeAirWeapons:{
        name:"UpgradeAirWeapons",
        cost:{
            mine:[100,175,250],
            gas:[100,175,250],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Protoss.Scout.prototype.attackMode.ground.damage[team]+=1;
            Protoss.Scout.prototype.attackMode.flying.damage[team]+=2;
            Protoss.Carrier.prototype.damage[team]+=1;
            Protoss.Arbiter.prototype.damage[team]+=1;
            Protoss.Corsair.prototype.damage[team]+=1;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.ProtossBuilding.CyberneticsCore.prototype.items[1];
        }
    },
    UpgradeAirArmor:{
        name:"UpgradeAirArmor",
        cost:{
            mine:[150,225,300],
            gas:[150,225,300],
            time:[2660,2980,3300]
        },
        level:0,
        effect:function(team){
            Protoss.Scout.prototype.armor[team]+=1;
            Protoss.Carrier.prototype.armor[team]+=1;
            Protoss.Arbiter.prototype.armor[team]+=1;
            Protoss.Corsair.prototype.armor[team]+=1;
            this.level[team]++;
            if (this.level[Game.team]>=3) delete Building.ProtossBuilding.CyberneticsCore.prototype.items[2];
        }
    },
    DevelopSingularityCharge:{
        name:"DevelopSingularityCharge",
        cost:{
            mine:150,
            gas:150,
            time:1660
        },
        effect:function(team){
            Protoss.Dragoon.prototype.attackRange[team]=210;
            delete Building.ProtossBuilding.CyberneticsCore.prototype.items[3];
        }
    },
    DevelopLegEnhancements:{
        name:"DevelopLegEnhancements",
        cost:{
            mine:150,
            gas:150,
            time:1330
        },
        effect:function(team){
            Protoss.Zealot.prototype.speed[team]=14;
            delete Building.ProtossBuilding.CitadelOfAdun.prototype.items[1];
        }
    },
    UpgradeScarabDamage:{
        name:"UpgradeScarabDamage",
        cost:{
            mine:200,
            gas:200,
            time:1660
        },
        effect:function(team){
            Protoss.Reaver.prototype.damage[team]=125;
            delete Building.ProtossBuilding.RoboticsSupportBay.prototype.items[1];
        }
    },
    IncreaseReaverCapacity:{
        name:"IncreaseReaverCapacity",
        cost:{
            mine:200,
            gas:200,
            time:1660
        },
        effect:function(team){
            Protoss.Reaver.prototype.scarabCapacity[team]=10;
            delete Building.ProtossBuilding.RoboticsSupportBay.prototype.items[2];
        }
    },
    DevelopGraviticDrive:{
        name:"DevelopGraviticDrive",
        cost:{
            mine:200,
            gas:200,
            time:1660
        },
        effect:function(team){
            Protoss.Shuttle.prototype.speed[team]=16;
            delete Building.ProtossBuilding.RoboticsSupportBay.prototype.items[3];
        }
    },
    DevelopApialSensors:{
        name:"DevelopApialSensors",
        cost:{
            mine:100,
            gas:100,
            time:1660
        },
        effect:function(team){
            Protoss.Scout.prototype.sight[team]=350;
            delete Building.ProtossBuilding.FleetBeacon.prototype.items[1];
        }
    },
    DevelopGraviticThrusters:{
        name:"DevelopGraviticThrusters",
        cost:{
            mine:200,
            gas:200,
            time:1660
        },
        effect:function(team){
            Protoss.Scout.prototype.speed[team]=16;
            delete Building.ProtossBuilding.FleetBeacon.prototype.items[2];
        }
    },
    IncreaseCarrierCapacity:{
        name:"IncreaseCarrierCapacity",
        cost:{
            mine:100,
            gas:100,
            time:1000
        },
        effect:function(team){
            //Protoss.Carrier.prototype.continuousAttack.count[team]=8;
            Protoss.Carrier.prototype.interceptorCapacity[team]=8;
            delete Building.ProtossBuilding.FleetBeacon.prototype.items[3];
        }
    },
    DevelopDistruptionWeb:{
        name:"DevelopDistruptionWeb",
        cost:{
            mine:200,
            gas:200,
            time:800
        },
        effect:function(){
            Magic.DisruptionWeb.enabled=true;
            delete Building.ProtossBuilding.FleetBeacon.prototype.items[4];
        }
    },
    DevelopArgusJewel:{
        name:"DevelopArgusJewel",
        cost:{
            mine:100,
            gas:100,
            time:1660
        },
        effect:function(team){
            Protoss.Corsair.prototype.MP[team]=250;
            delete Building.ProtossBuilding.FleetBeacon.prototype.items[5];
        }
    },
    DevelopPsionicStorm:{
        name:"DevelopPsionicStorm",
        cost:{
            mine:200,
            gas:200,
            time:1200
        },
        effect:function(){
            Magic.PsionicStorm.enabled=true;
            delete Building.ProtossBuilding.TemplarArchives.prototype.items[1];
        }
    },
    DevelopHallucination:{
        name:"DevelopHallucination",
        cost:{
            mine:150,
            gas:150,
            time:800
        },
        effect:function(){
            Magic.Hallucination.enabled=true;
            delete Building.ProtossBuilding.TemplarArchives.prototype.items[2];
        }
    },
    DevelopKhaydarinAmulet:{
        name:"DevelopKhaydarinAmulet",
        cost:{
            mine:150,
            gas:150,
            time:1660
        },
        effect:function(team){
            Protoss.Templar.prototype.MP[team]=250;
            delete Building.ProtossBuilding.TemplarArchives.prototype.items[3];
        }
    },
    DevelopMindControl:{
        name:"DevelopMindControl",
        cost:{
            mine:200,
            gas:200,
            time:1200
        },
        effect:function(){
            Magic.MindControl.enabled=true;
            delete Building.ProtossBuilding.TemplarArchives.prototype.items[4];
        }
    },
    DevelopMaelStorm:{
        name:"DevelopMaelStorm",
        cost:{
            mine:100,
            gas:100,
            time:1000
        },
        effect:function(){
            Magic.MaelStorm.enabled=true;
            delete Building.ProtossBuilding.TemplarArchives.prototype.items[5];
        }
    },
    DevelopArgusTalisman:{
        name:"DevelopArgusTalisman",
        cost:{
            mine:150,
            gas:150,
            time:1660
        },
        effect:function(team){
            Protoss.DarkArchon.prototype.MP[team]=250;
            delete Building.ProtossBuilding.TemplarArchives.prototype.items[6];
        }
    },
    DevelopGraviticBooster:{
        name:"DevelopGraviticBooster",
        cost:{
            mine:150,
            gas:150,
            time:1330
        },
        effect:function(team){
            Protoss.Observer.prototype.speed[team]=12;
            delete Building.ProtossBuilding.Observatory.prototype.items[1];
        }
    },
    DevelopSensorArray:{
        name:"DevelopSensorArray",
        cost:{
            mine:150,
            gas:150,
            time:1330
        },
        effect:function(team){
            Protoss.Observer.prototype.sight[team]=385;
            delete Building.ProtossBuilding.Observatory.prototype.items[2];
        }
    },
    DevelopRecall:{
        name:"DevelopRecall",
        cost:{
            mine:150,
            gas:150,
            time:1200
        },
        effect:function(){
            Magic.Recall.enabled=true;
            delete Building.ProtossBuilding.ArbiterTribunal.prototype.items[1];
        }
    },
    DevelopStasisField:{
        name:"DevelopStasisField",
        cost:{
            mine:150,
            gas:150,
            time:1000
        },
        effect:function(){
            Magic.StasisField.enabled=true;
            delete Building.ProtossBuilding.ArbiterTribunal.prototype.items[2];
        }
    },
    DevelopKhaydarinCore:{
        name:"DevelopKhaydarinCore",
        cost:{
            mine:150,
            gas:150,
            time:1660
        },
        effect:function(team){
            Protoss.Arbiter.prototype.MP[team]=250;
            delete Building.ProtossBuilding.ArbiterTribunal.prototype.items[3];
        }
    },
    /********RPG level: Tower Defense********/
    UpgradeSunkenDamage:{
        name:"UpgradeSunkenDamage",
        cost:{
            mine:[50,75,100,125,150],
            time:[300,300,300,300,300]
        },
        level:0,
        effect:function(team){
            //RPG level lock
            if (Game.level==11 || Game.replayLevel==11) {
                Building.ZergBuilding.SunkenColony.prototype.damage+=5;
                this.level[team]++;
                if (this.level[Game.team]>=5) delete Building.ProtossBuilding.TeleportPoint.prototype.items[1];
            }
        }
    },
    EnlargeSunkenArea:{
        name:"UpgradeSunkenArea",
        cost:{
            mine:[100,125,150,175,200],
            time:[300,400,500,600,700]
        },
        level:0,
        effect:function(team){
            //RPG level lock
            if (Game.level==11 || Game.replayLevel==11) {
                Building.ZergBuilding.SunkenColony.prototype.AOE.radius+=50;
                this.level[team]++;
                if (this.level[Game.team]>=5) delete Building.ProtossBuilding.TeleportPoint.prototype.items[2];
            }
        }
    },
    UpgradeSporeDamage:{
        name:"UpgradeSporeDamage",
        cost:{
            mine:[50,60,70,80,90],
            time:[300,300,300,300,300]
        },
        level:0,
        effect:function(team){
            //RPG level lock
            if (Game.level==11 || Game.replayLevel==11) {
                Building.ZergBuilding.SporeColony.prototype.damage+=3;
                this.level[team]++;
                if (this.level[Game.team]>=5) delete Building.ProtossBuilding.TeleportPoint.prototype.items[3];
            }
        }
    },
    EnlargeSporeChain:{
        name:"EnlargeSporeChain",
        cost:{
            mine:[80,90,100,110,120],
            time:[300,400,500,600,700]
        },
        level:0,
        effect:function(team){
            //RPG level lock
            if (Game.level==11 || Game.replayLevel==11) {
                Bullets.Spore.prototype.traceTimes+=1;
                Bullets.Spore.prototype.traceRadius+=50;
                this.level[team]++;
                if (this.level[Game.team]>=5) delete Building.ProtossBuilding.TeleportPoint.prototype.items[4];
            }
        }
    },
    UpgradeMissileDamage:{
        name:"UpgradeMissileDamage",
        cost:{
            mine:[50,65,80,95,110],
            time:[300,300,300,300,300]
        },
        level:0,
        effect:function(team){
            //RPG level lock
            if (Game.level==11 || Game.replayLevel==11) {
                Building.TerranBuilding.MissileTurret.prototype.damage+=4;
                this.level[team]++;
                if (this.level[Game.team]>=5) delete Building.ProtossBuilding.TeleportPoint.prototype.items[5];
            }
        }
    },
    IncreaseMissileCount:{
        name:"IncreaseMissileCount",
        cost:{
            mine:[80,95,110,125,140],
            time:[300,300,300,300,300]
        },
        level:0,
        effect:function(team){
            //RPG level lock
            if (Game.level==11 || Game.replayLevel==11) {
                Building.TerranBuilding.MissileTurret.prototype.AOE.radius+=30;
                Building.TerranBuilding.MissileTurret.prototype.AOE.count++;
                this.level[team]++;
                if (this.level[Game.team]>=5) delete Building.ProtossBuilding.TeleportPoint.prototype.items[6];
            }
        }
    },
    UpgradePhotonCannonDamage:{
        name:"UpgradePhotonCannonDamage",
        cost:{
            mine:[50,70,90,110,130],
            time:[300,300,300,300,300]
        },
        level:0,
        effect:function(team){
            //RPG level lock
            if (Game.level==11 || Game.replayLevel==11) {
                Building.ProtossBuilding.PhotonCannon.prototype.damage+=4;
                this.level[team]++;
                if (this.level[Game.team]>=5) delete Building.ProtossBuilding.TeleportPoint.prototype.items[7];
            }
        }
    },
    IncreasePhotonCannonCount:{
        name:"IncreasePhotonCannonCount",
        cost:{
            mine:[80,95,110,125,140],
            time:[300,300,300,300,300]
        },
        level:0,
        effect:function(team){
            //RPG level lock
            if (Game.level==11 || Game.replayLevel==11) {
                Building.ProtossBuilding.PhotonCannon.prototype.continuousAttack.count++;
                this.level[team]++;
                if (this.level[Game.team]>=5) delete Building.ProtossBuilding.TeleportPoint.prototype.items[8];
            }
        }
    }
};