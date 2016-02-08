module.exports = function ( grunt ) {

	// Load all installed Grunt modules
	require ( 'load-grunt-tasks' ) ( grunt );

	// Task Configuration
	grunt.initConfig ( {

		pkg: grunt.file.readJSON ( 'package.json' ),

		banner: '/*! ' + '<%= pkg.title || pkg.name %> <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>) ' + ' */\n',

		template_folder: 'template',
		src_folder     : 'src',
		build_folder   : 'build',
		dist_folder    : 'dist',
		tmp_folder     : 'tmp',

		clean: {
			all  : [ '<%= build_folder %>/**/*', '<%= tmp_folder %>' ],
			build: [ '<%= build_folder %>/**/*' ],
			dist : [ '<%= dist_folder %>/**/*' ],
			tmp  : [ '<%= tmp_folder %>' ],
		},

		compress: {
			chrome: {
				options: {
					archive: function () {
						return grunt.config.data.build_folder + '/chrome/' + grunt.config.data.pkg.name + '-' + grunt.config.data.pkg.version + '.zip'
					},
					mode   : 'zip'
				},
				expand : true,
				cwd    : '<%= build_folder %>/chrome/',
				src    : [ '**/*' ],
				dest   : '<%= dist_folder %>/chrome/',
			},
			firefox: {
				options: {
					archive: function () {
						return grunt.config.data.build_folder + '/firefox/' + grunt.config.data.pkg.name + '-' + grunt.config.data.pkg.version + '.xpi'
					},
					mode   : 'zip'
				},
				expand : true,
				cwd    : '<%= build_folder %>/firefox/',
				src    : [ '**/*' ],
				dest   : '<%= dist_folder %>/firefox/',
			},
		},


		copy: {

			scripts: {
				files: [
					{
						expand: true,
						cwd   : '<%= src_folder %>/js/',
						src   : [ '**/*' ],
						dest  : '<%= build_folder %>/chrome/data/js/'
					},
					{
						expand: true,
						cwd   : '<%= tmp_folder %>/js/',
						src   : [ '**/*' ],
						dest  : '<%= build_folder %>/firefox/data/js/'
					},
				],
			},

			images: {
				files: [
					{
						expand: true,
						cwd   : '<%= tmp_folder %>/img/',
						src   : [ '**' ],
						dest  : '<%= build_folder %>/chrome/data/img/'
					},
					{
						expand: true,
						cwd   : '<%= tmp_folder %>/img/',
						src   : [ '**' ],
						dest  : '<%= build_folder %>/firefox/data/img/'
					},
				],
			},

			css: {
				files: [
					{
						expand: true,
						cwd   : '<%= src_folder %>/css/',
						src   : [ '**' ],
						dest  : '<%= build_folder %>/chrome/data/css/'
					},
					{
						expand: true,
						cwd   : '<%= src_folder %>/css/',
						src   : [ '**' ],
						dest  : '<%= build_folder %>/firefox/data/css/'
					},
				],
			},

			template_chrome: {
				files: [
					{
						expand: true,
						cwd   : '<%= template_folder %>/chrome/',
						src   : [ '**' ],
						dest  : '<%= build_folder %>/chrome/'
					},
					{
						expand: true,
						cwd   : '<%= tmp_folder %>',
						src   : [ '**' ],
						dest  : '<%= build_folder %>/chrome/data/'
					}
				]
			},

			template_firefox: {
				files: [
					{
						expand: true,
						cwd   : '<%= template_folder %>/firefox/',
						src   : [ '**' ],
						dest  : '<%= build_folder %>/firefox/'
					},
					{
						expand: true,
						cwd   : '<%= tmp_folder %>',
						src   : [ '**' ],
						dest  : '<%= build_folder %>/firefox/data/'
					}
				]
			},

			dist_chrome: {
				expand: true,
				cwd   : '<%= build_folder %>/chrome/',
				src   : [ '*.zip' ],
				dest  : '<%= dist_folder %>/chrome/'
			},

			dist_firefox: {
				expand: true,
				cwd   : '<%= build_folder %>/firefox/',
				src   : [ '*.xpi' ],
				dest  : '<%= dist_folder %>/firefox/'
			},
		},

		image_resize: {
			options : {
				overwrite: true,
			},
			icon_16 : {
				options: {
					width : 16,
					height: 16,
				},
				src    : '<%= src_folder %>/img/icon.png',
				dest   : '<%= tmp_folder %>/img/icon_16.png',
			},
			icon_48 : {
				options: {
					width : 48,
					height: 48,
				},
				src    : '<%= src_folder %>/img/icon.png',
				dest   : '<%= tmp_folder %>/img/icon_48.png',
			},
			icon_128: {
				options: {
					width : 128,
					height: 128,
				},
				src    : '<%= src_folder %>/img/icon.png',
				dest   : '<%= tmp_folder %>/img/icon_128.png',
			},
		},


		replace: {
			dist: {
				options: {
					patterns: [
						{
							match: 'name',
							replacement: '<%= pkg.name %>'
						},
						{
							match: 'title',
							replacement: '<%= pkg.title %>'
						},
						{
							match: 'description',
							replacement: '<%= pkg.description %>'
						},
						{
							match: 'version',
							replacement: '<%= pkg.version %>'
						},
						{
							match: 'timestamp',
							replacement: '<%= grunt.template.today() %>'
						},
						{
							match: 'license',
							replacement: '<%= pkg.license %>'
						},
						{
							match: 'author',
							replacement: '<%= pkg.author %>'
						},
						{
							match: 'homepage',
							replacement: '<%= pkg.homepage || "--" %>'
						},
					],
				},
				files: [
					{
						expand: true,
						cwd   : '<%= build_folder %>',
						src   : [ '**/*' ],
						dest  :'<%= build_folder %>',
					},
				],
			},
		},

		watch: {
			options          : {
				spawn: false,
			},
			src              : {
				files: [ '<%= src_folder %>/**/*', '<%= template_folder %>/**/*' ],
				tasks: [ 'buildall' ],
			},
		},

	} );

	// Task Registration
	grunt.registerTask ( 'default', [
		'buildall'
	] );

	grunt.registerTask ( 'buildall', [
		'clean:all',
		'buildjs',
		'buildcss',
		'buildimg',
		'buildaddontemplates',
		'clean:tmp',
	] );

	grunt.registerTask ( 'buildjs', [
		'copy:scripts',
	] );

	grunt.registerTask ( 'buildcss', [
		'copy:css',
	] );

	grunt.registerTask ( 'buildimg', [
		'image_resize',
		'copy:images',
	] );

	grunt.registerTask ( 'buildaddontemplates', [
		'copy:template_chrome',
		'copy:template_firefox',
		'replace',
	] );

	grunt.registerTask ( 'dist', [
		'buildall',
		'compress:chrome',
		'compress:firefox',
		'copy:dist_chrome',
		'copy:dist_firefox',
		'clean:tmp',
	] );

};
