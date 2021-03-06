//------------------------------------------------------------------------------
// Copyright IBM Corp. 2017
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------

var Botkit = require('botkit');
require('dotenv').load();
var sharedCode = require('./handleWatsonResponse.js')();

var middleware = require('botkit-middleware-watson')({
    username: process.env.CONVERSATION_USERNAME,
    password: process.env.CONVERSATION_PASSWORD,
    workspace_id: process.env.WORKSPACE_ID,
    version_date: '2016-09-20'
});

var controller = Botkit.facebookbot({
    debug: true,
    log: true,
    access_token: process.env.FACEBOOK_PAGE_TOKEN,
    verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
    app_secret: process.env.FACEBOOK_APP_SECRET,
    validate_requests: true
});

var bot = controller.spawn({
});

controller.setupWebserver(process.env.port || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
    });
});

// delete the greeting message
//controller.api.messenger_profile.delete_greeting();

// controller.api.messenger_profile.greeting('com o agendamento do seu serviço. Qual o seu nome?');

controller.api.messenger_profile.get_started('Hello');
// controller.api.messenger_profile.delete_get_started();

controller.on('message_received', function (bot, message) {
    middleware.interpret(bot, message, function (err) {
        if (!err) {
            sharedCode.handleWatsonResponse(bot, message, 'facebook');
        }
        else {
            bot.reply(message, "I'm sorry, but for technical reasons I can't respond to your message");
        }
    });
});

// Log every message recieved
controller.middleware.receive.use(function (bot, message, next) {

    // log it
    console.log('RECEIVED: ', message);

    // modify the message
    message.logged = true;

    // continue processing the message
    next();

});

// Log every message sent
controller.middleware.send.use(function (bot, message, next) {

    // log it
    console.log('SENT: ', message);

    // modify the message
    message.logged = true;

    // continue processing the message
    next();

});
/*
controller.hears(['batata'], 'message_received', function(bot, message) {

  bot.startConversation(message, function(err, convo) {
      convo.ask({
          attachment: {
              'type': 'template',
              'payload': {
                  'template_type': 'generic',
                  'elements': [
                      {
                          'title': 'Escolha o serviço desejado:',
                          'subtitle': ' ',
                          'buttons': [
                              {
                                  'type': 'web_url',
                                  'url': 'https://petersapparel.parseapp.com/view_item?item_id=100',
                                  'title': 'View Item'
                              },
                              {
                                  'type': 'web_url',
                                  'url': 'https://petersapparel.parseapp.com/buy_item?item_id=100',
                                  'title': 'Buy Item'
                              },
                              {
                                  'type': 'postback',
                                  'title': 'Bookmark Item',
                                  'payload': 'White T-Shirt'
                              }
                          ]
                      },
                      {
                          'title': 'Classic Grey T-Shirt',
                          'image_url': 'https://cdnakakyhko8zhjr.cdnedge.bluemix.net/wp-content/themes/toyota/desktop-images/logo_toyota.png',
                          'subtitle': 'Soft gray cotton t-shirt is back in style',
                          'buttons': [
                              {
                                  'type': 'web_url',
                                  'url': 'https://petersapparel.parseapp.com/view_item?item_id=101',
                                  'title': 'View Item'
                              },
                              {
                                  'type': 'web_url',
                                  'url': 'https://petersapparel.parseapp.com/buy_item?item_id=101',
                                  'title': 'Buy Item'
                              },

                          ]
                      }
                  ]
              }
          }
      }, function(response, convo) {
          // whoa, I got the postback payload as a response to my convo.ask!
          convo.next();
      });
  });
});


*/
controller.hears(['batata'], 'message_received', function (bot, message) {

    bot.startConversation(message, function (err, convo) {
        convo.ask({
            text: 'Qual o serviço desejado?',
            quick_replies: [{
                content_type: 'text',
                title: 'Reparo',
                payload: 'Reparo',
            }, {
                content_type: 'text',
                title: 'Revisão',
                payload: 'Revisão',
            }, {
                content_type: 'text',
                title: 'Recall',
                payload: 'Recall',
            }, {
                content_type: 'text',
                title: 'Diagnóstico',
                payload: 'Diagnóstico',
            }],
        }, function (response, convo) {
            convo.next();
        });
    });
});

/*
// toda vez que o usuario digital 'batata', aparece o quick reply
controller.hears(['batata'], 'message_received', function (bot, message) {

    bot.startConversation(message, function (err, convo) {
        convo.ask({
            text: ' ',
            quick_replies: [{
                content_type: 'text',
                title: 'Espírito Santo',
                payload: 'Espírito Santo',
            }, {
                content_type: 'text',
                title: 'Minas Gerais',
                payload: 'Minas Gerais',
            }]
        }, function (response, convo) {
            convo.next();
        });
    });
});
*/


controller.on('facebook_postback', function (bot, message) {
    
    
    if (message.payload == 'Hello') {
        bot.reply(message, 'Olá, sou o Assistente Virtual da Kurumá e vou te ajudar com o agendamento do seu serviço. Qual o seu nome?')
    } /*
    if (message.payload == 'Hello') {
        bot.startConversation(message, function (err, convo) {
            convo.ask({
                text: 'Em qual desses estados você gostaria de realizar o atendimento?',
                quick_replies: [{
                    content_type: 'text',
                    title: 'Espírito Santo',
                    payload: 'Espírito Santo',
                }, {
                    content_type: 'text',
                    title: 'Minas Gerais',
                    payload: 'Minas Gerais',
                }]
            }, function (response, convo) {
                convo.next();
            });
        });
    } */
    
});


