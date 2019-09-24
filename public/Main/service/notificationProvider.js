/*
 * ========================================================================
 * notificationProvider    		Added by Reeth with ref to IS Integration for RTR  29-03-2017   
 * ========================================================================
 */

app.service("notificationProvider", function($http,$window,$rootScope,genericSetting,perDimensionSetting,restProvider,$q,statusProvider,inputRequest,$state) {
	
	var inputDeleteNotification = {
			request : {
				"user":{
					"displayName" : "",
					"userId" : "",
					"email" : "",
					"firstName" :"",
					"lastName" : "",
					"ntId" : "",
					"region":"",
					"roles" : []
				},
				"notificationId":""
			}
	};
		
	var inputGetNotification = {
			request : {
				"user":{
					"displayName" : "",
					"userId" : "",
					"email" : "",
					"firstName" :"",
					"lastName" : "",
					"ntId" : "",
					"region":"",
					"roles" : []
				},
				"dueDateRange":""
			}
	};
	
	
	var inputNotificationCount = {
			request : {
				"user":{
					"displayName" : "",
					"userId" : "",
					"email" : "",
					"firstName" :"",
					"lastName" : "",
					"ntId" : "",
					"region":"",
					"roles" : []
				}
			}
	};
	
	function deleteNotification(id){
		inputDeleteNotification.request.user.ntId = $rootScope.loggedInUserWWID;
		inputDeleteNotification.request.notificationId = id;
		var DeleteObj = restProvider.getREST_OBJECT().DELETE_NOTIFICATION;
		DeleteObj.data = inputDeleteNotification;
		return $http(DeleteObj);
	};
	
	this.callRestTodeleteNotification = function(id){
		var deferred = $q.defer();
		deleteNotification(id).success(function(response) {
			if(response.status.code == "0"){
				deferred.resolve(response);
			}
		});
		return deferred.promise;
	};
	
	
	function getNotification(Range){
		inputGetNotification.request.user.ntId = $rootScope.loggedInUserWWID;
		inputGetNotification.request.dueDateRange = Range;
		var notificationObj = restProvider.getREST_OBJECT().GET_NOTIFICATION;
		notificationObj.data = inputGetNotification;
		return $http(notificationObj);
	};
	
	this.callRestToGetNotification = function(Range){
		var deferred = $q.defer();
		getNotification(Range).success(function(response) {
			if(response.status.code == "0"){
				deferred.resolve(response);
			}
		});
		return deferred.promise;
	};
	
	
	function getNotificationCount(){
		inputNotificationCount.request.user.ntId = $rootScope.loggedInUserWWID;
		var countObj = restProvider.getREST_OBJECT().NOTIFICATION_COUNT;
		countObj.data = inputNotificationCount;
		return $http(countObj);
	};
	
	this.callRestToGetNotificationCount = function(){
		var deferred = $q.defer();
		getNotificationCount().success(function(response) {
			if(response.status.code == "0"){
				deferred.resolve(response);
			}
		});
		return deferred.promise;
	};
		
	function readNotification(id){
		inputDeleteNotification.request.user.ntId = $rootScope.loggedInUserWWID;
		inputDeleteNotification.request.notificationId = id;
		var readNotiObj = restProvider.getREST_OBJECT().READ_NOTIFICATION;
		readNotiObj.data = inputDeleteNotification;
		return $http(readNotiObj);
	};
	
	this.callRestToReadNotification = function(id){
		var deferred = $q.defer();
		readNotification(id).success(function(response) {
			if(response.status.code == "0"){
				deferred.resolve(response);
			}
		});
		return deferred.promise;
	};
	
	
	this.callViewRTRQuery = function(id){
		getRTR(id).success(function(response) {
			if(response.status.code == 0){
				var request = inputRequest.getRTRRequest(); 
				request.requestRTR = response.responseRTR;
				inputRequest.setRTRRequest(request); 
				var requestor = "";
				var owner = "";
				var approver = "";
				var requestInfoFrom = "";
				var previousStatus = "";
				var coordinator = "";
				if(request.requestRTR.requestor != null){
					 requestor = request.requestRTR.requestor.ntId;
				}
				if(request.requestRTR.owner != null){
					 owner = request.requestRTR.owner.ntId;
				}
				if(request.requestRTR.approver != null){
					 approver = request.requestRTR.approver.ntId;
				}
				if(request.requestRTR.coordinator != null){
					coordinator = request.requestRTR.coordinator.ntId;
				}
				if(request.requestRTR.requestInfoFrom != null && request.requestRTR.requestInfoFrom != ""){
					requestInfoFrom = request.requestRTR.requestInfoFrom;
				}
				if(request.requestRTR.previousStatus != null && request.requestRTR.previousStatus != ""){
					previousStatus = request.requestRTR.previousStatus;
				}
				statusProvider.statusActive(request.requestRTR.status,requestor,owner,approver,requestInfoFrom,previousStatus,coordinator);
				$rootScope.editDetails = true;
				$state.go('viewRequest.tabSection', {location : false}, { reload: true });
			}
		});
	};
	
	var value = {
			"requestRTR" :{
				"RTR_ID" : ""
			}
	};
	
	function getRTR(id){
		value.requestRTR.RTR_ID = id;
		var RTRObj = restProvider.getREST_OBJECT().GOT0_RTR;
		RTRObj.data = value;
		return $http(RTRObj);
	};
});