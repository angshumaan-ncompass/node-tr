// const { hashSync } = require('bcrypt');
// const { genSaltSync } = require('bcrypt');
// const { create } = require('./userServices')



// exports.createUser = (req, res) => {
//     const body = req.body;
//     const salt = genSaltSync(10);
//     body.password = hashSync(body.password, salt)
//     create(body, (err, results) => {
//         if (err) {
//             console.log(err);
//         }
//         return res.status(500).json({
//             success: 0,
//             message: "database connection error"
//         })
//     })
//     return res.status(200).json({
//         success: 1,
//         data: results
//     })
// }

const jwt = require("jsonwebtoken")

const jwtKey = "my_secret_key"
const jwtExpirySeconds = 300

const users = {
    user1: "password1",
    user2: "password2",
}

const signIn = (req, res) => {
    // Get credentials from JSON body
    const { username, password } = req.body
    if (!username || !password || users[username] !== password) {
        return res.status(401).end()
    }

    // Create a new token with the username in the payload
    // and which expires 300 seconds after issue
    const token = jwt.sign({ username }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    })
    console.log("token:", token)

    // set the cookie as the token string, with a similar max age as the token
    // here, the max age is in milliseconds, so we multiply by 1000
    res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
    res.end()
}


const welcome = (req, res) => {
    // We can obtain the session token from the requests cookies, which come with every request
    const token = req.cookies.token

    // if the cookie is not set, return an unauthorized error
    if (!token) {
        return res.status(401).end()
    }

    var payload
    try {

        payload = jwt.verify(token, jwtKey)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {

            return res.status(401).end()
        }

        return res.status(400).end()
    }


    res.send(`Welcome ${payload.username}!`)

}



module.exports = {
    signIn,
    welcome,
}