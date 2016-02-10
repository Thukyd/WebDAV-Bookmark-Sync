/*
 * Package:  @@name
 * Version:  @@version
 * Author:   @@author
 * Modified: @@timestamp
 */


// Namespacing
var com = com || {};
	com.marklindhout = com.marklindhout || {};

// The extension itself
com.marklindhout.wdbms = {
	name: '@@title',
	browser: 'Chrome',
	max_bookmarks_age: 1000 * 60 * 5, // 5 minutes

	webdav: {

		get_credentials: function (callback) {
			chrome.storage.sync.get(null, function ( obj ) {
				callback(obj);
			});
		},

		put: function (callback) {

			com.marklindhout.wdbms.webdav.get_credentials( function (credentials) {

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
				} else {
					throw new Error('No credentials found');
				}

			});

		},

		get: function (callback) {

			com.marklindhout.wdbms.webdav.get_credentials( function (credentials) {

				if ( credentials ) {

					$.ajax({
						 method     : 'GET',
						 url        : credentials.url,
						 username   : credentials.username,
						 password   : credentials.password,
						 async      : true,
						 crossDomain: true
					 })
					 .done( function ( data ) {
						 callback( data );
					 })
					 .fail( function () {
						 throw new Error('Retrieval of bookmarks failed.')
					 });

				} else {
					throw new Error('No credentials found');
				}

			});

		}

	},

	check_local_bookmarks_age: function () {
		// compare local root node change date with remote change date
		// If the age difference is large than `max_bookmarks_age` a new version should be retrieved.

	},

	on_install_handler: function (info) {

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
			callback(has_folder);
		});
	},

	on_browser_button_click_handler: function () {

		com.marklindhout.wdbms.has_extension_bookmark_folder(function ( has_folder ) {
			if ( ! has_folder ) {
				chrome.bookmarks.create({ title: '@@title', parentId: '1', index: 0, url: null }, function () {
					console.log('Folder for @@title created.');
				});
			}
			else {
				console.log('@@title folder already exists');
			}
		});
	},

	init : function () {
//		com.marklindhout.wdbms.check_local_bookmarks_age();

		com.marklindhout.wdbms.webdav.get(function (data) {
			console.log(data);
		});
	}
};

chrome.runtime.onInstalled.addListener(function ( info ) {

	com.marklindhout.wdbms.on_install_handler(info);

});

chrome.browserAction.onClicked.addListener( function (){

	com.marklindhout.wdbms.on_browser_button_click_handler();

});

$(document).ready(function () {
	com.marklindhout.wdbms.init();
});
