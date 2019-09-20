const { LuisRecognizer } = require('botbuilder-ai');

class LUIS {

    constructor(config) {

        const luisIsConfigured = config && config.applicationId && config.endpointKey && config.endpoint;
        if(luisIsConfigured) {
            this.recognizer = new LuisRecognizer(config, {}, true);
        }

    }

    async executeLuisQuery(context) {
        console.log(this.recognizer.recognize(context));
    }

}

module.exports.LUIS = LUIS;