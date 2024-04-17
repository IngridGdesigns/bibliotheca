const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}, near the port`)
})

app.get('/', async (req, res) => { //unprotected route
    res.send("testing, hello!!")
})