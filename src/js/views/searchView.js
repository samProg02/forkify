import View from './view.js';

class SearchView extends View {
  _parentEl = document.querySelector('.search');
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearField();
    // this.#clearField.blur();
    // console.log(query);
    return query;
    // console.log(this.#parentEl.querySelector('.search__field').value);
  }
  _clearField() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
