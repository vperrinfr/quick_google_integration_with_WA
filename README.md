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

### 3. Configure credentials

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

### 4. Create the IBM Cloud Functions action

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

#### Enable and Retrieve the IBM Functions URI

1. Go to [IBM Cloud function GUI](https://cloud.ibm.com/openwhisk/)

2. Go to Actions in the menu, click on the new Function and click on Endpoints

3. Then check the two boxes Enable as Web Action & Raw HTTP handling

4. Copy the URL of the Web Action of your Cloud Functions, it will be used for the Google Actions configuration later in that doc.

### 5. Setup Google Action

1. Go to [Actions on Google Developer Console](https://console.actions.google.com)

2. Create your project
   * Click on `+ Add/import project`
   * Enter a project name
   * Choose the default language for your Actions
   * Select your country or region
   * Click on `CREATE PROJECT`
   * Click on `SKIP` to choose a category later

3. Obtain your project ID
   * Next to the `Overview` menu item, click on the gear icon and then `Project settings`.
   * Save the `Project ID` to use later.

4. Set the invocation name

   * Use the left sidebar menu to select `SETUP` > `Invocation`.
   * Enter a display name. Users will say or type this name to explicitly invoke your action.
   * Hit `SAVE`.

5. Install the `gactions` CLI
   * Download the `gactions` CLI from [here](https://developers.google.com/actions/tools/gactions-cli).
   * `chmod` the `gactions` file to make it executable.
   * Copy the `gactions` file into your local repo's `actions` directory.
     ```bash
     # For example, depending on your download and repo directories...

     chmod +x ~/Downloads/gactions
     cp ~/Downloads/gactions ~/watson-google-assistant/actions/
     ```

6. Edit the `actions/action_fr.json` file in your local repo.
   * Edit the `url` using your deployed IBM Cloud Functions URL. Typically, you would just modify the timestamp digits and region.
     > Note: URL needs `https://` prefix e.g. https://us-south.functions.cloud.ibm.com/api/v1/web/vincent.perrin%40fr.ibm.com_dev/default/XXXXXXXXX.json

7. Create the action using the CLI
   > Note: If/when it prompts you to enter an authorization code, browse to the provided URL to login and authorize the CLI to use your account and copy/paste the auth code at the prompt.

   * Run the `gactions` command to update your action and prepare it for testing. Use the project ID you saved earlier.

     ```bash
     cd ~/watson-google-assistant/actions/
     ./gactions update --action_package action.json --project <YOUR_PROJECT_ID>
     ./gactions test --action_package action.json --project <YOUR_PROJECT_ID>
     ```


[More details](https://github.com/IBM/watson-google-assistant#setup-google-actions)

### 6. Talk to it

Go on Google Assistant simulator and try to speak to your bot
