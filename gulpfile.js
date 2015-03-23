var gulp = require('gulp');
var ts = require("gulp-tsc");
var merge = require("merge2");
var rimraf = require("rimraf");
var mocha = require("gulp-mocha");
var uglify = require("gulp-uglify");
var gutil = require('gulp-util');
var path = require("path");
var through = require("through");

var modules = [
   "nemesis",
   "nemesis.input",
   "nemesis.render3D"
];

gulp.task("clean", function(cb) {
   rimraf("./build", cb);
});

gulp.task("scripts:src", function() {
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
   });

   return merge(results);
});

gulp.task("scripts:test", function() {
   var results = [];

   modules.forEach(function(module) {
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

gulp.task("scripts:shaders", function() {
   return gulp.src(["src/nemesis.shaders/**/*.glsl"])
      /*.pipe(function shaders() {
         //Based on gulp-shaders.js from Babylon.js https://github.com/BabylonJS/Babylon.js/blob/master/Tools/Gulp/gulp-shaders.js

         var firstFile = null;
         var content = {};

         function bufferContents(file){
            if (file.isNull()) return; // ignore

            if (!firstFile) firstFile = file;

            var fileName = file.path
               .replace(file.base, '');

            content[fileName] = file.contents.toString();
         }

         function endStream(){

            var joinedPath = path.join(firstFile.base, "nemesis.shaders.js");

            var joinedFile = new gutil.File({
               cwd: firstFile.cwd,
               base: firstFile.base,
               path: joinedPath,
               contents: new Buffer(JSON.stringify(content))
            });

            this.emit('data', joinedFile);
            this.emit('end');
         }

         return through(bufferContents, endStream);
      })
      .pipe(gulp.dest("build"))*/
      .pipe(gulp.dest("build/nemsis.shaders"));
});

gulp.task("scripts", ["scripts:src", "scripts:shaders", "scripts:test"]);

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