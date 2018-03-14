var shell = require('shelljs')

var build = function (){

  shell.mkdir('-p', 'dist/css', 'dist/javascript');
  shell.echo('clean dist folder...')

  shell.rm('-f','dist/css/main.css')
  shell.rm('-f','dist/javascript/main.js')

  shell.ls('dist/*.html').forEach(function (file) {
    console.log('remove file ' + file);
    shell.rm('-f', file);
  });

  shell.echo('')
  shell.echo('clean "private" pages folder...')
  //for each "-src.hmlt" in pages folder execute minify and output to dist folder
  //exemplo "teste-src.html" vai "minimizar" e virar "teste.html"
  //nota: não remove paginas minimizadas que foram apagadas manualmente
  shell.ls('pages/*-src.html').forEach(function (file) {
    var files = file.split('/'); //'user-src.html'
    var filesNosrc = files[1].split('-'); //user
    shell.exec('html-minifier --minify-js --collapse-whitespace --remove-comments --remove-tag-whitespace --collapse-inline-tag-whitespace --trim-custom-fragments --remove-tag-whitespace pages/' + files[1] + ' -o pages/' + filesNosrc[0] + '.html')
    console.log('minify src file: ' + files[1] + ' to ' + filesNosrc[0] + '.html')
  });


  shell.echo('')
  shell.echo('run browserify in src folder')
  shell.exec('browserify src/javascript/main.js | uglifyjs > dist/javascript/main.js')

  shell.echo('run html-minifier in src folder')

  //for each hmlt page in src folder execute minify and output to dist folder
  shell.ls('src/*.html').forEach(function (file) {
    var files = file.split('/'); //'src/index.html'
    console.log('minify file ' + files[1]) //'index.html'
    shell.exec('html-minifier --minify-js --collapse-whitespace --remove-comments --remove-tag-whitespace --collapse-inline-tag-whitespace --trim-custom-fragments --remove-tag-whitespace src/' + files[1] + ' -o dist/' + files[1])
  });

  shell.echo('')
  shell.echo('run cleancss')
  shell.exec('cleancss src/css/main.css -o dist/css/main.css')
}

module.exports.build = build
build();
