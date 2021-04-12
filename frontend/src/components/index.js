import React from "react";

import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
// Layout Related Components
import Header from "./Header";
import {changeSidebarType} from "../store/layout/actions";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout = ({isPreloader, location, children, changeSidebarType}) => {
  React.useEffect(() => {
    if (isPreloader === true) {
      document.getElementById('preloader').style.display = "block";
      document.getElementById('status').style.display = "block";

      setTimeout(function () {

        document.getElementById('preloader').style.display = "none";
        document.getElementById('status').style.display = "none";

      }, 2500);
    } else {
      document.getElementById('preloader').style.display = "none";
      document.getElementById('status').style.display = "none";
    }
  }, [isPreloader])

  React.useEffect(() => {
    window.scrollTo(0, 0);

    document.title = "Stonks Analyzer";
  }, [])

  const [showSidebar, setShowSidebar] = React.useState(false)

  React.useEffect(() => {
    changeSidebarType(showSidebar)
  }, [showSidebar])

  return (
    <React.Fragment>
      <div id="preloader">
        <div id="status">
          <div className="spinner">
            <i className="ri-loader-line spin-icon"/>
          </div>
        </div>
      </div>


      <div id="layout-wrapper">
        <Header toggleMenuCallback={() => setShowSidebar(prev => !prev)}/>
        {showSidebar && <Sidebar/>}
        <div className="main-content">
          {children}
          <Footer/>
        </div>
      </div>
    </React.Fragment>
  );
}

export default connect(null, {
  changeSidebarType
})(withRouter(Layout));

