import { natsWrapper } from '../../../nats-wrapper'
import { ExpirationCompletedListener } from '../expiration-completed-listener'
import { Order, OrderStatus } from '../../../models/order'
import { Ticket } from '../../../models/ticket'
import mongoose from 'mongoose'
import { ExpirationCompletedEvent } from '@katicketing/common'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new ExpirationCompletedListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 0,
  })
  await ticket.save()

  const order = Order.build({
    userId: 'lskdjfs87',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  })

  await order.save()

  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return {
    listener,
    order,
    ticket,
    data,
    msg,
  }
}

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const orderUpdated = await Order.findById(order.id)

  expect(orderUpdated!.status).toEqual(OrderStatus.Canceled)
})

it('emitts OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )

  expect(eventData.id).toEqual(order.id)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('ack the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
