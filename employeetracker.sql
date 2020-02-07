DROP DATABASE IF EXISTS employeetracker_DB;

CREATE DATABASE employeetracker_DB;

USE empoyeetracker_DB;

CREATE TABLE employees (
  id INTEGER(10) AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER(10) NOT NULL,
  manager_id INTEGER(10),
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INTEGER(10) AUTO_INCREMEMT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INTEGER(10),
  PRIMARY KEY (id)
);

CREATE TABLE departments (
  id INTEGER(10) AUTO_INCREMEMT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

-- INSERT INTO user (username, firstName, lastName)
-- VALUES ("Franklintendo", "Frank", "Lintendo"), ("EllenP", "Ellen", "Park")

