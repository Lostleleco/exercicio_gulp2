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

// Tarefa para monitorar alterações nos arquivos
function watchFiles() {
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.styles.src, styles);
}

// Tarefa padrão
const build = gulp.series(
  gulp.parallel(images, styles),
  watchFiles
);

// Exportar tarefas
exports.images = images;
exports.styles = styles;
exports.default = build;
exports.watch = watchFiles;
