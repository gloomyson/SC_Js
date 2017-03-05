export class race {
    selected: 'Terran'//Terran race by default
    choose = function (race) {
        this.selected = race;
        $('div#GamePlay').attr('race', race);
    }
}