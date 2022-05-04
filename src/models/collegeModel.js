const mongoose = require("mongoose")

const collegeSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    fullName : {
        type : String,
        validate: {
            validator: function(value) {
              const urlPattern = /(http|https):\/\/(\w+:{0,1}\w*#)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%#!\-/]))?/;
              const urlRegExp = new RegExp(urlPattern);
              return value.match(urlRegExp);
            },
            message: props => `${props.value} is not a valid URL`
          },
        required : true,
    },
    logoLink : {
        type : String,
        required : true
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
})

module.exports = new mongoose.model('College', collegeSchema)