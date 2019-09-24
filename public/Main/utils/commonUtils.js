app.service("commonUtils",['genericSetting','perDimensionSetting',function(genericSetting,perDimensionSetting){
	
	
	/* -------------------- Get TMF Constants -------------------- */
	var tmfConstants = {
			"generic" : genericSetting.getGenericConstants(),
			"dimension" : perDimensionSetting.getDimensionConstants()
	};
	
	this.getTmfConstants = function() {
		return tmfConstants;
	};
	
	/* -------------------- Show the model for Success, Error and Confirmation -------------------- */   
	this.showModal = function(headerTxt,msg,actionBtn,closeBtn,statusCode){
		var message = [];
		var temp = {
				statusMessage : msg,
				statusCode : statusCode
		};
		message.push(temp);
		modalOptions = {
				closeButtonText: closeBtn,
				actionButtonText: actionBtn,
				headerText: headerTxt,
				bodyText: message
		};
		message = [];
	};
	
	/* -------------------- Date -------------------- */
	this.formatDate =function(date) {
		now = new Date(date);
		year = "" + now.getFullYear();
		month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
		day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
		hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
		minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
		second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
		return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	};
		
	this.setExistingDates = function(date){
		date = new Date(date);
		date = date.getDate()+"-"+getMonth(date.getMonth())+"-"+date.getFullYear();
		return date;
	};

	function getMonth(month){
		if(month==0){
			month = "Jan";
		}else if(month==1){
			month = "Feb";	 
		}else if(month==2){
			month = "Mar";
		}else if(month==3){
			month = "Apr";
		}else if(month==4){
			month = "May";
		}else if(month==5){
			month = "Jun";
		}else if(month==6){
			month = "Jul";
		}else if(month==7){
			month = "Aug";
		}else if(month==8){
			month = "Sep";
		}else if(month==9){
			month = "Oct";
		}else if(month==10){
			month = "Nov";
		}else if(month==11){
			month = "Dec";
		}
		return month;
	};
	
	/* -------------------- Converts to String -------------------- */
	this.convertToString = function(data){
	    if(data != null && data.length>0)
	    data= data.toString();
	    return data;
	};
	   
	/* -------------------- Converts String to Array -------------------- */
	this.convertToArray = function(string){
		var tempstring = string.replace(/\r/g, "");
		tempstring = tempstring.replace(/\n/g, ",");
 		var array = tempstring.split(",");
 		return array;
 	};
 	
 	this.convertListToArray = function(string1,string2){
 		var tempstring1 = string1.replace(/\r/g, "");
 		tempstring1 = tempstring1.replace(/\n/g, ":");
 		var tempstring2 = string2.replace(/\r/g, "");
 		tempstring2 = tempstring2.replace(/\n/g, ":");
 		var array1 = tempstring1.split(":");
 		var array2 = tempstring2.split(":");
 		var array = array2.concat(array1);
 		return array;
 	};
	
}]);