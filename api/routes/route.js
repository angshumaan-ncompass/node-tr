const router = require("express").Router();
const errorHandler = require("../error/errorHandler");
const { isSignedIn, authenticateJWT, isAuthenticated } = require("../auth/auth")

const { readStudent, deleteStudent, updateStudent, createStudent, readDetailStudent, login } = require("../controllers/StudentContoller");
const {
    createValidation,
    updateValidation,
    deleteValidation,
    readOneValidation

} = require("../controllers/validationController");



// router.get("/testroute", isSignedIn, (req, res) => {
//     res.json(req.auth);
// })
router.post('/login', login);
router.get('/student/read', readStudent);
router.post('/student/create', createValidation, createStudent);
router.get('/student/readDetail/:id', readOneValidation, isAuthenticated, readDetailStudent);
router.put('/student/update/:id', updateValidation, isAuthenticated, updateStudent);
router.delete('/student/delete/:id', deleteValidation, isAuthenticated, deleteStudent);
// router.get('/search', searchStudent)
// router.get('/student/readDetail/', authenticateJWT, readDetailStudent);

module.exports = router;