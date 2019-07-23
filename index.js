/**
 * Copyright 2019 IBM Corp. All Rights Reserved.
 *
 * Created by Antoine Petit
 *
 */

'use strict';

const AssistantV2 = require('watson-developer-cloud/assistant/v2');

let assistant;
let assistant_id;
let session_id;
let expectUserResponse;

function assistantMessage(request, workspaceId) {
  return new Promise(function(resolve, reject) {
    let input = request.inputs[0].rawInputs[0].query;
    const intent = request.inputs[0].intent;
    const conversationType = request.conversation.type;

    expectUserResponse = true;
    if (intent === 'actions.intent.CANCEL') {
      expectUserResponse = false;
      input = 'stop skill';
    } else if (conversationType === 'NEW') {
      input = 'start skill';
    }

    assistant.message(
      {
        input: {
          message_type: 'text',
          text: input,
          options: {
            return_context: true
          }
        },
        assistant_id: assistant_id,
        session_id: session_id
      },
      function(err, watsonResponse) {
        if (err) {
          console.error(err);
          reject('Error talking to Watson.');
        } else {
          resolve(watsonResponse);
        }
      }
    );
  });
}

function sendResponse(response, resolve) {

  const conversationToken = session_id;

  let ssmlSound = false;
  let soundURL;
  let context = response.context;
  if(context["skills"] && context["skills"]["main skill"] && context["skills"]["main skill"]["user_defined"]
                       && context["skills"]["main skill"]["user_defined"]["shouldEndSession"]){
    expectUserResponse = false;
  }
  if(context["skills"] && context["skills"]["main skill"] && context["skills"]["main skill"]["user_defined"]
                       && context["skills"]["main skill"]["user_defined"]["ssmlSound"]){
    ssmlSound = true;
    soundURL = context["skills"]["main skill"]["user_defined"]["ssmlSound"];
  }

  let output = "";
  response.output.generic.forEach((ele) => {
    output += ele.text + " ";
  });

  let richResponse = {
    items: [
      {
        simpleResponse: {
          textToSpeech: output
        }
      }
    ],
    suggestions: []
  };

  if(ssmlSound){
    richResponse = {
      items: [
        {
          simpleResponse: {
            ssml: "<speak>"+ output +" <audio src = '"+ soundURL +"' /></speak>"
          }
        }
      ],
      suggestions: []
    };
  }

  const resp = {
    conversationToken: conversationToken,
    expectUserResponse: expectUserResponse
  };

  if (expectUserResponse) {
    resp.expectedInputs = [
      {
        inputPrompt: {
          richInitialPrompt: richResponse
        },
        possibleIntents: [
          {
            intent: 'actions.intent.TEXT'
          }
        ]
      }
    ];
  } else {
    const s = output.substring(0, 59);
    resp.finalResponse = { speechResponse: { textToSpeech: s } };
  }

  resolve(resp);
}

function findOrCreateAssistantSession(request, callback){
  if(request.conversation && request.conversation.conversationToken){
    callback(request.conversation.conversationToken);
  }else{
    assistant.createSession({ assistant_id: assistant_id }, (err, response) => {
      callback(response.session_id);
    });
  }
}



function main(args){

  return new Promise((resolve, reject) => {

    assistant = new AssistantV2({
         version: '2018-11-08',
         iam_apikey: args.ASSISTANT_IAM_APIKEY,
         url: args.ASSISTANT_IAM_URL
       });

    const rawBody = Buffer.from(args.__ow_body, 'base64').toString('ascii');
    const request = JSON.parse(rawBody);
    assistant_id = args.ASSISTANT_ID;

    findOrCreateAssistantSession(request, (s_id) => {
      session_id = s_id;
      assistantMessage(request, args.WORKSPACE_ID)
        .then(actionResponse => sendResponse(actionResponse, resolve))
        .catch(err => {
          console.error('Caught error: ');
          console.log(err);
          reject(err);
        });
    });

  });
}

console.log(main({}));

exports.main = main;
