function PluginLoader() {

}

PluginLoader.prototype.load = function () {
    throw new Error('Not implemented');
};

PluginLoader.prototype.unload = function() {
    throw new Error('Not implemented');
};

module.exports = PluginLoader;