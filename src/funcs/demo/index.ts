export default class DemoFunc {
    constructor(private plugins: Record<string, any>, private params: Record<string, any>) {
        this.plugins = plugins;
        this.params = params;
    }

    // 下面编写用户代码
    private wecomWebhook = new this.plugins.WecomWebhook('**********');


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