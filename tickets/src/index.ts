import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('JWT_KEY must be defined')
  }

  
  try {
    await natsWrapper.connect('ticketing', 'kajhskjah', 'http://nats-srv:4222')
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to mongo DB')
  } catch (error) {
    console.log(error)
  }

  app.listen(3000, () => {
    console.log('Listen on port 3000')
  })
}

start()
