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
/* connection.query('SELECT * FROM department', function (err, results) {
    console.log(results);
  }); */

//What would you like to do?
    //view all employees
    //add employee
    //update employee role
    //view all roles
    //add role
    //view all departments
    //add department

//customizable query function
const customQuery = (dataTarget, tableTarget, idTarget) => {
    connection.query(`SELECT ${dataTarget} FROM ${tableTarget} WHERE id = ${idTarget}`, function (err, results) {
        return results;
    })
}
console.log(customQuery("*", "role", "1"));

//view all employees
//formatted table with employee id's, first name, last name, job titles, departments, salaries, respective managers
const tableEmployees = () => {
    connection.query('SELECT * FROM employee', function (err, results) {
        console.table([
            {
                id: results[0].id,
                first_name: results[0].first_name,
                last_name: results[0].last_name,
                title: customQuery("title", "role", results[0].role_id),
                manager_id: results[0].manager_id,
            }
        ])
    })
}
tableEmployees();

//add employee
//first name, last name, role, manager


//update employee role
//select employee, change role


//view all roles
//show job title, id, department, salary


//add role
//enter name, salary, department, add to database


//view all departments
//formatted table with names and department id's


//add department
//enter name, add to database