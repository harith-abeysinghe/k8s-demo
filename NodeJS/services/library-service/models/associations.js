const Author = require("./Author");
const Book = require("./Book");

// Define associations after both models are loaded
Author.hasMany(Book, { foreignKey: "authorId" });
Book.belongsTo(Author, { foreignKey: "authorId" });

module.exports = { Author, Book };
