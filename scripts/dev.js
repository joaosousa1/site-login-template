var dev = require('./build')
var choki = require('chokidar') //e um wach que verifica alterações numa pasta e chaa um callback

// roda o build sempre que ha alteraões na pasta src/
choki.watch('src/', {ignored: /(^|[\/\\])\../}).on('change', (event, path) => {
  console.log(event, path);
  dev.build();
});
