/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

 package main

 /* Imports
  * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
  * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
  */
 import (
	 "bytes"
	 "encoding/json"
	 "fmt"
	  
	 "github.com/hyperledger/fabric/core/chaincode/shim"
	 sc "github.com/hyperledger/fabric/protos/peer"
 )
 
type SmartContract struct {
}

 // Define the car structure, with 4 properties.  Structure tags are used by encoding/json library
 type Patent struct {
	Company 		string `json:"company"`
	PatentName   	string `json:"patentname"`
	Description	    string `json:"description"`
	Validation  	string `json:"validation"`
	Hash			string `json:"hash"`
 }

 /*
  * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
  * Best practice is to have any Ledger initialization in separate function -- see initLedger()
  */
 func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	 return shim.Success(nil)
 }
 
 /*
  * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
  * The calling application program has also specified the particular smart contract function to be called, with arguments
  */
 func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
 
	 // Retrieve the requested Smart Contract function and arguments
	 function, args := APIstub.GetFunctionAndParameters()
	 // Route to the appropriate handler function to interact with the ledger appropriately
	 if function == "queryPatent" {
		 return s.queryPatent(APIstub, args)
	 } else if function == "recordPatent" {
		 return s.recordPatent(APIstub, args)
	 } else if function == "queryAllPatents" {
		 return s.queryAllPatents(APIstub)
	 } else if function == "validatePatent" {
		 return s.validatePatent(APIstub, args)
	 }
 
	 return shim.Error("Invalid Smart Contract function name.")
 }
 
 func (s *SmartContract) queryPatent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 1 {
		 return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
 
	 patentAsBytes, _ := APIstub.GetState(args[0])
	 return shim.Success(patentAsBytes)
 }
 
 func (s *SmartContract) recordPatent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 /*if len(args) != 5 {
		 return shim.Error("Incorrect number of arguments. Expecting 5")
	 }
 
	 fmt.Println(args[0]);
 
	 var arg=args[0];*/
 
	 var patent = Patent{Company: args[1], PatentName: args[2], Description: args[3], Validation: "false", Hash: args[4], }
 
	 patentAsBytes, _ := json.Marshal(patent)
	 APIstub.PutState(args[0], patentAsBytes)
	 
	 fmt.Println(args[0]);
 
	 return shim.Success(nil);
 }
 
 func (s *SmartContract) queryAllPatents(APIstub shim.ChaincodeStubInterface) sc.Response {
 
	 startKey := "a"
	 endKey := "z"
 
	 resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
 
	 if err != nil {
		 return shim.Error(err.Error())
	 }
	 defer resultsIterator.Close()
 
	 // buffer is a JSON array containing QueryResults
	 var buffer bytes.Buffer
	 buffer.WriteString("[")
 
	 bArrayMemberAlreadyWritten := false
	 for resultsIterator.HasNext() {
		 queryResponse, err := resultsIterator.Next()
		 if err != nil {
			 return shim.Error(err.Error())
		 }
		 // Add a comma before array members, suppress it for the first array member
		 if bArrayMemberAlreadyWritten == true {
			 buffer.WriteString(",")
		 }
		 buffer.WriteString("{\"Key\":")
		 buffer.WriteString("\"")
		 buffer.WriteString(queryResponse.Key)
		 buffer.WriteString("\"")
 
		 buffer.WriteString(", \"Record\":")
		 // Record is a JSON object, so we write as-is
		 buffer.WriteString(string(queryResponse.Value))
		 buffer.WriteString("}")
		 bArrayMemberAlreadyWritten = true
	 }
	 buffer.WriteString("]")
 
	 fmt.Printf("- queryAllPatents:\n%s\n", buffer.String())
 
	 return shim.Success(buffer.Bytes())
 }
 
 func (s *SmartContract) validatePatent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 1 {
		 return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
 
	 patentAsBytes, _ := APIstub.GetState(args[0])
	 patent := Patent{}
 
	 json.Unmarshal(patentAsBytes, &patent)
	 patent.Validation = "true"
 
	 patentAsBytes, _ = json.Marshal(patent)
	 APIstub.PutState(args[0], patentAsBytes)
 
	 return shim.Success(nil)
 }

 
 // The main function is only relevant in unit test mode. Only included here for completeness.
 func main() {
 
	 // Create a new Smart Contract
	 err := shim.Start(new(SmartContract))
	 if err != nil {
		 fmt.Printf("Error creating new Smart Contract: %s", err)
	 }
 }
 