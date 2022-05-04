const collegModel = require("../models/collegeModel")
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
    try {
        let data = req.query
        let {collegeName} = data

        let findcollege = await collegModel.findOne({name : collegeName, isDeleted : false}).select({_id : 1, name : 1, logoLink: 1, fullName: 1})

        if(!findcollege){
            return res.status(400).send({ status: false, msg: "college with this name exists" })
        }

        let collegeId = findcollege._id

        let candidates = await internModel.find({collegeId : collegeId, isDeleted : false}).select({name : 1, email : 1, mobile : 1})
        
        if(!candidates){
            return res.status(400).send({ status: false, msg: "no candidates have applied from this college" })
        }

        let details = {
            name : findcollege.name,
            fullName : findcollege.fullName,
            logoLink : findcollege.logoLink,
            intrests : candidates
        }

        return res.status(400).send({ status: true, data: details })

    } catch (error) {
        
        return res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports = {createCollege, collegeDetails}