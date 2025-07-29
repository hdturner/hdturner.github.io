// This section loads modules. It loads the Express server and stores
// it in "express", then creates a application, a router, and a path handler
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

// This part sets up the database
const {Pool} = require('pg');
// You may need to modify the password or database name in the following line:
const connectionString = `postgres://postgres:CTI_110_WakeTech@localhost/Gradebook`;
// The default password is CTI_110_WakeTech
// The default database name is Gradebook
const pool = new Pool({connectionString:connectionString}); // Added semicolon for consistency

// This line says when it's looking for a file linked locally,
// check in sub-folder "public"
app.use(express.static(path.join(__dirname, 'public')));

// This creates a new anonymous function that runs whenever
// someone calls "get" on the server root "/"
router.get('/', function(req, res){
    // It just returns a file to their browser
    // from the same directory it's in, called davidturner_gradebook.html
    res.sendFile(path.join(__dirname, 'public', 'davidturner_gradebook.html'));
});

app.use("/", router);

router.get('/api/grades', function(req, res){
    pool.query(
        // **CRITICAL UPDATE: Using lowercase table and column names for PostgreSQL compatibility**
        // You MUST ensure these match the exact casing in your PostgreSQL database schema.
        // If your tables/columns were created with mixed case or quotes, you need to use those exact names.
        `SELECT students.student_id, first_name, last_name, AVG(assignments.grade) as total_grade
            FROM students
            LEFT JOIN assignments ON assignments.student_id = students.student_id
            GROUP BY students.student_id
            ORDER BY total_grade DESC`,
        [], // Empty array for query parameters
        function(err, result){
            if(err) {
                console.error("Database query error:", err); // Log the detailed error on the server side
                // Send a 500 status code and an error message to the client
                res.status(500).json({ error: "Failed to retrieve grades from the database." });
            } else {
                // If the query was successful, iterate and log rows (for server-side debugging)
                result.rows.forEach(
                    function(row){
                        console.log(`Student Name: ${row.first_name} ${row.last_name}`);
                        console.log(`Grade: ${row.total_grade}`);
                    }
                ); // End of forEach

                // Send the successful 200 status code and the rows data as JSON to the client
                res.status(200).json(result.rows);
            }
        }
    );
});

let server = app.listen(3000, function(){
    console.log("App Server via Express is listening on port 3000");
    console.log("To quit, press CTRL + C");
});