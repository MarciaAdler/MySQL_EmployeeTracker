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

//   connection.query("SELECT * FROM products", function(err, res) {
//     if (err) throw err;
//     console.log(res);
//connection.end();
//   });

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
        //   } else if (res.action === "View All Employees") {
        //     viewEmployees();
      }
    });
}
function addEmployee() {
  const managerList = [];
  connection.query(
    "SELECT first_name, last_name FROM employees INNER JOIN roles ON employees.manager_id = roles.id WHERE title = 'Manager'",
    (err, res) => {
      for (let i = 0; i < res.length; i++) {
        let fullName = res[i].first_name + " " + res[i].last_name;
        managerList.push(fullName);
      }
    }
  );
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
        console.log(res.roleId);
        const query = `SELECT id FROM roles WHERE title = '${res.roleId}'`;

        connection.query(query, function(err, res) {
          console.log(res[0].id);
          const query = `UPDATE employees SET role_id = '${res[0].id}' WHERE employees.id = '${id}'`;
          connection.query(query, function(err, res) {
            console.log(res);
          });
        });
      });
  });
}

//
//     {
//       type: "list",
//       name: "manager",
//       message: "Who is the employee's manager?",
//       choices: managerList
//     }.then(function(res) {
//       console.log(res);
//   const query = connection.query("INSERT INTO employees SET ?", {
//     first_name: res.firstName,
//     last_name: res.lastName,
//     role_id: res.roleId,
//     manager_id: res.managerId
//   });

//start();
//});
