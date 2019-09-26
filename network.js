//Import Hyperledger Fabric 1.4 programming model - fabric-network
'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');

//connect to the config file
const configPath = path.resolve(__dirname, 'deployment', 'connection-org1.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;
// let userName = config.userName;
let gatewayDiscovery = config.gatewayDiscovery;
let appAdmin = config.appAdmin;
let orgMSPID = config.orgMSPID;

// connect to the connection file
const ccpPath = path.resolve(__dirname, 'deployment', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);


const util = require('util');

exports.connectValidatorToNetwork = async function (userName) {

  const gateway = new Gateway();

  console.log("Connect Validator To Network");

  try {
    const walletPath = path.join(process.cwd(), 'wallet/validators');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    console.log('userName: ');
    console.log(userName);

    /*console.log('wallet: ');
    console.log(util.inspect(wallet));
    console.log('ccp: ');
    console.log(util.inspect(ccp));*/
    // userName = 'V123412';
    const userExists = await wallet.exists(userName);
    if (!userExists) {
      console.log('An identity for the validator ' + userName + ' does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      let response = {};
      response.error = 'An identity for the validator ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
      return response;
    }

    console.log('before gateway.connect: ');

    //await gateway.connect(ccp, { wallet, identity: userName, discovery: true});
    await gateway.connect(ccpPath, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });
    // Connect to our local fabric
    const network = await gateway.getNetwork('mychannel1');

    console.log('Connected to mychannel1. ');
    // Get the contract we have installed on the peer
    const contract = await network.getContract('patent');


    let networkObj = {
      contract: contract,
      network: network,
      gateway: gateway
    };

    return networkObj;

  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    let response = {};
    response.error = error;
    return response;
  } finally {
    console.log('Done connecting to network.');
    // gateway.disconnect();
  }
}; 

exports.connectUserToNetwork = async function (userName) {

  const gateway = new Gateway();

  console.log("Connect User To Network");

  try {
    const walletPath = path.join(process.cwd(), 'wallet/users');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    console.log('userName: ');
    console.log(userName);

    /*console.log('wallet: ');
    console.log(util.inspect(wallet));
    console.log('ccp: ');
    console.log(util.inspect(ccp));*/
    // userName = 'V123412';
    const userExists = await wallet.exists(userName);
    if (!userExists) {
      console.log('An identity for the user ' + userName + ' does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      let response = {};
      response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
      return response;
    }

    console.log('before gateway.connect: ');

    //await gateway.connect(ccp, { wallet, identity: userName, discovery: true});
    await gateway.connect(ccpPath, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });
    // Connect to our local fabric
    const network = await gateway.getNetwork('mychannel1');

    console.log('Connected to mychannel1. ');
    // Get the contract we have installed on the peer
    const contract = await network.getContract('patent');


    let networkObj = {
      contract: contract,
      network: network,
      gateway: gateway
    };

    return networkObj;

  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    let response = {};
    response.error = error;
    return response;
  } finally {
    console.log('Done connecting to network.');
    // gateway.disconnect();
  }
}; 

exports.connectToNetwork = async function (userName) {

  const gateway = new Gateway();

  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    console.log('userName: ');
    console.log(userName);

    /*console.log('wallet: ');
    console.log(util.inspect(wallet));
    console.log('ccp: ');
    console.log(util.inspect(ccp));*/
    // userName = 'V123412';
    const userExists = await wallet.exists(userName);
    if (!userExists) {
      console.log('An identity for the user ' + userName + ' does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      let response = {};
      response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
      return response;
    }

    console.log('before gateway.connect: ');

    //await gateway.connect(ccp, { wallet, identity: userName, discovery: true});
    await gateway.connect(ccpPath, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });
    // Connect to our local fabric
    const network = await gateway.getNetwork('mychannel1');

    console.log('Connected to mychannel1. ');
    // Get the contract we have installed on the peer
    const contract = await network.getContract('patent');


    let networkObj = {
      contract: contract,
      network: network,
      gateway: gateway
    };

    return networkObj;

  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    let response = {};
    response.error = error;
    return response;
  } finally {
    console.log('Done connecting to network.');
    // gateway.disconnect();
  }
};

exports.loginUser = async function (userName) {

  try {

    if (await this.isUser(userName)) {
      console.log('An identity for the user ' + userName + ' exists in the wallet');
      return "user";
    }

    if (await this.isValidator(userName)) {
      console.log('An identity for the validator ' + userName + ' exists in the wallet');
      return "validator";
    }

    console.log('An identity for ' + userName + ' doesn\'t exists in the wallet');
    let response = {};
    response.error = 'An identity for ' + userName + ' doesn\'t exist in the wallet';
    return response;

  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    let response = {};
    response.error = error;
    return response;
  } finally {
    console.log('Done connecting to network.');
    // gateway.disconnect();
  }
};

exports.recordPatent = async function (networkObj, inventor, company, description) {
  try {
    console.log('inside recordPatent');

    console.log('before submit');
    //console.log(util.inspect(networkObj));

    let id = inventor + "_" + company + "_" + description;

    let response = await networkObj.contract.submitTransaction('recordPatent', id, inventor, company, description);
    console.log('after submit');

    console.log(response);
    console.log(`Transaction recordPatent has been submitted`);

    await networkObj.gateway.disconnect();

    return response;


  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    return error;
  }
};

exports.validatePatent = async function (networkObj, inventor, company, description) {
  try {
    console.log('inside validatePatent');

    console.log('before submit');
    //console.log(util.inspect(networkObj));

    let id = inventor + "_" + company + "_" + description;

    let response = await networkObj.contract.submitTransaction('validatePatent', id);
    console.log('after submit');

    console.log(response);
    console.log(`Transaction validatePatent has been submitted`);

    await networkObj.gateway.disconnect();

    return response;


  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    return error;
  }
};

exports.queryPatent = async function (networkObj, func, args) {
  try {
    let response = await networkObj.contract.evaluateTransaction(func, args);
    console.log(response);
    console.log(`Transaction ${func} with args ${args} has been evaluated`);

    await networkObj.gateway.disconnect();

    return response;

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    return error;
  }
};

exports.registerUser = async function (username,role){
  //,id, name, surname) {
  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    if(role=="user"){
      if(await this.isUser(username)){
        console.log("User "+username+" already exists");
        return ("AlreadyExists");
      }
      
    }

    if(role=="validator"){
      if(await this.isValidator(username)){
        console.log("Validator "+username+" already exists");
        return ("AlreadyExists");
      }
    }
    
    const registerWalletPath = path.join(process.cwd(), 'wallet/'+role+'s');
    const registerWallet = new FileSystemWallet(registerWalletPath);
    console.log(`Register Wallet path: ${registerWalletPath}`);

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists('admin');
    if (!adminExists) {
      console.log('An identity for the admin user "admin" does not exist in the wallet');
      console.log('Run the enrollAdmin.js application before retrying');
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });
    
    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({ affiliation: 'org1', enrollmentID: username, role: 'client' }, adminIdentity);
    //console.log("secret:",secret);
    
    const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
    //console.log("enrollment:".enrollment.certificate);
    const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
    console.log(userIdentity);
    await registerWallet.import(username, userIdentity);
    console.log('Successfully registered and enrolled '+role+' "'+username+'" and imported it into the wallet');

    // const network = await gateway.getNetwork('mychannel1');

    // console.log('Connected to mychannel1. ');
    // // Get the contract we have installed on the peer
    // const contract = await network.getContract('patent');

    // let response = await contract.submitTransaction('registerUser', id, username, name, lastname);
    // console.log('after submit');

    // console.log(response);
    // console.log(`Transaction recordPatent has been submitted`);

    //await networkObj.gateway.disconnect();

    return "RegisterOK";

  } catch (error) {
    console.error('Failed to register '+role+' "'+username+'":',error);
    //process.exit(1);
  }
};

exports.invoke = async function (networkObj, isQuery, func, args) {
  try {
    console.log('inside invoke');
    //console.log(`isQuery: ${isQuery}, func: ${func}, args: ${args}`);
    //console.log(util.inspect(networkObj));


    // console.log(util.inspect(JSON.parse(args[0])));

    if (isQuery === true) {
      console.log('inside isQuery');

      if (args) {
        console.log('inside isQuery, args');
        console.log(args);
        let response = await networkObj.contract.evaluateTransaction(func, args);
        //console.log(response);
        console.log(`Transaction ${func} with args ${args} has been evaluated`);

        await networkObj.gateway.disconnect();

        return response;

      } else {

        let response = await networkObj.contract.evaluateTransaction(func);
        //console.log(response);
        console.log(`Transaction ${func} without args has been evaluated`);

        await networkObj.gateway.disconnect();

        return response;
      }
    } else {
      console.log('notQuery');
      if (args) {
        console.log('notQuery, args');
        console.log('$$$$$$$$$$$$$ args: ');
        console.log(args);
        console.log(func);
        console.log(typeof args);

        args = JSON.parse(args[0]);

        //console.log(util.inspect(args));
        console.log(args);
        args = JSON.stringify(args);
        console.log(args);
        //console.log(util.inspect(args));
        if (args)

          console.log('before submit');
        console.log(util.inspect(networkObj));
        let response = await networkObj.contract.submitTransaction(func, args);
        console.log('after submit');

        console.log(response);
        console.log(`Transaction ${func} with args ${args} has been submitted`);

        await networkObj.gateway.disconnect();

        return response;


      } else {
        let response = await networkObj.contract.submitTransaction(func);
        console.log(response);
        console.log(`Transaction ${func} with args has been submitted`);

        await networkObj.gateway.disconnect();

        return response;
      }
    }

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    return error;
  }
};

exports.isUser = async function (userName) {

  try {

    const usersWalletPath = path.join(process.cwd(), 'wallet/users');
    const usersWallet = new FileSystemWallet(usersWalletPath);
    console.log(`Users wallet path: ${usersWalletPath}`);
    
    console.log('userName: ');
    console.log(userName);

    const userExists = await usersWallet.exists(userName);

    if (userExists) {
      console.log('An identity for the user ' + userName + ' exists in the wallet');
      return true;
    }

    return false;

  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    let response = {};
    response.error = error;
    return response;
  } 
};

exports.isValidator = async function (userName) {

  try {

    const validatorsWalletPath = path.join(process.cwd(), 'wallet/validators');
    const validatorsWallet = new FileSystemWallet(validatorsWalletPath);
    console.log(`Wallet path: ${validatorsWalletPath}`);

    const validatorsExists =  await validatorsWallet.exists(userName);

    console.log(validatorsExists);

    if (validatorsExists) {
      console.log('An identity for the validator ' + userName + ' exists in the wallet');
      return true;
    }

    return false;

  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    let response = {};
    response.error = error;
    return response;
  } 
};


// exports.loginUser = async function (user) {
//   try {

//     // Create a new file system based wallet for managing identities.
//     const walletPath = path.join(process.cwd(), 'wallet');
//     const wallet = new FileSystemWallet(walletPath);
//     console.log(`Wallet path: ${walletPath}`);

//     // Check to see if we've already enrolled the user.
//     const userExists = await wallet.exists(user);
//     if (!userExists) {
//       console.log('An identity for the user "'+user+'" doesn\'t exists in the wallet');
//       return ("BadUsername");
//     }

//     // Create a new gateway for connecting to our peer node.
//     const gateway = new Gateway();
//     await gateway.connect(ccpPath, { wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });
    
//     // Get the CA client object from the gateway for interacting with the CA.
//     const ca = gateway.getClient().getCertificateAuthority();
//     const userIdentity = gateway.getCurrentIdentity();

//     //console.log(userIdentity);

//     console.log('Successfully logged as user "'+user+'"');

//     return("OK");

//   } catch (error) {
//     console.error('Failed to login user "'+user+'":',error);
//     process.exit(1);
//   }
// }