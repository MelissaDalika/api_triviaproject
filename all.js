const express = require('express')
const path = require('path')
const app = express()

app.use(express.static("./views"));

app.get("/home", (req, res) => {
 res.status(200).sendFile (path.join (__dirname, "/views/apihome.html"));
});

app.listen( 3000, () => console.log('Listening on port 3000'));


