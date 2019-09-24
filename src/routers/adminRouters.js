const express = require("express");
const addProjectToTrackTime = require("../services/getAllProjectsForAdmin");
const getAllUsersForAdmin = require("../services/getAllUsersForAdmin");
const status = require("../jsonContracts/status");
const Project = require("../models/project");
const router = new express.Router();

router.post('/getAllProjectsForAdmin',async(req,res) => {
    try{
        const year = req.body.year;
        const response = await addProjectToTrackTime(year);
        // console.log(response);

        status.status.code = "0";
        status.status.message = "success";
        const output = Object.assign(response, status);
        res.status(201).send(output)

    }catch(e){
        status.status.code = "-1";
        status.status.message = "Error occurred. Please reach out to development team for details."
        const output = Object.assign(e, status);
        res.status(400).send(output);
    }
})

router.post('/getAllUsersForAdmin',async(req,res) => {
    try{
        const year = req.body.year;
        const response = await getAllUsersForAdmin(year);

        status.status.code = "0";
        status.status.message = "success";
        const output = Object.assign(response, status);
        res.status(201).send(output)

    }catch(e){
        status.status.code = "-1";
        status.status.message = "Error occurred. Please reach out to development team for details."
        const output = Object.assign(e, status);
        res.status(400).send(output);
    }
})

router.post('/approveProjects',async(req,res) => {
    try{
        const projects = req.body.project;
        const year = req.body.year;
        projects.forEach(async(element) => {
            await Project.findOneAndUpdate({ projectNumber: element.projectNumber},element)    
        });

        status.status.code = "0";
        status.status.message = "success";
        res.status(201).send(status)

    }catch(e){
        status.status.code = "-1";
        status.status.message = "Error occurred. Please reach out to development team for details."
        const output = Object.assign(e, status);
        res.status(400).send(output);
    }
})

router.post('/exportProjectToExcel',async(req,res) => {
    try{

    }catch(e){
        status.status.code = "-1";
        status.status.message = "Error occurred. Please reach out to development team for details."
        const output = Object.assign(e, status);
        res.status(400).send(output);
    }
})



module.exports = router;