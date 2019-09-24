const Project = require("../models/project");
const uuidv1 = require("uuid/v4");
const TimeTrackingProjects = require("../models/timeTrackingProjects");
const UserProjects = require("../models/userProjects");
const addProjectToTrackTime = async (projectNumbers, userId, res) => {
    projectNumbers.forEach(async (element) => {
        await Project.findOne({ projectNumber: element })
            .exec()
            .then(async (doc) => {
                // console.log(doc);
                ttProject = createttObject(doc, userId);
                timeTrackingFilter = { projectNumber: element }
                await TimeTrackingProjects.findOneAndUpdate(timeTrackingFilter, ttProject, {
                    setDefaultsOnInsert: true,
                    upsert: true,
                    new: true
                })
                userProjectFilter = {userID:userId,projectNumber:element}
                await UserProjects.findOneAndUpdate(userProjectFilter,{trackTime:true},{
                    setDefaultsOnInsert: true,
                    new: true
                })
            }).catch((e)=>{
                throw new Error
            })
    });

}
function createttObject(doc, userId) {
    tempObj = {};
    tempObj.sequenceId = uuidv1();
    tempObj.projectName = doc.projectName;
    tempObj.projectNumber = doc.projectNumber;
    tempObj.year = new Date().getFullYear();
    tempObj.trackTime = true;
    tempObj.userNtId = userId;
    // console.log(userId);
    tempObj.user = {};
    tempObj.user.userID = userId;
    return tempObj;

};
module.exports = addProjectToTrackTime