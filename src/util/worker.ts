// import {Queue, Worker} from 'bullmq';
// import redisClient from './ioredis';

// const myQueue = new Queue('firstQueue', {connection: redisClient});

// const worker = new Worker(
//   'firstQueue',
//   async job => {
//     // Process the job here
//     console.log('Processing job:', job.data);

//     // Simulate job processing
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     // Return the result of the job (if any)
//     console.log('Job processed');
//     return {success: true};
//   },
//   {connection: redisClient}
// );

// export {myQueue, worker};
