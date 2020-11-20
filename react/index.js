import Component from './component'

// 实现react的createelement
function createElement(tag, attrs, ...childrens) {
    return {
        tag,
        attrs,
        childrens
    }
}

export default {
    createElement,
    Component
}

