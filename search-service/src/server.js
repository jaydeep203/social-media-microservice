require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Redis = require("ioredis");
const cors = require("cors");
const helmet = require("helmet")
const errorHandler = require("./middleware/errorHandler");
const logger =require("./utils/logger");
const {connectToRabbitMQ, consumeEvent} = require("./utils/rabbitmq");
const searchRoutes = require("./routes/search-routes");
const { handlePostCreated, handlePostDeleted } = require("./eventHandlers/search-handlers");

const app = express();
const PORT = process.env.PORT || 3004;

mongoose.connect(process.env.MONGODB_URL)
    .then(() => logger.info("Connected to mongodb"))
    .catch((e) => logger.error("Mongo connection error", e));

const redisClient = new Redis(process.env.REDIS_URL);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());


app.use((req,res,next)=>{
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
});

//will implement the caching
app.use("/api/search", (req, res, next) => {
    req.redisClient = redisClient;
    next();
},searchRoutes);


app.use(errorHandler);

async function startServer(){
    try{
        await connectToRabbitMQ();

        //consume the events
        await consumeEvent('post.created', handlePostCreated);
        await consumeEvent('post.deleted', handlePostDeleted);

        app.listen(PORT, () => {
            logger.info("Search service is running on ", PORT);
        });

    }catch(e){
        logger.error(e, " Failed to start search service");
        process.exit(1);
    }
}

startServer();