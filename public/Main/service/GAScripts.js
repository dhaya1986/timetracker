app.service('gaScripts', [ '$window', function($window) {

	dataLayer = window.dataLayer || [];

	this.eventTracker = function(eventCat, eventAct, eventLbl) {
		dataLayer = window.dataLayer || [];
		dataLayer.push({
			'event' : 'eventTracker',
			'eventCat' : eventCat,
			'eventAct' : eventAct,
			'eventLbl' : eventLbl
		});
	};

	this.virtualPageview = function(virtualPageURL, virtualPageTitle) {
		dataLayer = window.dataLayer || [];
		dataLayer.push({
			'event' : 'eventTracker',
			'virtualPageURL' : virtualPageURL,
			'virtualPageTitle' : virtualPageTitle
		});
	};

} ]);