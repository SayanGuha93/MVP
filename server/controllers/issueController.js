const Issue = require("../models/Issue");

const getIssues= async (req,res) => {
    try{
        const issues = await Issue.find(); 
        res.status(200).json(issues);
    }
    catch(error){
        console.log(error);
        res.status(400).json({msg:"Error occured"});
    }
};

module.exports = getIssues;