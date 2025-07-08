// 动态加载模块
const moduleLoader = (modulePath: string, moduleNameList: string[]) => {
  const modules: Record<string, any> = {};
  return new Promise(
    async (
        resolve: (value: {
            modules: Record<string, any>;
            errorList: string[];
        }) => void
    ) => {
        const errorList = [];
        for (const moduleName of moduleNameList) {
            try {
                // 插件目录与name相同，入口文件为index.ts
                const module = await import(`@/${modulePath}/${moduleName}/index.ts`);
                modules[moduleName] = module.default || module;
            } catch (error) {
                if (modules[moduleName]) {
                    delete modules[moduleName];
                }
                console.log(`模块 ${moduleName} 加载失败: ${error}`);
                errorList.push(moduleName);
            }
        }
        resolve({ modules, errorList });
    }
)};

export default moduleLoader;
