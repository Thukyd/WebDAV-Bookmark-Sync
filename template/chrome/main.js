chrome.runtime.onInstalled.addListener(function ( info ) {

	if ( info.reason === 'install' ) {
		// Show the WebDAV settings page
	}

});

chrome.browserAction.onClicked.addListener(function () {

	var has_extension_bookmark_folder = function ( callback ) {

		var has_folder = false;

		chrome.bookmarks.search({ url: null, title: '%PKG.TITLE%' }, function ( children ) {
			for ( var i = 0; i < children.length; i ++ ) {
				var item = children[ i ];

				if ( item.title === '%PKG.TITLE%' ) {
					has_folder = true;
				}
			}
			callback(has_folder);
		});
	};


	has_extension_bookmark_folder(function ( has_folder ) {

		if ( ! has_folder ) {
			chrome.bookmarks.create({ title: '%PKG.TITLE%', parentId: '1', index: 0, url: null }, function () {
				console.log('Folder for %PKG.TITLE% created.');
			});
		}
		else {
			console.log('%PKG.TITLE% folder already exists');
		}
	});

	$.ajax({
		 method     : 'GET',
		 url        : url,
		 async      : true,
		 crossDomain: true,
		 username   : username,
		 password   : password,
		 statusCode : {
			 200: function () {
				 console.log('request success');
			 },
			 401: function () {
				 console.log('not authorized');
			 },
		 },
	 })
	 .done(function ( data ) {
		 console.log( JSON.parse(data) );
	 })
	 .fail(function () {
		throw new Error('Retrieval of the bookmarks file failed.')
	 });

});
