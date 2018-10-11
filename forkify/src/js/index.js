import Search from './models/Search';
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

    // search for recipes
    await state.search.getResults();

    // render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
  let btn;

  btn = e.target.classList.contains('.btn-inline') ? btn = e.target : e.target.closest('.btn-inline');
  
  if(btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});


// Hi!

// So that's how I did it:

//  btn = e.target.classList.contains('.btn-inline') ? e.target : e.target.closest('.btn-inline'); 

// If it's Firefox, then e.target will have the class, otherwise use e.target.closest

// :)