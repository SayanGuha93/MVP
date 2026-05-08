const Deployment = require("../models/Deployment");

const getDeployments = async (req,res) => {
    try{
        const deploys = await Deployment.find(); 
        res.status(200).json(deploys);
    }
    catch(error){
        console.log(error);
        res.status(400).json({msg:"Error occured"});
    }
};

module.exports = getDeployments;