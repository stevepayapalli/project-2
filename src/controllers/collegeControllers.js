const collegModel = require("../models/collegeModel")

const createCollege = async (req,res)=>{
    try{
        let data = req.body
        if (!await collegModel.exists({name : data.name})){
            let college = await collegModel.create(data)
            return res.status(201).send({status : true, msg : "Your college has been registered", data : college })
        }else{
            return res.status(400).send({status : false, msg : "this college name already is already registered"})
        }
    }
    catch (err){
        return res.status(500).send({status : false, err : err.message})
    }
}





module.exports = {createCollege}