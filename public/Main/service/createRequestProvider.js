app.service("createRequestProvider", function($http,$window,$rootScope,$modal,restProvider,$q,inputRequest,projectProvider,formulaProvider,commonUtils) {

	var CAList = [];

	this.setCAList = function(value){
		CAList = value;
	};

	this.getCAList = function(){
		return CAList;
	};
	
	var setLeadReviewerList = [];

	this.setLeadReviewer = function(value){
		setLeadReviewerList = value;
	};

	this.getLeadReviewer = function(){
		return setLeadReviewerList;
	};
		
	/* ---------- RCR Save  ---------- */
	function saveRCR(request){
		if(request.RequestInformation.RCR_ID==="") {			
			var Obj = "";
			Obj = restProvider.getREST_OBJECT().SAVE_RCR;
			Obj.data = {"SaveRCRRequest": request};
			return $http(Obj);
		}
		else {
			var Obj = "";
			Obj = restProvider.getREST_OBJECT().EDIT_RCR;
			Obj.data = {"EditRCRRequestInformation": request};
			return $http(Obj);
		}
	};
	
	this.callRestQueryForSaveRCR = function(request){
		var tempObj = formatRequestDateObject(request);
		var deferred = $q.defer();
		saveRCR(tempObj).success(function(response) {
			if(request.RequestInformation.RCR_ID==="") {
				var tempResponse = formatResponseDateObject(response.SaveRCRResponse);
				deferred.resolve(tempResponse);
			}
			else {
				var tempResponse = formatResponseDateObject(response.EditRCRResponseInformation);
				deferred.resolve(tempResponse);
			}
		});
		return deferred.promise;
	};
	
	/* ---------- RCR Submit  ---------- */
	function submitRCR(request){
		var Obj = "";
		Obj = restProvider.getREST_OBJECT().SUBMIT_RCR;
		Obj.data = {"SubmitRCRRequestInformation": request};
		return $http(Obj);
	};
	
	this.callRestQueryForSubmitRCR = function(request){
		var tempObj = formatRequestDateObject(request);
		var deferred = $q.defer();
		submitRCR(tempObj).success(function(response) {
			var tempResponse = formatResponseDateObject(response.SubmitRCRResponseInformation);
			deferred.resolve(tempResponse);
		});
		return deferred.promise;
	};
	
	/* ---------- Acknowledge Request By CA  ---------- */
	function acknowledgeCA(request){
		var RCRObj = restProvider.getREST_OBJECT().ACKNOWLEDGE_CA;
		RCRObj.data = {"SaveRCRRequest":request};
		return $http(RCRObj);
	};
	
	this.callacknowledgeCARestQuery = function(request){
		var tempObj = formatRequestDateObject(request);
		var deferred = $q.defer();
		tempObj.RequestInformation.projectStatus = "Accepted";
		acknowledgeCA(tempObj).success(function(response) {
			if(response.SaveRCRResponse.Status.code == "0"){
				var tempResponse = formatResponseDateObject(response.SaveRCRResponse);
				deferred.resolve(tempResponse);
			}
			else{
				
			}
		});
		return deferred.promise;
	};
		
	/* ---------- Complete Assessment By CA  ---------- */
	function completeAssessmentCA(request){
		var RCRObj = restProvider.getREST_OBJECT().ASSESSMENT_COMPLETE_CA;
		RCRObj.data = {"SaveRCRRequest":request};
		return $http(RCRObj);
	};
	
	this.callCompleteAssessmentCARest = function(request){
		var tempObj = formatRequestDateObject(request);
		var deferred = $q.defer();
		tempObj.RequestInformation.projectStatus = "Draft";
		completeAssessmentCA(tempObj).success(function(response) {
			if(response.SaveRCRResponse.Status.code == "0"){
				var tempResponse = formatResponseDateObject(response.SaveRCRResponse);
				deferred.resolve(tempResponse);
			}
			else{
				
			}
		});
		return deferred.promise;
	};
	
	/* ---------- Acknowledge Request By LR  ---------- */
	function acknowledgeLR(request){
		var RCRObj = restProvider.getREST_OBJECT().ACKNOWLEDGE_CA;
		RCRObj.data = {"SaveRCRRequest":request};
		return $http(RCRObj);
	};
	
	this.callacknowledgeLRRestQuery = function(request){
		var tempObj = formatRequestDateObject(request);
		var deferred = $q.defer();
		tempObj.RequestInformation.projectStatus = "Accepted";//change status
		acknowledgeLR(tempObj).success(function(response) {
			if(response.SaveRCRResponse.Status.code == "0"){
				var tempResponse = formatResponseDateObject(response.SaveRCRResponse);
				deferred.resolve(tempResponse);
			}
			else{
				
			}
		});
		return deferred.promise;
	};
	
	/* ---------- Acknowledge Request By LR  ---------- */
	function updateCoordinator(request){
		var RCRObj = "";
		if(request.ClinicalAssessor!=""){
			request.RequestInformation.projectStatus = "In Review";
			RCRObj = restProvider.getREST_OBJECT().ASSIGN_CA;
		}else{
			RCRObj = restProvider.getREST_OBJECT().REASSIGN_COORDINATOR;
		}
		
		RCRObj.data = {"SaveRCRRequest":request};
		return $http(RCRObj);
	};
	
	this.callacknowledgeCoordinatorQuery = function(request){
		var tempObj = formatRequestDateObject(request);
		var deferred = $q.defer();
		updateCoordinator(tempObj).success(function(response) {
			if(response.SaveRCRResponse.Status.code == "0"){
				var tempResponse = formatResponseDateObject(response.SaveRCRResponse);
				deferred.resolve(tempResponse);
			}
			else{
				
			}
		});
		return deferred.promise;
	};

	/* ---------- Get Project Name from Rnd  ---------- */
	function getRnDProject(){
		var projectFromRnD = projectProvider.getEXT_REST_OBJECT().GET_PROJECT;
		return $http(projectFromRnD);
	};
	
	this.callRestQueryForRnDProject = function(){
		var deferred = $q.defer();
		getRnDProject().success(function(response) {
			if(response.UIResponse.status.statusCode == "0"){
				deferred.resolve(response);
			}
			else{
			}
		}).error(function() {
			deferred.reject("No Formula Data Found");
        });
		return deferred.promise;
	};
	
	/* ---------- Get Formula Number Details ---------- */
	function getFormula(formulaNO){
		var formulaFromConcerto = formulaProvider.getFORMULA_REST_OBJECT().GET_FORMULA_NO;
		formulaFromConcerto.data.request.objectKey = formulaNO;
		return $http(formulaFromConcerto);
	};
	
	this.callRestQueryForFormula = function(formulaNO){
		var deferred = $q.defer();
		getFormula(formulaNO).success(function(response) {
			deferred.resolve(response);
        });
		return deferred.promise;
	};

	function clinicalAssessorReAssignment(request, type){
		var Obj = "";
		if(type=="reviewer") {
    		Obj = restProvider.getREST_OBJECT().REASSIGN_LEAD_REVIEWER;//REASSIGN_LEAD_REVIEWER
    	}
    	else {
    		Obj = restProvider.getREST_OBJECT().REASSIGN_CA;
    	}
		Obj.data = {"SaveRCRRequest": request};
		return $http(Obj);
	};

	this.reAssignClinicalAssessor = function(request, type) {
		var tempObj = formatRequestDateObject(request);
		var deferred = $q.defer();
		clinicalAssessorReAssignment(tempObj, type).success(function(response){
			//deferred.resolve(response);
			if(response.SaveRCRResponse.Status.code == "0"){
				var tempResponse = formatResponseDateObject(response.SaveRCRResponse);
				deferred.resolve(tempResponse);
			}
			else{
				
			}
		});
		return deferred.promise;
	};

	/*Request Date Format*/
	function formatRequestDateObject(req){
		req.RequestInformation.submittedDate = (req.RequestInformation.submittedDate!=null && req.RequestInformation.submittedDate!="")? commonUtils.formatDate(req.RequestInformation.submittedDate):null;
		req.RequestInformation.dueDate = (req.RequestInformation.dueDate!=null && req.RequestInformation.dueDate!="")? commonUtils.formatDate(req.RequestInformation.dueDate):null;
		req.AcknowledgeInfoCA.commitmentDate = (req.AcknowledgeInfoCA.commitmentDate!=null && req.AcknowledgeInfoCA.commitmentDate!="")? commonUtils.formatDate(req.AcknowledgeInfoCA.commitmentDate):null;
		req.AcknowledgeInfoLR.commitmentDate = (req.AcknowledgeInfoLR.commitmentDate!=null && req.AcknowledgeInfoLR.commitmentDate!="")? commonUtils.formatDate(req.AcknowledgeInfoLR.commitmentDate):null;
		return req;
	}
	
	/*Response Date Format*/
	function formatResponseDateObject(res){
		res.RequestInformation.submittedDate = (res.RequestInformation.submittedDate!=null && res.RequestInformation.submittedDate!="")? new Date(res.RequestInformation.submittedDate):"";
		res.RequestInformation.dueDate = (res.RequestInformation.dueDate!=null && res.RequestInformation.dueDate!="")? new Date(res.RequestInformation.dueDate):"";
		res.AcknowledgeInfoCA.commitmentDate = (res.AcknowledgeInfoCA.commitmentDate!=null && res.AcknowledgeInfoCA.commitmentDate!="")? new Date(res.AcknowledgeInfoCA.commitmentDate):"";
		res.AcknowledgeInfoLR.commitmentDate = (res.AcknowledgeInfoLR.commitmentDate!=null && res.AcknowledgeInfoLR.commitmentDate!="")? new Date(res.AcknowledgeInfoLR.commitmentDate):"";
		return res;
	}
	
	this.getFormattedResponseDate = function(response){
		return formatResponseDateObject(response);
	};

	this.commitmentDateCheck = function(request) {
		var dueDate = "";
		if (request.AcknowledgeInfoCA.commitmentDate!=''&&request.AcknowledgeInfoCA.commitmentDate!=null) {
			dueDate = request.AcknowledgeInfoCA.commitmentDate;
		}
		else if(request.RequestInformation.dueDate != '' && request.RequestInformation.dueDate != null){
			dueDate = request.RequestInformation.dueDate;
		}else{
			dueDate = "";
		}
		return dueDate;
	};
});

