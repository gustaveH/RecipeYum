import Search from "./models/Search"
import Recipe from "./models/Recipe"
import List from "./models/List"
import * as searchView from "./views/searchView"
import * as recipeView from "./views/recipeView"
import * as listView from "./views/listView"
import {elements, renderLoader, clearLoader} from "./views/base"

/**Blobal state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - liked recipes
 */

const state = {};
window.state = state;


//** SEARCH controller */

const controlSearch = async () => {
  // 1) Get query from the view
  const query = searchView.getInput();
  

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
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //create new recipe 
    state.recipe = new Recipe(id);
  
    try{
    //get recipe data and parse ingredient
    await state.recipe.getRecipe();
    state.recipe.parseIngredient();

    //calc time servings anf time
    state.recipe.calcTime();
    state.recipe.calcServings();

    //render recipe
    clearLoader();
    recipeView.renderRecipe(state.recipe);
    }catch (err){
      alert("Error processing error")
    }
    
  }
};


window.addEventListener("hashchange", controlRecipe);
window.addEventListener("load", controlRecipe);

//**List controller */

const controlList = () =>{
  //create new list if there is none
  if(!state.list) state.list = new List();

  //add each ingredient to list
  state.recipe.ingredients.forEach(el =>{
    const item = state.list.addItem(el.count, el.unit, el.ingredient)
    listView.renderItem(item);
  });
}

//handle delete and update list
elements.shopping.addEventListener("click", e =>{
  const id = e.target.closest(".shopping__item").dataset.itemid;

  //Handle the delete button
  if(e.target.matches(".shopping__delete, .shopping__delete *")){
    //delete from state
    state.list.deleteItem(id);

    //delete from ui
    listView.deleteItem(id);

    //handles count update
  } else if (e.target.matches(".shopping__count-value")){
    const val = parseFloat(e.target.value);
    state.list.updateCount(id, val)
  }
})
//handling recipe button clicks
elements.recipe.addEventListener("click", e =>{
  if (e.target.matches(".btn-decrease, .btn-decrease *")){
    //decrease button is clicked
    if (state.recipe.servings > 1){
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
    
  }else if (e.target.matches(".btn-increase, .btn-increase *")){
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  }else if(e.target.matches(".recipe__btn--add, .recipe__btn--add *")){
    controlList();
  }
});

window.l = new List();
