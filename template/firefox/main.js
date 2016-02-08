/**
 * Packages: @@name
 * Version: @@version
 * Author @@author
 * Modified: @@timestamp
 */

const Request = require ( "sdk/request" ).Request;
const tabs    = require ( 'sdk/tabs' );
const self    = require ( 'sdk/self' );
const Button  = require ( 'sdk/ui/button/action' ).ActionButton;
const { Bookmark, Group, save } = require("sdk/places/bookmarks");


let button = new Button ( {
	id     : '@@name',
	label  : '@@title',
	icon   : {
		'128': self.data.url ( 'img/icon_128.png' ),
		'48' : self.data.url ( 'img/icon_48.png' ),
		'16' : self.data.url ( 'img/icon_16.png' )
	},
	onClick: function () {
		console.log('Browser Toolbar button clicked');
	}
} );


// The 'main' function runs on initialization, install, and update of the browser.
exports.main = function ( info, callback ) {

	if ( info.loadReason === 'install' ) {
		// Show WebDAV setting page
	}

};
