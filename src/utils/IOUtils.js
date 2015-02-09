var IOUtils = {
    isZipArchive: function(buffer) {
        if(!buffer) {
            return false;            
        }
        if(typeof buffer == 'string') {
            buffer = new Buffer(buffer);            
        }
        if(!(buffer instanceof Buffer)) {
            throw new TypeError('Object is not a buffer.');
        }
        var i = buffer.length - 22; // end size
        var n = Math.max(0, i - 0xFFFF);
        var endOffset = -1;
        for(i; i >= n; i++) {
            if(buffer[i] != 0x50) {
                continue;                
            }
            if(buffer.readUInt32LE(i) == 0x06054b50) {
                endOffset = i;
                break;
            }
        }
        return !!~endOffset;
    },
    isGz: function(buffer) {
        if(!buffer) {
            return false;
        }
        if(typeof buffer == 'string') {
            buffer = new Buffer(buffer);
        }
        if(!(buffer instanceof Buffer)) {
            throw new TypeError('Object is not a buffer.');
        }
        return buffer[0] == 0x1f && buffer[1] == 0x8b;
    }
};

module.export = IOUtils;