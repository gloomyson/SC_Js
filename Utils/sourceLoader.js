var SourceLoader={
    sources:new _$.Map(),
    sourceNum:0,
    loadedNum:0,
    allLoaded:true,
    load:function(type,src,id){
        SourceLoader.sourceNum++;
        SourceLoader.allLoaded=false;
        let source;
        let loaded=function(){
            SourceLoader.loadedNum++;
            if(SourceLoader.loadedNum==SourceLoader.sourceNum){
                SourceLoader.allLoaded=true;
            }
        };//Code copy
        if (type=='img'){
            source=new Image();
            source.src=src;
            source.onload=loaded;
            SourceLoader.sources.set(id,source);
        }
        if (type=='audio'){
            source=new Audio();
            source.addEventListener('canplaythrough',loaded,false);
            //source.oncanplaythrough=loaded;
            source.src=src;//Pose after listener to prevent fired early
            SourceLoader.sources.set(id,source);
        }
        //For my Dojo: src==pathName
        if (type=='js'){
            let node=document.createElement('script');
            node.onload=function(){
                //Load builder
                _$.modules[src]=_$.define.loadedBuilders.shift();
                loaded();
            };
            node.src=src+'.js';
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    },
    allOnLoad:function(callback=function(){}){
        if (this.allLoaded) {
            callback();
        }
        else {
            //Show Load Process
            $('div.LoadedBlock').css('width',(Math.round(100*SourceLoader.loadedNum/SourceLoader.sourceNum)+"%"));
            //Recursion
            setTimeout(()=>{
                this.allOnLoad(callback);
            },100);
        }
    }
};
