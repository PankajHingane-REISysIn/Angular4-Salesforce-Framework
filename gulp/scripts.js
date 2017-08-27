module.exports = function(gulp, config, server) {
	'use strict';

	const sourcemaps = require('gulp-sourcemaps'),
				uglify = require('gulp-uglify'),
				ts = require('gulp-typescript'),
				lazypipe = require('lazypipe'),
				pug = require('pug'),
				inlineTemplates = require('gulp-inline-ng2-template');

	let tsProject = ts.createProject('tsconfig.json', {
		rootDir: 'src',
		typescript: require('typescript')
	});

	gulp.task('typescript:dev', () => {
		let tsResult =  tsProject.src('src/**/*.ts')
					.pipe(sourcemaps.init())
	        .pipe(ts(tsProject));

		return tsResult.js
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('build'));
	});

	gulp.task('typescript:prod', () => {
		let tsResult =  tsProject.src('src/**/*.ts')
					.pipe(sourcemaps.init())
					.pipe(ts(tsProject));

		return tsResult.js
			// .pipe(uglify({
			// 	mangle: false
			// }))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('build'));
	});

	var inlineTemplatesTask = lazypipe()
	  .pipe(inlineTemplates, {
	    base: '/build',
	    useRelativePaths: true,
	    templateProcessor: function(filepath, ext, file, cb) {
	      const rendered = pug.render(file, {
	        doctype: 'html',
	        filename: filepath,
	      });
	      cb(null, rendered);
	    },
	    templateExtension: '.pug',
  	});

  	gulp.task('pug:templates', function() {
	  return gulp.src(['build/app/components/**/*.js','!build/app/components/**/*.spec.js'], {base: 'build'})
	    .pipe(inlineTemplatesTask())
	    .pipe(gulp.dest('temp/inline/'));
	});

	gulp.task('pug:move', () => {
		return gulp.src(['src/**/*.pug'])
			.pipe(gulp.dest('build'));
	});

	gulp.task('javascript:dev', () => {
		return gulp.src(['src/**/*.js'])
			.pipe(gulp.dest('build'));
	});

	gulp.task('javascript:prod', () => {
		return gulp.src(['src/**/*.js'])
			.pipe(uglify({
				mangle: false
			}))
			.pipe(gulp.dest('build'));
	});

	gulp.task('svg:dev', () => {
		return gulp.src(['src/**/*.svg'])
			.pipe(gulp.dest('build'));
	});

	gulp.task('svg:prod', () => {
		return gulp.src(['src/**/*.svg'])
			.pipe(gulp.dest('build'));
	});

	gulp.task('scripts:dev', gulp.parallel('typescript:dev', 'javascript:dev', 'svg:dev', 'pug:move', 'pug:templates'));
	gulp.task('scripts:prod', gulp.parallel('typescript:prod', 'javascript:prod', 'svg:prod', 'pug:move', 'pug:templates'));

	gulp.task('watch:scripts', () => {
		gulp.watch('src/**/*.ts', gulp.series('typescript:dev'));
		gulp.watch(['src/**/*.js', 'src/systemjs.config.js'], gulp.series('javascript:dev'));
	});
}
