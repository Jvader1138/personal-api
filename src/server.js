const mc = require('minecraftstatuspinger')
const express = require('express')
const app = express()

let css = `
    <style>
        body, html {
            background-color: #1c1b22;
            color: white;
        }
    </style>
`

app.get('/', async (req, res) => {
    let html = `<h1>Nothing to see here...</h1>`
    res.send(html + css);
})

app.get('/mc/:ip', async (req, res) => {
    let html = ``
    try {
        let ping = await mc.lookup({ host: req.params.ip });
        html = `
            <h1>Pinging server ${req.params.ip}</h1>
            <p>Latency: ${ping.latency}ms</p>
            <p>MOTD: ${ping?.status?.description}</p>
            <p>Players: ${ping?.status?.players.online}/${ping?.status?.players.max}</p>
        `
    } catch (error) {
        html = `
            <h1>Pinging server ${req.params.ip}</h1>
            <p>${error}</p>
        `
    }
    res.send(html + css);
})

var server = app.listen(3000);
server.setTimeout(10000);
