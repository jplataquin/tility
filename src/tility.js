/*!
 * Tility v1.1.0
 * A suite of javascript classes that will help you build front end web interfaces.
 *
 * Author John Patrick Lataquin
 * Released under the MIT license
 * 
 * Software authors provide no warranty with the software and are not liable for anything.
 *
 * Date: 2020-04-05
 */

class Template {

    constructor(){

        //Setup private variables
        let content = document.createDocumentFragment();
        let og      = content;

        /** Setup private methods **/

        //Create stylesheet values for attribute style
        let toCSS   = function(param){ 

            if(Array.isArray(param)){

                let obj = {};
                param.map(item=>{
                    obj = Object.assign(obj,item);
                });

                param = obj;
            }

            let style = [];

            for(let key in param){

                let dashed = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
                style.push(dashed+':'+param[key]);
            }

            return style.join(';');
        };

        //Apply attributes to element
        let applyAttributes = function(el,param){
           
            for(var key in param){

                if(key == 'style'){
                    param[key] = toCSS(param[key]);
                }

                let text = document.createTextNode(param[key]);
                let dummy = document.createElement('p');
                dummy.appendChild(text);
    
                el.setAttribute(key,dummy.innerText);
                    
                   
            }  
           
        };

        //Start element
        let start = function(el){
            content = el;
        };

        //Ending element
        let end = function(el){
            content = el.parentElement || og;
        };

        //Setup elements with attributes and custom methods
        let processElement = function(type,param,callback){
           
            let el = null;
            
            if(typeof type == 'object'){
                el = type;
            }else {

                if(type == 'frag'){
                    el = document.createDocumentFragment();
                }else {
                    el = document.createElement(type);
                }
            }
     
            if(typeof param == 'object'){
                applyAttributes(el,param);
            }

            else if(typeof param == 'string'){
                el.innerHTML = param;
            }

            else if(typeof param == 'function'){
                callback = param;
            }

            el.tmpl = {};

            el.tmpl.text = function(val){
                let dummy = document.createElement('p');
                dummy.textContent = val;
                el.innerHTML = dummy.innerHTML;
            };
            
            el.tmpl.onRender = function(cb){

                let observer = new MutationObserver(function(mutations) {
                   if (document.contains(el)) {
                        
                       // if(el.width != 0 || el.height != 0){
                            cb();
                            observer.disconnect();
                       // }
                      
                    }
                });

                observer.observe(document, {childList: true,subtree:true});

                /**
                let i = setInterval(function(){

                   if(el.offsetWidth > 0 || el.offsetHeight > 0){
                        clearInterval(i);
                        cb();
                   }else if(document.body.contains(el)){
                        clearInterval(i);
                        cb();
                   }

                },500);
                **/
                
            }

            el.tmpl.observe = function(config){

                let callback =[];

                let observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        callback.map( (cb) =>{ 
                            cb(mutation,observer); 
                        });
                    });
                });
                
                
                observer.observe(el,config);


                return {
                    on:function(cb){
                        callback.push(cb);
                        return callback.length;
                    },
                    disconnect: function(){
                        observer.disconnect();
                    },
                    takeRecords: function(){
                        observer.takeRecords();
                    }
                };
            };

            el.tmpl.shadow = function(mode,dom){
                el.attachShadow({mode:mode}).append(dom);
            };

            //Append element to content
            content.append(el);
           
            if(typeof callback == 'function'){
               
                //Arrange elements in correct order
                start(el);
                    callback(el);
                end(el);
               
            }else if(typeof callback == 'string'){

                 //Arrange elements in correct order
                 start(el);

                    let t = document.createTextNode(callback);
            
                    content.append(t);
 
                 end(el);
            }

           
            return el;
        };

        /** Setup public methods which have access to private methods **/
        
        //List of HTML tags
        let tags = [
            "a",
            "abbr",
            "acronym",
            "address",
            "applet",
            "area",
            "article",
            "aside",
            "audio",
            "b",
            "base",
            "basefont",
            "bdi",
            "bdo",
            "bgsound",
            "big",
            "blink",
            "blockquote",
            "body",
            "br",
            "button",
            "canvas",
            "caption",
            "center",
            "cite",
            "code",
            "col",
            "colgroup",
            "content",
            "data",
            "datalist",
            "dd",
            "decorator",
            "del",
            "details",
            "dfn",
            "dir",
            "div",
            "dl",
            "dt",
            "element",
            "em",
            "embed",
            "fieldset",
            "figcaption",
            "figure",
            "font",
            "footer",
            "form",
            "frame",
            "frameset",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "head",
            "header",
            "hgroup",
            "hr",
            "html",
            "i",
            "iframe",
            "img",
            "input",
            "ins",
            "isindex",
            "kbd",
            "keygen",
            "label",
            "legend",
            "li",
            "link",
            "listing",
            "main",
            "map",
            "mark",
            "marquee",
            "menu",
            "menuitem",
            "meta",
            "meter",
            "nav",
            "nobr",
            "noframes",
            "noscript",
            "object",
            "ol",
            "optgroup",
            "option",
            "output",
            "p",
            "param",
            "plaintext",
            "pre",
            "progress",
            "q",
            "rp",
            "rt",
            "ruby",
            "s",
            "samp",
            "script",
            "section",
            "select",
            "shadow",
            "small",
            "source",
            "spacer",
            "span",
            "strike",
            "strong",
            "sub",
            "summary",
            "sup",
            "table",
            "tbody",
            "td",
            "template",
            "textarea",
            "tfoot",
            "th",
            "thead",
            "time",
            "title",
            "tr",
            "track",
            "tt",
            "u",
            "ul",
            "var",
            "video",
            "wbr",
            "xmp"
        ];

        //Attach HTML tags as methods
        tags.map( (name)  => {
            this[name] = function(param,callback){
                return processElement(name,param,callback);
            };

            //Compile content to a dom fragment and clear content
        
        });


        //Strange hack to prevent users from overiding main methods
        let dum = [1];
        dum.map(()=>{

            //Setup method for textNode
            this.txt = function(value){
                var t = document.createTextNode(value);
            
                content.append(t);

                return t;
            };

            //Setup method for documentFragment
            this.frag = function(callback){
                return processElement('frag',{},callback);
            };

            //Setup method for style tag
            this.style = function(css){
            
                var style = processComponent('style',{},()=>{});
                let stylesheet = "\n";

                //Prepare stylesheet
                Object.keys(css).map((selector) => {

                    //Free text mode
                    if(selector == '--'){
                        
                        stylesheet += css[selector]+"\n";

                    }else {

                        //Key value pair mode
                        stylesheet += "["+styleScope+"] "+selector+" {\n";

                            for(let key in css[selector]){
                                stylesheet += "\t"+key+':'+css[selector][key]+";\n";
                            }
                        
                        stylesheet += "} \n\n";
                    }
                });

                //Setup stylesheet
                style.innerHTML = stylesheet;
            
                return style;
            };

            //Create method to handle dom elements and string input
            this.el = function(el,param,callback){
            
                if(typeof el == 'string'){
                    
                    /**
                    let n = document.createDocumentFragment();

                    let div = document.createElement('div');

                    div.innerHTML = el;

                    let childArray = Array.from(div.children);
                    
                    childArray.forEach((child)=>{
                        n.append(child);
                    });
                    
                    el = n;
                     */

                    let div = document.createElement('div');

                    div.innerHTML= el.trim();

                    el = div;
                }

                return processElement(el,param,callback);
            };

            //Method to define element and add custom element as method to template
            this.defineElement = function(name, options, constructor){
            
                customElements.define(name, constructor, options);
            
                this[ name.replace(/\-/g,'_') ] = function(param,callback){
                    return processElement(name,param,callback);
                }; 

            };

            //Compile dom
            this.compile = function(){
                let buffer = content;
                content = document.createDocumentFragment();
                og = content;
                return buffer;
            };

            //Helper functions
            this.helper = {
                htmlEscape:(val)=>{
                    let text = document.createTextNode(val);
                    let dummy = document.createElement('p');
                    dummy.appendChild(text);
        
                    return dummy.innerText;
                }
            };
        });
     
      
     }


     //Helper method to extract the parameters & the callback from the method's arguments
     reduce(args){

        args[0] = args[0] || {};
        args[1] = args[1] || null;
       
        let _param = {};
        let _cb = function(){};

        if(typeof args[0] == 'function'){
            _cb = args[0];

        }else {
            _param = args[0];
        }
        
        if(typeof args[1] == 'function'){
            _cb = args[1];
        }

        _cb.bind(this);

        return {
            callback: _cb,
            param:_param
        }
    }

}

class View {

    constructor(data){
        

        //Set up private variables
        let styleScope  = 'data-tility-view-'+Date.now();
        let style       = document.createElement('style');
        let css         = this.style('['+styleScope+']',data);
        let stylesheet  = "\n";
        let area        = {};
        let ctrl        = this.controls(area,data);
        

        //Set up content
        this.content = document.createElement('div');
        this.content.setAttribute(styleScope,true);

        //Prepare stylesheet
        Object.keys(css).map((selector) => {

            //Free text mode
            if(selector == '--'){
                
                stylesheet += css[selector]+"\n";

            }else {

             
                //Key value pair mode
                stylesheet += "["+styleScope+"] "+selector+" {\n";

                    for(let key in css[selector]){

                        let dashed = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
                
                        stylesheet += "\t"+dashed+':'+css[selector][key]+";\n";
                    }
                
                stylesheet += "} \n\n";
            }
        });

        //Setup stylesheet
        style.innerHTML = stylesheet;
        this.content.append(style);
        
         //init
        this.init(data);
        
        //Get areas
        area = this.areas();

        //Prepare template
        this.content.append(this.template(area,data));
        
        //Initialize script
        this.script(data);

        //Attach setArea method
        this.content.setArea = function(name,view){
            
            if(area[name].firstChild){

                if(area[name].firstChild == view) return false;

                let onRemoveEvent = new CustomEvent('tility-on-remove');
                
                area[name].firstChild.dispatchEvent(onRemoveEvent);
                area[name].innerHTML = '';
                area[name].append(view)

                let onInsertEvent = new CustomEvent('tility-on-mount'); 
                view.dispatchEvent(onInsertEvent);

                return true;

            }else{
                area[name].innerHTML = '';
                area[name].append(view);

                let onInsertEvent = new CustomEvent('tility-on-mount'); 
                view.dispatchEvent(onInsertEvent);
                
                return true;
            }
            
        };
        
        //Attach public controls to content
        Object.keys(ctrl).map((key)=>{

            if(typeof this.content[key] == 'undefined'){
                this.content[key] = ctrl[key];
            }else {
                throw('The method or property "'+key+'" already exist in the content view of class "'+this.constructor.name+'" and it cannot be overwritten by controls()');
            }
            
        });

        this.content.addEventListener('tility-on-remove',(e)=>{

            this.onRemove(e);

            let ev = new CustomEvent('tility-on-remove');

            e.target.querySelectorAll('*').forEach(item=>{
            
                item.dispatchEvent(ev);

            });
            
           
            
           
        });

        this.content.addEventListener('tility-on-mount',(e)=>{

            this.onMount(e);

            let ev = new CustomEvent('tility-on-mount');

            e.target.querySelectorAll('*').forEach(item=>{
            
                item.dispatchEvent(ev);

            });

           
            
        });


        this.content.reload = (newData)=>{
            
            //If their is new data then overwrite old one
            data = (typeof newData == 'undefined' || newData == null) ? data : newData;

            //Clear the content
            this.content.innerHTML = '';

            this.content.append(style);
        
             //init
            this.init(data);
            
            //Get areas
            area = this.areas();

            //Prepare template
            this.content.append(this.template(area,data));
            
            //Initialize script
            this.script(data);
        }

        return this.content;
    }

    template(area,data){
        return document.createDocumentFragment();
    }

    init(data){}
    
    script(data){}

    areas(){
       return {};
    }

    controls(area,data){
        return {};
    }

    style(data,scope){
        return {};
    }

    onRemove(){}

    onMount(){}
}


function controller(target,view){

    if(target.firstChild == view){
        return false;
    }

    if(target.firstChild){
        let onRemoveEvent = new CustomEvent('tility-on-remove');
        target.firstChild.dispatchCustomEvent(onRemoveEvent);
    }
    

    target.innerHTML = '';
    target.append(view);

    let onInsertEvent = new CustomEvent('tility-on-mount'); 
    view.dispatchEvent(onInsertEvent);
                
}

class State{

    constructor(){

        //Initialize global state and subscribers
        if(typeof window.tilityAppState == 'undefined'){
            window.tilityAppState = {};
        }

        if(typeof window.tilityAppStateSubscribers == 'undefined'){
            window.tilityAppStateSubscribers = [];
        }

        
        try{
            window.indexedDB        = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            window.IDBTransaction   = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
            window.IDBKeyRange      = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
        }catch(e){}


        let openRequest = indexedDB.open("TilityAppState", 1);

        openRequest.onupgradeneeded = (e)=>{
            console.log('upgrade indexedDB');
            let db = e.target.result;

            db.createObjectStore('state', {keyPath: '_time'});

        };

        openRequest.onerror = (e)=>{
            console.error("Error", openRequest.error);
            let db = e.target.result;
     
        };

        openRequest.onsuccess = (e)=>{
            let db = e.target.result;
        };

        this.localSubscriber = [];
    }

    saveState(){

        return new Promise((resolve,reject)=>{

            
            let openRequest = indexedDB.open("TilityAppState", 1);

            openRequest.onsuccess = (e)=>{

                let db                  = openRequest.result;
                let transaction         = db.transaction(["state"],'readwrite');
                let objectStore         = transaction.objectStore('state');
                let openCursorRequest   = objectStore.openCursor(null, 'prev');

                let save = {};

                for(let key in tilityAppState){
                    
                    if(tilityAppState[key].persistent){
                        save[key] = tilityAppState[key];
                    }
                }

 
                openCursorRequest.onsuccess =  (event) => {

                    if (event.target.result) {
                        let prevState       = event.target.result.value;
                        let flagHasChanged  = false;
                        
                        for(let key in save){

                            if(typeof prevState[key] == 'undefined' && key != '_time'){
                                flagHasChanged = true;
                            }else if(prevState[key].value != save[key].value){
                                flagHasChanged = true;
                            }
                        }

                        if(Object.keys(prevState).length-1 != Object.keys(save).length){
                            flagHasChanged = true;
                        }

                        if(flagHasChanged){
                            
                            save._time = Date.now();
                            let request = db.transaction(['state'],'readwrite').objectStore('state').add(save);
                            request.onsuccess = function(event) {
                                resolve(event);
            
                            };
                            
                            request.onerror = function(event) {
                                reject(event);
            
                            }
            
                            db.close();
                        }

                    }else{

                        save._time = Date.now();
                        let request = db.transaction(['state'],'readwrite').objectStore('state').add(save);
                        request.onsuccess = function(event) {
                            resolve(event);
        
                        };
                        
                        request.onerror = function(event) {
                            reject(event);
        
                        }
        
                        db.close();
                    }
                }

                
            };

            openRequest.onerror = (e)=>{
                let db = e.target.result;
                
                db.close();
        
                reject(e);
                
            };

            

        });
     
    }

    loadLastState(){

        return new Promise((resolve,reject)=>{
           
            let openRequest = indexedDB.open("TilityAppState", 1);

            openRequest.onsuccess = ()=>{

                let db                  = openRequest.result;
                let transaction         = db.transaction(["state"],'readwrite');
                let objectStore         = transaction.objectStore('state');
                let openCursorRequest   = objectStore.openCursor(null, 'prev');
                
                openCursorRequest.onsuccess =  (event) => {

                    if (event.target.result) {
                        let state = event.target.result.value;
                        
                        for(let key in tilityAppState){

                            if(typeof tilityAppState[key].persistent != 'undefined'){

                                if(tilityAppState[key].persistent){

                                    if(typeof state[key] != 'undefined'){
                                        this.setState(key, state[key].value );
                                    }//if
                                    
                                }//if
                            }//if
                                                        
                        }//for

                        
                    }//if

                    resolve(event);
                };
        
                openCursorRequest.onerror = (event) => {
                    console.log('Error cannot load last state');
                    reject(event);
                    
                };

                db.transaction.oncomplete = ()=>{
                    db.close();
                }
            };
           

        });
      
    }



    register(name,value,rules,persistent){
        //Check if state exists
        if(typeof tilityAppState[name] == 'undefined'){
            
            //Register state
            tilityAppState[name] = {
                value:value,
                rules:rules,
                persistent: persistent,
                time: Date.now()
            };
            

            return true;
        }

        return false;
    }

    subscribe(key,name,callback){

        //Check if callback is a function
        if(typeof callback != 'function'){
            throw('Subscriber callback must be a type of function');
            return false;
        }

        if(typeof key == 'undefined'){
            throw('A unique key is required');
            return false;
        }

        if(typeof name == 'undefined'){
            throw('Name of state is required');
            return false;
        }

        let flag = false;

        tilityAppStateSubscribers.map(item=>{

            if(item.key == key){
                item.callback = callback;                
                flag = true;
            }
        });

        if(flag){

            let value = this.getState(name);
           
            callback(value,value);

            return false;
        }

        let sub = {key:key, name:name,callback:callback,index:null};



        //Add subscriber
        tilityAppStateSubscribers.push(sub);

        //Set index of subscriber
        sub.index = tilityAppStateSubscribers.length-1;

        let value = this.getState(name);
        
        callback(value,value);
        
        this.localSubscriber.push(sub.index);

        return sub;
    }

    unsubscribe(sub){

        this.localSubscriber.map((item,i) => {

            if(item == sub.index){
                this.localSubscriber.splice(i,1);
            }
        });

        //Check if subscriber index exists
        if(typeof tilityAppStateSubscribers[sub.index] != 'undefined'){

            //Check if subscriber is deleted
            if(tilityAppStateSubscribers[sub.index] == null) return false;

            //Check if the subscriber callback are the same
           // if(tilityAppStateSubscribers[sub.index].callback == sub.callback){
                tilityAppStateSubscribers[sub.index] = null;//Turn subscriber to null so indices are preserved
                return true;
            //}
        }

        return false;
    }

    unsubscribeAll(){
        console.log( this.localSubscriber);
        console.log(tilityAppStateSubscribers);
        this.localSubscriber.map(item=>{
            this.unsubscribe(tilityAppStateSubscribers[item]);
        });
        console.log( this.localSubscriber);
        console.log(tilityAppStateSubscribers);
    }
    
    setState(name,value){

        //State does not exists
        if(typeof tilityAppState[name] == 'undefined'){
            throw 'State key '+name+' not registered';
            return false;
        }

        let state       = tilityAppState[name];        
        let oldValue    = state.value;
        
        //No state change
        if(oldValue == value) return false;

        //Check if state value rules
        if(typeof state.rules != 'undefined'){
            if(typeof state.rules == 'string'){
                if(typeof value != state.rules){

                    throw 'State value for '+name+' should be of type string';
                    return false;
                }
            }else if(typeof state.rules == 'function'){
                if(!state.rules(value)){

                    return false;
                }
            }
        }

        //set new state value
        tilityAppState[name] = {
            value: value,
            rules: state.rules,
            persistent: state.persistent,
            time: Date.now()
        };

       

        //Notify subscribers
        tilityAppStateSubscribers.map((item)=>{
            
            if(item == null) return false;

            if(item.name == name){
                item.callback(value,oldValue);
            }

        });

        return true;
    }

    getState(name){
        return tilityAppState[name].value;
    }

    getStateList(){
        return tilityAppState;
    }

  
}



class Watcher{

    constructor(obj){

        let target = this.processObject(obj);
        this.subscribers = [];

        return {
            subscribe: (key,callback)=>{
               return this.subscribe(key,callback);
            },
            unsubscribe:(index)=>{
                return this.unsubscribe(index);
            },
            target: target
        }
    }

    subscribe(key,callback){

        this.subscribers.push({
            key: key,
            callback:callback
        });

        return this.subscribers.length-1;
    }

    unsubscribe(key){

        if(typeof this.subscribers != 'undefined'){
            this.subscribers[key] = null;
        }
    }

    processObject(obj,path){

        let proxied = {};

        
        path = (typeof path == 'undefined' || path == null) ? '' : path;        
        
        for(let key in obj){


            if(typeof obj[key] == 'object'){

                proxied[key] = this.processObject(obj[key],[path,key].filter((item)=>{ return (item != ''); }).join('/'));
            }else{

                proxied[key] = obj[key];   
            }
        }

        let result = new Proxy(proxied, {
          get:  (target, key, receiver) => {

            return Reflect.get(target, key, receiver);
          },
          set:  (target, key, value, receiver) => {

            let keyPath = [path,key].filter((item)=>{ return (item != ''); }).join('/');
        
            this.subscribers.map(item => {
                
                if(item != null){

                    if(item.key == keyPath){
                        item.callback(value,target[key]);
                    }    
                }
                
            });

            return Reflect.set(target, key, value, receiver);
          }   
        });

        return result;
    }



}


class UIComponent {

    constructor(attributes,param){

        this._component = this._render(attributes,param);
        
        for(let key in attributes){
            this._component.setAttribute(key,attributes[key]);    
        }
        
        let observer = new MutationObserver((mutations)=>{
          mutations.forEach((mutation)=>{
            if (mutation.type == 'attributes') {
                this._onAttributeChange(mutation);
            }
          });
        });


        observer.observe(this._component, {
          attributes: true //configure it to listen to attribute changes
        });

        this._component.update = (type,data)=>{

            if(typeof this[type] == 'function' && type.charAt(0) != '_' && type.substring(0,3) != 'get'){
                
                
                this[type](data);

                return true;

            }
                

            return false;
            
           
        }

         this._component.get = (type) => {

            type = 'get'+ type.charAt(0).toUpperCase() + type.slice(1);
            
            if(typeof this[type] == 'function' && type.charAt(0) != '_'){
                  
                return this[type]();

            }
        }

        return this._component;
    }

    _render(){
        return document.createElement('div');
    }

    
    _attributeChange(data){}
    
}


function renderTo(target,view){

    let removeEvent = new CustomEvent('tility-on-remove');

    if(target.children){
        Array.from(target.children).map(item =>{

            item.dispatchEvent(removeEvent);
        
        });    
    }
 

    target.innerHTML = '';

    let insertEvent = new CustomEvent('tility-on-mount');

    view.dispatchEvent(insertEvent);

    target.append(view);
}

function syncDOM(newDom,oldDom,callback){

    let items = Array.from(newDom.childNodes);
    let old   = Array.from(oldDom.childNodes);

    callback = callback || function(){};

    let syncAttr = function(a,b){
        let attrs = a.attributes;
        let collection = [];

        for(let i = 0; i <= attrs.length - 1; i++) {
        
           if(b.attributes){

               if(b.getAttribute(attrs[i].name) != attrs[i].value){

                    b.setAttribute(attrs[i].name,attrs[i].value);
               }

           }else{

               b.setAttribute(attrs[i].name,attrs[i].value);
           }

            

           collection.push(attrs[i].name);
        }

        if(b.attributes){

             if(b.attributes.length > attrs.length){

                let attrs_b = b.attributes;
                let attrs_b_length = b.attributes.length - 1;

                for(let i = 0; i <= attrs_b_length; i++) {
               
                  if(!collection.includes(attrs_b[i].name)){
                    b.removeAttribute(attrs_b[i].name);
                  }
                }
            }  
        }
    }

    if(items.length >= old.length){

        for(let i = 0 ;i <= items.length - 1; i++){
           
            let target = old[i] || null;
         
            if(target){

                //If node Type is different
                if(items[i].nodeName != target.nodeName){
                   
                    let pop = items[i].cloneNode(true);

                    oldDom.replaceWith(pop,target);
                    //target.remove();

                }

                
                if(target.nodeName != '#text' && items[i].nodeName != '#text'){
                
                    //Sync Attribues    
                    syncAttr(items[i],target);


                    if(items[i].childNodes.length){
                        syncDOM(items[i],target);
                    }

                }else{

                    //Sync Text Nodes
                    if(items[i].nodeValue != target.nodeValue){
                        target.nodeValue = items[i].nodeValue;
                    }
                } 

                

            }else{ //Node does not yet exists

                //if(items[i]){

                   // target = oldDom;

                    /*
                    if(target.nodeName == '#text'){
                        target = target.parentElement;
                    }*/
                   
                    oldDom.appendChild(items[i]);
                //}
            }
            
        }//forloop   
    

    }else{

        for(let i = 0 ;i <= old.length - 1; i++){
            
            let item = items[i] || null;

   
            
            if(item){
                  //If node Type is different
                if(item.nodeName != old[i].nodeName){

                    let pop = item.cloneNode(true);  

                    old[i].replaceWith(pop);
                }

                
                if(item.nodeName != '#text' && old[i].nodeName != '#text'){

                    //Sync Attribues    
                    syncAttr(item,old[i]);


                    if(old[i].childNodes.length){
                        syncDOM(item,old[i]);
                    }

                
                }else{

                    //Sync Text Nodes
                    if(old[i].nodeValue != item.nodeValue){
                         old[i].nodeValue = item.nodeValue;
                    }
                } 

            }else{

                old[i].remove();   

            }//ifelse

        }//forloop

    }//ifelse
        

    callback(oldDom);

    return oldDom;
}


class PsuedoComponent{

    constructor(attr,content){

        content = (typeof content == 'function') ? content: function(){ return document.createElement('div');};
        
        if(typeof attr == 'function'){
            content    = attr;
            attr        = {};
        }


        let styleScope  = 'data-tility-psuedo-component-'+Date.now();
        let render      = document.createElement('div');
        let container   = document.createElement('div');
        let inner       = document.createElement('div');
        let css         = this.style('['+styleScope+']',attr);
        let stylesheet  = "\n";
        let style       = document.createElement('style');

        inner.style.display = 'none';

        let updateCSS = function(css){
            //Prepare stylesheet
            Object.keys(css).map((selector) => {

                //Free text mode
                if(selector == '--'){
                    
                    stylesheet += css[selector]+"\n";

                }else {

                 
                    //Key value pair mode
                    stylesheet += "["+styleScope+"] "+selector+" {\n";

                        for(let key in css[selector]){

                            let dashed = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
                    
                            stylesheet += "\t"+dashed+':'+css[selector][key]+";\n";
                        }
                    
                    stylesheet += "} \n\n";
                }
            });

            return stylesheet;
        }

        //Setup stylesheet
        stylesheet      = updateCSS(css);
        style.innerHTML = stylesheet;
        render.setAttribute(styleScope,true);
        container.append(style);

        container.append(render);
        container.append(inner);

        container.ogAppend              = container.append;
        container.ogQuerySelector       = container.querySelector;
        container.ogQuerySelectorAll    = container.querySelectorAll;

        container.append = function(data){
            inner.append(data);
        }

        container.querySelectorAll = function(query){
            return inner.querySelectorAll(query);
        }

        container.querySelector = function(query){
            return inner.querySelector(query);
        }

        container.html = function(str){
            
            if(typeof str == 'undefined'){
                return inner.innerHTML;
            }

            inner.innerHTML = str;
           
            return str;
        }

        inner.append(content());

        for(let key in attr){
            container.setAttribute(key,attr[key]);
        }

        let model           = this.digest(attr,inner);
        render.innerHTML    = '';

        let newDom = this.render(model);
       
        syncDOM(newDom,render,()=>{
            this.controls(render,attr,inner,container);
        });
        
       

        let observerInner = new MutationObserver((mutations)=>{
           
           let model  = this.digest(attr,inner);
           let newDom = this.render(model);
           syncDOM(newDom,render,()=>{
                this.controls(render,attr,inner,container);
           });
        
        });

        
        observerInner.observe(inner, {
            subtree:true,
            childList:true,
            attributes:true,
            characterData:true
        });

        
       // let flag = true;

        let observerContainer = new MutationObserver((mutations)=>{
          
           
           // observerContainer.disconnect();

            if(container.attributes){
                Array.from(container.attributes).map(item=>{
                    attr[item.name] = item.value;
                });
            }
            
            /**
            console.log(flag);

            if(flag) {
               
           
                for(let mutation of mutations){

                    console.log(mutation);
                    if(mutation.type == 'childList' || mutation.type == 'characterData'){
                        
                        flag = false;
                     

                        css         = this.style('['+styleScope+']',attr);
                        stylesheet  = updateCSS(css);

                        style.innerHTML = stylesheet;
                        inner.innerHTML = container.innerHTML;

                        container.innerHTML = '';

                       
                        container.ogAppend(style);
                        container.ogAppend(render);
                        container.ogAppend(inner);
                        
                        setTimeout(()=>{
                            flag = true;
                        },0)
                           
                    }else{
                        flag = true;
                    }


                }



            }**/
          
            let model  = this.digest(attr,inner);
            let newDom = this.render(model);

            syncDOM(newDom,render,()=>{
                this.controls(render,attr,inner,container);
            });


        });
  
        observerContainer.observe(container, {
           // childList:true,
            attributes:true
          //  characterData:true
        });

        return container;
    }

    render(model){

        return document.createElement('div');
    }

    digest(attr,children){

        return {};
    }

    controls(render,attr,inner,container){}

    style(scope,attr){
        return {};
    }


}

export { State, Template, View, UIComponent, controller, Watcher, renderTo, PsuedoComponent}
