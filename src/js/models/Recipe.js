import axios from "axios"

export default class Recipe {
  constructor(id){
    this.id = id;
  }

  async getRecipe(){
    try{
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      

    }catch(eror){
      console.log(error)
      alert("Somethinf went wrong");
    }
  }

    calcTime(){
      const numIng = this.ingredients.length;
      const periods = Math.ceil(numIng / 3);
      this.time = periods * 15
    }
    calcServings(){
      this.servings = 4;
    }

    parseIngredient(){
      const unitsLong = ["tablespoon", "tablespoons","tbsps", "ounces", "ounce", "teaspoon", "teaspoons", "cups", "pounds"];
      const unitsShort = ["tbsp", "tbsp","tbsp", "oz", "oz", "tsp","tsp", "cup", "pound"];

      const newIngredients = this.ingredients.map(el =>{
        // 1) Uniform units
        let ingredient = el.toLowerCase();
        unitsLong.forEach((unit, i) => {
          ingredient = ingredient.replace(unit, unitsShort[i]);
        });

        // 2) Remove parenthesis
        ingredient = ingredient.replace(/ *\([^)]*\) */g, "");

        // 3) Parse ingredient into count, unit and ingredient
        return ingredient;

      });
      this.ingredients = newIngredients;
    }
}