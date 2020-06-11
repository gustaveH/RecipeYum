import Search from "./models/Search"
import Recipe from "./models/Recipe"
import * as searchView from "./views/searchView"
import {elements, renderLoader, clearLoader} from "./views/base"

/**Blobal state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - liked recipes
 */

const state = {};


//** SEARCH controller */

const controlSearch = async () => {
  // 1) Get query from the view
  //const query = searchView.getInput();
  const query = "pizza";

  if (query){
    // 2) new search objet and add to state
    state.search = new Search(query);

    //3) Peepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes)

    try{
      // 4) search for recipes
      await state.search.getResults();

      //5) Render results
      clearLoader()
      searchView.renderResults(state.search.result);
    }catch (err){
      alert("something wrong with the search")
      clearLoader();
    }
    
  }
}
elements.searchForm.addEventListener("submit", e =>{
  e.preventDefault();
  controlSearch();
});

//testing
window.addEventListener("load", e =>{
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline")
  if(btn){
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

//** RECIPE controller */
const controlRecipe = async () =>{
  //Get ID from url
  const id = window.location.hash.replace("#", " ");
  console.log(id);

  if (id){
    //prepare ui for changes

    //create new recipe 
    state.recipe = new Recipe(id);
    window.r = state.recipe;
    try{
    //get recipe data
    await state.recipe.getRecipe();

    //calc time servings anf time
    state.recipe.calcTime();
    state.recipe.calcServings();

    //render recipe
    console.log(state.recipe);
    }catch (err){
      alert("Error processing error")
    }
    
  }
};


window.addEventListener("hashchange", controlRecipe)
window.addEventListener("load", controlRecipe)

