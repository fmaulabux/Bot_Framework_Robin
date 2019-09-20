const { QnAMaker } = require('botbuilder-ai');

class QnA {
    constructor() {
        this.qnaMakerOptions = {
            ScoreThreshold: 0.03,
            Top: 3
        };
        try {
            this.qnaMaker = new QnAMaker({
                knowledgeBaseId: process.env.QnAKnowledgebaseId,
                endpointKey: process.env.QnAEndpointKey,
                host: process.env.QnAEndpointHostName
            
            });

        } catch (err) {
            console.warn(`QnAMaker Exception: ${ err } Check your QnAMaker configuration in .env`);
        }
    }

    // If an answer was received from QnA Maker, send the answer back to the user.
    // async getAnswer(question){
    // const qnaResults = this.qnaMaker.getAnswers(question);
    // console.log(qnaResults);
    // if (qnaResults[0]) {
    //     console.log("Logging QnA results"+ qnaResults[0])
    //     return qnaResults[0];
    // }   
    // return "Geen antwoord gevonden."
    // }
}

module.exports.QnA = QnA;
