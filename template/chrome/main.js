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

		put: function (url, username, password) {
			$.ajax({
				 method     : 'PUT',
				 url        : url,
				 data       : 'Hi there! This is test content put here by a XHR!',
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
					 404: function () {
						 console.log('page not found');
					 }
				 },
			 })
			 .done(function ( data ) {
				 console.log(data);
			 })
			 .fail(function () {
				 throw new Error('Writing of bookmarks failed.')
			 });
		},

		get: function () {
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
					 404: function () {
						 console.log('page not found');
					 }
				 },
			 })
			 .done(function ( data ) {
				 console.log(JSON.parse(data));
			 })
			 .fail(function () {
				throw new Error('Retrieval of bookmarks failed.')
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

	on_browser_button_click_handler: function () {

		var has_extension_bookmark_folder = function ( callback ) {

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
		};


		has_extension_bookmark_folder(function ( has_folder ) {

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

		com.marklindhout.wdbms.check_local_bookmarks_age();

	}
};

chrome.runtime.onInstalled.addListener(function ( info ) {

	com.marklindhout.wdbms.on_install_handler(info);

});

chrome.browserAction.onClicked.addListener( function (){

	com.marklindhout.wdbms.on_browser_button_click_handler();

});
