import express from 'express';
import morgan from 'morgan';
import globalConfig from '@/config/global';

const port = globalConfig.trigger.http.port;
export default class HttpTrigger {
    private app: express.Express;

    constructor() {
        this.app = express();
        this.app.use(morgan('combined'));
        this.app.listen(port, () => {
            console.log(`启动Http触发器 [http://localhost:${port}]`);
        });
    }
}