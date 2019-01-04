var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    bourbon = require('node-bourbon'),
    ftp = require('vinyl-ftp'),
    rigger = require('gulp-rigger'),
    fileinclude = require('gulp-file-include'),
    jade = require('jade'),
    gulpJade = require('gulp-jade'),
    notify = require("gulp-notify"),
    sourcemaps = require('gulp-sourcemaps'),
    spritesmith = require('gulp.spritesmith'),
    pagebuilder = require('gulp-pagebuilder'),
    csso = require('gulp-csso'),
    concatCss = require('gulp-concat-css'),
    smartgrid = require('smart-grid');



/*********************************************
 * smart-grid
 ***********************************************/

/* It's principal settings in smart grid project */
var settings = {
    outputStyle: 'sass',
    /* less || scss || sass || styl */
    columns: 16,
    /* number of grid columns */
    offset: "30px",
    /* gutter width px || % */
    container: {
        maxWidth: '1280px',
        /* max-width оn very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {
        lg: {
            'width': '1200px',
            /* -> @media (max-width: 1100px) */
            'fields': '30px' /* side fields */
        },
        md: {
            'width': '960px',
            'fields': '15px'
        },
        sm: {
            'width': '780px',
            'fields': '15px'
        },
        xs: {
            'width': '560px',
            'fields': '15px'
        },


        tel: {
            'width': '320px',
            'fields': '7px'
        }

    }
};

smartgrid('app/libs/smart', settings);
/*********************************************
 * Объединение и минимизация JS
 ***********************************************/
gulp.task('scripts', function() {
    return gulp.src([
            'app/libs/js/jquery.min.js',
            'app/libs/js/bootstrap.min.js'
        ])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({ stream: true }));
});

/*********************************************
 * Объединение и минимизация CSS
 ***********************************************/

gulp.task('concat', function() {
    return gulp.src('app/libs/css/*.css')
        .pipe(concatCss("libs.min.css"))
        .pipe(gulp.dest('app/css/'));
});

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.sass')
        //.pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: bourbon.includePaths
        }).on("error", notify.onError()))
        //.pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(autoprefixer(['last 15 versions']))
        //.pipe(cleanCSS())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('csso', function() {
    return gulp.src('app/css/*.css')
        .pipe(csso())
        .pipe(gulp.dest('public/css/'));
});

// gulp.task('csso', function () {
//     return gulp.src('app/css/libs.min.css')
//         .pipe(csso())
//         .pipe(gulp.dest('public/css/'));
// });

/*********************************************
 * jade
 ***********************************************/

gulp.task('jade', function() {
    return gulp.src('jade/*.jade')
        .pipe(gulpJade({
            jade: jade,
            pretty: true
        }))
        .pipe(gulp.dest('app'));
});
/*********************************************
 *
 ***********************************************/
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false,
        // tunnel: true,
        // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
    });
});

/*********************************************
 *
 ***********************************************/
gulp.task('spritesmith', function() {
    var spriteData =
        gulp.src('app/img/sprites/*.*') // путь, откуда берем картинки для спрайта
        .pipe(spritesmith({
            imgName: 'sprite.png',
            imgPath: '../img/sprite.png',
            cssTemplate: 'app/img/tpl/spritesmith.cssTemplate',
            cssName: 'sprite.css',
            cssFormat: 'css',
            algorithm: 'binary-tree',
            cssVarMap: function(sprite) {
                sprite.name = sprite.name
            }
        }));

    spriteData.img.pipe(gulp.dest('app/img/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('app/sprite/')); // путь, куда сохраняем стили
});

gulp.task('watch', ['sass', 'csso', 'concat', 'spritesmith', 'jade', 'scripts', 'browser-sync'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/css/**/*.css', ['csso']);
    // gulp.watch('app/css/**/*.css', ['concat']);
    gulp.watch('app/img/sprite.png', ['spritesmith']);
    gulp.watch('jade/**/*.jade', ['jade']);
    gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
    gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'spritesmith', 'sass', 'scripts'], function() {

    var buildSprite = gulp.src([
        'app/img/*.png',
    ]).pipe(gulp.dest('dist'));

    var buildFiles = gulp.src([
        'app/*.html',
        'app/.htaccess',
    ]).pipe(gulp.dest('dist'));

    var buildCss = gulp.src([
        'app/css/main.min.css',
    ]).pipe(gulp.dest('dist/css'));

    var buildJs = gulp.src([
        'app/js/scripts.min.js',
    ]).pipe(gulp.dest('dist/js'));

    var buildFonts = gulp.src([
        'app/fonts/**/*',
    ]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function() {

    var conn = ftp.create({
        host: 'hostname.com',
        user: 'username',
        password: 'userpassword',
        parallel: 10,
        log: gutil.log
    });

    var globs = [
        'dist/**',
        'dist/.htaccess',
    ];
    return gulp.src(globs, { buffer: false })
        .pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function() { return cache.clearAll(); });

gulp.task('default', ['watch']);