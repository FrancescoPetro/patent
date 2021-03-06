docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

# DOCKER UP: ORDERER, KAFKA, COUCHDB, PEER0, CLI0
docker-compose  -f deployment/docker-compose-kafka.yml up -d
docker-compose -f deployment/docker-compose-couchdb.yml up -d
docker-compose -f deployment/docker-compose-peer0.yml up -d
docker-compose -f deployment/docker-compose-cli0.yml up -d

#CREATE CHANNEL
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/var/hyperledger/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel create -o orderer0.example.com:7050 -c mychannel1 -f /var/hyperledger/configs/channel.tx

#JOIN CHANNEL
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/var/hyperledger/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel join -b mychannel1.block

#INSTALL CHAINCODE
#docker exec -it cli peer chaincode install -n patent -p github.com/chaincode/patent -v v2.3

#INSTANTIATE CHAINCODE
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/var/hyperledger/users/Admin@org1.example.com/msp" -it cli peer chaincode instantiate -o orderer0.example.com:7050 -C mychannel1 -n patent github.com/chaincode/patent -v v0 -c '{"function":"initLedger","Args":[]}'

#UPGRADE CHAINCODE (requires installation first)
#docker exec -it cli peer chaincode upgrade -C mychannel1 -n patent -p github.com/chaincode/patent -v v2.3 -c '{"Args":[]}'