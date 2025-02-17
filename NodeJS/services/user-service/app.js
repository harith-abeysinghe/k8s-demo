const express = require("express");
const sequelize = require("./config/db");
const User = require("./models/User");
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
	.then(() => console.log("User database connected and synced"))
	.catch((err) => console.error("Error syncing database:", err));

// Routes for Users

// Fetch all users
app.get("/users", async (req, res) => {
	console.log("Fetching users");
	try {
		const users = await User.findAll();
		res.json(users);
	} catch (err) {
		console.error("Error fetching users:", err);
		res.status(500).json({ error: "Error fetching users" });
	}
});

// Fetch user by ID
app.get("/users/:id", async (req, res) => {
	console.log("Fetching user by ID:", req.params.id);
	try {
		const user = await User.findByPk(req.params.id);
		if (!user) return res.status(404).send("User not found");
		res.json(user);
	} catch (err) {
		console.error("Error fetching user:", err);
		res.status(500).json({ error: "Error fetching user" });
	}
});

// Create a new user
app.post("/users", async (req, res) => {
	const { name, email, password } = req.body;
	console.log("Creating user:", name);
	try {
		const newUser = await User.create({ name, email, password });
		res.status(201).json(newUser);
	} catch (error) {
		console.error("Error creating user:", error);
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
		console.error("Error collecting metrics:", err);
		res.status(500).send(`Error collecting metrics: ${err.message}`);
	}
});

app.listen(3001, () => console.log("User service running on port 3001"));
