import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'
import jwt from 'jsonwebtoken'

declare global {
  var signin: (id?: string) => string[]
}

jest.mock('../nats-wrapper')

let mongo: MongoMemoryServer | null

beforeAll(async () => {
  process.env.JWT_KEY = 'asaasas'
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collectios = await mongoose.connection.db.collections()

  for (let collection of collectios) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop()
  }
  await mongoose.connection.close()
})

signin = (id?: string) => {
  // Build JWT payload {id, email}
  const payload = {
    id: id ?? new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.pl',
  }
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session Object {jwt: MY_JWT}
  const session = { jwt: token }

  // Turn that session and turn in to JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode is as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  //return a string thats a cookie with encoded data
  return [`session=${base64}`]
}
