

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

	getInput : function ()  {								// this block returns an object literal containing the inpout values
		return {
		type : document.querySelector(DOMStrings.inputType).value,  //returns 'inc' or 'exp' string for income/expense.
		description : document.querySelector(DOMStrings.inputDescription).value,
		value : document.querySelector(DOMStrings.inputValue).value,
		};
	},


	addListItem : function(obj, type) {
		
		// create HTML in this JS file in the form of a string, with some placeholder text
		let html, newhtml;

		if (type === `inc`) {
			html = `
				<div class="item clearfix" id="income-%id%">
                            <div class="item__%description%">Salary</div>
                            <div class="right clearfix">
                                <div class="item__%value%">+ 2,100.00</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>
		`;
		} else if (type === `exp`) {
			html = `
				<div class="item clearfix" id="expense-%id%">
                            <div class="item__%description%">Apartment rent</div>
                            <div class="right clearfix">
                                <div class="item__%value%">- 900.00</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>
		`;
		};
		// Replace the placeolder text with input data ('descriptiuon')

		newhtml = html.replace(`%id%`, obj.id);
		newhtml = html.replace(`%description%`, obj.description);
		newhtml = html.replace(`%value%`, obj.value);

		// Insert the string HTML from this file into the DOM as actual HTML

		

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

		let DOM = UIController.getDOMStrings();  // This line adds the DOM strings (defined in UI COntroller) to this module :3

		document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function (event) {
			if (event.keycode === 13 || event.which === 13) {
				ctrlAddItem()
				}; 
			})
		};

	

	let ctrlAddItem = function (){
			// let input, newItem			< this is old syntax. We don't need to pre-define these.
		
			
			// 1. Insert function for getting the field input data,
			let input = UIController.getInput();
			console.log(input); 

			// 2. add the collected data to the budget controller as an item and value,
			let newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			



/*			3. Ass the item to the UI
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