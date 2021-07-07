import Queue, { Job } from "bull";
import { ExpirationCompletedPublisher } from "../events/publishers/expiration-completed-publisher";
import { natsWrapper } from "../nats-wrapper";

interface PayLoad {
  orderId: string;
}

const expirationQueue = new Queue<PayLoad>("order-expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job: Job<PayLoad>) => {
  new ExpirationCompletedPublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export default expirationQueue;
