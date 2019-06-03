/**
 * 装饰函数
 * @param {*} func 被装饰的函数
 * @param {*} decorator 装饰器
 */
const decorateFunction = (func, decorator) => {
    return decorator(func);
}

/**
* 装饰方法
* @param {*} func 被装饰的方法 
* @param {*} decorator 装饰器
* @param {*} context 上下文
*/
const decorateMethod = (func, decorator, context) => {
    return decorator.bind(context)(func);
}


export {
    decorateMethod,
    decorateFunction
}