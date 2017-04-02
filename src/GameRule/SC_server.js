var http=require('http');
var httpServer=http.createServer(function(request,response){
    console.log('Receive request from '+request.url);
    response.end('');
});
httpServer.listen(28082);
console.log('HTTP server starts listening port 28082...');
var wsServer=new (require('websocket').server)({
    httpServer:httpServer
});//Closure
wsServer.rooms=[];
var multiPlayerNum=2;//Closure
var webSockets=[];//Closure
var getServerTime=function(){
    var now=new Date();
    var timestamp=now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '
        +now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
    return timestamp;
};
wsServer.on('request',function(request){
    var socket=request.accept();//Closure
    var latencyMeasures=[{start:new Date()}];//Closure
    var IP=request.remoteAddress;//Closure
	webSockets.push(socket);
    console.log(getServerTime()+' '+IP+' is connected...');
    socket.send(JSON.stringify({type:'ping'}));
	socket.on('message',function(message){
		var data=message.utf8Data;
		data=JSON.parse(data);
        switch(data.type){
            case 'pong':
                var times=latencyMeasures.length;
                latencyMeasures[times-1].end=new Date();
                //console.log('Receive pong '+times);
                if (times==5) {
                    var latency=0;
                    latencyMeasures.forEach(function(latencyMeasure){
                        latency+=(latencyMeasure.end-latencyMeasure.start);
                    });
                    latency=(latency/times)>>0;
                    socket.tickLag=Math.ceil(latency*2/100);//Can adjust it here
                    console.log(IP+' average latency is '+latency);
                    console.log(IP+' tick lag is '+socket.tickLag);
                    if (webSockets.length==multiPlayerNum){
                        //Game start: Init new room
                        var room={id:wsServer.rooms.length,webSockets:webSockets};//Closure
                        webSockets=[];
                        console.log('Open room '+room.id);//test
                        room.tick=0;
                        room.clientTicks=[];
                        for (var N=0;N<multiPlayerNum;N++){
                            room.clientTicks.push(0);
                        }
                        room.replay={};
                        room.roomLag=0;
                        //Inner name list for each socket
                        var names=['Tom','John','Steve','Mike','Cindy','Emile'];//Closure for each room
                        var colors=['yellow','orange','lime','aqua','violet','red'];//Closure for each room
                        //Set max latency as roomLag
                        room.webSockets.forEach(function(socket){
                            if (room.roomLag<socket.tickLag) room.roomLag=socket.tickLag;//max
                            socket.room=room;
                        });
                        room.webSockets.forEach(function(socket,N){
                            socket.team=N;
                            //Give a random name
                            var index=Math.random()*names.length>>0;
                            socket.name=names[index];
                            socket.color=colors[index];
                            names.splice(index,1);
                            colors.splice(index,1);
                            socket.send(JSON.stringify({type:'start',team:N}));
                            //Start server ticking, trigger clients
                            socket.send(JSON.stringify({type:'tick',tick:(room.tick+room.roomLag)}));
                        });
                        wsServer.rooms.push(room);
                        //Start server ticking
                        setInterval(function(){
                            var minTick=Math.min.apply({},room.clientTicks);
                            //console.log('minTick:'+minTick);
                            if (room.tick<minTick) {
                                room.tick++;
                                //console.log('ServerTick:'+room.tick+' roomLag:'+room.roomLag+' minTick:'+minTick);//test
                                var sendTick=(room.tick+room.roomLag);
                                room.webSockets.forEach(function(webSocket){
                                    webSocket.send(JSON.stringify({type:'tick',tick:sendTick,cmds:room.cmds}));
                                });
                                if (room.cmds) {
                                    room.replay[sendTick]=room.cmds;
                                    room.cmds=null;//Clear
                                }
                            }
                        },100);
                    }
                    else {
                        socket.send(JSON.stringify({type:'notice',msg:('CurrentPlayer:'+webSockets.length+'/'+multiPlayerNum)}));
                    }
                }
                else {
                    socket.send(JSON.stringify({type:'ping'}));
                    latencyMeasures.push({start:new Date()});
                }
                break;
            case 'tick':
                var clientTick=(data.tick+socket.tickLag);
                socket.room.clientTicks[socket.team]=clientTick;
                if (data.cmds) {
                    if (!socket.room.cmds) socket.room.cmds=[];
                    socket.room.cmds=socket.room.cmds.concat(data.cmds);//Multiple cmds in one frame
                }
                //console.log('Team'+socket.team+':'+data.tick);//test
                break;
            case 'chat':
                if (socket.room){
                    socket.room.webSockets.forEach(function(webSocket){
                        webSocket.send(JSON.stringify({type:'notice',msg:'<span style="color:'+socket.color+'">'+socket.name+': '+data.msg+'</span>'}));
                    });
                }
                break;
            case 'getReplay':
                socket.send(JSON.stringify({type:'replay',replay:socket.room.replay}));
                break;
            case 'login':
                console.log(getServerTime()+' '+IP+' login to level '+data.level+' in team '+data.team);
                console.log(IP+' Version: '+data.version);
                console.log(IP+' Browser: size={x:'+data.size.x+',y:'+data.size.y+'} lang='+data.language+' OS='+data.platform);
                break;
            case 'snapshot':
                console.log('\n####### '+getServerTime()+' '+IP+' snapshot No.'+data.num+' #######');
                console.log('Click statistics: left='+data.click.left+' right='+data.click.right);
                console.log('Unit statistics: ours='+data.count.ourUnits+' enemies='+data.count.enemyUnits);
                if (data.count.ourUnits+data.count.enemyUnits<20) console.log(data.units);
                console.log('Building statistics: ours='+data.count.ourBuildings+' enemies='+data.count.enemyBuildings);
                if (data.count.ourBuildings+data.count.enemyBuildings<20) console.log(data.buildings);
                console.log('##########################################\n');
                break;
            case 'replaySnapshot':
                socket.replaySnapshot=JSON.stringify(data.replaySnapshot);
                break;
            case 'log':
                //Just print out
                console.log(data.log);
		}
    });
	socket.on('close',function(message){
        //Broadcast disconnect info
        var msg=(getServerTime()+' '+(socket.name?socket.name:IP)+' has left from game...');
        console.log(msg);
        //Print replay
        if (socket.replaySnapshot) {
            console.log('################ '+IP+' replay: ################');
            console.log(socket.replaySnapshot);
            console.log('################################################################');
        }
        //Kick off losing connection user
        if (socket.room){
            var webSockets=socket.room.webSockets;
            webSockets.splice(webSockets.indexOf(socket),1);
            //Make game to continue without player control
            socket.room.clientTicks[socket.team]=Number.MAX_VALUE;
            webSockets.forEach(function(webSocket){
                webSocket.send(JSON.stringify({type:'notice',msg:msg}));
            });
        }
    });
});
