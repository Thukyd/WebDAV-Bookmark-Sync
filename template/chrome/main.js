chrome.runtime.onInstalled.addListener( function (info) {

	if (info.reason === 'install') {
		// Show the WebDAV settings page
	}

});

chrome.browserAction.onClicked.addListener(function () {
	console.log('Browser toolbar button clicked');
});
