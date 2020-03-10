

// Module : Budget Controller

let budgetController = (function () {

////////////////////////
// Private Space

let Expense = function (id, description, value) {
	this.id = id;
	this.description = description;
	this.value = value;
};

let Income = function (id, description, value) {
	this.id = id;
	this.description = description;
	this.value = value;
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

		if (type === 'exp') {						// Creates new item (either an inc or exp.
			newItem = new Expense(ID, des, val);	// Calling the expense constructor from above, passing in ID, des, val
		} else if (type === 'inc') {
			newItem = new Income(ID, des, val);
		};

		data.allItems[type].push(newItem);			//Adds the new item to the end of the Expenses/Income array dependant on which it is!

		return newItem;								// Returns the new item, so that the module calling this function can access it too,
													//for future reasons!
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

let DOMStrings = {
	inputType: 	'.add__type',
	inputDescription: '.add__description',
	inputValue:	'.add__value',
	inputButton: '.add__btn',
	incomeContainer: '.income__list',		//These will be used to point to the placed in the HTML document
	expensesContainer: '.expenses__list',		//where we'll insert code for our various items.
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


	addListItem : function(obj, type) {
		
		// create HTML in this JS file in the form of a string, with some placeholder text
		let html, newhtml, element;

		if (type === `inc`) {
			element = DOMStrings.incomeContainer;
			html = `
				<div class="item clearfix" id="income-%id%">
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
				<div class="item clearfix" id="expense-%id%">
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

	clearFields: function() {
		let fields;
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
	} ,

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

		let DOM = UIController.getDOMStrings();  // This line adds the DOM strings (defined in UI COntroller) to this module :3

		document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function (event) {
			if (event.keycode === 13 || event.which === 13) {
				ctrlAddItem()
				}; 
			})
		};

	let updateBudget = function (){

			//1. Calculate the budget

			//2. Return the budget.

			//3. Display the budget on the UI


	};

	let ctrlAddItem = function (){
			let input, newItem
		
			
			// 1. Insert function for getting the field input data,
			input = UIController.getInput();
			console.log(input); 

			// 2. add the collected data to the budget controller as an item and value,
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			
			//3. Add the item to the UI
			UIController.addListItem(newItem, input.type);

			//4. Clear the fields.
			UIController.clearFields();


			//5. Calculate and update budget.
			updateBudget();
		};




	//////////////////////////
	//Public Space

		return  {											
			init: function () {						
				setupEventListeners(); //Initialisation Function PArt 1: This function, when called, activtes the event listeners.
			}
		
		};


	
	
	/////////////////////////////	
	})(budgetController, UIController);


	controller.init();  //Initialisation Function Part 2; this one line in global scope activates the event listeners (in this case), and so without it the page will be effectively inactive.