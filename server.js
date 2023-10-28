const express = require('express');
const morgan = require('morgan');
const PORT = 5000;

const app = express();

// Add morgan middleware to log incoming requests
app.use(morgan('dev'));

// Tell express that we are using EJS for views (HTML responses that we would send to the front-end)
app.set('view engine', 'ejs');

// Middleware to parse form data into JS object req.body
app.use(express.urlencoded({extended: true}));

// helper function to get next id (last id + 1)
const nextId = () => {
  const keys = Object.keys(allBooks);
  return Number(keys[keys.length-1]) + 1;
};

// Mock data
const allBooks = {
  3: {
    id: 3,
    author: 'Jane Austen',
    title: 'Pride and Prejudice',
    year: 1813
  },
  4: {
    id: 4,
    author: 'Victor Hugo',
    title: 'The Hunchback of Notre-Dame',
    year: 1831
  }
};

app.get('/', (req, res) => {
  res.redirect('/books');
});

// GET /books - list all books and return index page
app.get('/books', (req, res) => {
  const templateVars = { myBooks: allBooks };
  res.render('book_list', templateVars);
});

// GET /books/:id - show a book
// :id - tells Express that `id` is request parameter that it should capture
app.get('/books/:id', (req, res) => {
  if (!allBooks[req.params.id]) {
    res.status(404);
    res.send("No book with that ID found");
    return;
  }

  const templateVars = {
    id: req.params.id,
    book: allBooks[req.params.id],
  }

  res.render('book_show', templateVars);
})

// POST /books - create a book
app.post('/books', (req, res) => {
  console.log(req.body);

  const newId = nextId();
  const newBook = {
    id: newId,
    author: req.body.author,
    title: req.body.title,
    year: req.body.year
  }

  // save it in allBooks
  allBooks[newId] = newBook;

  res.redirect('/books');
})

// POST /books/:id/delete - delete a book
app.post('/books/:id/delete', (req, res) => {
  delete allBooks[req.params.id];
  res.redirect('/books');
})


app.listen(PORT, console.log(`This app runs on port ${PORT}`));
