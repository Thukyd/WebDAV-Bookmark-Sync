/**
 * Packages: @@name
 * Version: @@version
 * Author @@author
 * Modified: @@timestamp
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

	options_form: $('#options'),

	storage: {

		get: function ( callback ) {
			chrome.storage.sync.get(null, function ( obj ) {
				callback(obj);
			});
		},

		set: function ( options_object, callback ) {
			chrome.storage.sync.set(options_object, function () {
				callback();
			});
		}

	},

	show_message: function ( type, message ) {

		var is_valid = false;
		var $s       = $('#status');

		if ( $s.length === 0 ) {
			com.marklindhout.wdbms.options.options_form.append('<div id="status" />');
			$s = $('#status');
		}

		if ( type === 'info' ) {
			is_valid = true;
		}

		else if ( type === 'error' ) {
			is_valid = true;
		}

		if ( is_valid ) {
			$s.append('<div class="message ' + type + '">' + message + '</div>');

			$s.fadeIn()
			  .delay(750)
			  .fadeOut(function () {
				  $(this).children('.message').remove();
			  });
		}
	},

	show_status_message: function ( message ) {
		com.marklindhout.wdbms.options.show_message('info', message);
	},

	show_error_message: function ( message ) {
		com.marklindhout.wdbms.options.show_message('error', message);
	},

	is_allowed_option: function ( option_name ) {
		var allowed_options = com.marklindhout.wdbms.options.allowed_options;
		return allowed_options.indexOf(option_name) > - 1;
	},

	save_to_storage: function () {

		var options_object  = {};
		var allowed_options = com.marklindhout.wdbms.options.allowed_options;

		for ( index in allowed_options ) {

			var option = allowed_options[ index ];
			var value  = $('#' + option).val();

			options_object[ option ] = ( value ? value : '' );
		}

		try {
			com.marklindhout.wdbms.options.storage.set(options_object, function () {
				com.marklindhout.wdbms.options.show_status_message('Options saved.');
			});
		}
		catch ( error ) {
			com.marklindhout.wdbms.options.show_error_message(error);
		}

	},

	restore_from_storage: function () {

		com.marklindhout.wdbms.options.storage.get(function ( obj ) {

			var allowed_options = com.marklindhout.wdbms.options.allowed_options;

			for ( index in allowed_options ) {

				var option = allowed_options[ index ];
				var $item  = $('#' + option);

				if ( $item.length > 0 ) { // See if this field exists
					$item.val(obj[ option ]);
				}
			}
		});
	},

	init: function () {
		try {
			com.marklindhout.wdbms.options.restore_from_storage();
		}
		catch ( error ) {
			com.marklindhout.wdbms.options.show_error_message(error);
		}
	}

};

$(document).ready(function () {
	com.marklindhout.wdbms.options.init();

	$('#save').on('click', function ( event ) {
		event.preventDefault();
		com.marklindhout.wdbms.options.save_to_storage();
	});
});

