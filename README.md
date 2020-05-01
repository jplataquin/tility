# What is Tility?
Tility is a suite of classes that will help you build dynamic HTML interfaces and Single Page Applications using Javascript. It is designed to keep your code intuitive and simple amidst complex project requirements.

Tility offers 3 classes to aid you in your next project.

 - Template
 - View
 - State

 


# How to install?

If you are using npm.

    npm install tility

or you can to download the zip file, place it in your directory and use ES6 import.

    import {Template,View,Component} from './path-to-tility/src/tility.js'

# Template Class
**Basic Usage** 
The Template class allows you to create HTML tags from an instance using their names as methods. They can be ordered and arranged like regular HTML tags, but can be treated like regular javascript DOM objects.


       import {Template} from './tility.js';
       
       //Create a Template instance
       cost t = new Template();
       
       //Arrange them as you would like in a normal HTML file.
       t.h1('Tility test');
       
       t.div(()=>{
	       t.h3('Hello World');
	       
	       //You can get an instance of the element as a variable
	       //so you can manipulate them like regular DOM objects.
	       let btn = t.button('how are you?');
       });
       
       btn.onclick = ()=>{ alert("I'm fine thank you"); };
      
       //Compile everything to an DOM object in the order that it was written.
       let content = t.compile();
       
       document.body.append(content);
The output will be similar to this

    <h1>Tility Test</h1>
    <div>
	    <h3>Hello World</h3>
	    <button onclick="alert('Im fine thank you')" >How are you?</button>
	</div>


**Adding attributes**
You can also add attributes to the element like you would in HTML tags by using an object literal as an argument.

    const t = new Template();
    
    let content = t.div({class:'col-lg-12',id:'myID'},()=>{
	    
	    t.input({value:'hello world',type:'text'});
	    
    });
    
    document.body.append(content);

This would result into 

    <div class="col-lg-12" id="myID">
	    <input type="text" value="hello world"/>
	</div>
**Using loops, if statements, and built in methods**
The Template class allows you to manipulate HTML tags as if they were javascript variables and objects. 

    const t = new Template();
    
    let arr = ['a','b','c','d'];
    let test = true;
    
    //Loop <li> inside <ul>
    t.ul(()=>{
	    for(let i = 0; i<=arr.length-1; i++){
		    t.li(arr[i]);
		}
    });
    
    //Using if statements
    if(test){
	    t.span('The result was true');
	}else{
		t.span('The result was false');
	}
	
	//Using regular DOM methods
	let myDiv = t.div();
	
	myDiv.onclick = ()=>{ alert('wow'); }
	
	myDiv.append(t.table(()=>{
		t.tr(()=>{
			t.td('row 1 col 1');
			t.td('row 1 col 2');
		});
		
		t.tr(()=>{
			t.td('row 2 col 1');
			t.td('row 2 col 2');
		});
	}));
	
	document.body.append(t.compile());
**You can extend the Template class to create psuedo components**
Sometimes you want to speed things up by writing reusable HTML templates, but you don't want to create a full blown web components or you just want to keep things simple. 

Here is an example that extends the Template class to follow the bootstrap form-group template.

*BootstrapTemplate.js*

    import {Template} from './tility.js';
    
    export class BootstrapTemplate extends Template{
	    constructor(){
		    super();
		}
		
		inputField(){
			let {param,callback} = this.reduce(arguments);
			
			let label = param.label ?? 'N/A';
			let type = param.type ?? 'text';
			let value = param.value ?? '';
			
			return this.div({class:'form-group'},()=>{
				this.label(label);
				this.input({type:type,value:value,class:'form-control'});
			});
		}
	}

*index.html*

    <!DOCTYPE html>
	<html lang="en">
		<head>
			<title>Tility Extend Template</title>
		</head>
		<body>
			<div id="root"></div>
		
			<script type="module">
			    import {BootstrapTemplate} from './BootstrapTemplate.js';
			    
			    const t = new BootstrapTemplate();
			     
			    t.div({class:'container'},()=>{
				    t.div({class:'row'},()=>{
					    
					    t.div({class:'col-lg-6'},()=>{
							
							//Use our extended method to render the bootstrap form-group template
							t.inputField({label:'Input 1'});
							
						});//div
						
						t.div({class:'col-lg-6'},()=>{
							
							//Use our extended method to render the bootstrap form-group template
							t.inputField({
								label:'Input 2',
								value:'test value'
							});
							
						});//div
						
				    });//div
			    ;});//div
				
				document.getElementById('root').append(t.compile());
			 </script>
		</body>
	</html>
