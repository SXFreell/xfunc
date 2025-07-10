// utils/globalVars.js

class GlobalVars {
    private _vars: Map<string, any>;
    constructor() {
        this._vars = new Map();
    }

    /**
     * 设置全局变量
     * @param {string} key - 变量名
     * @param {*} value - 变量值
     */
    set(key: string, value: any) {
        if (typeof key !== "string") {
        throw new Error("Global variable key must be a string");
        }
        this._vars.set(key, value);
    }

    /**
     * 获取全局变量
     * @param {string} key - 变量名
     * @param {*} [defaultValue] - 如果变量不存在返回的默认值
     * @returns {*} 变量值或默认值
     */
    get(key: string, defaultValue?: any): any {
        return this._vars.has(key) ? this._vars.get(key) : defaultValue;
    }

    /**
     * 检查全局变量是否存在
     * @param {string} key - 变量名
     * @returns {boolean} 是否存在
     */
    has(key: string): boolean {
        return this._vars.has(key);
    }

    /**
     * 删除全局变量
     * @param {string} key - 变量名
     * @returns {boolean} 是否删除成功
     */
    delete(key: string): boolean {
        return this._vars.delete(key);
    }

    /**
     * 清空所有全局变量
     */
    clear() {
        this._vars.clear();
    }
}

// 创建单例实例
const globalVars = new GlobalVars();

export default globalVars;
