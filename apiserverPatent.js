var express = require('express');
var bodyParser = require('body-parser');
var Blob = require('node-blob');
var fetch = require('node-fetch');
var FileSaver = require('file-saver');

// var crypto = require('crypto');
// var shasum = crypto.createHash('md5');

var cors = require('cors')
// var originsWhitelist = [
//     'http://localhost:4200',      //this is my front-end url for development
//     'http://192.168.100.168:4200'
//   ];

var corsOptions = {
    origin: '*',
    optionSuccessStatus: 200

};

var app = express();

// var corsOptions = {
//     origin: function(origin, callback){
//           var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
//           callback(null, isWhitelisted);
//     },
//     credentials:true
//   }
//   //here is the magic

app.use(cors(corsOptions));

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

function isValidString(...params) {
    var tester = /^\s*$/;
    console.log('params:');
    for (var param of params) {
        // console.log(param);
        if (!param || tester.test(param)) {
            return false;
        }
    }

    return true;
}

app.get('/test/filetest', async (req, res) => {

    try {
        var fs = require('fs');

        var data = fs.readFileSync(process.cwd() + "/text.txt", 'base64');
        var hash = require('crypto').createHash('md5').update(data, 'base64').digest('hex');
        var stats = fs.statSync(process.cwd() + "/text.txt");

        console.log("data:", data);
        console.log("hash:", hash)
        console.log("stats:", stats);

        res.status(200).json("OK");

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        //process.exit(1);
    }

});

app.get('/test/apitest', async (req, res) => {

    try {

        var param = "";
        console.log(param);
        if (isValidString(param)) {
            res.status(200).json("OK");
        }

        else
            res.status(400).json("BadRequest");


    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        //process.exit(1);
    }

});

app.get('/test/hash/:stringprova', async (req, res) => {

    try {
        let data = req.params.stringprova;

        console.log(data);

        let result = require('crypto').createHash('md5').update(data, 'utf8').digest('hex');
        console.log(result);
        let invokepath = path.resolve(__dirname, 'invoke.js');
        let str = fs.readFileSync(invokepath, 'base64');

        console.log(str);

        let blob = new Blob([str], { type: 'application/json' });
        fetch("data:application/json;base64," + str)
            .then(function (resp) { return resp.blob() })
            .then(function (blob) {
                FileSaver.saveAs(blob, 'foo.json')
            });

        // let blobPath = path.resolve(__dirname, 'deployment/foo.js');

        // FileSaver.saveAs(blob,blobPath);
        console.log(blob);

        res.status(200).json({ response: "OK", result });


    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
    }

});

app.get('/api/queryall/:username', async (req, res) => {

    try {

        //console.log("USERNAME:",req.body.username)

        // console.log("IDNUM", network.getIdNum());
        // network.incIdNum();
        // console.log("IDNUM++", network.getIdNum());

        let username = req.params.username;
        if (!isValidString(username)) {
            return res.status(400).json({ response: "BadUsername" });
            
        }

        let isValidator = await network.isValidator(username);
        if (!isValidator) {
            return res.status(401).json({ response: "BadUsername" });
            
        }
        else {

            let networkObj = await network.connectValidatorToNetwork(username);

            let response = await network.invoke(networkObj, true, 'queryAllPatents', '');

            //let response = await invoke.main();
            var date = new Date();
            var current_hour = date.getHours();
            if (current_hour < 10) current_hour = "0" + current_hour;
            var current_mins = date.getMinutes();
            if (current_mins < 10) current_mins = "0" + current_mins;
            var current_secs = date.getSeconds();
            if (current_secs < 10) current_secs = "0" + current_secs;

            console.log("Time:", current_hour + ":" + current_mins + ":" + current_secs);
            console.log("Client ip:", req.ip);
            //res.status(200).json({ response: String(response) });
            
            let parsedResponse = await JSON.parse(response);
            let jsonResp=[];


            for(let i=0;i<parsedResponse.length;i++){
                if(parsedResponse[i].Record.validation=='false'){
                    jsonResp.push(parsedResponse[i]);
                    
                }
            }

            //res.send(parsedResponse);
            return res.status(200).json(jsonResp)
        }
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
        if (!isValidString(username)) {
            return res.status(400).json({ response: "BadUsername" });

        }

        let isUser = await network.isUser(username);

        if (!isUser) {
            return res.status(401).json({ response: "BadUsername" });

        }

        else {
            let networkObj = await network.connectUserToNetwork(username);

            //console.log('req.body', req.body);
            let company = req.body.company;
            let patentname = req.body.name;
            let description = req.body.description;
            let hash = req.body.fileInfo;
            console.log("company: ",company);
            console.log("patentname: ",patentname);
            console.log("description: ",description);
            console.log("hash: ",hash);

            if (!isValidString(company, patentname, description, hash)) {
                return res.status(400).json({ response: "BadContent" });

            }

            let response = await network.recordPatent(networkObj, company, patentname, description, hash);

            if (response == "RecordOK") {
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

                return res.status(200).json({ response: String("RecordOK") });
                //let parsedResponse = await JSON.parse(response);
                //res.send(parsedResponse);
            }
            else{
                return res.status(500).json({ error: response });
            }
            
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
        if (!isValidString(username)) {
            return res.status(400).json({ response: "BadUsername" });

        }

        let isValidator = await network.isValidator(username);

        if (!isValidator) {
            return res.status(401).json({ response: "BadUsername" });

        }
        else {
            let networkObj = await network.connectValidatorToNetwork(username);
            console.log('req.body', req.body);

            console.log('req.body.Record', req.body.Record);
            console.log('req.body.Key', req.body.Key);

            let key=req.body.Key;
            let company = req.body.Record.company;
            let patentname = req.body.Record.patentname;
            let description = req.body.Record.description;

            if (!isValidString(company, patentname, description,key)) {
                return res.status(400).json({ response: "BadContent" });
            }

            let response = await network.validatePatent(networkObj, key);

            if (response == "ValidationOK") {
                var date = new Date();
                var current_hour = date.getHours();
                if (current_hour < 10) current_hour = "0" + current_hour;
                var current_mins = date.getMinutes();
                if (current_mins < 10) current_mins = "0" + current_mins;
                var current_secs = date.getSeconds();
                if (current_secs < 10) current_secs = "0" + current_secs;

                console.log("Time:", current_hour + ":" + current_mins + ":" + current_secs);
                console.log("Client ip:", req.ip);
                return res.status(200).json({ response: String("ValidationOK") });

            }
            else {
                return res.status(500).json({ error: response });

            }
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

        console.log(response)

        if (response == "AlreadyExists") {
            return res.status(409).json({ response: "AlreadyExists" });
        }
        else if (response == "RegisterOK") {
            return res.status(200).json({ response: String(response) });
        }
        else {
            return res.status(500).json({ error: response });
        }

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return res.status(500).json({ error: error });
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