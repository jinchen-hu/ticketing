import Queue, { Job } from "bull";

interface PayLoad {
  orderId: string;
}

const expirationQueue = new Queue<PayLoad>("order-expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job: Job<PayLoad>) => {
  console.log("process the job", job.data.orderId);
});

export default expirationQueue;
