const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();

let css = `
    <style>
        body, html {
            background-color: #1c1b22;
            color: white;
        }
    </style>
`;

router.get('/', async (req, res) => {
    let html = `<h1>Culver's Homepage</h1>`;
    res.send(html + css);
});

async function fetchHTML(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching HTML:', error);
        return null;
    }
}

function extractData(html, selector) {
    const $ = cheerio.load(html);
    const elements = $(selector);

    return elements.map((i, el) => $(el).text()).get();
}

async function scrape(url, selectors) {
    const html = await fetchHTML(url);
    if (!html) return;
    let data = [];
    selectors.forEach(element => {
        data.push(extractData(html, element));
    });
    return data;
}

router.get('/:location', async (req, res) => {
    const url = 'https://www.culvers.com/restaurants/' + req.params.location + '?tab=current';
    const selectors = ['h3', 'a'];
    let location = {};

    scrape(url, selectors)
    .then(data => {
        let dates = data[0].slice(-5);
        let flavors = [];
        let index = data[1].indexOf("");
        while (index !== -1) {
            flavors.push(data[1][index + 1]);
            index = data[1].indexOf("", index + 1);
        }
        for (let i = 0; i < flavors.length; i++) {
            location[dates[i]] = flavors[i];
        }
        res.send(location);
    })
    .catch(error => {
        console.error(error);
        res.sendStatus(500);
    });
});

module.exports = router;
