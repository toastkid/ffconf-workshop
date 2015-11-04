# 1. Compile a basic Javascript  file
Inside the folder lab-javascript find the blank 
file called greeter.ts. This is our typescript file. 
Add the following plain JavaScript to this file:

	function greeter(person) {
		return "Hello, " + person;
	}
	
	var user = "Martin Beeby";
	
	document.body.innerHTML = greeter(user);
	
You can take any javascript file and run it through the 
the Typescript compiler and it will not error. 
The compiler will simply output the javascript.

To compile this file you will need to use the TypeScript
compiler. The compiler is simply a node package that can be installed by typing

	npm install typescript -g

Open up a CMD or Terminal windows and navigate to the lab-javascript
folder.

On the command line enter the following command:

	tsc greeter.ts
	
This will create a file called greeter.js in the same folder as
greeter.ts. If you look at Greeter.js you will notice that it has the
exact same content as greeter.ts.

# 2. Adding a Type
Now we can start taking advantage of some of the new tools 
TypeScript offers. Add a ": string" type annotation to 
the 'person' function argument as shown below.

	function greeter(person: string) {
		return "Hello, " + person;
	}

Type annotations in TypeScript are lightweight ways to 
record the intended contract of the function or variable. 
In this case, we intend the greeter function to be called 
with a single string parameter. We can try changing the 
call greeter to pass an array instead: 

	function greeter(person: string) {
		return "Hello, " + person;
	}
	
	var user = [0, 1, 2];
	
	document.body.innerHTML = greeter(user);

If you recompile this you will now get an error:

	tsc greeter.ts
	
The error will look like this:
	
	greeter.ts(7,27): error TS2082: Supplied parameters do not match any signature of call target:
        Could not apply type 'string' to argument 1 which is of type 'number[]'.
	


Similarly, try removing all the arguments to the greeter call. TypeScript will let you know that you have called this function with an unexpected number of parameters. In both cases, TypeScript can offer static analysis based on both the structure of your code, and the type annotations you provide. 

Notice that although there were errors, the greeter.js file is still created. You can use TypeScript even if there are errors in your code. But in this case, TypeScript is warning that your code will likely not run as expected. 

	function greeter() {
		return "Hello, ";
	}
	
	var user = [0, 1, 2];
	
	document.body.innerHTML = greeter(user);

#3. Interface
Let's develop our sample further. Here we use an interface that describes objects that have a firstname and lastname field. In TypeScript, two types are compatible if their internal structure is compatible. This allows us to implement an interface just by having the shape the interface requires, without an explicit 'implements' clause. 

	interface Person {
		firstname: string;
		lastname: string;
	}
	
	function greeter(person : Person) {
		return "Hello, " + person.firstname + " " + person.lastname;
	}
	
	var user = {firstname: "Martin", lastname: "Beeby"};
	
	document.body.innerHTML = greeter(user);

#4. Classes
Here we create a Student class with a constructor and a few public fields. Notice that classes and interfaces play well together, letting the programmer decide what is the right level of abstraction. 

Also of note, the use of 'public' on arguments to the constructor is a shorthand that allows us to automatically create properties.

	class Student {
		fullname : string;
		constructor(public firstname, public middleinitial, public lastname) {
			this.fullname = firstname + " " + middleinitial + " " + lastname;
		}
	}
	
	interface Person {
		firstname: string;
		lastname: string;
	}
	
	function greeter(person : Person) {
		return "Hello, " + person.firstname + " " + person.lastname;
	}
	
	var user = new Student("Martin", "L", "Beeby");
	
	document.body.innerHTML = greeter(user);
	
Re-run tsc greeter.ts and you'll see the generated JavaScript is the same as the earlier code. 
Classes in TypeScript are just a shorthand for the same prototype-based OO that is frequently used in JavaScript. 
In the future browser will not require compiolers like TypeScript they will be able to handle the class syntax nativly.
Microsoft Edge, Firefox and Chrome already do.

#5. Use in a site

Open the index.html file and add the following code. It's basically just adding the JavaScript file to our page.

	<!DOCTYPE html>
	<html>
		<head><title>TypeScript Greeter</title></head>
		<body>
			<script src="greeter.js"></script>
		</body>
	</html>

In the command line or terminal run:

	NPM Install
	
Then

	NPM Start
	
When the browser loads go to the url /lab-javascript/

# For As loops

If we have an array of students we might want to loop through them. Here is a new Syntax called "for of". Once you compile the code you
will see that it uses a standard for loop in the .js file.

	var user = new Student("Martin", "L", "Beeby");
	var user1 = new Student("Martin", "Mavrick", "Kearn");
	
	var userArray = [user,user1];
	
	for (var v of userArray) { 
		document.body.innerHTML += greeter(v);
	}

#6. Rest Parameters

Sometimes, you want to work with multiple parameters as a 
group, or you may not know how many parameters a function will ultimately take. In JavaScript, you can work with 
the arguments direction using the  arguments variable that is visible inside every function body.

	var user = new Student("Martin", "L", "Beeby");
	var user1 = new Student("Martin", "Mavrick", "Kearn");
	var user2 = new Student("Mike", "The Hit Man", "Taulty");
	
	printStudents(user,user1, user2)
	
	function printStudents(...listOfStudents: Student[]) {
		for (var v of listOfStudents) {
				document.body.innerHTML += greeter(v);
		}
	}

	
#Destructuring

A destructuring declaration introduces one or more named variables and initializes 
them with values extracted from properties of an object or elements of an array.

	// Create 3 new variables and populate them from an array.
	// Now we have 3 new variables called beeby, kearn , taulty
	var [beeby, kearn, taulty] = printStudents(user,user1, user2)
	
	// We can now send the beeby object to be printed again.
	printStudents(beeby)
	
	function printStudents(...listOfStudents: Student[]) {
		for (var v of listOfStudents) {
				document.body.innerHTML += greeter(v);
		}
		return listOfStudents;
	}
	
#Spread


	
#7. Arrow Functions and using 'this'
How 'this' works in JavaScript functions is a common theme in programmers coming to JavaScript. Indeed, learning how to use it is something of a rite of passage as developers become more accustomed to working in JavaScript. Since TypeScript is a superset of JavaScript, TypeScript developers also need to learn how to use 'this' and how to spot when it's not being used correctly. A whole article could be written on how to use 'this' in JavaScript, and many have. Here, we'll focus on some of the basics. 

 In JavaScript, 'this' is a variable that's set when a function is called. This makes it a very powerful and flexible feature, but it comes at the cost of always having to know about the context that a function is executing in. This can be notoriously confusing, when, for example, when a function is used as a callback.

 Let's look at an example:
	var deck = {
		suits: ["hearts", "spades", "clubs", "diamonds"],
		cards: Array(52),
		createCardPicker: function() {
			return function() {
				var pickedCard = Math.floor(Math.random() * 52);
				var pickedSuit = Math.floor(pickedCard / 13);
				
				return {suit: this.suits[pickedSuit], card: pickedCard % 13};
			}
		}
	}
	
	var cardPicker = deck.createCardPicker();
	var pickedCard = cardPicker();
	
	alert("card: " + pickedCard.card + " of " + pickedCard.suit);
 
If we tried to run the example, we would get an error instead of the expected alert box. This is because the 'this' being used in the function created by 'createCardPicker' will be set to 'window' instead of our 'deck' object. This happens as a result of calling 'cardPicker()'. Here, there is no dynamic binding for 'this' other than Window. (note: under strict mode, this will be undefined rather than window).

 We can fix this by making sure the function is bound to the correct 'this' before we return the function to be used later. This way, regardless of how its later used, it will still be able to see the original 'deck' object.

 To fix this, we switching the function expression to use the lambda syntax ( ()=>{} ) rather than the JavaScript function expression. This will automatically capture the 'this' available when the function is created rather than when it is invoked:

	var deck = {
		suits: ["hearts", "spades", "clubs", "diamonds"],
		cards: Array(52),
		createCardPicker: function() {
			// Notice: the line below is now a lambda, allowing us to capture 'this' earlier
			return () => {
				var pickedCard = Math.floor(Math.random() * 52);
				var pickedSuit = Math.floor(pickedCard / 13);
				
				return {suit: this.suits[pickedSuit], card: pickedCard % 13};
			}
		}
	}
	
	var cardPicker = deck.createCardPicker();
	var pickedCard = cardPicker();
	
	alert("card: " + pickedCard.card + " of " + pickedCard.suit);




