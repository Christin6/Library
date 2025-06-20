"use strict"

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

    this.info = function() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.haveRead}. ID = ${this.id}`;
    }
}

function createAndStore(title, author, pages, haveRead, libraryName) {
    const book = new Book(title, author, pages, haveRead);
    libraryName.push(book);
}

const myLibrary = [];

createAndStore("The Hobbit", "J.R.R. Tolkien", 540, true, myLibrary);
createAndStore("Lord of the Rings", "J.R.R. Tolkien", 540, true, myLibrary);

console.log(myLibrary);
console.log(myLibrary[0].info());


const libraryName = document.querySelector("#library-name");
const bookshelf = document.querySelector("#bookshelf");

libraryName.textContent = "myLibrary";

Book.prototype.displayBook = function() {
    const book = document.createElement("article");
    const title = document.createElement("h2");
    const author = document.createElement("p");
    const pages = document.createElement("p");
    const haveRead = document.createElement("p");
    const id = document.createElement("p");

    title.textContent = this.title;
    author.textContent = this.author;
    pages.textContent = `${this.pages} pages`;
    haveRead.textContent = this.haveRead;
    id.textContent = `ID: ${this.id}`;

    book.classList.add("book-info-card");

    book.append(title, author, pages, haveRead, id);
    bookshelf.appendChild(book);
};

for (let i=0; i<myLibrary.length; i++) {
    myLibrary[i].displayBook();
}