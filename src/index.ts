
import {Game} from './GameRule/Game'
import {Map} from './Characters/Map'
import {Resource} from './GameRule/Resource'
import {Animation} from './Characters/Animation'

(window as any).Map = Map;
(window as any).Game = Game;
(window as any).Resource = Resource;
(window as any).Animation = Animation;
Game.init()