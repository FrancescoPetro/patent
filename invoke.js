/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, 'deployment', 'connection-org1.json');
async function main() {
//exports.main = async function () {
    try {

        var args = process.argv.slice(2);
        //console.log("MyArgs", myArgs);
        /*if (args.length==0){
            console.log("Please, insert your username and options");
            return;
        }
        var username =  args[0];*/

        var username="validator";
        
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(username);
        if (!userExists) {
            console.log('An identity for the user "'+username+'" does not exist in the wallet');
            console.log('Run the registerUser0.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true }});

        //console.log("gateway connection done",gateway.getCurrentIdentity());

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        //console.log("got network");

        // Get the contract from the network.
        const contract = network.getContract('patent');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        //await contract.submitTransaction('get', 'a');

        /*if(username=="user0"){
            var result = await getFunction(contract,'a');
            console.log('Transaction has been evaluated\nResult: ',result);
        }
        else if(username=="user2"){
            var result = await setFunction(contract,'a',args[1]);
            console.log('Transaction has been submitted');
        }*/

        //await contract.submitTransaction('recordPatent','PAT1','PAT1','PAT1','PAT1','PAT1');
        //console.log('Transaction has been submitted');

        await contract.submitTransaction('initLedger');
        console.log(`Transaction has been evaluated`);
        //return String(result);
        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
};

async function getFunction(contract,id){
    const result = await contract.evaluateTransaction('get',id);
    return String(result);
}

async function setFunction(contract,id,newValue){
    const result = await contract.submitTransaction('set',id,newValue);
}

main();
