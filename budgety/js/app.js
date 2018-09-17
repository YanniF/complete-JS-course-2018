const budgetController = (function() {
  
})();

const UIController = (function() {
  // code
})();

const controller = (function(budgetCtrl, UICtrl) {

  const crtlAddItem = function() {
    console.log('bilu')
  }

  document.querySelector('.add__btn').addEventListener('click', crtlAddItem);  

  document.addEventListener('keypress', function(event) {
    if(event.keyCode === 13 || event.which === 13) {
      crtlAddItem();
    }
  });
})(budgetController, UIController);