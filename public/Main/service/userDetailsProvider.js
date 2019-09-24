/*
 * ========================================================================
 * userDetailsProvider    		Added by Reeth with ref to IS Integration for RTR  07-03-1017   
 * REST_OBJECT.GET_MY_RTR       Added by Reeth with ref to IS Integration for RTR  07-03-1017   
 * ========================================================================
 */
ProfilesApp.service("userDetailsProvider",function($window,$q,restProvider,$http){
	var requestor = {
			"user":{
				"userId" : "",
				"email" : "",
				"firstName" :"",
				"lastName" : "",
				"ntId" : "",
				"region":"",
				"roles" : []
			}
	};
	
	function getRequestorDetails(id){
		requestor.user.ntId = id;
		var PROFILEObj = restProvider.getREST_OBJECT().GET_LOGGEDIN_USER_DETAILS;
		PROFILEObj.data = id;
		return $http(PROFILEObj);
	};
	
	this.callRestQueryForRequestor = function(id){
		var deferred = $q.defer();
		getRequestorDetails(id).success(function(response) {
			deferred.resolve(response);
		});
		return deferred.promise;
	};
});