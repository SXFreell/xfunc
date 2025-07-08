import axios, { AxiosInstance } from "axios";

export default class Request {
    private instance: AxiosInstance;
    constructor(baseURL: string, private headers: Record<string, string>) {
        this.instance = axios.create({
            baseURL,
            headers,
        });
    }
    
    async post(data: any) {
        await this.instance.post('', data);
    }
}