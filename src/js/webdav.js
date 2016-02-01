// A raw WebDAV interface
var WebDAV = {
	GET: function ( url, callback ) {
		return this.request ( 'GET', url, {}, null, 'text', callback );
	},

	PROPFIND: function ( url, callback ) {
		return this.request ( 'PROPFIND', url, { Depth: "1" }, null, 'xml', callback );
	},

	MKCOL: function ( url, callback ) {
		return this.request ( 'MKCOL', url, {}, null, 'text', callback );
	},

	DELETE: function ( url, callback ) {
		return this.request ( 'DELETE', url, {}, null, 'text', callback );
	},

	PUT: function ( url, data, callback ) {
		return this.request ( 'PUT', url, {}, data, 'text', callback );
	},

	request: function ( verb, url, headers, data, type, callback ) {

		var xhr = new XMLHttpRequest ();

		var body = function () {
			var b = xhr.responseText;
			if ( type == 'xml' ) {
				var xml = xhr.responseXML;
				if ( xml ) {
					b = xml.firstChild.nextSibling ? xml.firstChild.nextSibling : xml.firstChild;
				}
			}
			return b;
		};

		if ( callback ) {
			xhr.onreadystatechange = function () {
				if ( xhr.readyState == 4 ) { // complete.
					var b = body ();
					if ( b ) {
						callback ( b );
					}
				}
			};
		}

		xhr.open ( verb, url, Boolean ( callback ) );

		xhr.setRequestHeader ( "Content-Type", "text/xml; charset=UTF-8" );

		for ( var header in headers ) {
			xhr.setRequestHeader ( header, headers[ header ] );
		}

		xhr.send ( data );

		if ( !callback ) {
			return body ();
		}
	}
};

// An Object-oriented API around WebDAV.
WebDAV.Fs = function ( rootUrl ) {
	this.rootUrl = rootUrl;
	var fs       = this;

	this.file = function ( href ) {
		this.type = 'file';

		this.url = fs.urlFor ( href );

		this.name = fs.nameFor ( this.url );

		this.read = function ( callback ) {
			return WebDAV.GET ( this.url, callback );
		};

		this.write = function ( data, callback ) {
			return WebDAV.PUT ( this.url, data, callback );
		};

		this.rm = function ( callback ) {
			return WebDAV.DELETE ( this.url, callback );
		};

		return this;
	};

	this.dir = function ( href ) {
		this.type = 'dir';
		this.url  = fs.urlFor ( href );
		this.name = fs.nameFor ( this.url );

		this.children = function ( callback ) {

			var childrenFunc = function ( doc ) {

				var entries = $ ( doc ).children ( 'd\\:response, response' ); // Double slash necessary to escape colon!
				var result  = [];

				if ( entries.length === 0 ) {

					throw('No such directory');

				}
				else {

					entries.each ( function ( index ) {

						var collection = $ ( this ).find ( "d\\:collection, collection" ); // Double slash necessary to escape colon!
						var href       = $ ( this ).children ( 'd\\:href, href' ).first ().text ().replace ( /\/$/, '' ); // Double slash necessary to escape colon!

						if ( collection.length > 0 ) {
							result.push ( new fs.dir ( href ) );
						}
						else {
							result.push ( new fs.file ( href ) );
						}
					} );

				}

				return result;
			};

			if ( callback ) {
				WebDAV.PROPFIND ( this.url, function ( doc ) {
					callback ( childrenFunc ( doc ) );
				} );
			}
			else {
				return childrenFunc ( WebDAV.PROPFIND ( this.url ) );
			}
		};

		this.rm = function ( callback ) {
			return WebDAV.DELETE ( this.url, callback );
		};

		this.mkdir = function ( callback ) {
			return WebDAV.MKCOL ( this.url, callback );
		};

		return this;
	};

	this.urlFor = function ( href ) {
		return (/^http/.test ( href ) ? href : this.rootUrl + href);
	};

	this.nameFor = function ( url ) {
		return url.replace ( /.*\/(.*)/, '$1' );
	};

	return this;
};
