/*
 * ========================================================================
 * restProviderAdded by Reeth with ref to IS Integration for RTR  07-03-1017   
 * REST_OBJECT.GET_MY_RTR       Added by Reeth with ref to IS Integration for RTR  07-03-1017   
 * ========================================================================
 */
ProfilesApp.service("restProvider", function ($window) {
	var IS_ENDPOINT_ADDRESS = $window.endpointAddress;
	var USERNAME = $window.userName;
	var PASSWORD = $window.password;

	var header = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		//"Authorization" : "Basic " + btoa(USERNAME+":"+PASSWORD)
	};

	var REST_OBJECT = {

		GET_LOGGEDIN_USER_DETAILS: {
			url: IS_ENDPOINT_ADDRESS + 'rest/CG510_Profiles_Interfaces.PROFILES.getWWID',
			method: 'POST',
			withCredentials: true,
			headers: header,
			data: ""
		},

		/* TIME TRACKING SECTION */
		GET_USER_TRACKTIME: {
			url: IS_ENDPOINT_ADDRESS + 'getTimeTrack',
			method: 'POST',
			withCredentials: true,
			headers: header,
			data: ""
		},
		GET_USER_HOME_PROJECTS: {
			url: IS_ENDPOINT_ADDRESS + 'getAllProjectsFromCache',
			method: 'POST',
			withCredentials: true,
			headers: header,
			data: ""
		},
		GET_USER_HOME_PROJECTS_FROM_RND: {
			url: IS_ENDPOINT_ADDRESS + 'getAllProjectsFromRnD',
			method: 'POST',
			withCredentials: true,
			headers: header,
			data: ""
		},
		ADD_PROJECT_TO_TRACKTIME: {
			url: IS_ENDPOINT_ADDRESS + 'addProjectToTrackTime',
			method: 'POST',
			withCredentials: true,
			headers: header,
			data: ""
		},
		REMOVE_PROJECT_TO_TRACKTIME: {
			url: IS_ENDPOINT_ADDRESS + 'removeProjectsFromTT',
			method: 'POST',
			withCredentials: true,
			headers: header,
			data: ""
		},
		SAVE_TIME_LOGGED: {
			url: IS_ENDPOINT_ADDRESS + 'editTimeTracker',
			method: 'POST',
			withCredentials: true,
			headers: header,
			data: ""
		},
		GET_ALL_ADMIN_PROJECTS: {
			url: IS_ENDPOINT_ADDRESS + 'getAllProjectsForAdmin',
			method: 'POST',
			withCredentials: true,
			headers: header,
			data: ""
		},
		GET_ALL_USERS_LIST_ADMIN: {
			url: IS_ENDPOINT_ADDRESS + 'getAllUsersForAdmin',
			method: 'POST',
			withCredentials: true,
			headers: header,
			data: ""
		},
		GET_ADMIN_APPROVE_PROJECT: {
			url: IS_ENDPOINT_ADDRESS + 'approveProjects',
			method: 'POST',
			withCredentials: true,
			headers: header,
			data: ""
		},
		EXPORT_ALL_USERS_LIST: {
			url: IS_ENDPOINT_ADDRESS + 'generateExcelReport',
			method: 'POST',
			withCredentials: true,
			responseType: 'arraybuffer',
			headers: header,
			data: ""
		}
	};

	this.getREST_OBJECT = function () {
		return REST_OBJECT;
	};

	this.setREST_OBJECT = function (value) {
		this.REST_OBJECT = value;
	};
});