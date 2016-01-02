var gulp = require('gulp');
var browserify = require("browserify");
var babelify = require("babelify");
var fs = require("fs");
var sass = require('gulp-sass');

gulp.task('default', ['es6', 'sass']);

gulp.task('es6',function(){
  var extensions = ['.js','.json','.es6'];
  return browserify({ debug: true, extensions:extensions })
    .transform(babelify.configure({
      extensions: extensions,
      presets: ["es2015", "react"]
    }))
    .require("./app/app.es6", { entry: true })
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); this.emit('end'); })
    .pipe(fs.createWriteStream("es5.js"))
});

gulp.task('sass', function () {
  gulp.src('./app/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/'));
});

gulp.task('watch', function () {
   gulp.watch('app/**/*.scss', ['sass']);
   gulp.watch('app/**/*.es6', ['es6']);
});
