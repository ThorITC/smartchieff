var gulp      = require('gulp'),
    concatCss = require('gulp-concat-css'),
    concat    = require('gulp-concat'),
    jsmin     = require('gulp-jsmin'),
	  uglify    = require('gulp-uglify'),
    jade      = require('gulp-jade'),
	  cssnano   = require('gulp-cssnano');

var sources = {
  js:{
    requirences: [],
    application: [
      'app/main/appModule.js',
      'app/main/appConfig.js',
      'app/chief/module.js',
      'app/chief/service.js',
      'app/chief/controller.js'
    ]
  },
  css:{
    requirences: [],
    application: [
      'css/style.css'
    ]
  }
};

gulp.task('application', function(){
  gulp.src(sources.js.application)
      .pipe(concat('bundle.js'))
      .pipe(gulp.dest('js'));
});

gulp.task('jade-build', function(){
  gulp.src(['!./jade/index.jade', './jade/*.jade'])
      .pipe(jade({
          clients: true,
          pretty: true
        }))
      .pipe(gulp.dest('./templates/'));
});

gulp.task('css-build', function(){
  gulp.src(sources.css.application)
      .pipe(concat('bundle.css'))
      .pipe(gulp.dest('styles'));
});

gulp.task('default', ['application', 'jade-build', 'css-build']);

gulp.task('watch', function(){
  gulp.watch('app/**/*.js', ['application']);
  gulp.watch('jade/*.jade', ['jade-build']);
  gulp.watch('css/*.css', ['css-build']);
});
