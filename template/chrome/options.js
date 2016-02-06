/**
 * Created by marklindhout on 06.02.16.
 */

// Namespacing
var com                = com || {};
com.marklindhout       = com.marklindhout || {};
com.marklindhout.wdbms = com.marklindhout.wdbms || {};

// Extension options
com.marklindhout.wdbms.options = {

	defaults: {
		url: false,
		username: false,
		password: false
	},

	save_to_storage: function () {

		var options_object = {
			url: $('#url').value(),
			username: $('#username').value(),
			password: $('#password').value()
		};

		chrome.storage.sync.set( options_object, function () {
			// Update status to let user know options were saved.
			var status         = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(function () {
				status.textContent = '';
			}, 750);
		});

	},

	restore_from_storage: function () {

		// Use default value color = 'red' and likesColor = true.
		chrome.storage.sync.get({
			favoriteColor: 'red',
			likesColor   : true
		}, function ( items ) {
			document.getElementById('color').value  = items.favoriteColor;
			document.getElementById('like').checked = items.likesColor;
		});
	},

	init: function () {
		com.marklindhout.wdbms.options.restore_from_storage();
	}

};

$(document).ready(function () {
	com.marklindhout.wdbms.options.init();

	$('#save').on('click', function (event) {

		event.preventDefault();

		com.marklindhout.wdbms.options.save_to_storage();
	});
});

