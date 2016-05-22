var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('html', function () {
    gulp.src('source/jade/!(_)*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});

gulp.task('css', function () {
	gulp.src('source/sass/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename('style.css'))
		.pipe(gulp.dest('build/assets/css'))
});

gulp.task('js', function () {
    gulp.src('source/js/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/assets/js'))
});

gulp.task('watch', function () {
    gulp.watch('source/jade/*.jade', ['html']);
    gulp.watch('source/sass/*.scss', ['css']);
});

gulp.task('default', ['html', 'css', 'js']);