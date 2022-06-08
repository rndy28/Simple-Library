//@ts-check
import { library } from './library.js';
import { isBookExist, validateInput, clearInput } from './utils.js';

/**
 * @typedef Book
 * @property {number} id
 * @property {string} title
 * @property {string} author
 * @property {number} pages
 * @property {boolean} isRead
 */

/**
 *
 * @param {Book} book - book object
 * @returns {Book} - new book containing all data its needed
 */
function Book(book) {
  return { ...book };
}

function addToLibrary() {
  const form = document.querySelector('.js-form');
  const checkbox = /**@type {HTMLInputElement} */ (
    document.querySelector('input[name="checkbox"]')
  );
  const inputs = /**@type {HTMLInputElement[]} */ ([
    ...document.querySelectorAll('.js-input'),
  ]);

  // for validating input change
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      if (!input.classList.contains('error') && input.value !== '') return;
      validateInput(inputs);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateInput(inputs)) return;
    if (isBookExist(inputs[0].value, library)) return alert('book existed!');

    const book = Book({
      id: Date.now(),
      title: inputs[0].value,
      author: inputs[1].value,
      pages: Number(inputs[2].value),
      isRead: checkbox.checked,
    });
    library.push(book);
    localStorage.setItem('library', JSON.stringify(library));
    removeModal();
    clearInput(inputs, checkbox);
    updateDisplay();
  });
}

/**
 *
 * @param {boolean=} [showOnLoad=false]
 */
function toggleModal(showOnLoad) {
  const addBtn = document.querySelector('.js-btn-create');
  const modal = document.querySelector('.js-modal');
  const cross = document.querySelector('.js-cross');
  addBtn.addEventListener('click', () => {
    cross.classList.add('is-clicked');
    modal.classList.add('visible');
  });

  if (showOnLoad) {
    cross.classList.add('is-clicked');
    modal.classList.add('visible');
  }
}

/**
 *
 * @param {string} title
 */
function toggleRead(title) {
  library.forEach((book) =>
    book.title === title ? (book.isRead = !book.isRead) : book
  );

  localStorage.setItem('library', JSON.stringify(library));
}

function removeModal() {
  document.querySelector('.js-modal').classList.remove('visible');
  document.querySelector('.js-cross').classList.remove('is-clicked');
}

/**
 *
 * @param {string} title
 * @param {HTMLElement} bookEl
 */
function deleteBook(title, bookEl) {
  library.map((book, index) => {
    if (book.title === title) {
      library.splice(index, 1);
      bookEl.remove();
    }
  });
  localStorage.setItem('library', JSON.stringify(library));
}

/**
 *
 * @param {Book[]} library
 */
function displayBook(library) {
  const books = document.querySelector('.js-books-placeholder');
  books.innerHTML = library
    .map((el) => {
      return `
        <article class='c-book'>
            <h3 class="c-book__title">"${el.title}"</h3>
            <h4 class="c-book__author">${el.author}</h4>
            <p class="c-book__pages">${el.pages.toLocaleString('en')} ${
        el.pages === 1 ? 'Page' : 'Pages'
      }</p>
        <div class="c-book__wrapper">
            <a href="#" class="c-btn c-btn--isread small js-btn-isread  ${
              el.isRead ? 'success' : 'secondary'
            }">${el.isRead ? 'Read' : 'Not Read'}</a>
            <a href="#" class="c-btn small danger js-btn-remove">Remove</a>
        </div>
        </article>`;
    })
    .join(' ');
  library.length > 3 && window.innerWidth > 600
    ? books.classList.add('space-between')
    : books.classList.remove('space-between');
}

function updateDisplay() {
  const emptyLibrary = document.querySelector('.js-empty-library');

  library.length === 0 && emptyLibrary.classList.add('visible');
  library.length >= 1 && emptyLibrary.classList.remove('visible');
  displayBook(library);
}

function searchBook() {
  const searchTerm = /**@type {HTMLInputElement} */ (
    document.querySelector('input[name="search"]')
  );
  const noBookFound =
    /**@type {HTMLDivElement} */ document.querySelector('.js-book-not-found');

  searchTerm.addEventListener('input', () => {
    if (library.length === 0) return;

    const filteredBook = library.filter(
      (book) =>
        book.title.includes(searchTerm.value) ||
        book.title.toLowerCase().includes(searchTerm.value)
    );
    if (filteredBook.length === 0) {
      noBookFound.classList.add('visible');
      displayBook([]);
    } else {
      noBookFound.classList.remove('visible');
      displayBook(filteredBook);
    }
  });
}

updateDisplay();
toggleModal();
searchBook();
addToLibrary();

document
  .querySelector('.js-books-placeholder')
  .addEventListener('click', (e) => {
    e.preventDefault();
    const target = /** @type {HTMLElement}*/ (e.target);

    const bookEl = /** @type {HTMLElement}*/ (
      target.parentElement.parentElement
    );

    let title = bookEl.children[0].textContent;
    title = title.replace(/['"]+/g, '');

    if (target.className.includes('js-btn-isread')) {
      toggleRead(title);
    }
    if (target.className.includes('js-btn-remove')) {
      deleteBook(title, bookEl);
    }
    updateDisplay();
  });

window.addEventListener('click', (e) => {
  const target = /** @type {HTMLElement} */ (e.target);
  if (target.classList.contains('js-modal')) {
    removeModal();
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
    removeModal();
  }

  if (e.ctrlKey && e.key === 'b') {
    toggleModal(true);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth < 1000) {
    document.querySelector('.js-books-placeholder').classList.remove('space-between');
  }
  if (window.innerWidth > 1000 && library.length > 3) {
    document.querySelector('.js-books-placeholder').classList.add('space-between');
  }
});
