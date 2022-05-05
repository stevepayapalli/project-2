const internModel = require("../models/internModel.js")
const collegeModel = require("../models/collegeModel.js")
const validator = require ("email-validator")



const createIntern = async (req,res)=>{
    try{
        const data = req.body
        const { name, mobile, email, collegeName} = data // destructuring the required fields from data

        if(!name){
            return res.status(400).send({status : false, msg : "name is required field"})
        } // response in case no name as been present

        let namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,24}$/gi // creating a pattern for valid name with regex
        
        if(!name.match(namePattern)){ //in case the name from the data does not match our pattern
            return res.status(400).send({status : false, msg : "This is not a valid Name"})
        } // this will be our response

        if(!email){
            return res.status(400).send({status : false, msg : "email is a required field"})
        } // our response in case no email has been provied
/*
        const emailPattern = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})/
        if(!email.match(emailPattern)){
            return res.status(400).send({status : false, msg : "This is not a valid email"})
        }        //emial validations with regex
*/      
        const validEmail = validator.validate(email) // using email-validator to validate the recieved email
        if(!validEmail){
            return res.status(400).send({status : false, msg : "this email is not valid"})
        } // our response in case it's an invalid email

        let findEmail = await internModel.findOne({email : email}) // in case our email is valid, then we check if it's already being used by some user

        if(findEmail){
            return res.status(400).send({status : false, msg : "a user with this email already exist"})
        } // in case we found an intern with this email, this will be our response
        
        if(!mobile){ // in case no mobile number has been passed
            return res.status(400).send({status : false, msg : "Mobile is a required field and can not be empty"})
        }
        const mobiles = mobile.replace(/\s+/g, '') // removing space from in between in case we recieved (+91 9876543212)

        const mobilePattern = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/g // declaring valid phone number pattern
       
        if(!mobiles.match(mobilePattern)){ // matching the number we recieved in data with the valid pattern
            return res.status(400).send({status : false, msg : "This is not a valid Mobile Number"})
        } // our response in case, the number does not match the valid pattern

        let findMobile = await internModel.findOne({mobile : mobile}) // in case number is a valid one, then we try to check is it's already being used

        if(findMobile){
            return res.status(400).send({status : false, msg : "a user with this mobile already exist"})
        } // our response in case the number is already being used by someone
        
        if(!collegeName){
            return res.status(400).send({status : false, msg : "college name is a required field"})
        } // our response in case there was no college name provided
            
        const findcollege = await collegeModel.findOne({name : collegeName}) // checking for the college if any with that name exists
        if(!findcollege){
            return res.status(400).send({status : false, msg : "no college with this name exists"})
        }// our response in case no college with that name exists

        if(findcollege.isDeleted === true){ //checking if the found college is deleted or not
            return res.status(400).send({status : false, msg : "This college is no longer with us"})
        } // our response in case the college with that name has been set to deleted

        const collegeId = findcollege._id // storing the id of the college we found in collegeId variable

        const internData = {
            name, 
            mobile,
            email,
            collegeId
        } //creating new intern Data from all the above

        const findIntern = await internModel.findOne(internData) // trying to find an user with this new data in db

        if(findIntern){
            return res.status(400).send({status : false, msg : "student intern already exists"})
        } // our response in case we found a student with the same data in db
         
        const createIntern = await internModel.create(internData) //creating a new intern in case we don not found any with the given data

        if(createIntern){
            return res.status(201).send({status : true, msg : "you have successfully registered", data : createIntern})
        }// our response upon creating the intern successfully

    }
    catch(err){
        return res.status(500).send({status : false, err : err.message})
    }
}

module.exports = {createIntern}