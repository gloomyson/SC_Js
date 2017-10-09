
import {Game} from './GameRule/Game'
import {Map} from './Characters/Map'
import {Resource} from './GameRule/Resource'
import {Animation} from './Characters/Animation'
import {Referee} from './GameRule/Referee';
import {Upgrade} from './Characters/Upgrade';
import {mouseController} from './Controller/mouseController';
import {keyController} from './Controller/keyController';
import {Multiplayer} from './GameRule/Multiplayer';
import {Cheat} from './GameRule/Cheat';
import {Magic} from './Characters/Magic';
import {Button} from './Characters/Button';

(window as any).keyController = keyController;
(window as any).mouseController = mouseController;
(window as any).Cheat = Cheat;
(window as any).Referee = Referee;
(window as any).Upgrade = Upgrade;
(window as any).Map = Map;
(window as any).Resource = Resource;
(window as any).Animation = Animation;
(window as any).Magic = Magic;
(window as any).Multiplayer = Multiplayer;
(window as any).Button = Button;
(window as any).Game = Game;
Game.init()