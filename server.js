//required for functionality
const inquirer = require('inquirer');
const cTable = require('console.table');
//print format for cTable
/* 
console.table([
    //each {} defines a row, each topic: defines a column
    {
        name: 'string',
        age: value
    }, {
        name: 'string',
        age: value
    }
]); 
*/
const mysql = require('mysql2');

//connect to the database
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'PersonOfInterest',
        database: 'staff_db'
    },
    console.log('Connected to staff_db')
);


// print database
// Query database
connection.query('SELECT * FROM department', function (err, results) {
    //department
    console.log(results);
  });

//role

//employee

//show options
//view all departments
//view all roles
//view all employees
//add department
//add role
//add employee
//update employee role

//view all departments
//formatted table with names and department id's

//view all roles
//show job title, id, department, salary

//view all employees
//formatted table with employee id's, first name, last name, job titles, departments, salaries, respective managers

//add department
//enter name, add to database

//add role
//enter name, salary, department, add to database

//add employee
//first name, last name, role, manager

//update employee role
//select employee, change role