import moduleLoader from '@/utils/moduleLoader';
import { PluginConfigItem, FuncConfigItem } from './type';
import fs from 'fs';
import path from 'path';

// 动态读取所有插件目录下的config.json
function getAllPluginConfigs(): PluginConfigItem[] {
    const pluginsDir = path.join(__dirname, '../plugins');
    const pluginDirs = fs.readdirSync(pluginsDir).filter(name => {
        const fullPath = path.join(pluginsDir, name);
        return fs.statSync(fullPath).isDirectory();
    });
    const plugins = pluginDirs.map(dir => {
        const configPath = path.join(pluginsDir, dir, 'config.json');
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            return config;
        }
        return null;
    }).filter(Boolean);
    return plugins;
}

// 动态读取所有函数目录下的config.json
function getAllFuncConfigs(): FuncConfigItem[] {
    const funcsDir = path.join(__dirname, '../funcs');
    const funcDirs = fs.readdirSync(funcsDir).filter(name => {
        const fullPath = path.join(funcsDir, name);
        return fs.statSync(fullPath).isDirectory();
    });
    const funcs = funcDirs.map(dir => {
        const configPath = path.join(funcsDir, dir, 'config.json');
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            return config;
        }
        return null;
    }).filter(Boolean);
    return funcs;
}

const pluginConfig = getAllPluginConfigs();
const funcConfig = getAllFuncConfigs();

const initPlugins = async (): Promise<Record<string, any>> => {
    const pluginNameList = pluginConfig.filter(item => item.enable).map(item => item.name);
    const { modules: plugins, errorList } = await moduleLoader('plugins', pluginNameList);
    console.log(`插件加载完成，成功加载 ${Object.keys(plugins).length} 个，失败 ${errorList.length} 个`);
    return plugins;
}

const initFuncs = async (triggers: any, plugins: Record<string, any>) => {
    const funcEnableList = funcConfig.filter(item => item.enable);
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