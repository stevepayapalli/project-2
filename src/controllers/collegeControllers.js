{const collegModel = require("../models/collegeModel")
const internModel = require("../models/internModel")

const createCollege = async (req,res)=>{
    try{
        let data = req.body

        const {name, fullName, logoLink} = data

        if(!name){
            return res.status(400).send({status : false, msg : "name is a required field"})
        }

        if(!fullName){
            return res.status(400).send({status : false, msg : "fullName is a required field"})
        }

        if(!logoLink){
            return res.status(400).send({status : false, msg : "logoLink is a required field"})
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
    try{
        const data = req.query
        const {collegeName} = data
        
        const findcollege = await collegModel.findOne({name :collegeName})

        if(!findcollege){
            return res.status(400).send({status : false, msg : "no college with this name exists"})
        }

        if(findcollege.isDeleted === true){
            return res.status(404).send({status : false, msg : "This college is no longer with us"})
        }

        const candidates = await internModel.find({collegeId : findcollege._id})

        if(!candidates){
            return res.status(400).send({status : false, msg : "no candiates from this college has yet applied"})
        }

        const finalData = await collegModel.findOneAndUpdate({name : collegeName},{$set :{interests : candidates}}, {new : true, upsert: true})
        
        if(finalData){
            return res.status(200).send({status : true, msg : "here's what we found on your query", data : finalData})
        }
    }
    catch (err){
        console.log(err)
        return res.status(500).send({status : false, err : err.message})
    }
}



module.exports = {createCollege, collegeDetails}}