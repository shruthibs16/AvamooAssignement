const express = require('express');
const file = 'http://norvig.com/big.txt';
const api = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?lang=en-en&key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&text=`;
const server = express();

server.get('/searchTheDoc', async (req, res) => {
    let word = req.query.word;
    fetchSearchedWord(word, res);
});

function fetchSearchedWord(word, res) {
    var request = require('request');
    request.get(file, (error, resp, body) => {
        if (error) {
            res.status(400).send({ message: "error while reading norvig file." });
        } else if (body) {
            regex = new RegExp(word, 'g');
            let count = 0;
            if (word) {
                count = body.match(regex).length;
                let url = api + word;
                request.get(url, (err, response1, data) => {
                    if (err) {
                        res.status(400).send(err);
                    }
                    if (data) {
                        let result = JSON.parse(data);
                        res.status(200).send({ count: count, topTenWords: top10Words(body), tr: result.def.length > 0 ? result.def[0].tr : [] })

                    } else {
                        res.status(400).send({ message: "no response from api" });
                    }
                });
            } else {
                res.status(200).send({ count: count, topTenWords: top10Words(body) });
            }
        } else {
            res.status(200).send({ message: "no content in file to search." });
        }

    });
}
function top10Words(string) {
    var obj = {};
    string.split(" ").forEach(function (el, i, arr) {
        obj[el] = obj[el] ? ++obj[el] : 1;
    });
    let keysSort = Object.keys(obj).sort(function (a, b) { return obj[a] - obj[b] })
    let top10Array = [];
    for (i = keysSort.length - 1; i > keysSort.length - 10; i--) {
        top10Array.push({ [keysSort[i]]: obj[keysSort[i]] });
    }
    return top10Array;
}

var app = server.listen(7000, () => {
    console.log('app is listening the port ' + 7000);
});