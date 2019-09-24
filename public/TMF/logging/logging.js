app.service('logging', [ '$http', '$window','$rootScope','$q', function($http, $window,$rootScope,$q) {
	var TMF_Logging_Header = {
	        "Content-Type":"application/json",
	        "accept":"application/json",
	        "Authorization" : "Basic " + btoa($window.userName+":"+$window.password)
	   };

		var startInterfaceInputData = {  
				"request":{  
				      "project":"CG510_PROFILES",
				      "interface_id":"",
				      "event_text":"",
				      "custom1":"",
				      "custom2":"",
				      "custom3":"",
				      "tn_internal_id":"",
				      "tmf_overwrite":{  
				         "servicename":"",
				         "hostname":"",
				         "username":window.loggedinUserId,
				         "interface_instance_id":"",
				         "step_instance_id":""
				      },
				      "new_interface_instance_id":""
				   }
				};		   
		
		this.getStartInterfaceInputRequest = function() {
			return startInterfaceInputData;
		};
		
		var inferaceReadyInputData = {
				"request" : {
					"project" : "CG510_PROFILES",
					"interface_id" : "",
					"event_text" : "",
					"custom1" : null,
					"custom2" : null,
					"custom3" : null,
					"tn_internal_id" : null,
					"tmf_overwrite" : {
						"servicename" :null,
						"hostname" : null,
						"username" : window.loggedinUserId,
					},
					"instance" : {
						"project" : "CG510_PROFILES",
						"interface_id" : null,
						"dimension_name" : null,
						"dimension_value" : null,
						"step_id" : null,
						"parent_step_instance_id" : null,
						"step_instance_id" : null,
						"interface_instance_id" : null,
					},
				}
		};
		
		this.getInterfaceReadyInputRequest = function() {
			return inferaceReadyInputData;
		};
		
		
		this.startInterface = function(e2eStartInterfaceInputRequest) {
			var deferred = $q.defer();
			startInterfaceInputData.request.interface_id = e2eStartInterfaceInputRequest.interface_id;
			startInterfaceInputData.request.event_text = e2eStartInterfaceInputRequest.event_text;
			startInterfaceInputData.request.tmf_overwrite.servicename = e2eStartInterfaceInputRequest.servicename;
			startInterfaceInputData.request.tmf_overwrite.interface_instance_id = e2eStartInterfaceInputRequest.interface_instance_id;
			startInterfaceInputData.request.tmf_overwrite.step_instance_id = e2eStartInterfaceInputRequest.step_instance_id;
			var httpURL = {
	                url : $window.endpointAddress+"rest/SG001_TMF_Client/pub/external/interfaceStart",
	                method : "POST",
	                data : startInterfaceInputData,
	                withCredentials : true,
	                headers : TMF_Logging_Header
			};
			$http(httpURL).success(function(response) {
				deferred.resolve(response);
			});
			return deferred.promise;
		};
		
		
		this.interfaceReady = function(e2eInterfaceReadyInputRequest) {
			inferaceReadyInputData.request.interface_id = e2eInterfaceReadyInputRequest.interface_id;
			inferaceReadyInputData.request.event_text = e2eInterfaceReadyInputRequest.event_text;
			inferaceReadyInputData.request.instance.interface_id = e2eInterfaceReadyInputRequest.interface_id;
			inferaceReadyInputData.request.instance.interface_instance_id = e2eInterfaceReadyInputRequest.interface_instance_id;
			inferaceReadyInputData.request.instance.step_instance_id = e2eInterfaceReadyInputRequest.step_instance_id;
			
			var httpURL = {
	                url : $window.endpointAddress+"rest/SG001_TMF_Client/pub/external/interfaceReady",
	                method : "POST",
	                data : inferaceReadyInputData,
	                withCredentials : true,
	                headers : TMF_Logging_Header
			};
			var interfaceReadyCall = $http(httpURL);
			interfaceReadyCall.then(function(response) {
			});
		};
		
		var stepStartInputData = {
				"request" : {
					"step_id" :null,
					"event_text" : "",
					"custom1" : "",
					"custom2" : "",
					"custom3" : "",
					"tn_internal_id" : "",
					"tmf_overwrite" : {
						"servicename" : "",
						"hostname" : "",
						"username" : "",
						"step_instance_id" : ""
					},
					"instance" : {
						"project" : "",
						"interface_id" : null,
						"dimension_name" : null,
						"dimension_value" : null,
						"step_id" : "0",
						"parent_step_instance_id" : null,
						"step_instance_id" : null,
						"interface_instance_id" : null,
					},
				}
			};
		
		this.getStepStartInputRequest = function() {
			return stepStartInputData;
		};
		
		var logInfoInputData = {			
				"request" : {
					"event_text" : "",
					"custom1" : "",
					"custom2" : "",
					"custom3" : "",
					"tmf_overwrite" : {
						"servicename" : "",
						"hostname" : "",
						"username" : "",
					},
					"instance" : {
						"project" : "",
						"interface_id" : null,
						"dimension_name" : null,
						"dimension_value" : null,
						"step_id" : null,
						"parent_step_instance_id" : null,
						"step_instance_id" : null,
						"interface_instance_id" : null,
					},
				}
			};						

		this.getLogInfoInputRequest = function() {
			return logInfoInputData;
		};
		
		var logWarningInputData = {			
				"request" : {
					"event_text" : "",
					"custom1" : "",
					"custom2" : "",
					"custom3" : "",
					"tmf_overwrite" : {
						"servicename" : "",
						"hostname" : "",
						"username" : "",
					},
					"instance" : {
						"project" : "",
						"interface_id" : null,
						"dimension_name" : null,
						"dimension_value" : null,
						"step_id" : null,
						"parent_step_instance_id" : null,
						"step_instance_id" : null,
						"interface_instance_id" : null,
					},
				}
			};						

		this.getLogWarningInputRequest = function() {
			return logWarningInputData;
		};
		
		var logErrorInputData = {
				"request" : {
					"event_text" : "",
					"custom1" : "",
					"custom2" : "",
					"custom3" : "",
					"tn_internal_id" : "",
					"tmf_overwrite" : {
						"servicename" : "",
						"hostname" : "",
						"username" : ""
					},
					"instance" : {
						"project" : "",
						"interface_id" : null,
						"dimension_name" : null,
						"dimension_value" : null,
						"step_id" : null,
						"parent_step_instance_id" : null,
						"step_instance_id" : null,
						"interface_instance_id" : null,
					},
					"lastError" :{
						"service" : "",
						"error" : "",
						"time" :"",
						"errorDump" :"",
						"errorType" :"Error",
						"user" : "",
					}
				}
		};
		
		this.getLogErrorInputRequest = function() {
			return logErrorInputData;
		};
		
		var logFatalInputData = {
				"request" : {
					"event_text" : "",
					"custom1" : "",
					"custom2" : "",
					"custom3" : "",
					"tn_internal_id" : "",
					"tmf_overwrite" : {
						"servicename" : "",
						"hostname" : "",
						"username" : ""
					},
					"instance" : {
						"project" : "",
						"interface_id" : null,
						"dimension_name" : null,
						"dimension_value" : null,
						"step_id" : null,
						"parent_step_instance_id" : null,
						"step_instance_id" : null,
						"interface_instance_id" : null,
					},
					"lastError" :{
						"service" : "",
						"error" : "",
						"time" :"",
						"errorDump" :"",
						"errorType" :"Fatal",
						"user" : "",
					}
				}
		};
		

		this.getLogFatalInputRequest = function() {
			return logFatalInputData;
		};
		
		
		var logDebugInputData = {
				"request" : {
					"event_text" : "",
					"custom1" : "",
					"custom2" : "",
					"custom3" : "",
					"tn_internal_id" : "",
					"tmf_overwrite" : {
						"servicename" : "",
						"hostname" : "",
						"username" : ""
					},
					"instance" : {
						"project" : "",
						"interface_id" : null,
						"dimension_name" : null,
						"dimension_value" : null,
						"step_id" : null,
						"parent_step_instance_id" : null,
						"step_instance_id" : null,
						"interface_instance_id" : null,
					}
				}
		};
		
		this.getLogDebugInputRequest = function() {
			return logDebugInputData;
		};
		
		var stepReadyInputData = {
				"request" : {
					"step_id" :"0",
					"event_text" : "",
					"custom1" : "",
					"custom2" : "",
					"custom3" : "",
					"tn_internal_id" : "",
					"tmf_overwrite" : {
						"servicename" : "",
						"hostname" : null,
						"username" : "",
					},
					"instance" : {
						"project" : "",
						"interface_id" : null,
						"dimension_name" : null,
						"dimension_value" : null,
						"step_id" : null,
						"parent_step_instance_id" : null,
						"step_instance_id" : null,
						"interface_instance_id" : null,
					},
				}
			};
		
		this.getStepReadyInputRequest = function() {
			return stepReadyInputData;
		};
		
		this.startStep = function(e2eStepStartInputRequest) {
			stepStartInputData = e2eStepStartInputRequest;
			var httpURL = {
	                url : $window.endpointAddress+"/rest/SG001_TMF_Client/pub/external/stepStart",
	                method : "POST",
	                data : stepStartInputData,
	                withCredentials : true,
	                headers : TMF_Logging_Header
			};
			var startStepCall = $http(httpURL);
			startStepCall.then(function(response) {
				
			});
		};
		
		var logInfoInputData = {			
				"request" : {
					"event_text" : "",
					"custom1" : "",
					"custom2" : "",
					"custom3" : "",
					"tmf_overwrite" : {
						"servicename" : "",
						"hostname" : "",
						"username" : "",
					},
					"instance" : {
						"project" : "",
						"interface_id" : null,
						"dimension_name" : null,
						"dimension_value" : null,
						"step_id" : null,
						"parent_step_instance_id" : null,
						"step_instance_id" : null,
						"interface_instance_id" : null,
					},
				}
			};											
		
		this.logInfo = function(e2eInfoInputRequest,event_text) {
			logInfoInputData.request.event_text = event_text;
			logInfoInputData.request.instance = e2eInfoInputRequest;
			var httpURL = {
	                url : $window.endpointAddress+"rest/SG001_TMF_Client/pub/external/info",
	                method : "POST",
	                data : logInfoInputData,
	                withCredentials : true,
	                headers : TMF_Logging_Header
			};
			var logInfoCall = $http(httpURL);
			logInfoCall.then(function(response) {
				
			});
		};
		
		this.logWarning = function(e2eWarningInputRequest,event_text) {
			logWarningInputData.request.event_text = event_text;
			logWarningInputData.request.instance = e2eWarningInputRequest;
			var httpURL = {
	                url : $window.endpointAddress+"rest/SG001_TMF_Client/pub/external/warning",
	                method : "POST",
	                data : logWarningInputData,
	                withCredentials : true,
	                headers : TMF_Logging_Header
			};
			var logWarningCall = $http(httpURL);
			logWarningCall.then(function(response) {
				
			});
		};
		
		this.logError = function(e2eErrorInputRequest) {
			logErrorInputData = e2eErrorInputRequest;
			var httpURL = {
	                url : $window.endpointAddress+"rest/SG001_TMF_Client/pub/external/error",
	                method : "POST",
	                data : logErrorInputData,
	                withCredentials : true,
	                headers : TMF_Logging_Header
			};
			var logErrorCall = $http(httpURL);
			logErrorCall.then(function(response) {
				
			});
		};
		
		this.logFatal = function(e2eFatalInputRequest,event_text) {
			logFatalInputData.request.event_text = event_text; 
			logFatalInputData.request.instance = e2eFatalInputRequest;
			var httpURL = {
	                url : $window.endpointAddress+"rest/SG001_TMF_Client/pub/external/fatal",
	                method : "POST",
	                data : logFatalInputData,
	                withCredentials : true,
	                headers : TMF_Logging_Header
			};
			var logFatalCall = $http(httpURL);
			logFatalCall.then(function(response) {
				
			});
		};
		
		this.logDebug = function(e2eFatalInputRequest) {
			logFatalInputData = e2eFatalInputRequest;
			var httpURL = {
	                url : $window.endpointAddress+"rest/SG001_TMF_Client/pub/external/debug",
	                method : "POST",
	                data : logDebugInputData,
	                withCredentials : true,
	                headers : TMF_Logging_Header
			};
			var logDebugCall = $http(httpURL);
			logDebugCall.then(function(response) {
				
			});
		};
		
		this.stepReady = function(e2eStepReadyInputRequest) {
			stepReadyInputData = e2eStepReadyInputRequest;
			var httpURL = {
	                url : $window.endpointAddress+"rest/SG001_TMF_Client/pub/external/stepReady",
	                method : "POST",
	                data : stepReadyInputData,
	                withCredentials : true,
	                headers : TMF_Logging_Header
			};
			var stepReadyCall = $http(httpURL);
			stepReadyCall.then(function(response) {
				
			});
			
		};
				
}]);
