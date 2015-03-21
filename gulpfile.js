var gulp = require('gulp');
var ts = require("gulp-tsc");
var merge = require("merge2");
var rimraf = require("rimraf");
var mocha = require("gulp-mocha");
var uglify = require("gulp-uglify");

var modules = [
   "nemesis"
   //"nemesis.gui",
   //"nemesis.input",
   //"nemesis.logger",
   //"nemesis.render3D",
   //"nemesis.shaders",
];

gulp.task("clean", function(cb) {
   rimraf("./build", cb);
});

gulp.task("scripts", ["clean"], function() {
   var results = [];

   modules.forEach(function(module) {
      var result = gulp.src(["src/" + module + "/*.ts", "src/" + module + "/**/*.ts"])
         .pipe(ts({
            declaration: true,
            out: module + ".js"
         }))
         .pipe(gulp.dest("build"));

      results.push(result);
   });

   return merge(results);
});

gulp.task("test", ["scripts"], function() {
   var results = [];

   modules.forEach(function(module) {
      var result = gulp.src(["build/test/" + module + "/*.js", "build/test/" + module + "/**/*.js"])
         .pipe(mocha({
            ui: 'tdd',
            reporter: 'progress'
         }));

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