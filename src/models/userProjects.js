const mongoose = require("mongoose");
const uuidv1 = require("uuid/v4");

const userProjectsSchema = new mongoose.Schema({
        sequenceID: {
          type: String,
          default:uuidv1(),
          required:true
        },
        userID: {
          type: String,
          required:true
        },
        projectNumber: {
          type: String,
          required:true
        },
        trackTime: {
            type:Boolean,
            default:false
        }
 
    
},{
    timestamps:true
})

const UserProjects  = mongoose.model('UserProjects', userProjectsSchema);

module.exports = UserProjects;