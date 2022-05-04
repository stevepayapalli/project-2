const mongoose = require ("mongoose")
const objectid = mongoose.Schema.Types.ObjectId

const internModel = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    mobile : {
       type : Number,
       required : true,
       unique : true
    },
    collegeId : {
        type : objectid,
        ref : "College",
        required : true,
    },


})