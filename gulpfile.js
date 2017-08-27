'use strict';

const gulp = require('gulp'),
  fs = require('fs'),
   path = require('path'),
    Builder = require('systemjs-builder'),
    ts = require('gulp-typescript'),
    sourcemaps  = require('gulp-sourcemaps'),
  gls = require('gulp-live-server');

let config = require('./config');
let server = gls.new('app.js');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('serve', () => {
  return server.start();
});

// All tasks are located in other files within the gulp folder
require('./gulp/scripts')(gulp, config, server);
require('./gulp/styles')(gulp, config, server);
require('./gulp/html')(gulp, config, server);
require('./gulp/deploy')(gulp, config);

gulp.task('watch:all', gulp.parallel('watch:scripts', 'watch:styles', 'watch:html'))
//gulp.task('default', gulp.series('scripts:dev', 'styles:dev', 'html:dev', 'visualforce:dev','moveTemplateToJs','bundle', gulp.parallel('watch:all', 'serve')));
gulp.task('default', gulp.series('scripts:dev', 'styles:dev', 'html:dev', 'visualforce:dev', gulp.parallel('watch:all', 'serve')));
