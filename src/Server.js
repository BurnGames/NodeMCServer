var PluginManager = require('./plugins/PluginManager');
var Protocol = require('NodeMCProtocol');

function Server(directory) {
    console.log('Starting server in ' + directory + '..');
    this.directory = directory;

    // initialize managers
    this.pluginManager = new PluginManager(this);

    // initialize configuration
    this.config = require('config');

    // initialize our protocol
    this.protocol = new Protocol(this.config.ip, this.config.port);
    this.protocol.start();

    console.log('Server started.');
}

module.exports = Server;