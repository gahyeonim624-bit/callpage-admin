const gulp = require("gulp");
const connect = require("gulp-connect");
const del = require("del");
const sass = require("gulp-sass")(require("sass"));
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const fileinclude = require("gulp-file-include");
const prettier = require("gulp-prettier");
const autoprefixer = require("gulp-autoprefixer");
const htmllint = require("gulp-htmllint");
const fancyLog = require("fancy-log");
const colors = require("ansi-colors");

const src = "src";
const dist = "dist";

const paths = {
  js: src + "/assets/js/**",
  css: src + "/assets/css/**",
  scss: src + "/assets/scss/*.scss",
  scssCopy: src + "/assets/scss/**",
  html: src + "/**/*.html",
  img: src + "/assets/images/**",
  font: src + "/assets/fonts/**",
  lib: src + "/assets/lib/**",
};

// eslint-disable-next-line no-unused-vars
function done(cb) {
  console.log("Finished");
  cb();
}

export const clean = () => del(["dist"]);

function htmllintReporter(filepath, issues) {
  if (issues.length > 0) {
    issues.forEach(function (issue) {
      fancyLog(colors.blue("[gulp-htmllint] ") + colors.white(filepath + " [" + issue.line + "," + issue.column + "]: ") + colors.red("(" + issue.code + ") " + issue.msg + colors.cyan("(" + issue.rule + ") ")));
    });

    process.exitCode = 1;
  }
}

function html() {
  return (
    gulp
      .src([paths.html])
      //.pipe(htmllint({}, htmllintReporter))
      .pipe(
        fileinclude({
          prefix: "@@", //사용할땐 앞에@@ 를 붙이면됨
          basepath: "@file",
        }),
      )
      .pipe(prettier({ singleQuote: true, printWidth: 300 }))
      .pipe(gulp.dest(dist))
      .pipe(connect.reload())
  );
}

function js() {
  return (
    gulp
      .src(paths.js) //개발코드 위치
      //.pipe(babel()) // es6 -> es5로 컴파일
      .pipe(gulp.dest(dist + "/assets/js")) // dist에 복사
      .pipe(connect.reload())
  ); //변경되면 실시간 새로고침
}

function scss() {
  return gulp
    .src(paths.scss) //개발코드 위치
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded",
        silenceDeprecations: ["legacy-js-api", "import", "if-function", "global-builtin", "color-functions"],
        quietDeps: true,
      }).on("error", sass.logError),
    ) // 사스로 컴파일
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("./")) // 소스맵생성
    .pipe(gulp.dest(dist + "/assets/css")) // dist에 복사
    .pipe(connect.reload()); //변경되면 실시간 새로고침
}

function scssCopy() {
  return gulp
    .src(paths.scssCopy) //개발코드 위치
    .pipe(gulp.dest(dist + "/assets/scss/")) // dist에 복사
    .pipe(connect.reload()); //변경되면 실시간 새로고침
}

function lib() {
  return gulp
    .src(paths.lib) //개발코드 위치
    .pipe(gulp.dest(dist + "/assets/lib/")) // dist에 복사
    .pipe(connect.reload()); //변경되면 실시간 새로고침
}

function font() {
  return gulp
    .src(paths.font) //개발코드 위치
    .pipe(gulp.dest(dist + "/assets/fonts")) // dist에 복사
    .pipe(connect.reload()); //변경되면 실시간 새로고침
}

function image() {
  return gulp
    .src(paths.img) //개발용 이미지 위치
    .pipe(gulp.dest(dist + "/assets/images")) // dist에 복사
    .pipe(connect.reload()); //변경되면 실시간 새로고침
}

function server(done) {
  connect.server({
    root: "./dist/",
    livereload: true,
    // host: "192.168.219.106",
    port: 3030,
  });

  done();
}

function watcher(done) {
  gulp.watch(paths.js, gulp.series(js));
  gulp.watch(src + "/assets/scss/**/*.scss", gulp.series(scss));
  gulp.watch(paths.html, gulp.series(html));
  gulp.watch(paths.img, gulp.series(image));
  gulp.watch(paths.lib, gulp.series(lib));

  done();
}

const build = gulp.series(clean, gulp.parallel(js, font, image, scss, scssCopy, html, lib, watcher, server));

export const buildOnly = gulp.series(clean, gulp.parallel(js, font, image, scss, scssCopy, html, lib));

exports.default = build;
