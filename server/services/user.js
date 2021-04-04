const redis = require('redis');

class User {
    constructor() {
        this.subscriber = redis.createClient();
        this.services = [];
    }
    setOIDC(oidc) {
        this.oidc = oidc;
    }
    addService(service) {
        if (this.services.indexOf(service) == -1) {
            this.services.push(service);
        }
    }
    removeService(service) {
        this.services.splice(this.services.indexOf(service), 1)
    }
};

module.exports = User