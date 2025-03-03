document.addEventListener("DOMContentLoaded", function () {
    const employeeTableBody = document.getElementById("employeeTableBody");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    // Fetch and display employees
    async function fetchEmployees() {
        try {
            const response = await fetch('http://localhost:3000/employees');
            const employees = await response.json();
            displayEmployees(employees);
            return employees;
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    }

    function displayEmployees(employees) {
        employeeTableBody.innerHTML = "";
        employees.forEach((employee) => {
            employeeTableBody.innerHTML += `
                <tr id="employee-${employee.id}">
                    <td><img src="../assets/${employee.profileImage}.jpg" alt="Profile"></td>
                    <td>${employee.name}</td>
                    <td>${employee.gender}</td>
                    <td>${employee.department.join(", ")}</td>
                    <td>${employee.salary}</td>
                    <td>${employee.startDate}</td>
                    <td>
                        <button class="edit" data-id="${employee.id}">✏️</button>
                        <button class="delete" data-id="${employee.id}">🗑️</button>
                    </td>
                </tr>
            `;
        });
    }

    // Initial load
    fetchEmployees();

    // Delete Employee
    employeeTableBody.addEventListener("click", async function (event) {
        if (event.target.classList.contains("delete")) {
            const id = event.target.getAttribute("data-id");
            if (confirm("Are you sure you want to delete this employee?")) {
                try {
                    await fetch(`http://localhost:3000/employees/${id}`, {
                        method: 'DELETE'
                    });
                    alert("Employee deleted successfully!");
                    fetchEmployees(); // Refresh the list
                } catch (error) {
                    console.error('Error deleting employee:', error);
                    alert("Failed to delete employee");
                }
            }
        }
    });

    // Edit Employee
    employeeTableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit")) {
            const id = event.target.getAttribute("data-id");
            localStorage.setItem("editEmployeeId", id); // Still using localStorage for temporary state
            window.location.href = "empRegister.html";
        }
    });

    // Live Search
    searchInput.addEventListener("input", async function () {
        const searchText = searchInput.value.trim().toLowerCase();
        const employees = await fetchEmployees();
        const filteredEmployees = employees.filter(emp =>
            emp.name.toLowerCase().includes(searchText)
        );
        displayEmployees(filteredEmployees);
    });

    // Search on Button Click (Highlight Found Employee)
    searchButton.addEventListener("click", async function () {
        const searchText = searchInput.value.trim().toLowerCase();
        if (!searchText) {
            alert("Please enter an employee name to search!");
            return;
        }

        try {
            const employees = await fetchEmployees();
            const foundEmployee = employees.find(emp =>
                emp.name.toLowerCase().includes(searchText)
            );

            if (foundEmployee) {
                alert(`Employee "${foundEmployee.name}" is present!`);
                const employeeRow = document.getElementById(`employee-${foundEmployee.id}`);
                if (employeeRow) {
                    employeeRow.style.backgroundColor = "#ffff99"; // Highlight the row
                    employeeRow.scrollIntoView({ behavior: "smooth", block: "center" });

                    // Remove highlight after 3 seconds
                    setTimeout(() => {
                        employeeRow.style.backgroundColor = "";
                    }, 3000);
                }
            } else {
                alert(`Employee "${searchText}" is NOT present!`);
            }
        } catch (error) {
            console.error('Error searching employees:', error);
            alert("Search failed");
        }
    });
});
