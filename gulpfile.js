// ==========================================================================//
//    1 --- IMPORTS AND VARIABLES                                            //
//========================================================================== //

// PLUGIN CALLS
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var compass = require('gulp-compass');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var stylish = require('jshint-stylish');
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');
var changed = require('gulp-changed');


// ==========================================================================//
//    1.1 --- GENERAL FILE PATHS                                             //
//========================================================================== //


// ==========================================================================//
//    1.2 --- JAVASCRIPT PATHS                                               //
//========================================================================== //

// WATCH PATH
var jsWatch = 'js/**/*.js';
// GENERAL PATH
var jsPath = 'js';
// MINIFY PATHS
var jsMinSrc = 'js/min/scripts.min.js';
var jsMinDest = 'js/min';
// CONCAT PATHS
var jsConcatSrc =  'js/*.js';
var jsConcatDest = 'scripts.min.js';
// LINT SOURCE
var jsLintSrc = 'js/scripts.js';


// ==========================================================================//
//    1.3 --- SASS/CSS PATHS                                                 //
//========================================================================== //

// WATCH PATH
var sassWatch = 'sass/**/*.scss';
// SASS COMPILE
var sassCompile = 'sass/*.scss'
//SASS PATH
var sassPath = 'sass';
// CSS PATH
var cssPath = 'css';
// CONFIG.RB PATH
var configPath = 'sass/config.rb';


// ==========================================================================//
//    1.4 --- HTML AND PHP PATHS                                             //
//========================================================================== //

var htmlSrc = '**/*.html';
var phpSrc = '**/*.php';


// ==========================================================================//
//    1.5 --- IMAGE PATHS                                                    //
//========================================================================== //

var imgPath = 'img';

// ==========================================================================//
//    1.6 --- PLUGIN SETTINGS                                                //
//========================================================================== //

//PLUGIN SETTINGS
var compassSettings = {
    config_file: configPath,
    css: cssPath,
    sass: sassPath,
}

// ==========================================================================//
//    2.0 --- TASKS                                                          //
//========================================================================== //

//WATCH
gulp.task('watch', function(){
    gulp.watch(jsWatch, [ 'js-lint', 'js-process']);
    gulp.watch(sassWatch, ['sass']);
    gulp.watch(htmlSrc, ['html-reload']);
    gulp.watch(phpSrc, ['php-reload']);
});

// ==========================================================================//
//    2.1 --- JAVASCRIPT                                                     //
//========================================================================== //

//LINT JS
gulp.task('js-lint', function() {
    gulp.src(jsLintSrc)
        .pipe(plumber())
        .pipe(changed(jsConcatSrc))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
});

//CONCAT & MINIFY
gulp.task('js-process', function() {
    gulp.src(jsConcatSrc)
        .pipe(changed(jsConcatSrc))
        .pipe(plumber())
        .pipe(concat(jsConcatDest))
        .pipe(uglify())
        .pipe(gulp.dest(jsMinDest))
});

// ==========================================================================//
//    2.2 --- SASS                                                           //
//========================================================================== //

//COMPILE SASS
gulp.task('sass', function() {
    gulp.src(sassCompile)
        .pipe(plumber())
        .pipe(changed(sassWatch))
        .pipe(compass(compassSettings))
        .pipe(gulp.dest(cssPath))
        .pipe(livereload())
});


// ==========================================================================//
//    0.1 --- HTML AND PHP RELOAD                                            //
//========================================================================== //

gulp.task('html-reload', function(){
    return gulp.src(htmlSrc)
        .pipe(changed(htmlSrc))
        .pipe(livereload())
});

gulp.task('php-reload', function(){
    return gulp.src(phpSrc)
        .pipe(changed(phpSrc))
        .pipe(livereload())
});


// ==========================================================================//
//    3.0 --- CONNECT SERVER                                                 //
//========================================================================== //

gulp.task('connect', function() {
  connect.server();
});

// ==========================================================================//
//    4.0 --- CUSTOM TASKS                                                   //
//========================================================================== //

gulp.task('default', ['sass', 'js-lint', 'js-process', 'watch'] );
gulp.task('js-debug', ['js-lint'] );
gulp.task('serve', ['connect', 'sass', 'js-lint', 'js-process', 'watch'] );
gulp.task('production', ['sass', 'js-process']);
