"use strict";

class Book {
	constructor(title, author, pages, haveRead) {
		this.title = this.validateString(title, "Unknown Title");
        this.author = this.validateString(author, "Unknown Author");
        this.pages = this.validatePages(pages);
        this.haveRead = Boolean(haveRead);
		this.id = crypto.randomUUID();
	}

	validateString(value, defaultValue) {
		if (typeof value === 'string' && value.trim()) {
			return value.trim();
		} else { return defaultValue };
    }

    validatePages(pages) {
        let num = parseInt(pages);
		if (num <= 0) {
			num = 1;
		}
		return num
    }

	info () {
		return `${this.title} by ${this.author}, ${this.pages} pages, ${this.haveRead}. ID = ${this.id}`;
	};

	toggleRead() {
		this.haveRead = !this.haveRead;
	}

	getReadStatus() {
		if (this.haveRead) {
			return "Read";
		} else {
			return "Not Read Yet";
		}
	}
}

class Library {
	constructor(name = "My Library") {
		this.name = name;
		this.books = new Map();
	}

	addBook(book) {
		this.books.set(book.id, book);
	}

	removeBook(id) {
		this.books.delete(id);
	}

	getBook(id) {
		return this.books.get(id);
	}

	getAllBooks() {
		return Array.from(this.books.values());
	}

	getBookCount() {
		return this.books.size;
	}
}

class LibraryUI {
	constructor(library, containerSelector) {
		this.library = library;
		this.containerSelector = document.querySelector(containerSelector);
		this.initializeElements();
		this.setupEventListeners();
		this.render();
	}

	initializeElements() {
		this.elements = {
            libraryName: document.querySelector("#library-name"),
            bookshelf: document.querySelector("#bookshelf"),
            newBookButton: document.querySelector("#new-book-button"),
            newBookForm: document.querySelector("#new-book-form"),
            closeForm: document.querySelector("#close-form"),
            confirmNewBook: document.querySelector("#confirm-new-book"),
            titleInput: document.querySelector("#title-input"),
            authorInput: document.querySelector("#author-input"),
            pagesInput: document.querySelector("#pages-input"),
            haveReadInput: document.querySelector("#have-read")
        };

		this.elements.libraryName.textContent = this.library.name;
	}

	render() {
		this.library.getAllBooks().forEach(book => {
			this.displayBook(book);
		});
	}

	displayBook(book) {
		const bookCard = document.createElement("article");
		bookCard.classList.add('book-info-card');

		bookCard.innerHTML = `
			<h2>${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Pages:</strong> ${book.pages}</p>
            <p class="read-status"><strong>Status:</strong> ${book.getReadStatus()}</p>
            <p class="book-id">ID: ${book.id}</p>
            <div class="book-actions">
                <button class="small-button toggle-read-btn">Toggle Read Status</button>
                <button class="small-button delete-btn">Delete Book</button>
            </div>
		`;

		const del = bookCard.querySelector('.delete-btn');
		const changeRead = bookCard.querySelector('.toggle-read-btn');
		const haveRead = bookCard.querySelector('.read-status');

		del.addEventListener("click", () => {
			this.library.removeBook(book.id);
			bookCard.remove();
		});

		changeRead.addEventListener("click", () => {
			book.toggleRead();
			haveRead.innerHTML = `<strong>Status:</strong> ${book.getReadStatus()}`;
		});

		this.elements.bookshelf.appendChild(bookCard);
	}

	resetForm() {
		this.elements.titleInput.value = "";
		this.elements.authorInput.value = "";
		this.elements.pagesInput.value = 0;
		this.elements.haveReadInput.checked = false;
	}

	setupEventListeners() {
		this.elements.newBookButton.addEventListener("click", () => {
			this.elements.newBookForm.showModal();
		});

		this.elements.closeForm.addEventListener("click", () => {
			this.elements.newBookForm.close();
			this.resetForm();
		});

		this.elements.confirmNewBook.addEventListener("click", () => {
			const book = new Book(
					this.elements.titleInput.value,
					this.elements.authorInput.value,
					this.elements.pagesInput.value,
					this.elements.haveReadInput.checked,
				);
			this.library.addBook(book);
			this.displayBook(book);
			this.elements.newBookForm.close();
			this.resetForm();
		});
	}
}

const myLibrary = new Library();

myLibrary.addBook(new Book("The Hobbit", "J.R.R. Tolkien", 540, true));
myLibrary.addBook(new Book("Lord of the Rings", "J.R.R. Tolkien", 540, true));

console.log(myLibrary.getAllBooks());

const libraryUI = new LibraryUI(myLibrary, "#bookshelf");
