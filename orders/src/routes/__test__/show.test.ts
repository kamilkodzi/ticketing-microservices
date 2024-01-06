import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('fetch the order', async () => {
  // Create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })
  await ticket.save()
  const user = global.signin()

  // make request to build order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  //make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)

  expect(fetchedOrder.id).toEqual(order.id)
})

it('returns an error whe ne user fetch another user order', async () => {
  // Create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  })
  await ticket.save()
  const user = global.signin()

  // make request to build order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  //make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401)
})
