import config from "./config.json";

const plugins: Record<string, any> = {};

// 动态加载启用的插件
const pluginsLoaded = new Promise<void>(async (resolve) => {
  for (const plugin of config.plugins) {
    if (plugin.enable) {
      try {
        // 假设插件目录与name相同，入口文件为index.ts
        const module = await import(`./${plugin.name}/index.ts`);
        plugins[plugin.name] = module.default || module;
      } catch (error) {
        console.error(`未能成功加载插件: ${plugin.name}:`, error);
      }
    }
  }
  resolve();
});

export default plugins;export { pluginsLoaded };
