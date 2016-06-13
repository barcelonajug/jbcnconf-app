var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
<<<<<<< HEAD
    runSequence = require('run-sequence'),
    argv = process.argv;

=======
    argv = process.argv;


>>>>>>> 5c03710b92e80f411f7a828fd0fba9dc75826b32
/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
<<<<<<< HEAD
gulp.task('build:before', ['build']);
=======
>>>>>>> 5c03710b92e80f411f7a828fd0fba9dc75826b32

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');

<<<<<<< HEAD
var isRelease = argv.indexOf('--release') > -1;

gulp.task('watch', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts'],
    function(){
      gulpWatch('app/**/*.scss', function(){ gulp.start('sass'); });
      gulpWatch('app/**/*.html', function(){ gulp.start('html'); });
      buildBrowserify({ watch: true }).on('end', done);
    }
  );
});
gulp.task('build', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts'],
    function(){
      buildBrowserify({
        minify: isRelease,
        browserifyOptions: {
          debug: !isRelease
        },
        uglifyOptions: {
          mangle: false
        }
      }).on('end', done);
    }
  );
});

=======
gulp.task('watch', ['sass', 'html', 'fonts', 'scripts'], function(){
  gulpWatch('app/**/*.scss', function(){ gulp.start('sass'); });
  gulpWatch('app/**/*.html', function(){ gulp.start('html'); });
  return buildBrowserify({ watch: true });
});

gulp.task('build', ['sass', 'html', 'fonts', 'scripts'], buildBrowserify);
>>>>>>> 5c03710b92e80f411f7a828fd0fba9dc75826b32
gulp.task('sass', buildSass);
gulp.task('html', copyHTML);
gulp.task('fonts', copyFonts);
gulp.task('scripts', copyScripts);
<<<<<<< HEAD
gulp.task('clean', function(){
  return del('www/build');
});

// Run typescript linter on the app folder
gulp.task('tslint', function() {
  var tslint = require('gulp-tslint');
  return gulp.src([
      'app/**/*.ts'
    ]).pipe(tslint())
      .pipe(tslint.report('verbose'));
=======
gulp.task('clean', function(done){
  del('www/build', done);
>>>>>>> 5c03710b92e80f411f7a828fd0fba9dc75826b32
});
