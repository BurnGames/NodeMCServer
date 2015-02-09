var fs = require('fs');

console.log('Loading libraries..');
if (!fs.existsSync('./node_modules') || fs.readdirSync('./node_modules').length == 0) {
    // let's start installing
    console.log('Installing libraries..');
    require('./install');
}
console.log('Libraries loaded.');

var Server = require('./src/Server');
var server = new Server(process.cwd());