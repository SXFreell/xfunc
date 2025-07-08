import moduleLoader from '@/utils/moduleLoader';
import pluginConfig from '@/plugins/config.json';
import funcConfig from '@/funcs/config.json';

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
        for (const pluginName of funcConfig.plugin) {
            enablePlugin[pluginName] = plugins[pluginName];
        }
        if (funcConfig.trigger.timerTrigger) {
            const timerTrigger = triggers.timerTrigger;
            for (const timerTriggerConfig of funcConfig.trigger.timerTrigger) {

                timerTrigger.scheduleJob(timerTriggerConfig.value, () => {
                    const funcInstance = new funcsModule[name](enablePlugin);
                    funcInstance.run();
                });
            }
        }
    }
}

export {
    initPlugins,
    initFuncs
}