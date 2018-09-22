"use strict"

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
    document.querySelector(UI.inputType).addEventListener('change', UICtrl.changeType);
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

  const storageBudget = function() {
    const budget = budgetCtrl.getDataBudget();
    localStorage.setItem('budget', JSON.stringify(budget));
  }

  const getSavedBudget = function() {
    let savedBudget, expenses, incomes;

    if(localStorage.getItem('budget') === null) {
      savedBudget = [];
    }
    else {
      savedBudget = JSON.parse(localStorage.getItem('budget'));
      expenses = savedBudget.allItems.expense;
      incomes = savedBudget.allItems.income;

      incomes.forEach(income => {
        UICtrl.addListItem(income, 'income');      
      });

      expenses.forEach(expense => {
        UICtrl.addListItem(expense, 'expense');
      });

      budgetCtrl.setDataBudget(savedBudget);
    }
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
      storageBudget();
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
      storageBudget();
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
      UICtrl.displayDate();
      setupEventListeners();

      getSavedBudget();
      updatePercentages();
      updateBugdet();
    }
  }
  
})(budgetController, UIController);

controller.init();