/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const CaloriesAPI = require('./CaloriesAPI.js');
const Alexa = require('alexa-sdk');

const APP_ID = "amzn1.ask.skill.38f0c3ee-f48c-45d4-bdcd-55ddfabef568";

const handlers = {
    'LaunchRequest': function () {
        this.emit(':tell', "Nenne mir ein Lebensmittel und ich sage dir wie viele kalorien es hat")
    },
    'getcalories': function () {
        let api = new CaloriesAPI(true);

        /*
        { name: 'Suppe',
        url: 'http://fddb.mobi/de/diverse_suppe.html',
        referenz: 'N�hrwerte f�r 100 g',
        attrs:
        { Brennwert: '13 kJ',
            Kalorien: '3 kcal',
            Protein: '0,2 g',
            Kohlenhydrate: '0,6 g',
            Fett: '0,1 g' } }
        */

        let query = this.event.request.intent.slots.nutrition.value;
        let base = this;

        if(query == undefined){
            console.log("Cant find nutrition value!")
            console.log("Intent:")
            console.log(this.event.request.intent)
            console.log("Slots:")
            console.log(this.event.request.intent.slots)
            console.log("Nutrition:")
            console.log(this.event.request.intent.slots.nutrition)
            
            base.emit(':tellWithCard', "Ich habe nicht verstanden um welches lebensmittel du meinst");  
        }
        else{
            api.search(query, function(result){
                let message = result.name + " hat bei einem gewicht von 100 gramm "
                    + result.attrs.Kalorien.replace("kcal", "") + " kilo kalorien";
                
                console.log(message)                
                
                base.emit(':tellWithCard', message);        
            });
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', "Hier sollte die hilfe stehen");
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//For testing
exports.handlerstotest = handlers;