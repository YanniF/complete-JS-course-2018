import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from "./views/base";

/*
  Global state of the app
  - search object
  - current recipe object
  - shopping list object
  - liked recipes 
*/
const state = {};


// SERACH CONTROLLER
const controlSearch = async () => {
  // get query from view
  const query = searchView.getInput();
  
  if(query) {
    // new search object and add to state
    state.search = new Search(query);

    // prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResults);

    try {
      // search for recipes
      await state.search.getResults();
  
      // render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    }
    catch(error) {
      alert('Something went wrong with the search \n' + error);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
  let btn;

  btn = e.target.classList.contains('.btn-inline') ? e.target : e.target.closest('.btn-inline');
  
  if(btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});


// RECIPE CONTROLLER
const controlRecipe = async () => {
  // get id from the url
  const id = window.location.hash.replace('#', '');

  if(id) {
    // prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlight selected search item
    if(state.search)
      searchView.highlightSelected(id);

    // create new recipe object
    state.recipe = new Recipe(id);

    try {
      // get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    }
    catch(e) {
      alert('Error processing recipe!\n' + e);
    }    
  }
};


// LIST CONTROLLER
const controlList = () => {
  // create a new list if there is none yet
  if(!state.list) 
    state.list = new List();

  // add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

//handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  
  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    // delete from state
    state.list.deleteItem(id);
    // delete form UI
    listView.deleteItem(id);
  }
  else if(e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});


// LIKE CONTROLLER
const controlLike = () => {
  if (!state.likes) 
    state.likes = new Likes();

  const currentId = state.recipe.id;

  // user didn't like current recipe
  if (!state.likes.isLiked(currentId)) {
    // add like to the state
    const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);
    
    // toggle the like button
    likesView.toggleLikeBtn(true);

    // add like to UI list
    likesView.renderLike(newLike);
  } 
  else {
    // Remove like from the state
    state.likes.deleteLike(currentId);

    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from UI list
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();

  // restore likes
  state.likes.readStorage();

  // toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});


// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if(e.target.matches('.btn-decrease, .btn-decrease *')) {
    // decrease button is clicked

    if(state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  }
  else if(e.target.matches('.btn-increase, .btn-increase *')) {
    // increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }
  else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // add the ingredients to the shopping list
    controlList();
  }
  else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
});

