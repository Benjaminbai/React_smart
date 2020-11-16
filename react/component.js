import { renderComponent } from '../react-dom'

class Component {
    constructor(props = {}) {
        this.state = {}
        this.props = props
    }
    setState(stateChange) {
        Object.assign(this.state, stateChange)
        renderComponent(this)
    }
}

export default Component