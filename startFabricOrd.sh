docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

# DOCKER UP: ORDERER, KAFKA, COUCHDB, PEER0, CLI0
docker-compose  -f deployment/docker-compose-kafka.yml up -d
docker-compose -f deployment/docker-compose-couchdb.yml up -d
docker-compose -f deployment/docker-compose-peer0.yml up -d
docker-compose -f deployment/docker-compose-cli0.yml up -d

#CREATE CHANNEL
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/var/hyperledger/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel create -o orderer0.example.com:7050 -c mychannel -f /var/hyperledger/configs/channel.tx

#JOIN CHANNEL
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/var/hyperledger/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel join -b mychannel.block

#INSTALL CHAINCODE
#docker exec -it cli peer chaincode install -n patent -p github.com/chaincode/patent -v v0.9

#INSTANTIATE CHAINCODE
#docker exec -it cli peer chaincode instantiate -o orderer0.example.com:7050 -C mychannel -n patent github.com/chaincode/patent -v v0 -c '{"function":"initLedger","Args":[]}'

# docker exec \
# -e "CORE_PEER_LOCALMSPID=Org1MSP" \
# -e "CORE_PEER_MSPCONFIGPATH=/var/hyperledger/users/Admin@org1.example.com/msp" \
# peer0.org1.example.com peer \ 
# channel create \
# -o orderer0.example.com:7050 \
# -c mychannel \
# -f /var/hyperledger/configs/channel.tx

# docker exec \
# -e "CORE_PEER_LOCALMSPID=Org1MSP" \
# -e "CORE_PEER_MSPCONFIGPATH=/var/hyperledger/users/Admin@org1.example.com/msp" \
# peer0.org1.example.com 
# peer channel join \
# -b mychannel.block


# echo "Installing smart contract on peer0.org1.example.com"
# docker exec \
#   cli \
#   peer chaincode install \
#     -n patent \
#     -v 0 \
#     -p github.com/chaincode/patent \
#     -l go

# echo "Instantiating smart contract on mychannel"
# docker exec \
#   cli \
#   peer chaincode instantiate \
#     -o orderer.example.com:7050 \
#     -C mychannel \
#     -n patent \
#     -l go \
#     -v 0 \
#     -c '{"Args":[]}' \
#     github.com/chaincode/patent

#docker exec -it cli peer chaincode upgrade -C mychannel -n patent -p github.com/chaincode/patent -v v0.9 -c '{"Args":[]}'