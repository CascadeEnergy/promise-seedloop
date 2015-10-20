/*eslint-disable */
'use strict';

var gulp = require('gulp');

gulp.task('watch', function() {
  var testFiles = [
    'es6/**/*',
    'es6/test/**/*',
    'package.json',
    '**/.eslintrc'
  ];

  gulp.watch(testFiles, ['test']);
});

gulp.task('watch-build', function() {
  gulp.watch(['es6/**/*'], ['test', 'transpile']);
});
