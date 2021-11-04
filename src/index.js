let library = [];

(function () {
    if (localStorage.getItem('library') === null) {
        library = []
    } else {
        library = JSON.parse(localStorage.getItem('library'))
    }
})()


function Book(title, author, pages, isRead) {
    this.title = title
    this.author = author
    this.pages = pages
    this.isRead = isRead
}

function addToLibrary() {
    const form = document.querySelector('.js-form')
    const title = document.querySelector('input[name="title"]')
    const author = document.querySelector('input[name="author"]')
    const pages = document.querySelector('input[name="pages"]')
    const isRead = document.querySelector('input[name="checkbox"]')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if(isBookExist(title.valie)) return alert('book exist')
        if (title.value === '' || author.value === '' || pages.value === '') return alert('please')
        const book = new Book(title.value, author.value, +pages.value, isRead.checked)
        library.push(book)
        localStorage.setItem('library', JSON.stringify(library))
        document.querySelector('.js-modal').classList.remove('visible')
        clearInput(title, author, pages, isRead)
        updateDisplay()
    })
}

function clearInput(title, author, pages, isRead) {
    title.value = ''
    author.value = ''
    pages.value = ''
    isRead.checked = false
}

function toggleModal() {
    const addBtn = document.querySelector('.js-btn-create')
    const modal = document.querySelector('.js-modal')
    addBtn.addEventListener('click', () => modal.classList.add('visible'))
}


function toggleRead(title) {
    library.forEach(book => book.title === title ? book.isRead = !book.isRead : book)
    localStorage.setItem('library', JSON.stringify(library))
}

function deleteBook(title, bookEl) {
    library.map((book, index) => {
        if (book.title === title) {
            library.splice(index, 1)
            bookEl.remove()
        }
    })
    localStorage.setItem('library', JSON.stringify(library))
}

function displayBook(library) {
    document.querySelector('.js-main').innerHTML = library.map(el => {
        return `
        <div class='book'>
        <span class="book-title">"${el.title}"</span>
        <span class="book-author">${el.author}</span>
        <span class="book-pages">${el.pages} ${el.pages === 1 ? 'Page' : 'Pages'}</span>
        <div class="book-wrapper">
            <a href="#" class="btn btn-small btn-isread ${el.isRead ? 'btn-success' : 'btn-secondary'}">${el.isRead ? 'Read' : 'Not Read'}</a>
            <a href="#" class="btn btn-small btn-danger btn-remove">Remove</a>
        </div>
        </div>`
    }).join(' ')
}


function updateDisplay() {
    const noBook = document.querySelector('.js-no-book')

    library.length === 0 && noBook.classList.add('visible')
    library.length >= 1 && noBook.classList.remove('visible')
    displayBook(library)
}
function isBookExist(title) {
    const book = library.find(book => book.title.replace(/['"]+/g, '') === title)
    return book
}

updateDisplay()
addToLibrary()
toggleModal()

document.querySelector('.js-main').addEventListener('click', (e) => {
    e.preventDefault()
    let bookEl = e.target.parentElement.parentElement
    let title = e.target.parentElement.parentElement.children[0].textContent
    title = title.replace(/['"]+/g, '')

    if (e.target.className.includes('btn-isread')) {
        toggleRead(title)
    }
    if (e.target.className.includes('btn-remove')) {
        deleteBook(title, bookEl)
    }
    updateDisplay()
})


window.addEventListener('click', (e) => {
    if (e.target.className.includes('modal-form')) {
        e.target.classList.remove('visible')
    }
})