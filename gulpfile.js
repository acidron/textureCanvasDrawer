//require('es6-promise').polyfill();
var gulp   = require('gulp'),
    concat = require('gulp-concat');

var browserSync = null;

gulp.task("js", function() {
	var stream = gulp.src("source/js/*.js")
		.pipe(concat('app.js'))
		.pipe(gulp.dest("build/"));
	if (browserSync) {
		stream.pipe(browserSync.stream());
	}
	return stream;
});

gulp.task("watch", ["js"], function() {
	browserSync = require('browser-sync').create();
    browserSync.init({
        open: false,
        notify: false,
        reload: true,
        proxy: '192.168.33.10/latista'
    });
	gulp.watch("source/js/*.js", ["js"]);
});

gulp.task('default', [ "watch"]);