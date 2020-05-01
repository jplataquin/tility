/*!
 * Tility v1.0.0
 * A suite of javascript classes that will help you build front end web interfaces.
 *
 * Author John Patrick Lataquin
 * Released under the MIT license
 * 
 * Software authors provide no warranty with the software and are not liable for anything.
 *
 * Date: 2020-04-05
 */

"use strict";

class Template {

    constructor(){

        //Setup private variables
        let content = document.createDocumentFragment();
        let og      = content;

        /** Setup private methods **/

        //Create stylesheet values for attribute style
        let toCSS   = function(param){ 

            let style = [];

            for(let key in param){
                style.push(key+':'+param[key]);
            }

            return style.join(';');
        }

        //Apply attributes to element
        let applyAttributes = function(el,param){
           
            for(var key in param){

                if(key == 'style'){
               
                    param[key] = toCSS(param[key]);
               
                }

                el.setAttribute(key,param[key]);
                   
            }  
           
        };

        //Start element
        let start = function(el){
            content = el;
        }

        //Ending element
        let end = function(el){
            content = el.parentElement || og;
        }

        //Setup elements with attributes and custom methods
        let processElement = function(type,param,callback){
           
            let el = null;
            
            if(typeof type == 'object'){
                el = type;
            }else{
                el = document.createElement(type);    
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

            el.observe = function(config){

                let callback =[];

                let observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        callback.map( (cb) =>{ 
                            cb(mutation,observer); 
                        });
                    });
                });
                
                observer.observe(this,config);


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

            el.shadow = function(mode,dom){
                this.attachShadow({mode:mode}).append(dom);
            };

            //Append element to content
            content.append(el);
           
            if(typeof callback == 'function'){
               
                //Arrange elements in correct order
                start(el);
                    callback(el);
                end(el);
               
            }

           
            return el;
        }

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
            }
        });

        //Setup method for style tag
        this.style = function(css){
           
            var style = processComponent('style',{},()=>{});
            let stylesheet = "\n";

            //Prepare stylesheet
            Object.keys(css).map((selector) => {

                //Free text mode
                if(selector == '--'){
                    
                    stylesheet += css[selector]+"\n";

                }else{

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
        }

        //Setup method for textNode
        this.txt = function(value){
            var t = document.createTextNode(value);
           
            content.append(t);

            return t;
        }

        //Create method to handle dom elements and string input
        this.el = function(el,param,callback){
        
            if(typeof el == 'string'){
               
                let n = document.createDocumentFragment();

                let div = document.createElement('div');

                div.innerHTML = el;

                let childArray = Array.from(div.children);
                
                childArray.forEach((child)=>{
                    n.append(child);
                });

                el = n;
            }

            processElement(el,param,callback);
        }

        //Method to define element and add custom element as method to template
        this.defineElement = function(name, options, constructor){
           
            customElements.define(name, constructor, options);
          
            this[ name.replace(/\-/g,'_') ] = function(param,callback){
                return processElement(name,param,callback);
            } 

        }

        //Compile content to a dom fragment and clear content
        this.compile = function(){
            let buffer = content;
            content = document.createDocumentFragment();
            og = content;
            return buffer;
        }

     }

     //Method to bind an object to an element that will automatically update with any changes made to the object or vice versa.
     bind(model,template,update){
        
        //Private placeholder for target
        let _target = [];

        //Set up the object that will be proxied
        let dom = {

            //Method to get an object from the target based on selected index
            item: function(i){

                //Return the object as a proxy with traps on the "get" and "set"
                let item = new Proxy({},{
                    get:function(obj,prop,val){
                        return _target[i][prop];
                    },

                    //If the user will update a property of the object we must also update the corresponding element
                    set: function(obj,prop,val){
                        
                        //Set value of the property
                        _target[i][prop] = val;
                        
                        //Check if there is a key defined for the update
                        if(typeof update[prop] != 'undefined'){
                            
                            //Do the update callback
                            update[prop](_target[i]._ui,val);
                        }

                        //Return the new value of the property
                        return _target[i][prop];
                    }
                });

                return item;
            },

            //Create a map method so the native map() will be avaiable to the user
            map: function(cb){
                return _target.map((item,i)=>{

                    return cb(this.item(i),i);

                });
            },

            //Insert a new object at specific index and update the element
            insert: function(item,index){

                //If no index is defined then set index to the last place
                if(typeof index == 'undefined'){
                    index = _target.length;
                }

                let ui = {};

                //Create the new element from template
                item._el = template(ui,item);
                item._ui = ui;

                //Add new object to target array
                _target.splice(index, 0, item);
                
                //Get the element before the new element
                let before = _target[index - 1] ?? null;

                //Get the element after the new element
                let after = _target[index + 1] ?? null;
                
                //If no before and after then skip element update
                if(before == null && after == null){
                    return true;
                }

                //If there is a before element the correct the arrangement of the new element accordingly
                if(before){
                    return before._el.parentNode.insertBefore(_target[index]._el, before._el.nextSibling);
                }

                //If there is no before element but there is an after element then correct the arrangement of the new element accordingly
                if(after){
                    
                    return after._el.parentElement.insertBefore(_target[index]._el, after._el);
                }

                return true;
            
            },

            //Method to conveniently remove the object and update the element
            remove: function(i){
                _target[i]._el.remove();
                _target[i] = null;
                _target = _target.filter((item)=>{
                    return item;
                });

                return true;
            }
        };

        //loop through each object and bind and render the template
        for(let i = 0; i <= model.length - 1; i++){

            let ui = {};
            let item = model[i];

            item._el = template(ui,item,(key)=>{
                
                update[key](ui,item[key]);
            });

            item._ui = ui;
            _target.push(item);
        }
        
        //Convert dom into a proxy and set traps for "get"
        dom = new Proxy(dom,{
            get: function(obj,prop,val){

                //if user wants to access the original object
                if(prop == 'data'){
                    return obj;
                }

                //If user wants to know the length of the target array
                if(prop == 'length'){
                    return _target.length;
                }

                //Allow the user to access a single object from the target based on the index
                return obj.item(prop);
            }
        });

        return dom;
     }

     //Helper method to extract the parameters & the callback from the method's arguments
     reduce(args){

        args[0] = args[0] || {};
        args[1] = args[1] || null;
       
        let _param = {};
        let _cb = function(){};

        if(typeof args[0] == 'function'){
            _cb = args[0];

        }else{
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
        let styleScope  = 'data-kapitan-view-'+Date.now();
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

            }else{

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
        this.content.append(style);
        
        //Get areas
        area = this.areas();

        //Prepare template
        this.content.append(this.template(area,data));
        
        //Initialize script
        this.script(data);

        //Attach setArea method
        this.content.setArea = function(name,view){
            
            if(area[name] == view) return false;

            area.innerHTML = '';
            area[name].append(view);

            return true;
        }
        
        //Attach public controls to content
        Object.keys(ctrl).map((key)=>{

            if(typeof this.content[key] == 'undefined'){
                this.content[key] = ctrl[key];
            }else{
                throw('The method or property "'+key+'" already exist in the content view of class "'+this.constructor.name+'" and it cannot be overwritten by controls()');
            }
            
        });

        return this.content;
    }

    template(area,data){
        return document.createDocumentFragment();
    }

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
    }

    register(name,value,rules){
        //Check if state exists
        if(typeof tilityAppState[name] == 'undefined'){
            
            //Register state
            tilityAppState[name] = {
                value:value,
                rules:rules
            };

            return true;
        }

        return false;
    }

    subscribe(name,callback){

        //Check if callback is a function
        if(typeof callback != 'function'){
            throw('Subscriber callback must be a type of function');
            return false;
        }

        let sub = {name:name,callback:callback,index:null};

        //Add subscriber
        tilityAppStateSubscribers.push(sub);

        //Set index of subscriber
        sub.index = tilityAppStateSubscribers.length-1;

        return sub;
    }

    unsubscribe(sub){

        //Check if subscriber index exists
        if(typeof tilityAppStateSubscribers[sub.index] != 'undefined'){

            //Check if subscriber is deleted
            if(tilityAppStateSubscribers[sub.index] == null) return false;

            //Check if the subscriber callback are the same
            if(tilityAppStateSubscribers[sub.index].callback == sub.callback){
                tilityAppStateSubscribers[sub.index] = null;//Turn subscriber to null so indices are preserved
                return true;
            }
        }

        return false;
    }

    setState(name,value){

        //State does not exists
        if(typeof tilityAppState[name] == 'undefined') return false;

        let state       = tilityAppState[name];        
        let oldValue    = state.value;

        //No state change
        if(oldValue == value) return false;

        //Check if state value rules
        if(typeof state.rules != 'undefined'){
            if(typeof state.rules == 'string'){
                if(typeof value != state.rules) return false;
            }else if(typeof state.rules == 'function'){
                if(!state.rules(value)) return false;
            }
        }

        //set new state value
        tilityAppState[name] = value;

        //Notify subscribers
        tilityAppStateSubscribers.map((item)=>{
            
            if(item == null) return false;

            if(item.name == name){
                item.callback(value,oldValue);
            }

        });
    }

    getState(name){
        return tilityAppState[name];
    }

    getStateList(){
        return tilityAppState;
    }
}

module.exports = {Template, View, State};