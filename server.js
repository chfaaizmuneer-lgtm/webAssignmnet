const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;
const LOG_FILE = path.join(__dirname, 'requests.log');

// ─────────────────────────────────────────────
// MIDDLEWARE 1: Parse URL-encoded form data
// ─────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
// MIDDLEWARE 2: Request Logger
// Logs HTTP method + route to console AND log file
// ─────────────────────────────────────────────
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${req.method} ${req.originalUrl}\n`;

    // Log to console
    console.log(logEntry.trim());

    // Log to file
    fs.appendFile(LOG_FILE, logEntry, (err) => {
        if (err) console.error('Failed to write to log file:', err);
    });

    next();
});

// ─────────────────────────────────────────────
// ROUTE 1: Home Route
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send('Welcome to the Express Server!');
});

// ─────────────────────────────────────────────
// ROUTE 2: About Route
// ─────────────────────────────────────────────
app.get('/about', (req, res) => {
    res.send('This is the About page.');
});

// ─────────────────────────────────────────────
// ROUTE 3: Contact Route
// ─────────────────────────────────────────────
app.get('/contact', (req, res) => {
    res.send('Contact us at faaizmuneer@gmail.com');
});

// ─────────────────────────────────────────────
// ROUTE 4: Dynamic Greeting Route
// Accepts ?name=<value> query parameter
// ─────────────────────────────────────────────
app.get('/greet', (req, res) => {
    const name = req.query.name;
    if (name && name.trim() !== '') {
        res.send(`Hello, ${name.trim()}!`);
    } else {
        res.send('Hello, Stranger!');
    }
});

// ─────────────────────────────────────────────
// ROUTE 5: Serve HTML Form at /form
// ─────────────────────────────────────────────
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// ─────────────────────────────────────────────
// ROUTE 6: POST /submit — Handle Form Submission
// ─────────────────────────────────────────────
app.post('/submit', (req, res) => {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
        return res.status(400).json({
            error: 'Both name and email are required fields.'
        });
    }

    res.send(`Form submitted! Name: ${name}, Email: ${email}`);
});

// ─────────────────────────────────────────────
// ERROR HANDLING MIDDLEWARE
// Must be defined after all routes
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    res.status(500).json({
        error: 'An internal server error occurred.',
        message: err.message
    });
});

// ─────────────────────────────────────────────
// 404 Handler — Unmatched Routes
// ─────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found.',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Express server is running on http://localhost:${PORT}`);
    console.log(`📋 Request logs will be saved to: ${LOG_FILE}`);
});
