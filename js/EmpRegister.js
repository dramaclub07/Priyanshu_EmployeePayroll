document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('employeeForm');
    const nameInput = document.getElementById('name');
    const genderInputs = document.querySelectorAll('input[name="profile-gender"]');
    const profileImageInputs = document.querySelectorAll('input[name="profile-image"]');
    const departmentInputs = document.querySelectorAll('input[name="department"]');
    const salaryInput = document.getElementById('salary');
    const notesInput = document.getElementById('notes');
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');
    const outputDiv = document.getElementById('output');

    // Form Submission Event Listener
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page reload

        // Capture Form Data
        const name = nameInput.value.trim();
        const gender = getSelectedGender();
        const profile = getSelectedProfileImage();
        const departments = getSelectedDepartments();
        const salary = parseSalary(salaryInput.value);
        const notes = notesInput.value.trim();
        const date = getSelectedDate();

        // Validations
        if (!validateName(name) || !validateGender(gender) || !validateDepartments(departments) ||
            !validateSalary(salary) || !validateNotes(notes) || !validateDate(date)) {
            return;
        }

        // Create Employee Data Object
        const EmployeeData = {
            name: name,
            gender: gender,
            profile: profile,
            departments: departments,
            salary: salary,
            notes: notes,
            date: date,
        };

        // Save to Local Storage
        let empList = [];
        if (localStorage.getItem('empList')) {
            empList = JSON.parse(localStorage.getItem('empList'));
        }
        empList.push(EmployeeData);
        localStorage.setItem('empList', JSON.stringify(empList));

        // Display Data in Console
        console.log(EmployeeData);

        // Display Data on Page
        displayEmployeeData(EmployeeData);

        // Reset Form
        form.reset();
    });

    // Helper: Get Selected Gender
    function getSelectedGender() {
        return [...genderInputs].find(input => input.checked)?.value || '';
    }

    // Helper: Get Selected Profile Image
    function getSelectedProfileImage() {
        return [...profileImageInputs].find(input => input.checked)?.value || '';
    }

    // Helper: Get Selected Departments (Array)
    function getSelectedDepartments() {
        return [...departmentInputs].filter(input => input.checked).map(input => input.value);
    }

    // Helper: Parse Salary (Remove ₹ and commas)
    function parseSalary(salary) {
        return parseFloat(salary.replace(/[₹,]/g, '')) || 0;
    }

    // Helper: Get Formatted Date (YYYY-MM-DD)
    function getSelectedDate() {
        const day = dayInput.value.padStart(2, '0');
        const month = monthInput.value.padStart(2, '0');
        const year = yearInput.value;
        return `${year}-${month}-${day}`;
    }

    // Validation: Name (Required, Min Length 2)
    function validateName(name) {
        if (!name || name.length < 2) {
            alert('❌ Please enter a valid name (min. 2 characters).');
            return false;
        }
        return true;
    }

    // Validation: Gender (Required)
    function validateGender(gender) {
        if (!gender) {
            alert('❌ Please select your gender.');
            return false;
        }
        return true;
    }

    // Validation: Departments (At least 1 Required)
    function validateDepartments(departments) {
        if (departments.length === 0) {
            alert('❌ Please select at least one department.');
            return false;
        }
        return true;
    }

    // Validation: Salary (Required, Positive Number)
    function validateSalary(salary) {
        if (!salary || isNaN(salary) || salary <= 0) {
            alert('❌ Please enter a valid positive salary.');
            return false;
        }
        return true;
    }

    // Validation: Notes (Required, Min Length 5)
    function validateNotes(notes) {
        if (!notes || notes.length < 5) {
            alert('❌ Notes must be at least 5 characters long.');
            return false;
        }
        return true;
    }

    // Validation: Date (Required and Valid Format)
    function validateDate(date) {
        if (!date || date === 'undefined-undefined-undefined') {
            alert('❌ Please select a valid date of joining.');
            return false;
        }
        return true;
    }

});