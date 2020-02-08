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
  start();
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
      if (res.action === "Add Employee") {
        addEmployee();
      } else if (res.action === "View All Employees") {
        viewAllEmployees();
      }
    });
}
function addEmployee() {
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
      }
    ])
    .then(function(res) {
      console.log(res);
      const query = connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: res.firstName,
          last_name: res.lastName
        },
        (err, res) => {
          console.log(res);
          const id = res.insertId;
          updateRoleId(id);
        }
      );
    });
}
function updateRoleId(id) {
  let roles = [];
  connection.query("SELECT title FROM roles", (err, res) => {
    for (let i = 0; i < res.length; i++) {
      roles.push(res[i].title);
    }

    inquirer
      .prompt([
        {
          type: "list",
          name: "roleId",
          message: "What is the employee's role?",
          choices: roles
        }
      ])
      .then(function(res) {
        const query = `SELECT id FROM roles WHERE title = '${res.roleId}'`;

        connection.query(query, function(err, res) {
          console.log(res[0].id);
          const query = `UPDATE employees SET role_id = '${res[0].id}' WHERE employees.id = '${id}'`;
          connection.query(query, function(err, res) {
            if (err) throw err;
          });
        });
        updateManagerId(id);
      });
  });
}
function updateManagerId(id) {
  let managerList = [];
  connection.query(
    "SELECT employees.first_name, employees.last_name FROM employees INNER JOIN roles ON roles.id = employees.role_id WHERE roles.title = 'Manager'",
    (err, res) => {
      for (let i = 0; i < res.length; i++) {
        let fullName = res[i].first_name + " " + res[i].last_name;
        managerList.push(fullName);
      }
      inquirer
        .prompt([
          {
            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
            choices: managerList
          }
        ])
        .then(function(res) {
          console.log("managerid", res.managerId);
          const query = `SELECT id FROM employees WHERE concat(employees.first_name, ' ' , last_name) = '${res.managerId}'`;
          connection.query(query, function(err, res) {
            console.log("managerquery", res);
            const query = `UPDATE employees SET manager_id = '${res[0].id}' WHERE employees.id = '${id}'`;
            connection.query(query, function(err, res) {
              console.log("updatemanager", res);
            });
          });
        });
    }
  );
}
function viewAllEmployees() {
  connection.query(
    `SELECT employees.*, roles.title, roles.salary, roles.department_id FROM employees LEFT JOIN roles ON employees.role_id = roles.id`,
    function(err, res) {
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        console.log(
          `ID:${res[i].id} || First Name: ${res[i].first_name} || Last Name: ${res[i].last_name} || Manager ID: ${res[i].manager_id} || Title: ${res[i].title} ||Salary: ${res[i].salary} || Department ID: ${res[i].department_id}`
        );
      }
    }
  );
}
