const Developer = require("../models/Developer");

const getDevs = async (req,res) => {
    try{
        const devs = await Developer.find(); 
        res.status(200).json(devs);
    }
    catch(error){
        console.log(error);
        res.status(400).json({msg:"Error occured"});
    }
};

module.exports = getDevs;