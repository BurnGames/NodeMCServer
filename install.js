var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

// delete anything from previous things
removeDirectory('./node_modules');

// now run npm install
npmInstall('./', function (error) {
    if (error) {
        return console.warn('Failed to install NPM dependencies!');
    }
    console.log("Finished installing NPM dependencies, now downloading modules..");
    var async = require('async');
    async.series([
        function (callback) {
            downloadFile('NodeMCProtocol', 'https://api.github.com/repos/BurnGames/mc-protocol.js/zipball', function (error, path) {
                if (error) {
                    return callback(error);
                }
                npmInstall('./node_modules/NodeMCProtocol', callback);
            });
        },
        function (callback) {
            downloadFile('NodeMCWorldLoader', 'https://api.github.com/repos/BurnGames/mc-loader.js/zipball', function (error, path) {
                if (error) {
                    return callback(error);
                }
                npmInstall('./node_modules/NodeMCWorldLoader', callback);
            });
        }
    ], function (err) {
        if (err) {
            return;
        }
        console.log('Installed all dependencies. Starting..');
    });
});

function npmInstall(directory, callback, args) {
    if (!args) {
        args = '';
    } else {
        args = ' ' + args;
    }
    console.log('Installing NPM dependencies for "' + directory + '"..');
    var current = process.cwd();
    process.chdir(path.join(current, directory));
    exec('npm install' + args + ' --production', function (error, stdout, stderr) {
        if (error) {
            throw error;
        }
        if (stdout.on) {
            stdout.on('data', function (chunk) {
                process.stdout.emit('data', chunk);
            });
        }
        if (stderr.on) {
            stderr.on('data', function (chunk) {
                process.stderr.emit('data', chunk);
            });
        }
    }).on('error', function (error) {
        process.chdir(current);
        callback(error);
    }).on('close', function () {
        process.chdir(current);
        callback();
    });
}

function downloadFile(directory, url, callback) {
    var AdmZip = require('adm-zip');
    var request = require('request');
    console.log('Downloading "' + url + '"..');
    request(url, {
        followAllRedirects: true,
        encoding: null,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:35.0) Gecko/20100101 Firefox/35.0 Waterfox/35.0'
        }
    }, function (error, response, buffer) {
        if (error) {
            error.message = 'Failed to request URL\n' + error.message;
            return callback(error);
        }
        try {
            var zip = new AdmZip(buffer);
            var finalPath = path.join('./node_modules', directory);
            fs.mkdirSync(finalPath);
            var zipEntries = zip.getEntries();
            zipEntries.forEach(function (zipEntry) {
                var name = zipEntry.entryName.toString();
                zipEntry.entryName = zipEntry.entryName.toString().substr(zipEntry.entryName.toString().indexOf('/') + 1);
                if (zipEntry.isDirectory) {
                    if (zipEntry.entryName == '') {
                        return;
                    }
                    fs.mkdirSync(path.join(finalPath, zipEntry.entryName));
                } else if (zipEntry.entryName && zipEntry.entryName.trim() != '') {
                    var content = zipEntry.getData();
                    try {
                        fs.writeFileSync(path.join(finalPath, zipEntry.entryName), content);
                    } catch (err) {
                        err.message = 'Entry: ' + zipEntry.entryName + ' Path: ' + path.join(finalPath, zipEntry.entryName) + '\n' + err.message;
                        throw err;
                    }
                }
            });
            callback(undefined, finalPath);
        } catch (err) {
            //err.message = 'Bad Data:\n' + buffer + '\n' + err.message;
            callback(err);
        }
    });
}

function removeDirectory(dir) {
    if (fs.existsSync(dir)) {
        var list = fs.readdirSync(dir);
        for (var i = 0; i < list.length; i++) {
            var filename = path.join(dir, list[i]);
            var stat = fs.statSync(filename);
            if (filename == "." || filename == "..") {
            } else if (stat.isDirectory()) {
                removeDirectory(filename);
            } else {
                fs.unlinkSync(filename);
            }
        }
        fs.rmdirSync(dir);
    }
}