const inquirer = require("inquirer");
const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Databasepassword",
  database: "employeetracker_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  //connection.end();
  afterConnection();
});

function afterConnection() {
  let roles = roles.map((role, index) => {
    return roles;
  });
  start();
  //   connection.query("SELECT * FROM products", function(err, res) {
  //     if (err) throw err;
  //     console.log(res);
  //connection.end();
  //   });
}

function start() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "Add Employee",
          "View All Employees",
          "View Employees by Department",
          "Add Department",
          "View Department",
          "Add Roles",
          "View Roles",
          "Update Employee Roles",
          "Remove Employee"
        ]
      }
    ])
    .then(function(res) {
      console.log(res.action);
      if (res.action === "Add Employee") {
        addEmployee();
      } else if (res.action === "View All Employees") {
        viewEmployees();
      }
    });
}
function addEmployee(firstName, lastName, roleId, managerId) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roles
      },
      {
        type: "input",
        name: "managerId",
        message: "Who is the employee's manager?"
        // choices: ""
      }
    ])
    .then(function(res) {
      console.log(roles);
      //   const query = connection.query("INSERT INTO employee SET ?", {
      //     first_name: res.firstName,
      //     last_name: res.lastName,
      //     role_id: res.roleId,
      //     manager_id: res.managerId
      //   });

      start();
    });
}
