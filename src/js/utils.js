/**
 *
 * @param {string} title
 * @param {Book[]} library
 * @returns {Book}
 */
function isBookExist(title, library) {
  const book = library.find(
    (book) => book.title.replace(/['"]+/g, '') === title
  );
  return book;
}

/**
 *
 * @param {HTMLInputElement[]} inputs
 * @returns {boolean}  boolean to determine wether input is valid or not
 */
function validateInput(inputs) {
  /**
   * @type {boolean}
   */
  let valid;

  inputs.forEach((input) => {
    const errorMsg = input.nextElementSibling;

    if (input.value === '') {
      errorMsg.textContent = `${input.name} is required`;
      input.classList.add('error');
      valid = false;
    } else {
      errorMsg.textContent = '';
      input.classList.remove('error');
      valid = true;
    }
  });

  return valid;
}

function clearInput(inputFields, isRead) {
  inputFields.forEach((input) => {
    input.value = '';
    input.classList.remove('error');
    input.nextElementSibling.textContent = '';
  });
  isRead.checked = false;
}

export { validateInput, clearInput, isBookExist };
