const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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
