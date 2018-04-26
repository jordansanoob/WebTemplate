//  REQUIRE

const gulp = require('gulp');
const bs = require('browser-sync').create();
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

var tree = {
    ext: {
        js: '/*.js',
        sass: '/*.scss',
        html: '/*.html'
    },
    src: {
        root: 'src',
        js: 'src/js',
        sass: 'src/sass',
        css: 'src/css',
        includes: 'src/includes',
    },
    dist: {
        root: 'dist',
        js: 'dist/js',
        css: 'dist/css',
        includes: 'dist/includes'
    }
}

//Helper functions

function runSass(src, dest) {
    gulp.src(src + tree.ext.sass)
        .pipe(sass())
        .pipe(uglify())
        .pipe(gulp.dest(dest));
}

function runIncludes(src, dest) {
    gulp.src(src + tree.ext.html)
        .pipe(gulp.dest(dest));
}

function runJS(src, dest) {
    gulp.src(src + tree.ext.js)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dest));
}

//SASS task
gulp.task('sass', function () {
    return gulp.src(tree.src.sass + tree.ext.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(tree.src.css))
        .pipe(bs.stream());
});

// DISTRIBUTION TASKS
gulp.task('build', function () {
    //Copy index file
    gulp.src(tree.src.root + tree.ext.html)
        .pipe(gulp.dest(tree.dist.root))

    //Compile SASS and copy to dist folder
    runSass(tree.src.sass, tree.dist.css)

    //Concat JS files and minify
    runJS(tree.src.js, tree.dist.js);

    //Copy Includes files
    runIncludes(tree.src.includes, tree.dist.includes)

    //Copy Bootstrap and JQuery

});

// DEVELOPMENT TASKS
gulp.task('dev', ['sass'], function () {
    //Initialize the browersync
    bs.init({
        server: './src'
    })

    //Watch changes in src folder
    gulp.watch([tree.src.sass + tree.ext.sass], ['sass'])
    gulp.watch([tree.src.root + tree.ext.html, tree.src.includes + tree.ext.html]).on('change', bs.reload);
});


