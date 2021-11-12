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
    const isRead = document.querySelector('input[name="checkbox"]')
    const input = [...document.querySelectorAll('.js-input')]

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        input.forEach(el => {
            const errorMsg = el.nextElementSibling
            if (el.value === '') {
                errorMsg.textContent = `${el.name} is required`
                el.classList.add('error')
            } 
        })
        if(isBookExist(input[0].value)) return alert('book existed!')
        if (input[0].value === '' || input[1].value === '' || input[2].value === '') return
        
        const book = new Book(input[0].value, input[1].value, +input[2].value, isRead.checked)
        library.push(book)
        localStorage.setItem('library', JSON.stringify(library))
        removeModal()
        clearInput(input, isRead)
        updateDisplay()
    })

    input.forEach(el => el.addEventListener('input', () => {
        if(el.value !== '') {
            el.classList.remove('error')
            el.nextElementSibling.textContent = ''
        }
    }))
}

function clearInput(inputFields, isRead) {
    inputFields.forEach(input => {
        input.value = ''
        input.classList.remove('error')
        input.nextElementSibling.textContent = ''
    })
    isRead.checked = false
}

function toggleModal() {
    const addBtn = document.querySelector('.js-btn-create')
    const modal = document.querySelector('.js-modal')
    const cross = document.querySelector('.cross')
    addBtn.addEventListener('click', () => {
        cross.classList.add('is-clicked')
        modal.classList.add('visible')

    })
    addToLibrary()
}


function toggleRead(title) {
    library.forEach(book => book.title === title ? book.isRead = !book.isRead : book)
    localStorage.setItem('library', JSON.stringify(library))
}

function removeModal() {
    document.querySelector('.js-modal').classList.remove('visible')
    document.querySelector('.cross').classList.remove('is-clicked')
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
    const main = document.querySelector('.js-main')
    main.innerHTML = library.map(el => {
        return `
        <div class='book'>
        <span class="book-title">"${el.title}"</span>
        <span class="book-author">${el.author}</span>
        <span class="book-pages">${el.pages.toLocaleString('en')} ${el.pages === 1 ? 'Page' : 'Pages'}</span>
        <div class="book-wrapper">
            <a href="#" class="btn btn-small btn-isread ${el.isRead ? 'btn-success' : 'btn-secondary'}">${el.isRead ? 'Read' : 'Not Read'}</a>
            <a href="#" class="btn btn-small btn-danger btn-remove">Remove</a>
        </div>
        </div>`
    }).join(' ')
    library.length > 3 && window.innerWidth > 600 ? main.classList.add('space-between') : main.classList.remove('space-between')
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


function searchBook() {
    const searchTerm = document.querySelector('input[name="search"]')
    const noBookFound = document.querySelector('.js-book-is-not-found')
    searchTerm.addEventListener('input', () => {
        if (library.length === 0) return

        const filteredBook = library.filter(book => book.title.includes(searchTerm.value) || book.title.toLowerCase().includes(searchTerm.value))
        if (filteredBook.length === 0) {
            noBookFound.classList.add('visible')
            displayBook([])
        } else {
            noBookFound.classList.remove('visible')
            displayBook(filteredBook)
        }
    })
}

updateDisplay()
toggleModal()
searchBook()

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
    if (e.target.classList.contains('modal-form')) {
        removeModal()
    }
})

window.addEventListener('resize', () => {
    if (window.innerWidth < 1000) {
        document.querySelector('.js-main').classList.remove('space-between')
    }
    if (window.innerWidth > 1000 && library.length > 3) {
        document.querySelector('.js-main').classList.add('space-between')
    }
})