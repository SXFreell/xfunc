export default class DemoFunc {
    constructor(private plugins: Record<string, any>) {
        this.plugins = plugins;
    }

    // 下面编写用户代码
    private wecomWebhook = new this.plugins.WecomWebhook('**********');


    async run() {
        this.wecomWebhook.sendText('hello world');
    }
}