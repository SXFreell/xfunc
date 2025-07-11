// 函数配置
export interface FuncConfigItem {
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

// 插件配置
export interface PluginConfigItem {
    name: string;
    enable: boolean;
    description?: string;
    version: string;
}