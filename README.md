# What is Tility?
Tility is a suite of classes that will help you build dynamic HTML interfaces and Single Page Applications using Javascript. It is designed to keep your code intuitive and simple amidst complex application requirements.

Tility offers 3 classes to aid you in your next project.

 - Template
 - View
 - State

 


# How to install?

If you are using npm.

    npm install tility

or you can to download the zip file, place it in your directory and use ESM import.

```javascript
	import {Template,View,Component} from './path-to-tility/src/tility.js'
 ```
# Template Class

**Basic Usage** 

The Template class allows you to create HTML tags from the Template object instance using their names as methods. They can be ordered and arranged like regular HTML tags and can be treated like regular javascript DOM objects.

```javascript
	import {Template} from './tility.js';

	//Create a Template instance
	const t = new Template();

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
```
The output will be similar to this

```html
	<h1>Tility Test</h1>
	<div>
	    <h3>Hello World</h3>
	    <button onclick="alert('Im fine thank you')" >How are you?</button>
	</div>
```


**Adding Attributes**

You can add element attributes by using an object literal as the first argument in your method call. The key of the object is mapped to the attribute name, and the value of the key becomes the value of the attribute. Note that for all native HTML elements, their attribute values are automatically sanitized and converted to escaped HTML string.

```javascript
	const t = new Template();

	let content = t.div({class:'col-lg-12',id:'myID'},()=>{
		
		t.input({value:'hello world',type:'text'});
		
	});

	document.body.append(content);
```
This code would result into 
```html
    <div class="col-lg-12" id="myID">
	    <input type="text" value="hello world"/>
	</div>
```

**Style Attribute of Element**

The style attribute of an element has two ways of parsing the value.
```javascript

	//Object parse
	t.div({
		id:'myDiv',
		style:{
			'background-color':'red',
			padding:'20px'
		}
	},()=>{
		t.txt('Test Div');
	});

	//Free string
	t.div({
		id:'myDiv',
		style:'background-color:red;padding:20px'
	},()=>{
		t.txt('Test Div');
	});
```
**Inline Event Handlers**

Setting inline event handlers are no longer necessary since you already have direct access to the element instance

Recommended way:
```javascript

	let button = t.button('Click Me');

	button.click = function(){
		alert("I'm clicked");
	}
```
As oppose to this:
```javascript

	let button = t.button({onclick:`alert('Im clicked')`}, ()=>{
		t.txt('Click Me');
	});

```
**Avoid using innerHTML**

Avoid the use of innerHTML as it will open your application to possible cross site scripting attacks. 

Instead the Template class offers a element.tmpl.text() method to santize and escape your string before setting it to the innerHTML.

```javascript

	let div = t.div();

	//use .text() method to escape html tags
	div.tmpl.text(`
		<h1>This will not appear as an h1 tag </h1>
	`);

	let span = t.span();

	let username = 'foo';

	span.tmpl.text(username);

	document.body.append(t.compile());
	
```
**The Template elements have a .tmpl property with useful methods aside from text()**

1.) The element.tmpl.observe() method allows handling of changes in the element via observables pattern.
```javascript

	let h1 = t.h1({class:'a'},()=>{
		t.txt('Hello Wolrd');
	});

	let h1_observable = h1.tmpl.observe();

	//Observe for attribute change
	let attr_observe = h1_observable.on(function(mutation,observer){

	});

	//Observe for changes in children
	let child_observe = h1_observable.on(function(mutation,observer){

	});


	setTimeout(()=>{
		h1.classList.add('b');
	},3000);

	setTimeout(()=>{
		h1.append(t.span('How are you?'));
	},3000);

	setTimeout(()=>{
		
		console.log('List of mutation records',h1_observable.takeRecords());

		h1_observable.disconnect();

		alert('Observer disconnected');

	},5000)
```

2.) The element.tmpl.shadow() method creates a shadow dom than can be appended to other elments.
```javascript

	let shadow = t.div(()=>{
		t.h1('This is a shadow dom');
	});

	let regularDiv = t.div();

	regularDiv.tmpl.shadow('open',shadow);

	document.body.append(regularDiv);

```
**Using Loops, If Statements, and Native Methods**

The Template class allows you to manipulate HTML tags as if they were javascript variables and objects. 
```javascript
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
```

**You can extend the Template class to create psuedo components**

Sometimes you want to speed things up by writing reusable HTML templates, but you don't want to create a full blown web components or you just want to keep things simple. 

Here is an example that extends the Template class to follow the bootstrap html template.

*BootstrapTemplate.js*
```javascript
    import {Template} from './tility.js';
    
    export class BootstrapTemplate extends Template{
	    constructor(){
		    super();
		}
		
		container(){
			let {param,callback} = this.reduce(arguments);

			return this.div({class:'container'},callback);
		}

		row(){
			let {param,callback} = this.reduce(arguments);

			return this.div({class:'row'},callback);
		}

		col(){
			let {param,callback} = this.reduce(arguments);

			return this.div({class:'col-lg-'+param.val},callback);
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
```
*index.html*
```html
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
			     
			    t.container(()=>{
				    t.row(()=>{
					    
					    t.col({val:6},()=>{
							
							//Use our extended method to render the bootstrap form-group template
							t.inputField({label:'Input 1'});
							
						});//col
						
						t.col({val:6},()=>{
							
							//Use our extended method to render the bootstrap form-group template
							t.inputField({
								label:'Input 2',
								value:'test value'
							});
							
						});//col
						
				    });//row

			    ;});//container
				
				document.getElementById('root').append(t.compile());
			 </script>
		</body>
	</html>
```


**Adding textNodes**

You can add textNodes inside an element and treat them as javasript objects.
```javascript
	const t = new Template();

	let text = t.txt('Hello World');
	
	t.div(()=>{
		t.el(text);
		t.txt('This one has not');
	});

	text.nodeValue = 'This text has changed');

	document.body.append(t.compile());
```
**Binding object**

You can bind an array of objects that will automatically render to the dom. And any changes you make to the object will automatically render in the dom. You can also optionally bind back data from the dom to your object.

	const t = new Template();

	let model = [
		{
			name:'Jerry',
			age:'21',
		},
		{
			name:'Beth',
			age:'20'
		}
	];

	/**
		args1 = An array of similarly structured objects.
		args2 = A callback on how to render the template.
		args3 = An object literal map on how to handle updates in the template.
	**/
	let model = t.bind(model,(handle,item)=>{
		return t.div(()=>{
			handle.name = t.h3(item.name);
			handle.age = t.input({type:'text',value:item.age});

			//This will make any value changes made to the input element automatically reflect back to the corresponding object property
			handle.age.onkeyup = function(){
				item.age = this.value;
			};

			t.br();
		});
	},{
		name:(handle,value)=>{
			handle.innerHTML = value;
		},
		age:(handle,value)=>{
			handle.value = value;
		}
	});

	//You can manipulate the model and see real time updates on the dom
	model[0].name = 'This name was changed to Joseph';

	//You can add new items and see real time updates on the dom
	model.data.insert({
		name:'Sheena',
		age:'22'
	});

	//You can even add new items at a specific index and see real time updates on the dom
	model.data.insert({
		name:'JP',
		age:'30'
	},2); //Insert at index 2;

	//Get the length of the new array
	console.log(model.length);

	//To see and access other methods of the bind object
	console.log(model.data);

	/**
		e.g.
			
			model.data.remove(index);
				- Removes an object and updates the dom at a specific index

			model.data.map()
				- A method to call the Array.map() function

	**/

	document.body.append(t.compile());


	
###To be continued...
