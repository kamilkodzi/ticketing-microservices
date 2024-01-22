import { Subjects, Publisher, PaymentCompletedEvent } from '@katicketing/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCompletedEvent> {
  readonly subject = Subjects.PaymentCreated
}
