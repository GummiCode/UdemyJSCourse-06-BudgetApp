

// Module : Budget Controller

let budgetController = (function () {

////////////////////////
// Private Space

let Expense = function (id, description, value) {
	this.id = id;
	this.description = description;
	this.value = value;
	this.percentage = -1;
};

let Income = function (id, description, value) {
	this.id = id;
	this.description = description;
	this.value = value;
};

let calculateTotal = function (type) {					//type = exp or inc :3
	let sum = 0;										//sum will be used to store the total value incrementally
	data.allItems[type].forEach(function (cur){			//We're passing in the current element as 'cur'
		sum += cur.value;								// sum aggregates all the values							
	});
	data.totals[type] = sum;							// this passes the total into the data object below :3

};

let data = {
	
	allItems: {
		exp : [],

		inc : [],
	},
	
	totals: {
		exp : 0,
		inc : 0,
	},

	budget : 0,

	percentage: -1,     		//-1 is a value commonly used to show that a value doesn't exist yet. It's palceholder syntax.

};



////////////////////////
// Public Space

return {

	addItem: function (type, des, val) {  			//Type, Description & Value

		let newItem, ID;
		
		if(data.allItems[type].length >0) {
			ID = data.allItems[type][data.allItems[type].length - 1].id + 1;		// Assigns an ID +1 of the last number in ID array.
																					// think about other ID systems we could use :3
		} else {
			ID = 0;
		};

		if (type === 'exp') {						// Creates new item ,either an inc or exp.
			newItem = new Expense(ID, des, val);	// Calling the expense constructor from above, passing in ID, des, val
		} else if (type === 'inc') {
			newItem = new Income(ID, des, val);
		};

		data.allItems[type].push(newItem);			//Adds the new item to the end of the Expenses/Income array dependant on which it is!

		return newItem;								// Returns the new item, so that the module calling this function can access it too,
													//for future reasons!
		},	


		deleteItem: function (type, id){
			let ids, index;
			//the .map method performs a function on each element in an array, and returns a new array using the outputs.
			ids =	data.allItems[type].map(function(current){
			return current.id;
			});

			index = ids.indexOf(id);
			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			};
		},
	

		calculateBudget: function () {


			// Calculate total income and expenses
			calculateTotal('inc');
			calculateTotal('exp');

			//Calculate the budget (income - expenses)
			data.budget = data.totals.inc - data.totals.exp;

			//Calculate the % of the total income already spent	
			if (data.totals.inc > 0) {
				data.percentage = Math.round (100* (data.totals.exp/data.totals.inc));  
		 	} else {
				 data.percentage = -1;
			 };
		},
		
		getBudget: function () {
			return {
				budget: data.budget,
				totalExp: data.totals.exp,
				totalInc: data.totals.inc,
				percentage: data.percentage,
			};
		},


	testing: function () {
		console.log (data);
	},

};


/////////////////////////////
})();



//Module 2: User Interface (UI) Controller Module

let  UIController = (function () {

///////////////////////////
//Private Space


// We store our class names here, so that if we need to change  them we can do it just once, here, for the whole JS doc.
let DOMStrings = {
	inputType: 	'.add__type',
	inputDescription: '.add__description',
	inputValue:	'.add__value',
	inputButton: '.add__btn',
	incomeContainer: '.income__list',		//These will be used to point to the placed in the HTML document
	expensesContainer: '.expenses__list',		//where we'll insert code for our various items.
	budgetLabel: '.budget__value',				//The class of the current budget display.
	incomeLabel: '.budget__income--value',
	expensesLabel: '.budget__expenses--value',
	percentageLabel:	'.budget__expenses--percentage',
	container: '.container',

};




//////////////////////////
//Public Space

return {

	getInput : function ()  {								// this block returns an object literal containing the inpout values
		return {
		type : document.querySelector(DOMStrings.inputType).value,  //returns 'inc' or 'exp' string for income/expense.
		description : document.querySelector(DOMStrings.inputDescription).value,
		value : parseFloat(document.querySelector(DOMStrings.inputValue).value),  //parseFloat converts a string to a floating point number.
		};
	},


//////////////////////// Function to add an item to the HTML


	addListItem : function(obj, type) {
		
		// create HTML in this JS file in the form of a string, with some placeholder text
		let html, newhtml, element;

		if (type === `inc`) {
			element = DOMStrings.incomeContainer;
			html = `
				<div class="item clearfix" id="inc-%id%">
                            <div class="item__description">%description%</div>
                            <div class="right clearfix">
								<div class="item__value">+ %value%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>
		`;
		} else if (type === `exp`) {
			element = DOMStrings.expensesContainer;
			html = `
				<div class="item clearfix" id="exp-%id%">
                            <div class="item__description">%description%</div>
                            <div class="right clearfix">
                                <div class="item__value">- %value%</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>
		`;
		};
		// Replace the placeolder text with input data ('id', 'description', 'value')

		newhtml = html.replace(`%id%`, obj.id);
		console.log(obj.description);
		newhtml = newhtml.replace(`%description%`, obj.description);
		newhtml = newhtml.replace(`%value%`, obj.value);

		// Insert the string HTML from this file into the DOM as actual HTML
		// We'll insert it in the beforeend position

		document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);		
	},

/////////////////////////// Function to delete an item from the HTML

	deleteListItem: function (selectorID) {

		let el = document.getElementById(selectorID);
		el.parentNode.removeChild(el); 					// Weird syntax, but that's how it works! ^__^

	},



	////////////////////// Function to clear the form after an item is created

	clearFields: function() {
		let fields, fieldsArray;
		//The .querySelectorAll method returrns a list of all elements in the specified document that match the specified CSS selector. Note that it returns a list ('a static NodeList object') NOT an array.
		fields = document.querySelectorAll(`${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`);

		//next we convert the list to an arrya using an array method called Slice.
		//Slice returns a copy of the array that it's called on, returning a new array.
		//However you can also pass a list into it using a special method, and it will still return a new array.
		// You need to call the .slice method using the .call method, and then pass the list into it, for it to work this way.
		//These methods are stored in the array proprotype. We can access it to use these methods.
		//It's weird syntax and I don't fully understand this yet! I should review it. I may not remember it but it's good to know that the method exists for future ref.

		fieldsArray = Array.prototype.slice.call(fields);

		//We can now loop over this function to clear all of the fields in the 'fields' object :3
		//This is especially useful when dealing with lots of fields at once.

		//current: Current element being processed
		//index: the index of the current element in the array
		//array: The whole array.
		fieldsArray.forEach(function(current, index, array) {
			current.value = ""		//Clears the value of the element being looked at
									//forEach loops this over evry value, and so they are all cleared :3
		});

		fieldsArray[0].focus();

	} ,

	displayBudget: function (obj) {

		console.log (obj);
		console.log(DOMStrings);
		console.log(document.querySelector(DOMStrings.incomeLabel));

		document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
		document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
		document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

		if (obj.percentage > 0 ) {
			document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
		} else {
			document.querySelector(DOMStrings.percentageLabel).textContent = '-';

		};

	},

	getDOMStrings : function () { // This block exposes the DOMStrings to the public/global scope for other modules to access.
		return DOMStrings;
	},

};



/////////////////////////////	
})();

//Module 3: Controller

let  controller = (function (budgetCtrl, UICtrl) {
//This module will pass data between the two other modules.
//For this, we've added two parameters for data from these other modules. (budgetCtrl, UICtrl).


	///////////////////////////
	//Private Space

	let setupEventListeners = function () {		// This function contains the lines that set up the event listeners.

		let DOM = UICtrl.getDOMStrings();  // This line adds the DOM strings (defined in UI COntroller) to this module :3

		document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function (event) {
			if (event.keycode === 13 || event.which === 13) {
				ctrlAddItem()
			}; 
		});


		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);


	};

	let updateBudget = function (){

			//1. Calculate the budget
			budgetCtrl.calculateBudget();

			//2. Return the budget.
			let budget = budgetCtrl.getBudget();


			//3. Display the budget on the UI
			UICtrl.displayBudget(budget);



	};

	let ctrlAddItem = function (){
			let input, newItem;
		
			
			// 1. Insert function for getting the field input data,
			input = UIController.getInput();
			console.log(input); 

			// 2. Check that the description field is not empty,
			// & check that a number (!isNaN) is entered in the Value field,
			// & checks that the value is not 0.
			if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

			// 3. add the collected data to the budget controller as an item and value,
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			
			// 4. Add the item to the UI
			UIController.addListItem(newItem, input.type);

			// 5. Clear the fields.
			UIController.clearFields();


			// 6. Calculate and update budget.
			updateBudget();

		};
	};

	let ctrlDeleteItem = function (event) {

		let  itemID, splitID, type, ID;

		 itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		 if (itemID) {	//ie. if itemID exists, which is only the case for our items, so clicking other things won't activate this.
	
			splitID = itemID.split('-'); //the split method splits a tring after the designated character & returns both parts as an array
			type = splitID[0];
			ID = parseInt(splitID[1]);	// parseInt is to change the ID, which is a string numeric digit, into a number.

			//1. deletes item from the data strudture in JS
			budgetCtrl.deleteItem(type, ID);


			//2. Deletes the item from the UI in HTML
			UICtrl.deleteListItem(itemID);

			
			//3. updates and shows the new budget.
			updateBudget();
	 };

	};




	//////////////////////////
	//Public Space

		return  {											
			init: function () {						
				setupEventListeners(); //Initialisation Function PArt 1: This function, when called, activtes the event listeners.
				UICtrl.displayBudget({
						budget: 0,
						totalExp: 0,
						totalInc: 0,
						percentage: -1,
						});
					},			
				};


	
	
	/////////////////////////////	
	})(budgetController, UIController);


	controller.init();  //Initialisation Function Part 2; this one line in global scope activates the event listeners (in this case), and so without it the page will be effectively inactive.