const TimeTrackingProjects = require("../models/timeTrackingProjects");
const getTimeTrack = async (year,userId) => {
    
    const timeTrackFilter = {year,userNtId:userId}
    const timeTrack = await TimeTrackingProjects.find(timeTrackFilter)
    // console.log(timeTrack);
    yearList =[];
    const years = await TimeTrackingProjects.find({userNtId:userId},year).select({year:1,_id:0})
    years.forEach((year)=>{
        // console.log(year.year);
        yearList.push(year.year);
        // console.log(yearList);
    })
    const uniqueArray = yearList.filter((item,index)=>{
        return yearList.indexOf(item) === index;
    })
    const monthlyTotal = calculateMonthlyTotal(timeTrack)
    var a ={
        "timetrack":timeTrack,
        "yearList":uniqueArray,
        "monthlyTotal":monthlyTotal
    }
    return a;
    // console.log(a);

}
function calculateMonthlyTotal(timeTrack){
    month = {
        monthlyTotal: {
            "jan":0,
            "feb":0,
            "mar":0,
            "apr":0,
            "may":0,
            "jun":0,
            "jul":0,
            "aug":0,
            "sep":0,
            "oct":0,
            "nov":0,
            "dec":0
        }
    }

    timeTrack.forEach(element => {
        if (element.months.jan !== "") {
            month.monthlyTotal.jan = month.monthlyTotal.jan +parseInt(element.months.jan);
        }
        if (element.months.feb !== "") {
            month.monthlyTotal.feb = month.monthlyTotal.feb +parseInt(element.months.feb);
        }
        if (element.months.mar !== "") {
            month.monthlyTotal.mar = month.monthlyTotal.mar +parseInt(element.months.mar);
        }
        if (element.months.apr !== "") {
            month.monthlyTotal.apr = month.monthlyTotal.apr +parseInt(element.months.apr);
        }
        if (element.months.may !== "") {
            month.monthlyTotal.may = month.monthlyTotal.may +parseInt(element.months.may);
        }
        if (element.months.jun !== "") {
            month.monthlyTotal.jun = month.monthlyTotal.jun +parseInt(element.months.jun);
        }
        if (element.months.jul !== "") {
            month.monthlyTotal.jul = month.monthlyTotal.jul +parseInt(element.months.jul);
        }
        if (element.months.aug !== "") {
            month.monthlyTotal.aug = month.monthlyTotal.aug +parseInt(element.months.aug);
        }
        if (element.months.sep !== "") {
            month.monthlyTotal.sep = month.monthlyTotal.sep +parseInt(element.months.sep);
        }
        if (element.months.oct !== "") {
            month.monthlyTotal.oct = month.monthlyTotal.oct +parseInt(element.months.oct);
        }
        if (element.months.nov !== "") {
            month.monthlyTotal.nov = month.monthlyTotal.nov +parseInt(element.months.nov);
        }
        if (element.months.dec !== "") {
            month.monthlyTotal.dec = month.monthlyTotal.dec +parseInt(element.months.dec);
        }
    });
    month.monthlyTotal.jan = month.monthlyTotal.jan.toString();
    month.monthlyTotal.feb = month.monthlyTotal.feb.toString();
    month.monthlyTotal.mar = month.monthlyTotal.mar.toString();
    month.monthlyTotal.apr = month.monthlyTotal.apr.toString();
    month.monthlyTotal.may = month.monthlyTotal.may.toString();
    month.monthlyTotal.jun = month.monthlyTotal.jun.toString();
    month.monthlyTotal.jul = month.monthlyTotal.jul.toString();
    month.monthlyTotal.aug = month.monthlyTotal.aug.toString();
    month.monthlyTotal.sep = month.monthlyTotal.sep.toString();
    month.monthlyTotal.oct = month.monthlyTotal.oct.toString();
    month.monthlyTotal.nov = month.monthlyTotal.nov.toString();
    month.monthlyTotal.dec = month.monthlyTotal.dec.toString();

    return month;
}

module.exports = getTimeTrack