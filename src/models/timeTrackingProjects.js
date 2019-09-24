const mongoose = require("mongoose");

const timeTrackingProjectsSchema = new mongoose.Schema({
    sequenceId: {
      type: String,
      required:true
    },
    projectName: {
      type: String
    },
    projectNumber: {
      type: String
    },
    year: {
      type: String
    },
    userNtId: {
      type: String
    },
    trackTime: {
      type: Boolean,
      default:false
    },
    user: {
      userID: {
        type: String
      },
      WWID: {
        type: String
      },
      email: {
        type: String
      },
      firstName: {
        type: String
      },
      fullName: {
        type: String
      },
      lastName: {
        type: String
      },
      ntId: {
        type: String
      },
      region: {
        type: String
      },
      displayName: {
        type: String
      },
      roles: {
        type: Array
      }
    },
    months: {
      jan: {
        type: String,default:""
      },
      feb: {
        type: String,default:""
      },
      mar: {
        type: String,default:""
      },
      apr: {
        type: String,default:""
      },
      may: {
        type: String,default:""
      },
      jun: {
        type: String,default:""
      },
      jul: {
        type: String,default:""
      },
      aug: {
        type: String,default:""
      },
      sep: {
        type: String,default:""
      },
      oct: {
        type: String,default:""
      },
      nov: {
        type: String,default:""
      },
      dec: {
        type: String,default:""
      }
    }
  },{
    timestamps:true
})

const TimeTrackingProjects   = mongoose.model('TimeTrackingProjects', timeTrackingProjectsSchema);

module.exports = TimeTrackingProjects;