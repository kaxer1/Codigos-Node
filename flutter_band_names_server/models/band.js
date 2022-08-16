const { v4: uuidV4} = require('uuid');
class Band {

    constructor(name = 'no-name') {
        this.id = uuidV4().toString(); // identificador unico
        this.name = name;
        this.votes = 0;
    }
}

module.exports = Band;