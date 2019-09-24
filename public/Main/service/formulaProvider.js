/*
 * ========================================================================
 * projectProvider    				         Added by Reeth with ref to IS Integration for RCR  11-09-2017   
 * FORMULA_REST_OBJECT.GET_RAW_MATERIAL      Added by Reeth with ref to IS Integration for RCR  11-09-2017   
 * ========================================================================
 */
ProfilesApp.service("formulaProvider",function($window,perDimensionSetting){
	var EXT_ENDPOINT_ADDRESS_FORMULA =  perDimensionSetting.getDimensionConstants().externalSystem.formulaSection.endPointAddress;
	var USERNAME_FORMULA = perDimensionSetting.getDimensionConstants().externalSystem.formulaSection.username;
	var PASSWORD_FORMULA = perDimensionSetting.getDimensionConstants().externalSystem.formulaSection.password;
	
	var EXT_ENDPOINT_ADDRESS_RAWMATERIAL =  perDimensionSetting.getDimensionConstants().externalSystem.rawMaterialSection.endPointAddress;
	var USERNAME_RAWMATERIAL = perDimensionSetting.getDimensionConstants().externalSystem.rawMaterialSection.username;
	var PASSWORD_RAWMATERIAL = perDimensionSetting.getDimensionConstants().externalSystem.rawMaterialSection.password;
	
	var header_formula = {
			'Content-Type': 'application/json', 
			'Accept' : 'application/json',
			'Authorization' : "Basic " + btoa(USERNAME_FORMULA+":"+PASSWORD_FORMULA)
	};
	
	var header_rawmaterial = {
			'Content-Type': 'application/json', 
			'Accept' : 'application/json',
			'Authorization' : "Basic " + btoa(USERNAME_RAWMATERIAL+":"+PASSWORD_RAWMATERIAL)
	};
	
	var inputRequest = {
			"Request": {
				"Header": {
					"identifier": "COMPOSITION"
				},
				"objectKey": ""
			}
	};

	var requestInput = {
        "request": {
            "objectKey":  ""//FML_NTG93000098-001
        }
	};

	var FORMULA_REST_OBJECT = {

		GET_RAW_MATERIAL :{
			url: EXT_ENDPOINT_ADDRESS_RAWMATERIAL + '/rest/CG510_FMLDev_Portal/restservices/rawMaterial',
			method: 'POST',
			withCredentials : true,
			headers : header_rawmaterial,
			data :inputRequest
		},
		
		GET_FORMULA_NO :{
			url: EXT_ENDPOINT_ADDRESS_FORMULA + '/rest/CG510_FMLDev_Gateway.restServices.getFMLInformation',//'/rest/CG510_FMLDev_Portal/restservices/formula',
			method: 'POST',
			withCredentials : true,
			headers : header_formula,
			data :requestInput//inputRequest
		}
	};
	
	
	this.getFORMULA_REST_OBJECT = function() {
		return FORMULA_REST_OBJECT;
	};

	this.setFORMULA_REST_OBJECT = function(value) {
		this.FORMULA_REST_OBJECT = value;
	};
});