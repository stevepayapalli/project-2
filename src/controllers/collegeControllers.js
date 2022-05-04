const collegModel = require("../models/collegeModel")

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
            return res.status(400).send({status : false, msg : "logLink is a required field"})
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





module.exports = {createCollege}