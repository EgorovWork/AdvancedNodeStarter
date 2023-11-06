const mongoose = require('mongoose');
const { createClient } = require('redis');
const { promisify } = require('util');

const client = createClient(process.env.REDIS_URL);
client.get = promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function() {
  const key = Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  });
  
  return exec.apply(this, arguments)
}