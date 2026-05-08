const Bug = require("../models/Bug");

const getBugs = async (req,res) => {
    try{
        const bugs = await Bug.find(); 
        res.status(200).json(bugs);
    }
    catch(error){
        console.log(error);
        res.status(400).json({msg:"Error occured"});
    }
};

module.exports = getBugs;