const TimeTrackingProjects = require("../models/timeTrackingProjects");
const Project = require("../models/project");



const getAllUsersForAdmin = async (year) => {
    const projects = await Project.find({ adminApprove: true });
    var allUsers = { "allUsers": [] };
    await Promise.all(projects.map (async (project) => {
        const timeTrack = await TimeTrackingProjects.find({ projectNumber: project.projectNumber, year })
        timeTrack.map((tt) => {
            const totalTime = getTotalTime(tt.months);
            allUsers.allUsers.push({
                "userName": tt.userNtId,
                "WWID" : tt.userNtId,
                "userName": tt.userNtId,
                "projectName": project.projectName,
                "projectNumber": project.projectNumber,
                "linkNumber": projects.linkNumber ?projects.linkNumber:"",
                "devSite": projects.devSite?projects.devSite:"" ,
                "months":tt.months,
                "totalTime":totalTime.toString()
            })
        })

    }))
    return allUsers;
}


function getTotalTime(months) {
    var monthTemp = 0;
    var total = 0;
    if (months.jan !== "") {
        total += parseInt(months.jan)
        monthTemp += 1
    }
    if (months.feb !== "") {
        total += parseInt(months.feb)
        monthTemp += 1
    }
    if (months.mar !== "") {
        total += parseInt(months.mar)
        monthTemp += 1
    }
    if (months.apr !== "") {
        total += parseInt(months.apr)
        monthTemp += 1
    }
    if (months.may !== "") {
        total += parseInt(months.may)
        monthTemp += 1
    }
    if (months.jun !== "") {
        total += parseInt(months.jun)
        monthTemp += 1
    }
    if (months.jul !== "") {
        total += parseInt(months.jul)
        monthTemp += 1
    }
    if (months.aug !== "") {
        total += parseInt(months.aug)
        monthTemp += 1
    }
    if (months.sep !== "") {
        total += parseInt(months.sep)
        monthTemp += 1
    }
    if (months.oct !== "") {
        total += parseInt(months.oct)
        monthTemp += 1
    }
    if (months.nov !== "") {
        total += parseInt(months.nov)
        monthTemp += 1
    }
    if (months.dec !== "") {
        total += parseInt(months.dec)
        monthTemp += 1
    }

    if(monthTemp ==0){
        monthTemp = 1;
    }

    var temp = total / monthTemp;
    return temp;

}

module.exports = getAllUsersForAdmin
