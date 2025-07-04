import 'tsconfig-paths/register';
import { httpTrigger, timerTrigger } from '@/trigger';
import { initFuncs, initPlugins } from '@/init';

const triggers = {
    httpTrigger,
    timerTrigger
}

const plugins = initPlugins();
const funcs = initFuncs(triggers, plugins);


// import loadedPlugins from '@/plugins';

// console.log(httpTrigger, timerTrigger)

// 加载函数

