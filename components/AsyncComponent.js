import React, { Component } from 'react';

export default function AsyncComponent(getModuleAsync, componentName = 'default') {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null
      };
    }

    async componentDidMount() {
      const module = await getModuleAsync();
      const component = module[componentName];
      this.setState({
        component: component
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}
