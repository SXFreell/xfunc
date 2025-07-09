export default class DemoFunc {
    private plugins: Record<string, any>;
    private params: Record<string, any>;
    private wecomWebhook: any;
    constructor(plugins: Record<string, any>, params: Record<string, any>) {
        this.plugins = plugins;
        this.params = params;
        this.wecomWebhook = new this.plugins.WecomWebhook('**********');
    }


    async run() {
        if (this.params.type === 'test1') {
            console.log(this.params.type);
            this.wecomWebhook.sendText('test1');
        } else if (this.params.type === 'test2') {
            console.log(this.params.type);
            this.wecomWebhook.sendText('test2');
        }
    }
}