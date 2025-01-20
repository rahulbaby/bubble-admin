const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON body requests
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Database setup
const dbFile = './expiry.db';
const db = new sqlite3.Database(dbFile);

// Create schema (table if it doesn't already exist)
const createSchema = () => {
    return new Promise((resolve, reject) => {
        db.run("CREATE TABLE IF NOT EXISTS expiry_dates (id INTEGER PRIMARY KEY AUTOINCREMENT, expiry_date TEXT);", (err) => {
            if (err) {
                reject("Error creating schema: " + err.message);
            } else {
                resolve("Schema created successfully.");
            }
        });
    });
};

// Route to save expiry date to the database
app.post('/save-expiry', (req, res) => {
    const { expiryDate } = req.body;
    if (!expiryDate) {
        return res.status(400).send("Expiry Date is required");
    }

    const stmt = db.prepare("INSERT INTO expiry_dates (expiry_date) VALUES (?)");
    stmt.run([expiryDate], (err) => {
        if (err) {
            return res.status(500).send("Error saving expiry date: " + err.message);
        }

        res.status(200).send("Expiry Date saved successfully!");
    });
    stmt.finalize();
});

// Initialize the database schema on app startup
createSchema()
    .then((msg) => {
        console.log(msg);  // Log successful schema creation
    })
    .catch((err) => {
        console.error(err);  // Log any errors in schema creation
    });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
