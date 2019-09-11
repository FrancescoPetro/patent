'use strict';

const { Contract } = require('fabric-contract-api');

class Patent extends Contract {

    async recordPatent(ctx, patentId, inventor, description, company){
        console.log("-----------RECORD PATENT-----------");

        const patent = {
            inventor,
            description,
            company
        };

        let result = await ctx.stub.putState(patentId, Buffer.from(JSON.stringify(parent)));

        console.log(result);

    }

    async queryAllPatents(ctx){
        
        let queryString = {
            selector: {}
          };
      
          let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
          return queryResults;
    }
}

module.exports = Patent;
