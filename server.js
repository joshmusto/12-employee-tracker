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
//currently doesn't work, can't actually return data

const customQuery = async(dataTarget, tableTarget, idTarget) => {
    //define the query
    const sql = `SELECT ${dataTarget} FROM ${tableTarget} WHERE id = ${idTarget}`;
    
    return new Promise((resolve, reject) => {
        //execute the query
        const queryValue = connection.query({ sql:sql, rowsAsArray: true }, (err, results) => {
            if (err) {
                console.log(err);
            }
            else  {
                resolve(results);
            }
        });
    })
}
async function createCustomQuery(dataTarget, tableTarget, idTarget) {
    const data = await customQuery(dataTarget, tableTarget, idTarget);
    return data;
}


//view all employees
//formatted table with employee id's, first name, last name, job titles, departments, salaries, respective managers
const tableEmployees = () => {
    connection.query({ sql:'SELECT * FROM employee', rowsAsArray: true }, function (err, results) {
        
        //function to replace role_id and manager_id with names
        async function fixEmployeeArray(currentEmployee) {
            //role
            let employeeId = currentEmployee[3];
            currentEmployee[3] = await createCustomQuery("title", "role", employeeId);

            //manager
            if (currentEmployee[4] != null) {
                currentEmployee[4] = results[currentEmployee[4]-1][1] + ' ' + results[currentEmployee[4]-1][2];
            }
        }
        //get employee job names
        results.forEach(fixEmployeeArray);
    
        //print the table, as a function to be used with setInterval
        function printEmployeeTable() {
            console.table(['ID', 'First Name', 'Last Name', 'Job Title', 'Manager'],
            results);
        }
        setTimeout(() => printEmployeeTable(), 1000);
        
    });
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