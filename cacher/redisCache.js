const { createClient } = require('redis');
const { promisify } = require('util');

const client = createClient(process.env.REDIS_URL);
client.hget = promisify(client.hget);

const findCache = async (id, DataBase, cacheName) =>{
  const cashedBlogs = await client.hget(cacheName, id);
  if (cashedBlogs){
    console.log('From CACHE');
    return JSON.parse(cashedBlogs)
  }
  const blogs = await DataBase.find({ _user: id });
  console.log('From MONGODB');
  client.hset(cacheName, id, JSON.stringify(blogs));
  return blogs
}

module.exports = {
  findCache
}