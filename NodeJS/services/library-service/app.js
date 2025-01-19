const express = require("express");
const sequelize = require("./config/db");
const Book = require("./models/Book");
const Author = require("./models/Author");

const app = express();
app.use(express.json());

// Sync Database
sequelize
	.sync()
	.then(() => console.log("Library database connected and synced"));

// Routes for Authors
app.get("/authors", async (req, res) => {
	const authors = await Author.findAll();
	res.json(authors);
});

app.post("/authors", async (req, res) => {
	const { name } = req.body;
	try {
		const newAuthor = await Author.create({ name });
		res.status(201).json(newAuthor);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Routes for Books
app.get("/books", async (req, res) => {
	const books = await Book.findAll({ include: Author });
	res.json(books);
});

app.post("/books", async (req, res) => {
	const { title, authorId } = req.body;
	try {
		const newBook = await Book.create({ title, authorId });
		res.status(201).json(newBook);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

app.listen(3003, () => console.log("Library service running on port 3003"));
