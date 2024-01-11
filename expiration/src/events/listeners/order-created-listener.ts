import { Listener, OrderCreatedEvent, Subjects } from '@katicketing/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGrouName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    console.log('Waiting this many miliseconds to process the job: ', delay)

    await expirationQueue.add(
      { orderId: data.id }
      // { delay }
    )
    msg.ack()
  }
}
