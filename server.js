const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

let css = `
    <style>
        body, html {
            background-color: #1c1b22;
            color: white;
        }
    </style>
`;

app.get('/', async (req, res) => {
    let response = 'API Online';
    res.status(200).send(response);
});

const mcRouter = require('./routes/mc.js');
const culversRouter = require('./routes/culvers.js');

app.use('/mc', mcRouter);
app.use('/culvers', culversRouter);

const server = app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
server.setTimeout(15000); 
