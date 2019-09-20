// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, ChoicePrompt, TextPrompt} = require('botbuilder-dialogs');
const { CardFactory} = require('botbuilder');
const { TopLevelDialog, TOP_LEVEL_DIALOG } = require('./topLevelDialog');
const { FallbackDialog, FALLBACK_DIALOG } = require('./fallbackDialog');
const { DialogInfo } = require('../dialogInfo')

const MAIN_DIALOG = 'MAIN_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const USER_PROFILE_PROPERTY = 'USER_PROFILE_PROPERTY';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT';
const ratingCard = require('../adaptiveCards/rating.json');
totalDialog = []

class MainDialog extends ComponentDialog {
    constructor(userState, qna) {
        super(MAIN_DIALOG);
        // if (!luisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');
        // this.luisRecognizer = luisRecognizer;
        this.qna = qna;
        this.userState = userState;
        this.dialogInfo = new DialogInfo();
        this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new TopLevelDialog(this.qna));
        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new FallbackDialog());

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            // this.acknowledgementStep.bind(this),
            this.validateStep.bind(this),
            this.acknowledgementStep.bind(this),
            this.nextQuestionStep.bind(this),
            this.ratingStep.bind(this),
            this.finalStep.bind(this)
        ]));
        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async initialStep(stepContext) {
        return await stepContext.beginDialog(TOP_LEVEL_DIALOG);
    }

    // async acknowledgementStep(stepContext) {
    //     if (Object.values(stepContext.result)[0] == "Nee") {
    //         stepContext.values.dialogInfo.retry += 1;
            
    //         await stepContext.context.sendActivity("Het spijt me, zou je het nog een keer kunnen proberen?");
    //         return await stepContext.replaceDialog(TOP_LEVEL_DIALOG);
    //     }
    // }
    async validateStep(stepContext) {
        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: "Heb ik je zo goed geholpen?",
            choices: ["Ja", "Nee"]
        }
        );
    }

    async acknowledgementStep(stepContext) {
        if (Object.values(stepContext.result)[0] == "Nee") {
            totalDialog.push(this.dialogInfo)
            const retry = this.dialogInfo.retry + 1;
            const newQuestionAmount = this.dialogInfo.questionAmount;
            this.dialogInfo.clearDI();
            this.dialogInfo = new DialogInfo();
            this.dialogInfo.setDI("retry", (retry))
            this.dialogInfo.setDI("questionAmount", (newQuestionAmount))
            console.log(totalDialog)
            if (retry == 2){
                console.log(totalDialog)
                await stepContext.endDialog();
                return await stepContext.beginDialog(FALLBACK_DIALOG);
            }
            await stepContext.context.sendActivity("Het spijt me, zou je het nog een keer kunnen proberen?");
            await stepContext.endDialog();
            return await stepContext.beginDialog(MAIN_DIALOG);
        }
        else {
        return await stepContext.next();
        }
    }

    async nextQuestionStep(stepContext) {
        // Prompt the user for a choice.
        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: "Kan ik je nog ergens anders mee helpen?",
            retryPrompt: 'Ik begrijp je niet helemaal.. De opties zijn ja of nee.',
            choices: ["Ja", "Nee"]
        });
        
    }

    async ratingStep(stepContext) {
        
        if (Object.values(stepContext.result)[0] == "Ja") {
            totalDialog.push(this.dialogInfo)
            this.dialogInfo.setDI("questionAmount", this.dialogInfo.questionAmount)
            const retry = this.dialogInfo.retry;
            const newQuestionAmount = this.dialogInfo.questionAmount + 1;
            this.dialogInfo.clearDI();
            this.dialogInfo = new DialogInfo();
            this.dialogInfo.setDI("retry", (retry))
            this.dialogInfo.setDI("questionAmount", (newQuestionAmount))
            console.log(totalDialog)
            await stepContext.endDialog(MAIN_DIALOG)
            return await stepContext.beginDialog(MAIN_DIALOG);
        }
            await stepContext.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(ratingCard)]
            });
            return await stepContext.prompt(TEXT_PROMPT);
    }

    async finalStep(stepContext) {
        this.dialogInfo.setDI("rating", stepContext.result)
        totalDialog.push(this.dialogInfo)
        console.log(totalDialog)
        await stepContext.context.sendActivity(`Dankjewel voor je feedback en fijne dag nog!`);
        return await stepContext.endDialog();
        
    }
}

module.exports.MainDialog = MainDialog;
module.exports.MAIN_DIALOG = MAIN_DIALOG;
