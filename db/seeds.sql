/* run with [mysql -u root -p < db/seeds.sql] */
USE staff_db;
/* department seeds */
INSERT INTO department (id, name)
VALUES (1, "Production"),
       (2, "Quality Assurance"),
       (3, "Concept");
       
/* role seeds */
INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Production Coordinator", "$100,000", 1),
       (2, "Production Engineer", "$80,000", 1),
       (3, "QA Lead", "$100,000", 2),
       (4, "QA Tester", "$80,000", 2),
       (5, "Concept Lead", "$100,000", 3),
       (6, "Concept Engineer", "$80,000", 3);

/* employee seeds */
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Kate", "Kaplan", 1, NULL),
       (2, "Brent", "Singleton", 2, 1),
       (3, "AJ", "Costiopolis", 3, NULL),
       (4, "Jeremy", "Kite", 4, 3),
       (5, "Gunther", "Thorp", 5, NULL),
       (6, "Slimey", "Tickleton", 6, 5);