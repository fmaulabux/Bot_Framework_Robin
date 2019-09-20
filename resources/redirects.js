const { CardFactory } = require('botbuilder');

/**
 * Component @Redirects
*/
module.exports = {

    fulfillment: async function (stepContext, title, url) {
        
        let redirects = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "actions": [
                {
                    "type":"Action.OpenUrl",
                    "method":"POST",
                    "url":url, 
                    "title":title
                }
            ]
          }

          const redirectsCard = CardFactory.adaptiveCard(redirects);
          await stepContext.context.sendActivity({attachments: [redirectsCard]});

    }

}