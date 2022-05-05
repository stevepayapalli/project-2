const internModel = require("../models/internModel.js")
const mongoose = require("mongoose")
const collegeModel = require("../models/collegeModel.js")
const validator = require ("email-validator")


const createIntern = async (req,res)=>{
    try{
        const data = req.body
        const { name, mobile, email, collegeName} = data

        if(!email){
            return res.status(400).send({status : false, msg : "email is a required field"})
        }

        if(!name){
            return res.status(400).send({status : false, msg : "name is required field"})
        }

        let namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,24}$/gi
        
        if(!name.match(namePattern)){
            return res.status(400).send({status : false, msg : "This is not a valid Name"})
        }
/*
        const emailPattern = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})/
        if(!email.match(emailPattern)){
            return res.status(400).send({status : false, msg : "This is not a valid email"})
        }        //emial validations with regex
*/
        const validEmail = validator.validate(email)
        if(!validEmail){
            return res.status(400).send({status : false, msg : "this email is not valid"})
        }

        if(!mobile){
            return res.status(400).send({status : false, msg : "Mobile is a required field and can not be empty"})
        }
        const mobiles = mobile.replace(/\s+/g, '')

        const mobilePattern = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/g
        if(!mobiles.match(mobilePattern)){
            return res.status(400).send({status : false, msg : "This is not a valid Mobile Number"})
        } 
        
        if(!collegeName){
            return res.status(400).send({status : false, msg : "college name is a required field"})
        }
            
        const findcollege = await collegeModel.findOne({name : collegeName})
        if(!findcollege){
            return res.status(400).send({status : false, msg : "no college with this name exists"})
        }

        if(findcollege.isDeleted === true){
            return res.status(400).send({status : false, msg : "This college is no longer with us"})
        }

        const collegeId = findcollege._id

        const internData = {
            name, 
            mobile,
            email,
            collegeId
        }

        const findIntern = await internModel.findOne(internData)

        if(findIntern){
            return res.status(400).send({status : false, msg : "student intern already exists"})
        }
        
        const createIntern = await internModel.create(internData)

        if(createIntern){
            return res.status(201).send({status : true, msg : "you have successfully registered", data : createIntern})
        }

    }
    catch(err){
        return res.status(500).send({status : false, err : err.message})
    }
}

module.exports = {createIntern}