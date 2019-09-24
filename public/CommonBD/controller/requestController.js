/*
 * ======================================================================================================
 * Added by Reeth with ref to Application specific view for drop down section in New Dropdown 28-03-1017   
 * ======================================================================================================
 */
app.controller('requestController', function ($scope ,$rootScope, $window,$state, $modalInstance, selected,genericSetting,perDimensionSetting,breadcrumbProvider,breadcrumbService,inputRequest,$stateParams,statusProvider,commonUtils) {
		
		$scope.requestInput = {
			"AssessmentType":"",
			"AssessmentSubType":"",
			"otherSubType":"",
			"RequestNumber":"",
		};
		
		$scope.init = function(){
			$scope.assessmentType = commonUtils.convertToArray(genericSetting.getGenericConstants().assessmentType_multiline);
			$scope.maxInputlength = breadcrumbService.getTextFieldMaxLength();
		};
		
		$scope.getSubType = function(type,subtype){
			$scope.assessmentSubType = '';
			$scope.requestInput.AssessmentSubType = '';
			if(type == "Formulation Review"){
				$scope.assessmentSubType = commonUtils.convertToArray(genericSetting.getGenericConstants().formulationSubType_multiline);
			}else if(type == "Engineered Project Review"){
				$scope.assessmentSubType = "";
			}else if(type == "Clinical Risk Assessment"){
				$scope.assessmentSubType = commonUtils.convertToArray(genericSetting.getGenericConstants().clinicalRiskSubType_multiline);
			}else if(type == "Claim Support"){
				$scope.assessmentSubType = commonUtils.convertToArray(genericSetting.getGenericConstants().claimSupportSubType_multiline);
			}else if(type == "GCC"){
				$scope.assessmentSubType = "";
			}
			
			$scope.typeChange(type,$scope.requestInput.AssessmentSubType);
		};
				
		/* ------------------ Create RCR function ------------------ */ 	
		$scope.createRCR = function (request) {
			inputRequest.resetRCRRequest();
			breadcrumbProvider.callRestQueryForID(request).then(function(response){
				if(response.status.code == 0){
					$scope.requestInput.RequestNumber = response.requestorId;
					inputRequest.getRequest().RequestInformation.requestNo = response.requestorId;
					inputRequest.getRequest().AssessmentInformation.assessmentType = request.AssessmentType;
					inputRequest.getRequest().AssessmentInformation.assessmentSubType = request.AssessmentSubType; 
					inputRequest.getRequest().RequestInformation.projectStatus = "New"; 
					inputRequest.getRequest().Requestor = response.Requestor;
					breadcrumbService.setCAList(response.ClinicalAssessorList);
					breadcrumbService.setLeadReviewer(response.ClinicalLeadReviewerList);
					inputRequest.getRequest().ClinicalCoordinator = response.ClinicalCoordinator;
				    $modalInstance.dismiss('cancel');
				    $state.go('viewRequest.tabSection', {
						location : false,
					});
				    if($state.current.name == 'viewRequest.tabSection'){
				    	$state.transitionTo($state.current, $stateParams, {
					        reload: true,
					        inherit: false,
					        notify: true
					    });
				    }
				    $rootScope.$broadcast('changeDetails', {
				    });
				}				
			});
		};
	  	  
	  $scope.cancel = function () {
	    $modalInstance.close('close');
	  };
	  
	  $scope.disableCreate = true;
	  $scope.typeChange = function(type,subtype){
		  if(type == 'Engineered Project Review' || type == 'GCC'){
			  $scope.disableCreate = false;
		  }else	if((type == '' || type == null || subtype == '' || subtype == null)){
				$scope.disableCreate = true;
			}else{
				$scope.disableCreate = false;
			}
		};
});