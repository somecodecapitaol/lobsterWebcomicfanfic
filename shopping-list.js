var backgroundController = (function() {
	return {
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
	let primaryAddItemCallBackFunction = function() {
		let value;
		if (this.getAttribute('class') === 'btn-add') {
			value = this.parentElement.textContent.trim().substring(0, this.parentElement.textContent.trim().length - 1);
		}
		else if (this.getAttribute('class') === 'test') {
			value = fetchHandlers().addNewItemInput.value.trim();
		}
		
		let arrayActiveItems = new Array();
		for (let i = 0; i < fetchHandlers().activeItemsList.children.length; i++) {
			arrayActiveItems.push(fetchHandlers().activeItemsList.children[i].textContent.trim().toLowerCase().substring(0, fetchHandlers().activeItemsList.children[i].textContent.trim().length - 1));
		}
		if (arrayActiveItems.indexOf(value.toLowerCase()) !== -1) {
			return
		}
		else {
			//console.log(arrayActiveItems);
			let newLi = bgCtrl.createHandlers().createNewLi().newListItem;
			let newButton = bgCtrl.createHandlers().createNewLi().newButton;
			newLi.innerHTML = value;
			fetchHandlers().activeItemsList.appendChild(newLi);
			newLi.appendChild(newButton);
			newLi.firstElementChild.addEventListener('click', secondaryCallBackFunction);
			bgCtrl.createHandlers().createNewLogEntry(value + ' added');
			bgCtrl.formControls().clearForms();
			//console.log(arrayOfActiveItems);
			return
		}


	};
	let secondaryCallBackFunction = function() {
		//		if (this. === 'btn-add') {
		//			this.parentNode.remove();
		//			fetchHandlers().commonItemsList.appendChild(this);
		//			return;
		//		}
		//		else {
		//			this.parentNode.remove();
		//		}
		//		
		console.log('hi');
	};

	return {
		primaryAddItem: primaryAddItemCallBackFunction,
		secondaryRemoveItem: secondaryCallBackFunction
	}


})(backgroundController);

var mainController = (function(bgCtrl, inputCtrl) {
	let fetchHandlers = bgCtrl.fetchHandlers;
	let loopingHandlers = bgCtrl.loopingHandlers;
	//let loopingHandlers = bgCtrl.loopingHandlers;

	let initAddEventListeners = function() {
		fetchHandlers().addNewItemButton.addEventListener('click', inputCtrl.primaryAddItem)
		fetchHandlers().addNewItemInput.addEventListener('keypress', function(e) {
			if (e.which === 13 || e.charCode === 13) {
				inputCtrl.primaryAddItem();
			}
			else {
				return
			}
		});

	};

	return {
		init: function() {
			bgCtrl.createHandlers().createNewLogEntry('Page Loaded');
			initAddEventListeners()
		}
	}

})(backgroundController, inputsController);
window.addEventListener('load', mainController.init);
//window.addEventListener('load', mainController.init);