
import { setAttribute, setComponentProps, createComponent } from './index'
export function diff(dom, vnode, container) {
    const ret = diffNode(dom, vnode)
    if (container) {
        container.appendChild(ret)
    }

    return ret
}

// diffnode 接收真实dom和虚拟dom
export function diffNode(dom, vnode) {
    // 保存真实dom
    let out = dom
    // 判断传入的内容---是空
    if (vnode === undefined || vnode === null || typeof vnode === "boolean") vnode = ""
    // 是数字类型转换为字符类型
    if (typeof vnode === "number") vnode = String(vnode)
    // 如果是字符类型
    if (typeof vnode === "string") {
        // 判断 
        // 元素element ： 1
        // 属性attr ： 2
        // 文本text ： 3
        // 注释comments ： 8
        // 文档document ： 9
        if (dom && dom.nodeType === 3) {
            // 如果改变了，直接赋值更改
            if (dom.textContent !== vnode) {
                dom.textContent = vnode
            }
        } else {
            // 如果真实dom不是文本类型，则创建虚拟dom的节点
            out = document.createTextNode(vnode)
            // 如果有父级元素
            if (dom && dom.parentNode) {
                // 替换父级元素，用新节点out，替换老节点dom
                dom.parentNode.replaceNode(out, dom)
            }
        }
        // 返回out
        return out
    }

    // 如果是函数类型
    if (typeof vnode.tag === 'function') {
        // 需要转
        return diffComponent(out, vnode)
    }
    // 如果真实dom不存在
    if (!dom) {
        // 创建虚拟dom的标签
        out = document.createElement(vnode.tag)
    }
    // 判断如果有子节点，则递归操作
    if (vnode.childrens && vnode.childrens.length > 0 || (out.childNodes && out.childNodes > 0)) {
        diffChildren(out, vnode.childrens)
    }
    // 操作属性
    diffAttribute(out, vnode)
    return out
}

// 接收真实dom和虚拟dom
function diffComponent(dom, vnode) {
    let comp = dom
    // 如果是同类型组件
    if (comp && comp.constructor === vnode.tag) {
        // 更新组件属性
        setComponentProps(comp, vnode.attrs)
        // 挂载到dom
        dom = comp.base
    } else {
        // 如果不是同类型
        if (comp) {
            // 需要移除
            unmountComponent(comp)
            comp = null
        }
        // 新建虚拟dom到
        comp = createComponent(vnode.tag, vnode.attrs)
        // 设置属性
        setComponentProps(comp, vnode.attrs)
        // 挂载
        dom = comp.base
    }
    return dom
}

function unmountComponent(comp) {
    removeNode(comp.base)
}
function removeNode(dom) {
    // 如果存在父级元素， 则移除
    if (dom && dom.parentNode) {
        dom.parentNode.removeNode(dom)
    }
}

// 循环遍历操作子元素
function diffChildren(dom, vchildrens) {
    const domChildren = dom.childNodes
    const children = []
    const keyed = {}
    // 如果真实dom到child个数大于0
    if (domChildren.length > 0) {
        domChildren.forEach((c) => {
            // 判断attributes存在，并且有key这个属性
            if (c.attributes && "key" in c.attributes) {
                // 把每一项赋值给keyed的attributes属性
                keyed.attributes["key"] = c
            } else {
                // 没有则直接添加
                children.push(c)
            }
        })
    }

    // 如果虚拟dom中的子节点大于0
    if (vchildrens && vchildrens.length > 0) {
        let min = 0
        let childrenLen = children.length
        const vchildrensArray = [...vchildrens]
        vchildrensArray.forEach((vchild, i) => {
            // 取vchild的key
            const key = vchild.key
            let child
            // 如果key存在
            if (key) {
                // 判断真实dom里有没有这个key
                if (keyed[key]) {
                    child = keyed[key]
                    // 有的话清空
                    keyed[key] = undefined
                }
                // 如果子元素个数大于0
            } else if (childrenLen > min) {
                // 循环子元素数组
                for (let j = min; j < childrenLen; j++) {
                    // 赋值给c
                    let c = children[j]
                    if (c) {
                        child = c
                        // 把当前清空
                        children[j] = undefined
                        // 
                        if (j == childrenLen - 1) childrenLen--
                        if (j == min) min++
                        break
                    }
                }
            }
            child = diffNode(child, vchild)
            const f = domChildren[i]
            if (child && child !== dom && child !== f) {
                if (!f) {
                    dom.appendChild(child)
                } else if (child === f.nextSibling) {
                    removeNode(f)
                } else {
                    dom.insertBefore(child, f)
                }
            }
        });
    }
}

function diffAttribute(dom, vnode) {
    // 用来保存老属性
    const oldAttrs = {}
    // 新属性
    const newAttrs = vnode.attrs
    // 老属性
    const domAttrs = dom.attributes
    const attrArray = [...domAttrs]
    // 循环遍历老属性
    attrArray.forEach(item => {
        // 保存
        oldAttrs[item.name] = item.value
    })

    // 判断老属性中的属性，在新属性中是否存在
    for (let key in oldAttrs) {
        // 不存在则置为空
        if (!(key in newAttrs)) {
            setAttribute(dom, key, undefined)
        }
    }
    // 循环新属性
    for (let key in newAttrs) {
        // 新老相同的key对应的属性值如果不相等
        if (oldAttrs[key] !== newAttrs[key]) {
            // 替换
            setAttribute(dom, key, newAttrs[key])
        }
    }
}