require("dotenv").config();
const { expressjwt: expressjwt } = require("express-jwt");





exports.isAuthenticated = expressjwt({
    secret: process.env.JWT_SECRET_KEY,
    userProperty: "auth",
    algorithms: ["HS256"]
})

// exports.auth = (req, res) => {
//     const idQuery = req.query.student_id
//     let user = `select * from student where student_id=?;`
//     connection.query(
//         user, idQuery,
//         (err, results) => {
//             if (err) return res.status(500).json(err);
//             else {
//                 // create token
//                 console.log(process.env.JWT_SECRET_KEY);
//                 const token = jwtoken.sign({ id: results[0].student_id }, process.env.JWT_SECRET_KEY)
//                 //put token in cookie
//                 res.cookie("token", token, { expire: new Date() + 9999 })
//                 const { student_id, name, department, cgpa, email } = req.query;
//                 return res.json({ token, user: { student_id, name, department, cgpa, email } })
//             }
//         }
//     )
// }



// exports.isAuthenticated = (req, res, next) => {
//     let checker = req.profile && req.auth && req.profile.student_id == req.auth.student_id;
//     if (!checker) {
//         return res.status(403).json({
//             error: "ACCESS DENIED"
//         })
//     }

//     next();

// }


// exports.authenticateJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//         const token = authHeader.split(' ')[1];

//         jwtoken.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
//             if (err) {
//                 return res.sendStatus(403);
//             }

//             req.user = user;
//             next();
//         });
//     } else {
//         res.sendStatus(401);
//     }
// };