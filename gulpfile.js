const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const fs = require('fs');

// Caminhos dos arquivos
const paths = {
  images: {
    src: 'src/images/**/*.{jpg,jpeg,png,gif,svg}',
    dest: 'dist/images'
  },
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/styles'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/scripts'
  }
};

// Tarefa para comprimir imagens
async function images() {
  const imagemin = (await import('gulp-imagemin')).default;
  return gulp.src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));
}

// Tarefa para compilar SASS
function styles(done) {
  if (!fs.existsSync('src/styles')) {
    console.error('Erro: Diretório src/styles não encontrado');
    done();
    return;
  }

  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.styles.dest));
}

// Tarefa para minificar JavaScript
function scripts() {
  const terser = require('gulp-terser');
  return gulp.src(paths.scripts.src)
    .pipe(terser())
    .pipe(gulp.dest(paths.scripts.dest));
}

// Tarefa para monitorar alterações nos arquivos
function watchFiles() {
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
}

// Tarefa padrão
const build = gulp.series(
  gulp.parallel(images, styles, scripts),
  watchFiles
);

// Exportar tarefas
exports.images = images;
exports.styles = styles;
exports.scripts = scripts;
exports.default = build;
exports.watch = watchFiles;
