/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var sourceLoader_1 = __webpack_require__(1);
exports.Game = {
    //Global variables
    HBOUND: innerWidth,
    VBOUND: innerHeight,
    infoBox: {
        x: 145,
        y: innerHeight - 110,
        width: innerWidth - 295,
        height: 110
    },
    team: 0,
    playerNum: 2,
    teams: {},
    multiplayer: false,
    cxt: $('#middleCanvas')[0].getContext('2d'),
    frontCxt: $('#frontCanvas')[0].getContext('2d'),
    backCxt: $('#backCanvas')[0].getContext('2d'),
    fogCxt: $('#fogCanvas')[0].getContext('2d'),
    _timer: -1,
    _frameInterval: 100,
    mainTick: 0,
    serverTick: 0,
    commands: {},
    replay: {},
    randomSeed: 0,
    selectedUnit: {},
    allSelected: [],
    _oldAllSelected: [],
    hackMode: false,
    isApp: false,
    offline: true,
    CDN: '',
    level: null,
    replayFlag: null,
    endTick: null,
    addIntoAllSelected: function (chara, override) {
        if (chara instanceof Gobj) {
            //Add into allSelected if not included
            if (exports.Game.allSelected.indexOf(chara) == -1) {
                if (override)
                    exports.Game.allSelected = chara;
                else
                    exports.Game.allSelected.push(chara);
                chara.selected = true;
            }
        }
        //Override directly
        if (chara instanceof Array) {
            if (override)
                exports.Game.allSelected = chara;
            else
                chara.forEach(function (char) {
                    //Add into allSelected if not included
                    if (exports.Game.allSelected.indexOf(char) == -1)
                        exports.Game.allSelected.push(char);
                });
            chara.forEach(function (char) {
                char.selected = true;
            });
        }
        //Sort allSelected by its name order
        exports.Game.allSelected.sort(function (chara1, chara2) {
            //Need sort building icon together
            var name1 = (chara1 instanceof Building) ? (chara1.inherited.name + '.' + chara1.name) : chara1.name;
            var name2 = (chara2 instanceof Building) ? (chara2.inherited.name + '.' + chara2.name) : chara2.name;
            return ([name1, name2].sort()[0] != name1) ? 1 : -1;
        });
        //Notify referee to redraw
        Referee.alterSelectionMode();
    },
    //To replace setTimeout
    commandTimeout: function (func, delay) {
        var dueTick = exports.Game.mainTick + (delay / 100 >> 0);
        if (!exports.Game.commands[dueTick])
            exports.Game.commands[dueTick] = [];
        exports.Game.commands[dueTick].push(func);
    },
    //To replace setInterval
    commandInterval: function (func, interval) {
        var funcAdjust = function () {
            func();
            exports.Game.commandTimeout(funcAdjust, interval);
        };
        exports.Game.commandTimeout(funcAdjust, interval);
    },
    race: {
        selected: 'Terran',
        choose: function (race) {
            this.selected = race;
            $('div#GamePlay').attr('race', race);
        }
    },
    layerSwitchTo: function (layerName) {
        $('div.GameLayer').hide();
        $('#' + layerName).show(); //show('slow')
    },
    init: function () {
        //Prevent full select
        $('div.GameLayer').on("selectstart", function (event) {
            event.preventDefault();
        });
        //Bind resize canvas handler
        window.onresize = exports.Game.resizeWindow;
        /*window.requestAnimationFrame=requestAnimationFrame || webkitRequestAnimationFrame
         || mozRequestAnimationFrame || msRequestAnimationFrame || oRequestAnimationFrame;//Old browser compatible*/
        //Online mode
        if (!exports.Game.offline) {
            exports.Game.CDN = prompt('Please input CDN location for images and audios:');
            if (exports.Game.CDN) {
                if (!exports.Game.CDN.startsWith('http://'))
                    exports.Game.CDN = 'http://' + exports.Game.CDN;
                if (!exports.Game.CDN.endsWith('/'))
                    exports.Game.CDN += '/';
            }
        }
        //Start loading
        exports.Game.layerSwitchTo("GameLoading");
        //Zerg
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Mutalisk.png", "Mutalisk");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Devourer.png", "Devourer");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Guardian.png", "Guardian");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Overlord.png", "Overlord");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Drone.png", "Drone");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Zergling.png", "Zergling");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Hydralisk.png", "Hydralisk");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Scourge.png", "Scourge");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Lurker.png", "Lurker");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Ultralisk.png", "Ultralisk");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Broodling.png", "Broodling");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/InfestedTerran.png", "InfestedTerran");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Queen.png", "Queen");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Defiler.png", "Defiler");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Larva.png", "Larva");
        //Terran
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/BattleCruiser.png", "BattleCruiser");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Wraith.png", "Wraith");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/SCV.png", "SCV");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Civilian.png", "Civilian");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Marine.png", "Marine");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Firebat.png", "Firebat");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Ghost.png", "Ghost");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Vulture.png", "Vulture");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Tank.png", "Tank");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Goliath.png", "Goliath");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Medic.png", "Medic");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Dropship.png", "Dropship");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Vessel.png", "Vessel");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Valkyrie.png", "Valkyrie");
        //Protoss
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Probe.png", "Probe");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Zealot.png", "Zealot");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Dragoon.png", "Dragoon");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Templar.png", "Templar");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/DarkTemplar.png", "DarkTemplar");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Reaver.png", "Reaver");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Archon.png", "Archon");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/DarkArchon.png", "DarkArchon");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Shuttle.png", "Shuttle");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Observer.png", "Observer");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Arbiter.png", "Arbiter");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Scout.png", "Scout");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Carrier.png", "Carrier");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Corsair.png", "Corsair");
        //Neuture
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Ragnasaur.png", "Ragnasaur");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Rhynsdon.png", "Rhynsdon");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Ursadon.png", "Ursadon");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Bengalaas.png", "Bengalaas");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Scantid.png", "Scantid");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Kakaru.png", "Kakaru");
        //Hero
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/HeroCruiser.png", "HeroCruiser");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Sarah.png", "Sarah");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Kerrigan.png", "Kerrigan");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/DevilHunter.png", "DevilHunter");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Tassadar.png", "Tassadar");
        //Building
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/ZergBuilding.png", "ZergBuilding");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/TerranBuilding.png", "TerranBuilding");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/ProtossBuilding.png", "ProtossBuilding");
        /*sourceLoader.load("audio","bgm/PointError.wav","PointError");*/
        //Map
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Maps/(2)Switchback.jpg", "Map_Switchback");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Maps/(2)Volcanis.jpg", "Map_Volcanis");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Maps/(3)Trench wars.jpg", "Map_TrenchWars");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Maps/(4)Blood Bath.jpg", "Map_BloodBath");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Maps/(4)Orbital Relay.jpg", "Map_OrbitalRelay");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Maps/(4)TowerDefense.jpg", "Map_TowerDefense");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Maps/(6)Thin Ice.jpg", "Map_ThinIce");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Maps/(8)BigGameHunters.jpg", "Map_BigGameHunters");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Maps/(8)TheHunters.jpg", "Map_TheHunters");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Maps/(8)Turbo.jpg", "Map_Turbo");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Maps/Map_Grass.jpg", "Map_Grass");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Mud.png", "Mud");
        //Extra
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Burst.png", "Burst");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/BuildingBurst.png", "BuildingBurst");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Portrait.png", "Portrait");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Charas/Magic.png", "Magic");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Menu/ControlPanel.png", "ControlPanel");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Bg/GameStart.jpg", "GameStart");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Bg/GameWin.jpg", "GameWin");
        sourceLoader_1.sourceLoader.load("img", exports.Game.CDN + "img/Bg/GameLose.jpg", "GameLose");
        sourceLoader_1.sourceLoader.allOnLoad(function () {
            $('#GameStart').prepend(sourceLoader_1.sourceLoader.sources['GameStart']);
            $('#GameWin').prepend(sourceLoader_1.sourceLoader.sources['GameWin']);
            $('#GameLose').prepend(sourceLoader_1.sourceLoader.sources['GameLose']);
            $('#GamePlay>canvas').attr('width', exports.Game.HBOUND); //Canvas width adjust
            $('#GamePlay>canvas').attr('height', exports.Game.VBOUND - exports.Game.infoBox.height + 5); //Canvas height adjust
            for (var N = 1; N <= 9; N++) {
                $('div.panel_Control').append("<button num='" + N + "'></button>");
            }
            /*//Test image effect
            AlloyImage(sourceLoader.sources['Wraith']).act("setHSI",100,0,0,false).replace(sourceLoader.sources['Wraith']);
            AlloyImage(sourceLoader.sources['BattleCruiser']).act("setHSI",100,0,0,false).replace(sourceLoader.sources['BattleCruiser']);*/
            exports.Game.start();
        });
    },
    start: function () {
        //Game start
        exports.Game.layerSwitchTo("GameStart");
        //Init level selector
        for (var level = 1; level <= Levels.length; level++) {
            $('.levelSelectionBg').append("<div class='levelItem'>" +
                "<input type='radio' value='" + level + "' name='levelSelect'>" +
                (Levels[level - 1].label ? (Levels[level - 1].label) : ("Level " + level))
                + "</input></div>");
        }
        //Wait for user select level and play game
        $('input[name="levelSelect"]').click(function () {
            //Prevent vibration
            if (exports.Game.level != null)
                return;
            exports.Game.level = parseInt(this.value);
            exports.Game.play();
        });
    },
    play: function () {
        //Load level to initial when no error occurs
        if (!(Levels[exports.Game.level - 1].load())) {
            //Need Game.playerNum before expansion
            exports.Game.expandUnitProps();
            Resource.init();
            //Game background
            exports.Game.layerSwitchTo("GamePlay");
            exports.Game.resizeWindow();
            //Collect login user info
            if (exports.Game.hackMode)
                Multiplayer.sendUserInfo();
            //Bind controller
            mouseController.toControlAll(); //Can control all units
            keyController.start(); //Start monitor
            exports.Game.pauseWhenHide(); //Hew H5 feature:Page Visibility
            exports.Game.initIndexDB(); //Hew H5 feature:Indexed DB
            exports.Game.animation();
        }
    },
    getPropArray: function (prop) {
        var result = [];
        for (var N = 0; N < exports.Game.playerNum; N++) {
            result.push(typeof (prop) == 'object' ? (_$.clone(prop)) : prop);
        }
        return result;
    },
    //Do we need this because we only support Zerg vs Terran vs Protoss?
    expandUnitProps: function () {
        //Post-operation for all unit types, prepare basic properties for different team numbers, init in level.js
        _$.traverse([Zerg, Terran, Protoss, Neutral, Hero], function (unitType) {
            ['HP', 'SP', 'MP', 'damage', 'armor', 'speed', 'attackRange', 'attackInterval', 'plasma', 'sight'].forEach(function (prop) {
                //Prop array, first one for us, second for enemy
                if (unitType.prototype[prop] != undefined) {
                    unitType.prototype[prop] = exports.Game.getPropArray(unitType.prototype[prop]);
                }
            });
            if (unitType.prototype.isInvisible) {
                for (var N = 0; N < exports.Game.playerNum; N++) {
                    unitType.prototype['isInvisible' + N] = unitType.prototype.isInvisible;
                }
            }
            delete unitType.prototype.isInvisible; //No need anymore
            if (unitType.prototype.attackMode) {
                ['damage', 'attackRange', 'attackInterval'].forEach(function (prop) {
                    //Prop array, first one for us, second for enemy
                    unitType.prototype.attackMode.flying[prop] = exports.Game.getPropArray(unitType.prototype.attackMode.flying[prop]);
                    unitType.prototype.attackMode.ground[prop] = exports.Game.getPropArray(unitType.prototype.attackMode.ground[prop]);
                });
            }
            unitType.upgrade = function (prop, value, team) {
                switch (team) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        eval('unitType.prototype.' + prop)[team] = value;
                        break;
                    default:
                        unitType.prototype[prop] = value;
                        break;
                }
            };
        });
        Protoss.Carrier.prototype.interceptorCapacity = exports.Game.getPropArray(Protoss.Carrier.prototype.interceptorCapacity);
        Protoss.Reaver.prototype.scarabCapacity = exports.Game.getPropArray(Protoss.Reaver.prototype.scarabCapacity);
        Referee.underArbiterUnits = exports.Game.getPropArray([]);
        Referee.detectedUnits = exports.Game.getPropArray([]);
        for (var N = 0; N < exports.Game.playerNum; N++) {
            //Initial detector buffer
            var buffer = {};
            buffer['isInvisible' + N] = false;
            Gobj.detectorBuffer.push(buffer);
            //Initial arbiter buffer
            Protoss.Arbiter.prototype.bufferObj['isInvisible' + N] = true;
        }
        for (var grade in Upgrade) {
            if (Upgrade[grade].level != null) {
                Upgrade[grade].level = exports.Game.getPropArray(Upgrade[grade].level);
            }
        }
    },
    addSelectedIntoTeam: function (teamNum) {
        //Build a new team
        exports.Game.teams[teamNum] = _$.mixin([], exports.Game.allSelected);
    },
    callTeam: function (teamNum) {
        var team = _$.mixin([], exports.Game.teams[teamNum]);
        //When team already exist
        if (team instanceof Array) {
            exports.Game.unselectAll();
            //GC
            $.extend([], team).forEach(function (chara) {
                if (chara.status == 'dead')
                    team.splice(team.indexOf(chara), 1);
            });
            exports.Game.addIntoAllSelected(team, true);
            if (team[0] instanceof Gobj) {
                exports.Game.changeSelectedTo(team[0]);
                //Sound effect
                team[0].sound.selected.play();
                //Relocate map center
                Map.relocateAt(team[0].posX(), team[0].posY());
            }
        }
    },
    unselectAll: function () {
        //Unselect all
        var units = Unit.allUnits.concat(Building.allBuildings);
        units.forEach(function (chara) { chara.selected = false; });
        exports.Game.addIntoAllSelected([], true);
    },
    multiSelectInRect: function () {
        exports.Game.unselectAll();
        //Multi select in rect
        var startPoint = { x: Map.offsetX + Math.min(mouseController.startPoint.x, mouseController.endPoint.x),
            y: Map.offsetY + Math.min(mouseController.startPoint.y, mouseController.endPoint.y) };
        var endPoint = { x: Map.offsetX + Math.max(mouseController.startPoint.x, mouseController.endPoint.x),
            y: Map.offsetY + Math.max(mouseController.startPoint.y, mouseController.endPoint.y) };
        var inRectUnits = Unit.allOurUnits().filter(function (chara) {
            return chara.insideRect({ start: (startPoint), end: (endPoint) });
        });
        if (inRectUnits.length > 0)
            exports.Game.changeSelectedTo(inRectUnits[0]);
        else
            exports.Game.changeSelectedTo({});
        exports.Game.addIntoAllSelected(inRectUnits, true);
    },
    getSelectedOne: function (clickX, clickY, isEnemyFilter, unitBuildingFilter, isFlyingFilter, customFilter) {
        var distance = function (chara) {
            return (clickX - chara.posX()) * (clickX - chara.posX()) + (clickY - chara.posY()) * (clickY - chara.posY()); //Math.pow2
        };
        //Initial
        var selectedOne = {}, charas = [];
        switch (unitBuildingFilter) {
            case true:
                charas = Unit.allUnits;
                break;
            case false:
                charas = Building.allBuildings;
                break;
            default:
                charas = Unit.allUnits.concat(Building.allBuildings);
        }
        switch (isEnemyFilter) {
            case true:
            case false:
                charas = charas.filter(function (chara) {
                    return chara.isEnemy() == isEnemyFilter;
                });
                break;
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                charas = charas.filter(function (chara) {
                    return chara.team == isEnemyFilter;
                });
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
                charas = charas.filter(function (chara) {
                    return chara.team != isEnemyFilter;
                });
        }
        if (isFlyingFilter != null) {
            charas = charas.filter(function (chara) {
                return chara.isFlying == isFlyingFilter;
            });
        }
        //customFilter is filter function
        if (customFilter != null) {
            charas = charas.filter(customFilter);
        }
        //Find nearest one
        selectedOne = charas.filter(function (chara) {
            return chara.status != 'dead' && chara.includePoint(clickX, clickY);
        }).sort(function (chara1, chara2) {
            return distance(chara1) - distance(chara2);
        })[0];
        if (!selectedOne)
            selectedOne = {};
        return selectedOne;
    },
    getInRangeOnes: function (clickX, clickY, range, isEnemyFilter, unitBuildingFilter, isFlyingFilter, customFilter) {
        //Initial
        var selectedOnes = [], charas = [];
        switch (unitBuildingFilter) {
            case true:
                charas = Unit.allUnits;
                break;
            case false:
                charas = Building.allBuildings;
                break;
            default:
                charas = Unit.allUnits.concat(Building.allBuildings);
        }
        switch (isEnemyFilter) {
            case true:
            case false:
                charas = charas.filter(function (chara) {
                    return chara.isEnemy() == isEnemyFilter;
                });
                break;
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                charas = charas.filter(function (chara) {
                    return chara.team == isEnemyFilter;
                });
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
                charas = charas.filter(function (chara) {
                    return chara.team != isEnemyFilter;
                });
        }
        if (isFlyingFilter != null) {
            charas = charas.filter(function (chara) {
                return chara.isFlying == isFlyingFilter;
            });
        }
        //customFilter is filter function
        if (customFilter != null) {
            charas = charas.filter(customFilter);
        }
        //Find in range ones
        selectedOnes = charas.filter(function (chara) {
            return chara.status != 'dead' && chara.insideSquare({ centerX: clickX, centerY: clickY, radius: range });
        });
        return selectedOnes;
    },
    //For test use
    getSelected: function () {
        return Unit.allUnits.concat(Building.allBuildings).filter(function (chara) {
            return chara.selected;
        });
    },
    showInfoFor: function (chara) {
        //Show selected living unit info
        if (exports.Game.selectedUnit instanceof Gobj && exports.Game.selectedUnit.status != "dead") {
            //Display info
            $('div.panel_Info>div[class*="info"]').show();
            //Draw selected unit portrait
            if (chara.portrait)
                $('div.infoLeft div[name="portrait"]')[0].className = chara.portrait; //Override portrait
            else {
                if (exports.Game.selectedUnit instanceof Unit)
                    $('div.infoLeft div[name="portrait"]')[0].className = exports.Game.selectedUnit.name;
                if (exports.Game.selectedUnit instanceof Building)
                    $('div.infoLeft div[name="portrait"]')[0].className =
                        exports.Game.selectedUnit.attack ? exports.Game.selectedUnit.inherited.inherited.name : exports.Game.selectedUnit.inherited.name;
            }
            //Show selected unit HP,SP and MP
            $('div.infoLeft span._Health')[0].style.color = exports.Game.selectedUnit.lifeStatus();
            $('div.infoLeft span.life')[0].innerHTML = exports.Game.selectedUnit.life >> 0;
            $('div.infoLeft span.HP')[0].innerHTML = exports.Game.selectedUnit.get('HP');
            if (exports.Game.selectedUnit.SP) {
                $('div.infoLeft span.shield')[0].innerHTML = exports.Game.selectedUnit.shield >> 0;
                $('div.infoLeft span.SP')[0].innerHTML = exports.Game.selectedUnit.get('SP');
                $('div.infoLeft span._Shield').show();
            }
            else {
                $('div.infoLeft span._Shield').hide();
            }
            if (exports.Game.selectedUnit.MP) {
                $('div.infoLeft span.magic')[0].innerHTML = exports.Game.selectedUnit.magic >> 0;
                $('div.infoLeft span.MP')[0].innerHTML = exports.Game.selectedUnit.get('MP');
                $('div.infoLeft span._Magic').show();
            }
            else {
                $('div.infoLeft span._Magic').hide();
            }
            //Draw selected unit name,kill,damage,armor and shield
            $('div.infoCenter h3.name')[0].innerHTML = exports.Game.selectedUnit.name;
            if (exports.Game.selectedUnit.detector) {
                $('div.infoCenter p.detector').show();
            }
            else {
                $('div.infoCenter p.detector').hide();
            }
            if (exports.Game.selectedUnit.attack) {
                $('div.infoCenter p.kill span')[0].innerHTML = exports.Game.selectedUnit.kill;
                if (exports.Game.selectedUnit.attackMode) {
                    $('div.infoCenter p.damage span')[0].innerHTML = (exports.Game.selectedUnit.get('attackMode.ground.damage') + '/' + exports.Game.selectedUnit.get('attackMode.flying.damage'));
                }
                else {
                    $('div.infoCenter p.damage span')[0].innerHTML = (exports.Game.selectedUnit.get('damage') + (exports.Game.selectedUnit.suicide ? ' (1)' : ''));
                }
                //Show kill and damage
                $('div.infoCenter p.kill').show();
                $('div.infoCenter p.damage').show();
            }
            else {
                //Hide kill and damage
                $('div.infoCenter p.kill').hide();
                $('div.infoCenter p.damage').hide();
            }
            $('div.infoCenter p.armor span')[0].innerHTML = exports.Game.selectedUnit.get('armor');
            if (exports.Game.selectedUnit.get('plasma') != undefined) {
                $('div.infoCenter p.plasma span')[0].innerHTML = exports.Game.selectedUnit.get('plasma');
                $('div.infoCenter p.plasma').show();
            }
            else {
                $('div.infoCenter p.plasma').hide();
            }
            //Can disable this filter for testing
            if (exports.Game.selectedUnit.loadedUnits && exports.Game.selectedUnit.team == exports.Game.team) {
                $('div.infoCenter p.passenger span')[0].innerHTML = exports.Game.selectedUnit.loadedUnits.length;
                $('div.infoCenter p.passenger').show();
                //Clear old icons
                $('div.infoCenter p.icons')[0].innerHTML = '';
                //Show passenger icons
                exports.Game.selectedUnit.loadedUnits.forEach(function (passenger) {
                    $('div.infoCenter p.icons').append($('<span></span>')
                        .attr('class', passenger.name).css('border-color', passenger.lifeStatus()));
                });
                $('div.infoCenter p.icons').show();
            }
            else {
                $('div.infoCenter p.passenger').hide();
                $('div.infoCenter p.icons').hide();
            }
            //Draw upgraded
            var upgraded = exports.Game.selectedUnit.upgrade;
            var team = exports.Game.selectedUnit.team;
            if (upgraded) {
                for (var N = 0; N < 3; N++) {
                    var upgradeIcon = $('div.upgraded div[name="icon"]')[N];
                    upgradeIcon.innerHTML = '';
                    upgradeIcon.style.display = 'none';
                    if (N < upgraded.length) {
                        upgradeIcon.className = upgradeIcon.title = upgraded[N];
                        upgradeIcon.innerHTML = Upgrade[upgraded[N]].level[team];
                        if (Upgrade[upgraded[N]].level[team]) {
                            upgradeIcon.setAttribute('disabled', 'false');
                            upgradeIcon.style.color = 'aqua';
                        }
                        else {
                            upgradeIcon.setAttribute('disabled', 'true');
                            upgradeIcon.style.color = 'red';
                        }
                        upgradeIcon.style.display = 'inline-block';
                    }
                }
                $('div.upgraded').show();
            }
            else {
                //$('div.upgraded div[name="icon"]').html('').removeAttr('title').hide();
                $('div.upgraded').hide();
            }
        }
        else {
            //Hide info
            $('div.panel_Info>div').hide();
        }
    },
    refreshInfo: function () {
        exports.Game.showInfoFor(exports.Game.selectedUnit);
    },
    changeSelectedTo: function (chara) {
        exports.Game.selectedUnit = chara;
        Button.equipButtonsFor(chara);
        if (chara instanceof Gobj) {
            chara.selected = true;
        }
        exports.Game.showInfoFor(chara);
    },
    draw: function (chara) {
        //Can draw units and no-rotate bullets
        if (!(chara instanceof Gobj))
            return; //Will only show Gobj
        if (chara.status == "dead")
            return; //Will not show dead
        //Won't draw units outside screen
        if (!chara.insideScreen())
            return;
        //Choose context
        var cxt = ((chara instanceof Unit) || (chara instanceof Building)) ? exports.Game.cxt : exports.Game.frontCxt;
        //Draw shadow
        cxt.save();
        //cxt.shadowBlur=50;//Different blur level on Firefox and Chrome, bad performance
        cxt.shadowOffsetX = (chara.isFlying) ? 5 : 3;
        cxt.shadowOffsetY = (chara.isFlying) ? 20 : 8;
        cxt.shadowColor = "rgba(0,0,0,0.4)";
        //Close shadow for burrowed
        if (chara.buffer.Burrow)
            cxt.shadowOffsetX = cxt.shadowOffsetY = 0;
        //Draw invisible
        if (chara['isInvisible' + exports.Game.team] != null) {
            cxt.globalAlpha = (chara.isEnemy() && chara['isInvisible' + exports.Game.team]) ? 0 : 0.5;
            if (chara.burrowBuffer) {
                if (chara.isEnemy()) {
                    if (!chara['isInvisible' + exports.Game.team])
                        cxt.globalAlpha = 1;
                }
                else
                    cxt.globalAlpha = 1;
            }
        }
        //Draw unit or building
        var imgSrc;
        if (chara instanceof Building) {
            if (chara.source)
                imgSrc = sourceLoader_1.sourceLoader.sources[chara.source];
            else {
                imgSrc = sourceLoader_1.sourceLoader.sources[chara.attack ? chara.inherited.inherited.name : chara.inherited.name];
            }
        }
        else
            imgSrc = sourceLoader_1.sourceLoader.sources[chara.source ? chara.source : chara.name];
        //Convert position
        var charaX = (chara.x - Map.offsetX) >> 0;
        var charaY = (chara.y - Map.offsetY) >> 0;
        //Same image in different directions
        if (chara.direction == undefined) {
            var _left = chara.imgPos[chara.status].left;
            var _top = chara.imgPos[chara.status].top;
            //Multiple actions status
            if (_left instanceof Array || _top instanceof Array) {
                cxt.drawImage(imgSrc, _left[chara.action], _top[chara.action], chara.width, chara.height, charaX, charaY, chara.width, chara.height);
            }
            else {
                cxt.drawImage(imgSrc, _left, _top, chara.width, chara.height, charaX, charaY, chara.width, chara.height);
            }
        }
        else {
            var _left = chara.imgPos[chara.status].left[chara.direction];
            var _top = chara.imgPos[chara.status].top[chara.direction];
            //Multiple actions status
            if (_left instanceof Array || _top instanceof Array) {
                cxt.drawImage(imgSrc, _left[chara.action], _top[chara.action], chara.width, chara.height, charaX, charaY, chara.width, chara.height);
            }
            else {
                cxt.drawImage(imgSrc, _left, _top, chara.width, chara.height, charaX, charaY, chara.width, chara.height);
            }
        }
        //Remove shadow
        cxt.restore();
        //Draw HP if has selected and is true
        if (chara.selected == true) {
            cxt = exports.Game.frontCxt;
            //Draw selected circle
            cxt.strokeStyle = (chara.isEnemy()) ? "red" : "green"; //Distinguish enemy
            cxt.lineWidth = 2; //Cannot see 1px width circle clearly
            cxt.beginPath();
            cxt.arc(chara.posX() - Map.offsetX, chara.posY() - Map.offsetY, chara.radius(), 0, 2 * Math.PI);
            cxt.stroke();
            //Draw HP bar and SP bar and magic bar
            cxt.globalAlpha = 1;
            cxt.lineWidth = 1;
            var offsetY = -6 - (chara.MP ? 5 : 0) - (chara.SP ? 5 : 0);
            var lifeRatio = chara.life / chara.get('HP');
            cxt.strokeStyle = "black";
            if (chara.SP) {
                //Draw HP and SP
                cxt.fillStyle = "blue";
                cxt.fillRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY, chara.width * chara.shield / chara.get('SP'), 5);
                cxt.strokeRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY, chara.width, 5);
                cxt.fillStyle = (lifeRatio > 0.7) ? "green" : (lifeRatio > 0.3) ? "yellow" : "red"; //Distinguish life
                cxt.fillRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY + 5, chara.width * lifeRatio, 5);
                cxt.strokeRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY + 5, chara.width, 5);
            }
            else {
                //Only draw HP
                cxt.fillStyle = (lifeRatio > 0.7) ? "green" : (lifeRatio > 0.3) ? "yellow" : "red"; //Distinguish life
                cxt.fillRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY, chara.width * lifeRatio, 5);
                cxt.strokeRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY, chara.width, 5);
            }
            if (chara.MP) {
                //Draw MP
                cxt.fillStyle = "darkviolet";
                cxt.fillRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY + (chara.SP ? 10 : 5), chara.width * chara.magic / chara.get('MP'), 5);
                cxt.strokeRect(chara.x - Map.offsetX, chara.y - Map.offsetY + offsetY + (chara.SP ? 10 : 5), chara.width, 5);
            }
        }
    },
    drawEffect: function (chara) {
        //Can draw units and no-rotate bullets
        if (!(chara instanceof Burst))
            return; //Will only show Burst
        if (chara.status == "dead")
            return; //Will not show dead
        //Won't draw units outside screen
        if (!chara.insideScreen())
            return;
        //Choose context
        var cxt = exports.Game.frontCxt;
        //Draw shadow
        cxt.save();
        //cxt.shadowBlur=50;//Different blur level on Firefox and Chrome, bad performance
        cxt.shadowOffsetX = (chara.isFlying) ? 5 : 3;
        cxt.shadowOffsetY = (chara.isFlying) ? 20 : 8;
        cxt.shadowColor = "rgba(0,0,0,0.4)";
        var imgSrc = sourceLoader_1.sourceLoader.sources[chara.name];
        //Convert position
        var charaX = (chara.x - Map.offsetX) >> 0;
        var charaY = (chara.y - Map.offsetY) >> 0;
        var _left = chara.imgPos[chara.status].left;
        var _top = chara.imgPos[chara.status].top;
        //Will stretch effect if scale
        var times = chara.scale ? chara.scale : 1;
        //Multiple actions status
        if (_left instanceof Array || _top instanceof Array) {
            cxt.drawImage(imgSrc, _left[chara.action], _top[chara.action], chara.width, chara.height, charaX, charaY, chara.width * times >> 0, chara.height * times >> 0);
        }
        else {
            cxt.drawImage(imgSrc, _left, _top, chara.width, chara.height, charaX, charaY, chara.width * times >> 0, chara.height * times >> 0);
        }
        //Remove shadow
        cxt.restore();
    },
    drawBullet: function (chara) {
        //Can draw bullets need rotate
        if (!(chara instanceof Bullets))
            return; //Will only show bullet
        if (chara.status == "dead")
            return; //Will not show dead
        //Won't draw bullets outside screen
        if (!chara.insideScreen())
            return;
        //Draw unit
        var imgSrc = sourceLoader_1.sourceLoader.sources[chara.name];
        var _left = chara.imgPos[chara.status].left;
        var _top = chara.imgPos[chara.status].top;
        //Convert position
        var centerX = (chara.posX() - Map.offsetX) >> 0;
        var centerY = (chara.posY() - Map.offsetY) >> 0;
        //Rotate canvas
        exports.Game.frontCxt.save();
        //Rotate to draw bullet
        exports.Game.frontCxt.translate(centerX, centerY);
        exports.Game.frontCxt.rotate(-chara.angle);
        //Draw shadow
        //Game.frontCxt.shadowBlur=50;//Different blur level on Firefox and Chrome, bad performance
        exports.Game.frontCxt.shadowOffsetX = (chara.owner.isFlying) ? 5 : 3;
        exports.Game.frontCxt.shadowOffsetY = (chara.owner.isFlying) ? 20 : 5;
        exports.Game.frontCxt.shadowColor = "rgba(0,0,0,0.4)";
        //Game.frontCxt.shadowColor="rgba(255,0,0,1)";
        //Multiple actions status
        if (_left instanceof Array || _top instanceof Array) {
            exports.Game.frontCxt.drawImage(imgSrc, _left[chara.action], _top[chara.action], chara.width, chara.height, -chara.width / 2 >> 0, -chara.height / 2 >> 0, chara.width, chara.height);
        }
        else {
            exports.Game.frontCxt.drawImage(imgSrc, _left, _top, chara.width, chara.height, -chara.width / 2 >> 0, -chara.height / 2 >> 0, chara.width, chara.height);
        }
        //Rotate canvas back and remove shadow
        exports.Game.frontCxt.restore();
        //Below 2 separated steps might cause mess
        //Game.frontCxt.translate(-centerX,-centerY);
        //Game.frontCxt.rotate(chara.angle);
    },
    drawInfoBox: function () {
        //Update selected unit active info which need refresh
        if (exports.Game.selectedUnit instanceof Gobj && exports.Game.selectedUnit.status != "dead") {
            //Update selected unit life,shield and magic
            var lifeRatio = exports.Game.selectedUnit.life / exports.Game.selectedUnit.get('HP');
            $('div.infoLeft span._Health')[0].style.color = ((lifeRatio > 0.7) ? "green" : (lifeRatio > 0.3) ? "yellow" : "red");
            $('div.infoLeft span.life')[0].innerHTML = exports.Game.selectedUnit.life >> 0;
            if (exports.Game.selectedUnit.SP) {
                $('div.infoLeft span.shield')[0].innerHTML = exports.Game.selectedUnit.shield >> 0;
            }
            if (exports.Game.selectedUnit.MP) {
                $('div.infoLeft span.magic')[0].innerHTML = exports.Game.selectedUnit.magic >> 0;
            }
            //Update selected unit kill
            if (exports.Game.selectedUnit.kill != null) {
                $('div.infoCenter p.kill span')[0].innerHTML = exports.Game.selectedUnit.kill;
            }
        }
    },
    drawSourceBox: function () {
        //Update min, gas, curMan and totalMan
        $('div.resource_Box span.mineNum')[0].innerHTML = Resource[exports.Game.team].mine;
        $('div.resource_Box span.gasNum')[0].innerHTML = Resource[exports.Game.team].gas;
        $('div.resource_Box span.manNum>span')[0].innerHTML = Resource[exports.Game.team].curMan;
        $('div.resource_Box span.manNum>span')[1].innerHTML = Resource[exports.Game.team].totalMan;
        //Check if man overflow
        $('div.resource_Box span.manNum')[0].style.color = (Resource[exports.Game.team].curMan > Resource[exports.Game.team].totalMan) ? "red" : "#00ff00";
    },
    drawProcessingBox: function () {
        //Show processing box if it's processing
        var processing = exports.Game.selectedUnit.processing;
        //Can disable this filter for testing
        if (processing && exports.Game.selectedUnit.team == exports.Game.team) {
            $('div.upgrading div[name="icon"]')[0].className = processing.name;
            //var percent=((new Date().getTime()-processing.startTime)/(processing.time)+0.5)>>0;
            var percent = ((exports.Game.mainTick - processing.startTime) * 100 / (processing.time) + 0.5) >> 0;
            $('div.upgrading div[name="processing"] span')[0].innerHTML = percent;
            $('div.upgrading div[name="processing"] div.processedBar')[0].style.width = percent + '%';
            $('div.upgrading').attr('title', processing.name).show();
        }
        else {
            //Select nothing, show replay progress
            if (exports.Game.replayFlag && exports.Game.endTick > 0) {
                $('div.upgrading div[name="icon"]')[0].className = 'Replay';
                var percent = (exports.Game.mainTick * 100 / (exports.Game.endTick) + 0.5) >> 0;
                $('div.upgrading div[name="processing"] span')[0].innerHTML = percent;
                $('div.upgrading div[name="processing"] div.processedBar')[0].style.width = percent + '%';
                $('div.upgrading').attr('title', 'Replay Progress').show();
                if (!(exports.Game.selectedUnit instanceof Gobj)) {
                    $('div.infoRight').show();
                    $('div.upgraded').hide();
                }
            }
            else
                $('div.upgrading').removeAttr('title').hide();
        }
    },
    refreshMultiSelectBox: function () {
        var divs = $('div.override div.multiSelection div');
        //Only refresh border color on current multiSelect box
        for (var n = 0; n < divs.length; n++) {
            divs[n].style.borderColor = exports.Game.allSelected[n].lifeStatus();
        }
    },
    drawMultiSelectBox: function () {
        //Clear old icons
        $('div.override div.multiSelection')[0].innerHTML = '';
        //Redraw all icons
        exports.Game.allSelected.forEach(function (chara, N) {
            var node = document.createElement('div');
            node.setAttribute('name', 'portrait');
            //Override portrait
            if (chara.portrait)
                node.className = chara.portrait;
            else
                node.className = (chara instanceof Building) ? (chara.attack ? chara.inherited.inherited.name : chara.inherited.name) : chara.name;
            node.title = chara.name;
            node.style.borderColor = chara.lifeStatus();
            node.onclick = function () {
                //Selection execute
                exports.Game.unselectAll();
                exports.Game.changeSelectedTo(chara);
                //Single selection mode
                $('div.override').hide();
                $('div.override div.multiSelection').hide();
            };
            $('div.override div.multiSelection')[0].appendChild(node);
        });
        var iconNum = $('div.override div.multiSelection div').length;
        //Adjust width if unit icon space overflow
        $('div.override div.multiSelection').css('width', (iconNum > 12 ? Math.ceil(iconNum / 2) * 55 : 330) + 'px');
        //Adjust background position after added into DOM, nth starts from 1st(no 0th)
        for (var n = 1; n <= iconNum; n++) {
            var bgPosition = $('div.override div.multiSelection div:nth-child(' + n + ')').css('background-position');
            bgPosition = bgPosition.split(' ').map(function (pos) {
                return parseInt(pos) * 0.75 + 'px';
            }).join(' ');
            $('div.override div.multiSelection div:nth-child(' + n + ')').css('background-position', bgPosition);
        }
    },
    loop: function () {
        //Process due commands for current frame before drawing
        var commands = exports.Game.commands[exports.Game.mainTick];
        if (commands instanceof Array) {
            for (var N = 0; N < commands.length; N++) {
                commands[N]();
            }
            delete exports.Game.commands[exports.Game.mainTick];
        }
        /************ Draw part *************/
        //Clear all canvas
        exports.Game.cxt.clearRect(0, 0, exports.Game.HBOUND, exports.Game.VBOUND);
        exports.Game.frontCxt.clearRect(0, 0, exports.Game.HBOUND, exports.Game.VBOUND);
        //DrawLayer0: Refresh map if needed
        if (mouseController.mouseX < Map.triggerMargin)
            Map.needRefresh = "LEFT";
        if (mouseController.mouseX > (exports.Game.HBOUND - Map.triggerMargin))
            Map.needRefresh = "RIGHT";
        if (mouseController.mouseY < Map.triggerMargin)
            Map.needRefresh = "TOP";
        if (mouseController.mouseY > (exports.Game.VBOUND - Map.triggerMargin))
            Map.needRefresh = "BOTTOM";
        if (Map.needRefresh) {
            Map.refresh(Map.needRefresh);
            Map.needRefresh = false;
        }
        //DrawLayer1: Show all buildings
        for (var N = 0; N < Building.allBuildings.length; N++) {
            var build = Building.allBuildings[N];
            //GC
            if (build.status == "dead") {
                Building.allBuildings.splice(N, 1);
                N--; //Next unit come to this position
                continue;
            }
            //Draw
            exports.Game.draw(build);
        }
        //DrawLayer2: Show all existed units
        for (var N = 0; N < Unit.allUnits.length; N++) {
            var chara = Unit.allUnits[N];
            //GC
            if (chara.status == "dead") {
                Unit.allUnits.splice(N, 1);
                N--;
                continue;
            }
            //Draw
            exports.Game.draw(chara);
        }
        //DrawLayer3: Draw all bullets
        for (var N = 0; N < Bullets.allBullets.length; N++) {
            var bullet = Bullets.allBullets[N];
            //GC
            if (bullet.status == "dead" && bullet.used) {
                Bullets.allBullets.splice(N, 1);
                N--;
                continue;
            }
            exports.Game.drawBullet(bullet);
        }
        //DrawLayer4: Draw effects above units
        for (var N = 0; N < Burst.allEffects.length; N++) {
            var effect = Burst.allEffects[N];
            //GC
            if (effect.status == "dead" || (effect.target && effect.target.status == "dead")) {
                Burst.allEffects.splice(N, 1);
                N--;
                continue;
            }
            exports.Game.drawEffect(effect);
        }
        //DrawLayer5: Draw drag rect
        if (mouseController.drag) {
            exports.Game.cxt.lineWidth = 3;
            exports.Game.cxt.strokeStyle = "green";
            exports.Game.cxt.strokeRect(mouseController.startPoint.x, mouseController.startPoint.y, mouseController.endPoint.x - mouseController.startPoint.x, mouseController.endPoint.y - mouseController.startPoint.y);
        }
        //DrawLayerBottom: Draw info box and resource box
        exports.Game.drawInfoBox();
        exports.Game.drawSourceBox();
        exports.Game.drawProcessingBox();
        /************ Calculate for next frame *************/
        //Clock ticking
        exports.Game.mainTick++;
        //For network mode
        if (Multiplayer.ON) {
            //Send current tick to server
            Multiplayer.webSocket.send(JSON.stringify({
                type: 'tick',
                tick: exports.Game.mainTick,
                cmds: (Multiplayer.cmds.length ? Multiplayer.cmds : null)
            }));
        }
        else {
            //Record user moves and execute if have
            if (Multiplayer.cmds.length > 0) {
                //MainTick++ just before this code piece
                exports.Game.replay[exports.Game.mainTick] = $.extend([], Multiplayer.cmds);
                //Execute command
                Multiplayer.parseTickCmd({
                    tick: exports.Game.mainTick,
                    cmds: Multiplayer.cmds
                });
            }
        }
        //Clear commands
        if (Multiplayer.cmds.length > 0) {
            Multiplayer.cmds = [];
        }
        //Postpone play frames and AI after drawing (consume time)
        Building.allBuildings.concat(Unit.allUnits).concat(Bullets.allBullets).concat(Burst.allEffects).forEach(function (chara) {
            //Add this makes chara intelligent for attack
            if (chara.AI)
                chara.AI();
            //Judge reach destination
            if (chara instanceof Unit)
                Referee.judgeReachDestination(chara);
            //Join timers together
            chara.playFrames();
        });
        //Will invite Mr.Referee to make some judgments
        Referee.tasks.forEach(function (task) {
            Referee[task]();
        });
        //Release selected unit when unit died or is invisible enemy
        if (exports.Game.selectedUnit instanceof Gobj) {
            if (exports.Game.selectedUnit.status == "dead" || (exports.Game.selectedUnit['isInvisible' + exports.Game.team] && exports.Game.selectedUnit.isEnemy())) {
                exports.Game.selectedUnit.selected = false;
                exports.Game.changeSelectedTo({});
            }
        }
    },
    animation: function () {
        if (Multiplayer.ON) {
            exports.Game._timer = setInterval(function () {
                if (exports.Game.mainTick < exports.Game.serverTick)
                    exports.Game.loop();
            }, exports.Game._frameInterval);
        }
        else
            exports.Game.startAnimation();
    },
    stopAnimation: function () {
        if (exports.Game._timer != -1)
            clearInterval(exports.Game._timer);
        exports.Game._timer = -1;
    },
    startAnimation: function () {
        if (exports.Game._timer == -1)
            exports.Game._timer = setInterval(exports.Game.loop, exports.Game._frameInterval);
    },
    stop: function (charas) {
        charas.forEach(function (chara) {
            chara.stop();
        });
        exports.Game.stopAnimation();
    },
    win: function () {
        if (Multiplayer.ON) {
            Multiplayer.webSocket.send(JSON.stringify({
                type: 'getReplay'
            }));
        }
        else {
            exports.Game.saveReplay();
            exports.Game.saveReplayIntoDB();
        }
        $('div#GamePlay').fadeOut(3000, function () {
            exports.Game.stop(Unit.allUnits);
            //Win poster
            exports.Game.layerSwitchTo("GameWin");
            new Audio(exports.Game.CDN + 'bgm/GameWin.wav').play();
        });
        //Self destruction to prevent duplicate fadeout
        exports.Game.win = function () { };
    },
    lose: function () {
        if (Multiplayer.ON) {
            Multiplayer.webSocket.send(JSON.stringify({
                type: 'getReplay'
            }));
        }
        else {
            exports.Game.saveReplay();
            exports.Game.saveReplayIntoDB();
        }
        $('div#GamePlay').fadeOut(3000, function () {
            exports.Game.stop(Unit.allUnits);
            //Lose poster
            exports.Game.layerSwitchTo("GameLose");
            new Audio(exports.Game.CDN + 'bgm/GameLose.wav').play();
        });
        //Self destruction to prevent duplicate fadeout
        exports.Game.lose = function () { };
    },
    saveReplay: function (replayData) {
        if (!exports.Game.replayFlag) {
            localStorage.setItem('lastReplay', JSON.stringify({
                level: exports.Game.level,
                team: exports.Game.team,
                //Save Game.replay by default
                cmds: (replayData != null) ? replayData : (exports.Game.replay),
                end: exports.Game.mainTick
            }));
        }
    },
    showWarning: function (msg, interval) {
        //Default interval
        if (!interval)
            interval = 3000;
        //Show message for a period
        $('div.warning_Box').html(msg).show();
        //Hide message after a period
        setTimeout(function () {
            $('div.warning_Box').html('').hide();
        }, interval);
    },
    showMessage: function () {
        //Clossure timer
        var _timer = 0;
        return function (msg, interval) {
            //Default interval
            if (!interval)
                interval = 3000;
            //Show message for a period
            $('div.message_Box').append('<p>' + msg + '</p>').show();
            //Can show multiple lines together
            if (_timer)
                clearTimeout(_timer);
            //Hide message after a period
            _timer = setTimeout(function () {
                $('div.message_Box').html('').hide();
            }, interval);
        };
    }(),
    //Return from 0 to 0.99
    getNextRandom: (function () {
        //Clossure variable and function
        var rands = [];
        var getRands = function () {
            //Use current tick as seed
            var seed = exports.Game.mainTick + exports.Game.randomSeed;
            var rands = [];
            for (var N = 0; N < 100; N++) {
                //Seed grows up in range 100
                seed = (seed * 21 + 3) % 100;
                rands.push(seed);
            }
            return rands;
        };
        return function () {
            //If all rands used, generate new ones
            if (rands.length == 0)
                rands = getRands();
            return rands.shift() / 100;
        };
    })(),
    resizeWindow: function () {
        //Update parameters
        exports.Game.HBOUND = innerWidth; //$('body')[0].scrollWidth
        exports.Game.VBOUND = innerHeight; //$('body')[0].scrollHeight
        exports.Game.infoBox.width = exports.Game.HBOUND - 295;
        exports.Game.infoBox.y = exports.Game.VBOUND - 110;
        //Resize canvas
        $('#GamePlay>canvas').attr('width', exports.Game.HBOUND); //Canvas width adjust
        $('#GamePlay>canvas').attr('height', exports.Game.VBOUND - exports.Game.infoBox.height + 5); //Canvas height adjust
        //Resize panel_Info
        $('div.panel_Info')[0].style.width = ((exports.Game.HBOUND - 295) + 'px');
        if (Map.ready) {
            //Update map inside-stroke size
            Map.insideStroke.width = (130 * exports.Game.HBOUND / Map.getCurrentMap().width) >> 0;
            Map.insideStroke.height = (130 * exports.Game.VBOUND / Map.getCurrentMap().height) >> 0;
            //Redraw background
            Map.drawBg();
            //Need re-calculate fog immediately
            Map.drawFogAndMinimap();
        }
    },
    getCurrentTs: function () {
        var now = new Date();
        var formatNum = function (num) {
            if (num < 10)
                return ('0' + num);
            else
                return num.toString();
        };
        var timestamp = now.getFullYear() + '-' + formatNum(now.getMonth() + 1) + '-' + formatNum(now.getDate()) + ' '
            + formatNum(now.getHours()) + ':' + formatNum(now.getMinutes()) + ':' + formatNum(now.getSeconds());
        return timestamp;
    },
    //New H5 features demo
    pauseWhenHide: function () {
        //Add pause when hide window
        $(document).on('visibilitychange', function () {
            if ($(document).attr('hidden') != null) {
                if ($(document).attr('hidden')) {
                    Button.pauseHandler();
                    $('title').html('Paused...');
                }
                else {
                    Button.playHandler();
                    $('title').html('StarCraft');
                }
            }
        });
    },
    initIndexDB: function () {
        //(window as any).indexedDB=(indexedDB || webkitIndexedDB || mozIndexedDB || msIndexedDB);
        var connect = indexedDB.open('StarCraftHTML5', 1);
        connect.onupgradeneeded = function (evt) {
            var db = evt.target.result;
            var objStore = db.createObjectStore('Replays', { keyPath: 'id', autoIncrement: true });
            objStore.createIndex('levelIndex', 'level', { unique: false });
            objStore.createIndex('teamIndex', 'team', { unique: false });
            objStore.createIndex('endIndex', 'end', { unique: false });
            objStore.createIndex('msIndex', 'millisec', { unique: false });
            objStore.createIndex('tsIndex', 'timestamp', { unique: false });
            objStore.createIndex('offlineIndex', 'offline', { unique: false });
            db.close();
        };
    },
    saveReplayIntoDB: function () {
        var connect = indexedDB.open('StarCraftHTML5', 1);
        connect.onsuccess = function (evt) {
            var db = evt.target.result;
            var objStore = db.transaction(['Replays'], 'readwrite').objectStore('Replays');
            objStore.add({
                level: exports.Game.level,
                team: exports.Game.team,
                cmds: exports.Game.replay,
                end: exports.Game.mainTick,
                millisec: new Date().getTime(),
                timestamp: exports.Game.getCurrentTs(),
                offline: Boolean(exports.Game.offline).toString()
            });
            db.close();
        };
    }
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.sourceLoader = {
    sources: {},
    sourceNum: 0,
    loadedNum: 0,
    allLoaded: true,
    load: function (type, src, id) {
        exports.sourceLoader.sourceNum++;
        exports.sourceLoader.allLoaded = false;
        var source;
        var loaded = function () {
            exports.sourceLoader.loadedNum++;
            if (exports.sourceLoader.loadedNum == exports.sourceLoader.sourceNum) {
                exports.sourceLoader.allLoaded = true;
            }
        }; //Code copy
        if (type == 'img') {
            source = new Image();
            source.src = src;
            source.onload = loaded;
            exports.sourceLoader.sources[id] = source;
        }
        if (type == 'audio') {
            source = new Audio();
            source.addEventListener('canplaythrough', loaded, false);
            //source.oncanplaythrough=loaded;
            source.src = src; //Pose after listener to prevent fired early
            exports.sourceLoader.sources[id] = source;
        }
        //For my Dojo: src==pathName
        if (type == 'js') {
            var node = document.createElement('script');
            node.onload = function () {
                //Load builder
                _$.modules[src] = _$.define.loadedBuilders.shift();
                loaded();
            };
            node.src = src + '.js';
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    },
    allOnLoad: function (callback) {
        if (exports.sourceLoader.allLoaded) {
            callback();
        }
        else {
            //Show Load Process
            $('div.LoadedBlock').css('width', (Math.round(100 * exports.sourceLoader.loadedNum / exports.sourceLoader.sourceNum) + "%"));
            //Recursion
            setTimeout(function () {
                exports.sourceLoader.allOnLoad(callback);
            }, 100);
        }
    }
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Game_1 = __webpack_require__(0);
var sourceLoader_1 = __webpack_require__(1);
exports.Map = {
    currentMap: 'Switchback',
    ready: false,
    offsetX: 0,
    offsetY: 0,
    speed: 40,
    triggerMargin: 20,
    //To synchronize drawing map and units, will not refresh immediately
    needRefresh: null,
    fogFlag: true,
    fogUnits: [],
    allUnits: [],
    batchSize: 0,
    miniCxt: $('canvas[name="mini_map"]')[0].getContext('2d'),
    fogCanvas: document.createElement('canvas'),
    shadowCanvas: document.createElement('canvas'),
    insideStroke: {
        width: 0,
        height: 0
    },
    fogCxt: null,
    shadowCxt: null,
    //Init map
    setCurrentMap: function (name) {
        exports.Map.currentMap = name;
        $('canvas[name="mini_map"]').attr('class', name);
        //Init inside stroke size
        exports.Map.insideStroke.width = (130 * Game_1.Game.HBOUND / exports.Map.getCurrentMap().width) >> 0;
        exports.Map.insideStroke.height = (130 * Game_1.Game.VBOUND / exports.Map.getCurrentMap().height) >> 0;
        //Init fog relative
        exports.Map.fogCxt = exports.Map.fogCanvas.getContext('2d');
        exports.Map.fogCanvas.width = 130;
        exports.Map.fogCanvas.height = Math.round(130 * exports.Map.getCurrentMap().height / exports.Map.getCurrentMap().width);
        exports.Map.fogCanvas.ratio = 130 / exports.Map.getCurrentMap().width;
        exports.Map.shadowCanvas.width = exports.Map.shadowCanvas.height = 100;
        exports.Map.shadowCxt = exports.Map.shadowCanvas.getContext('2d');
        //Prepared fog shadow for quick render
        var radial = exports.Map.shadowCxt.createRadialGradient(50, 50, 25, 50, 50, 50);
        radial.addColorStop(0, 'rgba(0,0,0,1)');
        radial.addColorStop(1, 'rgba(0,0,0,0)');
        exports.Map.shadowCxt.fillStyle = radial;
        exports.Map.shadowCxt.beginPath();
        exports.Map.shadowCxt.arc(50, 50, 50, 0, Math.PI * 2);
        exports.Map.shadowCxt.fill();
        //Map is ready after current map set
        exports.Map.ready = true;
    },
    getCurrentMap: function () {
        return sourceLoader_1.sourceLoader.sources['Map_' + exports.Map.currentMap];
    },
    //Draw interface call
    drawFogAndMinimap: function () {
        if (exports.Map.fogFlag) {
            exports.Map.refreshFog();
            //Draw fog on main map
            var ratio = exports.Map.fogCanvas.ratio;
            Game_1.Game.fogCxt.clearRect(0, 0, Game_1.Game.HBOUND, Game_1.Game.VBOUND);
            Game_1.Game.fogCxt.drawImage(exports.Map.fogCanvas, Math.round(exports.Map.offsetX * ratio), Math.round(exports.Map.offsetY * ratio), Math.round(Game_1.Game.HBOUND * ratio), Math.round(Game_1.Game.VBOUND * ratio), 0, 0, Game_1.Game.HBOUND, Game_1.Game.VBOUND);
        }
        //Draw mini-map
        exports.Map.drawMiniMap();
    },
    //Used by drawFogAndMinimap
    refreshFog: function () {
        //Reset composite operation
        exports.Map.fogCxt.globalCompositeOperation = 'source-over';
        //Brush black fog to clean old fog
        exports.Map.fogCxt.fillStyle = 'rgba(0,0,0,1)';
        exports.Map.fogCxt.fillRect(0, 0, exports.Map.fogCanvas.width, exports.Map.fogCanvas.height);
        //Other things have sight
        var parasitedEnemies = Unit.allEnemyUnits().filter(function (chara) {
            return chara.buffer.Parasite == Game_1.Game.team;
        });
        var scannerSweeps = Burst.allEffects.filter(function (anime) {
            return anime.constructor.name == "ScannerSweep" && anime.team == Game_1.Game.team;
        });
        var addInObjs = parasitedEnemies.concat(scannerSweeps);
        //Clear fog
        exports.Map.fogCxt.globalCompositeOperation = 'destination-out';
        //Initial
        exports.Map.allUnits = Unit.allOurUnits().concat(Building.ourBuildings()).concat(addInObjs);
        //Draw fog
        exports.Map.fogCxt.fillStyle = 'rgba(0,0,0,1)';
        var ratio = exports.Map.fogCanvas.ratio;
        exports.Map.allUnits.forEach(function (chara) {
            //Clear fog on screen for our units inside screen
            var centerX = Math.round(chara.posX() * ratio);
            var centerY = Math.round(chara.posY() * ratio);
            var radius = Math.round(chara.get('sight') * ratio << 1);
            exports.Map.fogCxt.drawImage(exports.Map.shadowCanvas, 0, 0, 100, 100, centerX - radius, centerY - radius, radius << 1, radius << 1);
        });
    },
    //Used by drawFogAndMinimap: draw red&green block and white stroke
    drawMiniMap: function () {
        //Selected map size
        var mapWidth = exports.Map.getCurrentMap().width;
        var mapHeight = exports.Map.getCurrentMap().height;
        //Clear mini-map
        exports.Map.miniCxt.clearRect(0, 0, 130, 130);
        //Re-draw mini-map points
        var miniX, miniY, rectSize;
        Building.allBuildings.concat(Unit.allUnits).forEach(function (chara) {
            //Filter out invisible enemy
            if (chara['isInvisible' + Game_1.Game.team] && chara.isEnemy())
                return;
            miniX = (130 * chara.x / mapWidth) >> 0;
            miniY = (130 * chara.y / mapHeight) >> 0;
            exports.Map.miniCxt.fillStyle = (chara.isEnemy()) ? 'red' : 'lime';
            rectSize = (chara instanceof Building) ? 4 : 3;
            exports.Map.miniCxt.fillRect(miniX, miniY, rectSize, rectSize);
        });
        //Draw fog on mini-map
        if (exports.Map.fogFlag)
            exports.Map.miniCxt.drawImage(exports.Map.fogCanvas, 0, 0, exports.Map.fogCanvas.width, exports.Map.fogCanvas.height, 0, 0, 130, 130);
        //Re-draw inside stroke
        exports.Map.miniCxt.strokeStyle = 'white';
        exports.Map.miniCxt.lineWidth = 2;
        exports.Map.miniCxt.strokeRect((130 * exports.Map.offsetX / mapWidth) >> 0, (130 * exports.Map.offsetY / mapHeight) >> 0, exports.Map.insideStroke.width, exports.Map.insideStroke.height);
    },
    drawMud: function () {
        var _increments = [[0, 1], [-1, 0], [0, -1], [1, 0]];
        var mudRadius = 120;
        var mudIncrements = _$.mapTraverse(_increments, function (x) {
            return x * mudRadius / 2;
        });
        Game_1.Game.backCxt.save();
        Game_1.Game.backCxt.beginPath();
        //Create fill style for mud
        var mudPattern = Game_1.Game.backCxt.createPattern(sourceLoader_1.sourceLoader.sources['Mud'], "repeat");
        Game_1.Game.backCxt.fillStyle = mudPattern;
        Building.allBuildings.filter(function (chara) {
            return (chara instanceof Building.ZergBuilding) && !chara.noMud && chara.insideScreen();
        }).forEach(function (chara) {
            var centerX = chara.posX() - exports.Map.offsetX;
            var centerY = chara.posY() - exports.Map.offsetY;
            var pos = [centerX + mudRadius, centerY - mudRadius];
            Game_1.Game.backCxt.moveTo(pos[0], pos[1]);
            for (var M = 0, angle = -Math.PI / 4; M < 4; M++, angle += Math.PI / 2) {
                for (var N = 0; N < 5; N++) {
                    Game_1.Game.backCxt.arc(pos[0], pos[1], mudRadius / 4, angle, angle + Math.PI / 2);
                    if (N < 4) {
                        pos[0] += mudIncrements[M][0];
                        pos[1] += mudIncrements[M][1];
                    }
                }
            }
        });
        //Stroke edge clearly
        Game_1.Game.backCxt.strokeStyle = "#212";
        Game_1.Game.backCxt.lineWidth = 3;
        Game_1.Game.backCxt.stroke();
        //Fill mud
        Game_1.Game.backCxt.fill();
        Game_1.Game.backCxt.restore();
    },
    drawBg: function () {
        //Clear background
        Game_1.Game.backCxt.clearRect(0, 0, Game_1.Game.HBOUND, Game_1.Game.VBOUND);
        //Draw map as background
        Game_1.Game.backCxt.drawImage(exports.Map.getCurrentMap(), exports.Map.offsetX, exports.Map.offsetY, Game_1.Game.HBOUND, Game_1.Game.VBOUND - Game_1.Game.infoBox.height + 5, 0, 0, Game_1.Game.HBOUND, Game_1.Game.VBOUND - Game_1.Game.infoBox.height + 5);
        //Draw mud for ZergBuildings
        exports.Map.drawMud();
    },
    refresh: function (direction) {
        var edgeX = exports.Map.getCurrentMap().width - Game_1.Game.HBOUND;
        var edgeY = exports.Map.getCurrentMap().height - Game_1.Game.VBOUND + Game_1.Game.infoBox.height - 5;
        var onlyMap;
        switch (direction) {
            case "LEFT":
                exports.Map.offsetX -= exports.Map.speed;
                if (exports.Map.offsetX < 0)
                    exports.Map.offsetX = 0;
                break;
            case "RIGHT":
                exports.Map.offsetX += exports.Map.speed;
                if (exports.Map.offsetX > edgeX)
                    exports.Map.offsetX = edgeX;
                break;
            case "TOP":
                exports.Map.offsetY -= exports.Map.speed;
                if (exports.Map.offsetY < 0)
                    exports.Map.offsetY = 0;
                break;
            case "BOTTOM":
                exports.Map.offsetY += exports.Map.speed;
                if (exports.Map.offsetY > edgeY)
                    exports.Map.offsetY = edgeY;
                break;
            case "MAP":
                onlyMap = true;
                break;
        }
        exports.Map.drawBg();
        //Need re-calculate fog when screen moves
        if (!onlyMap)
            exports.Map.drawFogAndMinimap();
    },
    clickHandler: function (event) {
        //Mouse at (clickX,clickY)
        var clickX = event.pageX - $('canvas[name="mini_map"]').offset().left;
        var clickY = event.pageY - $('canvas[name="mini_map"]').offset().top;
        //Relocate map center
        exports.Map.relocateAt(exports.Map.getCurrentMap().width * clickX / 130, exports.Map.getCurrentMap().height * clickY / 130);
    },
    dblClickHandler: function (event) {
        //Mouse at (clickX,clickY)
        var clickX = event.pageX - $('canvas[name="mini_map"]').offset().left;
        var clickY = event.pageY - $('canvas[name="mini_map"]').offset().top;
        //Map (clickX,clickY) to position (mapX,mapY) on map
        var mapX = exports.Map.getCurrentMap().width * clickX / 130;
        var mapY = exports.Map.getCurrentMap().height * clickY / 130;
        //Move selected units to (mapX,mapY)
        Unit.allUnits.filter(function (chara) {
            return (chara.team == Game_1.Game.team) && chara.selected;
        }).forEach(function (chara) {
            if (chara.attack)
                chara.stopAttack();
            chara.targetLock = true;
            chara.moveTo(mapX, mapY);
        });
    },
    relocateAt: function (centerX, centerY) {
        //Get map edge
        var edgeX = exports.Map.getCurrentMap().width - Game_1.Game.HBOUND;
        var edgeY = exports.Map.getCurrentMap().height - Game_1.Game.VBOUND + Game_1.Game.infoBox.height - 5;
        //Map (centerX,centerY) to position (offsetX,offsetY) on top-left in map
        var offsetX = (centerX - Game_1.Game.HBOUND / 2) >> 0;
        if (offsetX < 0)
            offsetX = 0;
        if (offsetX > edgeX)
            offsetX = edgeX;
        var offsetY = (centerY - (Game_1.Game.VBOUND - Game_1.Game.infoBox.height + 5) / 2) >> 0;
        if (offsetY < 0)
            offsetY = 0;
        if (offsetY > edgeY)
            offsetY = edgeY;
        //Relocate map
        exports.Map.offsetX = offsetX;
        exports.Map.offsetY = offsetY;
        exports.Map.needRefresh = true; //For synchronize
    }
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Game_1 = __webpack_require__(0);
var Map_1 = __webpack_require__(2);
var Resource_1 = __webpack_require__(4);
var Animation_1 = __webpack_require__(5);
window.Map = Map_1.Map;
window.Game = Game_1.Game;
window.Resource = Resource_1.Resource;
window.Animation = Animation_1.Animation;
Game_1.Game.init();


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.Resource = {
    init: function () {
        for (var N = 0; N < Game.playerNum; N++) {
            exports.Resource[N] = {
                mine: 50,
                gas: 0,
                curMan: 0,
                totalMan: 0
            };
        }
    },
    getCost: function (name, team) {
        var cost, count;
        if (!team)
            team = Game.team;
        [Zerg, Terran, Protoss, Building.ZergBuilding, Building.TerranBuilding, Building.ProtossBuilding, Magic, Upgrade].forEach(function (Type) {
            //Not found yet
            if (!cost) {
                for (var item in Type) {
                    //Filter out noise
                    if (item == 'inherited' || item == 'super' || item == 'extends')
                        continue;
                    if (item == name) {
                        if (typeof (Type[item]) == 'function') {
                            cost = Type[item].prototype.cost;
                            count = Type[item].prototype.birthCount;
                        }
                        else
                            cost = Type[item].cost;
                        //Resolve array cost
                        if (cost) {
                            //Clone fetched cost object, but sometimes undefined
                            cost = _$.clone(cost);
                            ['mine', 'gas', 'man', 'magic', 'time'].forEach(function (res) {
                                if (cost[res]) {
                                    if (cost[res] instanceof Array) {
                                        cost[res] = cost[res][Type[item].level[team]];
                                    }
                                    if (count) {
                                        cost[res] *= count;
                                    }
                                }
                            });
                        }
                        break;
                    }
                }
            }
        });
        return cost;
    },
    //Check if paid successfully
    paypal: function (cost) {
        if (cost) {
            var oweFlag = false;
            if (Cheat.gathering)
                cost.magic = 0;
            var team = (this.team != null) ? this.team : Game.team;
            if (cost['mine'] && cost['mine'] > exports.Resource[team].mine) {
                oweFlag = true;
                Game.showMessage('Not enough minerals...mine more minerals');
                //Advisor voice
                Referee.voice('resource')[Game.race.selected].mine.play();
            }
            if (cost['gas'] && cost['gas'] > exports.Resource[team].gas) {
                oweFlag = true;
                Game.showMessage('Not enough Vespene gases...harvest more gas');
                //Advisor voice
                Referee.voice('resource')[Game.race.selected].gas.play();
            }
            if (cost['man'] && cost['man'] > (exports.Resource[team].totalMan - exports.Resource[team].curMan) && !Cheat.manUnlimited) {
                oweFlag = true;
                switch (Game.race.selected) {
                    case 'Zerg':
                        Game.showMessage('Too many underlings...create more Overlords');
                        break;
                    case 'Terran':
                        Game.showMessage('Not enough supplies...build more Supply Depots');
                        break;
                    case 'Protoss':
                        Game.showMessage('Not enough psi...build more Pylons');
                        break;
                }
                //Advisor voice
                Referee.voice('resource')[Game.race.selected].man.play();
            }
            if (cost['magic'] && cost['magic'] > this.magic) {
                oweFlag = true;
                Game.showMessage('Not enough energy');
                //Advisor voice
                Referee.voice('resource')[Game.race.selected].magic.play();
            }
            if (oweFlag) {
                //Payment failed
                return false;
            }
            else {
                if (!this.creditBill) {
                    //Pay immediately
                    if (cost['mine']) {
                        exports.Resource[team].mine -= cost['mine'];
                    }
                    if (cost['gas']) {
                        exports.Resource[team].gas -= cost['gas'];
                    }
                    if (cost['magic']) {
                        this.magic -= cost['magic'];
                    }
                }
                //Already paid
                return true;
            }
        }
        else
            return true;
    },
    //Pay credit card bill
    payCreditBill: function () {
        var cost = this.creditBill;
        //Paid credit bill, no longer owe money this time
        delete this.creditBill;
        return exports.Resource.paypal.call(this, cost);
    }
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
//Alias
exports.Animation = Burst;
exports.Animation.getAllAnimations = function () {
    var allAnimes = [];
    for (var attr in exports.Animation) {
        if (exports.Animation[attr]["super"] === exports.Animation)
            allAnimes.push(exports.Animation[attr]);
    }
    return allAnimes;
};
exports.Animation.getName = function (anime) {
    for (var attr in exports.Animation) {
        //Should be animation constructor firstly
        if (exports.Animation[attr]["super"] === exports.Animation && (anime instanceof exports.Animation[attr]))
            return attr;
    }
};
exports.Animation.RightClickCursor = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Burst",
        imgPos: {
            burst: {
                left: [0, 44, 88, 132],
                top: [1087, 1087, 1087, 1087]
            }
        },
        width: 44,
        height: 28,
        frame: {
            burst: 4
        }
    }
});
exports.Animation.PsionicStorm = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [0, 188, 376, 564, 0, 188, 376, 564, 0, 188, 376, 564, 0, 188],
                top: [0, 0, 0, 0, 153, 153, 153, 153, 306, 306, 306, 306, 459, 459]
            }
        },
        width: 188,
        height: 153,
        scale: 1.2,
        duration: 7000,
        frame: {
            burst: 14
        }
    }
});
exports.Animation.Hallucination = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [752, 815, 878, 941, 1004, 1067, 1130, 1193, 1256, 752, 815, 878, 941, 1004, 1067, 1130, 1193, 1256],
                top: [0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 63, 63, 63, 63, 63, 63, 63, 63]
            }
        },
        width: 63,
        height: 63,
        above: true,
        frame: {
            burst: 18
        }
    }
});
exports.Animation.Consume = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [752, 826, 900, 974, 1048, 1122, 1196, 1270, 1344, 752, 826, 900, 974, 1048, 1122, 1196, 1270, 1344],
                top: [126, 126, 126, 126, 126, 126, 126, 126, 126, 196, 196, 196, 196, 196, 196, 196, 196, 196]
            }
        },
        width: 74,
        height: 70,
        above: true,
        autoSize: true,
        frame: {
            burst: 18
        }
    }
});
exports.Animation.StasisField = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: 376,
                top: 459
            }
        },
        width: 130,
        height: 110,
        above: true,
        autoSize: 'MAX',
        scale: 1.25,
        duration: 30000,
        frame: {
            burst: 1
        }
    }
});
exports.Animation.Lockdown = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [330, 0, 110, 220, 330, 0, 0, 0, 110, 220, 330, 0, 110, 220],
                top: [723, 834, 834, 834, 834, 945, 0, 612, 612, 612, 612, 723, 723, 723]
            }
        },
        width: 110,
        height: 111,
        above: true,
        autoSize: 'MAX',
        duration: 60000,
        frame: {
            burst: 6
        }
    }
});
exports.Animation.DarkSwarm = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [1260, 752, 1006, 1260, 752, 0, 752, 1006, 1260, 752, 1006],
                top: [456, 645, 645, 645, 834, 0, 267, 267, 267, 456, 456]
            }
        },
        width: 254,
        height: 189,
        scale: 1.2,
        duration: 60000,
        frame: {
            burst: 5
        }
    }
});
exports.Animation.Plague = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [1144, 1274, 1404, 754, 884, 1014, 1144, 1274, 1404, 754, 884, 1014, 1144, 1274],
                top: [892, 892, 892, 1022, 1022, 1022, 1022, 1022, 1022, 1152, 1152, 1152, 1152, 1152]
            }
        },
        width: 130,
        height: 130,
        scale: 1.2,
        frame: {
            burst: 14
        }
    }
});
exports.Animation.PurpleEffect = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [440, 499, 558, 617],
                top: [902, 902, 902, 902]
            }
        },
        width: 59,
        height: 60,
        above: true,
        autoSize: 'MIN',
        duration: 30000,
        frame: {
            burst: 4
        }
    }
});
exports.Animation.RedEffect = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [1006, 1068, 1130, 1192],
                top: [836, 836, 836, 836]
            }
        },
        width: 62,
        height: 50,
        above: true,
        autoSize: 'MIN',
        duration: 30000,
        frame: {
            burst: 4
        }
    }
});
exports.Animation.GreenEffect = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [1256, 1313, 1370, 1427],
                top: [836, 836, 836, 836]
            }
        },
        width: 57,
        height: 46,
        above: true,
        autoSize: 'MIN',
        duration: 30000,
        frame: {
            burst: 4
        }
    }
});
exports.Animation.Ensnare = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [0, 131, 262, 393, 524, 0, 131, 262, 393, 524, 0, 131, 262, 393, 524],
                top: [1056, 1056, 1056, 1056, 1056, 1181, 1181, 1181, 1181, 1181, 1306, 1306, 1306, 1306, 1306]
            }
        },
        width: 131,
        height: 125,
        scale: 1.2,
        frame: {
            burst: 15
        }
    }
});
exports.Animation.ScannerSweep = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [1012, 1012, 1167, 1167, 1322, 1322, 1012, 1012, 1167, 1167, 1322, 1322],
                top: [2220, 2220, 2220, 2220, 2220, 2220, 2335, 2335, 2335, 2335, 2335, 2335]
            }
        },
        width: 155,
        height: 115,
        scale: 1.5,
        duration: 15600,
        sight: 350,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.Feedback = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [632, 702, 772, 842, 912, 982, 1052, 1122, 1192, 1262, 1332, 1402],
                top: [2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872]
            }
        },
        width: 70,
        height: 70,
        above: true,
        autoSize: true,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.HellFire = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [655, 730, 805, 880, 955, 1030, 1105, 1180, 1255, 1330],
                top: [1284, 1284, 1284, 1284, 1284, 1284, 1284, 1284, 1284, 1284]
            }
        },
        width: 75,
        height: 75,
        above: true,
        autoSize: true,
        frame: {
            burst: 10
        }
    }
});
exports.Animation.MindControl = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [658, 720, 782, 844, 906, 968, 1030, 1092, 1154, 1216, 1278, 1340],
                top: [1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378]
            }
        },
        width: 62,
        height: 40,
        above: true,
        autoSize: true,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.RechargeShields = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [0, 64, 128, 192, 256, 320, 384, 448, 0, 64, 128, 192, 256, 320, 384, 448],
                top: [1432, 1432, 1432, 1432, 1432, 1432, 1432, 1432, 1496, 1496, 1496, 1496, 1496, 1496, 1496, 1496]
            }
        },
        width: 64,
        height: 64,
        above: true,
        autoSize: true,
        frame: {
            burst: 16
        }
    }
});
exports.Animation.DisruptionWeb = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [1396, 1396, 1396, 1396, 1088, 1088, 1242, 1242, 1392, 1392, 1392, 1392],
                top: [1194, 1194, 1322, 1322, 1432, 1432, 1432, 1432, 1432, 1432, 1538, 1538]
            }
        },
        width: 154,
        height: 112,
        scale: 1.2,
        duration: 25000,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.DefensiveMatrix = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [1327, 1427, 1327, 1427, 1327],
                top: [1664, 1664, 1751, 1751, 1838]
            }
        },
        width: 90,
        height: 84,
        above: true,
        autoSize: true,
        duration: 60000,
        frame: {
            burst: 5
        }
    }
});
exports.Animation.BlueShield = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [0, 130, 260, 390, 520, 0, 130, 260, 390, 520],
                top: [1560, 1560, 1560, 1560, 1560, 1690, 1690, 1690, 1690, 1690]
            }
        },
        width: 130,
        height: 130,
        above: true,
        autoSize: true,
        duration: 60000,
        frame: {
            burst: 10
        }
    }
});
exports.Animation.MaelStorm = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [2, 70, 130, 195, 252, 312, 372, 430, 492, 554],
                top: [2870, 2870, 2870, 2870, 2870, 2870, 2870, 2870, 2870, 2870]
            }
        },
        width: 60,
        height: 60,
        above: true,
        autoSize: true,
        duration: 18000,
        frame: {
            burst: 10
        }
    }
});
exports.Animation.RedShield = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [650, 780, 910, 1040, 1170, 650, 780, 910, 1040, 1170],
                top: [1560, 1560, 1560, 1560, 1560, 1690, 1690, 1690, 1690, 1690]
            }
        },
        width: 130,
        height: 130,
        above: true,
        autoSize: true,
        duration: 18000,
        frame: {
            burst: 10
        }
    }
});
exports.Animation.BurningCircle = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [0, 112, 224, 336, 448, 560],
                top: [1820, 1820, 1820, 1820, 1820, 1820]
            }
        },
        width: 112,
        height: 126,
        above: true,
        autoSize: true,
        duration: 18000,
        frame: {
            burst: 6
        }
    }
});
exports.Animation.Irradiate = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [668, 792, 916, 1042, 1172],
                top: [1820, 1820, 1820, 1820, 1820]
            }
        },
        width: 126,
        height: 110,
        above: true,
        autoSize: true,
        duration: 30000,
        frame: {
            burst: 5
        }
    }
});
exports.Animation.Recall = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [0, 86, 188, 282, 386, 488, 588, 688, 788, 894],
                top: [1938, 1938, 1938, 1938, 1938, 1938, 1938, 1938, 1938, 1938]
            }
        },
        width: 98,
        height: 98,
        frame: {
            burst: 10
        }
    }
});
exports.Animation.Ice = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [1024, 1164, 1304, 1444],
                top: [1942, 1942, 1942, 1942]
            }
        },
        width: 78,
        height: 88,
        above: true,
        autoSize: true,
        duration: 30000,
        frame: {
            burst: 4
        }
    }
});
exports.Animation.EMPShockwave = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [0, 180, 356, 534, 708, 886, 1068],
                top: [2038, 2038, 2038, 2038, 2038, 2038, 2038]
            }
        },
        width: 180,
        height: 146,
        scale: 1.5,
        frame: {
            burst: 7
        }
    }
});
exports.Animation.StasisFieldSpell = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [1384, 1250, 1250, 1384],
                top: [2044, 2044, 2044, 2044]
            }
        },
        width: 128,
        height: 84,
        frame: {
            burst: 4
        }
    }
});
exports.Animation.MaelStormSpell = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [1384, 1250, 1250, 1384],
                top: [2134, 2134, 2134, 2134]
            }
        },
        width: 128,
        height: 84,
        frame: {
            burst: 4
        }
    }
});
exports.Animation.Restoration = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [0, 128, 256, 384, 512, 640, 768, 896, 0, 128, 256, 384, 512, 640, 768, 896],
                top: [2190, 2190, 2190, 2190, 2190, 2190, 2190, 2190, 2318, 2318, 2318, 2318, 2318, 2318, 2318, 2318]
            }
        },
        width: 128,
        height: 128,
        above: true,
        autoSize: true,
        frame: {
            burst: 16
        }
    }
});
exports.Animation.Shockwave = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [0, 135, 270, 405, 540, 675, 810, 945, 1080, 1215, 1350],
                top: [2446, 2446, 2446, 2446, 2446, 2446, 2446, 2446, 2446, 2446, 2446]
            }
        },
        width: 135,
        height: 120,
        frame: {
            burst: 11
        }
    }
});
exports.Animation.NuclearStrike = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [0, 154, 308, 462, 616, 770, 924, 1078, 1232, 1386, 0, 154, 308, 462, 616, 770, 924, 1078, 1232, 1386],
                top: [2562, 2562, 2562, 2562, 2562, 2562, 2562, 2562, 2562, 2562, 2716, 2716, 2716, 2716, 2716, 2716, 2716, 2716, 2716, 2716]
            }
        },
        width: 154,
        height: 154,
        scale: 2.5,
        frame: {
            burst: 20
        }
    }
});
//Evolve related
exports.Animation.EvolveGroundUnit = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [524, 562, 600, 638, 676, 714, 524, 562, 600, 638, 676, 714],
                top: [724, 724, 724, 724, 724, 724, 766, 766, 766, 766, 766, 766]
            }
        },
        width: 38,
        height: 43,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.EvolveFlyingUnit = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "Magic",
        imgPos: {
            burst: {
                left: [438, 501, 564, 627, 690, 438, 501, 564, 627],
                top: [810, 810, 810, 810, 810, 855, 855, 855, 855]
            }
        },
        width: 63,
        height: 46,
        frame: {
            burst: 9
        }
    }
});
exports.Animation.SmallMutationComplete = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ZergBuilding",
        imgPos: {
            burst: {
                left: [1316, 1476, 1636, 1796],
                top: [962, 962, 962, 962]
            }
        },
        width: 88,
        height: 84,
        frame: {
            burst: 4
        }
    }
});
exports.Animation.MiddleMutationComplete = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ZergBuilding",
        imgPos: {
            burst: {
                left: [980, 1140, 1300],
                top: [1048, 1048, 1048]
            }
        },
        width: 120,
        height: 112,
        frame: {
            burst: 3
        }
    }
});
exports.Animation.LargeMutationComplete = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ZergBuilding",
        imgPos: {
            burst: {
                left: [960, 1120, 1280],
                top: [1160, 1160, 1160]
            }
        },
        width: 160,
        height: 150,
        frame: {
            burst: 3
        }
    }
});
exports.Animation.ProtossBuildingComplete = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ProtossBuilding",
        imgPos: {
            burst: {
                left: [486, 486, 636, 636],
                top: [648, 648, 648, 648]
            }
        },
        width: 152,
        height: 152,
        frame: {
            burst: 4
        }
    }
});
//Damaged related
exports.Animation.redFireL = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "TerranBuilding",
        imgPos: {
            burst: {
                left: [14, 78, 142, 206, 270, 334, 398, 462, 526, 590, 654, 718],
                top: [546, 546, 546, 546, 546, 546, 546, 546, 546, 546, 546, 546]
            }
        },
        width: 40,
        height: 70,
        //above:true,
        //Keep playing until killed
        forever: true,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.redFireM = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "TerranBuilding",
        imgPos: {
            burst: {
                left: [14, 78, 142, 206, 270, 334, 398, 462, 526, 590, 654, 718],
                top: [632, 632, 632, 632, 632, 632, 632, 632, 632, 632, 632, 632]
            }
        },
        width: 40,
        height: 70,
        //above:true,
        forever: true,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.redFireR = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "TerranBuilding",
        imgPos: {
            burst: {
                left: [10, 74, 138, 202, 266, 330, 394, 458, 522, 586, 650, 714],
                top: [722, 722, 722, 722, 722, 722, 722, 722, 722, 722, 722, 722]
            }
        },
        width: 48,
        height: 60,
        //above:true,
        forever: true,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.blueFireL = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ProtossBuilding",
        imgPos: {
            burst: {
                left: [14, 78, 142, 206, 270, 334, 398, 462, 526, 590, 654, 718],
                top: [424, 424, 424, 424, 424, 424, 424, 424, 424, 424, 424, 424]
            }
        },
        width: 40,
        height: 70,
        //above:true,
        forever: true,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.blueFireM = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ProtossBuilding",
        imgPos: {
            burst: {
                left: [14, 78, 142, 206, 270, 334, 398, 462, 526, 590, 654, 718],
                top: [506, 506, 506, 506, 506, 506, 506, 506, 506, 506, 506, 506]
            }
        },
        width: 40,
        height: 70,
        //above:true,
        forever: true,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.blueFireR = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ProtossBuilding",
        imgPos: {
            burst: {
                left: [10, 74, 138, 202, 266, 330, 394, 458, 522, 586, 650, 714],
                top: [588, 588, 588, 588, 588, 588, 588, 588, 588, 588, 588, 588]
            }
        },
        width: 48,
        height: 60,
        //above:true,
        forever: true,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.bloodA = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ZergBuilding",
        imgPos: {
            burst: {
                left: [768, 832, 896, 960, 1024, 1088, 1152, 1216, 1280, 1344, 1408, 1472],
                top: [1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320]
            }
        },
        width: 64,
        height: 50,
        //above:true,
        forever: true,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.bloodB = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ZergBuilding",
        imgPos: {
            burst: {
                left: [768, 832, 896, 960, 1024, 1088, 1152, 1216, 1280, 1344, 1408, 1472],
                top: [1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376]
            }
        },
        width: 64,
        height: 50,
        //above:true,
        forever: true,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.bloodC = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ZergBuilding",
        imgPos: {
            burst: {
                left: [0, 64, 128, 192, 256, 320, 384, 448, 512, 576, 640, 704],
                top: [1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376]
            }
        },
        width: 64,
        height: 50,
        //above:true,
        forever: true,
        frame: {
            burst: 12
        }
    }
});
exports.Animation.bloodD = exports.Animation["extends"]({
    constructorPlus: function (props) {
        //Nothing
    },
    prototypePlus: {
        //Add basic unit info
        name: "ZergBuilding",
        imgPos: {
            burst: {
                left: [0, 64, 128, 192, 256, 320, 384, 448, 512, 576, 640, 704],
                top: [1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320]
            }
        },
        width: 64,
        height: 50,
        //above:true,
        forever: true,
        frame: {
            burst: 12
        }
    }
});


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map