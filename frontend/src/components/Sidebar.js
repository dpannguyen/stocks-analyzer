import React, {Component} from "react";
//Simple bar

import SidebarContent from "./SidebarContent";


class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="vertical-menu">
          <div data-simplebar className="h-100">
            <SidebarContent/>
          </div>

        </div>
      </React.Fragment>
    );
  }
}

export default Sidebar
