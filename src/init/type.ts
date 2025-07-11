// 函数配置根节点
export interface FuncConfigRoot {
    funcs: FuncConfigItem[];
}

interface FuncConfigItem {
    name: string;
    enable: boolean;
    description?: string;
    trigger: FuncTrigger;
    plugin?: string[];
}

interface FuncTrigger {
    timerTrigger?: TimerTrigger[];
    httpTrigger?: HttpTrigger[];
}

interface TimerTrigger {
    name: string;
    enable: boolean;
    type: string;
    value: string;
    params?: Record<string, any>;
}

interface HttpTrigger {
    name: string;
    enable: boolean;
    path: string;
    method: string;
}

// 插件配置根节点
export interface PluginConfigRoot {
    plugins: PluginConfigItem[];
}

interface PluginConfigItem {
    name: string;
    enable: boolean;
    description?: string;
    version: string;
}