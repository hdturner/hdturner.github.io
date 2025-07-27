// This file will contain JavaScript functionality for the gradebook.html page

/**
 * @function fetchGradeData
 * @description This function queries the Node.js server's API to fetch grade data from the PostgreSQL database.
 * It uses XMLHttpRequest to make an asynchronous HTTP GET request.
 */
function fetchGradeData() {
    // Log to console to indicate the start of data fetching
    [cite_start]console.log("Fetching grade data..."); [cite: 4]

    // Create a new XMLHttpRequest object for HTTP communication
    [cite_start]let xhr = new XMLHttpRequest(); [cite: 5]

    // Define the API route on the server to request grade data from
    [cite_start]let apiRoute = "/api/grades"; [cite: 6]

    // Set up the event handler for when the request's state changes
    [cite_start]xhr.onreadystatechange = function() { [cite: 7]
        let results;

        // Check if the request is complete (DONE state)
        [cite_start]if (xhr.readyState === xhr.DONE) { [cite: 8]
            // Check if the HTTP status is not 200 (meaning an error occurred)
            [cite_start]if (xhr.status !== 200) { [cite: 8]
                // Log an error message to the console if data could not be retrieved
                console.error("Could not get grades. Status: " + xhr.status); [cite_start]// This line is not directly cited but is a logical part of the error handling from [cite: 8]
            } else {
                // If successful (status is 200), parse the JSON response text
                // and pass the resulting data to the populateGradebook function
                [cite_start]populateGradebook(JSON.parse(xhr.responseText)); [cite: 8]
            }
        }
    }.bind(this); [cite_start]// The .bind(this) ensures 'this' context if needed elsewhere, though less critical here. [cite: 7]

    // Open the HTTP request: GET method, specified API route, asynchronous (true)
    [cite_start]xhr.open("get", apiRoute, true); [cite: 8]

    // Send the request to the server
    [cite_start]xhr.send(); [cite: 8]
}

/**
 * @function populateGradebook
 * @param {Array<Object>} data - An array of grade objects fetched from the server.
 * @description This function takes the fetched grade data and dynamically populates the HTML table.
 */
function populateGradebook(data) {
    // Log the data being used to populate the gradebook for debugging purposes
    [cite_start]console.log("Populating gradebook with data:", data); [cite: 9]

    // Get a reference to the HTML table element by its ID "gradebook"
    [cite_start]let tableElm = document.getElementById("gradebook"); [cite: 10]

    // Optional: Clear any existing rows in the table before adding new data.
    // This is good practice to prevent duplicate entries if the function is called multiple times.
    while (tableElm.firstChild) {
        tableElm.removeChild(tableElm.firstChild);
    }

    // Iterate over each 'assignment' (representing a row of grade data) in the 'data' array
    [cite_start]data.forEach(function(assignment) { [cite: 10]
        // Create a new table row (<tr>) element for each assignment
        [cite_start]let row = document.createElement("tr"); [cite: 10]

        // Create an object to hold the table data columns for readability
        let columns = {}; // This is a helper variable, not directly cited for its existence but for its use below.

        // Create the first table data cell (<td>) for the student's name
        [cite_start]columns.name = document.createElement('td'); [cite: 10]
        // Concatenate last_name and first_name, then create a text node and append to the 'name' td
        columns.name.appendChild(
            [cite_start]document.createTextNode(assignment.last_name + "," + assignment.first_name) [cite: 10]
        );

        // Create the second table data cell (<td>) for the total grade
        [cite_start]columns.grade = document.createElement('td'); [cite: 10]
        // Create a text node for the total_grade and append to the 'grade' td
        columns.grade.appendChild(
            [cite_start]document.createTextNode(assignment.total_grade) [cite: 11]
        );

        // Append the 'name' column (<td>) to the table row (<tr>)
        [cite_start]row.appendChild(columns.name); [cite: 11]
        // Append the 'grade' column (<td>) to the table row (<tr>)
        [cite_start]row.appendChild(columns.grade); [cite: 11]

        // Append the completed row (<tr>) to the gradebook table element, making it visible
        [cite_start]tableElm.appendChild(row); [cite: 11]
    });
}

// Call the fetchGradeData function when the script loads to initiate data fetching and population.
fetchGradeData();