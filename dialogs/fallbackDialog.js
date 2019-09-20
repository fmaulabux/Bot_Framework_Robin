// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TextPrompt, ChoicePrompt, ComponentDialog, WaterfallDialog, ChoiceFactory } = require('botbuilder-dialogs');

const REDIRECTS = require('../resources/redirects');
const FALLBACK_DIALOG = 'FALLBACK_DIALOG';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class FallbackDialog extends ComponentDialog {
    
    constructor() {
        
        super(FALLBACK_DIALOG);
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.endStep.bind(this)
        ]));
        this.initialDialogId = WATERFALL_DIALOG;
    }

    async endStep(stepContext) {
        // Prompt the user for a choice.\
        await stepContext.context.sendActivity("Ik begrijp helaas nog steeds niet wat je vraag is. Excuses hiervoor.");
        await stepContext.context.sendActivity(`Je kunt het volgende doen voor antwoord op je vraag:`);
        await REDIRECTS.fulfillment(stepContext, 'Vul dit formulier in', 'https://apps.powerapps.com/play/4e8a15b7-bb35-4d3d-96c1-be01ac112873?tenantId=cdc477bf-b6e3-4345-b1be-3b225394e17e');
        await REDIRECTS.fulfillment(stepContext, 'Bel een servicedesk medewerker', 'tel:06654646546');
        return stepContext.endDialog();
    }
}

module.exports.FallbackDialog = FallbackDialog;
module.exports.FALLBACK_DIALOG = FALLBACK_DIALOG;
