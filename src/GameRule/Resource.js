var Resource={
    init:function(){
        for (var N=0;N<Game.playerNum;N++){
            Resource[N]={
                mine:50,
                gas:0,
                curMan:0,
                totalMan:0
            };
        }
    },
    getCost:function(name,team){
        var cost,count;
        if (!team) team=Game.team;
        [Zerg,Terran,Protoss,Building.ZergBuilding,Building.TerranBuilding,Building.ProtossBuilding,Magic,Upgrade].forEach(function(Type){
            //Not found yet
            if (!cost) {
                for (var item in Type){
                    //Filter out noise
                    if (item=='inherited' || item=='super' || item=='extends') continue;
                    if (item==name){
                        if (typeof(Type[item])=='function'){
                            cost=Type[item].prototype.cost;
                            count=Type[item].prototype.birthCount;
                        }
                        else cost=Type[item].cost;
                        //Resolve array cost
                        if (cost) {
                            //Clone fetched cost object, but sometimes undefined
                            cost=_$.clone(cost);
                            ['mine','gas','man','magic','time'].forEach(function(res){
                                if (cost[res]){
                                    if (cost[res] instanceof Array){
                                        cost[res]=cost[res][Type[item].level[team]];
                                    }
                                    if (count){
                                        cost[res]*=count;
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
    paypal:function(cost){
        if (cost){
            var oweFlag=false;
            if (Cheat.gathering) cost.magic=0;
            var team=(this.team!=null)?this.team:Game.team;
            if(cost['mine'] && cost['mine']>Resource[team].mine){
                oweFlag=true;
                Game.showMessage('Not enough minerals...mine more minerals');
                //Advisor voice
                Referee.voice('resource')[Game.race.selected].mine.play();
            }
            if(cost['gas'] && cost['gas']>Resource[team].gas){
                oweFlag=true;
                Game.showMessage('Not enough Vespene gases...harvest more gas');
                //Advisor voice
                Referee.voice('resource')[Game.race.selected].gas.play();
            }
            if(cost['man'] && cost['man']>(Resource[team].totalMan-Resource[team].curMan) && !Cheat.manUnlimited){
                oweFlag=true;
                switch(Game.race.selected){
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
            if(cost['magic'] && cost['magic']>this.magic){
                oweFlag=true;
                Game.showMessage('Not enough energy');
                //Advisor voice
                Referee.voice('resource')[Game.race.selected].magic.play();
            }
            if (oweFlag){
                //Payment failed
                return false;
            }
            else {
                if (!this.creditBill){
                    //Pay immediately
                    if(cost['mine']){
                        Resource[team].mine-=cost['mine'];
                    }
                    if(cost['gas']){
                        Resource[team].gas-=cost['gas'];
                    }
                    if(cost['magic']){
                        this.magic-=cost['magic'];
                    }
                }
                //Already paid
                return true;
            }
        }
        //No bill
        else return true;
    },
    //Pay credit card bill
    payCreditBill:function(){
        var cost=this.creditBill;
        //Paid credit bill, no longer owe money this time
        delete this.creditBill;
        return Resource.paypal.call(this,cost);
    }
};