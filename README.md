# xfunc

xfunc 是一个支持插件和函数模块化、可通过 HTTP 和定时任务触发的自动化运行框架。

## 主要特性
- 支持插件化扩展
- 支持自定义函数模块
- 支持 HTTP 触发和定时（Cron）触发
- 插件与函数解耦，灵活组合
- 简单的配置驱动

## 目录结构
```
src/
  ├── config/         # 配置文件（开发/生产）
  ├── funcs/          # 函数模块目录（每个子目录为一个函数）
  ├── init/           # 初始化相关
  ├── plugins/        # 插件目录（每个子目录为一个插件）
  ├── trigger/        # 触发器（http/timer）
  └── utils/          # 工具方法
```

## 环境要求
- Node.js 16+
- pnpm（推荐）

## 安装与运行
```bash
pnpm install
# 开发模式
pnpm run dev
# 生产模式
pnpm run pro
pnpm start
# 或使用 pm2
export NODE_ENV=production
pnpm run build
pm2 start dist/main.js -i 1 --name xfunc
```

## 配置说明
配置文件位于 `src/config/`，支持开发（development.ts）和生产（production.ts）环境。

主要配置项：
- `trigger.http.port`：HTTP 服务端口，默认 3000
- `trigger.http.cors`：CORS 配置
- `trigger.timer`：定时任务相关配置

## 插件与函数开发示例

### 插件示例
`src/plugins/WecomWebhook/config.json`
```json
{
  "name": "WecomWebhook",
  "enable": true,
  "description": "企业微信Webhook插件",
  "version": "v1.0.0"
}
```

### 函数模块示例
`src/funcs/demo/config.json`
```json
{
  "name": "demo",
  "enable": true,
  "description": "示例",
  "trigger": {
    "httpTrigger": [
      {
        "name": "httpDemo",
        "enable": true,
        "path": "/demo",
        "method": "GET"
      }
    ],
    "timerTrigger": [
      {
        "name": "timerDemo",
        "enable": true,
        "type": "cron",
        "value": "*/2 * * * * *",
        "params": { "type": "test1" }
      }
    ]
  },
  "plugin": ["WecomWebhook"]
}
```

`src/funcs/demo/index.ts`
```ts
export default class DemoFunc {
  private plugins: Record<string, any>;
  private params: Record<string, any>;
  private wecomWebhook: any;
  constructor(plugins: Record<string, any>, params: Record<string, any>) {
    this.plugins = plugins;
    this.params = params;
    this.wecomWebhook = new this.plugins.WecomWebhook('你的企业微信key');
  }
  async run() {
    if (this.params.type === 'test1') {
      this.wecomWebhook.sendText('test1');
    }
  }
}
```

## 触发器说明
- HTTP 触发：支持 GET/POST，自动注册到 Express 路由
- 定时触发：基于 node-schedule，支持 cron 表达式

## 许可证
本项目采用 [LICENSE](LICENSE) 进行许可。