'use strict';

const autoprefixer = require('autoprefixer');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const perfectionist = require('perfectionist');
const sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-clean-css');
const gncd = require('gulp-npm-copy-deps');

// Paths 

const Paths = {
    DIST: 'dist/',
    NODE: 'node_modules/',
    JS: 'scripts/',
    SCSS: 'scss/',
    FONTS: 'fonts/',
    IMG: 'img/',
    WEB: './', // Your website path 
    SOURCE: './',
    LIBS: 'libs/'
}

var processors = [
    autoprefixer(),
    perfectionist({
        maxAtRuleLength: false,
        maxSelectorLength: 1
    })
];

// Copy dependencies

gulp.task('copy-npm-deps', function(){
    return gncd('./node_modules', Paths.LIBS, {base: './'});
});

// Copy Libs styles

gulp.task('copy-tiny-slider-sass', function(){
    return gulp
        .src(Paths.LIBS + 'tiny-slider/src/*.scss')
        .pipe(gulp.dest(Paths.SCSS + 'libs/tiny-slider/'))
});

gulp.task('copy-fontawesome-sass', function(){
    return gulp
        .src(Paths.LIBS + '@fortawesome/fontawesome-free/scss/*.*')
        .pipe(gulp.dest(Paths.SCSS + 'libs/fontawesome/'))
});

gulp.task('copy-normalize-sass', function(){
    return gulp
        .src(Paths.LIBS + 'css-reset-and-normalize-sass/scss/**/*.scss')
        .pipe(gulp.dest(Paths.SCSS + 'libs/normalize'))
});

gulp.task('copy-sass-libs', gulp.series('copy-tiny-slider-sass', 'copy-fontawesome-sass', 'copy-normalize-sass'));

// Build styles

gulp.task('styles', function(){
    return gulp
        .src(Paths.SCSS + 'main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', notify.onError())
        .pipe(minify(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(Paths.DIST + 'css/'));
});

// Copy js libs

gulp.task('copy-libs-js', function(){
    return gulp
        .src([
            Paths.LIBS + 'tiny-slider/dist/tiny-slider.js',
            Paths.LIBS + 'lazysizes/lazysizes.js'
        ])
        .pipe(gulp.dest(Paths.JS + 'libs/'))
});

// Build js

gulp.task('build-js', function(){
    return gulp
        .src([
            Paths.JS + 'libs/lazysizes.js',
            Paths.JS + 'libs/tiny-slider.js',
            Paths.JS + 'main.js'
        ])
        .pipe(concat('yourfilename.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(Paths.DIST + 'js/'))
});

// Copy to web

gulp.task('release',function copyToWeb() {
    return gulp
        .src(Paths.DIST + '/**', { base: './' })
        .pipe(gulp.dest(Paths.WEB));
});

// Gulp Watch

gulp.task('watch', function watch() {
    global.watch = true;
    return gulp
        .watch([
            Paths.SCSS + '/**/*.scss',
            Paths.JS + '/**/*.js'
        ], gulp.series('styles', 'build-js', 'release'));
});


// Gulp init

gulp.task('init', gulp.series('copy-npm-deps', 'copy-sass-libs', 'copy-libs-js', 'styles', 'build-js', 'release', 'watch'))