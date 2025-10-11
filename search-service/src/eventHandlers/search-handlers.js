const Search = require("../models/Search");
const logger = require("../utils/logger");
const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL);

async function invalidateSearchCache(){
    const keys = await redisClient.keys("searches:*");
    if(keys.length>0){
        await redisClient.del(keys);
    }

}

async function handlePostCreated(event){
    try{
        const newSearchPost = new Search({
            postId:event.postId,
            userId:event.userId,
            content:event.content,
            createdAt:event.createdAt
        });

        await newSearchPost.save();
        await invalidateSearchCache();
        logger.info("Search post created: ", event.postId, ", ", newSearchPost._id.toString());

    }catch(e){
        logger.error(e, "Error handling post creation event");
    }
}

async function handlePostDeleted(event){
    try{

        await Search.findOneAndDelete({postId:event.postId});
        await invalidateSearchCache();
        logger.info("Search post deleted: ", event.postId);


    }catch(e){
        logger.error("Error handling post Deletion event", e);
    }
}

module.exports = {handlePostCreated, handlePostDeleted};