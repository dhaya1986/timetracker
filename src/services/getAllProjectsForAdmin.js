const UserProjects = require("../models/userProjects");
const TimeTrackingProjects = require("../models/timeTrackingProjects");
const Project = require("../models/project");

const getAllProjectsForAdmin = async (year) => {
    var output = { "Projects": [] }
    const projects = await UserProjects.find({ trackTime: true }).distinct('projectNumber');
    await Promise.all(projects.map(async (project) => {
        const trackTime = await TimeTrackingProjects.find({ projectNumber: project, year })
        const totalTime = calculateTotalTime(trackTime);
        const actualTime = (totalTime / 100).toString();
        output.Projects.push(await Project.findOneAndUpdate({ projectNumber: project }, { projectTotal: actualTime }, { new: true }))
    })) 
    return output;
}

function calculateTotalTime(trackTime) {
    var total = 0;
    trackTime.forEach((tt) => {
        if (tt.months.jan !== "") {
            total += parseInt(tt.months.jan)
        }
        if (tt.months.feb !== "") {
            total += parseInt(tt.months.feb)
        }
        if (tt.months.mar !== "") {
            total += parseInt(tt.months.mar)
        }
        if (tt.months.apr !== "") {
            total += parseInt(tt.months.apr)
        }
        if (tt.months.may !== "") {
            total += parseInt(tt.months.may)
        }
        if (tt.months.jun !== "") {
            total += parseInt(tt.months.jun)
        }
        if (tt.months.jul !== "") {
            total += parseInt(tt.months.jul)
        }
        if (tt.months.aug !== "") {
            total += parseInt(tt.months.aug)
        }
        if (tt.months.sep !== "") {
            total += parseInt(tt.months.sep)
        }
        if (tt.months.oct !== "") {
            total += parseInt(tt.months.oct)
        }
        if (tt.months.nov !== "") {
            total += parseInt(tt.months.nov)
        }
        if (tt.months.dec !== "") {
            total += parseInt(tt.months.dec)
        }
    })
    return total;

}
module.exports = getAllProjectsForAdmin