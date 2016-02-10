module.exports = function ( grunt ) {

	// Load all installed Grunt modules
	require('load-grunt-tasks')(grunt);

	// Task Configuration
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		banner: '/*' + '\n' +
		' * Package:  @@name' + '\n' +
		' * Version:  @@version' + '\n' +
		' * Author:   @@author' + '\n' +
		' * Modified: @@timestamp' + '\n' +
		' */' + '\n',

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
			chrome : {
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
						cwd   : '<%= src_folder %>/img/',
						src   : [ '**/*' ],
						dest  : '<%= build_folder %>/chrome/data/img/'
					},
					{
						expand: true,
						cwd   : '<%= src_folder %>/img/',
						src   : [ '**/*' ],
						dest  : '<%= build_folder %>/firefox/data/img/'
					},
				],
			},

			css: {
				files: [
					{
						expand: true,
						cwd   : '<%= src_folder %>/css/',
						src   : [ '**/*' ],
						dest  : '<%= build_folder %>/chrome/data/css/'
					},
					{
						expand: true,
						cwd   : '<%= src_folder %>/css/',
						src   : [ '**/*' ],
						dest  : '<%= build_folder %>/firefox/data/css/'
					},
				],
			},

			html: {
				files: [
					{
						expand: true,
						cwd   : '<%= src_folder %>/html/',
						src   : [ '**/*' ],
						dest  : '<%= build_folder %>/chrome/data/html/'
					},
					{
						expand: true,
						cwd   : '<%= src_folder %>/html/',
						src   : [ '**/*' ],
						dest  : '<%= build_folder %>/firefox/data/html/'
					},
				],
			},

			template_chrome: {
				files: [
					{
						expand: true,
						cwd   : '<%= template_folder %>/chrome/',
						src   : [ '**/*' ],
						dest  : '<%= build_folder %>/chrome/'
					},
					{
						expand: true,
						cwd   : '<%= tmp_folder %>',
						src   : [ '**/*' ],
						dest  : '<%= build_folder %>/chrome/data/'
					}
				]
			},

			template_firefox: {
				files: [
					{
						expand: true,
						cwd   : '<%= template_folder %>/firefox/',
						src   : [ '**/*' ],
						dest  : '<%= build_folder %>/firefox/'
					},
					{
						expand: true,
						cwd   : '<%= tmp_folder %>',
						src   : [ '**/*' ],
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

		replace: {
			dist: {
				options: {
					patterns: [
						{
							match      : 'name',
							replacement: '<%= pkg.name %>'
						},
						{
							match      : 'title',
							replacement: '<%= pkg.title %>'
						},
						{
							match      : 'description',
							replacement: '<%= pkg.description %>'
						},
						{
							match      : 'version',
							replacement: '<%= pkg.version %>'
						},
						{
							match      : 'timestamp',
							replacement: '<%= grunt.template.today("isoDateTime") %>'
						},
						{
							match      : 'license',
							replacement: '<%= pkg.license %>'
						},
						{
							match      : 'author',
							replacement: '<%= pkg.author %>'
						},
						{
							match      : 'homepage',
							replacement: '<%= pkg.homepage || "--" %>'
						},
					],
				},
				files  : [
					{
						expand: true,
						cwd   : '<%= build_folder %>',
						src   : [ '**/*', '!**/*.{png,gif,jpg,ico,psd,ttf,otf,woff,svg}' ],
						dest  : '<%= build_folder %>',
					},
				],
			},
		},

		watch: {
			options: {
				spawn: false,
			},
			src    : {
				files: [ '<%= src_folder %>/**/*', '<%= template_folder %>/**/*' ],
				tasks: [ 'buildall' ],
			},
		},

	});

	// Task Registration
	grunt.registerTask('default', [
		'buildall',
		'watch',
	]);

	grunt.registerTask('buildall', [
		'clean:all',
		'buildimg',
		'buildjs',
		'buildcss',
		'buildhtml',
		'buildaddontemplates',
		'clean:tmp',
	]);

	grunt.registerTask('buildjs', [
		'copy:scripts',
	]);

	grunt.registerTask('buildcss', [
		'copy:css',
	]);

	grunt.registerTask('buildimg', [
		'copy:images',
	]);

	grunt.registerTask('buildhtml', [
		'copy:html',
	]);

	grunt.registerTask('buildaddontemplates', [
		'copy:template_chrome',
		'copy:template_firefox',
		'replace',
	]);

	grunt.registerTask('dist', [
		'buildall',
		'compress:chrome',
		'compress:firefox',
		'copy:dist_chrome',
		'copy:dist_firefox',
		'clean:tmp',
	]);

};
