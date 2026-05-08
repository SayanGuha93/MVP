const PR= require("../models/PR");

const getPR = async (req,res) => {
    try{
        const Prs = await PR.find();
        res.status(200).json(Prs);
    }
    catch(error){
        console.log(error);
        res.status(400).json({msg:"Error occured"});
    }
};

module.exports = getPR;