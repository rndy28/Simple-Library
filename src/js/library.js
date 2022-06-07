/**
 * @type {Book[]} library
 */
export let library = [];

(function () {
  if (localStorage.getItem('library') === null) {
    library = [];
  } else {
    library = JSON.parse(localStorage.getItem('library'));
  }
})();
