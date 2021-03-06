const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const config = require("./package.json");

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

  afterConnection();
});

function afterConnection() {
  console.log(logo({ name: "EMPLOYEE TRACKER", font: "Puffy" }).render());
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
          "Update Employee Roles",
          "Remove Employee",
          "Add Department",
          "View all Departments",
          "View Employees by Department",
          "Delete Department",
          "Add Roles",
          "View all Roles",
          "Update Employee Managers",
          "Delete Role",
          "Exit"
        ]
      }
    ])
    .then(function(res) {
      if (res.action === "Add Employee") {
        addEmployee();
      } else if (res.action === "View All Employees") {
        viewAllEmployees();
      } else if (res.action === "Add Department") {
        addDepartment();
      } else if (res.action === "Add Roles") {
        addRoles();
      } else if (res.action === "View all Departments") {
        viewAllDepartments();
      } else if (res.action === "View all Roles") {
        viewAllRoles();
      } else if (res.action === "Update Employee Roles") {
        updateEmployeeRoles();
      } else if (res.action === "Update Employee Managers") {
        updateEmployeeManager();
      } else if (res.action === "View Employees by Department") {
        viewEmployeesbyDept();
      } else if (res.action === "Remove Employee") {
        removeEmployee();
      } else if (res.action === "Delete Role") {
        deleteRoles();
      } else if (res.action === "Delete Department") {
        deleteDepartment();
      } else if (res.action === "Exit") {
        connection.end();
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
  let managerList = ["null"];
  connection.query(
    "SELECT employees.first_name, employees.last_name FROM employees",
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
          if (res.managerId !== "null") {
            const query = `SELECT id FROM employees WHERE concat(employees.first_name, ' ' , last_name) = '${res.managerId}'`;
            connection.query(query, function(err, res) {
              console.log("managerquery", res);
              const query = `UPDATE employees SET manager_id = '${res[0].id}' WHERE employees.id = '${id}'`;
              connection.query(query, function(err, res) {
                console.log("updatemanager", res);
                start();
              });
            });
          } else {
            start();
          }
        });
    }
  );
}
function viewAllEmployees() {
  allEmployees = [];
  connection.query(
    `SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS dept_name, concat(managers.first_name, " ", managers.last_name) AS Manager FROM roles INNER JOIN departments ON departments.id = roles.department_id RIGHT JOIN employees ON roles.id = employees.role_id LEFT JOIN employees managers ON employees.manager_id = managers.id`,
    function(err, res) {
      console.table(res);
      start();
      //console.log(allEmployees);
    }
  );
}
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the name of the Department you would like to add?"
      }
    ])
    .then(function(res) {
      console.log(res);
      const query = connection.query(
        "INSERT INTO departments SET ?",
        {
          name: res.departmentName
        },
        (err, res) => {
          connection.query(`SELECT * FROM departments`, (err, res) => {
            console.table(res);
            start();
          });
        }
      );
    });
}
function addRoles() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What role would you like to add?"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for the role?"
      }
    ])
    .then(function(res) {
      console.log(res);
      const query = connection.query(
        "INSERT INTO roles SET ?",
        {
          title: res.title,
          salary: res.salary
        },
        (err, res) => {
          console.log(res);
          const id = res.insertId;
          updateRoleDepartment(id);
        }
      );
    });
}
function updateRoleDepartment(id) {
  let departments = [];
  connection.query("SELECT name FROM departments", (err, res) => {
    for (let i = 0; i < res.length; i++) {
      departments.push(res[i].name);
    }

    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentName",
          message: "What department is the role in?",
          choices: departments
        }
      ])
      .then(function(res) {
        const query = `SELECT id FROM departments WHERE name = '${res.departmentName}'`;

        connection.query(query, function(err, res) {
          const query = `UPDATE roles SET department_id = '${res[0].id}' WHERE roles.id = '${id}'`;
          connection.query(query, function(err, res) {
            if (err) throw err;
            connection.query(`Select * from roles`, (err, res) => {
              console.table(res);
              start();
            });
          });
        });
      });
  });
}
function viewAllDepartments() {
  connection.query(`SELECT * FROM departments`, (err, res) => {
    console.table(res);
    start();
  });
}
function viewAllRoles() {
  connection.query(
    `SELECT roles.*, departments.name FROM roles LEFT JOIN departments ON departments.id = roles.department_id
    `,
    (err, res) => {
      console.table(res);
      start();
    }
  );
}
function updateEmployeeRoles() {
  let employees = [];

  connection.query(
    `SELECT first_name, last_name FROM employees`,
    (err, res) => {
      // include a list of all employees to choose from
      for (let i = 0; i < res.length; i++) {
        let fullName = res[i].first_name + " " + res[i].last_name;
        employees.push(fullName);
      }
      // prompt what employee user would like to update
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeNames",
            message: "What employee would you like to update?",
            choices: employees
          }
        ])
        .then(function(res) {
          connection.query(
            `SELECT id FROM employees WHERE concat(employees.first_name, ' ' , last_name) = '${res.employeeNames}'`,
            (err, res) => {
              console.log(res);
              updateRole(res);
            }
          );
        });
    }
  );
}
function updateRole(id) {
  let roles = [];
  connection.query(`SELECT title FROM roles`, (err, res) => {
    for (let i = 0; i < res.length; i++) {
      roles.push(res[i].title);
    }
    // once selected, ask user what the employee's new role is
    inquirer
      .prompt([
        {
          type: "list",
          name: "roleTitles",
          message: "What would you like the employee's new role to be?",
          choices: roles
        }
      ])
      .then(function(res) {
        console.log(res);
        // Update database
        const query = `SELECT id FROM roles WHERE title = '${res.roleTitles}'`;
        connection.query(query, function(err, res) {
          console.log("employees.id", id[0].id);
          const query = `UPDATE employees SET role_id = '${res[0].id}' WHERE employees.id = '${id[0].id}'`;
          connection.query(query, function(err, res) {
            if (err) throw err;
            start();
          });
        });
      });
  });
}
function viewEmployeesbyDept() {
  let departments = [];
  connection.query("SELECT name FROM departments", (err, res) => {
    console.log(res);
    for (let i = 0; i < res.length; i++) {
      departments.push(res[i].name);
    }

    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentName",
          message: "What Department would you like to view all Employees?",
          choices: departments
        }
      ])
      .then(function(res) {
        console.log(res.departmentName);
        connection.query(
          `SELECT id FROM departments WHERE name = '${res.departmentName}'`,
          (err, res) => {
            console.log(res[0].id);
            connection.query(
              `SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS dept_name, concat(managers.first_name, " ", managers.last_name) AS Manager FROM roles INNER JOIN departments ON departments.id = roles.department_id RIGHT JOIN employees ON roles.id = employees.role_id LEFT JOIN employees managers ON employees.manager_id = managers.id WHERE department_id = '${res[0].id}'`,
              (err, res) => {
                console.table(res);
                start();
              }
            );
          }
        );
      });
  });
}
function removeEmployee() {
  let employeeList = [];
  connection.query(
    "SELECT employees.first_name, employees.last_name FROM employees",
    (err, res) => {
      for (let i = 0; i < res.length; i++) {
        let fullName = res[i].first_name + " " + res[i].last_name;
        employeeList.push(fullName);
      }
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "What employee would you live to remove?",
            choices: employeeList
          }
        ])
        .then(function(res) {
          console.log(res.employee);
          connection.query(
            `DELETE FROM employees WHERE concat(first_name, ' ' ,last_name) = '${res.employee}'`,
            err => {
              if (err) throw err;
              connection.query("SELECT * FROM employees", (err, res) => {
                console.table(res);
                start();
              });
            }
          );
        });
    }
  );
}
function deleteRoles() {
  let roles = [];
  connection.query("SELECT title FROM roles", (err, res) => {
    for (let i = 0; i < res.length; i++) {
      roles.push(res[i].title);
    }

    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: "What role would you like to delete?",
          choices: roles
        }
      ])
      .then(function(res) {
        connection.query(
          `DELETE FROM roles WHERE title = '${res.role}'`,
          (err, res) => {
            if (err) throw err;
            connection.query("SELECT * from roles", (err, res) => {
              console.table(res);
              start();
            });
          }
        );
      });
  });
}
function deleteDepartment() {
  let departments = [];
  connection.query("SELECT name FROM departments", (err, res) => {
    console.log(res);
    for (let i = 0; i < res.length; i++) {
      departments.push(res[i].name);
    }

    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentName",
          message: "What Department would you like to delete?",
          choices: departments
        }
      ])
      .then(function(res) {
        console.log(res.departmentName);
        connection.query(
          `DELETE FROM departments WHERE name = '${res.departmentName}'`,
          (err, res) => {
            connection.query(`SELECT * FROM departments`, (err, res) => {
              console.table(res);
              start();
            });
          }
        );
      });
  });
}
function updateEmployeeManager() {
  employees = [];

  connection.query(
    `SELECT first_name, last_name FROM employees`,
    (err, res) => {
      // include a list of all employees to choose from
      for (let i = 0; i < res.length; i++) {
        let fullName = res[i].first_name + " " + res[i].last_name;
        employees.push(fullName);
      }
      // prompt what employee user would like to update
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeNames",
            message: "What employee would you like to update?",
            choices: employees
          }
        ])
        .then(function(res) {
          connection.query(
            `SELECT id FROM employees WHERE concat(employees.first_name, ' ' , last_name) = '${res.employeeNames}'`,
            (err, res) => {
              const id = res[0].id;
              console.log(id);
              updateManager(id);
            }
          );
        });
    }
  );
}
function updateManager(id) {
  let managerList = ["null"];
  connection.query(
    "SELECT employees.first_name, employees.last_name FROM employees",
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
            message: "Who is the employee's new manager?",
            choices: managerList
          }
        ])
        .then(function(res) {
          console.log("managerid", res.managerId);
          if (res.managerId !== "null") {
            const query = `SELECT id FROM employees WHERE concat(employees.first_name, ' ' , last_name) = '${res.managerId}'`;
            connection.query(query, function(err, res) {
              console.log("managerquery", res);
              const query = `UPDATE employees SET manager_id = '${res[0].id}' WHERE employees.id = '${id}'`;
              connection.query(query, function(err, res) {
                console.log(res);
                connection.query("SELECT * from employees", (err, res) => {
                  console.table(res);
                  start();
                });
              });
            });
          } else {
            connection.query(
              `UPDATE employees SET manager_id = NULL WHERE employees.id = '${id}`,
              (err, res) => {
                if (err) throw err;
                start();
              }
            );
          }
        });
    }
  );
}
