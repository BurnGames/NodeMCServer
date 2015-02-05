var fs = require('fs');

if (!fs.existsSync('./node_modules') || fs.readdirSync('./node_modules').length == 0) {
    // let's start installing
    require('./install');
}