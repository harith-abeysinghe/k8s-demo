const express = require("express");
const sequelize = require("./config/db");
const Order = require("./models/Order");
const client = require("prom-client"); // Import prom-client for Prometheus metrics
const os = require("os"); // For memory and CPU info

const app = express();
app.use(express.json());

// Create a registry and enable default metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); // This will expose default metrics like CPU usage, memory usage, etc.

// Define custom metrics for the app's CPU and memory usage
const cpuUsageGauge = new client.Gauge({
	name: "app_cpu_usage_percent",
	help: "CPU usage percentage of the application",
});

const memoryUsageGauge = new client.Gauge({
	name: "app_memory_usage_bytes",
	help: "Memory usage of the application in bytes",
});

// Function to update custom metrics (CPU and memory usage)
const updateMetrics = () => {
	setInterval(() => {
		try {
			// CPU usage: Use os.loadavg() to get the average CPU load for the past 1 minute
			const cpuUsage = os.loadavg()[0]; // 1-minute average load
			// Memory usage: Total memory - free memory
			const memoryUsage = os.totalmem() - os.freemem();

			// Update the gauges
			cpuUsageGauge.set(cpuUsage * 100); // Convert to percentage
			memoryUsageGauge.set(memoryUsage);

			console.log(
				`Updated metrics - CPU: ${
					cpuUsage * 100
				}% | Memory: ${memoryUsage} bytes`
			);
		} catch (err) {
			console.error("Error updating metrics:", err);
		}
	}, 5000); // Update every 5 seconds
};

// Start updating metrics
updateMetrics();

// Sync Database
sequelize
	.sync()
	.then(() => console.log("Order database connected and synced"))
	.catch((err) => console.error("Error syncing database:", err));

// Routes

// Fetch all orders
app.get("/orders", async (req, res) => {
	try {
		const orders = await Order.findAll();
		res.json(orders);
	} catch (err) {
		res.status(500).json({ error: "Error fetching orders" });
	}
});

// Fetch order by ID
app.get("/orders/:id", async (req, res) => {
	try {
		const order = await Order.findByPk(req.params.id);
		if (!order) {
			return res.status(404).send("Order not found");
		}
		res.json(order);
	} catch (err) {
		res.status(500).json({ error: "Error fetching order" });
	}
});

// Create a new order
app.post("/orders", async (req, res) => {
	const { userId, product, quantity, price } = req.body;
	try {
		const newOrder = await Order.create({ userId, product, quantity, price });
		res.status(201).json(newOrder);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Define the /metrics endpoint to expose the Prometheus metrics
app.get("/metrics", async (req, res) => {
	try {
		const metrics = await client.register.metrics(); // Await metrics to handle any async operations
		res.set("Content-Type", client.register.contentType); // Set the content type for Prometheus
		res.send(metrics); // Return the metrics
	} catch (err) {
		res.status(500).send(`Error collecting metrics: ${err.message}`);
	}
});

app.listen(3002, () => console.log("Order service running on port 3002"));
