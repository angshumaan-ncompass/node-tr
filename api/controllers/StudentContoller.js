const { connection } = require("../../utilities/DatabaseConfig");
const bcrypt = require('bcrypt');
require("dotenv").config();
const jwtoken = require('jsonwebtoken');
var { expressjwt: jwt } = require("express-jwt");
const { studentSchema, updateSchema, deleteSchema, readStudentSchema, loginSchema } = require('../models/validationSchema');
const customErrorHandler = require("../error/customErrorHandler");
const compress = require("../../utilities/compression");



const createStudent = (req, res, next) => {
    connection.query(
        `SELECT * FROM student WHERE LOWER(email) = LOWER(${connection.escape(
            req.body.email
        )});`,
        (err, result) => {
            if (result.length) {
                return res.status(409).send({
                    msg: 'This user is already in use!'
                });
            } else {
                // username is available
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).send({
                            msg: err
                        });
                    } else {
                        // has hashed pw => add to database
                        connection.query(
                            `INSERT INTO student (student_id,name, department ,cgpa,email,password) VALUES ('${req.body.student_id}','${req.body.name}','${req.body.department}','${req.body.cgpa}', ${connection.escape(
                                req.body.email
                            )}, ${connection.escape(hash)})`,
                            (err, result) => {
                                if (err) {
                                    throw err;
                                    return res.status(400).send({
                                        msg: err
                                    });
                                }
                                return res.status(201).send({
                                    msg: 'The user has been registerd with us!'
                                });
                            }
                        );
                    }
                });
            }
        }
    );

};


// const studentDetails = req.body;
//     const sqlQuery =
//         "insert into student (student_id, name, department, cgpa,email,password) values (?,?,?,?,?,?);";
//     const value = [
//         studentDetails.student_id,
//         studentDetails.name,
//         studentDetails.department,
//         studentDetails.cgpa,
//         studentDetails.email,
//         studentDetails.password,
//     ];
//     const result = studentSchema.validate(studentDetails);
//     if (result.error) {
//         res.status(500).send({
//             success: false,
//             message: result.error.message,
//             data: results
//         });
//         next(result.error);
//     } else {
//         connection.query(sqlQuery, value, (err, result) => {
//             if (err) {
//                 // res.status(500).send({
//                 //   success: false,
//                 //   message: err.message,
//                 //   data: {},
//                 // });
//                 throw new customErrorHandler(400, err);
//             } else {
//                 res.status(200).send({
//                     success: true,
//                     message: `${result.affectedRows} row affected`,
//                     data: {},
//                 });
//                 // req.profile = value;
//                 // next();
//             }
//         });
//     }


const readStudent = (req, res) => {
    let sqlQuery = "SELECT * FROM student";

    connection.query(sqlQuery, (err, results) => {
        if (err) {
            res.status(500).send({
                success: true,
                message: err.message,
                data: results
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

                    });
                }
                res.status(200).send({
                    success: true,
                    message: `${results.length} row fetched`,
                    data: results[0]
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
                        data: results
                    });
                }
                res.status(200).send({
                    success: true,
                    message: `${results.affectedRows} row deleted.`,
                    data: results
                });
            }
        );
    } else {
        res.status(400).send({
            success: false,
            message: status.error.message,
            data: results
        });
    }
}




const login = (req, res) => {
    // console.log(process.env.JWT_SECRET_KEY);
    connection.query(
        `SELECT * FROM student WHERE email = ${connection.escape(req.body.email)};`,
        (err, result) => {
            // user does not exists
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }
            if (!result.length) {
                return res.status(401).send({
                    msg: 'Email or password is incorrect!'
                });
            }
            // check password
            bcrypt.compare(
                req.body.password,
                result[0]['password'],
                (bErr, bResult) => {
                    // wrong password
                    if (bErr) {
                        throw bErr;
                        return res.status(401).send({
                            msg: 'Email or password is incorrect!'
                        });
                    }
                    if (bResult) {
                        const token = jwtoken.sign({ id: result[0].id }, process.env.JWT_SECRET_KEY);
                        // connection.query(
                        //     `UPDATE student SET last_login = CURRENT_TIMESTAMP WHERE studeid = '${result[0].id}'`
                        // );
                        return res.status(200).send({
                            msg: 'Logged in!',
                            token,
                            user: result[0]
                        });
                    }
                    return res.status(401).send({
                        msg: 'Username or password is incorrect!'
                    });
                }
            );
        }
    );
}




module.exports = {
    readStudent,
    readDetailStudent,
    deleteStudent,
    updateStudent,
    createStudent,
    login
}






