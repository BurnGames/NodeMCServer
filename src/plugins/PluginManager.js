var IOUtils = require('../utils/IOUtils');
var fs = require('fs');

var variables = {};

/**
 * Creates a new PluginManager
 * @param server
 * @constructor
 */
function PluginManager(server) {
    this.server = server;
    variables[this] = {
        plugins: []
    };
}

PluginManager.prototype.getPlugins = function() {
    return variables[this].plugins.slice(0);
};

PluginManager.prototype.getPlugin = function(name) {
    if(!name) {
        return undefined;
    }
    var plugins = variables[this].plugins;
    var length = plugins.length;
    while(length--) {
        var plugin = plugins[i];
        if(plugin.name == name) {
            return plugin.plugin;
        }
    }
};

PluginManager.prototype.isPluginEnabled = function(plugin) {
    if(typeof plugin == 'string') {
        return !!this.getPlugin(name);        
    } else if(!plugin) {
        return false;
    }
    var plugins = variables[this].plugins;
    var length = plugins.length;
    while(length--) {
        if(plugins[length] == plugin) {
            return true;
        }
    }
    return false;
};

PluginManager.prototype.loadPlugin = function(file, callback) {
    if(typeof file != 'string' || !(file instanceof Buffer)) {
        throw new Error('File must be supplied');        
    }
    if(typeof file == 'string') {
        fs.stat(file, function(err, stat) {
            if(err) {
                return callback(err);                
            }
            if(stat.isDirectory()) {
                loadPluginDirectory(file, callback);
            } else {
                fs.readFile(file, function(err, buffer) {
                    if(err) {
                        return callback(err);                        
                    }
                    fs.unlink(file);
                    loadPluginBuffer(buffer, callback);
                });
            }
        });
    } else {
        loadPluginBuffer(file, callback);
    }
};

function loadPluginBuffer(buffer, callback) {
    if(IOUtils.isGz(buffer)) {
        // tarball
        
    } else if(IOUtils.isZipArchive(buffer)) {
        // zip file
    } else {
        callback(new Error('Raw buffer of unknown type'));
    }
}

function loadPluginDirectory(directory, callback) {
    
}

module.exports = PluginManager;