const { uploadMediaToCloudinary } = require("../utils/cloudinary");
const Media = require("../models/Media");
const logger = require("../utils/logger");

const uploadMedia = async(req, res) => {
    logger.info("Starting media upload");
    try{

        if(!req.file){
            logger.error("No file found. Please add a file and try again!");
            return res.status(400).json({
                success:false,
                message:"No file found. Please add a file and try again!"
            });
        }

        const {originalname, mimetype, buffer} = req.file;
        const userId = req.user.userId;

        logger.info(`File details: name=${originalname}, type=${mimetype}`);
        logger.info(`Uploading to cloudinary starting...`);

        const cloudinaryUplaodResult = await uploadMediaToCloudinary(req.file);
        logger.info(`Cloudinary upload successfully. Public id: ${cloudinaryUplaodResult.public_id}`);

        const newlyCreatedMedia = new Media({
            publicId:cloudinaryUplaodResult.public_id,
            originalName:originalname,
            mimeType:mimetype,
            url:cloudinaryUplaodResult.secure_url,
            userId
        });

        await newlyCreatedMedia.save();

        res.status(201).json({
            success:true,
            mediaId: newlyCreatedMedia._id,
            url:newlyCreatedMedia.url,
            message:"Media uploaded successfully"
        });

    }catch(e){
        logger.error("Error uploading media", e);
        res.status(500).json({
            success:false,
            message:"Error uploading media"
        });
    }

}

const getAllMedias = async(req, res) => {
    try{
        const results = await Media.find({});
        res.json({results});

    }catch(e){
        logger.error("Error fetching media", e);
        res.status(500).json({
            success:false,
            message:"Error fetching media"
        });
    }
}

module.exports = {uploadMedia, getAllMedias};