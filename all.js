const express = require('express')
const path = require('path')
const app = express()

app.get("/home", (req, res) => {
 res.status(200).sendFile (path.join (__dirname, "/apihome.html"));
});


app.listen( 3000, () => console.log('Listening on port 3000'));


