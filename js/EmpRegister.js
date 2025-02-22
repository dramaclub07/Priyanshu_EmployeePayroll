document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");
    const errorMsg = document.createElement("p");

    // Error message styling
    errorMsg.style.color = "red";
    errorMsg.style.fontWeight = "bold";
    errorMsg.style.display = "none";
    form.prepend(errorMsg);

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents page reload

        // Capture form values
        let employeeData = {
            name: document.getElementById("name").value.trim(),
            profileImage: document.querySelector("input[name='profile']:checked")?.value || "",
            gender: document.querySelector("input[name='gender']:checked")?.value || "",
            department: Array.from(document.querySelectorAll("input[type='checkbox']:checked"))
                .map(input => input.value),
            salary: document.querySelector("select").value,
            startDate: `${document.querySelector(".date-select select:nth-child(1)").value} / 
                        ${document.querySelector(".date-select select:nth-child(2)").value} / 
                        ${document.querySelector(".date-select select:nth-child(3)").value}`,
            notes: document.querySelector("textarea").value.trim()
        };

        // Validation: Check if all required fields are filled
        if (!employeeData.name || !employeeData.profileImage || !employeeData.gender || 
            employeeData.department.length === 0 || employeeData.salary === "Select Salary" || 
            employeeData.startDate.includes("Day") || employeeData.startDate.includes("Month") || 
            employeeData.startDate.includes("Year")) {

            errorMsg.textContent = "⚠ Please fill out all required fields before submitting.";
            errorMsg.style.display = "block";
            return;
        } else {
            errorMsg.style.display = "none"; 
        }

        // Retrieve existing employees from localStorage
        let employees = JSON.parse(localStorage.getItem("employees")) || [];

        // Check if it's an edit or new entry
        let editIndex = localStorage.getItem("editEmployeeIndex");
        if (editIndex !== null) {
            employees[editIndex] = employeeData; // Update the existing record
            localStorage.removeItem("editEmployeeIndex"); // Remove edit index after update
        } else {
            employees.push(employeeData); // Add new employee
        }

        // Save updated employees list
        localStorage.setItem("employees", JSON.stringify(employees));
        form.reset();

        // Redirect to dashboard.html after successful submission
        alert("Employee added successfully!");
        window.location.href = "http://127.0.0.1:5500/EmployeePayroll/pages/EmpDashboard.html";
    });
});