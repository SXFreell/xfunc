import globalConfig from '../config/global';
import { httpTrigger, timerTrigger } from './trigger';

const port = globalConfig.trigger.http.port;

httpTrigger.start(port);

const jobName = timerTrigger.scheduleJob('*/1 * * * * *', () => {
    console.log('定时任务执行，当前时间：', new Date());
});

setTimeout(() => {
    timerTrigger.cancelJob(jobName);
}, 5000);
