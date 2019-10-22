docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

# DOCKER UP: PEER1, CLI1
docker-compose -f deployment/docker-compose-peer1.yml up -d
docker-compose -f deployment/docker-compose-cli1.yml up -d

#JOIN CHANNEL
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/var/hyperledger/users/Admin@org1.example.com/msp" peer1.org1.example.com peer channel join -b mychannel.block

#INSTALL CHAINCODE
#docker exec -it cli peer chaincode install -n patentcc -p github.com/chaincode -v v0