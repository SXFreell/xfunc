import express from 'express';
import morgan from 'morgan';

export default class HttpTrigger {
    private app: express.Express;

    constructor() {
        this.app = express();
        this.app.use(morgan('combined'));
    }

    start(port: number) {
        this.app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}