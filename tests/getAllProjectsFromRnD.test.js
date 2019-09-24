const request = require('supertest');
const app = require("../src/app");

const UserProjects = require("../src/models/userProjects");
const Project = require("../src/models/project");
const TimeTrackingProjects = require("../src/models/timeTrackingProjects");
beforeAll(async()=>{
    await UserProjects.deleteMany();
    await Project.deleteMany();
    await TimeTrackingProjects.deleteMany();
})


test("loads data from RnD", async ()=>{
    await request(app).post('/getAllProjectsFromRnD').send({
        "metadata":{
            "userId": "admin1"
        }
    }).expect(201)
})

test("fails to loads data from RnD", async ()=>{
    await request(app).post('/getAllProjectsFromRnD').send({}).expect(400)
})

