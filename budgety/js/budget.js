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