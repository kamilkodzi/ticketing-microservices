import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('has a route handler listening to api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({})

  expect(response.status).not.toEqual(404)
})

it('it can only be asseces if user is sing in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401)
})

it('return a status other than 401 is user is sign in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})

  expect(response.status).not.toEqual(401)
})

it('it return error if invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400)
})

it('it return error if invalid price provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asasas',
      price: -10,
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asasas',
    })
    .expect(400)
})

it('creates a ticket with valid input', async () => {
  let tickets = await Ticket.countDocuments()
  expect(tickets).toEqual(0)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asasda',
      price: 20,
    })
    .expect(201)
  tickets = await Ticket.countDocuments()
  expect(tickets).toEqual(1)
})
