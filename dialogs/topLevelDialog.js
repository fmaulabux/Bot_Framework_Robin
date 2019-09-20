// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ComponentDialog, NumberPrompt, TextPrompt, ChoicePrompt, WaterfallDialog, ChoiceFactory } = require('botbuilder-dialogs');
const { MessageFactory} = require('botbuilder');
const { LoginDialog, LOGIN_DIALOG } = require('./LoginDialog');
const { DialogInfo } = require('../dialogInfo');
const mainDialog = require('./mainDialog');

const TOP_LEVEL_DIALOG = 'TOP_LEVEL_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';


class TopLevelDialog extends ComponentDialog {
    constructor(qna) {
        super(TOP_LEVEL_DIALOG);
        this.choices = ["Login", "Wachtwoord vergeten", "PowerBI"]
        // this.luisRecognizer = luisRecognizer
        this.qna = qna;
        this.dialogInfo = new DialogInfo();
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.startStep.bind(this),
            this.categoryStep.bind(this),
            this.endStep.bind(this),
        ]));
        this.addDialog(new LoginDialog(this.qna));
        this.initialDialogId = WATERFALL_DIALOG;
    }

    async startStep(stepContext) {
            this.dialogInfo = new DialogInfo();

        const promptOptions = {
            prompt: ChoiceFactory.forChannel(stepContext.context, this.choices, 'Kies een van de opties waar je meer over wilt weten, of stel je vraag.')
        };
        return await stepContext.prompt(TEXT_PROMPT, promptOptions);
    }

    async categoryStep(stepContext) {
        //stepContext.values.dialogInfo.firstChoice = stepContext.result;
        this.dialogInfo.setDI("firstChoice", stepContext.result.toLowerCase());
        
        
        if (this.dialogInfo.firstChoice == "login") {
            return await stepContext.beginDialog(LOGIN_DIALOG);
        } 
        
    
        if (this.dialogInfo.firstChoice == "wachtwoord vergeten") {
            return await stepContext.next();
        }

        if (this.dialogInfo.firstChoice == "powerbi") {
            return await stepContext.next();
        }
        
        // stepContext.context.activity.text = this.dialogInfo.retrieveDI()
        // var qnaResults = await this.qna.qnaMaker.getAnswers(stepContext.context, this.qna.qnaMakerOptions);
        // await stepContext.context.sendActivity(qnaResults[0].answer);
        // this.dialogInfo.setDI("qnaQuery", stepContext.context.activity.text);
        // this.dialogInfo.setDI("qnaResult", qnaResults[0].answer);
        await this.returnAnswer(stepContext, this.qna, this.dialogInfo);
        return await stepContext.endDialog();

    }

    async endStep(stepContext) {
        return await stepContext.endDialog();
}

}

module.exports.TopLevelDialog = TopLevelDialog;
module.exports.TOP_LEVEL_DIALOG = TOP_LEVEL_DIALOG;
