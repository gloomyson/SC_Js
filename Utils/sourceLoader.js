var sourceLoader={
    sources:{},
    sourceNum:0,
    loadedNum:0,
    allLoaded:true,
    load:function(type,src,id){
        sourceLoader.sourceNum++;
        sourceLoader.allLoaded=false;
        var source;
        var loaded=function(){
            sourceLoader.loadedNum++;
            if(sourceLoader.loadedNum==sourceLoader.sourceNum){
                sourceLoader.allLoaded=true;
            }
        };//Code copy
        if (type=='img'){
            source=new Image();
            source.src=src;
            source.onload=loaded;
            sourceLoader.sources[id]=source;
        }
        if (type=='audio'){
            source=new Audio();
            source.addEventListener('canplaythrough',loaded,false);
            //source.oncanplaythrough=loaded;
            source.src=src;//Pose after listener to prevent fired early
            sourceLoader.sources[id]=source;
        }
        //For my Dojo: src==pathName
        if (type=='js'){
            var node=document.createElement('script');
            node.onload=function(){
                //Load builder
                _$.modules[src]=_$.define.loadedBuilders.shift();
                loaded();
            };
            node.src=src+'.js';
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    },
    allOnLoad:function(callback){
        if (sourceLoader.allLoaded) {
            callback();
        }
        else {
            //Show Load Process
            var LoadedBlock=document.getElementsByClassName('LoadedBlock')[0];
            if (LoadedBlock) LoadedBlock.style.width=(100*this.loadedNum/this.sourceNum)>>0+"%";//Math.round
            //Recursion
            setTimeout(function(){
                sourceLoader.allOnLoad(callback);
            },100);
        }
    }
};
