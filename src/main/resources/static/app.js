// const base_url = 'http://localhost'
const base_url = 'http://ec2-107-21-58-133.compute-1.amazonaws.com'

async function fetchAndPopulateTodoList() {


    try {
        // Fetch to-do items for the logged-in user
        const response = await fetch(`${base_url}:8080/todo?username=${localStorage.getItem("username")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
            
        });

        if (response.ok) {
            const todoItems = await response.json();
            populateTodoList(todoItems);
        } else {
            console.error("Error fetching to-do items:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to populate to-do list
function populateTodoList(todoItems) {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML=""

    todoItems.forEach(item => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "card");
        listItem.innerHTML = `
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="checkbox-${item.id}" onchange="handleCheckboxChange(this)">
                <label class="custom-control-label" for="checkbox-${item.id}" id="label-${item.id}">${item.description}</label>
                <span style="cursor: pointer; float: right; color: red;" onclick="deleteTodo(${item.id})"><i class="fas fa-trash"></i></span>
            </div>
        `;

        if (item.complete) {
            listItem.querySelector('input').checked = true;
            listItem.classList.add("checked");
            listItem.querySelector('label').innerText = "Completed: " + item.description;
        }

        todoList.appendChild(listItem);
    });
}

// Function to handle checkbox state change
async function handleCheckboxChange(checkbox) {
    const taskId = checkbox.id.split('-')[1];

    try {
        // Send fetch request to update task completion status
        const response = await fetch(`${base_url}:8080/todo/${taskId}?username=${localStorage.getItem("username")}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ complete: checkbox.checked })
        });

        if (!response.ok) {
            console.error("Error updating task completion status:", response.statusText);
            
        } else{
            fetchAndPopulateTodoList();
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function deleteTodo(taskId) {
    try {
        // Send fetch request to delete a to-do
        const response = await fetch(`${base_url}:8080/todo/${taskId}?username=${localStorage.getItem("username")}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            // Fetch/populate the updated to-do list after deletion
            fetchAndPopulateTodoList();
        } else {
            console.error("Error deleting to-do:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}



// Show to-do page and fetch/populate the list when the user is logged in
function showTodoPage() {
    if (localStorage.getItem("username")){
        document.getElementById("todo-page").style.display = "block";
        document.getElementById("newTodoForm").style.display = "block";
        fetchAndPopulateTodoList();
    } else{
        console.log("false")
        console.log(document.cookie);
        console.log(localStorage.getItem("username"))

    }
    
}

// Example: Show to-do page after a successful login (replace with your actual authentication logic)
// Assume this function is called after successful login
// showTodoPage();

// Function to handle login attempt
async function attemptLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check if username and password are not empty
    if (username.trim() === "" || password.trim() === "") {
        alert("Username and password are required");
        return;
    }

    // Prepare data for the fetch request
    const data = {
        username: username,
        password: password
    };

    try {
        // Send fetch request to http://localhost:8080/user/login
        const response = await fetch(`${base_url}:8080/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Check if the request was successful (status code 2xx)
        if (response.ok) {
            const responseData = await response.json();
            // Handle the response from the server (e.g., redirect, update UI)
            console.log(responseData);
            // You can add logic here to redirect the user or perform other actions based on the response
            localStorage.setItem("username", responseData.username)
            location.reload()
        } else if (response.status === 400) {
            // Display error message for 400 status (Bad Request)
            document.getElementById("errorMessage").style.display = "block";
        } else {
            // Handle other error responses (non-2xx status code)
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function attemptRegistration() {
    const newUsername = document.getElementById("registerUsername").value;
    const newPassword = document.getElementById("registerPassword").value;

    // Check if username and password are not empty
    if (newUsername.trim() === "" || newPassword.trim() === "") {
        alert("Username and password are required");
        return;
    }

    // Prepare data for the fetch request
    const data = {
        username: newUsername,
        password: newPassword
    };

    try {
        // Send fetch request to http://localhost:8080/user/register
        const response = await fetch(`${base_url}:8080/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Check if the request was successful (status code 2xx)
        if (response.ok) {
            // Handle the response from the server (e.g., redirect, update UI)
            console.log("Registration successful");
            // You can add logic here to redirect the user or perform other actions based on the response
            localStorage.setItem("username", responseData.username)
            location.reload()
        } else if (response.status === 400) {
            // Display error message for 400 status (Bad Request)
            document.getElementById("registrationErrorMessage").style.display = "block";
        } else {
            // Handle other error responses (non-2xx status code)
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function addNewTodo() {
    const description = document.getElementById("newTodoDescription").value;

    // Check if the description is not empty
    if (description.trim() === "") {
        alert("To-Do description cannot be empty");
        return;
    }

    try {
        // Send fetch request to add a new to-do
        const response = await fetch(`${base_url}:8080/todo?username=${localStorage.getItem("username")}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ description: description, complete: false })
        });

        if (response.ok) {
            // Clear the input field and fetch/populate the updated to-do list
            document.getElementById("newTodoDescription").value = "";
            fetchAndPopulateTodoList();
        } else {
            console.error("Error adding new to-do:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}


// Function to check if a user is logged in and update the UI
function checkLoginStatus() {
    const username = localStorage.getItem("username");

    if (username) {
        // User is logged in
        document.getElementById("loginMessage").hidden=true
        document.getElementById("loginButton").hidden=true
        document.getElementById("registerButton").hidden=true
        document.getElementById("logoutMessage").hidden=false
        document.getElementById("logoutButton").hidden=false
    } else {
        // User is not logged in
        document.getElementById("loginMessage").hidden=false
        document.getElementById("loginButton").hidden=false
        document.getElementById("registerButton").hidden=false
        document.getElementById("logoutMessage").hidden=true
        document.getElementById("logoutButton").hidden=true
    }
}

// Function to handle logout
function logout() {
    // Clear the username from local storage
    localStorage.removeItem("username")

    // Reload the page
    location.reload();
}

// Example: Call checkLoginStatus after the page loads to initialize the UI
function loadUp(){
    checkLoginStatus();
    showTodoPage();
}





