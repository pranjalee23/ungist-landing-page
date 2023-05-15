// Gulp.js configuration
const // modules
  gulp = require("gulp"),
  stripdebug = require("gulp-strip-debug"),
  uglify = require("gulp-uglify-es").default,
  rename = require("gulp-rename"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  mqpacker = require("css-mqpacker"),
  cssnano = require("cssnano"),
  sourcemaps = require("gulp-sourcemaps"),
  fileinclude = require("gulp-file-include"),
  removeemptylines = require("gulp-remove-empty-lines"),
  merge = require("merge-stream"),
  sass = require("gulp-sass")(require("sass")),
  cssbeautify = require("gulp-cssbeautify"),
  beautify = require("gulp-beautify");

// JS processing
function frontEndJS(done) {
  return (
    gulp
      .src("./assets/js/script-dev.js")
      // .pipe(sourcemaps.init({ loadMaps: true }))
      // .pipe(stripdebug())
      .pipe(uglify())
      .pipe(rename("script.js"))
      // .pipe(sourcemaps.write("maps"))
      .pipe(beautify.js({ indent_size: 4 }))
      .pipe(gulp.dest("./public/dist/js/"))
  );
  done();
}

gulp.task("js", function (done) {
  frontEndJS();
  done();
});

// SCSS processing
gulp.task("scss", function () {
  var postCssOpts = [autoprefixer({ overrideBrowserslist: ["last 2 versions", "Explorer >= 10", "Android >= 4.1", "Safari >= 7", "iOS >= 7"] }), mqpacker];
  postCssOpts.push(cssnano);
  return (
    gulp
      .src("./assets/scss/style-dev.scss")
      // .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sass().on("error", sass.logError))
      // .pipe(postcss(postCssOpts))
      // .pipe(uglify())
      .pipe(rename("style.css"))
      // .pipe(sourcemaps.write('maps'))
      // .pipe(beautify.css({ indent_size: 4 }))
      .pipe(gulp.dest("./public/dist/css"))
  );
});

// HTML processing
gulp.task("html", function () {
  return gulp.src(["./src/**/*.html", "!./src./**/_*.html", "!./src/_*.html"]).pipe(fileinclude()).pipe(removeemptylines()).pipe(gulp.dest("./public/"));
});

// build public package
gulp.task("build", function () {
  var images = gulp.src("./assets/images/**/*.*").pipe(gulp.dest("./public/dist/images/"));
  var json = gulp.src("./assets/data/*.*").pipe(gulp.dest("./public/dist/data/"));
  var downloads = gulp.src("./assets/downloads/*.*").pipe(gulp.dest("./public/dist/downloads/"));
  var css = gulp.src("./public/css/style.css", { allowEmpty: true }).pipe(gulp.dest("./public/dist/css/"));
  var js = gulp.src("./public/js/script.js", { allowEmpty: true }).pipe(gulp.dest("./public/dist/js/"));
  var js = gulp.src("./assets/js/jplist.min.js", { allowEmpty: true }).pipe(gulp.dest("./public/dist/js/"));
  var html = gulp.src("./public/**/*.html").pipe(gulp.dest("./public/"));
  // var myths_fact = gulp.src('./public/**/*.html')
  //   .pipe(gulp.dest('./public/**/'));
  var settings = gulp.src("./site.webmanifest").pipe(gulp.dest("./public/"));
  return merge(images, downloads, json, css, js, settings);
});

// run all tasks
gulp.task("run", gulp.parallel("js", "scss", "html", "build"));

// watch for changes
gulp.task("watch", function () {
  gulp.watch("assets/js/*.js", gulp.series(["js", "build"]));
  gulp.watch("assets/data/*.json", gulp.series(["build"]));
  gulp.watch("assets/scss/**/*.scss", gulp.series(["scss", "build"]));
  gulp.watch("assets/scss/**/**/*.scss", gulp.series(["scss", "build"]));
  gulp.watch("src/**/*.html", gulp.series(["html", "build"]));
  gulp.watch("src/**/**/*.html", gulp.series(["html", "build"]));
  gulp.watch("src/**/**/*.html", gulp.series(["html", "build"]));
});

// default task
gulp.task("default", gulp.series("run", "build", "watch"));
