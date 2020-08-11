var backgroundController = (function() {
	return {
		//fetchHandlers doing most of the heavy lifting for selections
		fetchHandlers: function() {
			return {
				addNewItemForm: document.querySelector('#new-item-form'),
				addNewItemButton: document.querySelector('#add-new-item'),
				addNewItemInput: document.querySelector('#new-item'),
				activeItemsList: document.querySelector('#active-items-list'),
				commonItemsList: document.querySelector('#common-items-list'),
				loggingList: document.querySelector('#logging-list-main'),
				activeListItemList: document.querySelectorAll('.newActive'),
				commonItemsListButtonsList: document.querySelectorAll('.btn-add')
			}
		},
		//some interoperable create methods for ease of program construction
		createHandlers: function() {
			return {
				createNewLi: function() {
					let li = document.createElement('li');
					let button = document.createElement('button');
					button.innerHTML = '-';
					li.setAttribute('class', 'newActive');


					return {
						newListItem: li,
						newButton: button,
					}
				},
				createNewLogEntry: function(message) {
					let loggingList = backgroundController.fetchHandlers().loggingList;
					let date = new Date();
					let time = date.toLocaleTimeString();
					let li = document.createElement('li');
					li.setAttribute('class', 'logEntry');
					li.innerHTML = time + ": " + message;
					loggingList.appendChild(li);

				}
			}
		},
		//form controls methods for augmenting user inputs
		formControls: function() {
			let inputField = backgroundController.fetchHandlers().addNewItemInput;
			return {
				clearForms: function() {
					inputField.value = "";
					inputField.blur();
				}
			}
		}
	}

})();

var inputsController = (function(bgCtrl) {
	let fetchHandlers = bgCtrl.fetchHandlers;
	//there are only 2 callback functions used by this app, primaryAddItemCallBackFunction and secondaryCallBackFunction
	let primaryAddItemCallBackFunction = function() {
		let value, preparedValueForInput;
		if (this.getAttribute('class') == 'btn-add') {
			value = this.parentElement.textContent.trim().substring(0, this.parentElement.textContent.trim().length - 1);
		}
		else if (this.getAttribute('class') === 'test') {
			value = fetchHandlers().addNewItemInput.value.trim();
		}
		else {
			console.log('primaryAddItemCallBackFunction failed to execute (improper classes)');
			return
		}
		let arrayActiveItems = new Array();
		for (let i = 0; i < fetchHandlers().activeItemsList.children.length; i++) {
			arrayActiveItems.push(fetchHandlers().activeItemsList.children[i].textContent.trim().toLowerCase().substring(0, fetchHandlers().activeItemsList.children[i].textContent.trim().length - 1));
		}
		if (arrayActiveItems.indexOf(value.toLowerCase()) !== -1) {
			bgCtrl.formControls().clearForms();
			bgCtrl.createHandlers().createNewLogEntry(value + ' Rejected (Duplicate)')
			return
		}
		else {
			if (this.getAttribute('class') == 'btn-add') {
				this.parentNode.remove();
				fetchHandlers().activeItemsList.appendChild(this.parentNode);
				this.parentNode.setAttribute('class', 'newActive');
				this.innerHTML = '-';
				this.removeEventListener('click', primaryAddItemCallBackFunction);
				this.addEventListener('click', secondaryCallBackFunction);
			}
			else if (this.getAttribute('class') === 'test') {
				let newLi = bgCtrl.createHandlers().createNewLi().newListItem;
				let newButton = bgCtrl.createHandlers().createNewLi().newButton;
				newLi.innerHTML = value;
				fetchHandlers().activeItemsList.appendChild(newLi);
				newLi.appendChild(newButton);
				newLi.firstElementChild.setAttribute('class', 'test');
				newLi.firstElementChild.addEventListener('click', secondaryCallBackFunction);
				bgCtrl.formControls().clearForms();
				
			}
			else {
				console.log('primaryAddItemCallBackFunction failed to execute (improper classes)');
				return
			}
			bgCtrl.createHandlers().createNewLogEntry(value + ' Added');
		}
	};
	let secondaryCallBackFunction = function() {
		if (this.getAttribute('class') == 'btn-add') {
			this.parentNode.remove();
			fetchHandlers().commonItemsList.appendChild(this.parentNode);
			this.parentNode.setAttribute('class', 'newInactive');
			this.innerHTML = "+"
			this.removeEventListener('click', secondaryCallBackFunction);
			this.addEventListener('click', primaryAddItemCallBackFunction);
			bgCtrl.createHandlers().createNewLogEntry('Common Item Preset Removed');
			return
		}
		else if (this.getAttribute('class') == 'test') {
			this.parentNode.remove();
			this.removeEventListener('click', secondaryCallBackFunction);
			bgCtrl.createHandlers().createNewLogEntry('Unique Item Removed');
			return
		}
		else {
			console.log('secondaryCallBackFunction failed to execute (improper classes)');
			return
		}	
	};
	//return objects always for importing a narrow amount of data into subsequent IIFEs 
	return {
		primaryAddItem: primaryAddItemCallBackFunction,
		secondaryRemoveItem: secondaryCallBackFunction
	}

})(backgroundController);

var mainController = (function(bgCtrl, inputCtrl) {
	let fetchHandlers = bgCtrl.fetchHandlers;
	//a nice little script for adding event listeners on init / page load
	let initAddEventListeners = function() {
		fetchHandlers().addNewItemButton.addEventListener('click', inputCtrl.primaryAddItem)
		fetchHandlers().addNewItemInput.addEventListener('keypress', function(e) {
			if (e.which === 13 || e.charCode === 13) {
				inputCtrl.primaryAddItem.call(fetchHandlers().addNewItemInput);
			}
			else {
				return
			}
		});
		for (let i = 0; i < fetchHandlers().commonItemsList.children.length; i++) {
			fetchHandlers().commonItemsList.children[i].firstElementChild.addEventListener('click', inputCtrl.primaryAddItem);
		}
	};

	return {
		//finalized init method runs two different methods from separate IIFEs to create a panoramic document initialization experience <.<
		init: function() {
			bgCtrl.createHandlers().createNewLogEntry('Page Loaded');
			initAddEventListeners()
		}
	}
})(backgroundController, inputsController);
//beautiful window onload event listener I learned from Salem, eliminating the need to reposition the script tag below the HTML
window.addEventListener('load', mainController.init);
