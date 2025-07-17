import express from 'express'
import fs from 'fs'
import dotenv from 'dotenv'
import { Vonage } from '@vonage/server-sdk'
import { MessengerText } from '@vonage/messages'
import OpenAI from 'openai'

// Load environment variables from .env
dotenv.config()

// Initialize Vonage client
const vonage = new Vonage({
  apiKey: process.env.API_KEY,
  applicationId: process.env.APPLICATION_ID,
  privateKey: fs.readFileSync(process.env.PRIVATE_KEY_PATH)
})

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Set up Express server
const PORT = 3000
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Health check and status endpoints
app.get('/', (req, res) => res.sendStatus(200))
app.post('/status', async (req, res) => res.sendStatus(200))

// Store conversation context across turns
const conversationContext = [
  { role: 'system', content: 'You are a helpful assistant. Keep responses under 640 characters.' }
]

// Query ChatGPT and enforce Messenger's length limits
async function queryChatGPT(user_message) {
  conversationContext.push({ role: 'user', content: user_message })

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: conversationContext
  })

  let reply = chatCompletion.choices[0].message.content

  // Trim to 640 characters if necessary
  if (reply.length > 640) {
    reply = reply.substring(0, 637) + '...'
  }

  conversationContext.push({ role: 'assistant', content: reply })
  return reply
}

// Handle incoming Messenger messages
app.post('/inbound', async (req, res) => {
  res.sendStatus(200)

  const messenger_to = req.body.to
  const messenger_from = req.body.from
  const received_text = req.body.text

  try {
    const reply = await queryChatGPT(received_text)

    await vonage.messages.send(new MessengerText({
      to: messenger_from,
      from: messenger_to,
      text: reply
    }))
  } catch (error) {
    console.error('Error sending message:', error)
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
