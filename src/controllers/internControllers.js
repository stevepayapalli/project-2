const internModel = require("../models/internModel.js")
const mongoose = require("mongoose")
const collegeModel = require("../models/collegeModel.js")
const validator = require ("email-validator")
const {phone} = require('phone');


const createIntern = async (req,res)=>{
    try{
        const data = req.body
        const { name, mobile, email, collegeName} = data

        if(!email){
            return res.status(400).send({status : false, msg : "email is a required field"})
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

        const mobiles = mobile.trim()
        
        if(mobiles !== true){
            return res.status(400).send({status : false, msg : "This is not a valid mobile number"})
        }
            
        const findcollege = await collegeModel.findOne({name : collegeName})
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