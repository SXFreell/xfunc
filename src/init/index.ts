import { Plugin, Trigger } from './type';
import loadedPlugins, { pluginsLoaded } from "@/plugins";

const initPlugins = (): Plugin[] => {
    pluginsLoaded.then(() => {
        console.log(loadedPlugins);
        loadedPlugins.WecomWebhook.sendText("hello");
    }).catch(console.error);
    return [];
}

const initFuncs = (triggers: Trigger, plugins: Plugin[]) => {

}

export {
    initPlugins,
    initFuncs
}