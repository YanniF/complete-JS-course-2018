"use strict"

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
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  const formatNumber = function(num, type) {
      
    let sign = type === 'expense' ? '-' : '+';
    num = num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    return sign + ' ' + num;
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
              <div class="item__value">${formatNumber(obj.value, type)}</div>
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
              <div class="item__value">${formatNumber(obj.value, type)}</div>
              <div class="item__percentage">%</div>
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
      let type = obj.budget >= 0 ? 'income' : 'expense';

      document.querySelector(UIStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(UIStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'income');
      document.querySelector(UIStrings.expensesLabel).textContent = formatNumber(obj.totalExpense, 'expense');

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

    displayDate: function() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.toLocaleString("en-US", {month: "long"});

      document.querySelector(UIStrings.dateLabel).textContent = month + ' ' + year;
    },

    changeType: function() {
      const fields = document.querySelectorAll(UIStrings.inputType + ', ' + UIStrings.inputDescription + ', ' + UIStrings.inputValue);

      fields.forEach(field => {
        field.classList.toggle('red-focus');
      });

      document.querySelector(UIStrings.buttonAdd).classList.toggle('red');
    },

    getUIStrings: function() {
      return UIStrings;
    }
  }
})();