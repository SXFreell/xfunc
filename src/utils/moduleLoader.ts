import path from 'path';
import fs from 'fs';

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
                // 插件目录与name相同，入口文件为index
                const basePath = path.join(__dirname, `../${modulePath}/${moduleName}`);
                // 读取 config.json
                let config = null;
                const configPath = path.join(basePath, 'config.json');
                if (fs.existsSync(configPath)) {
                    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                    if (!config) {
                        console.log(`模块 ${moduleName} 配置文件不存在`);
                        continue;
                    } else if (!config.enable) continue;
                }
                // 加载模块
                const entry = process.env.NODE_ENV === 'production' ? 'index.js' : 'index.ts';
                const module = await import(`${basePath}/${entry}`);
                modules[moduleName] = { module: module.default || module, config };
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
