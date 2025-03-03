document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");
    const errorMsg = document.createElement("p");

    // Error message styling
    errorMsg.style.color = "red";
    errorMsg.style.fontWeight = "bold";
    errorMsg.style.display = "none";
    form.prepend(errorMsg);

    // Check if we're editing an existing employee
    const editId = localStorage.getItem("editEmployeeId");
    if (editId) {
        fetch(`http://localhost:3000/employees/${editId}`)
            .then(response => response.json())
            .then(employee => {
                // Pre-fill form with existing data
                // document.getElementById("name").value = employee.name;
                // document.querySelector(`input[name='profile'][value='${employee.profileImage}']`).checked = true;
                // document.querySelector(`input[name='gender'][value='${employee.gender}']`).checked = true;
                // employee.department.forEach(dept => {
                //     document.querySelector(`input[value='${dept}']`).checked = true;
                // });
                // document.querySelector("select").value = employee.salary;
                // const [day, month, year] = employee.startDate.split(" / ");
                // document.querySelector(".date-select select:nth-child(1)").value = day;
                // document.querySelector(".date-select select:nth-child(2)").value = month;
                // document.querySelector(".date-select select:nth-child(3)").value = year;
                // document.querySelector("textarea").value = employee.notes || "";

                 document.getElementById("name").value = employee.name;
                document.querySelector(`input[name='profile'][value='${employee.profileImage}']`).checked = true;
                document.querySelector(`input[name='gender'][value='${employee.gender}']`).checked = true;
                
                employee.department.forEach(dept => {
                    const checkbox = document.querySelector(`input[value='${dept}']`);
                    if (checkbox) checkbox.checked = true;
                });

                document.querySelector("select").value = employee.salary;

                // Extract and clean up startDate values
                const [day, month, year] = employee.startDate
                    .split("/")
                    .map(part => part.trim()); // Remove unwanted spaces and newlines

                if (day) document.querySelector(".date-select select:nth-child(1)").value = day;
                if (month) document.querySelector(".date-select select:nth-child(2)").value = month;
                if (year) document.querySelector(".date-select select:nth-child(3)").value = year;

                document.querySelector("textarea").value = employee.notes || "";
            })
            .catch(error => console.error('Error loading employee data:', error));
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

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

        // Validation
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

        try {
            if (editId) {
                // Update existing employee
                const response = await fetch(`http://localhost:3000/employees/${editId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(employeeData)
                });
                if (!response.ok) throw new Error('Failed to update employee');
                localStorage.removeItem("editEmployeeId");
                window.location.href = "empDashboard.html";
                alert("Employee updated successfully!");
            } else {
                // Create new employee
                const response = await fetch('http://localhost:3000/employees', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(employeeData)
                });
                if (!response.ok) throw new Error('Failed to add employee');
                 window.location.href = "empDashboard.html";
                alert("Employee added successfully!");
            }

            // Reset the form and redirect to dashboard
            form.reset();
            //window.location.href = "../pages/empDashboard.html"; // Redirect after success

        } catch (error) {
            console.error('Error saving employee:', error);
            alert("Failed to save employee data");
            errorMsg.textContent = "⚠ An error occurred while saving. Please try again.";
            errorMsg.style.display = "block";
        }
        // window.location.href = "empDashboard.html";
    });
     
});