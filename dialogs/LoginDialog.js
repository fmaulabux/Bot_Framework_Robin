// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TextPrompt, ChoicePrompt, ComponentDialog, WaterfallDialog, ChoiceFactory } = require('botbuilder-dialogs');
const { DialogInfo } = require('../dialogInfo');

const LOGIN_DIALOG = 'LOGIN_DIALOG';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class LoginDialog extends ComponentDialog {
    
    constructor(qna) {
        
        super(LOGIN_DIALOG);
        this.dialogInfo = new DialogInfo();
        this.qna = qna
        this.companyOptions = ['Volkerrailforms', 'Ontvangsten App', 'Digitale Storingsbon'];
        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.appStep.bind(this),
            this.selectStep.bind(this)
        ]));
        this.initialDialogId = WATERFALL_DIALOG;
    }

    async appStep(stepContext) {
        // Prompt the user for a choice.\
        const promptOptions = {
            prompt: ChoiceFactory.forChannel(stepContext.context, this.companyOptions, "Met betrekking tot welke applicatie?")
        };
        return await stepContext.prompt(TEXT_PROMPT, promptOptions);
    }

    async selectStep(stepContext) {
        this.dialogInfo.setDI("LoginAppChoice", stepContext.result.toLowerCase());
        if (this.dialogInfo.LoginAppChoice == "volkerrailforms"){
        await stepContext.context.sendActivity('In Volkerrailforms log je in met je active directory account.');
        await stepContext.context.sendActivity('Dit is de website waarop je kunt inloggen: https://sf.volkerrail.nl');
        return await stepContext.endDialog();
            }

        if (this.dialogInfo.LoginAppChoice == "ontvangsten app"){
            await stepContext.context.sendActivity('Op Ontvangsten App log je in met de gegevens die je hebt ontvangen.');
            await stepContext.context.sendActivity('Let wel op, deze applicatie is niet geïntegreerd met je active directory.');
            await stepContext.context.sendActivity('Dit is de website waarop je kunt inloggen: https://smartflow.volkerrail.nl');
            return await stepContext.endDialog();
            }
        
        if (this.dialogInfo.LoginAppChoice == "digitale storingsbon"){
            await stepContext.context.sendActivity('Op Digitale Storingsbon log je in met de gegevens die je hebt ontvangen');
            await stepContext.context.sendActivity('Let wel op, deze applicatie is niet geïntegreerd met je active directory.');
            await stepContext.context.sendActivity('Dit is de website waarop je kunt inloggen: https://smartflow.volkerrail.nl');
            return await stepContext.endDialog();
            }
        
        // console.log("The input for LUIS is: " + stepContext.result)
        // const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
        // console.log("Intent detected: " + luisResult.luisResult.topScoringIntent.intent)

        await this.returnAnswer(stepContext, this.qna, this.dialogInfo);

        return await stepContext.endDialog();
    }
}

module.exports.LoginDialog = LoginDialog;
module.exports.LOGIN_DIALOG = LOGIN_DIALOG;
