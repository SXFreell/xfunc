import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from '@/config';

const port = config.trigger.http.port;
export default class HttpTrigger {
    private app: express.Express;

    constructor() {
        this.app = express();
        this.app.use(morgan('combined'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        
        // 配置CORS
        if (config.trigger.http.cors?.enabled) {
            const corsOptions = {
                origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
                    // 允许没有origin的请求（如移动端应用）
                    if (!origin) {
                        return callback(null, true);
                    }
                    
                    const allowedOrigins = config.trigger.http.cors.origins || [];
                    if (allowedOrigins.includes(origin)) {
                        callback(null, true);
                    } else {
                        callback(new Error('Not allowed by CORS'));
                    }
                },
                credentials: config.trigger.http.cors.credentials || false,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
            };
            
            this.app.use(cors(corsOptions));
        }
        
        this.app.listen(port, () => {
            console.log(`启动Http触发器 [http://localhost:${port}]`);
            if (config.trigger.http.cors?.enabled) {
                console.log(`CORS已启用，允许的源: ${config.trigger.http.cors.origins.join(', ')}`);
            }
        });
    }

    public get(path: string, callback: (req: any, res: any) => void) {
        this.app.get(path, callback);
    }

    public post(path: string, callback: (req: any, res: any) => void) {
        this.app.post(path, callback);
    }
}