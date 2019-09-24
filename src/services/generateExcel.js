var json2xls = require('json2xls');
const fs = require('fs');
var app = require("../app");
//var date= "time_" + new Date() + ".xlsx";

var json = [];
let convertJSONTOXL = (data) =>{
    //console.log("From convert function",data.toString());
    return new Promise((resolve,reject)=>{
    try {
       // console.log("%^&&()*(&^*()8");
       //console.log(data); 
      // console.log("%%%%%%%%%%%%%%%%%%%^^^^^^^^^^^^^^");
        var test = [{
            "sequenceId" : "1548916527087002474",
            "projectName" : "Test_Lab_TT",
            "projectNumber" : "PRJ-2017-0001112",
            "year" : "2019",
            "userNtId" : "ARakarad",
            "trackTime" : true,
            "user" : "AJEET RAKARADDI",
                "jan" : "60",
                "feb" : "30",
                "mar" : "50",
                "apr" : "30",
                "may" : "60",
                "jun" : "",
                "jul" : "",
                "aug" : "",
                "sep" : "",
                "oct" : "",
                "nov" : "",
                "dec" : ""
            
        },
        {
            "sequenceId" : "1568724297275318766",
            "projectName" : "Surf Rider",
            "projectNumber" : "PRJ-2018-0005418",
            "year" : "2019",
            "userNtId" : "ARakarad",
            "trackTime" : true,
            "user" : "AJEET RAKARADDI",
                "jan" : "80",
                "feb" : "50",
                "mar" : "30",
                "apr" : "40",
                "may" : "80",
                "jun" : "",
                "jul" : "",
                "aug" : "",
                "sep" : "",
                "oct" : "",
                "nov" : "",
                "dec" : ""
           
        },
        {
            "sequenceId" : "1568724309755225741",
            "projectName" : "Test_DF_Project",
            "projectNumber" : "PRJ-2017-0001112",
            "year" : "2019",
            "userNtId" : "ARakarad",
            "trackTime" : true,
            "user" : "AJEET RAKARADDI",
                "jan" : "10",
                "feb" : "30",
                "mar" : "50",
                "apr" : "40",
                "may" : "80",
                "jun" : "",
                "jul" : "",
                "aug" : "",
                "sep" : "",
                "oct" : "",
                "nov" : "",
                "dec" : ""
        },
        {
            "sequenceId" : "1548916518168644115",
            "projectName" : "Surf Rider",
            "projectNumber" : "PRJ-2018-0005427",
            "year" : "2019",
            "userNtId" : "ARakarad",
            "trackTime" : true,
            "user" : "AJEET RAKARADDI",
            "jan" : "80",
            "feb" : "50",
            "mar" : "30",
            "apr" : "40",
            "may" : "80",
            "jun" : "",
            "jul" : "",
            "aug" : "",
            "sep" : "",
            "oct" : "",
            "nov" : "",
            "dec" : ""
        },
        {
            "sequenceId" : "1568724316842388327",
            "projectName" : "Surf Rider",
            "projectNumber" : "PRJ-2017-0001112",
            "year" : "2019",
            "userNtId" : "ARakarad",
            "trackTime" : true,
            "user" : "AJEET RAKARADDI",
            "jan" : "80",
            "feb" : "50",
            "mar" : "30",
            "apr" : "40",
            "may" : "80",
            "jun" : "",
            "jul" : "",
            "aug" : "",
            "sep" : "",
            "oct" : "",
            "nov" : "",
            "dec" : ""
        },
        {
            "sequenceId" : "1568724322812930017",
            "projectName" : "smile",
            "projectNumber" : "PRJ-2017-0001155",
            "year" : "2019",
            "userNtId" : "ARakarad",
            "trackTime" : true,
            "user" : "AJEET RAKARADDI",
            "jan" : "80",
            "feb" : "50",
            "mar" : "30",
            "apr" : "40",
            "may" : "80",
            "jun" : "",
            "jul" : "",
            "aug" : "",
            "sep" : "",
            "oct" : "",
            "nov" : "",
            "dec" : ""
        },
        {
            "sequenceId" : "1557831191979088157",
            "projectName" : "smile",
            "projectNumber" : "PRJ-2017-0001155",
            "year" : "2019",
            "userNtId" : "ARakarad",
            "trackTime" : true,
            "user" : "AJEET RAKARADDI",
            "jan" : "80",
            "feb" : "50",
            "mar" : "30",
            "apr" : "40",
            "may" : "80",
            "jun" : "",
            "jul" : "",
            "aug" : "",
            "sep" : "",
            "oct" : "",
            "nov" : "",
            "dec" : ""
        },
        {
            "sequenceId" : "1568724304088463170",
            "projectName" : "smile",
            "projectNumber" : "PRJ-2017-0001111",
            "year" : "2019",
            "userNtId" : "ARakarad",
            "trackTime" : true,
            "user" : "AJEET RAKARADDI",
            "jan" : "80",
            "feb" : "50",
            "mar" : "30",
            "apr" : "40",
            "may" : "80",
            "jun" : "",
            "jul" : "",
            "aug" : "",
            "sep" : "",
            "oct" : "",
            "nov" : "",
            "dec" : ""
        }];
        
        //var xls = json2xls(JSON.stringify(data));
       // var xls = json2xls(test);  
        resolve(test);  
    } catch (error) {
        resolve(error)
        console.log(error);
    }
})
    
    //fs.writeFileSync('data.xlsx', xls, 'binary');
}

module.exports = { convertJSONTOXL }
