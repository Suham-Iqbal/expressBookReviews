const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Customer successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "Customer already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register customer."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let booksByAuthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
        if (books[isbn].author.toLowerCase() === req.params.author.toLowerCase()) {
            booksByAuthor.push({"isbn": isbn, ...books[isbn]});
        }
    });
    if (booksByAuthor.length > 0) {
        return res.status(200).json({"booksbyauthor": booksByAuthor});
    } else {
        return res.status(404).json({message: "Author not found"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksByTitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
        if (books[isbn].title.toLowerCase() === req.params.title.toLowerCase()) {
            booksByTitle.push({"isbn": isbn, ...books[isbn]});
        }
    });
    if (booksByTitle.length > 0) {
        return res.status(200).json({"booksbytitle": booksByTitle});
    } else {
        return res.status(404).json({message: "Title not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Task 10: Get all books using async-await with Axios
public_users.get('/async/books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });
    getBookByISBN
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(404).json({message: err}));
});

// Task 12: Get book details based on Author using Promises
public_users.get('/async/author/:author', function (req, res) {
    const getBooksByAuthor = new Promise((resolve, reject) => {
        let booksByAuthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if (books[isbn].author.toLowerCase() === req.params.author.toLowerCase()) {
                booksByAuthor.push({"isbn": isbn, ...books[isbn]});
            }
        });
        if (booksByAuthor.length > 0) {
            resolve({"booksbyauthor": booksByAuthor});
        } else {
            reject("Author not found");
        }
    });
    getBooksByAuthor
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(404).json({message: err}));
});

// Task 13: Get book details based on Title using Promises
public_users.get('/async/title/:title', function (req, res) {
    const getBooksByTitle = new Promise((resolve, reject) => {
        let booksByTitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if (books[isbn].title.toLowerCase() === req.params.title.toLowerCase()) {
                booksByTitle.push({"isbn": isbn, ...books[isbn]});
            }
        });
        if (booksByTitle.length > 0) {
            resolve({"booksbytitle": booksByTitle});
        } else {
            reject("Title not found");
        }
    });
    getBooksByTitle
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(404).json({message: err}));
});

module.exports.general = public_users;
