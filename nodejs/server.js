const express = require("express");
const sql = require("mssql");

const app = express();
app.use(express.json());

// SQL Server configuration
var config = {
    "user": "SA", // Database username
    "password": "MyStrongPass123", // Database password
    "server": "localhost", // Server IP address. Localhost worked here
    "database": "master", // Database name. Looks like this one is master which holds the tables
    "options": {
        "encrypt": false // Disable encryption
    }
}

// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});

// Define route for fetching data from SQL Server
app.get("/", (request, response) => {
    // Execute a SELECT query
    new sql.Request().query("SELECT * FROM employees", (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
        } else {
            response.send(result.recordset); // Send query result as response
            console.dir(result.recordset);
        }
    });
});

app.post("/employee", async (req, res) => {
    const request = new sql.Request();
    const {username, email} = req.body;

    const query = `INSERT INTO employees (username, email) VALUES (@username, @email)`
    request.input('username', sql.NVarChar, username);
    request.input('email', sql.NVarChar, email);

    const result = await request.query(query);
    // res.status(201).json({ message: 'Data inserted successfully' });
    res.status(201).json({ message: 'Data inserted successfully', result });
});

app.put("/employee/:username", async(req, res) => {
    const username = req.params['username'];
    console.log(username);

    // Set up the request and get the new email from the body
    const request = new sql.Request();
    const { email } = req.body;

    console.log(email);

    const query = `UPDATE employees SET 
                   email = @email 
                   WHERE username = @username`;

    request.input('username', sql.NVarChar, username);
    request.input('email', sql.NVarChar, email);

    const result = await request.query(query);


    res.status(200).json({message: 'Call was successful', result});
})

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Listening on port 3000...");
});