var gulp            = require("gulp");
var sass            = require("gulp-sass");
var postcss			= require('gulp-postcss');
var concat          = require("gulp-concat");
var autoprefixer	= require('autoprefixer');
//var browserlist     = require('')
var precss			= require('precss');
var imagemin		= require('gulp-imagemin');
// var livereload = require('gulp-livereload');
var browserSync		= require('browser-sync');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');

var buildDir    = 'build/';
var vendorDir   = './build/vendor/';
var imageDir    = './build/img/';
var fontsDir    = './build/fonts/';
var scssDir     = './build/styles/';
var scssboots   = './build/vendor/'
var jsDir       = './build/js/';
var distDir     = './dist/';
var reload = browserSync.reload;


/*gulp.task('server', function (event) {
    connect.server({
        root: './',
        port: 1987,
        livereload: true
    });

})
*/
gulp.task('browser-sync', ['styles'], function () {
    browserSync.init({
        server: "./"
    });
    gulp.watch( './*.html' ).on('change', reload);
    gulp.watch(jsDir + '*.js', ['js']);
    gulp.watch(scssDir + '*.scss', ['styles']);
})

gulp.task('styles', function () {
    var processors = [
        autoprefixer(),
        precss,
    ];
    gulp.src(scssDir + '*.scss')
        //.pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                vendorDir + 'bootstrap-sass/assets/stylesheets',
                vendorDir + 'font-awesome/scss'
            ],
            sourceMaps: 'sass',
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        //.pipe(sourcemaps.write())
        .pipe(postcss(processors))
        .pipe(concat('styles.min.css'))
        //.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(distDir + 'css'))
        //.pipe(livereload());
        .pipe(reload({stream:true}))
        .pipe(browserSync.stream() );
});


gulp.task( 'js', function () {
    gulp.src([jsDir + '/*.js', jsDir + '**/*' ])
        .pipe(concat('all.js'))
        .pipe(gulp.dest( distDir + 'js' ))
        //.pipe(livereload());
        .pipe(reload({stream:true}) )
		.pipe(browserSync.stream() );

    gulp.src([
        vendorDir + 'bootstrap-sass/assets/javascripts/bootstrap.min.js',
        vendorDir + 'jquery/dist/jquery.min.js'
    ])
        .pipe( gulp.dest( distDir + 'js/vendor' ) );

    gulp.src([
        jsDir + 'vendor/**/*'
    ])
        .pipe(gulp.dest( distDir + 'js/vendor' ));
} );


gulp.task('html', function () {
    gulp.src('./*.html')
        //.pipe(connect.reload);
        .pipe(reload({stream:true}) )
        .pipe(browserSync.stream() );
})


// images
gulp.task('fonts', function(){
    return gulp.src([ fontsDir + '**/*.{eot,woff2,woff,ttf}'])
        .pipe(gulp.dest(distDir + 'fonts/'))
})

// images
gulp.task('images', function(){
    return gulp.src([ imageDir + '**/*.{png,jpg,gif,svg}'])
        .pipe(imagemin({
            interlace: true
        }))
        .pipe(gulp.dest(distDir + 'img/'))
})

gulp.task('watch', function () {

    gulp.watch('htdocs/build/styles/**/*.scss', ['styles']);
    gulp.watch('htdocs/build/js/**/*.js', ['js']);
    gulp.watch('htdocs/build/img/**/*.{png,jpg,gif,svg}', ['images']);
    gulp.watch('htdocs/*.html', ['html']);
})

gulp.task('default', ['styles', 'js', 'watch', 'images', 'fonts', 'browser-sync']);

