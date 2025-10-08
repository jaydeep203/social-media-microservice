require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Redis = require("ioredis");
const cors = require("cors");
const helmet = require("helmet")
const postRoutes = require("./routes/post-routes");
const errorHandler = require("./middleware/errorHandler");
const logger =require("./utils/logger");
const {connectToRabbitMQ} = require("./utils/rabbitmq");

const app = express();
const PORT = process.env.PORT || 3002;

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

// ip rate limiting 

//routes 
app.use("/api/posts", (req,res,next)=>{
    req.redisClient=redisClient;
    next();
}, postRoutes);

//Errorhandler
app.use(errorHandler);

async function startServer(){
    try{
        await connectToRabbitMQ();
        app.listen(PORT, () => {
            logger.info(`Post service running on port ${PORT}`);
        });
    }catch(e){
        logger.error("Failed to connect to server");
        process.exit(1);
    }
}

startServer();

//unhandled promise rejections
process.on("unhandledRejection", (reason, promise)=>{
    logger.error("Unhandled Rejection at", promise,"reason:",reason);
});