const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let css = `
    <style>
        body, html {
            background-color: #1c1b22;
            color: white;
        }
    </style>
`;

app.get('/', async (req, res) => {
    let html = `<h1>Nothing to see here...</h1>`;
    res.send(html + css);
});

const mcRouter = require('./routes/mc.js');
const culversRouter = require('./routes/culvers.js');

app.use('/mc', mcRouter);
app.use('/culvers', culversRouter);

const server = app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
server.setTimeout(15000);
