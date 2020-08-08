
//background controller will universalize script calls for selector methods in the fetchHandlers method of the return object
//the createHandlers() method return object will hold simpler properties and methods that may need to be dispensed to multiple controller modules
var backgroundController = (function () {

	return {
		fetchHandlers: function() {
			return {
				loggingListID: document.querySelector('#logging-list-main'),
				commonItemListID: document.querySelector('#common-items-list'),
				activeItemListID: document.querySelector('#active-items-list'),
				commonItemsButtonClass: document.querySelectorAll('.btn-add'),
				addCustomItemButton: document.querySelector('#add-new-item'),
				addCustomItemInput: document.querySelector('#new-item'),
				newActiveClassNodeList: document.querySelectorAll('.newActive'),
				commonItemsListLi: document.querySelector('#common-items-list>li'),
				activeItemsListLi: document.querySelectorAll('#active-items-list>li'),
				newActiveClassHTMLCollection: document.getElementsByClassName('newActive')

			}
		},

		createHandlers: function() {
			let dateToday = new Date();
			let timeToday = dateToday.toLocaleTimeString();
			return {
				dateToday: dateToday,
				timeToday: timeToday,
				newLi: document.createElement('li'),
				//method can be dynamically adapted to create unique time-prepended log entries
				newLogMethod: function(newEntry) {
					let newLog = this.newLi;
					newLog.innerHTML = timeToday + ' ' + newEntry;
					document.querySelector('#logging-list-main').appendChild(newLog);

				}
			}
		}
	}
})();

var calculationsController = (function (bgCtrl) {
	//primary calculations for window onload time logging
	let addDateLogEntryInit = function() {
		bgCtrl.createHandlers().newLogMethod(': Page Loaded');
	};
	//primary event listener controls, and primary init calculations for "common item" list feature
	//this is a callback function for restoring the "common item" to the "common list" after being moved to active
	let commonItemCallbackTwo = function() {
		this.parentNode.remove();
		this.innerHTML = '+';
		this.removeEventListener('click', commonItemCallbackTwo);
		bgCtrl.fetchHandlers().commonItemListID.appendChild(this.parentNode);
		this.parentNode.setAttribute('class', 'newInactive');
		this.addEventListener('click', commonItemCallback);
		let activeClassList = bgCtrl.fetchHandlers().newActiveClassNodeList;
	};
	//this function moves the "common item" to the "active list", and similar to the above #2 callback function, it creates an inverse event listener
	let commonItemCallback = function() {
		this.parentNode.remove();
		this.innerHTML = '-';
		this.removeEventListener('click', commonItemsDupeRemoval);
		bgCtrl.fetchHandlers().activeItemListID.appendChild(this.parentNode);
		this.parentNode.setAttribute('class', 'newActive');

		this.addEventListener('click', commonItemCallbackTwo);
		let activeClassList = bgCtrl.fetchHandlers().newActiveClassNodeList;

	};
	//this function sets the primary, initial eventlistener on each pre-scripted button found in the "common list", for init
	let commonItemsScriptSetup = function() {
		let commonItems = bgCtrl.fetchHandlers().commonItemsButtonClass;
		let activeClassList = bgCtrl.fetchHandlers().newActiveClassNodeList;
		for (i = 0; i < commonItems.length; i++) {
			let thisItem = commonItems[i];
			//thisItem.addEventListener('click', commonItemCallback);
			thisItem.addEventListener('click', commonItemsDupeRemoval);
		};
	};
	let commonItemsDupeRemoval = function() {
		let lexicalThis = this;
		let activeItemParentsNodeList = bgCtrl.fetchHandlers().activeItemsListLi;
		console.log(activeItemParentsNodeList);
		let commonItems = bgCtrl.fetchHandlers().commonItemsButtonClass;
		for (let i = 0; i < activeItemParentsNodeList.length; i++) {
			let specificActiveItemForSubstring = activeItemParentsNodeList[i].textContent;
			let lexicalThisTextForSubstring = lexicalThis.parentNode.textContent;
			if (lexicalThisTextForSubstring.substring(0, lexicalThisTextForSubstring.length - 2).toLowerCase() === specificActiveItemForSubstring.substring(0, specificActiveItemForSubstring.length - 2).toLowerCase()) {
				console.log('this is it');
				return;
			}
			else if (activeItemParentsNodeList.length == 0) {
				commonItemCallback.call(lexicalThis);
				return;
			}
//			else if (specificActiveItemForSubstring.substring(0, specificActiveItemForSubstring.length - 2).toLowerCase() != lexicalThisTextForSubstring.substring(0, lexicalThisTextForSubstring.length - 2).toLowerCase()) {
//				console.log('undefineds');
//			}
			else {
				commonItemCallback.call(lexicalThis);
				//console.log("we're here");
				//commonItemCallback.call(lexicalThis);
				return;
			}

		};

//		interval = setInterval(function() {
//
//
//		}, 100);

	};



	//
	//Custom shopping list item controls and calculations
	//serialVar here.. because I did not implement a more fool-proof system of serializing new shopping list items (yet)
	let serialVar;
	//on function call, the user input field now loses focus and is set to an empty string (to prevent storing a string of whitespace between entries) (for use below)
	let clearFields = function() {
		bgCtrl.fetchHandlers().addCustomItemInput.value = "";
		bgCtrl.fetchHandlers().addCustomItemInput.blur();
	};
	//function for init, setting up primary event listeners for the crux of the "shopping list, add item to active list" portion of the code
	let customListItem = function() {
		//defining serialVar as 0 on init, as a means of providing a unique ID for newly created elements in the addbutton callback
		serialVar = 0;
		bgCtrl.fetchHandlers().addCustomItemButton.addEventListener('click', addButtonCallback);
		//separate event handlers making use of the callback function in unique way for click and 'enter' keyup event
		bgCtrl.fetchHandlers().addCustomItemInput.addEventListener('keyup', function(e) {
			if (e.which === 13 || e.keyCode === 13) {
				addButtonCallback();
			}
		});
	};
	//sophisticated callback function controlling when a "new active list item" is allowed to be created through user input, what it may contain, and how it is removed
	let addButtonCallback = function() {
		let userInput = bgCtrl.fetchHandlers().addCustomItemInput.value;
		userInput = userInput.trim();
		//if the trimmed version of the value of the user input field is not an empty string...
		if (userInput != "")  {
			//creating an HTML button as a string
			let newItemButton = ' <button id="' + serialVar + 'buttonShoppingListApp">-</button>';
			//creating a new li node
			let newItem = bgCtrl.createHandlers().newLi;
			//stitching together trimmed user input and the new HTML button
			newItem.innerHTML = userInput + newItemButton;
			//a unique call to get a snapshot of what li items have the 'active class' before the new li node is appended to the "active item" list, for use in the for loop identifying duplicate textContent properties
			let activeClassList = bgCtrl.fetchHandlers().newActiveClassNodeList;
			//adding this newly created li node to the bottom of the "active items" list
			bgCtrl.fetchHandlers().activeItemListID.appendChild(newItem);
			//adding a class identifying the newly created node as active and akin to other "active list" li nodes
			newItem.setAttribute('class', 'newActive');
			//adding an event listener to the unique new item, simply removing it if the button is clicked
			newItem.firstElementChild.addEventListener('click', function() {
				this.parentNode.remove();
			});
			//I'm not really sure of the best way to handle this but this looped ternary operation seems to work functionally to prevent duplicate items from being listed in active
			//this will just remove the item right away if it has a duplicate textContent property to any element with the class 'newActive'

			for (var i = 0; i < activeClassList.length; i++){
				newItem.textContent == activeClassList[i].textContent ? newItem.remove() : undefined;
			};
			//superior scoped serialVar is iterated by 1 to allow for unique serialization of the next created button element
			serialVar++;
			// the user input field now loses focus and is set to an empty string (to prevent storing a string of whitespace between entries)
			clearFields();

		}
		//else statement implying that if the trimmed input is equal to an empty string, the input is to be cleared and blurred
		else {
			clearFields();
		}




	};
	// a return object allowing access to the primary functions of this module 
	return {
		//add the current time as the first log entry, packaged for init
		addDateLogEntryInit: function() {
			addDateLogEntryInit();
		},
		//set up and control event handlers created for items located on the common item list at init 
		commonItemsScriptInit: function() {
			commonItemsScriptSetup();
		},
		//set up and control initial event handlers for adding custom entries
		customItemScriptInit: function() {
			customListItem();
		}
	}
})(backgroundController);


var mainController = (function (calcMain) {

	return {
		//solitary init function in return object organizes all necessary init methods of param function return objects
		init: function() {
			calcMain.addDateLogEntryInit();
			calcMain.commonItemsScriptInit();
			calcMain.customItemScriptInit();
		}

	}

})(calculationsController);
//calling the init function on page load to make sure the modules run after all the HTML is created
window.addEventListener('load', mainController.init);