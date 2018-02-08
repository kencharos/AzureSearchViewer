const express  = require('express');
const bodyParser = require('body-parser')
const http = require('http');
const Search = require('./lib/search').AzureSearchAdaptor

const settings = require("./settings.json")
//const settings = require("./settings.dev.json")

let app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get("/api/hello", (req, res, next) => {
    res.json(["hello"]);
});

// list of services
app.get("/api/services", (req, res, next) => {
    res.json(Object.keys(settings));
});

// index names in a service
app.get("/api/services/:service", (req, res, next) => {
    let service = req.params.service
    new Search(settings[service].url, settings[service].key)
        .indexesAsync()
        .then(result => res.json(result))
        .catch(e => res.status(500).send(e))
});

// search documents in a index
app.post("/api/services/:service/:index/search", (req, res, next) => {
    let service = req.params.service
    let index = req.params.index
    //console.log(req.body)
    new Search(settings[service].url, settings[service].key)
        .search(index, req.body)
        .then(r => res.json(r.raw))
        .catch(e => {console.error(e);res.status(500).send(e)})
});

// add or update documents in a index
app.post("/api/services/:service/:index/update", (req, res, next) => {
    let service = req.params.service
    let index = req.params.index
    new Search(settings[service].url, settings[service].key)
        .addDocumentsAsync(index, req.body)
        .then(results => res.send(`change ${results.length} documents`))
        .catch(e => {console.error(e);res.status(500).send(e)})
});

// remove documents in a index
app.post("/api/services/:service/:index/delete", (req, res, next) => {
    let service = req.params.service
    let index = req.params.index
    new Search(settings[service].url, settings[service].key)
        .deleteDocumentsAsync(index, req.body)
        .then(results => res.send(`delete ${results.length} documents`))
        .catch(e => {console.error(e);res.status(500).send(e)})
});

// host static files in static dir.
app.use(express.static('static'));

// run server.
let server = http.createServer(app);

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);