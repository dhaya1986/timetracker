const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectName: {
      type: String
    },
    projectNumber: {
      type: String,
      required:true
    },
    projectLeaderNtId: {
      type: String
    },
    createdDate: {
      type: String
    },
    projectStatus: {
      type: String
    },
    formulaStatus: {
      type: String
    },
    description: {
      type: String
    },
    pl: {
      type: String
    },
    linkNumber: {
      type: String
    },
    devSite: {
      type: String
    },
    technology: {
      type: String
    },
    allUsersAnnualTotal: {
      type: String
    },
    projectTotal: {
      type: String
    },
    year: {
      type: String
    },
    trackTime: {
      type: Boolean,
      default:false
    },
    adminApprove: {
      type: Boolean,
      default:false
    },
    projectLeader: {
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
      role: {
        type: Array
      }
    }
  },{
    timestamps:true
})

const Project  = mongoose.model('Project', projectSchema);

module.exports = Project;