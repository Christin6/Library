"use strict";

function Book(title, author, pages, haveRead) {
	if (!new.target) {
		throw Error("You must use the 'new' operator to call the constructor");
	}
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.id = crypto.randomUUID();
	if (haveRead) {
		this.haveRead = "already read";
	} else {
		this.haveRead = "not read yet";
	}

	this.info = function () {
		return `${this.title} by ${this.author}, ${this.pages} pages, ${this.haveRead}. ID = ${this.id}`;
	};
}

Book.prototype.toggleRead = function() {
    if (this.haveRead === "already read") {
        this.haveRead = "not read yet";
    } else if (this.haveRead === "not read yet") {
        this.haveRead = "already read";
    }
};

function createAndStore(title, author, pages, haveRead, libraryName) {
	const book = new Book(title, author, pages, haveRead);
	libraryName.push(book);
}

const myLibrary = [];

createAndStore("The Hobbit", "J.R.R. Tolkien", 540, true, myLibrary);
createAndStore("Lord of the Rings", "J.R.R. Tolkien", 540, true, myLibrary);

console.log(myLibrary);
console.log(myLibrary[0].info());

/* DOM */
const libraryName = document.querySelector("#library-name");
const bookshelf = document.querySelector("#bookshelf");
const newBookButton = document.querySelector("#new-book-button");
const newBookForm = document.querySelector("#new-book-form");
const closeForm = document.querySelector("#close-form");
const confirmNewBook = document.querySelector("#confirm-new-book");
const titleInput = document.querySelector("#title-input");
const authorInput = document.querySelector("#author-input");
const pagesInput = document.querySelector("#pages-input");
const haveRead = document.querySelector("#have-read");

libraryName.textContent = "myLibrary";
let bookOnDisplay = 0;

Book.prototype.displayBook = function () {
	const book = document.createElement("article");
	const title = document.createElement("h2");
	const author = document.createElement("p");
	const pages = document.createElement("p");
	const haveRead = document.createElement("p");
	const id = document.createElement("p");
	const del = document.createElement("button");
    const changeRead = document.createElement("button");

	title.textContent = this.title;
	author.textContent = this.author;
	pages.textContent = `${this.pages} pages`;
	haveRead.textContent = this.haveRead;
    changeRead.textContent = "change read status";
	id.textContent = `ID: ${this.id}`;
	del.dataset.parent = this.id;
	del.textContent = "Delete Book";

	id.classList.add("book-id");
	book.classList.add("book-info-card");
	del.classList.add("small-button");
	changeRead.classList.add("small-button");

	del.addEventListener("click", () => {
		for (let i of myLibrary) {
            if (i.id === del.dataset.parent) {
                myLibrary.splice(myLibrary.indexOf(i), 1);
                book.remove();
                bookOnDisplay--;
                break;
            }
        }
	});

    changeRead.addEventListener("click", () => { // to fix: this only can work once
		for (let i of myLibrary) {
            if (i.id === del.dataset.parent) {
                this.toggleRead();
                haveRead.textContent = this.haveRead;
                console.log(this.haveRead);
                break;
            }
        }
	});

	book.append(title, author, pages, haveRead, id, changeRead, del);
	bookshelf.appendChild(book);
	bookOnDisplay++;
};

for (let i = 0; i < myLibrary.length; i++) {
	myLibrary[i].displayBook();
}

function resetForm() {
	titleInput.value = "";
	authorInput.value = "";
	pagesInput.value = 0;
	haveRead.checked = false;
}

newBookButton.addEventListener("click", () => {
	newBookForm.showModal();
});

closeForm.addEventListener("click", () => {
	newBookForm.close();
	resetForm();
});

confirmNewBook.addEventListener("click", () => {
	if (titleInput.value === "") {
		titleInput.value = "Title";
	}
	if (authorInput.value === "") {
		authorInput.value = "Author";
	}
	if (pagesInput.value === "") {
		pagesInput.value = 0;
	}

	createAndStore(
		titleInput.value,
		authorInput.value,
		pagesInput.value,
		haveRead.checked,
		myLibrary
	);
	myLibrary[bookOnDisplay].displayBook();
	newBookForm.close();
	resetForm();
});
