"use strict"
const budgetController = (function() {

  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }

  Expense.prototype.calcPercentage = function(totalIncome) {
    if(totalIncome > 0)
      this.percentage = Math.round(this.value / totalIncome * 100);
    else 
      this.percentage = -1;
  }

  Expense.prototype.getPercentage = function() {
    return this.percentage;
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
    },
    budget: 0,
    percentage: -1
  }

  const calculateTotal = function(type) {
    let sum = 0;

    data.allItems[type].forEach(item => {
      sum += item.value;
    });

    data.totals[type] = sum;
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

    deleteItem: function(type, id) {
      let ids, index;

      // map returns an array
      ids = data.allItems[type].map(function(item) {
        return item.id;
      });

      index = ids.indexOf(id);

      if(index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal('expense');
      calculateTotal('income');

      // calculate the budget: income - expenses
      data.budget = data.totals.income - data.totals.expense;

      //calculate the percentage of income that we spent
      if(data.totals.income > 0) {
        data.percentage = Math.round(data.totals.expense / data.totals.income * 100);
      }
      else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      data.allItems.expense.forEach(exp => {
        exp.calcPercentage(data.totals.income);
      });
    },

    getPercentages: function() {
      let allPerc = data.allItems.expense.map(item => {
        return item.getPercentage();
      });

      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalIncome: data.totals.income,
        totalExpense: data.totals.expense,
        percentage: data.percentage
      }
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
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage'
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

    deleteListItem: function(selectorId) {
      // const selector = document.getElementById(selectorId);
      // selector.parentNode.removeChild(selector);
      document.getElementById(selectorId).remove();
    },

    clearFields: function() {
      const fields = document.querySelectorAll(UIStrings.inputDescription + ', ' + UIStrings.inputValue);

      fields.forEach(field => {
        field.value = '';
      });

      fields[0].focus();
    },

    displayBudget: function(obj) {      
      document.querySelector(UIStrings.budgetLabel).textContent = obj.budget.toFixed(2);
      document.querySelector(UIStrings.incomeLabel).textContent = '+ ' + obj.totalIncome.toFixed(2);
      document.querySelector(UIStrings.expensesLabel).textContent = '- ' + obj.totalExpense.toFixed(2);

      if(obj.percentage > 0) {
        document.querySelector(UIStrings.percentageLabel).textContent = obj.percentage + '%';
      }
      else {
        document.querySelector(UIStrings.percentageLabel).textContent = '---';
      }
      
    },
    
    displayPercentages: function(percentages) {
      const fields = document.querySelectorAll(UIStrings.expensesPercLabel);
      
      fields.forEach((field, i) => {
        if(percentages[i] > 0)
          field.textContent = percentages[i] + '%';
        else
          field.textContent = '---';
      });
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

    document.querySelector(UI.container).addEventListener('click', ctrlDeleteItem);
  }

  const updateBugdet = function() {
    // calculate the budget
    budgetCtrl.calculateBudget();

    // return the budget
    const budget = budgetCtrl.getBudget();

    // display the budget on the UI
    UICtrl.displayBudget(budget);
  }

  const updatePercentages = function() {

    // calculate percetages
    budgetCtrl.calculatePercentages();

    // read percentafes from the budget controller
    const percentages = budgetCtrl.getPercentages();

    // update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
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

      // calculate and update budget and percentages
      updateBugdet();
      updatePercentages();
    }    
  }

  const ctrlDeleteItem = function(event) {
    
    let itemDelete, itemID, splitID, type, id;

    itemDelete = findParent(event.target, 'item__delete');

    if (itemDelete) 
      itemID = itemDelete.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      id = parseInt(splitID[1]);

      // delete item from data structure
      budgetCtrl.deleteItem(type, id);

      // delete item from UI
      UICtrl.deleteListItem(itemID);

      // updtate and show new budget and percetages
      updateBugdet();
      updatePercentages();
    }
     
  }

  function findParent(el, className) {
    // to solve click target in different browsers
    while((el = el.parentElement) && !el.classList.contains(className));
    
    return el;
  }

  return {
    init: function() {
      UICtrl.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpense: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  }
  
})(budgetController, UIController);

controller.init();