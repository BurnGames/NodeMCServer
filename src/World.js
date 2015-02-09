var Chunk = require('NodeMCWorldLoader/src/chunk/Chunk');
var ChunkIoService = require('NodeMCWorldLoader/src/io/ChunkIoService');

function World(directory) {
    this.service = new ChunkIoService(directory);
    this.entities = [];
    this.entitiesById = {};
    this.chunks = {};
}

World.prototype.getBlockAt = function(x, y, z, callback) {

};

World.prototype.getChunkAt = function (x, z) {
    if (x % 1 !== 0 || z % 1 !== 0) {
        throw new TypeError('Chunk coordinates should be integers');
    }
    var chunk;
    var zCoords = this.chunks[x.toString()];
    if (zCoords) {
        chunk = zCoords[z.toString()];
    }
    if (chunk) {
        return chunk;
    } else {
        return this.loadChunk(x, z);
    }
};

World.prototype.loadChunk = function (x, z) {
    if (x % 1 !== 0 || z % 1 !== 0) {
        throw new TypeError('Chunk coordinates should be integers');
    }
    var chunk = new Chunk(x, z);
    this.service.read(chunk);
    return chunk;
};

World.prototype.getEntityById = function (id) {
    return this.entitiesById[id];
};

World.prototype.getEntitiesByType = function (type) {
    var length = this.entities.length;
    while (length--) {
        var entity = this.entities[length];
        if (entity.type === type) {
            return entity;
        }
    }
};

World.prototype.tick = function () {
    // currently, this is the fastest way to loop through an array
    var length = this.entities.length;
    while (length--) {
        var entity = this.entities[length];
        try {
            entity.tick();
        } catch (err) {
            err.message = 'Failed to tick entity. Entity data:\n' + entity.toString() + '\n';
            console.error(err.message);
            console.error(err.stack);
        }
    }
};

module.exports = World;