const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Import the sequelize instance

const Author = sequelize.define("Author", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

// Define the association later in a separate file or after the models are both defined
module.exports = Author;
