const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Import the sequelize instance

const Book = sequelize.define("Book", {
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	authorId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

module.exports = Book;
