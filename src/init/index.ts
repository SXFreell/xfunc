import moduleLoader from '@/utils/moduleLoader';
import { PluginConfigRoot, FuncConfigRoot } from './type';
import originPluginConfig from '@/plugins/config.json';
import originFuncConfig from '@/funcs/config.json';

const pluginConfig: PluginConfigRoot = originPluginConfig;
const funcConfig: FuncConfigRoot = originFuncConfig;

const initPlugins = async (): Promise<Record<string, any>> => {
    const pluginNameList = pluginConfig.plugins.filter(item => item.enable).map(item => item.name);
    const { modules: plugins, errorList } = await moduleLoader('plugins', pluginNameList);
    console.log(`插件加载完成，成功加载 ${Object.keys(plugins).length} 个，失败 ${errorList.length} 个`);
    return plugins;
}

const initFuncs = async (triggers: any, plugins: Record<string, any>) => {
    const funcEnableList = funcConfig.funcs.filter(item => item.enable);
    const funcNameList = funcEnableList.map(item => item.name);
    const { modules: funcsModule, errorList } = await moduleLoader('funcs', funcNameList);
    console.log(`函数模块加载完成，成功加载 ${Object.keys(funcsModule).length} 个，失败 ${errorList.length} 个`);
    console.log(`开始创建函数触发器任务...`);
    for (const funcConfig of funcEnableList) {
        const name = funcConfig.name;
        const enablePlugin: Record<string, any> = {};
        for (const pluginName of funcConfig.plugin || []) {
            enablePlugin[pluginName] = plugins[pluginName];
        }
        // 定时触发器
        if (funcConfig.trigger.timerTrigger) {
            const timerTrigger = triggers.timerTrigger;
            for (const timerTriggerConfig of funcConfig.trigger.timerTrigger) {
                if (!timerTriggerConfig.enable) continue;
                if (timerTriggerConfig.type === 'cron') {
                    timerTrigger.scheduleJob(timerTriggerConfig.value, () => {
                        const funcInstance = new funcsModule[name](enablePlugin, timerTriggerConfig.params);
                        funcInstance.run();
                    });
                }
            }
        }
        // HTTP触发器
        if (funcConfig.trigger.httpTrigger) {
            const httpTrigger = triggers.httpTrigger;
            for (const httpTriggerConfig of funcConfig.trigger.httpTrigger) {
                if (!httpTriggerConfig.enable) continue;
                if (httpTriggerConfig.method === 'GET') {
                    httpTrigger.get(httpTriggerConfig.path, async (req: any, res: any) => {
                        const allParams = {
                            ...req.params,
                            ...req.query
                        }
                        try {
                            const funcInstance = new funcsModule[name](enablePlugin, allParams);
                            await funcInstance.run();
                            res.json({code: 1, message: 'success'});
                        } catch (error) {
                            console.error(error);
                            res.send({code: 0, message: 'error'});
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
                            const funcInstance = new funcsModule[name](enablePlugin, allParams);
                            await funcInstance.run();
                            res.json({code: 1, message: 'success'});
                        } catch (error) {
                            console.error(error);
                            res.send({code: 0, message: 'error'});
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