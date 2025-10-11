const Search = require("../models/Search");
const logger = require("../utils/logger")

const searchPostController = async(req, res)=>{
    logger.info("Search endpoint hit");
    try{
        const {query} = req.query;
        const cacheKey = `searches:${query}`;
        const cachedSearch = await req.redisClient.get(cacheKey);

        if(cachedSearch){
            return res.json(JSON.parse(cachedSearch));
        }

        const results = await Search.find({
            $text : {$search:query}
        },{
            score:{$meta:"textScore"}
        }).sort({score:{$meta:"textScore"}}).limit(10);

        if(!results.length===0){
            return res.status(404).json({
                message:"No posts found related to the search.",
                success:false
            });
        }

        await req.redisClient.setex(cacheKey, 3600, JSON.stringify(results));

        res.json(results);

 
    }catch(e){
        logger.error("Error while searching post", e);
        res.status(500).json({
            success:false,
            message:"Error while searching post"
        });
    }
}

module.exports = {searchPostController};