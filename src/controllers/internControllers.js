const internModel = require("../models/internModel")
const mongoose = require("mongoose")
const collegeModel = require("../models/collegeModel")
const validator = require ("email-validator")


const createIntern = async (req,res)=>{
    try{
        const data = req.body
        const { name, mobile, email, collegeName} = data
        
        const findcollege = await collegeModel.findOne({name : collegeName})
        const collegeId = findcollege._id

        const interenData = {
            name, 
            mobile,
            email,
            collegeId
        }

        const findIntern = await internModel.findOne(interenData)

        if(findIntern){
            return res.status(400).send({status : false, msg : "student intern already exists"})
        }

        const createIntern = await internModel.create(interenData)

        if(createIntern){
            return res.status(200).send({status : true, msg : "you have successfully registered", data : createIntern})
        }

       

    }
    catch(err){
        return res.status(500).send({status : false, err : err.message})
    }
}

module.exports = {createIntern}