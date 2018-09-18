"use strict"
const budgetController = (function() {

  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  const data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expense: 0,
      income: 0
    }
  }

  return {
    addItem: function(type, desc, val) {
      let newItem, id;

      // create new ID
      if(data.allItems[type].length > 0) 
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      else
        id = 0;

      // create new item based on income or expense type
      if(type === 'expense')
        newItem = new Expense(id, desc, val);
      else if(type === 'income')
        newItem = new Income(id, desc, val);

      // push it into the data structure
      data.allItems[type].push(newItem);

      return newItem;
    },
    testing: function() {
      console.log(data)
    }
  }
  

})();

const UIController = (function() {
  
  const UIStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    buttonAdd: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  }
  return {
    getInput: function() {

      return {
        type: document.querySelector(UIStrings.inputType).value,
        description: document.querySelector(UIStrings.inputDescription).value,
        value: parseFloat(document.querySelector(UIStrings.inputValue).value)
      }      
    },

    addListItem: function(obj, type) {
      let html, element;

      // create HTML string
      if(type === 'income') {
        element = UIStrings.incomeContainer;
        html = 
          `<div class="item clearfix" id="income-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
              <div class="item__value">+ ${obj.value}</div>
              <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
              </div>
            </div>
          </div>`;
      }
      else if (type === 'expense') {
        element = UIStrings.expensesContainer;
        html = 
          `<div class="item clearfix" id="expense-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
              <div class="item__value">- ${obj.value}</div>
              <div class="item__percentage">21%</div>
              <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
              </div>
            </div>
          </div>`;
      }

      // insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', html);

    },

    clearFields: function() {
      const fields = document.querySelectorAll(UIStrings.inputDescription + ', ' + UIStrings.inputValue);

      fields.forEach(field => {
        field.value = '';
      });

      fields[0].focus();
    },

    getUIStrings: function() {
      return UIStrings;
    }
  }
})();

const controller = (function(budgetCtrl, UICtrl) {

  const setupEventListeners = function() {

    const UI = UICtrl.getUIStrings();

    document.querySelector(UI.buttonAdd).addEventListener('click', crtlAddItem);  

    document.addEventListener('keypress', function(event) {
      if(event.keyCode === 13 || event.which === 13) {
        crtlAddItem();
      }
    });
  }

  const updateBugdet = function() {
    // calculate the budget

    // return the budget

    // display the budget on the UI
  }

  const crtlAddItem = function() {
    let input, newItem;

    // get the field input data
    input = UICtrl.getInput();

    if(input.description !== "" && input.value > 0) {
      // add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // clear the fields
      UICtrl.clearFields();

      // calculate and update budget
      updateBugdet();
    }    
  }

  return {
    init: function() {
      setupEventListeners();
    }
  }
  
})(budgetController, UIController);

controller.init();