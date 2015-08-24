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

    var onConnect = this.protocol.onConnect.bind(this.protocol);
    this.protocol.onConnect = function(connection) {
        onConnect(connection);
        console.log('Received new player ' + connection.player);
        connection.write(0x02, {message: JSON.stringify({text: "Welcome to the Node Minecraft Server!"}), position: 0});
    };

    console.log('Server started.');
}

module.exports = Server;
