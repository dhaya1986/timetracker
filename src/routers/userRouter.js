const express = require("express");
const uuidv1 = require("uuid/v4");
const stubJson = require("../jsonContracts/stubJson");
const status = require("../jsonContracts/status");
const getAllUserProjects = require("../services/getAllUserProjectsWithUserId");
const addProjectToTrackTime = require("../services/addProjectToTrackTIme");
const getTimeTrack = require("../services/getTimeTrack")
const UserProjects = require("../models/userProjects");
const Project = require("../models/project");
const TimeTrackingProjects = require("../models/timeTrackingProjects");
const router = new express.Router();
const AdminApprovedProject = require("../services/getAdminApprovedProject");


router.post('/getAllProjectsFromCache', async (req, res) => {
    try {
        const userId = req.body.metadata.userId;
        var temp = { "projects": [] };
        const up = await getAllUserProjects(userId);
        const getAllProjects = async (up) => {
            up.forEach((value) => {
                temp.projects.push(
                    Project.findOneAndUpdate({ projectNumber: value.projectNumber }, { trackTime: value.trackTime }, { new: true })
                        .then((doc) => {
                            // console.log(value.projectNumber);
                            return doc;
                        }).catch((err) => {
                            throw new Error;
                        })
                );
            })
            const resolvedProjects = await Promise.all(temp.projects);
            sendResponse(resolvedProjects);

        }
        getAllProjects(up);
        function sendResponse(resolvedProjects) {
            status.status.code = "0";
            status.status.message = "success";
            temp.projects = resolvedProjects;
            const output = Object.assign(temp, status);
            res.status(201).send(output)
        }

    } catch (e) {
        status.status.code = "-1";
        status.status.message = `Error occurred. Please reach out to development team for details.${e.message}`
        const output = Object.assign(e, status);
        res.status(400).send(output);
    }

})

router.post('/getAllProjectsFromRnD', async (req, res) => {
    try {
        const userId = req.body.metadata.userId;
        stubJson.projects.forEach(async (item) => {
            const projectFilter = { projectNumber: item.projectNumber };
            await Project.findOneAndUpdate(projectFilter, item, {
                setDefaultsOnInsert: true,
                upsert: true
            });

            const userProjectFilter = { userID: userId, projectNumber: item.projectNumber };
            await UserProjects.findOneAndUpdate(userProjectFilter, {
                userID: userId,
                projectNumber: item.projectNumber
            }, {
                    setDefaultsOnInsert: true,
                    upsert: true
                })
        });
        status.status.code = "0";
        status.status.message = "success";
        const output = Object.assign(stubJson, status);
        res.status(201).send(output)

    } catch (e) {
        
        status.status.code = "-1";
        status.status.message = "Error occurred. Please reach out to development team for details."
        const output = Object.assign(e, status);
        res.status(400).send(output);
    }
})

router.post('/addProjectToTrackTime', async (req, res) => {
    try {
        const projectNumbers = req.body.projectNumbers;
        const userId = req.body.metadata.userId;
        await addProjectToTrackTime(projectNumbers, userId, res);
        status.status.code = "0";
        status.status.message = "success";
        res.status(201).send(status)

    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/getTimeTrack', async (req, res) => {
    try {
        const year = req.body.year;
        const userId = req.body.metadata.userId;
        const getTimeTrackResponse = await getTimeTrack(year,userId);
        status.status.code = "0";
        status.status.message = "success";
        const output = Object.assign(getTimeTrackResponse, status);
        res.status(201).send(output)

    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/editTimeTracker', async (req, res) => {
    try {
        const timeTracking = req.body.timeTracking;
        const userId = req.body.metadata.userId;
        
        timeTracking.forEach(async(el) => {
            const timeTrackFilter = {sequenceId:el.sequenceId}
            await TimeTrackingProjects.findOneAndUpdate(timeTrackFilter,el);
        })
        status.status.code = "0";
        status.status.message = "success";
        res.status(201).send(status)

    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/removeProjectsFromTT', async (req, res) => {
    try {
        const timeTracking = req.body.timeTracking;
        const userId = req.body.metadata.userId;
        timeTrackingFilter ={sequenceId:timeTracking.sequenceId}
        TimeTrackingProjects.deleteOne(timeTrackingFilter,(err)=>{
            if(err){
                throw new Error;
            }
        });
        userProjectFilter = {userID:userId,projectNumber:timeTracking.projectNumber}
        UserProjects.updateMany(userProjectFilter,{trackTime:false},(err)=>{
            if(err){
                throw new Error;
            }
        });

        status.status.code = "0";
        status.status.message = "success";
        res.status(201).send(status)

    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/generateExcelReport',async(req,res) => {
    try{
        const year = req.body.year;
        const response = await AdminApprovedProject(year);

        const output = Object.assign(response, status);
       // console.log(output.allUsers);
       const exportData = []
       for(let i =0; i<= output.allUsers.length-1; i++) {

        console.log("ISIDE LOOP : "+ output.allUsers[0].months.jan);
       var excelAttribute =  {
        "UserName" : output.allUsers[i].userName,
        "WWID" : output.allUsers[i].WWID,
        "ProjectName" : output.allUsers[i].projectName,
        "LinkNumber" : output.allUsers[i].linkNumber,
        "DevSite" : output.allUsers[i].devSite,
          "Jan" : output.allUsers[i].months.jan,
          "Feb" : output.allUsers[i].months.feb,
          "Mar" : output.allUsers[i].months.mar,
          "Apr" : output.allUsers[i].months.apr,
          "May" : output.allUsers[i].months.may,
          "Jun" : output.allUsers[i].months.jun,
          "Jul" : output.allUsers[i].monthsjul,
          "Aug" : output.allUsers[i].months.aug,
          "Sep" : output.allUsers[i].months.sep,
          "Oct" : output.allUsers[i].months.oct,
          "Nov" : output.allUsers[i].months.nov,
          "Dec" : output.allUsers[i].months.dec,
          "TotalTime": output.allUsers[i].totalTime
       };
       //console.log("ISIDE 2nd LOOP : " + excelAttribute);
       exportData.push(excelAttribute);

    }
       // console.log(exportData);
      // console.log("ISIDE 3 LOOP : " + exportData);
        res.xls("data.xlsx", exportData);
        //res.status(201).send(output)

    }catch(e){
        status.status.code = "-1";
        status.status.message = "Error Excel not generated."
        const output = Object.assign(e, status);
        res.status(400).send(output);
    }
})
//router.post('/generateExcelReport', AdminApprovedProject)


module.exports = router;