/*
 * Package:  @@name
 * Version:  @@version
 * Author:   @@author
 * Modified: @@timestamp
 */


// Namespacing
var com          = com || {};
com.marklindhout = com.marklindhout || {};

// The extension itself
com.marklindhout.wdbms = {
	name             : '@@title',
	browser          : 'Chrome',
	max_bookmarks_age: 1000 * 60 * 5, // 5 minutes

	storage: {

		get: function ( callback ) {
			chrome.storage.sync.get(null, function ( obj ) {
				try{
					callback(obj);
				}
				catch (error) {
					console.log(error);
				}
			});
		},

		set: function ( options_object, callback ) {
			chrome.storage.sync.set(options_object, function () {
				try{
					callback(obj);
				}
				catch (error) {
					console.log(error);
				}
			});
		}

	},

	webdav: {

		put: function ( callback ) {

			com.marklindhout.wdbms.storage.get(function ( credentials ) {

				if ( credentials ) {
					$.ajax({
						 method     : 'PUT',
						 url        : credentials.url,
						 username   : credentials.username,
						 password   : credentials.password,
						 data       : com.marklindhout.wdbms.get_local_bookmarks(),
						 async      : true,
						 crossDomain: true
					 })
					 .done(function ( data ) {
						 callback(data);
					 })
					 .fail(function () {
						 throw new Error('Writing of bookmarks failed.')
					 });
				}
				else {
					throw new Error('No credentials found');
				}

			});

		},

		get: function ( callback ) {

			com.marklindhout.wdbms.storage.get(function ( credentials ) {

				if ( credentials.url ) {

					$.ajax({
						 method     : 'GET',
						 url        : credentials.url,
						 username   : credentials.username,
						 password   : credentials.password,
						 async      : true,
						 crossDomain: true,
						 dataType   : 'json',
						 jsonp      : false,
						 cache      : false,
						 statusCode: {
							 404: function() {
								 throw new Error( '@@title: ' + 'Retrieval of bookmarks failed. There is an error in the given URL.');
							 },
							 401: function() {
								 throw new Error( '@@title: ' + 'Retrieval of bookmarks failed: Authorization failed.');
							 }
						 },
						success: function ( data ) {
							try{
								callback(data);
							}
							catch (error) {
								throw new Error(error);
							}
						},
						error: function (jqxhr, status, error) {
							throw new Error( '@@title: ' +  status + ', ' + error );
						}
					 });

				}
				else {
					throw new Error( '@@title: ' + 'No WebDAV URL found.');
				}

			});
		}

	},

	check_local_bookmarks_age: function () {
		// compare local root node change date with remote change date
		// If the age difference is large than `max_bookmarks_age` a new version should be retrieved.

	},

	on_install_handler: function ( info ) {

		if ( info.reason === 'install' ) {
			// Show the WebDAV settings page
		}

	},

	has_extension_bookmark_folder: function ( callback ) {

		var has_folder = false;

		chrome.bookmarks.search({ url: null, title: '@@title' }, function ( children ) {
			for ( var i = 0; i < children.length; i ++ ) {
				var item = children[ i ];

				if ( item.title === '@@title' ) {
					has_folder = true;
				}
			}

			try{
				callback(has_folder);
			}
			catch (error) {
				throw new Error(error);
			}
		});
	},

	on_browser_button_click_handler: function () {

		com.marklindhout.wdbms.has_extension_bookmark_folder(function ( has_folder ) {
			if ( ! has_folder ) {
				chrome.bookmarks.create({ title: '@@title', parentId: '1', index: 0, url: null }, function () {
					console.log('@@title folder created.');
				});
			}
			else {
				console.log('@@title folder present.');
			}


			// Retrieve the remote bookmarks file
			com.marklindhout.wdbms.webdav.get(function ( data ) {
				console.log(data);
			});
		});
	},

	init: function () {
		com.marklindhout.wdbms.check_local_bookmarks_age();
		com.marklindhout.wdbms.webdav.get(function (data) {
			console.log(data);
		});

	}
};

chrome.runtime.onInstalled.addListener(function ( info ) {

	com.marklindhout.wdbms.on_install_handler(info);

});

chrome.browserAction.onClicked.addListener(function () {

	com.marklindhout.wdbms.on_browser_button_click_handler();

});

$(document).ready(function () {
	com.marklindhout.wdbms.init();
});
