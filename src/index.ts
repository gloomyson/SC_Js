
import {Game} from './GameRule/Game'
import {Map} from './Characters/Map'


(window as any).Map = Map;
(window as any).Game = Game;
Game.init()