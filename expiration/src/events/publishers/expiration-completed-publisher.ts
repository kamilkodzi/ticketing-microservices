import {
  Subjects,
  Publisher,
  ExpirationCompletedEvent,
} from '@katicketing/common'

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted
}
