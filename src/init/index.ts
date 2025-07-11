import moduleLoader from '@/utils/moduleLoader';
import { PluginConfigItem, FuncConfigItem } from './type';
import fs from 'fs';
import path from 'path';

// 初始化插件
const initPlugins = async (): Promise<Record<string, any>> => {
    const pluginNameListDir = path.join(__dirname, '../plugins');
    const pluginDirs = fs.readdirSync(pluginNameListDir).filter(name => {
        const fullPath = path.join(pluginNameListDir, name);
        return fs.statSync(fullPath).isDirectory();
    });
    const { modules: plugins, errorList } = await moduleLoader('plugins', pluginDirs);
    console.log(`插件加载完成，成功加载 ${Object.keys(plugins).length} 个，失败 ${errorList.length} 个`);
    return plugins;
}

// 初始化函数
const initFuncs = async (triggers: any, plugins: Record<string, any>) => {
    const funcsNameListDir = path.join(__dirname, '../funcs');
    const funcDirs = fs.readdirSync(funcsNameListDir).filter(name => {
        const fullPath = path.join(funcsNameListDir, name);
        return fs.statSync(fullPath).isDirectory();
    });
    const { modules: funcsModule, errorList } = await moduleLoader('funcs', funcDirs);
    console.log(`函数模块加载完成，成功加载 ${Object.keys(funcsModule).length} 个，失败 ${errorList.length} 个`);
    console.log(`开始创建函数触发器任务...`);
    for (const [name, { module, config }] of Object.entries(funcsModule)) {
        const enablePlugin: Record<string, any> = {};
        for (const pluginName of config.plugin || []) {
            enablePlugin[pluginName] = plugins[pluginName];
        }
        // 定时触发器
        if (config.trigger && config.trigger.timerTrigger) {
            const timerTrigger = triggers.timerTrigger;
            for (const timerTriggerConfig of config.trigger.timerTrigger) {
                if (!timerTriggerConfig.enable) continue;
                if (timerTriggerConfig.type === 'cron') {
                    timerTrigger.scheduleJob(timerTriggerConfig.value, () => {
                        const funcInstance = new module(enablePlugin, timerTriggerConfig.params);
                        funcInstance.run();
                    });
                }
            }
        }
        // HTTP触发器
        if (config.trigger && config.trigger.httpTrigger) {
            const httpTrigger = triggers.httpTrigger;
            for (const httpTriggerConfig of config.trigger.httpTrigger) {
                if (!httpTriggerConfig.enable) continue;
                if (httpTriggerConfig.method === 'GET') {
                    httpTrigger.get(httpTriggerConfig.path, async (req: any, res: any) => {
                        const allParams = {
                            ...req.params,
                            ...req.query
                        }
                        try {
                            const funcInstance = new module(enablePlugin, allParams);
                            await funcInstance.run();
                            res.json({code: 1, message: 'success'});
                        } catch (error) {
                            console.error(error);
                            res.json({code: 0, message: 'error'});
                        }
                    });
                } else if (httpTriggerConfig.method === 'POST') {
                    httpTrigger.post(httpTriggerConfig.path, async (req: any, res: any) => {
                        const allParams = {
                            ...req.params,
                            ...req.query,
                            ...req.body
                        }
                        try {
                            const funcInstance = new module(enablePlugin, allParams);
                            await funcInstance.run();
                            res.json({code: 1, message: 'success'});
                        } catch (error) {
                            console.error(error);
                            res.json({code: 0, message: 'error'});
                        }
                    });
                }
            }
        }
    }
}

export {
    initPlugins,
    initFuncs
}