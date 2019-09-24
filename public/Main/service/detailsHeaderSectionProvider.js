/*
 * ========================================================================
 * DetailsProvider    Added by Nagesh with ref to IS Integration for Profiles  08-11-1017   
 * 				                
 * ========================================================================
 */

app.service("detailsHeaderSectionProvider", function($http,$window,$state,$rootScope,$q,restProvider,filterProvider,inputRequest,genericSetting,logging) {
		
	//TMF INPUT
    var interfaceInput = {
            "interface_id":"",
            "servicename":"",
            "event_text" : "",
            "interface_instance_id" : "",
            "step_instance_id" : ""
     };

    var skillsConstant = {
			"businessProcesses" : 	convertToArray(genericSetting.getGenericConstants().businessProcesses_multiline,genericSetting.getGenericConstants().businessProcesses1_multiline),
			"analyticalMicro"  : 	convertToArray(genericSetting.getGenericConstants().analytical_Micro_multiline,genericSetting.getGenericConstants().analytical_Micro1_multiline),
			"engineeredProducts"  : convertToArray(genericSetting.getGenericConstants().engineeredProducts_multiline,genericSetting.getGenericConstants().engineeredProducts1_multiline),
			"formulatedProcesses"  : 	convertToArray(genericSetting.getGenericConstants().formulatedProcesses_multiline),
			"analyticalMicro"  : 	convertToArray(genericSetting.getGenericConstants().analytical_Micro_multiline,genericSetting.getGenericConstants().analytical_Micro1_multiline),
			"formulatedProducts"  : 	convertToArray(genericSetting.getGenericConstants().formulatedProducts_multiline,genericSetting.getGenericConstants().formulatedProducts1_multiline),
			"otcFranchise"  : 	convertToArray(genericSetting.getGenericConstants().otcFranchise_multiline),
			"otcTechKnowledge"  : 	convertToArray(genericSetting.getGenericConstants().otcTechKnowledge_multiline)
	}; 	
	
	this.getSkillsConstant = function(){
		return skillsConstant;
	};
	
	
	var MyProfOBJ;
	var myProfileJSON={
			"user":{
				"ntId":""
			},
			metadata : {
			     ip : "",
			     userId : $rootScope.loggedInUserWWID,
			     clientType : "",
			     version : "",
			     logging_details :{
			      project : "",
			      interface_id : "",
			      dimension_name : "",
			      dimension_value : "",
			      step_id : "",
			      parent_step_instance_id : "",
			      step_instance_id : "",
			      interface_instance_id : ""
			     }
			    }
	};	   
	
	function getMyProfile(wwid,metaData){
		myProfileJSON.user.ntId = wwid;
    	myProfileJSON.metadata.logging_details = metaData;
    	MyProfOBJ = restProvider.getREST_OBJECT().MY_PROFILE;
		MyProfOBJ.data = myProfileJSON;
		return $http(MyProfOBJ);
	};
	
	this.callMyProfileViewQuery = function(value){
		var deferred = $q.defer();
		interfaceInput.interface_id = "PROFILES_MYPROFILE";
    	interfaceInput.servicename = "MY PROFILES";
    	interfaceInput.event_text = "MY PROFILES initiated.";
		logging.startInterface(interfaceInput).then(function (tmfResponse) {		
			getMyProfile(value,tmfResponse.instance).success(function(response) {
				logging.interfaceReady(tmfResponse.instance);
				deferred.resolve(response);
			});
		});
		return deferred.promise;
	};
	
	var editOBJ="";
	
	function saveProfile(value,metaData){
    	value.metadata.logging_details = metaData;
		editOBJ = restProvider.getREST_OBJECT().MY_EDIT_PROFILE;
		editOBJ.data = value;
		return $http(editOBJ);		  
	};
	
	this.callsaveProfile = function(value){
		var deferred = $q.defer();
		interfaceInput.interface_id = "PROFILES_EDIT";
    	interfaceInput.servicename = "PROFILES EDIT";
    	interfaceInput.event_text = "PROFILES_EDIT initiated.";
		logging.startInterface(interfaceInput).then(function (tmfResponse) {
		saveProfile(value,tmfResponse.instance).success(function(response) {
			logging.interfaceReady(tmfResponse.instance);
			deferred.resolve(response);
		});
		});
		return deferred.promise;
	};
	
	function convertToArray(string1,string2) {
		
		var string='';
		if(string2==undefined){
			string = string1;
		}else{
			string = string1 +  '\n' + string2;
		}
	
        string = string.replace(/\r/g, "");
        string = string.replace(/\n/g, ".");
        var array = string.split(".");
        return array;
    };
    
    this.saveSkills = function(value){
    	var deferred = $q.defer();
    	interfaceInput.interface_id = "PROFILES_ADDSKILLS";
    	interfaceInput.servicename = "PROFILES ADDSKILLS";
    	interfaceInput.event_text = "PROFILES_ADDSKILLS initiated.";
    	logging.startInterface(interfaceInput).then(function (tmfResponse) {
		saveNewSkills(value,tmfResponse.instance).success(function(response) {
			logging.interfaceReady(tmfResponse.instance);
			deferred.resolve(response);
		});
    	});
		return deferred.promise;
	};
	
	var saveOBJ='';
	
	function saveNewSkills(value,metaData){
    	value.metadata.logging_details = metaData;
		saveOBJ = restProvider.getREST_OBJECT().SAVE_NEW_SKILLS;
		saveOBJ.data = value;
		return $http(saveOBJ);		  
	};
    		
});