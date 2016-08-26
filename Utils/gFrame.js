//gFrame namespace: DOM selector function
var _$=function(selector){
    let selectors=selector.trim().split(' ');
    let result=document;//Overall
    for (let N=0;N<selectors.length;N++){
        let curSelector=selectors[N];
        let filter,filterIndex=curSelector.indexOf('[');
        if (filterIndex!=-1) {
            filter=curSelector.substring(filterIndex+1,curSelector.indexOf(']')).trim();
            curSelector=curSelector.substring(0,filterIndex);
        }
        if (curSelector.contains('#')) {
            let id=curSelector.split('#')[1];
            if (result.length) {
                let _result=[];
                for (let M=0;M<result.length;M++){
                    _result.push(result[M].getElementById(id));
                }
                result=_result;
            }
            else result=result.getElementById(id);
        }
        else {
            let TagName=curSelector.contains('.')?curSelector.split('.')[0]:curSelector;
            let [className,tagResult,classResult]=[curSelector.split('.')[1]];
            if (TagName){
                if (result.length) {
                    let _result=[];
                    for (let M=0;M<result.length;M++){
                        _result=_result.concat(_$.toArray(result[M].getElementsByTagName(TagName)));
                    }
                    tagResult=_result;
                }
                else tagResult=_$.toArray(result.getElementsByTagName(TagName));
            }
            if (className){
                if (result.length) {
                    let _result=[];
                    for (let M=0;M<result.length;M++){
                        _result=_result.concat(_$.toArray(result[M].getElementsByClassName(className)));
                    }
                    classResult=_result;
                }
                else classResult=_$.toArray(result.getElementsByClassName(className));
            }
            if (TagName && !className) result=tagResult;
            if (!TagName && className) result=classResult;
            if (TagName && className) {
                //The intersection of tagResult and classResult
                result=tagResult.filter(function(item){
                    return (classResult.indexOf(item)!=-1);
                });
            }
        }
        //Apply filter
        if (filter){
            //Attribute value filter
            if (filter.indexOf('=')!=-1){
                let attr=filter.split('=')[0];
                let val=eval(filter.split('=')[1]);
                result=result.filter(function(item){
                    return item.getAttribute(attr)==val;
                });
            }
            //Has attribute filter
            else {
                let attr=filter;
                result=result.filter(function(item){
                    return item.getAttribute(attr)!=null;
                });
            }
        }
    }
    return result;
};

String.prototype.contains=function(str){
    return this.indexOf(str)!=-1;
};
Object.defineProperty(String.prototype,'contains',{enumerable:false});

window.requestAnimationFrame=requestAnimationFrame || webkitRequestAnimationFrame ||
    mozRequestAnimationFrame || msRequestAnimationFrame || oRequestAnimationFrame;
/*window.cancelRequestAnimationFrame=cancelRequestAnimationFrame || webkitCancelRequestAnimationFrame ||
    mozCancelRequestAnimationFrame || msCancelRequestAnimationFrame || oCancelRequestAnimationFrame;*/

//Gobj is game object,initial by only one parameter props
Function.prototype.extends=function(addInObject){
    //father call extends to produce child
    let father=this;
    //Create child self as constructor function
    let child=function(props){
        //If props==null, will throw errors during construction
        if (props){
            //Execute old constructor
            father.call(this,props);
            //Add new into child constructor
            addInObject.constructorPlus.call(this,props);//this.constructorPlus(props)
        }
    };
    //Inherit prototype from father, clear redundant properties inside father constructor
    /*//We don't need properties constructed by {}, constructor not changed;
    child.prototype.__proto__=father.prototype;//__proto__ isn't supported by IE9 and IE10, IE11 supports*/
    Object.setPrototypeOf(child.prototype,father.prototype);
    //Add new functions into child.prototype
    Object.assign(child.prototype,addInObject.prototypePlus);

    /*****Add super&inherited pointer for instance*****/
    //The upper constructor is super
    child.prototype.super=father;
    Object.defineProperty(child.prototype,'super',{enumerable:false});
    //Behaviors including constructor are inherited by child, can find depreciated
    child.prototype.inherited=father.prototype;//Behavior always in prototype
    Object.defineProperty(child.prototype,'inherited',{enumerable:false});
    /*****Generate super&inherited pointer link*****/
    child.super=father;
    Object.defineProperty(child,'super',{enumerable:false});
    child.inherited=father.prototype;
    Object.defineProperty(child,'inherited',{enumerable:false});

    return child;
};
Object.defineProperty(Function.prototype,'extends',{enumerable:false});

//Extend Audio
Audio.prototype.playFromStart=function(){
    this.pause();
    this.currentTime=0;
    this.play();
};
Object.defineProperty(Audio.prototype,'playFromStart',{enumerable:false});

//Extend Array
Array.gen=function(N,start){
    if (start==null) start=0;
    let result=[];
    for (let n=start;n<(N+1);n++){
        result.push(n);
    }
    return result;
};
Object.defineProperty(Array,'gen',{enumerable:false});
Array.prototype.repeat=function(N,flag){
    let result=[];
    if (flag){
        for (let n=0;n<this.length;n++){
            result=result.concat(new Array(N).fill(this[n]));
        }
    }
    else {
        for (let n=0;n<N;n++){
            result=result.concat(this);
        }
    }
    return result;
};
Object.defineProperty(Array.prototype,'repeat',{enumerable:false});
Array.prototype.del=function(index,N){
    this.splice(index,N);
    return this;
};
Object.defineProperty(Array.prototype,'del',{enumerable:false});
Array.prototype.insert=function(index,arr){
    this.splice(index,0,...arr);
    return this;
};
Object.defineProperty(Array.prototype,'insert',{enumerable:false});

/**************** Add to _$ namespace *******************/

_$.requestAnimationFrame=requestAnimationFrame || webkitRequestAnimationFrame ||
    mozRequestAnimationFrame || msRequestAnimationFrame || oRequestAnimationFrame;

_$.extends=function(fathers,addInObject){
    //Create child self as constructor function
    let child=function(props){
        if (fathers instanceof Array){
            const myself=this;
            fathers.forEach(function(father){
                father.call(myself,props);
            });
            //Add new into child constructor
            addInObject.constructorPlus.call(this,props);
        }
        else throw('_$.extends need array type parameter fathers!');
    };
    if (fathers.length>0){
        let mixinProto=fathers[0].prototype;
        for (N=1;N<fathers.length;N++){
            //Mixin interfaces
            mixinProto=_$.delegate(mixinProto,fathers[N].prototype);
            //Still instanceof interface == false
            mixinProto.constructor=fathers[N];
        }
        child.prototype=_$.delegate(mixinProto,addInObject.prototypePlus);
        child.prototype.constructor=child;
    }
    else {
        //Original method
        for (let attr in addInObject.prototypePlus){
            child.prototype[attr]=addInObject.prototypePlus[attr];
        }
    }
    return child;
};

//_$.mixin == $.extend
_$.mixin=function(...args){
    switch (args.length){
        case 0:
            return {};
        default:
            let [dist,...addIns]=args;
            addIns.forEach(addIn=>{
                Object.assign(dist,addIn);
            });
            return dist;
    }
};
//Can only copy one level, copy reference
_$.copy=function(obj){
    //Auto detect obj/array
    return _$.mixin(new obj.constructor(),obj);
};
//Full traverse copy, copy one level when ref=true
_$.clone=function(obj,ref){
    //Auto detect obj/array
    let dist=new obj.constructor();
    for (let attr in obj){
        //Cannot just assign pointer if it's object type
        if (typeof(obj[attr])=="object" && !ref) {
            dist[attr]=_$.clone(obj[attr]);
        }
        //Can only assign simple type(number/boolean/string)
        else dist[attr]=obj[attr];
        //dist[attr]=(typeof(obj[attr])=="object")?_$.clone(obj[attr]):obj[attr];
    }
    return dist;
};

//Template
_$.templates={
    src:{},
    //register ?id as ?tempStr
    register:function(id,tempStr){
        let tempObj={};
        tempObj.tempStr=tempStr;
        //Auto search for params
        tempObj.params=tempStr.match(/\${2}\w{1,}\${2}/g);// /RegExp/go,NoStop
        _$.templates.src[id]=tempObj;
    },
    //apply template ?id with ?values
    applyOn:function(id,values) {
        let valueArray=[].concat(values);//Convert to array
        let src=_$.templates.src[id];//Get src template object
        let result=src.tempStr;//Get original template
        for (let N=0;N<Math.min(valueArray.length,src.params.length);N++){
            result=result.replace(src.params[N],valueArray[N]);
        }
        return result;
    }
};

_$.traverse=function(obj,func){
    for (let attr in obj){
        if (typeof(obj[attr])=="object"){
            _$.traverse(obj[attr],func);
        }
        else {
            //Callback
            func(obj[attr]);
        }
    }
};

_$.matrixOperation=function(matrix,operation){
    for (let attr in matrix){
        if (typeof(matrix[attr])=="object"){//array or object
            _$.matrixOperation(matrix[attr],operation);
        }
        else {
            matrix[attr]=operation(matrix[attr]);
        }
    }
};

//Map traverse for array
_$.mapTraverse=function(array,operation){
    let operationTraverse=function(n){
        if (n instanceof Array) return n.map(operationTraverse);
        else return operation(n);
    };
    return array.map(operationTraverse);
};

//Array equals array
_$.arrayEqual=function(arr1,arr2){
    if (arr1.length==arr2.length){
        for (let n=0;n<arr1.length;n++){
            //Content not same
            if (arr1[n]!=arr2[n]) return false;
        }
        return true;
    }
    //Length not same
    else return false;
};

/**********Dojo relative**********/
_$.modules={};
//Script loader
_$.SourceLoader={
    sources:new Map(),
    sourceNum:0,
    loadedNum:0,
    allLoaded:true,
    load:function(pathName){
        _$.SourceLoader.sourceNum++;
        _$.SourceLoader.allLoaded=false;
        //Type=="script"
        let node=document.createElement('script');
        node.onload=function(){
            //Load builder
            _$.modules[pathName]=_$.define.loadedBuilders.shift();
            _$.SourceLoader.loaded();
        };
        //Block this module, should not load again
        _$.modules[pathName]=true;
        node.src=pathName+'.js';
        document.getElementsByTagName('head')[0].appendChild(node);
    },
    loaded:function(){
        _$.SourceLoader.loadedNum++;
        if(_$.SourceLoader.loadedNum==_$.SourceLoader.sourceNum){
            _$.SourceLoader.allLoaded=true;
        }
    },
    allOnLoad:function(callback=function(){}){
        if (_$.SourceLoader.allLoaded) {
            callback();
        }
        else {
            setTimeout(function(){
                _$.SourceLoader.allOnLoad(callback);
            },100);
        }
    }
};
//Async instantiate
_$.instModule=function(name){
    //Add module instantiate stack
    _$.instModule.refStack.push(name);
    //Instantiate module constructor
    let module=_$.modules[name];
    //Now instantiate builder function
    if (module._$isBuilder){
        let refObjs=[];
        if (module.refArr) {
            module.refArr.forEach(function(ref){
                //Recursion instantiate
                if (ref[0]=='=') {
                    //Closure
                    let loc=ref.substr(1);
                    refObjs.push(function(){
                        return _$.modules[loc];
                    });
                }
                else {
                    if (_$.instModule.refStack.indexOf(ref)!=-1) {
                        //Auto detect loop reference
                        throw `Loop reference found: ${name} --> ${ref}`;
                    }
                    refObjs.push(_$.instModule(ref));
                }
            });
        }
        //Override module function with instance
        _$.modules[name]=module.apply(window,refObjs);
    }
    _$.instModule.refStack.pop();
    return _$.modules[name];
};
_$.instModule.refStack=[];
//Register module builder function into _$.modules
_$.define=function(refArr,builderFunc){
    refArr.forEach(function(ref){
        if (ref[0]=='=') return;
        //Recursion loading if that module not loaded
        if (!_$.modules[ref]) _$.SourceLoader.load(ref);
    });
    //Builder loaded
    builderFunc.refArr=refArr;
    builderFunc._$isBuilder=true;
    _$.define.loadedBuilders.push(builderFunc);
    //_$.modules[pathName]=builderFunc;
};
_$.define.loadedBuilders=[];
//Run callback functions with module references
_$.require=function(refArr,callback=()=>{}){
    refArr.forEach(function(ref){
        if (ref[0]=='=') return;
        //Recursion loading if that module not loaded
        if (!_$.modules[ref]) _$.SourceLoader.load(ref);
    });
    _$.SourceLoader.allOnLoad(function(){
        let refObjs=[];
        refArr.forEach(function(ref){
            //Recursion instantiate
            refObjs.push(_$.instModule(ref));
        });
        callback.apply(window,refObjs);
    });
};
//Constructor extension: changed to multiple inherit
_$.declare=function(globalName,fathers,plusObj){
    if (arguments.length==2){
        plusObj=fathers;
        fathers=globalName;
        globalName=null;
    }
    if (!fathers) fathers=[];
    let constructPlus=plusObj.constructor;
    delete plusObj.constructor;
    let protoPlus=plusObj;
    let child=_$.extends(fathers,{constructorPlus:constructPlus,prototypePlus:protoPlus});
    if (globalName) window[globalName]=child;
    return child;
};

//Publish & Subscribe topic
_$.topic={};
_$.subscribe=function(topic,callback){
    if (!_$.topic[topic]) _$.topic[topic]={callbacks:[]};
    _$.topic[topic].callbacks.push(callback);
};
//Need add .owner on callback to identify who is subscriber
_$.unSubscribe=function(topic,callback){
    if (_$.topic[topic] && _$.topic[topic].callbacks){
        let index=_$.topic[topic].callbacks.indexOf(callback);
        _$.topic[topic].callbacks.splice(index,1);
    }
};
_$.publish=function(topic,msgObj){
    if (_$.topic[topic]){
        _$.topic[topic].callbacks.forEach(function(callback){
            callback.call(window,msgObj);
        })
    }
};

//lang.delegate:cover with one proto layer
_$.delegate=function(chara,bufferObj){
    let func=function(){};
    func.prototype=chara;
    return _$.mixin(new func(),bufferObj);
};

//lang.hitch:bind context this with function
_$.hitch=function(func,thisP){
    //Higher-order function: compress this pointer into closure here
    return function() {
        func.apply(thisP,arguments);
    };
};

//Convert array-like to real array
_$.toArray=function(arr){
    let result=[];
    for (let N=0;N<arr.length;N++){
        result.push(arr[N]);
    }
    return result;
};

//Backup for name collision
_$.Map=Map;

//Extension for ES6 class extends
_$.protoProps=Symbol('protoProps');
_$.levelUpProps=Symbol('levelUpProps');
//Decorator: @classPatch
_$.classPatch=function(targetClass){
    if (targetClass[_$.protoProps]){
        Object.assign(targetClass.prototype,targetClass[_$.protoProps]());
        //delete targetClass[_$.protoProps];
    }
};
//Decorator: @classPackagePatch
_$.classPackagePatch=function(targetObj){
    for (let charaType of Object.keys(targetObj)){
        _$.classPatch(targetObj[charaType]);
    }
};
