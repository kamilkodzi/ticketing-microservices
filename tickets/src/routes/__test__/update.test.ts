import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { response } from 'express'

it('returns a 404 if the provided id doesnt exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'asasaa', price: 29.99 })
    .expect(404)
})

it('returns a 401 if user is no authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'asasaa', price: 29.99 })
    .expect(401)
})

it('returns a 401 if the user doesnt own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asasad',
      price: 28.88,
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'new title asasd', price: 0.01 })
    .expect(401)
})

it('returns a 400 if user provides invalid title or price', async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asasad',
      price: 28.88,
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10,
    })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'sdasafa',
      price: -10,
    })
    .expect(400)
})

it('update ticket with provided valid inputs', async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asasad',
      price: 28.88,
    })
    .expect(201)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'New Title',
      price: 98.99,
    })
    .expect(200)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200)

  expect(ticketResponse.body.title).toEqual('New Title')
  expect(ticketResponse.body.price).toEqual(98.99)
})
