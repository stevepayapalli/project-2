const internModel = require("../models/internModel")
const mongoose = require("mongoose")
const collegeModel = require("../models/collegeModel")
const validator = require ("email-validator")


const createIntern = async (req,res)=>{
    try{
        const data = req.body
        const collegeName = req.params.name
        const {objectId, name, email,mobile }= data

        if(!objectId){
            return res.status(400).send({status : false, msg : "College Id must be present"})
        }
        
        if(! mongoose.isValidObjectId(objectId)){
            return res.status(400).send({status : false, msg : "Please provide a valid object Id"})
        }
       
        if(!email){
           return res.status(400).send({status: false, msg : "Email is a required field"})
        }

        const verifyEmail = validator.validate(email)

        if(!verifyEmail){
            return res.status(400).send({status : false, msg : "This is not a valid email"})
        }

        let findcollege = await collegeModel.findOne({name : collegeName})

        if(!findcollege){
            return res.status(400).send({status : false, msg : "no college with this name exists"})
        }



        if(findcollege._id == objectId){
            const createIntern = await internModel.create(data)
            return res.status(201).send({status : false, msg : "You have successfully registered", data : createIntern})
        }

    }
    catch(err){
        return res.status(500).send({status : false, err : err.message})
    }
}