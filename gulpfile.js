'use strict';
 
var gulp = require('gulp');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var fs = require("fs");
var size = require('gulp-size');
var wrap = require("gulp-wrap");
var cleanCSS = require('gulp-clean-css');

gulp.task('clean', function () {
  return gulp.src('build', {read: false})
    .pipe(clean())
});

gulp.task('js', function() {
  // for efficiency not using dep management so just manually control concat order
  return gulp.src([
      './src/js/glMatrix.custom.min.js',
      './src/js/globals.js',
      './src/js/utils.js',
      './src/js/webgl.js',
      './src/js/shaders.js',
      './src/js/buffers.js',
      './src/js/world.js',
      './src/js/player.js',
      './src/js/view.js',
      './src/js/controller.js'
    ])
    .pipe(concat('main.js'))
    //.pipe(wrap('(function(){<%= contents %>})();', {}, { parse: false }))
    .pipe(gulp.dest('./tmp'));
});

gulp.task('css', function() {
  // for efficiency not using dep management so just manually control concat order
  return gulp.src('./src/css/main.css')
    .pipe(gulp.dest('./tmp'));
});

gulp.task('html', function() {
  return gulp.src(['./src/index.html'])
    .pipe(replace('{{JS}}', fs.readFileSync('./tmp/main.js', 'utf8')))
    .pipe(replace('{{CSS}}', fs.readFileSync('./tmp/main.css', 'utf8')))
    .pipe(replace('{{LEAVES_ENCODING}}', fs.readFileSync('./base64Textures/leaves.txt', 'utf8')))
    .pipe(replace('{{TREE_TRUNK_ENCODING}}', fs.readFileSync('./base64Textures/tree-trunk.txt', 'utf8')))
    .pipe(replace('{{GROUND_ENCODING}}', fs.readFileSync('./base64Textures/ground.txt', 'utf8')))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch', function () {
  return gulp.watch('./src/**/*', ['default']);
});

gulp.task('zip', function() {
  return gulp.src('./build/index.html')
    .pipe(zip('index.html.zip'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('size', function() {
  return gulp.src('./dist/index.html.zip')
    .pipe(size())
});

gulp.task('compress-js', function () {
  return gulp.src('./tmp/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('./tmp'))
});

gulp.task('compress-css', function () {
  return gulp.src('./tmp/main.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('./tmp'))
});

gulp.task('default', function() {
  runSequence('clean', 'js', 'css', 'html');
});

gulp.task('prod', function() {
  runSequence('clean', 'js', 'css','compress-js', 'compress-css', 'html', 'zip', 'size');
});
