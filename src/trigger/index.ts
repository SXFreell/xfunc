import HttpTrigger from './http';
import TimerTrigger from './timer';

const httpTrigger = new HttpTrigger();
const timerTrigger = new TimerTrigger();

export {
    httpTrigger,
    timerTrigger,
}