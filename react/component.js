import {enqueueSetState} from './ser_state_queue'
import { renderComponent } from '../react-dom'
class Component {
    constructor(props = {}) {
        this.props = props
        this.state = {}
    }
    setState(stateChange) {
        // Object.assign(this.state, stateChange)
        // renderComponent(this)

        enqueueSetState(stateChange, this)
    }
}

export default Component