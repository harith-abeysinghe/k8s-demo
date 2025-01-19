const express = require("express");
const sequelize = require("./config/db");
const Order = require("./models/Order");

const app = express();
app.use(express.json());

// Sync Database
sequelize.sync().then(() => console.log("Database connected and synced"));

// Routes
app.get("/orders", async (req, res) => {
	const orders = await Order.findAll();
	res.json(orders);
});

app.get("/orders/:id", async (req, res) => {
	const order = await Order.findByPk(req.params.id);
	if (!order) return res.status(404).send("Order not found");
	res.json(order);
});

app.post("/orders", async (req, res) => {
	const { userId, product, quantity, price } = req.body;
	try {
		const newOrder = await Order.create({ userId, product, quantity, price });
		res.status(201).json(newOrder);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

app.listen(3002, () => console.log("Order service running on port 3002"));
