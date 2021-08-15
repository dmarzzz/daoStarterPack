const cheerio = require('cheerio')
const fs = require('fs');


module.exports = async function (server) {
    server.get('/api/v0/testget', async function (req, res, next) {
        try {
            const daoName = req.query.daoName
            const simplePage = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="utf-8" />
                <title>XYZ Advocacy DAO</title>
                <meta
                  name="description"
                  content="Get information about your DAO"
                />
                <meta name="author" content="dao man" />
                <style>
                  body {
                    margin: 15px auto;
                    max-width: 650px;
                    line-height: 1.2;
                    font-family: sans-serif;
                    font-size: 2em;
                    color: #fff;
                    background: #444;
                  }
                </style>
              </head>
              <body onload="main()">
                <h1>XYZ Advocacy DAO</h1>
                <p id="output_p"></p>
                <h2> join DAO discord here</h2>
              </body>
            </html>`
            const $ = cheerio.load(simplePage);
            const html = $.html();
            console.log($.html())
            res.status(200).send($.html())
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    })

}