

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
	
	allItems = {
		exp : [],

		inc : [],
	},
	
	totals = {
		exp : 0,
		inc : 0,
	},

};



////////////////////////
// Public Space

return {

	addItem: function (type, des, val) {  			//Type, Description & Value

		let newItem;
		
		ID = 0;										// We'll change ID to an ID generator later.

		if (type === 'exp') {
			newItem = new Expense(ID, des, val);	// Calling the expense constructor from above, passing in ID, des, val
		} else if (type === 'inc') {
			newItem = new Income(ID, des, val);
		};

		data.allItems[type].push(newItem);			//Adds the new item to the end of the Expenses/Income array dependant on which it is!

		return newItem;


	};	


};


/////////////////////////////
})();



//Module 2: User Interface (UI) Module

let  UIController = (function () {

///////////////////////////
//Private Space

let DOMStrings = {
	inputType: 	'.add__type',
	inputDescription: '.add__description',
	inputValue:	'.add__value',
	inputButton: '.add__btn'
};




//////////////////////////
//Public Space

return {

	getInput: function ()  {								// this block returns an object literal containing the inpout values
		return {
		type : document.querySelector(DOMStrings.inputType).value,  //returns 'inc' or 'exp' string for income/expense.
		description : document.querySelector(DOMStrings.inputDescription).value,
		value : document.querySelector(DOMStrings.inputValue).value,
		};
	},

	getDOMStrings: function () { // This block exposes the DOMStrings to the public/global scope for other modules to access.
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

	

	let ctrlAddItem = function (){

		
			
			// 1. Insert function for getting the field input data,

			let input = UIController.getInput();
			console.log(input); 

/*			2. add the collected data to the budget controller as an item and value,
			3. Ass the item to the UI
			4. Calculate the budget
			5. Display the budget on the UI
*/
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