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

function getLocationData(array) {
    let data = {};
    let dates = array[0].slice(-5);
    let flavors = [];
    let index = array[1].indexOf("");
    while (index !== -1) {
        flavors.push(array[1][index + 1]);
        index = array[1].indexOf("", index + 1);
    }
    for (let i = 0; i < flavors.length; i++) {
        data[dates[i]] = flavors[i];
    }
    return data;
}

// culvers/schedule?locations=loc-1,loc-2
router.get('/schedule', async (req, res) => {
    const locations = req.query.locations.split(',');
    const selectors = ['h3', 'a'];
    const scheduleData = {};

    try {
        // Use Promise.all to wait for all scrape operations to finish
        await Promise.all(locations.map(async (element) => {
            const url = 'https://www.culvers.com/restaurants/' + element + '?tab=current';
            try {
                const data = await scrape(url, selectors);
                scheduleData[element] = getLocationData(data);
            } catch (error) {
                console.error(error);
                throw error; // rethrow to be handled by the outer catch
            }
        }));

        // After all data has been scraped, send the response
        res.send(scheduleData);
    } catch (error) {
        // If any error happens, respond with 500 status
        res.sendStatus(500);
    }
});

// culvers/loc-1
router.get('/:location', async (req, res) => {
    const url = 'https://www.culvers.com/restaurants/' + req.params.location + '?tab=current';
    const selectors = ['h3', 'a'];
    scrape(url, selectors)
    .then(data => {
        res.send(getLocationData(data));
    })
    .catch(error => {
        console.error(error);
        res.sendStatus(500);
    });
});

module.exports = router;
