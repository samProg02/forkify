import * as model from './model.js';

import 'core-js/stable';
import 'regenerator-runtime';
import recipeView from './views/recipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    resultView.update(model.getSearchresultPage());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);

    /////1. Loading Recipe
  } catch (err) {
    // console.log(err);
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResult = async function () {
  try {
    ///Get search query

    const query = searchView.getQuery();
    if (!query) return;
    ///Load Search Query

    await model.loadSearchResult(query);
    resultView.renderSpinner();
    resultView.render(model.getSearchresultPage());
    paginationView.render(model.state.search);
    console.log(model.state.search.result);
    /////Clear search Field
    // searchView.clearField();
  } catch (err) {}
};

const controlPagination = function (goToPage) {
  resultView.render(model.getSearchresultPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //////Update the recipe servings in the state
  model.updateServings(newServings);

  ///////Update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  ////Add to bookmark View list
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    /////Show loading spinner
    addRecipeView.renderSpinner();

    console.log(newRecipe);
    await model.uploadRecipe(newRecipe);
    //Render Recipe
    recipeView.render(model.state.recipe);

    ///Success Message
    addRecipeView.renderMessage();

    ///Re render Bookmarks View

    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      //Close Window
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError('Wrong Ingredient Format ');
  }
};
// controlRecipe();
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
