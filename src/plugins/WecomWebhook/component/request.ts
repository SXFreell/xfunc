import axios, { AxiosInstance } from "axios";

export default class Request {
    private instance: AxiosInstance;
    private headers: Record<string, string>;
    constructor(baseURL: string, headers: Record<string, string>) {
        this.headers = headers;
        this.instance = axios.create({
            baseURL,
            headers,
        });
    }
    
    async post(data: any) {
        await this.instance.post('', data);
    }
}