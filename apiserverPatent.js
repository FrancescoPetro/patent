var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
// var originsWhitelist = [
//     'http://localhost:4200',      //this is my front-end url for development
//     'http://192.168.100.168:4200'
//   ];
var app = express();

// var corsOptions = {
//     origin: function(origin, callback){
//           var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
//           callback(null, isWhitelisted);
//     },
//     credentials:true
//   }
//   //here is the magic
app.use(cors());

app.use(bodyParser.json());
// Setting for Hyperledger Fabric
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const ccpPath = path.resolve(__dirname, 'deployment', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

let network = require('./network.js');
//let invoke = require('./invoke.js');

app.get('/api/queryall', async (req, res) => {

    try {
        let networkObj = await network.connectToNetwork("alfredo");
        let response = await network.invoke(networkObj, true, 'queryAllPatents', '');
        //let response = await invoke.main();
        var date = new Date();
        var current_hour = date.getHours();
        var current_mins = date.getMinutes();
        if (current_mins < 10) current_mins = "0" + current_mins;
        var current_secs = date.getSeconds();

        console.log("Time:", current_hour + ":" + current_mins + ":" + current_secs);
        console.log("Client ip:", req.ip);
        //res.status(200).json({ response: String(response) });
        let parsedResponse = await JSON.parse(response);
        //res.send(parsedResponse);
        res.status(200).json(parsedResponse)

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        //process.exit(1);
    }

});

app.get('/api/query/:patent_id', async (req, res) => {

    try {
        let networkObj = await network.connectToNetwork("alfredo");
        let response = await network.queryPatent(networkObj, 'queryPatent', req.params.patent_id);

        console.log(req.params.patent_id);

        //let response = await invoke.main();
        res.status(200).json({ response: String(response) });
        //let parsedResponse = await JSON.parse(response);
        //res.send(parsedResponse);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        //process.exit(1);
    }

});

//recordPatent
app.post('/api/recordpatent', async function (req, res) {
    try {

        let username = req.body.username;
        let isUser = await network.isUser(username);

        if (!isUser) {
            res.status(500).json({ response: "BadRequest" });
        }

        else {
            let networkObj = await network.connectUserToNetwork(username);

            console.log('req.body', req.body);

            let inventor = req.body.name;
            let company = req.body.company;
            let description = req.body.description;



            let response = await network.recordPatent(networkObj, inventor, description, company);

            var date = new Date();
            var current_hour = date.getHours();
            if (current_hour < 10) current_hour = "0" + current_hour;
            var current_mins = date.getMinutes();
            if (current_mins < 10) current_mins = "0" + current_mins;
            var current_secs = date.getSeconds();
            if (current_secs < 10) current_secs = "0" + current_secs;

            console.log("response:", response);

            console.log("Time:", current_hour + ":" + current_mins + ":" + current_secs);
            console.log("Client ip:", req.ip);
            res.status(200).json({ response: String("RecordOK") });
            //let parsedResponse = await JSON.parse(response);
            //res.send(parsedResponse);
        }

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        //process.exit(1);
    }
});

//validatepatent

app.put('/api/validatepatent', async function (req, res) {
    try {

        let username = req.body.username;
        let isValidator = await network.isValidator(username);

        if (!isValidator) {
            res.status(500).json({ response: "BadRequest" });
        }
        else {
            let networkObj = await network.connectValidatorToNetwork(username);
            console.log('req.body', req.body);

            console.log('req.body.Record', req.body.Record);

            let inventor = req.body.Record.inventor;
            let company = req.body.Record.company;
            let description = req.body.Record.description;

            let response = await network.validatePatent(networkObj, inventor, description, company);

            var date = new Date();
            var current_hour = date.getHours();
            if (current_hour < 10) current_hour = "0" + current_hour;
            var current_mins = date.getMinutes();
            if (current_mins < 10) current_mins = "0" + current_mins;
            var current_secs = date.getSeconds();
            if (current_secs < 10) current_secs = "0" + current_secs;

            console.log("Time:", current_hour + ":" + current_mins + ":" + current_secs);
            console.log("Client ip:", req.ip);
            res.status(200).json({ response: String("ValidationOK") });
        }
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        //process.exit(1);
    }
});

app.post('/api/registeruser', async function (req, res) {
    try {
        var date = new Date();
        var current_hour = date.getHours();
        if (current_hour < 10) { current_hour = "0" + current_hour; }
        var current_mins = date.getMinutes();
        if (current_mins < 10) { current_mins = "0" + current_mins; }
        var current_secs = date.getSeconds();
        if (current_secs < 10) { current_secs = "0" + current_secs; }

        console.log("Time:", current_hour + ":" + current_mins + ":" + current_secs);
        console.log("Client ip:", req.ip);

        console.log('req.body', req.body);

        let id = req.body.username;
        let role = req.body.role;
        console.log("id", id);

        let response = await network.registerUser(id, role);
        //let response = await invoke.main();

        if (response == "AlreadyExists") {
            res.status(500).json({ response: "AlreadyExists" })
        }
        else {
            res.status(200).json({ response: String(response) });
        }

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        //process.exit(1);
    }
});

app.post('/api/loginuser', async function (req, res) {
    try {

        console.log('req.body', req.body);

        let id = req.body.username;

        let response = await network.loginUser(id);
        //let response = await network.networkConnection(id);

        var date = new Date();
        var current_hour = date.getHours();
        if (current_hour < 10) current_hour = "0" + current_hour;
        var current_mins = date.getMinutes();
        if (current_mins < 10) current_mins = "0" + current_mins;
        var current_secs = date.getSeconds();
        if (current_secs < 10) current_secs = "0" + current_secs;

        console.log("Time:", current_hour + ":" + current_mins + ":" + current_secs);
        console.log("Client ip:", req.ip);

        res.status(200).json({ response: String(response) });
        //let parsedResponse = await JSON.parse(response);
        //res.send(parsedResponse);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        //process.exit(1);
    }
});

app.listen(8080, () => {
    console.log("listening on port 8080");
});