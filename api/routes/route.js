const dotenv = require('dotenv');
const router = require("express").Router();
const { authenticateStudent } = require('../auth/auth')
const { validateStudent } = require('../models/validationSchema')
const { createUser } = require("../controllers/user/userController")
const errorHandler = require("../error/errorHandler");

const {
    readStudent,
    deleteStudent,
    updateStudent,
    createStudent,
    readDetailStudent,
    login
} = require("../controllers/StudentContoller");



// rourter.post("/user/generateToken", (req, res) => {
//     // Validate User Here
//     // Then generate JWT Token

//     let jwtSecretKey = process.env.JWT_SECRET_KEY;
//     let sqlQuery = 'select * from user where id =?;';

//     let data = {

//         id: req.body.id,
//         email: req.body.email
//     }

//     const token = jwt.sign(data, jwtSecretKey);

//     res.send(token);
// });


// app.get("/user/validateToken", (req, res) => {
//     // Tokens are generally passed in the header of the request
//     // Due to security reasons.

//     let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
//     let jwtSecretKey = process.env.JWT_SECRET_KEY;

//     try {
//         const token = req.header(tokenHeaderKey);

//         const verified = jwt.verify(token, jwtSecretKey);
//         if (verified) {
//             return res.send("Successfully Verified");
//         } else {
//             // Access Denied
//             return res.status(401).send(error);
//         }
//     } catch (error) {
//         // Access Denied
//         return res.status(401).send(error);
//     }
// });


const jwt = require("jsonwebtoken")

const jwtKey = "my_secret_key"
const jwtExpirySeconds = 300

const users = {
    user1: "password1",
    user2: "password2",
}



router.get('/student/read', readStudent);
router.post('/login', login);
// router.use(authenticateStudent)
router.post('/student/create', createStudent);
router.use(errorHandler);
router.get('/student/readDetail/:id', readDetailStudent);
router.put('/student/update/:id', updateStudent);
router.delete('/student/delete/:id', deleteStudent);
// router.post('/login', loginValidation)
// router.post('/search', searchStudent)


module.exports = router;