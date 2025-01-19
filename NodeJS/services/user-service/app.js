const express = require("express");
const sequelize = require("./config/db");
const User = require("./models/User");

const app = express();
app.use(express.json());

// Sync Database
sequelize.sync().then(() => console.log("Database connected and synced"));

// Routes
app.get("/users", async (req, res) => {
	const users = await User.findAll();
	res.json(users);
});

app.get("/users/:id", async (req, res) => {
	const user = await User.findByPk(req.params.id);
	if (!user) return res.status(404).send("User not found");
	res.json(user);
});

app.post("/users", async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const newUser = await User.create({ name, email, password });
		res.status(201).json(newUser);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

app.listen(3001, () => console.log("User service running on port 3001"));
