import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
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
      alert('Something went wrong with the search');
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


    // create new recipe object
    state.recipe = new Recipe(id);

    try {
      // get recipe data
      await state.recipe.getRecipe();
      // calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // render recipe
    }
    catch(e) {
      alert('Error processing recipe!');
    }    
  }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));