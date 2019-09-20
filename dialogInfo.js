// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

class DialogInfo {
    constructor(){
        if(! DialogInfo.instance){
            this.retry = 0;
            this.questionAmount = 0;
            DialogInfo.instance = this;
        }
     
        return DialogInfo.instance;
       }

    setDI(name, value) {
        DialogInfo.instance[name] = value;
        return DialogInfo.instance;
    }

    clearDI() {
        DialogInfo.instance = null;
        return DialogInfo.instance;
    }

    retrieveDI() {
        const propertylen = Object.values(DialogInfo.instance).length;
        var txt = "";
        var i = 2;
        if (propertylen > 2){
            for (i; i < propertylen; i++){
                txt += Object.values(DialogInfo.instance)[i] + " ";
            }
        }
        return txt;
    }

}

module.exports.DialogInfo = DialogInfo;
