import React from "react";

import {connect} from "react-redux";
//Import logo Images
import logodark from "../assets/images/logo-dark.png";
import Button from "reactstrap/es/Button";
import {useAuth0} from "@auth0/auth0-react";
import ProfileMenu from "./TopbarDropdown/ProfileMenu";

const Header = ({toggleMenuCallback}) => {
  /**
   * Toggle sidebar
   */
  function toggleMenu() {
    toggleMenuCallback();
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <Button size="lg" color="none" type="button" onClick={toggleMenu}
                    className="px-3 font-size-24 header-item waves-effect" id="vertical-menu-btn">
              <i className="ri-menu-line align-middle"></i>
            </Button>
            <div className="navbar-brand-box">
              <div className="logo logo-dark">
                  <span className="logo-lg">
                    <img src={logodark} alt="" height="50"/>
                  </span>
              </div>
            </div>
          </div>

          <div className="d-flex">
            <ProfileMenu/>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}

const mapStatetoProps = state => {
  const {layoutType} = state.Layout;
  return {layoutType};
};

export default connect(mapStatetoProps)(Header);
