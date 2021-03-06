const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = process.argv.slice(2)[0];
const app = express();
app.use(bodyParser.json());

app.get('/refreshData', (req, res) => {
  console.log('Fetching data from yFinance and storing in object storage.');
  res.status(200).send("DATA HAS BEEN REFRESHED");
});

app.post('/postExample/**', (req, res) => {
    const heroId = parseInt(req.params[0]);
    //const foundHero = heroes.find(subject => subject.id === heroId);
    const foundHero = [];
    if (foundHero) {
        for (let attribute in foundHero) {
            if (req.body[attribute]) {
                foundHero[attribute] = req.body[attribute];
                console.log(`Set ${attribute} to ${req.body[attribute]} in hero: ${heroId}`);
            }
        } 
        res.status(202).header({Location: `http://localhost:${port}/hero/${foundHero.id}`}).send(foundHero);
    } else {
        console.log(`Hero not found.`);
        res.status(404).send();
    }
});

console.log(`Market Index service listening on port ${port}`);
app.listen(port);