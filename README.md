# Integrate ChatGPT with Meta (Facebook) Messenger via Messages API

A node application that allows you to setup a Facebook Messenger bot that gives ChatGPT answers.

> You can find full step-by-step instructions on the [Vonage Developer Blog](https://developer.vonage.com/en/blog/integrate-chatgpt-with-meta-facebook-messenger-via-messages-api).

## Prerequisites
1. [Node.js installed on your machine.](https://nodejs.org/en/download)
2. [ngrok installed for exposing your local server to the internet.](https://ngrok.com/downloads/mac-os)
3. [Vonage Developer Account](https://developer.vonage.com/sign-up)
4. A Facebook Business Page



## Instructions
1. Clone this repo
2. Initialize your Node application and install dependencies:
```
npm init -y && npm pkg set type=modulegrea
npm install express openai @vonage/server-sdk dotenv
```
4. Rename the `.env.example` file to `.env`, and add your `API_KEY`, `APPLICATION_ID` and `OPENAI_API_KEY` values.
5. Add your `private.key` file in the root of the project directory.
6. Start your Node server:
```
node app.js
```
7. Create a tunnel using ngrok:
```
ngrok http 3000
```
8. Test your app by sending a message to your Facebook page.


