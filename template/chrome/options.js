/**
 * Created by marklindhout on 06.02.16.
 */

// Namespacing
var com                = com || {};
com.marklindhout       = com.marklindhout || {};
com.marklindhout.wdbms = com.marklindhout.wdbms || {};

// Extension options
com.marklindhout.wdbms.options = {

	allowed_options: [
		'url',
		'username',
		'password'
	],

	show_status_message: function (message) {
		var $s = $('#status');
		$s.hide();
		$s.text( message );
		$s.fadeIn()
		  .delay(750)
		  .fadeOut();
	},

	is_allowed_option: function (option_name) {
		var allowed_options = com.marklindhout.wdbms.options.allowed_options;
		return allowed_options.indexOf(option_name) > -1;
	},

	save_to_storage: function () {

		var options_object = {};
		var allowed_options = com.marklindhout.wdbms.options.allowed_options;

		for ( index in allowed_options ) {

			var option = allowed_options[index];

			options_object[ option ] = $('#' + option).val() || false;
		}

		chrome.storage.sync.set(options_object, function () {
			com.marklindhout.wdbms.options.show_status_message('Options saved.')
		});

	},

	restore_from_storage: function () {

		chrome.storage.sync.get(null, function ( obj ) {

			var allowed_options = com.marklindhout.wdbms.options.allowed_options;

			for ( index in allowed_options ) {

				var option = allowed_options[index];
				var $item = $('#' + option);

				if ( $item.length > 0 ) { // See if this field exists
					$item.val( obj[option] );
				}
			}
		});
	},

	init: function () {
		com.marklindhout.wdbms.options.restore_from_storage();
	}

};

$(document).ready(function () {
	com.marklindhout.wdbms.options.init();

	$('#save').on('click', function ( event ) {

		event.preventDefault();

		com.marklindhout.wdbms.options.save_to_storage();
	});
});

