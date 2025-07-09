import Request from "./component/request";

const env = {
    webhook: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=',

}

export default class WecomWebhook {
    private request: any;
    private secret: string;
    private webhookUrl: string;
    constructor(secret: string, webhookUrl = env.webhook) {
        this.secret = secret;
        this.webhookUrl = webhookUrl;
        this.request = new Request(webhookUrl + secret, {
            'Content-Type': 'application/json',
        });
    }

    async sendText(content: string, mentioned_list?: string[], mentioned_mobile_list?: string[]) {
        await this.request.post({
            msgtype: 'text',
            text: {
                content,
                mentioned_list,
                mentioned_mobile_list,
            }
        });
    }

    async sendMarkdown(content: string, type: 1 | 2 = 1) {
        await this.request.post({
            msgtype: type === 1 ? 'markdown' : 'markdown_v2',
            markdown: {
                content,
            }
        });
    }

    async sendImage(base64: string, md5: string) {
        await this.request.post({
            msgtype: 'image',
            image: {
                base64,
                md5,
            }
        });
    }

    async sendNews(articles: { title: string, description?: string, url: string, picurl?: string }[]) {
        await this.request.post({
            msgtype: 'news',
            news: {
                articles,
            }
        });
    }

    async sendFile(media_id: string) {
        await this.request.post({
            msgtype: 'file',
            file: {
                media_id,
            }
        });
    }

    async sendVideo(media_id: string) {
        await this.request.post({
            msgtype: 'video',
            video: {
                media_id,
            }
        });
    }

    async sendTemplateCard(card: any) {
        await this.request.post({
            msgtype: 'template_card',
            template_card: card,
        });
    }

}
