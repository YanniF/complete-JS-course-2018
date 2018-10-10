import Search from './models/Search';

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
  const query = 'pizza';

  if(query) {
    // new search object and add to state
    state.search = new Search(query);

    // prepare UI for results

    // search for recipes
    await state.search.getResults();

    // render results on UI
    console.log(state.search.result)
  }
};

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});
