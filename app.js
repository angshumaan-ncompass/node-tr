require('dotenv').config();


const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const studentRoute = require("./api/routes/route");
const errorHandler = require('./api/error/errorHandler');

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

// app.use(bodyParser.text({ type: "*/*" })); // for parsing text
app.use(cors());

app.use(errorHandler)


studentRoute.use(cookieParser());
app.use('/api', studentRoute)



// app.get('/', (req, res) => {
//     res.send("<h1>Home Page<h1>");
// })

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`))