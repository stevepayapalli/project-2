const collegModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
const url = require("valid-url")

const createCollege = async (req,res)=>{
    try{
        let data = req.body

        const {name, fullName, logoLink} = data

        if(!name){
            return res.status(400).send({status : false, msg : "name is a required field"})
        }

        const namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){1,10}$/g
        
        if(!name.match(namePattern)){
            return res.status(400).send({status : false, msg : "This is not a valid Name"})
        }

        if(!fullName){
            return res.status(400).send({status : false, msg : "fullName is a required field"})
        }

        const fullNamePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,150}$/gi
        
        if(!fullName.match(fullNamePattern)){
            return res.status(400).send({status : false, msg : "This is not a valid full Name"})
        }

        if(!logoLink){
            return res.status(400).send({status : false, msg : "logoLink is a required field"})
        }

        const validateLogoLink = url.isUri(logoLink)

        if(!validateLogoLink){
        return res.status(400).send({status : false, msg : "This is not a valid logoLink"})
        }

        if (!await collegModel.exists({name : data.name})){
            let college = await collegModel.create(data)
            return res.status(201).send({status : true, msg : "Your college has been registered", data : college })
        }else{
            return res.status(400).send({status : false, msg : "this college name is already registered"})
        }
    }
    catch (err){
        return res.status(500).send({status : false, err : err.message})
    }
}








const collegeDetails = async (req,res)=>{
    try {
        let data = req.query
        let {collegeName} = data
         
        if(!collegeName){
             return res.status(400).send({status : false, msg : "College Name is required to perform this action"})
         }

        let namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){1,10}$/g
        
        if(!collegeName.match(namePattern)){
             return res.status(400).send({status : false, msg : "This is not a valid college Name"})
        }
        
        let findcollege = await collegModel.findOne({name : collegeName, isDeleted : false}).select({_id : 1, name : 1, logoLink: 1, fullName: 1})

        if(!findcollege){
            return res.status(400).send({ status: false, msg: "No college with this name exists" })
        }

        let collegeId = findcollege._id

        let candidates = await internModel.find({collegeId : collegeId, isDeleted : false}).select({name : 1, email : 1, mobile : 1})
        
        if(!candidates.length){
            return res.status(400).send({ status: false, msg: "no students from this college has applied yet" })
        }

        let details = {
            name : findcollege.name,
            fullName : findcollege.fullName,
            logoLink : findcollege.logoLink,
            intrests : candidates
        }

        return res.status(200).send({ status: true, data: details })

    } catch (error) {
        
        return res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports = {createCollege, collegeDetails}