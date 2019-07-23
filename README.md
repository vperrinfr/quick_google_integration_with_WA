# Quick Google Integration with Watson Assistant
Integration Google Assistant avec Watson Assistant

An example Watson Assistant skill is included to demonstrate how to pass context between different intents.

When the reader has completed this Code Pattern, they will understand how to:

* Create an IBM Cloud Functions action in the IBM Cloud Functions serverless platform
* Import a skill into Watson Assistant
* Invoke a skill with Watson using Node.js
* Create an Google Assistant skill to reach tens of millions of customers

## Flow

1. User says "Ok Google, speak to Watson Home".
2. Google Assistant invokes IBM Cloud Functions with input text.
3. The action gets the Watson Assistant context with some parameters if exist.
4. The action gets a response from Watson Assistant.
5. The Json response is sent back to Google Assistant.
6. Google Assistant replies to the user.

## Included components

* [Watson Assistant](https://www.ibm.com/watson/ai-assistant/): Create a chatbot with a program that conducts a conversation via auditory or textual methods.
* [OpenWhisk](https://cloud.ibm.com/openwhisk): Execute code on demand in a highly scalable, serverless environment.

## Featured technologies

* [Serverless](https://www.ibm.com/cloud/functions): An event-action platform that allows you to execute code in response to an event.
* [Node.js](https://nodejs.org/): An open-source JavaScript run-time environment for executing server-side JavaScript code.

# Steps

## Run locally

1. [Clone the repo](#1-clone-the-repo)
2. [Create a Watson Assistant workspace](#2-create-a-watson-assistant-workspace)
3. [Setup Google Actions](https://github.com/IBM/watson-google-assistant#setup-google-actions)
4. [Configure credentials](#5-configure-credentials)
5. [Create the OpenWhisk action](#6-create-the-openwhisk-action)
6. [Talk to it](#8-talk-to-it)

### 1. Clone the repo

Clone the `watson-home` repo locally and `cd` to the local repo
(for commands in later steps). In a terminal, run:

```bash
git clone https://xxxxxx/watson-home
cd watson-home
```

### 2. Create a Watson Assistant workspace

Sign up for [IBM Cloud](https://cloud.ibm.com/registration/) if you don't have an IBM Cloud account yet.

Use one or both of these options (with or without BAE) to setup an Assistant workspace.

#### Using the provided workspace.json file

Create the service by following this link and hitting `Create`:

* [**Watson Assistant**](https://cloud.ibm.com/catalog/services/conversation)

Import the Assistant workspace.json:

* Find the Assistant service in your IBM Cloud Dashboard.
* Click on the service and then click on `Launch tool`.
* Go to the `Skills` tab.
* Click `Create new`
* Click the `Import skill` tab.
* Click `Choose JSON file`, go to your cloned repo dir, and `Open` the workspace.json file in [`data/conversation/workspaces/workspace.json`](data/conversation/workspaces/workspace.json).
* Select `Everything` and click `Import`.

### 3. Setup Google Action

[Follow steps on this github](https://github.com/IBM/watson-google-assistant#setup-google-actions)

### 4. Configure credentials

The default runtime parameters need to be set for the action.
These can be set on the command line or via the IBM Cloud UI.
Here we've provided a params.sample file for you to copy and use
with the `--param-file .params` option (which is used in the instructions below).

Copy the [`params.sample`](params.sample) to `.params`.

```bash
cp params.sample .params
```

Edit the `.params` file and add the required settings as described below.

#### `params.sample:`

```json
{
	"ASSISTANT_IAM_APIKEY": "<ASSISTANT_IAM_APIKEY>",
	"ASSISTANT_IAM_URL": "<ASSISTANT_IAM_URL>",
	"WORKSPACE_ID": "<WORKSPACE_ID>",
	"ASSISTANT_ID": "<ASSISTANT_ID>"
}

```

### 6. Create the IBM Cloud Functions action

As a prerequisite, [install the Cloud Functions (IBM Cloud OpenWhisk) CLI](https://cloud.ibm.com/docs/openwhisk/bluemix_cli.html#cloudfunctions_cli)

#### Create the IBM Functions action

Run these commands to gather Node.js requirements, zip the source files, and upload the zipped files
to create a raw HTTP web action in OpenWhisk.

> Note: You can use the same commands to update the action if you modify the code or the .params.

```sh
npm install
rm action.zip
zip -r action.zip main.js package* node_modules
ibmcloud wsk action update Watson-Home action.zip --kind nodejs:10 --param-file .params
```

### 7. Talk to it

Go on Google Assistant simulator and try to speak to your bot

