const mc = require('minecraftstatuspinger')
const express = require('express')
const router = express.Router()

let css = `
    <style>
        body, html {
            background-color: #1c1b22;
            color: white;
        }
    </style>
`

router.get('/', async (req, res) => {
    let html = `<h1>Minecraft Homepage</h1>`
    res.send(html + css);
})

router.get('/:ip', async (req, res) => {
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

module.exports = router
