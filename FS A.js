const readline = require('readline');

// Array to store employees
let employees = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to show menu
function showMenu() {
  console.log("\nEmployee Management System");
  console.log("1. Add Employee");
  console.log("2. List Employees");
  console.log("3. Remove Employee");
  console.log("4. Exit");

  rl.question("\nEnter your choice: ", (choice) => {
    switch (choice.trim()) {
      case '1':
        addEmployee();
        break;
      case '2':
        listEmployees();
        break;
      case '3':
        removeEmployee();
        break;
      case '4':
        rl.close();
        break;
      default:
        console.log("Invalid choice. Please try again.");
        showMenu();
    }
  });
}

// Function to add employee
function addEmployee() {
  rl.question("Enter Employee Name: ", (name) => {
    rl.question("Enter Employee ID: ", (id) => {
      employees.push({ name, id });
      console.log(`Employee ${name} added successfully.`);
      showMenu();
    });
  });
}

// Function to list employees
function listEmployees() {
  if (employees.length === 0) {
    console.log("No employees found.");
  } else {
    console.log("\nEmployee List:");
    employees.forEach((emp, index) => {
      console.log(`${index + 1}. Name: ${emp.name}, ID: ${emp.id}`);
    });
  }
  showMenu();
}

// Function to remove employee by ID
function removeEmployee() {
  rl.question("Enter Employee ID to remove: ", (id) => {
    const index = employees.findIndex(emp => emp.id === id.trim());
    if (index !== -1) {
      const removed = employees.splice(index, 1)[0];
      console.log(`Employee ${removed.name} removed successfully.`);
    } else {
      console.log("Employee ID not found.");
    }
    showMenu();
  });
}

// Start the CLI
showMenu();

rl.on('close', () => {
  console.log("Exiting Employee Management System. Goodbye!");
  process.exit(0);
});
