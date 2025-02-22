document.addEventListener("DOMContentLoaded", function () {
    const employeeTableBody = document.getElementById("employeeTableBody");
    let employees = JSON.parse(localStorage.getItem("employees")) || [];

    function displayEmployees(filteredEmployees = employees) {
        employeeTableBody.innerHTML = "";
        filteredEmployees.forEach((employee, index) => {
            employeeTableBody.innerHTML += `
                <tr id="employee-${index}">
                    <td><img src="../assets/${employee.profileImage}.jpg" alt="Profile"></td>
                    <td>${employee.name}</td>
                    <td>${employee.gender}</td>
                    <td>${employee.department.join(", ")}</td>
                    <td>${employee.salary}</td>
                    <td>${employee.startDate}</td>
                    <td>
                        <button class="edit" data-index="${index}">✏️</button>
                        <button class="delete" data-index="${index}">🗑️</button>
                    </td>
                </tr>
            `;
        });
    }

    displayEmployees();

    // ✅ Delete Employee with Confirmation
    employeeTableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete")) {
            let index = event.target.getAttribute("data-index");

            let confirmDelete = confirm("Are you sure you want to delete this employee?");
            if (confirmDelete) {
                employees.splice(index, 1);
                localStorage.setItem("employees", JSON.stringify(employees));
                displayEmployees();
                alert("Employee deleted successfully!");
            }
        }
    });

    // ✅ Edit Employee
    employeeTableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit")) {
            let index = event.target.getAttribute("data-index");
            localStorage.setItem("editEmployeeIndex", index);
            window.location.href = "empRegister.html";
        }
    });

    // ✅ Search on Button Click
    document.getElementById("searchButton").addEventListener("click", function () {
        let searchText = document.getElementById("searchInput").value.trim().toLowerCase();

        if (searchText === "") {
            alert("Please enter an employee name to search!");
            return;
        }

        let foundEmployee = employees.find((emp) => emp.name.toLowerCase() === searchText);

        if (foundEmployee) {
            let index = employees.indexOf(foundEmployee);
            alert(`Employee "${foundEmployee.name}" is present!`);

            // Scroll to employee row smoothly
            let employeeRow = document.getElementById(`employee-${index}`);
            if (employeeRow) {
                employeeRow.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        } else {
            alert(`Employee "${searchText}" is NOT present!`);
        }
    });
});