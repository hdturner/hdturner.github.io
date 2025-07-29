// This file will contain JavaScript functionality for the gradebook.html page

/**
 * @function fetchGradeData
 * @description This function queries the Node.js server's API to fetch grade data from the PostgreSQL database.
 * It uses XMLHttpRequest to make an asynchronous HTTP GET request.
 */
function fetchGradeData() {
    // Log to console to indicate the start of data fetching
    console.log("Fetching grade data...");

    // Create a new XMLHttpRequest object for HTTP communication
    let xhr = new XMLHttpRequest();

    // Define the API route on the server to request grade data from
    let apiRoute = "/api/grades";

    // Set up the event handler for when the request's state changes
    xhr.onreadystatechange = function() {
        let results;

        // Check if the request is complete (DONE state)
        if (xhr.readyState === xhr.DONE) {
            // Check if the HTTP status is not 200 (meaning an error occurred)
            if (xhr.status !== 200) {
                // Log an error message to the console if data could not be retrieved
                console.error("Could not get grades. Status: " + xhr.status);
            } else {
                // If successful (status is 200), parse the JSON response text
                // and pass the resulting data to the populateGradebook function
                populateGradebook(JSON.parse(xhr.responseText));
            }
        }
    }.bind(this);

    // Open the HTTP request: GET method, specified API route, asynchronous (true)
    xhr.open("get", apiRoute, true);

    // Send the request to the server
    xhr.send();
}

/**
 * @function populateGradebook
 * @param {Array<Object>} data - An array of grade objects fetched from the server.
 * @description This function takes the fetched grade data and dynamically populates the HTML table.
 */
function populateGradebook(data) {
    // Log the data being used to populate the gradebook for debugging purposes
    console.log("Populating gradebook with data:", data);

    // Get a reference to the HTML table element by its ID "gradebook"
    let tableElm = document.getElementById("gradebook");

    // Optional: Clear any existing rows in the table before adding new data.
    // This is good practice to prevent duplicate entries if the function is called multiple times.
    while (tableElm.firstChild) {
        tableElm.removeChild(tableElm.firstChild);
    }

    // Iterate over each 'assignment' (representing a row of grade data) in the 'data' array
    data.forEach(function(assignment) {
        // Create a new table row (<tr>) element for each assignment
        let row = document.createElement("tr");

        // Create an object to hold the table data columns for readability
        let columns = {};

        // Create the first table data cell (<td>) for the student's name
        columns.name = document.createElement('td');
        // Concatenate last_name and first_name, then create a text node and append to the 'name' td
        columns.name.appendChild(
            document.createTextNode(assignment.last_name + "," + assignment.first_name)
        );

        // Create the second table data cell (<td>) for the total grade
        columns.grade = document.createElement('td');
        // Create a text node for the total_grade and append to the 'grade' td
        columns.grade.appendChild(
            document.createTextNode(assignment.total_grade)
        );

        // Append the 'name' column (<td>) to the table row (<tr>)
        row.appendChild(columns.name);
        // Append the 'grade' column (<td>) to the table row (<tr>)
        row.appendChild(columns.grade);

        // Append the completed row (<tr>) to the gradebook table element, making it visible
        tableElm.appendChild(row);
    });
}

// Call the fetchGradeData function when the script loads to initiate data fetching and population.
fetchGradeData();