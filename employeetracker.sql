DROP DATABASE IF EXISTS employeetracker_DB;

CREATE DATABASE employeetracker_DB;

USE empoyeetracker_DB;

CREATE TABLE employees (
  id INTEGER(10) AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER(10),
  manager_id INTEGER(10),
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INTEGER(10) AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INTEGER(10),
  PRIMARY KEY (id)
);

CREATE TABLE departments (
  id INTEGER(10) AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO roles (title, salary, department_id)
VALUES ("Software Engineer", "90000", "1"), ("HR Business Partner", "95000", "2")

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", "125000", "1"), ("Manager", "125000", "2")

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Cher","Morabito", "1", "4"), ("Gail", "Bernstein" ,"2", "5"),