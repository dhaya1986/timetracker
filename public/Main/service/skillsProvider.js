/*
 * ========================================================================
 * DetailsProvider    Added by Nagesh with ref to IS Integration for Profiles  08-11-1017   
 * 				                
 * ========================================================================
 */

app.service("skillsProvider", function($http,$window,$state,$rootScope,$q,restProvider,filterProvider,inputRequest,genericSetting,logging) {
	//TMF INPUT
    var interfaceInput = {
            "interface_id":"",
            "servicename":"",
            "event_text" : "",
            "interface_instance_id" : "",
            "step_instance_id" : ""
     };

    var skillsLevelConstant = {
			"Skill Level"  : 	convertToArray(genericSetting.getGenericConstants().skillLevel_multiline)
	}; 
	
	var skillsRegionConstant = {
				"Region"  : 	convertToArray(genericSetting.getGenericConstants().region_multiline)
	}; 

	this.getSkillsLevelConstant = function(){
		return skillsLevelConstant;
	};
	
	this.getSkillsRegionConstant = function(){
		return skillsRegionConstant;
	};

	var skillsSearchFilterOBJ = "";
	
	function skillsSearchFilter(value,metaData){
    	value.metadata.logging_details = metaData;
		skillsSearchFilterOBJ = restProvider.getREST_OBJECT().GET_SKILLS_SEARCH_FILTER;
		if(value.criteriaList){
			if(value.criteriaList.length==0){
					value.criteriaList =null;
			}
		}
		skillsSearchFilterOBJ.data = value ;
		return $http(skillsSearchFilterOBJ);
	};
	
	this.getSkillsSearchFilter = function(value){
		var deferred = $q.defer();
		interfaceInput.interface_id = "PROFILES_SKILL_SEARCH";
    	interfaceInput.servicename = "PROFILES SKILL SEARCH";
    	interfaceInput.event_text = "PROFILES_SKILL_SEARCH initiated.";
		logging.startInterface(interfaceInput).then(function (tmfResponse) {
		skillsSearchFilter(value,tmfResponse.instance).success(function(response) {
			logging.interfaceReady(tmfResponse.instance);
			$rootScope.$broadcast('skillsApplyFilter', {
                data: response,
            });
		});
		});
		return deferred.promise;
	};
	function convertToArray(string1) {
			var string=string1;
	        string = string.replace(/\r/g, "");
	        string = string.replace(/\n/g, ".");
	        var array = string.split(".");
	        return array;
	 };
	
});