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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.Button = {
    callback: null,
    /***************Functions***************/
    reset: function () {
        Game.changeSelectedTo(Game.selectedUnit);
    },
    refreshButtons: function () {
        exports.Button.equipButtonsFor(Game.selectedUnit);
    },
    //Equip all buttons for unit
    equipButtonsFor: function (chara) {
        //Clear all buttons
        $('div.panel_Control button').removeAttr('class').removeAttr('disabled').removeAttr('style').off('click').off('mouseover').off('mouseout').html('').hide();
        //Filter out enemy
        if (chara == {} || (chara.isEnemy && chara.isEnemy()))
            return;
        //Add button press sound
        $('div.panel_Control button').on('click', function () {
            Referee.voice('button').play();
        });
        //Show buttons
        if (chara instanceof Unit) {
            $('button[num="1"]').attr('class', 'move').show();
            $('button[num="2"]').attr('class', 'stop').show();
            $('button[num="4"]').attr('class', 'patrol').show();
            $('button[num="5"]').attr('class', 'hold').show();
            if (Game.selectedUnit.hold)
                $('button.hold').css('border-color', 'red'); //Add for hold tag
            //Bind callbacks
            $('button.move').on('click', exports.Button.moveHandler);
            $('button.patrol').on('click', exports.Button.patrolHandler);
            $('button.stop').on('click', function () {
                exports.Button.stopHandler();
            });
            $('button.hold').on('click', function () {
                exports.Button.holdHandler();
            });
        }
        if (chara.attack) {
            $('button[num="3"]').attr('class', 'attack').show();
            $('button.attack').on('click', exports.Button.attackHandler);
        }
        //Add items
        if (chara.items) {
            for (var N in chara.items) {
                if (chara.items[N] != null) {
                    $('button[num="' + N + '"]').off('click').attr('class', chara.items[N].name).show();
                    if (chara.items[N].condition && !(chara.items[N].condition()))
                        $('button[num="' + N + '"]').attr('disabled', true);
                    else
                        $('button[num="' + N + '"]').removeAttr('disabled');
                    //Exceptions: need mark numbers on button
                    switch (chara.items[N].name) {
                        case 'SpiderMines':
                            $('button[num="' + N + '"]')[0].innerHTML = chara.spiderMines;
                            break;
                        case 'Scarab':
                            $('button[num="' + N + '"]')[0].innerHTML = chara.scarabNum;
                            break;
                        case 'Interceptor':
                            $('button[num="' + N + '"]')[0].innerHTML = chara.continuousAttack.count;
                            break;
                    }
                }
                else {
                    $('button[num="' + N + '"]').removeAttr('class').hide();
                }
            }
            //Bind basic callbacks
            $('button.Cancel').on('click', function () {
                //Reset menu
                exports.Button.refreshButtons();
            });
            $('button.SelectLarva').on('click', function () {
                var larvas = Game.selectedUnit.larvas;
                if (larvas) {
                    larvas = larvas.filter(function (chara) {
                        return chara.status != 'dead';
                    });
                    //If found alive larva
                    if (larvas.length) {
                        Game.unselectAll();
                        Game.addIntoAllSelected(larvas, true);
                        if (larvas[0] instanceof Gobj) {
                            Game.changeSelectedTo(larvas[0]);
                            //Sound effect
                            larvas[0].sound.selected.play();
                        }
                    }
                }
            });
            $('button.BasicMutation').on('click', function () {
                exports.Button.equipButtonsFor(exports.Button.basicZergMutations);
            });
            $('button.AdvancedMutation').on('click', function () {
                exports.Button.equipButtonsFor(exports.Button.advancedZergMutations);
            });
            $('button.BasicBuilding').on('click', function () {
                exports.Button.equipButtonsFor(exports.Button.basicTerranBuildings);
            });
            $('button.AdvancedBuilding').on('click', function () {
                exports.Button.equipButtonsFor(exports.Button.advancedTerranBuildings);
            });
            $('button.BasicStructure').on('click', function () {
                exports.Button.equipButtonsFor(exports.Button.basicProtossStructures);
            });
            $('button.AdvancedStructure').on('click', function () {
                exports.Button.equipButtonsFor(exports.Button.advancedProtossStructures);
            });
            //Upgrade callbacks
            var upgrades = [];
            for (var grade in Upgrade) {
                upgrades.push(grade);
            } //Cannot use for-in bind together
            upgrades.forEach(function (grade) {
                $('button.' + grade).on('click', function () {
                    //Filter out when occupied
                    if (Game.selectedUnit.processing)
                        return;
                    //Need time
                    if (Resource.getCost(grade) && Resource.getCost(grade).time) {
                        var owner = Game.selectedUnit;
                        var duration = Resource.getCost(grade).time;
                        //User move record
                        Multiplayer.cmds.push(JSON.stringify({
                            uids: [owner.id],
                            type: 'upgrade',
                            name: grade,
                            duration: duration,
                            team: Game.team
                        }));
                    }
                    else {
                        Multiplayer.cmds.push(JSON.stringify({
                            team: Game.team,
                            type: 'upgrade',
                            name: grade
                        }));
                    }
                });
            });
            //Magic callbacks
            var magics = [];
            for (var magic in Magic) {
                magics.push(magic);
            } //Cannot use for-in bind together
            var hasMagic = function (chara, magic) {
                if (chara.items) {
                    for (var attr in chara.items) {
                        if (chara.items[attr] && chara.items[attr].name == magic) {
                            if (chara.items[attr].condition) {
                                if (chara.items[attr].condition())
                                    return true;
                            }
                            else
                                return true;
                        }
                    }
                }
                return false;
            };
            magics.forEach(function (magic) {
                $('button.' + magic).on('click', function () {
                    var duration = Resource.getCost(magic) ? (Resource.getCost(magic).time) : 0;
                    Unit.allUnits.concat(Building.allBuildings).filter(function (chara) {
                        return (chara.team == Game.team && chara.selected && hasMagic(chara, magic));
                    }).forEach(function (chara) {
                        //For Scarab and Interceptor
                        if (duration) {
                            //Filter out when occupied
                            if (chara.processing)
                                return;
                            Multiplayer.cmds.push(JSON.stringify({
                                uids: [chara.id],
                                type: 'magic',
                                name: magic,
                                duration: duration
                            }));
                        }
                        else {
                            //Pay by credit card
                            if (Magic[magic].credit)
                                chara.creditBill = Resource.getCost(magic);
                            //Execute magic immediately
                            if (!(Magic[magic].credit || Magic[magic].needLocation)) {
                                Multiplayer.cmds.push(JSON.stringify({
                                    uids: [chara.id],
                                    type: 'magic',
                                    name: magic
                                }));
                            }
                            else {
                                //Payment: chara paypal cost
                                if (Resource.paypal.call(chara, Resource.getCost(magic))) {
                                    Magic[magic].spell.call(chara);
                                }
                            }
                        }
                    });
                });
            });
            //Unit callbacks:
            //For Zerg units
            var unitTypes = [];
            for (var unitType in Zerg) {
                unitTypes.push(unitType);
            }
            var exceptions = ['Guardian', 'Devourer'];
            unitTypes.forEach(function (unitType) {
                $('button.' + unitType).on('click', function () {
                    //Calculate duration
                    var duration = Resource.getCost(unitType).time;
                    Unit.allUnits.filter(function (chara) {
                        return (chara.team == Game.team && chara.selected && chara.name == Game.selectedUnit.name);
                    }).forEach(function (chara) {
                        Multiplayer.cmds.push(JSON.stringify({
                            uids: [chara.id],
                            type: 'unit',
                            name: unitType,
                            duration: duration,
                            evolve: 'zerg'
                        }));
                    });
                });
            });
            //For Terran and Protoss units, add InfestedTerran
            [Terran, Protoss, { InfestedTerran: Zerg.InfestedTerran }].forEach(function (Race) {
                var unitTypes = [];
                for (var unitType in Race) {
                    unitTypes.push(unitType);
                } //Cannot use for-in bind together
                var exceptions = ['Archon', 'DarkArchon'];
                unitTypes.forEach(function (unitType) {
                    //Unit type isn't in exceptions
                    if (exceptions.indexOf(unitType) == -1) {
                        $('button.' + unitType).on('click', function () {
                            //Filter out when occupied
                            if (Game.selectedUnit.processing)
                                return;
                            //Need time
                            if (Resource.getCost(unitType) && Resource.getCost(unitType).time) {
                                var owner = Game.selectedUnit;
                                var duration = Resource.getCost(unitType).time;
                                Multiplayer.cmds.push(JSON.stringify({
                                    uids: [owner.id],
                                    type: 'unit',
                                    name: unitType,
                                    duration: duration
                                }));
                            }
                        });
                    }
                    else {
                        $('button.' + unitType).on('click', function () {
                            //Calculate duration
                            var duration = Resource.getCost(unitType).time;
                            Unit.allUnits.filter(function (chara) {
                                return (chara.team == Game.team && chara.selected && chara.name == Game.selectedUnit.name);
                            }).forEach(function (chara) {
                                //Filter out when occupied
                                if (chara.processing)
                                    return;
                                Multiplayer.cmds.push(JSON.stringify({
                                    uids: [chara.id],
                                    type: 'unit',
                                    name: unitType,
                                    duration: duration,
                                    evolve: 'archon'
                                }));
                            });
                        });
                    }
                });
            });
            //Building callbacks
            var evolvedBuildings = ['Lair', 'Hive', 'SunkenColony', 'SporeColony', 'GreaterSpire',
                'ComstatStation', 'NuclearSilo', 'MachineShop', 'ControlTower', 'PhysicsLab', 'ConvertOps'];
            ['ZergBuilding', 'TerranBuilding', 'ProtossBuilding'].forEach(function (BuildType) {
                var Build = Building[BuildType];
                var buildNames = [];
                for (var buildName in Build) {
                    //Filter out noise
                    if (buildName != 'inherited' && buildName != 'super' && buildName != 'extends') {
                        buildNames.push(buildName);
                    }
                }
                buildNames.forEach(function (buildName) {
                    $('button.' + buildName).on('click', function () {
                        //Pay by credit card if not evolved building
                        if (evolvedBuildings.indexOf(buildName) == -1) {
                            Game.selectedUnit.creditBill = Resource.getCost(buildName);
                            //Payment: chara paypal cost
                            if (Resource.paypal.call(Game.selectedUnit, Resource.getCost(buildName))) {
                                Game.selectedUnit.buildName = buildName;
                                Game.selectedUnit['build' + BuildType]();
                            }
                        }
                        else {
                            Multiplayer.cmds.push(JSON.stringify({
                                uids: [Game.selectedUnit.id],
                                type: 'build',
                                name: buildName,
                                buildType: BuildType
                            }));
                        }
                    });
                });
            });
        }
        //Bind tooltip callbacks
        $('div.panel_Control button').on('mouseover', function (event) {
            var _name = this.className;
            $('div.tooltip_Box').css('right', innerWidth - event.clientX).css('bottom', innerHeight - event.clientY).show();
            $('div.tooltip_Box div.itemName')[0].innerHTML = _name;
            var cost = Resource.getCost(_name);
            if (cost) {
                $('div.cost').show();
                ['mine', 'gas', 'man', 'magic'].forEach(function (res) {
                    if (cost[res]) {
                        $('div.cost *[class*=' + res + ']').show();
                        $('div.cost span.' + res + 'Num')[0].innerHTML = cost[res];
                    }
                    else
                        $('div.cost *[class*=' + res + ']').hide();
                });
            }
        });
        $('div.panel_Control button').on('mouseout', function () {
            $('div.tooltip_Box').hide();
            $('div.tooltip_Box div.cost').hide();
            $('div.tooltip_Box div.itemName')[0].innerHTML = '';
            ['mine', 'gas', 'man', 'magic'].forEach(function (res) {
                $('div.cost span.' + res + 'Num')[0].innerHTML = '';
            });
        });
    },
    equipButtonsForReplay: function () {
        $('button[num="1"]').attr('class', 'Play').attr('disabled', true).show();
        $('button[num="2"]').attr('class', 'Pause').show();
        $('button[num="4"]').attr('class', 'SpeedUp').show();
        $('button[num="5"]').attr('class', 'SlowDown').show();
        //Bind callback for replay buttons
        $('button.Play').on('click', exports.Button.playHandler);
        $('button.Pause').on('click', exports.Button.pauseHandler);
        $('button.SpeedUp').on('click', exports.Button.speedUpHandler);
        $('button.SlowDown').on('click', exports.Button.slowDownHandler);
        //Bind tooltip callbacks
        $('div.panel_Control button').on('mouseover', function (event) {
            $('div.tooltip_Box').css('right', innerWidth - event.clientX).css('bottom', innerHeight - event.clientY).show();
            $('div.tooltip_Box div.itemName')[0].innerHTML = this.className;
        });
        $('div.panel_Control button').on('mouseout', function () {
            $('div.tooltip_Box').hide();
            $('div.tooltip_Box div.itemName')[0].innerHTML = '';
        });
    },
    /***************Buttons***************/
    basicZergMutations: {
        items: {
            '1': { name: 'Hatchery' },
            '2': { name: 'CreepColony', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && (chara.name == 'Hatchery' || chara.name == 'Lair' || chara.name == 'Hive');
                    });
                } },
            '3': { name: 'Extractor', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && (chara.name == 'Hatchery' || chara.name == 'Lair' || chara.name == 'Hive');
                    });
                } },
            '4': { name: 'SpawningPool', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && (chara.name == 'Hatchery' || chara.name == 'Lair' || chara.name == 'Hive');
                    });
                } },
            '5': { name: 'EvolutionChamber', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && (chara.name == 'Hatchery' || chara.name == 'Lair' || chara.name == 'Hive');
                    });
                } },
            '7': { name: 'HydraliskDen', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'SpawningPool';
                    });
                } },
            '9': { name: 'Cancel' }
        }
    },
    advancedZergMutations: {
        items: {
            '1': { name: 'Spire', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && (chara.name == 'Lair' || chara.name == 'Hive');
                    });
                } },
            '2': { name: 'QueenNest', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && (chara.name == 'Lair' || chara.name == 'Hive');
                    });
                } },
            '3': { name: 'NydusCanal', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && (chara.name == 'Hive');
                    });
                } },
            '4': { name: 'UltraliskCavern', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Hive';
                    });
                } },
            '5': { name: 'DefilerMound', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Hive';
                    });
                } },
            '9': { name: 'Cancel' }
        }
    },
    basicTerranBuildings: {
        items: {
            '1': { name: 'CommandCenter' },
            '2': { name: 'SupplyDepot', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'CommandCenter';
                    });
                } },
            '3': { name: 'Refinery', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'CommandCenter';
                    });
                } },
            '4': { name: 'Barracks', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'CommandCenter';
                    });
                } },
            '5': { name: 'EngineeringBay', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'CommandCenter';
                    });
                } },
            '6': { name: 'MissileTurret', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'EngineeringBay';
                    });
                } },
            '7': { name: 'Academy', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Barracks';
                    });
                } },
            '8': { name: 'Bunker', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Barracks';
                    });
                } },
            '9': { name: 'Cancel' }
        }
    },
    advancedTerranBuildings: {
        items: {
            '1': { name: 'Factory', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Barracks';
                    });
                } },
            '2': { name: 'Starport', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Factory';
                    });
                } },
            '3': { name: 'ScienceFacility', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Starport';
                    });
                } },
            '4': { name: 'Armory', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Factory';
                    });
                } },
            '9': { name: 'Cancel' }
        }
    },
    basicProtossStructures: {
        items: {
            '1': { name: 'Nexus' },
            '2': { name: 'Pylon', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Nexus';
                    });
                } },
            '3': { name: 'Assimilator', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Nexus';
                    });
                } },
            '4': { name: 'Gateway', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Nexus';
                    });
                } },
            '5': { name: 'Forge', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Nexus';
                    });
                } },
            '6': { name: 'PhotonCannon', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Forge';
                    });
                } },
            '7': { name: 'CyberneticsCore', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Gateway';
                    });
                } },
            '8': { name: 'ShieldBattery', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'Gateway';
                    });
                } },
            '9': { name: 'Cancel' }
        }
    },
    advancedProtossStructures: {
        items: {
            '1': { name: 'RoboticsFacility', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'CyberneticsCore';
                    });
                } },
            '2': { name: 'StarGate', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'CyberneticsCore';
                    });
                } },
            '3': { name: 'CitadelOfAdun', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'CyberneticsCore';
                    });
                } },
            '4': { name: 'RoboticsSupportBay', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'RoboticsFacility';
                    });
                } },
            '5': { name: 'FleetBeacon', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'StarGate';
                    });
                } },
            '6': { name: 'TemplarArchives', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'CitadelOfAdun';
                    });
                } },
            '7': { name: 'Observatory', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'RoboticsFacility';
                    });
                } },
            '8': { name: 'ArbiterTribunal', condition: function () {
                    return Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'StarGate';
                    }) && Building.allBuildings.some(function (chara) {
                        return chara.team == Game.team && chara.name == 'TemplarArchives';
                    });
                } },
            '9': { name: 'Cancel' }
        }
    },
    /***************Handlers***************/
    //Move button
    moveHandler: function () {
        if (exports.Button.callback == null) {
            exports.Button.callback = 'move';
            $('div.GameLayer').attr('status', 'button');
        }
        else {
            //Cancel handler
            $('div.GameLayer').removeAttr('status');
            exports.Button.callback = null;
        }
    },
    //Stop button
    stopHandler: function (charas) {
        if (charas == null) {
            var charas = Unit.allUnits.filter(function (chara) {
                return chara.selected && chara.team == Game.team;
            });
            //Buffer pool
            Multiplayer.cmds.push(JSON.stringify({
                uids: Multiplayer.getUIDs(charas),
                type: 'stop'
            }));
        }
        else {
            charas.forEach(function (chara) {
                if (chara.attack)
                    chara.stopAttack();
                chara.dock();
                //Interrupt old destination routing
                if (chara.destination) {
                    //Break possible dead lock
                    if (chara.destination.next)
                        chara.destination.next = undefined;
                    delete chara.destination;
                }
            });
        }
    },
    //Attack button
    attackHandler: function () {
        if (exports.Button.callback == null) {
            exports.Button.callback = 'attack';
            $('div.GameLayer').attr('status', 'button');
        }
        else {
            //Cancel handler
            $('div.GameLayer').removeAttr('status');
            exports.Button.callback = null;
        }
    },
    //Patrol button
    patrolHandler: function () {
        if (exports.Button.callback == null) {
            exports.Button.callback = 'patrol';
            $('div.GameLayer').attr('status', 'button');
        }
        else {
            //Cancel handler
            $('div.GameLayer').removeAttr('status');
            exports.Button.callback = null;
        }
    },
    //Hold button
    holdHandler: function (charas) {
        //Part A: Before get charas
        if (charas == null) {
            var charas = Unit.allUnits.filter(function (chara) {
                return chara.selected && chara.team == Game.team;
            });
            //Buffer pool
            Multiplayer.cmds.push(JSON.stringify({
                uids: Multiplayer.getUIDs(charas),
                type: 'hold'
            }));
        }
        else {
            exports.Button.stopHandler(charas);
            //Freeze all units
            charas.forEach(function (chara) {
                if (chara.hold) {
                    delete chara.AI;
                    delete chara.findNearbyTargets;
                    delete chara.hold;
                    exports.Button.refreshButtons();
                }
                else {
                    if (chara.attack) {
                        //Use the same AI as attackable building
                        chara.AI = Building.Attackable.prototypePlus.AI;
                        //Can only find target inside attack range instead of in sight
                        chara.findNearbyTargets = Building.Attackable.prototypePlus.findNearbyTargets;
                    }
                    chara.dock();
                    chara.hold = true;
                    exports.Button.refreshButtons();
                }
            });
        }
    },
    //Replay relative
    playHandler: function () {
        Game.startAnimation();
        $('button.Play').attr('disabled', true);
        $('button.Pause').attr('disabled', false);
    },
    pauseHandler: function () {
        Game.stopAnimation();
        $('button.Pause').attr('disabled', true);
        $('button.Play').attr('disabled', false);
    },
    speedUpHandler: function () {
        if (Game.replayFlag) {
            //Can speed up
            if (Game._frameInterval > 25) {
                Game._frameInterval /= 2;
                //Cannot speed up any more
                if (Game._frameInterval <= 25)
                    $('button.SpeedUp').attr('disabled', true);
                //Need play speed refresh after speed up
                Game.stopAnimation();
                exports.Button.playHandler();
            }
            //Enable SlowDown button
            $('button.SlowDown').attr('disabled', false);
        }
    },
    slowDownHandler: function () {
        if (Game.replayFlag) {
            //Can slow down
            if (Game._frameInterval < 400) {
                Game._frameInterval *= 2;
                //Cannot slow down any more
                if (Game._frameInterval >= 400)
                    $('button.SlowDown').attr('disabled', true);
                //Need play speed refresh after slow down
                Game.stopAnimation();
                exports.Button.playHandler();
            }
            //Enable SpeedUp button
            $('button.SpeedUp').attr('disabled', false);
        }
    },
    //Execute callback
    execute: function (event) {
        //Finish part II
        switch (exports.Button.callback) {
            case 'move':
                mouseController.rightClick(event);
                break;
            case 'attack':
                mouseController.rightClick(event, true, 'attack');
                break;
            case 'patrol':
                mouseController.rightClick(event, true, 'patrol');
                break;
            default:
                if (typeof (exports.Button.callback) == 'function') {
                    //Mouse at (clickX,clickY)
                    var offset = $('#fogCanvas').offset();
                    var clickX = event.pageX - offset.left;
                    var clickY = event.pageY - offset.top;
                    var location = { x: clickX + Map.offsetX, y: clickY + Map.offsetY };
                    //Show right click cursor
                    new Burst.RightClickCursor(location);
                    //Call back with location info
                    //Farmer build buildings
                    if (exports.Button.callback.farmer) {
                        Multiplayer.cmds.push(JSON.stringify({
                            uids: [exports.Button.callback.farmer.id],
                            type: 'build',
                            name: exports.Button.callback.farmer.buildName,
                            buildType: exports.Button.callback.buildType,
                            pos: location
                        }));
                    }
                    else {
                        var magicName = '';
                        for (var magic in Magic) {
                            if (Magic[magic].spell == exports.Button.callback)
                                magicName = magic;
                        }
                        Multiplayer.cmds.push(JSON.stringify({
                            uids: [exports.Button.callback.owner.id],
                            type: 'magic',
                            name: magicName,
                            pos: location,
                            creditBill: exports.Button.callback.owner.creditBill
                        }));
                    }
                }
        }
        $('div.GameLayer').removeAttr('status');
        exports.Button.callback = null;
    }
};


/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.Upgrade = {
    //Terran
    UpgradeInfantryWeapons: {
        name: "UpgradeInfantryWeapons",
        cost: {
            mine: [100, 175, 250],
            gas: [100, 175, 250],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Terran.Marine.prototype.damage[team] += 1;
            Terran.Firebat.prototype.damage[team] += 2;
            Terran.Ghost.prototype.damage[team] += 1;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.TerranBuilding.EngineeringBay.prototype.items[1];
        }
    },
    UpgradeInfantryArmors: {
        name: "UpgradeInfantryArmors",
        cost: {
            mine: [100, 175, 250],
            gas: [100, 175, 250],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Terran.SCV.prototype.armor[team] += 1;
            Terran.Marine.prototype.armor[team] += 1;
            Terran.Firebat.prototype.armor[team] += 1;
            Terran.Ghost.prototype.armor[team] += 1;
            Terran.Medic.prototype.armor[team] += 1;
            Terran.Civilian.prototype.armor[team] += 1;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.TerranBuilding.EngineeringBay.prototype.items[2];
        }
    },
    ResearchU238Shells: {
        name: "ResearchU238Shells",
        cost: {
            mine: 150,
            gas: 150,
            time: 1000
        },
        effect: function (team) {
            Terran.Marine.prototype.attackRange[team] = 175;
            delete Building.TerranBuilding.Academy.prototype.items[1];
        }
    },
    ResearchStimPackTech: {
        name: "ResearchStimPackTech",
        cost: {
            mine: 100,
            gas: 100,
            time: 800
        },
        effect: function () {
            Magic.StimPacks.enabled = true;
            delete Building.TerranBuilding.Academy.prototype.items[2];
        }
    },
    ResearchRestoration: {
        name: "ResearchRestoration",
        cost: {
            mine: 100,
            gas: 100,
            time: 800
        },
        effect: function () {
            Magic.Restoration.enabled = true;
            delete Building.TerranBuilding.Academy.prototype.items[4];
        }
    },
    ResearchOpticalFlare: {
        name: "ResearchOpticalFlare",
        cost: {
            mine: 100,
            gas: 100,
            time: 1200
        },
        effect: function () {
            Magic.OpticalFlare.enabled = true;
            delete Building.TerranBuilding.Academy.prototype.items[5];
        }
    },
    ResearchCaduceusReactor: {
        name: "ResearchCaduceusReactor",
        cost: {
            mine: 150,
            gas: 150,
            time: 1660
        },
        effect: function (team) {
            Terran.Medic.prototype.MP[team] = 250;
            delete Building.TerranBuilding.Academy.prototype.items[6];
        }
    },
    ResearchIonThrusters: {
        name: "ResearchIonThrusters",
        cost: {
            mine: 100,
            gas: 100,
            time: 1000
        },
        effect: function (team) {
            Terran.Vulture.prototype.speed[team] = 20;
            delete Building.TerranBuilding.MachineShop.prototype.items[1];
        }
    },
    ResearchSpiderMines: {
        name: "ResearchSpiderMines",
        cost: {
            mine: 100,
            gas: 100,
            time: 800
        },
        effect: function () {
            Magic.SpiderMines.enabled = true;
            delete Building.TerranBuilding.MachineShop.prototype.items[2];
        }
    },
    ResearchSiegeTech: {
        name: "ResearchSiegeTech",
        cost: {
            mine: 150,
            gas: 150,
            time: 800
        },
        effect: function () {
            Magic.SeigeMode.enabled = true;
            delete Building.TerranBuilding.MachineShop.prototype.items[3];
        }
    },
    ResearchCharonBoosters: {
        name: "ResearchCharonBoosters",
        cost: {
            mine: 150,
            gas: 150,
            time: 1330
        },
        effect: function (team) {
            Terran.Goliath.prototype.attackMode.flying.attackRange[team] = 300;
            delete Building.TerranBuilding.MachineShop.prototype.items[4];
        }
    },
    ResearchCloakingField: {
        name: "ResearchCloakingField",
        cost: {
            mine: 150,
            gas: 150,
            time: 1000
        },
        effect: function () {
            Magic.Cloak.enabled = true;
            delete Building.TerranBuilding.ControlTower.prototype.items[1];
        }
    },
    ResearchApolloReactor: {
        name: "ResearchApolloReactor",
        cost: {
            mine: 200,
            gas: 200,
            time: 1660
        },
        effect: function (team) {
            Terran.Wraith.prototype.MP[team] = 250;
            delete Building.TerranBuilding.ControlTower.prototype.items[2];
        }
    },
    ResearchEMPShockwaves: {
        name: "ResearchEMPShockwaves",
        cost: {
            mine: 200,
            gas: 200,
            time: 1200
        },
        effect: function () {
            Magic.EMPShockwave.enabled = true;
            delete Building.TerranBuilding.ScienceFacility.prototype.items[1];
        }
    },
    ResearchIrradiate: {
        name: "ResearchIrradiate",
        cost: {
            mine: 150,
            gas: 150,
            time: 800
        },
        effect: function () {
            Magic.Irradiate.enabled = true;
            delete Building.TerranBuilding.ScienceFacility.prototype.items[2];
        }
    },
    ResearchTitanReactor: {
        name: "ResearchTitanReactor",
        cost: {
            mine: 150,
            gas: 150,
            time: 1660
        },
        effect: function (team) {
            Terran.Vessel.prototype.MP[team] = 250;
            delete Building.TerranBuilding.ScienceFacility.prototype.items[3];
        }
    },
    ResearchLockdown: {
        name: "ResearchLockdown",
        cost: {
            mine: 200,
            gas: 200,
            time: 1000
        },
        effect: function () {
            Magic.Lockdown.enabled = true;
            delete Building.TerranBuilding.ConvertOps.prototype.items[1];
        }
    },
    ResearchPersonalCloaking: {
        name: "ResearchPersonalCloaking",
        cost: {
            mine: 100,
            gas: 100,
            time: 800
        },
        effect: function () {
            Magic.PersonalCloak.enabled = true;
            delete Building.TerranBuilding.ConvertOps.prototype.items[2];
        }
    },
    ResearchOcularImplants: {
        name: "ResearchOcularImplants",
        cost: {
            mine: 100,
            gas: 100,
            time: 1660
        },
        effect: function (team) {
            Terran.Ghost.prototype.sight[team] = 385;
            delete Building.TerranBuilding.ConvertOps.prototype.items[4];
        }
    },
    ResearchMoebiusReactor: {
        name: "ResearchMoebiusReactor",
        cost: {
            mine: 150,
            gas: 150,
            time: 1660
        },
        effect: function (team) {
            Terran.Ghost.prototype.MP[team] = 250;
            delete Building.TerranBuilding.ConvertOps.prototype.items[5];
        }
    },
    ResearchYamatoGun: {
        name: "ResearchYamatoGun",
        cost: {
            mine: 200,
            gas: 200,
            time: 1200
        },
        effect: function () {
            Magic.Yamato.enabled = true;
            delete Building.TerranBuilding.PhysicsLab.prototype.items[1];
        }
    },
    ResearchColossusReactor: {
        name: "ResearchColossusReactor",
        cost: {
            mine: 150,
            gas: 150,
            time: 1600
        },
        effect: function (team) {
            Terran.BattleCruiser.prototype.MP[team] = 250;
            delete Building.TerranBuilding.PhysicsLab.prototype.items[2];
        }
    },
    UpgradeVehicleWeapons: {
        name: "UpgradeVehicleWeapons",
        cost: {
            mine: [100, 175, 250],
            gas: [100, 175, 250],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Terran.Vulture.prototype.damage[team] += 2;
            Terran.Tank.prototype.damage[team] += 3;
            Terran.Goliath.prototype.attackMode.ground.damage[team] += 2;
            Terran.Goliath.prototype.attackMode.flying.damage[team] += 4;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.TerranBuilding.Armory.prototype.items[1];
        }
    },
    UpgradeShipWeapons: {
        name: "UpgradeShipWeapons",
        cost: {
            mine: [100, 150, 200],
            gas: [100, 150, 200],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Terran.Wraith.prototype.attackMode.ground.damage[team] += 1;
            Terran.Wraith.prototype.attackMode.flying.damage[team] += 2;
            Terran.BattleCruiser.prototype.damage[team] += 3;
            Terran.Valkyrie.prototype.damage[team] += 1;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.TerranBuilding.Armory.prototype.items[2];
        }
    },
    UpgradeVehicleArmors: {
        name: "UpgradeVehicleArmors",
        cost: {
            mine: [100, 175, 250],
            gas: [100, 175, 250],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Terran.Vulture.prototype.armor[team] += 1;
            Terran.Tank.prototype.armor[team] += 1;
            Terran.Goliath.prototype.armor[team] += 1;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.TerranBuilding.Armory.prototype.items[4];
        }
    },
    UpgradeShipArmors: {
        name: "UpgradeShipArmors",
        cost: {
            mine: [150, 225, 300],
            gas: [150, 225, 300],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Terran.Wraith.prototype.armor[team] += 1;
            Terran.Dropship.prototype.armor[team] += 1;
            Terran.BattleCruiser.prototype.armor[team] += 1;
            Terran.Vessel.prototype.armor[team] += 1;
            Terran.Valkyrie.prototype.armor[team] += 1;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.TerranBuilding.Armory.prototype.items[5];
        }
    },
    //Zerg
    EvolveBurrow: {
        name: "EvolveBurrow",
        cost: {
            mine: 100,
            gas: 100,
            time: 800
        },
        effect: function () {
            Magic.Burrow.enabled = Magic.Unburrow.enabled = true;
            delete Building.ZergBuilding.Hatchery.prototype.items[3];
            delete Building.ZergBuilding.Lair.prototype.items[3];
            delete Building.ZergBuilding.Hive.prototype.items[3];
        }
    },
    EvolveVentralSacs: {
        name: "EvolveVentralSacs",
        cost: {
            mine: 200,
            gas: 200,
            time: 1600
        },
        effect: function () {
            Magic.Load.enabled = Magic.UnloadAll.enabled = true;
            delete Building.ZergBuilding.Lair.prototype.items[4];
            delete Building.ZergBuilding.Hive.prototype.items[4];
        }
    },
    EvolveAntennas: {
        name: "EvolveAntennas",
        cost: {
            mine: 150,
            gas: 150,
            time: 1330
        },
        effect: function (team) {
            Zerg.Overlord.prototype.sight[team] = 385;
            delete Building.ZergBuilding.Lair.prototype.items[5];
            delete Building.ZergBuilding.Hive.prototype.items[5];
        }
    },
    EvolvePneumatizedCarapace: {
        name: "EvolvePneumatizedCarapace",
        cost: {
            mine: 150,
            gas: 150,
            time: 1330
        },
        effect: function (team) {
            Zerg.Overlord.prototype.speed[team] = 8;
            delete Building.ZergBuilding.Lair.prototype.items[6];
            delete Building.ZergBuilding.Hive.prototype.items[6];
        }
    },
    EvolveMetabolicBoost: {
        name: "EvolveMetabolicBoost",
        cost: {
            mine: 100,
            gas: 100,
            time: 1000
        },
        effect: function (team) {
            Zerg.Zergling.prototype.speed[team] = 18;
            delete Building.ZergBuilding.SpawningPool.prototype.items[1];
        }
    },
    EvolveAdrenalGlands: {
        name: "EvolveAdrenalGlands",
        cost: {
            mine: 200,
            gas: 200,
            time: 1000
        },
        effect: function (team) {
            Zerg.Zergling.prototype.attackInterval[team] = 600;
            delete Building.ZergBuilding.SpawningPool.prototype.items[2];
        }
    },
    UpgradeMeleeAttacks: {
        name: "UpgradeMeleeAttacks",
        cost: {
            mine: [100, 150, 200],
            gas: [100, 150, 200],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Zerg.Zergling.prototype.damage[team] += 1;
            Zerg.Ultralisk.prototype.damage[team] += 3;
            Zerg.Broodling.prototype.damage[team] += 1;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.ZergBuilding.EvolutionChamber.prototype.items[1];
        }
    },
    UpgradeMissileAttacks: {
        name: "UpgradeMissileAttacks",
        cost: {
            mine: [100, 150, 200],
            gas: [100, 150, 200],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Zerg.Hydralisk.prototype.damage[team] += 1;
            Zerg.Lurker.prototype.damage[team] += 2;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.ZergBuilding.EvolutionChamber.prototype.items[2];
        }
    },
    EvolveCarapace: {
        name: "EvolveCarapace",
        cost: {
            mine: [150, 225, 300],
            gas: [150, 225, 300],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Zerg.Drone.prototype.armor[team] += 1;
            Zerg.Zergling.prototype.armor[team] += 1;
            Zerg.Hydralisk.prototype.armor[team] += 1;
            Zerg.Lurker.prototype.armor[team] += 1;
            Zerg.Ultralisk.prototype.armor[team] += 1;
            Zerg.Defiler.prototype.armor[team] += 1;
            Zerg.Broodling.prototype.armor[team] += 1;
            Zerg.InfestedTerran.prototype.armor[team] += 1;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.ZergBuilding.EvolutionChamber.prototype.items[3];
        }
    },
    EvolveMuscularAugments: {
        name: "EvolveMuscularAugments",
        cost: {
            mine: 100,
            gas: 100,
            time: 1000
        },
        effect: function (team) {
            Zerg.Hydralisk.prototype.speed[team] = 13;
            delete Building.ZergBuilding.HydraliskDen.prototype.items[1];
        }
    },
    EvolveGroovedSpines: {
        name: "EvolveGroovedSpines",
        cost: {
            mine: 150,
            gas: 150,
            time: 1000
        },
        effect: function (team) {
            Zerg.Hydralisk.prototype.attackRange[team] = 175;
            delete Building.ZergBuilding.HydraliskDen.prototype.items[2];
        }
    },
    EvolveLurkerAspect: {
        name: "EvolveLurkerAspect",
        cost: {
            mine: 125,
            gas: 125,
            time: 1200
        },
        effect: function () {
            Magic.Lurker.enabled = true;
            delete Building.ZergBuilding.HydraliskDen.prototype.items[4];
        }
    },
    UpgradeFlyerAttacks: {
        name: "UpgradeFlyerAttacks",
        cost: {
            mine: [100, 175, 250],
            gas: [100, 175, 250],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Zerg.Mutalisk.prototype.damage[team] += 1;
            Zerg.Guardian.prototype.damage[team] += 2;
            Zerg.Devourer.prototype.damage[team] += 2;
            this.level[team]++;
            if (this.level[Game.team] >= 3) {
                delete Building.ZergBuilding.Spire.prototype.items[1];
                delete Building.ZergBuilding.GreaterSpire.prototype.items[1];
            }
        }
    },
    UpgradeFlyerCarapace: {
        name: "UpgradeFlyerCarapace",
        cost: {
            mine: [150, 225, 300],
            gas: [150, 225, 300],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Zerg.Overlord.prototype.armor[team] += 1;
            Zerg.Mutalisk.prototype.armor[team] += 1;
            Zerg.Guardian.prototype.armor[team] += 1;
            Zerg.Devourer.prototype.armor[team] += 1;
            Zerg.Scourge.prototype.armor[team] += 1;
            Zerg.Queen.prototype.armor[team] += 1;
            this.level[team]++;
            if (this.level[Game.team] >= 3) {
                delete Building.ZergBuilding.Spire.prototype.items[2];
                delete Building.ZergBuilding.GreaterSpire.prototype.items[2];
            }
        }
    },
    EvolveSpawnBroodling: {
        name: "EvolveSpawnBroodling",
        cost: {
            mine: 200,
            gas: 200,
            time: 800
        },
        effect: function () {
            Magic.SpawnBroodlings.enabled = true;
            delete Building.ZergBuilding.QueenNest.prototype.items[1];
        }
    },
    EvolveEnsnare: {
        name: "EvolveEnsnare",
        cost: {
            mine: 100,
            gas: 100,
            time: 800
        },
        effect: function () {
            Magic.Ensnare.enabled = true;
            delete Building.ZergBuilding.QueenNest.prototype.items[2];
        }
    },
    EvolveGameteMeiosis: {
        name: "EvolveGameteMeiosis",
        cost: {
            mine: 150,
            gas: 150,
            time: 1660
        },
        effect: function (team) {
            Zerg.Queen.prototype.MP[team] = 250;
            delete Building.ZergBuilding.QueenNest.prototype.items[3];
        }
    },
    EvolveAnabolicSynthesis: {
        name: "EvolveAnabolicSynthesis",
        cost: {
            mine: 200,
            gas: 200,
            time: 1330
        },
        effect: function (team) {
            Zerg.Ultralisk.prototype.speed[team] = 18;
            delete Building.ZergBuilding.UltraliskCavern.prototype.items[1];
        }
    },
    EvolveChitinousPlating: {
        name: "EvolveChitinousPlating",
        cost: {
            mine: 150,
            gas: 150,
            time: 1330
        },
        effect: function (team) {
            Zerg.Ultralisk.prototype.armor[team] += 2;
            delete Building.ZergBuilding.UltraliskCavern.prototype.items[2];
        }
    },
    EvolvePlague: {
        name: "EvolvePlague",
        cost: {
            mine: 200,
            gas: 200,
            time: 1000
        },
        effect: function () {
            Magic.Plague.enabled = true;
            delete Building.ZergBuilding.DefilerMound.prototype.items[1];
        }
    },
    EvolveConsume: {
        name: "EvolveConsume",
        cost: {
            mine: 100,
            gas: 100,
            time: 1000
        },
        effect: function () {
            Magic.Consume.enabled = true;
            delete Building.ZergBuilding.DefilerMound.prototype.items[2];
        }
    },
    EvolveMetasynapticNode: {
        name: "EvolveMetasynapticNode",
        cost: {
            mine: 150,
            gas: 150,
            time: 1660
        },
        effect: function (team) {
            Zerg.Defiler.prototype.MP[team] = 250;
            delete Building.ZergBuilding.DefilerMound.prototype.items[3];
        }
    },
    //Protoss
    UpgradeGroundWeapons: {
        name: "UpgradeGroundWeapons",
        cost: {
            mine: [100, 150, 200],
            gas: [100, 150, 200],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Protoss.Zealot.prototype.damage[team] += 2;
            Protoss.Dragoon.prototype.damage[team] += 2;
            Protoss.Templar.prototype.damage[team] += 1;
            Protoss.DarkTemplar.prototype.damage[team] += 3;
            Protoss.Archon.prototype.damage[team] += 3;
            //New RPG level
            Hero.DevilHunter.prototype.damage[team] += 2;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.ProtossBuilding.Forge.prototype.items[1];
        }
    },
    UpgradeGroundArmor: {
        name: "UpgradeGroundArmor",
        cost: {
            mine: [100, 175, 250],
            gas: [100, 175, 250],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Protoss.Probe.prototype.armor[team] += 1;
            Protoss.Zealot.prototype.armor[team] += 1;
            Protoss.Dragoon.prototype.armor[team] += 1;
            Protoss.Templar.prototype.armor[team] += 1;
            Protoss.DarkTemplar.prototype.armor[team] += 1;
            Protoss.Archon.prototype.armor[team] += 1;
            Protoss.DarkArchon.prototype.armor[team] += 1;
            Protoss.Reaver.prototype.armor[team] += 1;
            //New RPG level
            Hero.DevilHunter.prototype.armor[team] += 2;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.ProtossBuilding.Forge.prototype.items[2];
        }
    },
    UpgradePlasmaShields: {
        name: "UpgradePlasmaShields",
        cost: {
            mine: [200, 300, 400],
            gas: [200, 300, 400],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            for (var unitType in Protoss) {
                Protoss[unitType].prototype.plasma[team] += 1;
            }
            //New RPG level
            Hero.DevilHunter.prototype.plasma[team] += 2;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.ProtossBuilding.Forge.prototype.items[3];
        }
    },
    UpgradeAirWeapons: {
        name: "UpgradeAirWeapons",
        cost: {
            mine: [100, 175, 250],
            gas: [100, 175, 250],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Protoss.Scout.prototype.attackMode.ground.damage[team] += 1;
            Protoss.Scout.prototype.attackMode.flying.damage[team] += 2;
            Protoss.Carrier.prototype.damage[team] += 1;
            Protoss.Arbiter.prototype.damage[team] += 1;
            Protoss.Corsair.prototype.damage[team] += 1;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.ProtossBuilding.CyberneticsCore.prototype.items[1];
        }
    },
    UpgradeAirArmor: {
        name: "UpgradeAirArmor",
        cost: {
            mine: [150, 225, 300],
            gas: [150, 225, 300],
            time: [2660, 2980, 3300]
        },
        level: 0,
        effect: function (team) {
            Protoss.Scout.prototype.armor[team] += 1;
            Protoss.Carrier.prototype.armor[team] += 1;
            Protoss.Arbiter.prototype.armor[team] += 1;
            Protoss.Corsair.prototype.armor[team] += 1;
            this.level[team]++;
            if (this.level[Game.team] >= 3)
                delete Building.ProtossBuilding.CyberneticsCore.prototype.items[2];
        }
    },
    DevelopSingularityCharge: {
        name: "DevelopSingularityCharge",
        cost: {
            mine: 150,
            gas: 150,
            time: 1660
        },
        effect: function (team) {
            Protoss.Dragoon.prototype.attackRange[team] = 210;
            delete Building.ProtossBuilding.CyberneticsCore.prototype.items[3];
        }
    },
    DevelopLegEnhancements: {
        name: "DevelopLegEnhancements",
        cost: {
            mine: 150,
            gas: 150,
            time: 1330
        },
        effect: function (team) {
            Protoss.Zealot.prototype.speed[team] = 14;
            delete Building.ProtossBuilding.CitadelOfAdun.prototype.items[1];
        }
    },
    UpgradeScarabDamage: {
        name: "UpgradeScarabDamage",
        cost: {
            mine: 200,
            gas: 200,
            time: 1660
        },
        effect: function (team) {
            Protoss.Reaver.prototype.damage[team] = 125;
            delete Building.ProtossBuilding.RoboticsSupportBay.prototype.items[1];
        }
    },
    IncreaseReaverCapacity: {
        name: "IncreaseReaverCapacity",
        cost: {
            mine: 200,
            gas: 200,
            time: 1660
        },
        effect: function (team) {
            Protoss.Reaver.prototype.scarabCapacity[team] = 10;
            delete Building.ProtossBuilding.RoboticsSupportBay.prototype.items[2];
        }
    },
    DevelopGraviticDrive: {
        name: "DevelopGraviticDrive",
        cost: {
            mine: 200,
            gas: 200,
            time: 1660
        },
        effect: function (team) {
            Protoss.Shuttle.prototype.speed[team] = 16;
            delete Building.ProtossBuilding.RoboticsSupportBay.prototype.items[3];
        }
    },
    DevelopApialSensors: {
        name: "DevelopApialSensors",
        cost: {
            mine: 100,
            gas: 100,
            time: 1660
        },
        effect: function (team) {
            Protoss.Scout.prototype.sight[team] = 350;
            delete Building.ProtossBuilding.FleetBeacon.prototype.items[1];
        }
    },
    DevelopGraviticThrusters: {
        name: "DevelopGraviticThrusters",
        cost: {
            mine: 200,
            gas: 200,
            time: 1660
        },
        effect: function (team) {
            Protoss.Scout.prototype.speed[team] = 16;
            delete Building.ProtossBuilding.FleetBeacon.prototype.items[2];
        }
    },
    IncreaseCarrierCapacity: {
        name: "IncreaseCarrierCapacity",
        cost: {
            mine: 100,
            gas: 100,
            time: 1000
        },
        effect: function (team) {
            //Protoss.Carrier.prototype.continuousAttack.count[team]=8;
            Protoss.Carrier.prototype.interceptorCapacity[team] = 8;
            delete Building.ProtossBuilding.FleetBeacon.prototype.items[3];
        }
    },
    DevelopDistruptionWeb: {
        name: "DevelopDistruptionWeb",
        cost: {
            mine: 200,
            gas: 200,
            time: 800
        },
        effect: function () {
            Magic.DisruptionWeb.enabled = true;
            delete Building.ProtossBuilding.FleetBeacon.prototype.items[4];
        }
    },
    DevelopArgusJewel: {
        name: "DevelopArgusJewel",
        cost: {
            mine: 100,
            gas: 100,
            time: 1660
        },
        effect: function (team) {
            Protoss.Corsair.prototype.MP[team] = 250;
            delete Building.ProtossBuilding.FleetBeacon.prototype.items[5];
        }
    },
    DevelopPsionicStorm: {
        name: "DevelopPsionicStorm",
        cost: {
            mine: 200,
            gas: 200,
            time: 1200
        },
        effect: function () {
            Magic.PsionicStorm.enabled = true;
            delete Building.ProtossBuilding.TemplarArchives.prototype.items[1];
        }
    },
    DevelopHallucination: {
        name: "DevelopHallucination",
        cost: {
            mine: 150,
            gas: 150,
            time: 800
        },
        effect: function () {
            Magic.Hallucination.enabled = true;
            delete Building.ProtossBuilding.TemplarArchives.prototype.items[2];
        }
    },
    DevelopKhaydarinAmulet: {
        name: "DevelopKhaydarinAmulet",
        cost: {
            mine: 150,
            gas: 150,
            time: 1660
        },
        effect: function (team) {
            Protoss.Templar.prototype.MP[team] = 250;
            delete Building.ProtossBuilding.TemplarArchives.prototype.items[3];
        }
    },
    DevelopMindControl: {
        name: "DevelopMindControl",
        cost: {
            mine: 200,
            gas: 200,
            time: 1200
        },
        effect: function () {
            Magic.MindControl.enabled = true;
            delete Building.ProtossBuilding.TemplarArchives.prototype.items[4];
        }
    },
    DevelopMaelStorm: {
        name: "DevelopMaelStorm",
        cost: {
            mine: 100,
            gas: 100,
            time: 1000
        },
        effect: function () {
            Magic.MaelStorm.enabled = true;
            delete Building.ProtossBuilding.TemplarArchives.prototype.items[5];
        }
    },
    DevelopArgusTalisman: {
        name: "DevelopArgusTalisman",
        cost: {
            mine: 150,
            gas: 150,
            time: 1660
        },
        effect: function (team) {
            Protoss.DarkArchon.prototype.MP[team] = 250;
            delete Building.ProtossBuilding.TemplarArchives.prototype.items[6];
        }
    },
    DevelopGraviticBooster: {
        name: "DevelopGraviticBooster",
        cost: {
            mine: 150,
            gas: 150,
            time: 1330
        },
        effect: function (team) {
            Protoss.Observer.prototype.speed[team] = 12;
            delete Building.ProtossBuilding.Observatory.prototype.items[1];
        }
    },
    DevelopSensorArray: {
        name: "DevelopSensorArray",
        cost: {
            mine: 150,
            gas: 150,
            time: 1330
        },
        effect: function (team) {
            Protoss.Observer.prototype.sight[team] = 385;
            delete Building.ProtossBuilding.Observatory.prototype.items[2];
        }
    },
    DevelopRecall: {
        name: "DevelopRecall",
        cost: {
            mine: 150,
            gas: 150,
            time: 1200
        },
        effect: function () {
            Magic.Recall.enabled = true;
            delete Building.ProtossBuilding.ArbiterTribunal.prototype.items[1];
        }
    },
    DevelopStasisField: {
        name: "DevelopStasisField",
        cost: {
            mine: 150,
            gas: 150,
            time: 1000
        },
        effect: function () {
            Magic.StasisField.enabled = true;
            delete Building.ProtossBuilding.ArbiterTribunal.prototype.items[2];
        }
    },
    DevelopKhaydarinCore: {
        name: "DevelopKhaydarinCore",
        cost: {
            mine: 150,
            gas: 150,
            time: 1660
        },
        effect: function (team) {
            Protoss.Arbiter.prototype.MP[team] = 250;
            delete Building.ProtossBuilding.ArbiterTribunal.prototype.items[3];
        }
    },
    /********RPG level: Tower Defense********/
    UpgradeSunkenDamage: {
        name: "UpgradeSunkenDamage",
        cost: {
            mine: [50, 75, 100, 125, 150],
            time: [300, 300, 300, 300, 300]
        },
        level: 0,
        effect: function (team) {
            //RPG level lock
            if (Game.level == 11 || Game.replayLevel == 11) {
                Building.ZergBuilding.SunkenColony.prototype.damage += 5;
                this.level[team]++;
                if (this.level[Game.team] >= 5)
                    delete Building.ProtossBuilding.TeleportPoint.prototype.items[1];
            }
        }
    },
    EnlargeSunkenArea: {
        name: "UpgradeSunkenArea",
        cost: {
            mine: [100, 125, 150, 175, 200],
            time: [300, 400, 500, 600, 700]
        },
        level: 0,
        effect: function (team) {
            //RPG level lock
            if (Game.level == 11 || Game.replayLevel == 11) {
                Building.ZergBuilding.SunkenColony.prototype.AOE.radius += 50;
                this.level[team]++;
                if (this.level[Game.team] >= 5)
                    delete Building.ProtossBuilding.TeleportPoint.prototype.items[2];
            }
        }
    },
    UpgradeSporeDamage: {
        name: "UpgradeSporeDamage",
        cost: {
            mine: [50, 60, 70, 80, 90],
            time: [300, 300, 300, 300, 300]
        },
        level: 0,
        effect: function (team) {
            //RPG level lock
            if (Game.level == 11 || Game.replayLevel == 11) {
                Building.ZergBuilding.SporeColony.prototype.damage += 3;
                this.level[team]++;
                if (this.level[Game.team] >= 5)
                    delete Building.ProtossBuilding.TeleportPoint.prototype.items[3];
            }
        }
    },
    EnlargeSporeChain: {
        name: "EnlargeSporeChain",
        cost: {
            mine: [80, 90, 100, 110, 120],
            time: [300, 400, 500, 600, 700]
        },
        level: 0,
        effect: function (team) {
            //RPG level lock
            if (Game.level == 11 || Game.replayLevel == 11) {
                Bullets.Spore.prototype.traceTimes += 1;
                Bullets.Spore.prototype.traceRadius += 50;
                this.level[team]++;
                if (this.level[Game.team] >= 5)
                    delete Building.ProtossBuilding.TeleportPoint.prototype.items[4];
            }
        }
    },
    UpgradeMissileDamage: {
        name: "UpgradeMissileDamage",
        cost: {
            mine: [50, 65, 80, 95, 110],
            time: [300, 300, 300, 300, 300]
        },
        level: 0,
        effect: function (team) {
            //RPG level lock
            if (Game.level == 11 || Game.replayLevel == 11) {
                Building.TerranBuilding.MissileTurret.prototype.damage += 4;
                this.level[team]++;
                if (this.level[Game.team] >= 5)
                    delete Building.ProtossBuilding.TeleportPoint.prototype.items[5];
            }
        }
    },
    IncreaseMissileCount: {
        name: "IncreaseMissileCount",
        cost: {
            mine: [80, 95, 110, 125, 140],
            time: [300, 300, 300, 300, 300]
        },
        level: 0,
        effect: function (team) {
            //RPG level lock
            if (Game.level == 11 || Game.replayLevel == 11) {
                Building.TerranBuilding.MissileTurret.prototype.AOE.radius += 30;
                Building.TerranBuilding.MissileTurret.prototype.AOE.count++;
                this.level[team]++;
                if (this.level[Game.team] >= 5)
                    delete Building.ProtossBuilding.TeleportPoint.prototype.items[6];
            }
        }
    },
    UpgradePhotonCannonDamage: {
        name: "UpgradePhotonCannonDamage",
        cost: {
            mine: [50, 70, 90, 110, 130],
            time: [300, 300, 300, 300, 300]
        },
        level: 0,
        effect: function (team) {
            //RPG level lock
            if (Game.level == 11 || Game.replayLevel == 11) {
                Building.ProtossBuilding.PhotonCannon.prototype.damage += 4;
                this.level[team]++;
                if (this.level[Game.team] >= 5)
                    delete Building.ProtossBuilding.TeleportPoint.prototype.items[7];
            }
        }
    },
    IncreasePhotonCannonCount: {
        name: "IncreasePhotonCannonCount",
        cost: {
            mine: [80, 95, 110, 125, 140],
            time: [300, 300, 300, 300, 300]
        },
        level: 0,
        effect: function (team) {
            //RPG level lock
            if (Game.level == 11 || Game.replayLevel == 11) {
                Building.ProtossBuilding.PhotonCannon.prototype.continuousAttack.count++;
                this.level[team]++;
                if (this.level[Game.team] >= 5)
                    delete Building.ProtossBuilding.TeleportPoint.prototype.items[8];
            }
        }
    }
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.keyController = {
    shift: false,
    ctrl: false,
    disable: false,
    start: function () {
        //Keyboard settings
        window.onkeydown = function (event) {
            //Will not switch page by Ctrl+N,cannot debug
            //event.preventDefault();
            //Sometimes need to disable shortcut key
            if (exports.keyController.disable && event.keyCode != 13)
                return;
            switch (event.keyCode) {
                //Press SHIFT down
                case 16:
                    exports.keyController.shift = true;
                    break;
                //Press CTRL down
                case 17:
                    exports.keyController.ctrl = true;
                    break;
                //Press number
                case 48:
                case 49:
                case 50:
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                    var teamNum = String.fromCharCode(event.keyCode);
                    //Building team
                    if (exports.keyController.ctrl) {
                        Game.addSelectedIntoTeam(teamNum);
                    }
                    else {
                        Game.callTeam(teamNum);
                    }
                    break;
                //Move map
                case 37:
                    Map.needRefresh = "LEFT";
                    break;
                case 38:
                    Map.needRefresh = "TOP";
                    break;
                case 39:
                    Map.needRefresh = "RIGHT";
                    break;
                case 40:
                    Map.needRefresh = "BOTTOM";
                    break;
                //Replay speed control
                case 107:
                case 33:
                    //Speed up + or pageUp
                    Button.speedUpHandler();
                    break;
                case 109:
                case 34:
                    //Slow down - or pageDown
                    Button.slowDownHandler();
                    break;
                //Shortcut keys:
                //Press M
                case 77:
                    if ($.makeArray($('div.panel_Control button')).some(function (btn) {
                        return btn.className == 'move';
                    }))
                        Button.moveHandler();
                    break;
                //Press S
                case 83:
                    if ($.makeArray($('div.panel_Control button')).some(function (btn) {
                        return btn.className == 'stop';
                    }))
                        Button.stopHandler();
                    break;
                //Press A
                case 65:
                    if ($.makeArray($('div.panel_Control button')).some(function (btn) {
                        return btn.className == 'attack';
                    }))
                        Button.attackHandler();
                    break;
                //Press P
                case 80:
                    if ($.makeArray($('div.panel_Control button')).some(function (btn) {
                        return btn.className == 'patrol';
                    }))
                        Button.patrolHandler();
                    break;
                //Press H
                case 72:
                    if ($.makeArray($('div.panel_Control button')).some(function (btn) {
                        return btn.className == 'hold';
                    }))
                        Button.holdHandler();
                    break;
                //Press ENTER
                case 13:
                    Cheat.handler();
                    break;
            }
        };
        window.onkeyup = function (event) {
            switch (event.keyCode) {
                //Press SHIFT up
                case 16:
                    exports.keyController.shift = false;
                    break;
                //Press CTRL up
                case 17:
                    exports.keyController.ctrl = false;
                    break;
            }
        };
    }
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.mouseController = {
    mobileScreen: null,
    canvasScreen: null,
    mouseX: null,
    mouseY: null,
    down: false,
    drag: false,
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
    isMultiSelect: function () {
        return keyController.shift;
    },
    isJoinTeam: function () {
        return keyController.ctrl;
    },
    leftClick: function (event) {
        //Mouse at (clickX,clickY)
        var offset = $('#fogCanvas').offset();
        var clickX = event.pageX - offset.left;
        var clickY = event.pageY - offset.top;
        //Intercept event inside infoBox
        if (clickY > Game.infoBox.y)
            return;
        //Selection mode
        if (Button.callback == null) {
            //Find selected one, convert position
            var selectedOne = Game.getSelectedOne(clickX + Map.offsetX, clickY + Map.offsetY);
            //Cannot select enemy invisible unit
            if ((selectedOne instanceof Gobj) && selectedOne['isInvisible' + Game.team] && selectedOne.isEnemy())
                return;
            //Single select will unselect all units and only choose selected one
            //Multi select will keep selected status and do nothing
            if (!exports.mouseController.isMultiSelect())
                Game.unselectAll();
            //If has selected one
            if (selectedOne instanceof Gobj) {
                //Sound effect
                if (!(selectedOne.isEnemy()))
                    selectedOne.sound.selected.play();
                //Cannot multiSelect with enemy
                if (selectedOne.isEnemy() || (Game.selectedUnit.isEnemy && Game.selectedUnit.isEnemy()))
                    Game.unselectAll();
                //Only selected one to show portrait
                Game.changeSelectedTo(selectedOne);
                //Add into allSelected if not included
                Game.addIntoAllSelected(selectedOne);
            }
            else {
                //Click null
                Game.changeSelectedTo({});
                Game.unselectAll();
            }
        }
        else {
            //Callback
            Button.execute(event);
        }
        //Hide tooltip when click
        $('div.tooltip_Box').hide();
        //Login user statistic
        if (Multiplayer.statistic != null)
            Multiplayer.statistic.left++;
    },
    rightClick: function (event, unlock, btn) {
        //Mouse at (clickX,clickY)
        var offset = $('#fogCanvas').offset();
        var clickX = event.pageX - offset.left;
        var clickY = event.pageY - offset.top;
        //Intercept event inside infoBox
        if (clickY > Game.infoBox.y)
            return;
        //Show right click cursor
        var pos = { x: (clickX + Map.offsetX), y: (clickY + Map.offsetY) };
        new Burst.RightClickCursor(pos);
        var charas = Game.allSelected.filter(function (chara) {
            //Can only control our alive unit
            return chara.team == Game.team && chara.status != "dead";
        });
        //Handle user right click
        Multiplayer.cmds.push(JSON.stringify({
            uids: Multiplayer.getUIDs(charas),
            type: 'rightClick',
            pos: pos,
            unlock: Boolean(unlock),
            btn: btn
        }));
        //Login user statistic
        if (Multiplayer.statistic != null)
            Multiplayer.statistic.right++;
    },
    rightClickHandler: function (charas, pos, unlock, btn) {
        //Find selected one or nothing
        var selectedEnemy = (charas.length > 0) ? Game.getSelectedOne(pos.x, pos.y, charas[0].team.toString()) : null;
        charas.forEach(function (chara) {
            //Sound effect
            if (!chara.isEnemy() && chara.sound.moving)
                chara.sound.moving.play();
            //Interrupt old destination routing
            if (chara.destination) {
                //Break possible dead lock
                if (chara.destination.next)
                    chara.destination.next = null;
                delete chara.destination;
            }
            //Cancel possible hold
            if (chara.hold) {
                delete chara.AI;
                delete chara.findNearbyTargets;
                delete chara.hold;
                Button.refreshButtons();
            }
            //Unit cannot attack will always choose move mode
            var attackOrMove = (chara.attack) ? (selectedEnemy instanceof Gobj) : false;
            //Attack mode
            if (attackOrMove) {
                if (chara.cannotMove() && !(chara.isInAttackRange(selectedEnemy)))
                    return;
                //Intercept invisible enemy
                if (selectedEnemy['isInvisible' + Game.team]) {
                    if (!chara.isEnemy())
                        Referee.voice('pError').play();
                    return;
                }
                chara.targetLock = true;
                chara.attack(selectedEnemy);
            }
            else {
                if (chara.cannotMove())
                    return;
                //Only attackable units can stop attack
                if (chara.attack)
                    chara.stopAttack();
                //Lock destination by default
                chara.targetLock = !unlock;
                chara.moveTo(pos.x, pos.y);
                //Record destination
                if (btn == 'attack') {
                    chara.destination = { x: pos.x, y: pos.y };
                }
                if (btn == 'patrol') {
                    //Patrol dead lock
                    chara.destination = { x: pos.x, y: pos.y };
                    chara.destination.next = { x: chara.posX(), y: chara.posY(), next: chara.destination };
                }
            }
        });
    },
    dblClick: function () {
        //Multi select same type units
        if (!(Game.selectedUnit.isEnemy && Game.selectedUnit.isEnemy())) {
            var charas = Unit.allUnits.filter(function (chara) {
                return !(chara.isEnemy()) && chara.insideScreen() && (chara.name == Game.selectedUnit.name);
            });
            Game.addIntoAllSelected(charas);
        }
    },
    //Can control all units
    toControlAll: function () {
        //For desktop
        if (!Game.isApp) {
            //Mouse left click
            $('#fogCanvas')[0].onclick = function (event) {
                event.preventDefault();
                if (exports.mouseController.drag) {
                    //End drag, onclick triggered after onmouseup, don't do default left click action
                    exports.mouseController.drag = false;
                }
                else {
                    exports.mouseController.leftClick(event);
                }
            };
            //Mouse right click
            $('#fogCanvas')[0].oncontextmenu = function (event) {
                //Prevent context menu show
                event.preventDefault();
                //Should not control units during replay
                if (Game.replayFlag)
                    return;
                exports.mouseController.rightClick(event);
                //Cancel pointer
                $('div.GameLayer').removeAttr('status');
                //Cancel callback
                Button.callback = null;
            };
            //Double click
            $('#fogCanvas')[0].ondblclick = function (event) {
                //Prevent screen select
                event.preventDefault();
                exports.mouseController.dblClick();
            };
            //Mouse click start
            $('#fogCanvas')[0].onmousedown = function (event) {
                event.preventDefault();
                //Do not allow rectangular-multi-select with right click, only left clicks
                if (event.which === 3) {
                    return;
                }
                if (!exports.mouseController.down) {
                    //Mouse at (clickX,clickY)
                    var clickX = event.pageX - $('#fogCanvas').offset().left;
                    var clickY = event.pageY - $('#fogCanvas').offset().top;
                    exports.mouseController.startPoint = { x: clickX, y: clickY };
                    exports.mouseController.down = true;
                }
            };
            //Mouse drag
            $('#fogCanvas')[0].onmousemove = function (event) {
                event.preventDefault();
                if (exports.mouseController.down) {
                    //Mouse at (clickX,clickY)
                    var clickX = event.pageX - $('#fogCanvas').offset().left;
                    var clickY = event.pageY - $('#fogCanvas').offset().top;
                    exports.mouseController.endPoint = { x: clickX, y: clickY };
                    if (Math.abs(clickX - exports.mouseController.startPoint.x) > 5 &&
                        Math.abs(clickY - exports.mouseController.startPoint.y) > 5) {
                        exports.mouseController.drag = true;
                    }
                }
            };
            //Global client refresh map
            window.onmousemove = function (event) {
                event.preventDefault();
                //Mouse at (clickX,clickY)
                exports.mouseController.mouseX = event.clientX;
                exports.mouseController.mouseY = event.clientY;
            };
            //Mouse click end
            $('#fogCanvas')[0].onmouseup = function (event) {
                event.preventDefault();
                exports.mouseController.down = false;
                if (exports.mouseController.drag) {
                    //Multi select inside rect
                    Game.multiSelectInRect();
                }
            };
        }
        else {
            $('#fogCanvas')[0].ontouchstart = function (event) {
                event.preventDefault();
                //Drag rectangle
                if (event.touches.length == 2) {
                    var offsetX = $('#fogCanvas').offset().left;
                    var offsetY = $('#fogCanvas').offset().top;
                    exports.mouseController.drag = true;
                    exports.mouseController.startPoint = { x: event.touches[0].pageX - offsetX, y: event.touches[0].pageY - offsetY };
                    exports.mouseController.endPoint = { x: event.touches[1].pageX - offsetX, y: event.touches[1].pageY - offsetY };
                }
            };
            $('#fogCanvas')[0].ontouchend = function (event) {
                event.preventDefault();
                if (exports.mouseController.drag) {
                    //Multi select inside rect
                    Game.multiSelectInRect();
                    //End drag
                    exports.mouseController.drag = false;
                }
            };
            exports.mouseController.mobileScreen = new Hammer(window);
            exports.mouseController.canvasScreen = new Hammer($('#fogCanvas')[0]);
            exports.mouseController.canvasScreen.on('tap', function (event) {
                event.preventDefault();
                //Callback
                exports.mouseController.leftClick(event.pointers[0]);
            });
            exports.mouseController.canvasScreen.on('doubletap', function (event) {
                event.preventDefault();
                exports.mouseController.dblClick();
            });
            exports.mouseController.canvasScreen.on('press', function (event) {
                //Prevent context menu show
                event.preventDefault();
                //Should not control units during replay
                if (Game.replayFlag)
                    return;
                exports.mouseController.rightClick(event.changedPointers[0]);
                //Cancel handler
                $('div.GameLayer').removeAttr('status');
                Button.callback = null;
            });
            exports.mouseController.canvasScreen.on('panleft', function (event) {
                Map.needRefresh = "RIGHT";
            });
            exports.mouseController.canvasScreen.on('panright', function (event) {
                Map.needRefresh = "LEFT";
            });
            exports.mouseController.mobileScreen.on('panup', function (event) {
                Map.needRefresh = "BOTTOM";
            });
            exports.mouseController.mobileScreen.on('pandown', function (event) {
                Map.needRefresh = "TOP";
            });
        }
        //Both sides
        $('div#GamePlay div').on('contextmenu', function (event) {
            event.preventDefault();
        });
        $('canvas[name="mini_map"]').on('click', function (event) {
            event.preventDefault();
            Map.clickHandler(event);
        });
        $('canvas[name="mini_map"]').on('contextmenu', function (event) {
            event.preventDefault();
            Map.dblClickHandler(event);
        });
    }
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.Cheat = {
    isShown: false,
    cwal: false,
    gathering: false,
    manUnlimited: false,
    oldCalculateDamageBy: null,
    handler: function () {
        if (exports.Cheat.isShown) {
            if (Multiplayer.ON) {
                Multiplayer.webSocket.send(JSON.stringify({
                    type: 'chat',
                    from: Game.team,
                    msg: $('input#cheatInput').val()
                }));
            }
            else {
                //Forbid cheating during replay
                if (!Game.replayFlag) {
                    var cheatFlag = exports.Cheat.execute($('input#cheatInput').val().toLowerCase());
                    if (cheatFlag) {
                        //Refresh control panel
                        Game.changeSelectedTo(Game.selectedUnit);
                        Game.showMessage('Cheat enabled');
                    }
                }
            }
            $('#cheat_Box').hide();
            $('input#cheatInput').val('');
            exports.Cheat.isShown = false;
            keyController.disable = false;
        }
        else {
            $('#cheat_Box').show();
            $('input#cheatInput').focus();
            exports.Cheat.isShown = true;
            keyController.disable = true;
        }
    },
    execute: function (cheatCode) {
        //Forbid cheating when multiplayer mode
        if (Multiplayer.ON)
            return;
        var cheatFlag = true;
        switch (cheatCode) {
            case "show me the money":
                Resource[Game.team].mine += 10000;
                Resource[Game.team].gas += 10000;
                break;
            case "black sheep wall":
                //Switch between show fog or not show
                Map.fogFlag = !Map.fogFlag;
                if (Map.fogFlag == false) {
                    //Clear old fog on screen
                    Game.fogCxt.clearRect(0, 0, Game.HBOUND, Game.VBOUND);
                    //Redraw mini-map
                    Map.drawFogAndMinimap();
                }
                break;
            case "something for nothing":
                //Upgrade all grades
                for (var grade in Upgrade) {
                    Upgrade[grade].effect(Game.team);
                }
                break;
            case "full recovery":
                Unit.allOurUnits().concat(Building.ourBuildings()).forEach(function (chara) {
                    chara.life = chara.get('HP');
                    if (chara.SP)
                        chara.shield = chara.get('SP');
                    if (chara.MP)
                        chara.magic = chara.get('MP');
                });
                break;
            case "staying alive":
                Referee.winCondition = Referee.loseCondition = function () {
                    return false;
                };
                break;
            case "operation cwal":
                exports.Cheat.cwal = !(exports.Cheat.cwal);
                break;
            case "the gathering":
                exports.Cheat.gathering = !(exports.Cheat.gathering);
                break;
            case "food for thought":
                exports.Cheat.manUnlimited = !(exports.Cheat.manUnlimited);
                break;
            case "power overwhelming":
                if (exports.Cheat.oldCalculateDamageBy) {
                    var tempCalculateDamageBy = $.extend([], exports.Cheat.oldCalculateDamageBy);
                    exports.Cheat.oldCalculateDamageBy = [Unit.prototype.calculateDamageBy, Building.prototype.calculateDamageBy];
                    Unit.prototype.calculateDamageBy = tempCalculateDamageBy[0];
                    Building.prototype.calculateDamageBy = tempCalculateDamageBy[1];
                }
                else {
                    exports.Cheat.oldCalculateDamageBy = [Unit.prototype.calculateDamageBy, Building.prototype.calculateDamageBy];
                    Unit.prototype.calculateDamageBy = function (enemyObj) {
                        if (enemyObj.isEnemy && enemyObj.isEnemy())
                            return 0;
                        else
                            return exports.Cheat.oldCalculateDamageBy[0].call(this, enemyObj);
                    };
                    Building.prototype.calculateDamageBy = function (enemyObj) {
                        if (enemyObj.isEnemy && enemyObj.isEnemy())
                            return 0;
                        else
                            return exports.Cheat.oldCalculateDamageBy[1].call(this, enemyObj);
                    };
                }
                break;
            case "big daddy":
                var daddy = new Hero.HeroCruiser({ x: Map.offsetX + Game.HBOUND / 2, y: Map.offsetY + Game.VBOUND / 2 });
                Game.changeSelectedTo(daddy);
                break;
            case "big mommy":
                var mommy = new Hero.Sarah({ x: Map.offsetX + Game.HBOUND / 2, y: Map.offsetY + Game.VBOUND / 2 });
                Game.changeSelectedTo(mommy);
                break;
            case "game over man":
            case "gg":
                Game.lose();
                break;
            case "there is no cow level":
            case "your gg":
                Game.win();
                break;
            case "fuck your mother":
                Unit.allEnemyUnits().concat(Building.enemyBuildings()).forEach(function (chara) {
                    chara.die();
                });
                break;
            case "fuck my asshole":
                Unit.allOurUnits().concat(Building.ourBuildings()).forEach(function (chara) {
                    chara.die();
                });
                break;
            case "liuda is god":
                exports.Cheat.execute('black sheep wall');
                Referee.winCondition = Referee.loseCondition = function () {
                    return false;
                };
                Unit.allUnits.concat(Building.allBuildings).forEach(function (chara) {
                    chara.die();
                });
                break;
            default:
                //Not match any of above cheating code
                cheatFlag = false;
                break;
        }
        return cheatFlag;
    }
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.Multiplayer = {
    ON: false,
    webSocket: null,
    cmds: [],
    snapshotFlag: false,
    replaySnapshotFlag: true,
    statistic: null,
    getSocket: function () {
        if (window.WebSocket) {
            //ServerList: (1)HongKong:nvhae.com (3)Canada:104.128.82.12
            var webSocket = exports.Multiplayer.webSocket = new WebSocket('ws://nvhae.com:28082');
            webSocket.onerror = function () {
                //Offline flag for Store&Forward
                Game.offline = true;
            };
            return webSocket;
        }
        else
            return null;
    },
    sendUserInfo: function () {
        var webSocket = exports.Multiplayer.getSocket();
        if (webSocket) {
            webSocket.onopen = function () {
                webSocket.send(JSON.stringify({ type: 'login', level: Game.level, team: Game.team, version: navigator.userAgent,
                    platform: navigator.platform, language: navigator.language, size: { x: innerWidth, y: innerHeight } }));
                exports.Multiplayer.statistic = { left: 0, right: 0 };
                //Test parse info
                var url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_=' + Math.random();
                $.getJSON(url, function (data) {
                    webSocket.send(JSON.stringify({
                        type: 'log', log: "Isp(" + data.Isp + "), Browser(" + data.Browser + "), OS(" + data.OS + ")"
                    }));
                });
                //Test snapshot
                if (exports.Multiplayer.snapshotFlag) {
                    var N = 1;
                    setInterval(function () {
                        webSocket.send(JSON.stringify({
                            type: 'snapshot',
                            units: Unit.allUnits.sort(function (u1, u2) {
                                if (u1.team == u2.team)
                                    return u1.name.localeCompare(u2.name);
                                else
                                    return u1.team - u2.team;
                            }).map(function (chara) {
                                var result = (chara.name + ' HP' + chara.life + ' T' + chara.team + ' [' + (chara.x >> 0) + ',' + (chara.y >> 0) + ']');
                                if (chara.magic != null)
                                    result += ' M' + chara.magic;
                                return result;
                            }),
                            buildings: Building.allBuildings.sort(function (b1, b2) {
                                if (b1.team == b2.team)
                                    return b1.name.localeCompare(b2.name);
                                else
                                    return b1.team - b2.team;
                            }).map(function (chara) {
                                return chara.name + ' HP' + chara.life + ' T' + chara.team + ' [' + (chara.x >> 0) + ',' + (chara.y >> 0) + ']';
                            }),
                            click: { left: exports.Multiplayer.statistic.left, right: exports.Multiplayer.statistic.right },
                            count: { ourUnits: Unit.allOurUnits().length, enemyUnits: Unit.allEnemyUnits().length,
                                ourBuildings: Building.ourBuildings().length, enemyBuildings: Building.enemyBuildings().length },
                            num: N
                        }));
                        //Reset click statistic
                        exports.Multiplayer.statistic = { left: 0, right: 0 };
                        N++;
                    }, 60000);
                }
                //Test replay record every 10 seconds
                if (exports.Multiplayer.replaySnapshotFlag) {
                    setInterval(function () {
                        webSocket.send(JSON.stringify({
                            type: 'replaySnapshot',
                            replaySnapshot: {
                                team: Game.team,
                                level: Game.level,
                                cmds: Game.replay,
                                end: Game.mainTick
                            }
                        }));
                    }, 10000);
                }
            };
        }
    },
    enable: function () {
        var webSocket = exports.Multiplayer.getSocket();
        if (webSocket) {
            webSocket.onopen = function () {
                Game.showMessage("Already connected to server!");
            };
            webSocket.onclose = function () {
                Game.showMessage("You've disconnected from server!");
            };
            webSocket.onerror = function () {
                Game.showMessage("Cannot connect to server...");
            };
            webSocket.onmessage = function (message) {
                var msgObj = JSON.parse(message.data);
                switch (msgObj.type) {
                    case "ping":
                        exports.Multiplayer.webSocket.send(JSON.stringify({ type: 'pong' }));
                        console.log('Receive ping');
                        break;
                    case "notice":
                        Game.showMessage(msgObj.msg);
                        break;
                    case "start":
                        //Choose team
                        Game.team = msgObj.team;
                        //Bind controller
                        mouseController.toControlAll(); //Can control all units
                        keyController.start(); //Start monitor
                        Game.animation();
                        break;
                    case "replay":
                        Game.saveReplay(msgObj.replay);
                        break;
                    case "tick":
                        Game.serverTick = msgObj.tick;
                        exports.Multiplayer.parseTickCmd(msgObj);
                        break;
                }
            };
            exports.Multiplayer.ON = true;
        }
        else {
            Game.showMessage("Your browser doesn't support WebSocket...");
        }
    },
    parseTickCmd: function (msgObj) {
        if (msgObj.cmds) {
            if (!Game.commands[msgObj.tick])
                Game.commands[msgObj.tick] = [];
            msgObj.cmds.forEach(function (cmdStr) {
                var cmd = JSON.parse(cmdStr);
                switch (cmd.type) {
                    case 'rightClick':
                        Game.commands[msgObj.tick].push(function () {
                            //Closures
                            var uids = cmd.uids;
                            var pos = cmd.pos;
                            var unlock = cmd.unlock;
                            var btn = cmd.btn;
                            return function () {
                                var charas = exports.Multiplayer.getUnitsByUIDs(uids);
                                mouseController.rightClickHandler(charas, pos, unlock, btn);
                            };
                        }());
                        break;
                    case 'stop':
                        Game.commands[msgObj.tick].push(function () {
                            //Closures
                            var uids = cmd.uids;
                            return function () {
                                var charas = exports.Multiplayer.getUnitsByUIDs(uids);
                                Button.stopHandler(charas);
                            };
                        }());
                        break;
                    case 'hold':
                        Game.commands[msgObj.tick].push(function () {
                            //Closures
                            var uids = cmd.uids;
                            return function () {
                                var charas = exports.Multiplayer.getUnitsByUIDs(uids);
                                Button.holdHandler(charas);
                            };
                        }());
                        break;
                    case 'magic':
                        //Scarab and Interceptor
                        if (cmd.duration) {
                            Game.commands[msgObj.tick].push(function () {
                                //Closures
                                var uids = cmd.uids;
                                var name = cmd.name;
                                var duration = cmd.duration;
                                return function () {
                                    var owner = exports.Multiplayer.getUnitsByUIDs(uids)[0];
                                    if (owner && Resource.paypal.call(owner, Resource.getCost(name))) {
                                        //Cheat: Operation cwal
                                        if (Cheat.cwal)
                                            duration = 0;
                                        Game.commandTimeout(function () {
                                            Magic[name].spell.call(owner);
                                            delete owner.processing;
                                        }, duration * 100);
                                        //Occupy flag
                                        owner.processing = {
                                            name: name,
                                            startTime: Game.mainTick,
                                            time: duration
                                        };
                                    }
                                };
                            }());
                        }
                        else {
                            Game.commands[msgObj.tick].push(function () {
                                //Closures
                                var uids = cmd.uids;
                                var name = cmd.name;
                                var pos = cmd.pos;
                                var creditBill = cmd.creditBill;
                                return function () {
                                    var owner = exports.Multiplayer.getUnitsByUIDs(uids)[0];
                                    if (owner) {
                                        //Need callback with location
                                        if (pos) {
                                            //Spell magic with location in multiplayer mode
                                            if (creditBill)
                                                owner.creditBill = creditBill;
                                            Magic[name].spell.call(owner, pos);
                                        }
                                        else {
                                            if (Resource.paypal.call(owner, Resource.getCost(name))) {
                                                Magic[name].spell.call(owner);
                                            }
                                        }
                                    }
                                };
                            }());
                        }
                        break;
                    case 'upgrade':
                        if (cmd.duration) {
                            Game.commands[msgObj.tick].push(function () {
                                //Closures
                                var uids = cmd.uids;
                                var name = cmd.name;
                                var duration = cmd.duration;
                                var team = cmd.team;
                                return function () {
                                    var owner = exports.Multiplayer.getUnitsByUIDs(uids)[0];
                                    //Still owner alive and can afford payment
                                    if (owner && Resource.paypal.call(owner, Resource.getCost(name))) {
                                        //Cheat: Operation cwal
                                        if (Cheat.cwal)
                                            duration = 0;
                                        Game.commandTimeout(function () {
                                            Upgrade[name].effect(team);
                                            delete owner.processing;
                                            if (team == Game.team) {
                                                Referee.voice('upgrade')[Game.race.selected].play();
                                                Game.refreshInfo();
                                                Game.showMessage('Upgrade complete');
                                            }
                                        }, duration * 100);
                                        //Occupy flag
                                        owner.processing = {
                                            name: name,
                                            startTime: Game.mainTick,
                                            time: duration
                                        };
                                    }
                                };
                            }());
                        }
                        else {
                            Game.commands[msgObj.tick].push(function () {
                                //Closures
                                var team = cmd.team;
                                var name = cmd.name;
                                return function () {
                                    //Will effect immediately
                                    Upgrade[name].effect(team);
                                };
                            }());
                        }
                        break;
                    case 'unit':
                        if (cmd.evolve) {
                            Game.commands[msgObj.tick].push(function () {
                                //Closures
                                var uids = cmd.uids;
                                var unitType = cmd.name;
                                var duration = cmd.duration;
                                switch (cmd.evolve) {
                                    case 'archon':
                                        return function () {
                                            var chara = exports.Multiplayer.getUnitsByUIDs(uids)[0];
                                            if (chara && Resource.paypal.call(chara, Resource.getCost(unitType))) {
                                                //Evolve as Archon or DarkArchon
                                                var evolve = chara.evolveTo({ type: Building.ProtossBuilding[unitType + 'Evolve'] });
                                                Game.commandTimeout(function () {
                                                    if (evolve.status != 'dead') {
                                                        evolve.evolveTo({ type: Protoss[unitType], burstArr: [unitType + 'Birth'] });
                                                    }
                                                }, duration * 100);
                                                //Processing flag
                                                evolve.processing = {
                                                    name: unitType,
                                                    startTime: Game.mainTick,
                                                    time: duration
                                                };
                                            }
                                        };
                                    case 'zerg':
                                        var exceptions = ['Guardian', 'Devourer']; //Closure
                                        return function () {
                                            var chara = exports.Multiplayer.getUnitsByUIDs(uids)[0];
                                            if (chara && Resource.paypal.call(chara, Resource.getCost(unitType))) {
                                                //Evolve as egg
                                                var egg;
                                                //Clossure: which base larvas belong to
                                                var base = chara.owner;
                                                //Evolve as cocoon
                                                if (exceptions.indexOf(unitType) != -1) {
                                                    egg = chara.evolveTo({ type: Building.ZergBuilding.Cocoon });
                                                }
                                                else {
                                                    egg = chara.evolveTo({ type: Building.ZergBuilding.Egg });
                                                    if (unitType == 'Lurker')
                                                        egg.action = 18;
                                                }
                                                //Cheat: Operation cwal
                                                if (Cheat.cwal)
                                                    duration = 0;
                                                Game.commandTimeout(function () {
                                                    if (egg.status != 'dead') {
                                                        //Evolve
                                                        if (exceptions.indexOf(unitType) != -1) {
                                                            //Cocoon
                                                            egg.evolveTo({ type: Zerg[unitType], burstArr: [unitType + 'Birth'] });
                                                        }
                                                        else {
                                                            //Egg
                                                            egg.evolveTo({ type: Zerg[unitType], burstArr: ['EggBirth', unitType + 'Birth'], rallyPoint: base ? base.rallyPoint : null });
                                                        }
                                                    }
                                                }, duration * 100);
                                                //Processing flag on egg
                                                egg.processing = {
                                                    name: unitType,
                                                    startTime: Game.mainTick,
                                                    time: duration
                                                };
                                            }
                                        };
                                }
                            }());
                        }
                        else
                            Game.commands[msgObj.tick].push(function () {
                                //Closures
                                var uids = cmd.uids;
                                var unitType = cmd.name;
                                var duration = cmd.duration;
                                //Find unit name from which race
                                var Race;
                                [Zerg, Terran, Protoss, Hero].forEach(function (race) {
                                    if (race[unitType] != null)
                                        Race = race;
                                });
                                return function () {
                                    var owner = exports.Multiplayer.getUnitsByUIDs(uids)[0];
                                    if (owner && Resource.paypal.call(owner, Resource.getCost(unitType))) {
                                        //Cheat: Operation cwal
                                        if (Cheat.cwal)
                                            duration = 0;
                                        Game.commandTimeout(function () {
                                            var trainedUnit;
                                            if (Race[unitType].prototype.isFlying)
                                                trainedUnit = new Race[unitType]({ x: owner.x, y: owner.y, team: owner.team });
                                            else
                                                trainedUnit = new Race[unitType]({ x: owner.x, y: owner.y + owner.height, team: owner.team });
                                            delete owner.processing;
                                            if (owner.rallyPoint)
                                                trainedUnit.destination = owner.rallyPoint;
                                        }, duration * 100);
                                        //Occupy flag
                                        owner.processing = {
                                            name: unitType,
                                            startTime: Game.mainTick,
                                            time: duration
                                        };
                                    }
                                };
                            }());
                        break;
                    case 'build':
                        Game.commands[msgObj.tick].push(function () {
                            //Closures
                            var uids = cmd.uids;
                            var buildName = cmd.name;
                            var BuildType = cmd.buildType;
                            var pos = cmd.pos;
                            return function () {
                                var farmer = exports.Multiplayer.getUnitsByUIDs(uids)[0];
                                if (farmer && Resource.paypal.call(farmer, Resource.getCost(buildName))) {
                                    //Destination building name
                                    farmer.buildName = buildName;
                                    //Farmer build with location
                                    if (pos)
                                        farmer['build' + BuildType](pos);
                                    else
                                        farmer['build' + BuildType]();
                                }
                            };
                        }());
                        break;
                }
            });
        }
    },
    getUIDs: function (charas) {
        return charas.map(function (chara) {
            return chara.id;
        });
    },
    getUnitsByUIDs: function (uids) {
        return Unit.allUnits.concat(Building.allBuildings).filter(function (chara) {
            //Need filter out dead units to execute commands
            return uids.indexOf(chara.id) != -1 && chara.status != 'dead';
        });
    }
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.Referee = {
    underArbiterUnits: [],
    detectedUnits: [],
    ourDetectedUnits: [],
    enemyDetectedUnits: [],
    _pos: [[-1, 0], [1, 0], [0, -1], [0, 1]],
    tasks: ['judgeArbiter', 'judgeDetect', 'judgeCollision', 'judgeRecover', 'judgeDying', 'judgeMan',
        'addLarva', 'coverFog', 'alterSelectionMode', 'judgeBuildingInjury', 'judgeWinLose', 'saveReplaySnapshot'],
    voice: (function () {
        var voice;
        return function (name) {
            //Single instance pattern
            if (!voice)
                voice = {
                    pError: new Audio(Game.CDN + 'bgm/PointError.wav'),
                    button: new Audio(Game.CDN + 'bgm/Button.wav'),
                    resource: {
                        Zerg: {
                            mine: new Audio(Game.CDN + 'bgm/mine.Zerg.wav'),
                            gas: new Audio(Game.CDN + 'bgm/gas.Zerg.wav'),
                            man: new Audio(Game.CDN + 'bgm/man.Zerg.wav'),
                            magic: new Audio(Game.CDN + 'bgm/magic.Zerg.wav')
                        },
                        Terran: {
                            mine: new Audio(Game.CDN + 'bgm/mine.Terran.wav'),
                            gas: new Audio(Game.CDN + 'bgm/gas.Terran.wav'),
                            man: new Audio(Game.CDN + 'bgm/man.Terran.wav'),
                            magic: new Audio(Game.CDN + 'bgm/magic.Terran.wav')
                        },
                        Protoss: {
                            mine: new Audio(Game.CDN + 'bgm/mine.Protoss.wav'),
                            gas: new Audio(Game.CDN + 'bgm/gas.Protoss.wav'),
                            man: new Audio(Game.CDN + 'bgm/man.Protoss.wav'),
                            magic: new Audio(Game.CDN + 'bgm/magic.Protoss.wav')
                        }
                    },
                    upgrade: {
                        Zerg: new Audio(Game.CDN + 'bgm/upgrade.Zerg.wav'),
                        Terran: new Audio(Game.CDN + 'bgm/upgrade.Terran.wav'),
                        Protoss: new Audio(Game.CDN + 'bgm/upgrade.Protoss.wav')
                    }
                };
            return voice[name];
        };
    })(),
    winCondition: function () {
        //By default: All our units and buildings are killed
        return (Unit.allEnemyUnits().length == 0 && Building.enemyBuildings().length == 0);
    },
    loseCondition: function () {
        //By default: All enemies and buildings are killed
        return (Unit.allOurUnits().length == 0 && Building.ourBuildings().length == 0);
    },
    judgeArbiter: function () {
        //Every 0.4 sec
        if (Game.mainTick % 4 == 0) {
            //Special skill: make nearby units invisible
            var arbiterBuffer = Protoss.Arbiter.prototype.bufferObj;
            var allArbiters = Game.getPropArray([]);
            Unit.allUnits.forEach(function (chara) {
                if (chara.name == 'Arbiter')
                    allArbiters[chara.team].push(chara);
            });
            //Clear old units' Arbiter buffer
            exports.Referee.underArbiterUnits.forEach(function (charas) {
                charas.forEach(function (chara) {
                    chara.removeBuffer(arbiterBuffer);
                });
            });
            exports.Referee.underArbiterUnits = Game.getPropArray([]);
            allArbiters.forEach(function (arbiters, N) {
                //Find new under arbiter units
                arbiters.forEach(function (arbiter) {
                    //Find targets: same team units inside Arbiter sight, exclude Arbiter
                    var targets = Game.getInRangeOnes(arbiter.posX(), arbiter.posY(), arbiter.get('sight'), N, true, null, function (chara) {
                        return arbiters.indexOf(chara) == -1;
                    });
                    exports.Referee.underArbiterUnits[N] = exports.Referee.underArbiterUnits[N].concat(targets);
                });
                $.unique(exports.Referee.underArbiterUnits[N]);
            });
            //Arbiter buffer effect on these units
            exports.Referee.underArbiterUnits.forEach(function (charas) {
                charas.forEach(function (chara) {
                    chara.addBuffer(arbiterBuffer);
                });
            });
        }
    },
    //detectorBuffer are reverse of arbiterBuffer
    judgeDetect: function () {
        //Every 0.4 sec
        if (Game.mainTick % 4 == 0) {
            //Same detector buffer reference
            var detectorBuffer = Gobj.detectorBuffer;
            var allDetectors = Game.getPropArray([]);
            Unit.allUnits.forEach(function (chara) {
                if (chara.detector)
                    allDetectors[chara.team].push(chara);
            });
            //Clear old units detected buffer
            exports.Referee.detectedUnits.forEach(function (charas, team) {
                //For each team
                charas.forEach(function (chara) {
                    chara.removeBuffer(detectorBuffer[team]);
                });
            });
            exports.Referee.detectedUnits = Game.getPropArray([]);
            allDetectors.forEach(function (detectors, N) {
                //Find new under detector units
                detectors.forEach(function (detector) {
                    //Find targets: enemy invisible units inside detector sight
                    var targets = Game.getInRangeOnes(detector.posX(), detector.posY(), detector.get('sight'), N + '', true, null, function (chara) {
                        return chara['isInvisible' + Game.team];
                    });
                    exports.Referee.detectedUnits[N] = exports.Referee.detectedUnits[N].concat(targets);
                });
                $.unique(exports.Referee.detectedUnits[N]);
            });
            //Detector buffer effect on these units
            exports.Referee.detectedUnits.forEach(function (charas, team) {
                //For each team
                charas.forEach(function (chara) {
                    chara.addBuffer(detectorBuffer[team]);
                });
            });
            //PurpleEffect, RedEffect and GreenEffect are also detector, override invisible
            Animation.allEffects.filter(function (effect) {
                return (effect instanceof Animation.PurpleEffect) ||
                    (effect instanceof Animation.RedEffect) ||
                    (effect instanceof Animation.GreenEffect);
            }).forEach(function (effect) {
                var target = effect.target;
                for (var team = 0; team < Game.playerNum; team++) {
                    //Make already invisible units to visible by all teams
                    if (target['isInvisible' + team])
                        target['isInvisible' + team] = false;
                }
            });
        }
    },
    judgeReachDestination: function (chara) {
        //Idle but has destination
        if (chara.destination && chara.isIdle()) {
            //Already here
            if (chara.insideSquare({ centerX: chara.destination.x, centerY: chara.destination.y, radius: Unit.moveRange })) {
                //Has next destination
                if (chara.destination.next) {
                    chara.destination = chara.destination.next;
                    chara.moveTo(chara.destination.x, chara.destination.y);
                    chara.targetLock = false;
                }
                else {
                    delete chara.destination;
                }
            }
            else {
                chara.moveTo(chara.destination.x, chara.destination.y);
                chara.targetLock = false;
            }
        }
    },
    judgeRecover: function () {
        //Every 1 sec
        if (Game.mainTick % 10 == 0) {
            Unit.allUnits.concat(Building.allBuildings).forEach(function (chara) {
                if (chara.recover)
                    chara.recover();
            });
        }
    },
    judgeDying: function () {
        //Kill die survivor every 1 sec
        if (Game.mainTick % 10 == 0) {
            Unit.allUnits.concat(Building.allBuildings).filter(function (chara) {
                return chara.life <= 0 && chara.status != 'dead';
            }).forEach(function (chara) {
                chara.die();
            });
        }
    },
    //Avoid collision
    judgeCollision: function () {
        //N*N->N
        var units = Unit.allGroundUnits().concat(Building.allBuildings);
        for (var N = 0; N < units.length; N++) {
            var chara1 = units[N];
            for (var M = N + 1; M < units.length; M++) {
                var chara2 = units[M];
                var dist = chara1.distanceFrom(chara2);
                //Ground unit collision limit
                var distLimit;
                if (chara2 instanceof Unit) {
                    distLimit = (chara1.radius() + chara2.radius()) * 0.5;
                    if (distLimit < Unit.meleeRange)
                        distLimit = Unit.meleeRange; //Math.max
                }
                else {
                    distLimit = (chara1.radius() + chara2.radius()) * 0.8;
                }
                //Separate override ones
                if (dist == 0) {
                    var colPos = exports.Referee._pos[Game.getNextRandom() * 4 >> 0];
                    if (chara1 instanceof Unit) {
                        chara1.x += colPos[0];
                        chara1.y += colPos[1];
                        dist = 1;
                    }
                    else {
                        if (chara2 instanceof Unit) {
                            chara2.x += colPos[0];
                            chara2.y += colPos[1];
                            dist = 1;
                        }
                    }
                }
                if (dist < distLimit) {
                    //Collision flag
                    chara1.collision = chara2;
                    chara2.collision = chara1;
                    //Adjust ratio
                    var K = (distLimit - dist) / dist / 2;
                    var adjustX = K * (chara1.x - chara2.x) >> 0;
                    var adjustY = K * (chara1.y - chara2.y) >> 0;
                    //Adjust location
                    var interactRatio1 = 0;
                    var interactRatio2 = 0;
                    if (chara1 instanceof Building) {
                        interactRatio1 = 0;
                        //Building VS Unit
                        if (chara2 instanceof Unit)
                            interactRatio2 = 2;
                        else
                            interactRatio2 = 0;
                    }
                    else {
                        //Unit VS Unit
                        if (chara2 instanceof Unit) {
                            if (chara1.status == "moving") {
                                //Move VS Move
                                if (chara2.status == "moving") {
                                    interactRatio1 = 1;
                                    interactRatio2 = 1;
                                }
                                else {
                                    interactRatio1 = 2;
                                    interactRatio2 = 0;
                                }
                            }
                            else {
                                //Dock VS Move
                                if (chara2.status == "moving") {
                                    interactRatio1 = 0;
                                    interactRatio2 = 2;
                                }
                                else {
                                    interactRatio1 = 1;
                                    interactRatio2 = 1;
                                }
                            }
                        }
                        else {
                            interactRatio1 = 2;
                            interactRatio2 = 0;
                        }
                    }
                    chara1.x += interactRatio1 * adjustX;
                    chara1.y += interactRatio1 * adjustY;
                    chara2.x -= interactRatio2 * adjustX;
                    chara2.y -= interactRatio2 * adjustY;
                }
            }
        }
        units = Unit.allFlyingUnits();
        for (var N = 0; N < units.length; N++) {
            var chara1 = units[N];
            for (var M = N + 1; M < units.length; M++) {
                var chara2 = units[M];
                var dist = chara1.distanceFrom(chara2);
                //Flying unit collision limit
                var distLimit = Unit.meleeRange;
                //Separate override ones
                if (dist == 0) {
                    var colPos = exports.Referee._pos[Game.getNextRandom() * 4 >> 0];
                    chara1.x += colPos[0];
                    chara1.y += colPos[1];
                    dist = 1;
                }
                if (dist < distLimit) {
                    //Adjust ratio
                    var K = (distLimit - dist) / dist / 2;
                    var adjustX = K * (chara1.x - chara2.x) >> 0;
                    var adjustY = K * (chara1.y - chara2.y) >> 0;
                    //Adjust location
                    chara1.x += adjustX;
                    chara1.y += adjustY;
                    chara2.x -= adjustX;
                    chara2.y -= adjustY;
                }
            }
        }
    },
    coverFog: function () {
        //No need to set interval as 1sec
        if (Game.mainTick % 10 == 0)
            Map.drawFogAndMinimap();
    },
    alterSelectionMode: function () {
        //GC after some user changes
        $.extend([], Game.allSelected).forEach(function (chara) {
            if (chara.status == 'dead' || (chara['isInvisible' + Game.team] && chara.isEnemy()))
                Game.allSelected.splice(Game.allSelected.indexOf(chara), 1);
        });
        //Alter info UI: Multi selection mode
        if (Game.allSelected.length > 1) {
            //Need minor refresh or big move
            if (_$.arrayEqual(Game.allSelected, Game._oldAllSelected)) {
                //Only refresh
                Game.refreshMultiSelectBox();
            }
            else {
                //Redraw multiSelection div
                Game.drawMultiSelectBox();
                //Record this operation
                Game._oldAllSelected = _$.mixin([], Game.allSelected);
            }
            //Show multiSelection box
            $('div.override').show();
            $('div.override div.multiSelection').show();
        }
        else {
            $('div.override').hide();
            $('div.override div.multiSelection').hide();
        }
    },
    addLarva: function () {
        //Every 20 sec
        if (Game.mainTick % 200 == 0) {
            Building.allBuildings.filter(function (build) {
                return build.produceLarva;
            }).forEach(function (build) {
                //Can give birth to 3 larvas
                for (var N = 0; N < 3; N++) {
                    if (build.larvas[N] == null || build.larvas[N].status == "dead") {
                        build.larvas[N] = new Zerg.Larva({ x: (build.x + N * 48), y: (build.y + build.height + 4), team: build.team });
                        //Which base larva belongs to
                        build.larvas[N].owner = build;
                        break;
                    }
                }
            });
        }
    },
    judgeBuildingInjury: function () {
        //Every 1 sec
        if (Game.mainTick % 10 == 0) {
            Building.allBuildings.filter(function (build) {
                return build.injuryOffsets;
            }).forEach(function (build) {
                var injuryLevel = (1 - build.life / build.HP) / 0.25 >> 0;
                if (injuryLevel > 3)
                    injuryLevel = 3;
                var curLevel = build.injuryAnimations.length;
                if (injuryLevel > curLevel) {
                    var offsets = build.injuryOffsets;
                    var scale = build.injuryScale ? build.injuryScale : 1;
                    for (var N = curLevel; N < injuryLevel; N++) {
                        //Add injury animations
                        build.injuryAnimations.push(new Animation[build.injuryNames[N]]({ target: build, offset: offsets[N], scale: scale }));
                    }
                    if ((build instanceof Building.TerranBuilding) || (build instanceof Building.ProtossBuilding)) {
                        if (injuryLevel > 1)
                            build.sound.selected = build.sound.onfire;
                    }
                }
                if (injuryLevel < curLevel) {
                    for (var N = curLevel; N > injuryLevel; N--) {
                        //Clear injury animations
                        build.injuryAnimations.pop().die();
                    }
                    if ((build instanceof Building.TerranBuilding) || (build instanceof Building.ProtossBuilding)) {
                        if (injuryLevel <= 1)
                            build.sound.selected = build.sound.normal;
                    }
                }
            });
        }
    },
    judgeMan: function () {
        //Update current man and total man for all teams
        //?We may only need to judge our team's man for client consume use
        var curMan = Game.getPropArray(0), totalMan = Game.getPropArray(0);
        Unit.allUnits.concat(Building.allBuildings).forEach(function (chara) {
            if (chara.cost && chara.cost.man)
                (curMan[chara.team]) += chara.cost.man;
            if (chara.manPlus)
                (totalMan[chara.team]) += chara.manPlus;
            //Transport
            if (chara.loadedUnits) {
                chara.loadedUnits.forEach(function (passenger) {
                    if (passenger.cost && passenger.cost.man)
                        (curMan[passenger.team]) += passenger.cost.man;
                });
            }
        });
        for (var N = 0; N < Game.playerNum; N++) {
            Resource[N].curMan = curMan[N];
            Resource[N].totalMan = totalMan[N];
        }
    },
    judgeWinLose: function () {
        //Every 1 sec
        if (Game.mainTick % 10 == 0) {
            if (exports.Referee.loseCondition())
                Game.lose();
            if (exports.Referee.winCondition())
                Game.win();
        }
    },
    saveReplaySnapshot: function () {
        //Save replay snapshot every 3 sec
        if (Game.mainTick % 30 == 0) {
            Game.saveReplay();
        }
    }
};


/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Game_1 = __webpack_require__(0);
var Map_1 = __webpack_require__(4);
var Resource_1 = __webpack_require__(11);
var Animation_1 = __webpack_require__(2);
var Referee_1 = __webpack_require__(10);
var Upgrade_1 = __webpack_require__(5);
var mouseController_1 = __webpack_require__(7);
var keyController_1 = __webpack_require__(6);
var Multiplayer_1 = __webpack_require__(9);
var Cheat_1 = __webpack_require__(8);
var Magic_1 = __webpack_require__(13);
var Button_1 = __webpack_require__(3);
window.keyController = keyController_1.keyController;
window.mouseController = mouseController_1.mouseController;
window.Cheat = Cheat_1.Cheat;
window.Referee = Referee_1.Referee;
window.Upgrade = Upgrade_1.Upgrade;
window.Map = Map_1.Map;
window.Resource = Resource_1.Resource;
window.Animation = Animation_1.Animation;
window.Magic = Magic_1.Magic;
window.Multiplayer = Multiplayer_1.Multiplayer;
window.Button = Button_1.Button;
window.Game = Game_1.Game;
Game_1.Game.init();


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.Magic = {
    //Zerg
    Burrow: {
        name: "Burrow",
        enabled: false,
        spell: function () {
            this.dock();
            if (this.stopAttack)
                this.stopAttack();
            this.status = "burrow";
            this.action = 2;
            var myself = this;
            //Effect:Freeze target
            var bufferObj = {
                attack: null,
                moveTo: function () { },
                moveToward: function () { },
                dock: function () { },
                items: { '1': undefined, '2': undefined, '3': undefined, '4': undefined, '5': undefined,
                    '6': undefined, '7': undefined, '8': undefined, '9': { name: 'Unburrow' } }
            };
            if (this.attack)
                bufferObj.attack = function () { };
            //Lurker has same behavior as attackable building
            if (this.name == "Lurker") {
                var mixin = $.extend({}, Building.Attackable.prototypePlus);
                delete mixin.name;
                mixin.die = AttackableUnit.prototype.die; //Override
                $.extend(bufferObj, mixin);
                delete bufferObj.items[3]; //Enable attack icon
            }
            //Freeze immediately
            this.addBuffer(bufferObj, (this.name == "Lurker")); //onAll for Lurker
            this.burrowBuffer = [bufferObj];
            //Sound effect
            if (this.insideScreen())
                this.sound.burrow.play();
            //Forbid actions when burrowing
            var itemsBackup = this.items;
            this.items = { '1': undefined, '2': undefined, '3': undefined, '4': undefined, '5': undefined,
                '6': undefined, '7': undefined, '8': undefined, '9': undefined };
            if (Game.selectedUnit == this)
                Button.refreshButtons();
            //Finish burrow
            Game.commandTimeout(function () {
                //Invisible when finish burrow
                var bufferObjII = {};
                for (var N = 0; N < Game.playerNum; N++) {
                    bufferObjII['isInvisible' + N] = true;
                }
                myself.addBuffer(bufferObjII);
                myself.burrowBuffer.push(bufferObjII);
                myself.buffer.Burrow = true;
                //Change icon when finish burrow
                myself.items = itemsBackup;
                //Apply callback
                if (Game.selectedUnit == myself)
                    Button.refreshButtons();
            }, this.imgPos.burrow.left[0].length * 100 - 200);
        }
    },
    Unburrow: {
        name: "Unburrow",
        enabled: false,
        spell: function () {
            this.status = "unburrow";
            this.action = 0;
            //Show unit immediately
            this.removeBuffer(this.burrowBuffer.pop());
            //Sound effect
            if (this.insideScreen())
                this.sound.unburrow.play();
            //Forbid actions
            this.items = { '1': undefined, '2': undefined, '3': undefined, '4': undefined, '5': undefined,
                '6': undefined, '7': undefined, '8': undefined, '9': undefined };
            if (Game.selectedUnit == this)
                Button.refreshButtons();
            //Finish unburrow
            var myself = this;
            delete myself.buffer.Burrow; //Restore shadow immediately
            Game.commandTimeout(function () {
                if (myself.burrowBuffer) {
                    //Release freeze
                    if (myself.removeBuffer(myself.burrowBuffer.pop())) {
                        delete myself.burrowBuffer;
                        if (Game.selectedUnit == myself)
                            Button.refreshButtons();
                    }
                }
                myself.dock();
                myself.direction = (myself.name == "Hydralisk" || myself.name == "Lurker") ? 5 : 6;
            }, this.frame.unburrow * 100 - 200); //margin
        }
    },
    Load: {
        name: "Load",
        enabled: false,
        needLocation: true,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Load our unit on ground
                var target = Game.getSelectedOne(location.x, location.y, this.team, true, false);
                var loadedMan = this.loadedUnits.reduce(function (man, chara) {
                    if (chara.cost && chara.cost.man)
                        man += (chara.cost.man);
                    return man;
                }, 0);
                if (target instanceof Gobj) {
                    var targetMan = (target.cost && target.cost.man) ? target.cost.man : 0;
                    //Load limit
                    if ((loadedMan + targetMan) <= 12) {
                        var myself = this;
                        this.targetLock = true;
                        //Move toward target to load it
                        this.moveToward(target, Unit.meleeRange, function () {
                            if (target.status != 'dead') {
                                //Order ours not to attack it anymore
                                Unit.allUnits.concat(Building.allBuildings).forEach(function (chara) {
                                    if (chara.target == target)
                                        chara.stopAttack();
                                });
                                //Freeze target
                                if (target.stopAttack)
                                    target.stopAttack();
                                target.dock();
                                //Load target
                                myself.loadedUnits.push(target);
                                //Erase target from map
                                Unit.allUnits.splice(Unit.allUnits.indexOf(target), 1);
                                //Kick to other space, no die voice
                                target.x = target.y = -100;
                                //Reset all teams: replace passenger with transport
                                for (var N in Game.teams) {
                                    var team = Game.teams[N];
                                    team.forEach(function (chara, n) {
                                        if (chara == target)
                                            team[n] = myself; //team.splice(n,1)
                                    });
                                    $.unique(team);
                                }
                                //Refresh passenger number
                                if (Game.selectedUnit == myself)
                                    Game.refreshInfo();
                                //Sound effect
                                if (myself.insideScreen()) {
                                    switch (myself.name) {
                                        case 'Overlord':
                                            new Audio(Game.CDN + 'bgm/Magic.Load.Zerg.wav').play();
                                            break;
                                        case 'Dropship':
                                            new Audio(Game.CDN + 'bgm/Magic.Load.Terran.wav').play();
                                            break;
                                        case 'Shuttle':
                                            new Audio(Game.CDN + 'bgm/Magic.Load.Protoss.wav').play();
                                            break;
                                    }
                                }
                            }
                        });
                    }
                }
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    UnloadAll: {
        name: "UnloadAll",
        enabled: false,
        spell: function () {
            var myself = this;
            this.loadedUnits.forEach(function (chara) {
                //Transport here
                chara.x = myself.x;
                chara.y = myself.y;
                //Add this unit into Game
                Unit.allUnits.push(chara);
            });
            //Flying units show above ground units
            Unit.sortAllUnits();
            //Clear loaded units
            this.loadedUnits = [];
            //Refresh passenger number
            if (Game.selectedUnit == this)
                Game.refreshInfo();
            //Sound effect
            if (myself.insideScreen()) {
                switch (myself.name) {
                    case 'Overlord':
                        new Audio(Game.CDN + 'bgm/Magic.Unload.Zerg.wav').play();
                        break;
                    case 'Dropship':
                        new Audio(Game.CDN + 'bgm/Magic.Unload.Terran.wav').play();
                        break;
                    case 'Shuttle':
                        new Audio(Game.CDN + 'bgm/Magic.Unload.Protoss.wav').play();
                        break;
                }
            }
        }
    },
    SetRallyPoint: {
        name: "SetRallyPoint",
        enabled: true,
        //Exception for those without credit
        needLocation: true,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Record rally point for buildings
                this.rallyPoint = location;
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    Lurker: {
        name: "Lurker",
        enabled: false,
        cost: {
            mine: 50,
            gas: 100,
            man: 2,
            time: 400
        },
        spell: function () { }
    },
    InfestTerranCommandCenter: {
        name: "InfestTerranCommandCenter",
        enabled: true,
        needLocation: true,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Target enemy building: Injured Command Center
                var target = Game.getSelectedOne(location.x, location.y, this.team.toString(), false, null, function (chara) {
                    return chara.name == 'CommandCenter' && chara.life / chara.get('HP') < 0.5;
                });
                if (target instanceof Gobj) {
                    this.targetLock = true;
                    //Move toward target to infest command center
                    var myself = this;
                    this.moveToward(target, Unit.meleeRange, function () {
                        if (target.status != 'dead' && target.life / target.get('HP') < 0.5) {
                            //Change side
                            target.team = myself.team;
                            //Order ours not to attack it anymore
                            Unit.allOurUnits().concat(Building.ourBuildings()).forEach(function (chara) {
                                if (chara.target == target)
                                    chara.stopAttack();
                            });
                            target.evolveTo({
                                type: Building.ZergBuilding.InfestedBase
                            });
                        }
                    });
                }
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    Parasite: {
        name: "Parasite",
        cost: { magic: 75 },
        credit: true,
        enabled: true,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Target enemy unit
                var target = Game.getSelectedOne(location.x, location.y, this.team.toString(), true);
                if (target instanceof Gobj) {
                    var myself = this;
                    this.targetLock = true;
                    //Move toward target to fire parasite
                    this.moveToward(target, this.get('sight'), function () {
                        if (Resource.payCreditBill.call(myself)) {
                            //Fire parasite
                            var bullet = new Bullets.Parasite({
                                from: myself,
                                to: target,
                                damage: 0
                            });
                            bullet.fire(function () {
                                //Effect:should steal target sight
                                target.buffer.Parasite = myself.team;
                            });
                        }
                    });
                }
                else
                    delete this.creditBill;
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    SpawnBroodlings: {
        name: "SpawnBroodlings",
        cost: { magic: 150 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Kill enemy unit ground
                var target = Game.getSelectedOne(location.x, location.y, this.team.toString(), true, false);
                if (target instanceof Gobj) {
                    var myself = this;
                    this.targetLock = true;
                    //Move toward target to fire SpawnBroodlings
                    this.moveToward(target, this.get('sight'), function () {
                        if (Resource.payCreditBill.call(myself)) {
                            //Fire SpawnBroodlings to kill that enemy immediately
                            var bullet = new Bullets.Parasite({
                                from: myself,
                                to: target,
                                damage: 99999
                            });
                            //Effect
                            bullet.fire(function () {
                                for (var n = 0; n < 2; n++) {
                                    new Zerg.Broodling({ x: target.posX(), y: target.posY(), team: myself.team });
                                }
                            });
                        }
                    });
                }
                else
                    delete this.creditBill;
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    Ensnare: {
        name: "Ensnare",
        cost: { magic: 75 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Move toward target to fire Ensnare
                this.targetLock = true;
                var myself = this;
                this.moveTo(location.x, location.y, this.get('sight'), function () {
                    if (Resource.payCreditBill.call(myself)) {
                        //Fire Ensnare
                        var bullet = new Bullets.Parasite({
                            from: myself,
                            to: { x: location.x, y: location.y }
                        });
                        //Fire Ensnare bullet with callback
                        bullet.fire(function () {
                            //Ensnare animation and sound
                            var anime = new Animation.Ensnare({ x: location.x, y: location.y });
                            if (anime.insideScreen())
                                new Audio(Game.CDN + 'bgm/Magic.Ensnare.wav').play();
                            //Get in range enemy units
                            var targets = Game.getInRangeOnes(location.x, location.y, [76 * 1.2 >> 0, 62 * 1.2 >> 0], myself.team.toString(), true);
                            //Slow moving speed
                            var bufferObj = {
                                speed: 2
                            };
                            //Effect
                            targets.forEach(function (chara) {
                                //Buffer flag
                                if (chara.buffer.Ensnare)
                                    return; //Not again
                                chara.buffer.Ensnare = true;
                                chara.addBuffer(bufferObj);
                                //Green effect
                                new Animation.GreenEffect({ team: myself.team, target: chara, callback: function () {
                                        if (chara.status != 'dead' && chara.buffer.Ensnare) {
                                            //Restore
                                            if (chara.removeBuffer(bufferObj))
                                                delete chara.buffer.Ensnare;
                                        }
                                    } });
                            });
                        });
                    }
                });
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    Consume: {
        name: "Consume",
        enabled: false,
        needLocation: true,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Kill our unit ground
                var target = Game.getSelectedOne(location.x, location.y, this.team, true, false);
                if (target instanceof Gobj) {
                    var myself = this;
                    this.targetLock = true;
                    //Move toward target to consume
                    this.moveToward(target, 70, function () {
                        //Effect
                        var anime = new Animation.Consume({ target: target, callback: function () {
                                //Consume sound
                                if (anime.insideScreen())
                                    new Audio(Game.CDN + 'bgm/Magic.Consume.wav').play();
                                //Consume animation missing
                                target.die();
                                myself.magic += 50;
                                if (myself.magic > myself.get('MP'))
                                    myself.magic = myself.get('MP');
                            } });
                    });
                }
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    DarkSwarm: {
        name: "DarkSwarm",
        cost: { magic: 100 },
        credit: true,
        _timer: false,
        enabled: true,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Move toward target to fire DarkSwarm
                this.targetLock = true;
                var myself = this;
                this.moveTo(location.x, location.y, this.get('sight'), function () {
                    if (Resource.payCreditBill.call(myself)) {
                        //DarkSwarm animation, play hidden frames at first
                        new Animation.DarkSwarm({ x: location.x, y: location.y }).action = 6;
                        //Dynamic update targets every 1 second
                        var targets = [];
                        //Full guard from distance
                        var bufferObj = {
                            //Full guard from distance
                            calculateDamageBy: function (enemyObj, percent) {
                                if (enemyObj.meleeAttack) {
                                    var enemyAttackType = enemyObj.attackType;
                                    if (!enemyAttackType && enemyObj.attackMode) {
                                        enemyAttackType = (this.isFlying) ? enemyObj.attackMode.flying.attackType : enemyObj.attackMode.ground.attackType;
                                    }
                                    return enemyObj.get('damage') * Unit.attackMatrix[enemyAttackType][this.unitType];
                                }
                                else
                                    return 0;
                            }
                        };
                        //Dark swarm wave
                        var darkSwarm = function () {
                            //Clear old units buffer
                            targets.forEach(function (chara) {
                                chara.removeBuffer(bufferObj);
                            });
                            targets = [];
                            var darkSwarms = Burst.allEffects.filter(function (effect) {
                                return effect instanceof Animation.DarkSwarm;
                            });
                            //Check if any swarm effect exist
                            if (darkSwarms.length) {
                                //Get targets inside all of swarms
                                darkSwarms.forEach(function (swarm) {
                                    //Update buffer on our ground units inside swarm
                                    targets = targets.concat(Game.getInRangeOnes(swarm.posX(), swarm.posY(), [126 * 1.2 >> 0, 94 * 1.2 >> 0], null, true, false));
                                });
                                $.unique(targets);
                                //Effect
                                targets.forEach(function (chara) {
                                    //Guard from range-attack enemy
                                    chara.addBuffer(bufferObj);
                                });
                                Game.commandTimeout(darkSwarm, 1000);
                                exports.Magic.DarkSwarm._timer = true;
                            }
                            else
                                exports.Magic.DarkSwarm._timer = false;
                        };
                        //If not calculating, execute
                        if (!exports.Magic.DarkSwarm._timer)
                            darkSwarm();
                    }
                });
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    Plague: {
        name: "Plague",
        cost: { magic: 150 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Move toward target to fire Plague
                this.targetLock = true;
                var myself = this;
                this.moveTo(location.x, location.y, this.get('sight'), function () {
                    if (Resource.payCreditBill.call(myself)) {
                        //Plague animation and sound
                        var anime = new Animation.Plague({ x: location.x, y: location.y });
                        if (anime.insideScreen())
                            new Audio(Game.CDN + 'bgm/Magic.Ensnare.wav').play();
                        //Get in range enemy units
                        var targets = Game.getInRangeOnes(location.x, location.y, [64 * 1.2 >> 0, 64 * 1.2 >> 0], myself.team.toString(), true);
                        //Effect:HP losing every seconds
                        var bufferObj = {
                            recover: function () {
                                if (this.life > 0)
                                    this.life -= 25; //Refresh every 1 seconds
                                if (this.life <= 0)
                                    this.life = 1;
                            }
                        };
                        targets.forEach(function (chara) {
                            //Buffer flag
                            if (chara.buffer.Plague)
                                return; //Not again
                            chara.buffer.Plague = true;
                            //HP losing every seconds
                            chara.addBuffer(bufferObj);
                            //Green effect
                            new Animation.RedEffect({ team: myself.team, target: chara, callback: function () {
                                    if (chara.status != 'dead' && chara.buffer.Plague) {
                                        //Restore
                                        if (chara.removeBuffer(bufferObj))
                                            delete chara.buffer.Plague;
                                    }
                                } });
                        });
                    }
                });
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    //Terran
    StimPacks: {
        name: "StimPacks",
        enabled: false,
        spell: function () {
            //Rage flag for units to decide stim or not
            if (!this.buffer.Stim) {
                //Cause damage
                this.life -= 10;
                if (this.life < 1)
                    this.life = 1;
                //Stim sound
                if (this.insideScreen())
                    new Audio(Game.CDN + 'bgm/Magic.StimPacks.wav').play();
                //Effect
                var bufferObj = {
                    attackInterval: 800,
                    speed: 14
                };
                this.addBuffer(bufferObj);
                this.buffer.Stim = true;
                //Will only be stim for 15sec
                var myself = this;
                Game.commandTimeout(function () {
                    if (myself.status != 'dead' && myself.buffer.Stim) {
                        //Special effect is over
                        if (myself.removeBuffer(bufferObj))
                            delete myself.buffer.Stim;
                    }
                }, 15000);
            }
        }
    },
    PersonalCloak: {
        name: "PersonalCloak",
        cost: { magic: 25 },
        enabled: false,
        spell: function () {
            //Will only be invisible when having magic
            if (!this.cloakBuffer) {
                var bufferObj = {
                    //Magic losing every seconds
                    recover: function () {
                        //Should not forbid old recover
                        this.constructor.prototype.recover.call(this);
                        //Losing magic
                        if (this.magic > 0 && !Cheat.gathering)
                            this.magic--;
                        if (this.magic <= 0) {
                            //Might be negative float
                            this.magic = 0;
                            //Special effect is over
                            if (this.removeBuffer(bufferObj)) {
                                delete this.buffer.Cloak;
                                delete this.cloakBuffer;
                                //Recover icons and apply callbacks
                                delete this.items;
                                if (Game.selectedUnit == this)
                                    Button.reset();
                            }
                        }
                    }
                };
                for (var N = 0; N < Game.playerNum; N++) {
                    bufferObj['isInvisible' + N] = true;
                }
                //Effect
                this.buffer.Cloak = true;
                this.addBuffer(bufferObj);
                this.cloakBuffer = bufferObj;
            }
            //Change icon
            var items = _$.clone(this.items);
            for (var N2 in items) {
                if (items[N2].name == "Cloak")
                    items[N2].name = "Decloak";
            }
            this.items = items;
            //Apply callback
            if (Game.selectedUnit == this)
                Button.reset();
        }
    },
    Decloak: {
        name: "Decloak",
        enabled: true,
        spell: function () {
            if (this.cloakBuffer) {
                //Special effect is over
                if (this.removeBuffer(this.cloakBuffer)) {
                    delete this.buffer.Cloak;
                    delete this.cloakBuffer;
                }
            }
            //Recover icons and apply callbacks
            delete this.items;
            if (Game.selectedUnit == this)
                Button.reset();
        }
    },
    Lockdown: {
        name: "Lockdown",
        cost: { magic: 100 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Target enemy unit, machine unit
                var target = Game.getSelectedOne(location.x, location.y, this.team.toString(), true, null, function (chara) {
                    return chara.isMachine() && !chara.buffer.Lockdown;
                });
                if (target instanceof Gobj) {
                    var myself = this;
                    this.targetLock = true;
                    //Move toward target to fire lockdown
                    this.moveToward(target, 300, function () {
                        if (Resource.payCreditBill.call(myself)) {
                            //Fire lockdown missile
                            var bullet = new Bullets.SingleMissile({
                                from: myself,
                                to: target,
                                damage: 0
                            });
                            bullet.fire(function () {
                                //Lockdown effect
                                if (target.status != 'dead') {
                                    //Stop target
                                    if (target.stopAttack)
                                        target.stopAttack();
                                    target.dock();
                                    var bufferObj = {
                                        moveTo: function () { },
                                        moveToward: function () { },
                                        attack: function () { }
                                    };
                                    //Freeze status
                                    target.addBuffer(bufferObj);
                                    target.stop();
                                    //Flag
                                    target.buffer.Lockdown = true;
                                    //Lockdown animation, show hidden frames first
                                    var anime = new Animation.Lockdown({ target: target, callback: function () {
                                            //Restore after 60 seconds
                                            if (target.status != 'dead' && target.buffer.Lockdown) {
                                                if (target.removeBuffer(bufferObj))
                                                    delete target.buffer.Lockdown;
                                                target.dock();
                                            }
                                        } });
                                    anime.action = 7;
                                    //Lockdown sound
                                    if (anime.insideScreen())
                                        new Audio(Game.CDN + 'bgm/Magic.Lockdown.wav').play();
                                }
                            });
                        }
                    });
                }
                else
                    delete this.creditBill;
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    NuclearStrike: {
        name: "NuclearStrike",
        enabled: 1,
        needLocation: true,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Move toward target to fire Nuclear bomb
                this.targetLock = true;
                var myself = this;
                this.moveTo(location.x, location.y, this.get('sight'), function () {
                    //Fire Nuclear bomb
                    var bullet = new Bullets.NuclearBomb({
                        from: { x: location.x, y: location.y - 250 },
                        to: { x: location.x, y: location.y }
                    });
                    //Fire Nuclear bomb with callback
                    bullet.fire(function () {
                        //Nuclear bomb effect, should earlier than bomb animation draw
                        //Get in range charas, no matter ours or enemies
                        var targets = Game.getInRangeOnes(location.x, location.y, 175);
                        targets.forEach(function (chara) {
                            //Cause 500 damage
                            chara.life -= 500;
                            if (chara.life <= 0)
                                chara.die();
                        });
                        //Nuclear animation
                        var anime = new Animation.NuclearStrike({ x: location.x, y: location.y });
                        //Nuclear sound
                        if (anime.insideScreen())
                            new Audio(Game.CDN + 'bgm/Magic.NuclearStrike.wav').play();
                        //Use one our bomb
                        if (exports.Magic.NuclearStrike.enabled > 0 && myself.team == Game.team) {
                            exports.Magic.NuclearStrike.enabled--;
                            if (Game.selectedUnit == myself)
                                Button.refreshButtons();
                        }
                    });
                });
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    Heal: {
        name: "Heal",
        cost: { magic: 1 },
        credit: true,
        enabled: true,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                var myself = this;
                //Heal our units on ground, animal unit
                var target = Game.getSelectedOne(location.x, location.y, this.team, true, false, function (chara) {
                    return !(chara.isMachine());
                });
                if (target instanceof Gobj) {
                    this.targetLock = true;
                    //Move toward target to heal him
                    this.moveToward(target, target.radius() + 10, function () {
                        //Consume magic to heal injured target
                        if (myself.magic && target.life < target.get('HP')) {
                            //Heal target
                            target.life += 10;
                            if (target.life > target.get('HP'))
                                target.life = target.get('HP');
                            myself.magic--;
                            //Heal action and sound
                            if (myself.insideScreen())
                                new Audio(Game.CDN + 'bgm/Magic.Heal.wav').play();
                        }
                        //# Need heal target automatically until it becomes healthy
                    });
                }
                delete this.creditBill; //else
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    Restoration: {
        name: "Restoration",
        cost: { magic: 50 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Restore all units
                var target = Game.getSelectedOne(location.x, location.y, null, true);
                if (target instanceof Gobj) {
                    var myself = this;
                    this.targetLock = true;
                    //Move toward target to restore unit
                    this.moveToward(target, 140, function () {
                        if (Resource.payCreditBill.call(myself)) {
                            //Restore effect
                            var anime = new Animation.Restoration({ target: target });
                            //Restore sound
                            if (anime.insideScreen())
                                new Audio(Game.CDN + 'bgm/Magic.Restoration.wav').play();
                            //Remove all bufferObjs
                            $.extend([], target.bufferObjs).forEach(function (bufferObj) {
                                target.removeBuffer(bufferObj);
                            });
                            //Remove remaining buffer
                            if (target.cloakBuffer)
                                delete target.cloakBuffer;
                            if (target.purpleBuffer)
                                delete target.purpleBuffer;
                            //Delete all buffer animations on target
                            var bufferAnimations = ['StasisField', 'Lockdown', 'Plague', 'Ensnare', 'PurpleEffect', 'RedEffect', 'GreenEffect', 'DefensiveMatrix', 'MaelStorm', 'Irradiate'];
                            $.extend([], Burst.allEffects).forEach(function (effect) {
                                if (effect.target == target && bufferAnimations.some(function (name) { return (effect instanceof Animation[name]); }))
                                    Burst.allEffects.splice(Burst.allEffects.indexOf(effect), 1);
                            });
                            //Delete all buffers, some cannot delete
                            if (target.buffer.Hallucination)
                                target.buffer = { Hallucination: true };
                            else
                                target.buffer = {};
                        }
                    });
                }
                else
                    delete this.creditBill;
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    OpticalFlare: {
        name: "OpticalFlare",
        cost: { magic: 75 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Shoot enemy unit
                var target = Game.getSelectedOne(location.x, location.y, this.team.toString(), true);
                if (target instanceof Gobj) {
                    var myself = this;
                    this.targetLock = true;
                    //Move toward target to fire optical flare
                    this.moveToward(target, this.get('sight'), function () {
                        if (Resource.payCreditBill.call(myself)) {
                            //Fire optical flare
                            var bullet = new Bullets.VultureBall({
                                from: myself,
                                to: target,
                                damage: 0
                            });
                            bullet.fire(function () {
                                //Effect
                                var bufferObj = {
                                    sight: target.radius()
                                };
                                if (target.status != 'dead')
                                    target.addBuffer(bufferObj);
                                //Buffer flag
                                target.buffer.Blind = true;
                            });
                        }
                    });
                }
                else
                    delete this.creditBill;
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    SpiderMines: {
        name: "SpiderMines",
        enabled: false,
        spell: function (location) { }
    },
    SeigeMode: {
        name: "SeigeMode",
        enabled: false,
        spell: function () { }
    },
    Cloak: {
        name: "Cloak",
        cost: { magic: 25 },
        enabled: false,
        spell: function () {
            exports.Magic.PersonalCloak.spell.call(this);
        }
    },
    DefensiveMatrix: {
        name: "DefensiveMatrix",
        cost: { magic: 100 },
        credit: true,
        enabled: true,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Restore our units
                var target = Game.getSelectedOne(location.x, location.y, this.team, true, null, function (chara) {
                    return !chara.buffer.DefensiveMatrix; //Not again
                });
                if (target instanceof Gobj) {
                    var myself = this;
                    this.targetLock = true;
                    //Move toward target to activate defensive matrix
                    this.moveToward(target, 250, function () {
                        if (Resource.payCreditBill.call(myself)) {
                            //Defensive matrix animation
                            var anime = new Animation.DefensiveMatrix({ target: target, callback: function () {
                                    //Restore after 60 seconds, if no restoration executed, or interrupted by enemy attack
                                    if (target.status != 'dead' && anime.status != 'dead' && target.buffer.DefensiveMatrix) {
                                        if (target.removeBuffer(bufferObj))
                                            delete target.buffer.DefensiveMatrix;
                                    }
                                } });
                            //DefensiveMatrix sound
                            if (anime.insideScreen())
                                new Audio(Game.CDN + 'bgm/Magic.DefensiveMatrix.wav').play();
                            //Defensive matrix effect: absorb 250 damage
                            var matrixHP = 250;
                            var bufferObj = {
                                calculateDamageBy: function (enemyObj) {
                                    var damage;
                                    if (enemyObj instanceof Gobj) {
                                        var enemyAttackType = enemyObj.attackType;
                                        if (!enemyAttackType && enemyObj.attackMode) {
                                            enemyAttackType = (this.isFlying) ? enemyObj.attackMode.flying.attackType : enemyObj.attackMode.ground.attackType;
                                        }
                                        damage = enemyObj.get('damage') * Unit.attackMatrix[enemyAttackType][this.unitType];
                                    }
                                    else
                                        damage = enemyObj;
                                    //Consume matrixHP
                                    matrixHP -= damage;
                                    //Fully absorb damage if matrixHP still remain
                                    if (matrixHP > 0)
                                        return 0;
                                    else {
                                        anime.die();
                                        //Release remaining damage
                                        return -matrixHP;
                                    }
                                }
                            };
                            //Apply effect
                            target.addBuffer(bufferObj);
                            //Buffer flag
                            target.buffer.DefensiveMatrix = true;
                        }
                    });
                }
                else
                    delete this.creditBill;
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    EMPShockwave: {
        name: "EMPShockwave",
        cost: { magic: 100 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Move toward target to fire Plague
                this.targetLock = true;
                var myself = this;
                this.moveTo(location.x, location.y, this.get('sight'), function () {
                    if (Resource.payCreditBill.call(myself)) {
                        //Fire EMPShockwave
                        var bullet = new Bullets.SingleMissile({
                            from: myself,
                            to: { x: location.x, y: location.y }
                        });
                        //Fire EMPShockwave bullet with callback
                        bullet.fire(function () {
                            //EMP shockwave animation
                            var anime = new Animation.EMPShockwave({ x: location.x, y: location.y });
                            //EMPShockwave sound
                            if (anime.insideScreen())
                                new Audio(Game.CDN + 'bgm/Magic.EMPShockwave.wav').play();
                            //Get in range enemies
                            var targets = Game.getInRangeOnes(location.x, location.y, [90 * 1.2 >> 0, 74 * 1.2 >> 0], myself.team.toString());
                            //Effect
                            targets.forEach(function (chara) {
                                //Losing all shield and magic
                                if (chara.shield)
                                    chara.shield = 0;
                                if (chara.magic)
                                    chara.magic = 0;
                            });
                        });
                    }
                });
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    Irradiate: {
        name: "Irradiate",
        cost: { magic: 75 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Target enemy unit, animal unit
                var target = Game.getSelectedOne(location.x, location.y, this.team.toString(), true, null, function (chara) {
                    return !(chara.isMachine()) && !chara.buffer.Irradiate;
                });
                if (target instanceof Gobj) {
                    var myself = this;
                    this.targetLock = true;
                    var irradiate = function (chara) {
                        //Irradiate effect
                        var anime = new Animation.Irradiate({ target: chara, callback: function () {
                                //Restore after 25 seconds, dealing 250 damage
                                if (chara.status != 'dead' && chara.buffer.Irradiate) {
                                    if (chara.removeBuffer(bufferObj))
                                        delete chara.buffer.Irradiate;
                                    delete chara.allFrames['dock'];
                                    chara.dock();
                                }
                            } });
                        //Irradiate sound
                        if (anime.insideScreen())
                            new Audio(Game.CDN + 'bgm/Magic.Irradiate.wav').play();
                        //Losing life over time and walk around
                        chara.buffer.Irradiate = true; //Flag
                        var bufferObj = {
                            recover: function () {
                                //Get in range enemies and infect
                                Game.getInRangeOnes(chara.posX(), chara.posY(), 50, myself.team.toString(), true, null, function (chara) {
                                    return !(chara.isMachine()) && !chara.buffer.Irradiate;
                                }).forEach(function (chara) {
                                    irradiate(chara);
                                });
                                if (this.life > 0)
                                    this.life -= 10; //Refresh every 1 seconds
                                if (this.life <= 0) {
                                    this.die();
                                }
                            },
                            dock: Neutral.Bengalaas.prototype.dock
                        };
                        chara.addBuffer(bufferObj);
                        chara.dock();
                    };
                    //Move toward target to spell Irradiate
                    this.moveToward(target, 300, function () {
                        if (Resource.payCreditBill.call(myself)) {
                            irradiate(target);
                        }
                    });
                }
                else
                    delete this.creditBill;
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    Yamato: {
        name: "Yamato",
        cost: { magic: 150 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Shoot all enemy
                var target = Game.getSelectedOne(location.x, location.y, this.team.toString());
                if (target instanceof Gobj) {
                    var myself = this;
                    this.targetLock = true;
                    //Move toward target to fire yamato
                    this.moveToward(target, this.get('sight'), function () {
                        if (Resource.payCreditBill.call(myself)) {
                            //Fire yamato
                            var bullet = new Bullets.Yamato({
                                from: myself,
                                to: target,
                                damage: 250
                            });
                            bullet.fire();
                            if (myself.insideScreen())
                                new Audio(Game.CDN + 'bgm/HeroCruiser.attack.wav').play();
                        }
                    });
                }
                else
                    delete this.creditBill;
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    ScannerSweep: {
        name: "ScannerSweep",
        cost: { magic: 50 },
        credit: true,
        enabled: true,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                if (Resource.payCreditBill.call(this)) {
                    //ScannerSweep animation
                    var anime = new Animation.ScannerSweep({ x: location.x, y: location.y, team: this.team });
                    //ScannerSweep sound
                    if (anime.insideScreen())
                        new Audio(Game.CDN + 'bgm/Magic.ScannerSweep.wav').play();
                }
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    ArmNuclearSilo: {
        name: "ArmNuclearSilo",
        cost: {
            mine: 200,
            gas: 200,
            man: 8,
            time: 600
        },
        enabled: true,
        spell: function () {
            exports.Magic.NuclearStrike.enabled++;
        }
    },
    LiftOff: {
        name: "LiftOff",
        enabled: false,
        spell: function () { }
    },
    Land: {
        name: "Land",
        enabled: false,
        spell: function (location) { }
    },
    //Protoss
    PsionicStorm: {
        name: "PsionicStorm",
        cost: { magic: 75 },
        credit: true,
        _timer: false,
        speller: {},
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Move toward target to fire PsionicStorm
                this.targetLock = true;
                var myself = this;
                this.moveTo(location.x, location.y, this.get('sight'), function () {
                    if (Resource.payCreditBill.call(myself)) {
                        //PsionicStorm animation
                        var anime = new Animation.PsionicStorm({ x: location.x, y: location.y });
                        //PsionicStorm sound
                        if (anime.insideScreen())
                            new Audio(Game.CDN + 'bgm/Magic.PsionicStorm.wav').play();
                        //PsionicStorm effect
                        var targets = [];
                        exports.Magic.PsionicStorm.speller = this;
                        //Psionic storm wave
                        var stormWave = function () {
                            targets = [];
                            //Check if any psionic storm exist
                            var psionicStorms = Burst.allEffects.filter(function (effect) {
                                return effect instanceof Animation.PsionicStorm;
                            });
                            if (psionicStorms.length) {
                                //Get targets inside all of swarms
                                psionicStorms.forEach(function (storm) {
                                    //Update buffer on enemy units inside storm
                                    targets = targets.concat(Game.getInRangeOnes(storm.posX(), storm.posY(), [94 * 1.2 >> 0, 76 * 1.2 >> 0], null, true));
                                });
                                $.unique(targets);
                                //Effect
                                targets.forEach(function (chara) {
                                    //Deal damage
                                    chara.getDamageBy(16);
                                    //Don't move, but will die if no life
                                    chara.reactionWhenAttackedBy(exports.Magic.PsionicStorm.speller, true);
                                });
                                Game.commandTimeout(stormWave, 1000);
                                exports.Magic.PsionicStorm._timer = true;
                            }
                            else
                                exports.Magic.PsionicStorm._timer = false;
                        };
                        //If not calculating, execute
                        if (!exports.Magic.PsionicStorm._timer)
                            stormWave();
                    }
                });
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    Hallucination: {
        name: "Hallucination",
        cost: { magic: 100 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Target all units
                var target = Game.getSelectedOne(location.x, location.y, null, true);
                if (target instanceof Gobj) {
                    var myself = this;
                    this.targetLock = true;
                    //Move toward target to create 2 hallucinations
                    this.moveToward(target, 245, function () {
                        if (Resource.payCreditBill.call(myself)) {
                            //Hallucination effect
                            var anime = new Animation.Hallucination({ target: target });
                            //Hallucination sound
                            if (anime.insideScreen())
                                new Audio(Game.CDN + 'bgm/Magic.Hallucination.wav').play();
                            //Initial
                            var halluDamage, halluAttackMode, Hallucinations = [];
                            if (target.attack != null) {
                                if (target.attackMode) {
                                    halluAttackMode = _$.clone(target.attackMode);
                                    halluAttackMode.flying.damage = 0;
                                    halluAttackMode.ground.damage = 0;
                                }
                                else
                                    halluDamage = 0;
                            }
                            //Combine temp constructor for hallucination
                            var halluConstructor = target.constructor["extends"]({
                                constructorPlus: function (props) { },
                                prototypePlus: {
                                    //Override
                                    damage: halluDamage,
                                    attackMode: halluAttackMode,
                                    cost: { man: 0 },
                                    items: null,
                                    dieEffect: Burst.HallucinationDeath
                                }
                            });
                            for (var n = 0; n < 2; n++) {
                                var hallucination = new halluConstructor({ x: target.posX(), y: target.posY(), team: myself.team });
                                Hallucinations.push(hallucination);
                            }
                            //Will disappear after 180 seconds
                            Game.commandTimeout(function () {
                                Hallucinations.forEach(function (chara) {
                                    chara.die();
                                });
                            }, 180000);
                        }
                    });
                }
                else
                    delete this.creditBill;
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    Feedback: {
        name: "Feedback",
        cost: { magic: 50 },
        credit: true,
        enabled: true,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Target enemy unit, magician
                var target = Game.getSelectedOne(location.x, location.y, this.team.toString(), true, null, function (chara) {
                    return chara.MP;
                });
                if (target instanceof Gobj) {
                    var myself = this;
                    this.targetLock = true;
                    //Move toward target to spell Feedback
                    this.moveToward(target, 300, function () {
                        if (Resource.payCreditBill.call(myself)) {
                            //Feedback effect
                            var anime = new Animation.Feedback({ target: target });
                            //Feedback sound
                            if (anime.insideScreen())
                                new Audio(Game.CDN + 'bgm/Magic.Feedback.wav').play();
                            //Deal damage same as its magic, lose all magic
                            target.getDamageBy(target.magic);
                            target.reactionWhenAttackedBy(myself);
                            target.magic = 0;
                        }
                    });
                }
                else
                    delete this.creditBill;
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    MindControl: {
        name: "MindControl",
        cost: { magic: 150 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Can control all enemy
                var target = Game.getSelectedOne(location.x, location.y, this.team.toString());
                if (target instanceof Gobj) {
                    var myself = this;
                    this.targetLock = true;
                    //Move toward target to mind control it
                    this.moveToward(target, 280, function () {
                        if (Resource.payCreditBill.call(myself)) {
                            //Mind control animation
                            var anime = new Animation.MindControl({ target: target });
                            //MindControl sound
                            if (anime.insideScreen())
                                new Audio(Game.CDN + 'bgm/Magic.MindControl.wav').play();
                            //Control and tame enemy
                            target.team = myself.team;
                            //Order ours not to attack it anymore
                            Unit.allUnits.concat(Building.allBuildings).forEach(function (chara) {
                                if (chara.target == target)
                                    chara.stopAttack();
                            });
                            //Freeze target
                            if (target.stopAttack)
                                target.stopAttack();
                            target.dock();
                        }
                    });
                }
                else
                    delete this.creditBill;
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    MaelStorm: {
        name: "MaelStorm",
        cost: { magic: 100 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Move toward target to fire MaelStorm
                this.targetLock = true;
                var myself = this;
                this.moveTo(location.x, location.y, this.get('sight'), function () {
                    if (Resource.payCreditBill.call(myself)) {
                        //MaelStorm spell animation
                        var anime = new Animation.MaelStormSpell({ x: location.x, y: location.y, callback: function () {
                                //Get in range enemy units, animal
                                var targets = Game.getInRangeOnes(location.x, location.y, [64 * 1.2 >> 0, 64 * 1.2 >> 0], myself.team.toString(), true, null, function (chara) {
                                    return !(chara.isMachine()) && !chara.buffer.MaelStorm;
                                });
                                //Freeze target
                                var bufferObj = {
                                    moveTo: function () { },
                                    moveToward: function () { },
                                    attack: function () { }
                                };
                                //Effect
                                targets.forEach(function (target) {
                                    target.dock();
                                    if (target.stopAttack)
                                        target.stopAttack();
                                    target.addBuffer(bufferObj);
                                    //Buffer flag
                                    target.buffer.MaelStorm = true;
                                    //Mael storm effect
                                    new Animation.MaelStorm({ target: target, callback: function () {
                                            //Restore in 18 seconds
                                            if (target.status != 'dead' && target.buffer.MaelStorm) {
                                                if (target.removeBuffer(bufferObj))
                                                    delete target.buffer.MaelStorm;
                                            }
                                        } });
                                });
                                //MaelStorm sound
                                if (anime.insideScreen())
                                    new Audio(Game.CDN + 'bgm/Magic.MaelStorm.wav').play();
                            } });
                        //MaelStormSpell sound
                        if (anime.insideScreen())
                            new Audio(Game.CDN + 'bgm/Magic.StasisField.wav').play();
                    }
                });
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    Scarab: {
        name: "Scarab",
        enabled: true,
        cost: {
            mine: 15,
            time: 70
        },
        spell: function () {
            this.scarabNum++;
            //Refresh to disabled
            if (Game.selectedUnit == this)
                Button.refreshButtons();
        }
    },
    Interceptor: {
        name: "Interceptor",
        enabled: true,
        cost: {
            mine: 25,
            time: 200
        },
        spell: function () {
            //Build interceptor
            this.continuousAttack.count++;
            //Refresh to disabled
            if (Game.selectedUnit == this)
                Button.refreshButtons();
        }
    },
    Recall: {
        name: "Recall",
        cost: { magic: 150 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                var myself = this;
                if (Resource.payCreditBill.call(myself)) {
                    //Recall animation
                    var anime = new Animation.Recall({ x: location.x, y: location.y, callback: function () {
                            //Get in range our units
                            var targets = Game.getInRangeOnes(location.x, location.y, 50 * 1.2 >> 0, myself.team, true);
                            //Recall animation again
                            var animeII = new Animation.Recall({ x: myself.posX(), y: myself.posY() });
                            //Recall sound
                            if (animeII.insideScreen())
                                new Audio(Game.CDN + 'bgm/Magic.Recall.wav').play();
                            //Effect
                            targets.forEach(function (chara) {
                                //Relocate targets
                                chara.x = myself.x;
                                chara.y = myself.y;
                            });
                        } });
                    //Recall sound
                    if (anime.insideScreen())
                        new Audio(Game.CDN + 'bgm/Magic.Recall.wav').play();
                }
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    StasisField: {
        name: "StasisField",
        cost: { magic: 100 },
        credit: true,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Move toward target to fire StasisField
                this.targetLock = true;
                var myself = this;
                this.moveTo(location.x, location.y, this.get('sight'), function () {
                    if (Resource.payCreditBill.call(myself)) {
                        //Spell StasisField animation
                        var anime = new Animation.StasisFieldSpell({ x: location.x, y: location.y, callback: function () {
                                //Get in range units
                                var targets = Game.getInRangeOnes(location.x, location.y, 64 * 1.2 >> 0, null, true);
                                //Effect:Freeze target
                                var bufferObj = {
                                    moveTo: function () { },
                                    moveToward: function () { },
                                    attack: function () { },
                                    getDamageBy: function () { }
                                };
                                targets.forEach(function (target) {
                                    if (target.status != 'dead') {
                                        //Buffer flag
                                        if (target.buffer.StasisField)
                                            return; //Not again
                                        target.buffer.StasisField = true;
                                        //Effect
                                        target.dock();
                                        if (target.stopAttack)
                                            target.stopAttack();
                                        //Freeze target
                                        target.addBuffer(bufferObj);
                                        //Stasis status
                                        target.stop();
                                        //Stasis field animation
                                        new Animation.StasisField({ target: target, callback: function () {
                                                //Restore in 30 seconds
                                                if (target.status != 'dead' && target.buffer.StasisField) {
                                                    if (target.removeBuffer(bufferObj)) {
                                                        delete target.buffer.StasisField;
                                                        target.dock();
                                                    }
                                                }
                                            } });
                                    }
                                });
                            } });
                        //StasisField sound
                        if (anime.insideScreen())
                            new Audio(Game.CDN + 'bgm/Magic.StasisField.wav').play();
                    }
                });
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    DisruptionWeb: {
        name: "DisruptionWeb",
        cost: { magic: 125 },
        credit: true,
        _timer: false,
        enabled: false,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                //Move toward target to fire DisruptionWeb
                this.targetLock = true;
                var myself = this;
                this.moveTo(location.x, location.y, this.get('sight'), function () {
                    if (Resource.payCreditBill.call(myself)) {
                        //DisruptionWeb animation
                        var anime = new Animation.DisruptionWeb({ x: location.x, y: location.y });
                        //DisruptionWeb sound
                        if (anime.insideScreen())
                            new Audio(Game.CDN + 'bgm/Magic.DisruptionWeb.wav').play();
                        //Dynamic update targets every 1 second
                        var targets = [];
                        //Effect:Disable target attack
                        var bufferObj = {
                            attack: function () { }
                        };
                        //Disruption web wave
                        var disruptionWeb = function () {
                            //Clear old units buffer
                            targets.forEach(function (chara) {
                                chara.removeBuffer(bufferObj);
                            });
                            targets = [];
                            var disruptionWebs = Burst.allEffects.filter(function (effect) {
                                return effect instanceof Animation.DisruptionWeb;
                            });
                            //Check if any disruption web exist
                            if (disruptionWebs.length) {
                                //Get targets inside all of webs
                                disruptionWebs.forEach(function (web) {
                                    //Update buffer on enemy ground units inside web
                                    targets = targets.concat(Game.getInRangeOnes(web.posX(), web.posY(), [76 * 1.2 >> 0, 56 * 1.2 >> 0], null, true, false));
                                });
                                $.unique(targets);
                                //Effect
                                targets.forEach(function (chara) {
                                    //Cannot attack
                                    if (chara.attack) {
                                        chara.stopAttack();
                                        chara.addBuffer(bufferObj);
                                    }
                                });
                                Game.commandTimeout(disruptionWeb, 1000);
                                exports.Magic.DisruptionWeb._timer = true;
                            }
                            else
                                exports.Magic.DisruptionWeb._timer = false;
                        };
                        //If not calculating, execute
                        if (!exports.Magic.DisruptionWeb._timer)
                            disruptionWeb();
                    }
                });
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    RechargeShields: {
        name: "RechargeShields",
        enabled: true,
        needLocation: true,
        spell: function (location) {
            //Has location callback info or nothing
            if (location) {
                var myself = this;
                //Restore our units, have shield and in sight
                var target = Game.getSelectedOne(location.x, location.y, this.team, true, null, function (chara) {
                    return chara.SP && myself.canSee(chara);
                });
                if (target instanceof Gobj) {
                    //Recharge shield animation
                    var anime = new Animation.RechargeShields({ target: target });
                    //Recharge shield sound
                    if (anime.insideScreen())
                        new Audio(Game.CDN + 'bgm/Magic.RechargeShields.wav').play();
                    var hurt = target.get('SP') - target.shield;
                    var needMagic = (hurt / 2 + 0.5) >> 0;
                    //Remaining magic is sufficient
                    if (this.magic > needMagic) {
                        //Full recover
                        target.shield = target.get('SP');
                        this.magic -= needMagic;
                    }
                    else {
                        //Use all remaining magic
                        target.shield += (this.magic * 2);
                        this.magic = 0;
                    }
                }
                else {
                    //Cannot reach target, pError
                }
            }
            else {
                Button.callback = arguments.callee;
                Button.callback.owner = this;
                $('div.GameLayer').attr('status', 'button');
            }
        }
    },
    /********RPG level: Tower Defense********/
    CleanScreen: {
        name: "CleanScreen",
        cost: {
            mine: 200
        },
        spell: function () {
            //Kill all enemies
            Cheat.execute('fuck your mother');
        }
    }
};


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map