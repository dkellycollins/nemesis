var gulp = require('gulp');
var ts = require("gulp-tsc");
var merge = require("merge2");
var rimraf = require("rimraf");
var mocha = require("gulp-mocha");
var uglify = require("gulp-uglify");
var gutil = require('gulp-util');
var path = require("path");

var modules = [
   "nemesis",
   "nemesis.input",
   "nemesis.render3D"
   //"nemesis.shaders",
];

gulp.task("clean", function(cb) {
   rimraf("./build", cb);
});

gulp.task("scripts", ["clean"], function() {
   var results = [];

   modules.forEach(function(module) {
      //Source files
      var srcResult = gulp.src([
         "src/" + module + ".ts"
      ])
      .pipe(ts({
         declaration: true
      }))
      .pipe(gulp.dest("build/"));

      results.push(srcResult);

      //Test files
      var testResult = gulp.src([
         "test/" + module + "/**/*.ts"
      ])
      .pipe(ts({
         out: module + ".test.js"
      }))
      .pipe(gulp.dest("build/test/" + module));

      results.push(testResult);

      //Test page.
      var htmlResult = gulp.src(["test/" + module + "/index.html"])
         .pipe(gulp.dest("build/test/" + module + ""));

      results.push(htmlResult);
   });

   return merge(results);
});

gulp.task("test", ["scripts"], function() {
   var results = [];
   function testErrorHandler(err) {
      gutil.log(err.toString());
      exitCode = 1;
   }

   modules.forEach(function(module) {
      var result = gulp.src(["build/test/" + module + "/*.js", "build/test/" + module + "/**/*.js"])
         .pipe(mocha({
            ui: 'tdd',
            reporter: 'progress'
         }))
         .on("error", function(err) {
            testErrorHandler(err);
            process.emit('exit');
         });

      results.push(result);
   });

   return merge(results);
});

gulp.task("minify", ["test"], function() {
   return gulp.src(["build/*.js"])
      .pipe(uglify())
      .pipe(gulp.dest("build"));
});

gulp.task("debug", ["clean", "scripts", "test"]);
gulp.task("release", ["clean", "scripts", "test", "minify"]);

gulp.task("watch", ["scripts"], function() {
   gulp.watch("src/**/*.ts", ["scripts"]);
});