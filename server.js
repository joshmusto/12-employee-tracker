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
function runProgram() {
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'chooseFunction',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Exit Program'],
        }
    ])
    .then(function(response) {
        //perform function based on response value
        let selection = response.chooseFunction;
        if (selection=='View All Employees') {
            tableEmployees();
        }
        else if (selection=='Add Employee') {

        }
        else if (selection=='Update Employee Role') {
            
        }
        else if (selection=='View All Roles') {
            tableRoles();
        }
        else if (selection=='Add Role') {
            addRole();
        }
        else if (selection=='View All Departments') {
            tableDepartments();
        }
        else if (selection=='Add Department') {
            addDepartment();
        }
        else if (selection=='Exit Program') {
            console.log('Thank you for using the program!');
            console.log('Please press [Ctrl + C] to fully exit the program.')
        }
    })
}

//customizable query function, call createCustomQuery
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
        //function to replace incomplete data and get additional data
        async function fixEmployeeArray(currentEmployee) {
            //role
            let employeeId = currentEmployee[3];
            currentEmployee[3] = await createCustomQuery("title", "role", employeeId);

            //department
            let employeeDepartment = await createCustomQuery("department_id", "role", employeeId);
            currentEmployee.splice(4, 0, await createCustomQuery("name", "department", employeeDepartment));

            //salary
            currentEmployee.splice(5, 0, await createCustomQuery("salary", "role", employeeId));

            //manager
            if (currentEmployee[6] != null) {
                currentEmployee[6] = results[currentEmployee[6]-1][1] + ' ' + results[currentEmployee[6]-1][2];
            }
        }
        //get employee job names
        results.forEach(fixEmployeeArray);
    
        //print the table, as a function to be used with setInterval
        function printEmployeeTable() {
            console.table(['ID', 'First Name', 'Last Name', 'Job Title', 'Department', 'Salary', 'Manager'],
            results);
        }
        setTimeout(() => {
            printEmployeeTable();
            runProgram();
        }, 1000);
        
    });
}
//tableEmployees();

//add employee
//first name, last name, role, manager

//update employee role
//select employee, change role


//view all roles
//show job title, id, department, salary
const tableRoles = () => {
    connection.query({ sql:'SELECT * FROM role', rowsAsArray: true }, function (err, results) {
        async function fixRoleArray(currentRole) {
            currentRole[3] = await createCustomQuery('name', 'department', currentRole[3]);
        }
        function printRoleTable() {
            console.table(['ID', 'Title', 'Salary', 'Department'],
            results);
        }
        //fix the role array
        results.forEach(fixRoleArray);
        //print the table after a bit
        setTimeout(() => {
            printRoleTable();
            runProgram();
        }, 1000);
    })
}
//tableRoles();

//add role
//enter name, salary, department, add to database
const addRole = () => {
    inquirer
    .prompt([
        {
            type: 'input',
            message: "What's the name of the role?",
            name: 'newRoleName',
        },
        {
            type: 'input',
            message: "What's the salary for the role? (Please format like the following: $50,000, $100,000, etc.)",
            name: 'newRoleSalary',
        },
        {
            type: 'number',
            message: "What's the ID of the department this role belongs to?",
            name: 'newRoleDepartment',
            validate: async (input) => {
                const roleDepartmentCheck = await createCustomQuery("id", "department", input);
                if (roleDepartmentCheck == "") {
                    return 'There is no department with that ID. Please try again.'
                }
                else {
                    return true;
                }
            }
        }
    ])
    .then(function(response) {
        connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.newRoleName}', '${response.newRoleSalary}', '${response.newRoleDepartment}')`, function(err, result) {
            if (!err) {
                console.log(`New role, ${response.newRoleName}, has been added`);
                runProgram();
            }
            else {
                console.log(err);
            }
        });
    })
}

//view all departments
//formatted table with names and department id's
const tableDepartments = () => {
    connection.query({ sql:'SELECT * FROM department', rowsAsArray: true }, function (err, results) {
        function printDepartmentArray() {
            console.table(['ID', 'Department Name'],
            results);
        }
        //print the table and restart the program after one second
        setTimeout(() => {
            printDepartmentArray();
            runProgram();
        }, 1000);
    })
}
//tableDepartments();

//add department
//enter name, add to database
const addDepartment = () => {
    inquirer
    .prompt([
        {
            type: 'input',
            message: "What's the name of the department?",
            name: 'newDepartment',
        }
    ])
    .then(function(response) {
        let newDepartment = response.newDepartment;
        connection.query(`INSERT INTO department (name) VALUES ('${newDepartment}')`, function(err, result) {
            if (!err) {
                console.log(`New department, ${newDepartment}, has been added`);
                runProgram();
            }
            else {
                console.log(err);
            }
        });
    })
}

//actually run the program
runProgram();