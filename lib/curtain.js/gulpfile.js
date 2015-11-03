//Define tha vars, son.
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefix = require('gulp-autoprefixer')
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    notify = require('gulp-notify'),
    connect = require('gulp-connect'),
    //livereload = require('gulp-livereload'),
    concat = require('gulp-concat');

//Process dat s*ASS
gulp.task('styles', function () {
  return gulp.src('src/styles/curtain.scss')
  .pipe(sass({style: 'expanded'}))
  .pipe(autoprefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(gulp.dest('dist/assets/css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('dist/assets/css'))
  //.pipe(notify({message: 'Styles Complete'}))
  .pipe(connect.reload());
});

//Process duh javaskirts.
gulp.task('scripts', function () {
  return gulp.src('src/scripts/**/*.js')
  //.pipe(jshint('.jshint.rc'))
  .pipe(jshint.reporter('default'))
  .pipe(concat('curtain.dist.js'))
  .pipe(gulp.dest('dist/assets/js'))
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('dist/assets/js'))
  //.pipe(notify({message: 'Scripts Complete'}))
  .pipe(connect.reload());
});

//Connect Demo
gulp.task('html', function () {
  gulp.src('example/*.html')
    .pipe(connect.reload());
});

//Warsh that shit.
gulp.task('clean', function () {
  return gulp.src(['dist/assets/css','dist/assets/js'], {read: false})
  .pipe(clean());
});

//Defaults
gulp.task('default', ['connect','watch'], function () {
  gulp.start('styles','scripts');
});
//Server
gulp.task('connect', function() {
  connect.server({
    root: '',
    livereload: true
  });
});


//Watch
gulp.task('watch', function () {
  gulp.watch('src/styles/**/*.scss',['styles']);
  gulp.watch('src/scripts/**/*.js',['scripts']);
  gulp.watch(['example/**/*.html'], ['html']);
});
