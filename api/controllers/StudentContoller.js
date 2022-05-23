const { connection } = require("../../utilities/DatabaseConfig");

const { studentSchema, updateSchema, deleteSchema, readStudentSchema, loginSchema } = require('../models/validationSchema');
const customErrorHandler = require("../error/customErrorHandler");
const zlib = require('zlib');
const compress = require("../../utilities/compression");



const createStudent = (req, res, next) => {

    const studentDetails = req.body;
    const sqlQuery =
        "insert into student (student_id, name, department, cgpa) values (?,?,?,?);";
    const value = [
        studentDetails.student_id,
        studentDetails.name,
        studentDetails.department,
        studentDetails.cgpa,
    ];
    const result = studentSchema.validate(studentDetails);
    if (result.error) {
        res.status(500).send({
            success: false,
            message: result.error.message,
            data: {},
        });
        next(result.error);
    } else {
        connection.query(sqlQuery, value, (err, result, fields) => {
            if (err) {
                // res.status(500).send({
                //   success: false,
                //   message: err.message,
                //   data: {},
                // });
                throw new customErrorHandler(400, err);
            } else {
                res.status(200).send({
                    success: true,
                    message: `${result.affectedRows} row affected`,
                    data: {},
                });
            }
        });
    }
};

// connection.query(sqlQuery, value, (err, result, fields) => {
//     if (err) {
//         // res.status(500).send({
//         //   success: false,
//         //   message: err.message,
//         //   data: {},
//         // });
//         throw new customErrorHandler(400, err);
//     } else {
//         res.status(200).send({
//             success: true,
//             message: `${result.affectedRows} row affected`,
//             data: {},
//         });
//     }
// });

// const createStudent = (req, res) => {
//     let student = req.body;
//     console.log(student)
//     var qry = 'INSERT INTO student (student_id,name,department,cgpa) VALUES (? ,? ,? ,? );'
//     let qryParams = [student.student_id, student.name, student.department, student.cgpa]
//     let status = studentSchema(student);
//     if (e.isValid) {
//         connection.query(
//             qry, qryParams,
//             (err, results, fields) => {
//                 if (err) {
//                     res.status(500).send({
//                         success: false,
//                         message: err.message,
//                         data: {}
//                     });
//                 }
//                 res.status(200).send({
//                     success: true,
//                     message: `${results.affectedRows} row effected`,
//                     data: {}
//                 });
//             }
//         );
//     } else {
//         res.status(400).send({
//             success: false,
//             message: status.message,
//             data: {}
//         });
//     }
// }


//     const students = {
//         student_id: req.body.student_id,
//         name: req.body.name,
//         department: req.body.department,
//         cgpa: req.body.cgpa,
//     }
//     console.log(students);
//     connection.query('INSERT INTO student SET ?', students, (err, results, fields) => {
//         if (err) {
//             throw err;
//         } else {
//             res.send(JSON.stringify({ "status": 201, "error": null, "response": results }));
//         }
//     });
// }




const readStudent = (req, res) => {
    let sqlQuery = "SELECT * FROM student";

    connection.query(sqlQuery, (err, results) => {
        if (err) {
            res.status(500).send({
                success: true,
                message: err.message,
                data: {}
            });
        } else {
            // res.setHeader('Content-Encoding', 'gzip');
            // res.setHeader('Content-Type', 'application/json');
            // let val = compressResponse({
            //     "success": true,
            //     "message": `${result.affectedRows} row affected`,
            //     "data": {},
            // })
            // res.status(200).send(val);

            const response = {
                success: true,
                message: "Rows retrived",
                data: results,
            };
            compress(response);

            console.log(response);

            res.status(200).send({
                response,
            });
        }

    });
};



const readDetailStudent = (req, res) => {
    let sqlQuery = 'select * from student where student_id =?;'
    let qryParams = [req.params.id];

    let status = readStudentSchema.validate(req.params);
    if (!status.error) {
        connection.query(
            sqlQuery, qryParams,
            (err, results) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: err.message,
                        data: {}
                    });
                }
                res.status(200).send({
                    success: true,
                    message: `${results.length} row fetched`,
                    data: results
                });

            }
        );
    } else {
        res.status(400).send({
            success: false,
            message: status.message,
            data: {}
        })
    }

};





const updateStudent = (req, res) => {
    let student = req.body;
    console.log(student);
    let { id } = req.params;

    let sqlQuery = 'UPDATE student SET name = ? , department = ?, cgpa = ? WHERE student_id = ?;';
    let qryParams = [student.name, student.department, student.cgpa, id];

    let status = updateSchema.validate(student);
    if (!status.error) {
        connection.query(
            sqlQuery, qryParams,
            (err, results, fields) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: err.message,
                        data: {}
                    });
                } else {
                    res.status(200).send({
                        success: true,
                        message: `${results.affectedRows} row updated.`,
                        data: {}
                    });
                }
            }
        );
    } else {
        res.status(400).send({
            success: false,
            message: status.error.message,
            data: {}
        });
    }
}





const deleteStudent = (req, res) => {
    let sqlQuery = 'DELETE FROM student WHERE student_id = ?;';
    let queryParam = [req.params.id]

    let status = deleteSchema.validate(req.params);
    if (!status.error) {
        connection.query(
            sqlQuery, queryParam,
            (err, results) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: err.message,
                        data: {}
                    });
                }
                res.status(200).send({
                    success: true,
                    message: `${results.affectedRows} row deleted.`,
                    data: {}
                });
            }
        );
    } else {
        res.status(400).send({
            success: false,
            message: status.error.message,
            data: {}
        });
    }
}




const login = (req, res) => {
    const user = req.body;
    console.log(user)
    const email = "angshu@gmail.com";
    const password = "ab1238654";
    let status = loginSchema.validate(user)
    if (!status.error) {

        if (email == user.email && password == user.password) {
            res.status(200).send({
                success: true,
                message: `Logged in successfully`,
                data: {}
            });
        } else {
            res.status(400).send({
                success: false,
                message: `Email or password is incorrect.`,
                data: {}
            });
        }
    } else {
        res.status(400).send({
            success: false,
            message: status.error.message,
            data: {}
        });
    }



};

module.exports = {
    readStudent,
    readDetailStudent,
    deleteStudent,
    updateStudent,
    createStudent,
    login
}






