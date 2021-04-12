import React from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
// users
import avatar2 from '../../assets/images/users/avatar-2.jpg';
import {useAuth0} from "@auth0/auth0-react";

const ProfileMenu = ({}) => {
  const [showMenu, setShowMenu] = React.useState(false)
  const {logout, user} = useAuth0()

  function toggle() {
    setShowMenu(prev => !prev)
  }

  return (
    <React.Fragment>
      <Dropdown isOpen={showMenu} toggle={toggle} className="d-inline-block user-dropdown">
        <DropdownToggle tag="button" className="btn header-item waves-effect" id="page-header-user-dropdown">
          <img className="rounded-circle header-profile-user mr-1" src={user?.picture} alt="Header Avatar"/>
          <span className="d-none d-xl-inline-block ml-1 text-transform">{user?.name}</span>
          <i className="mdi mdi-chevron-down d-none ml-1 d-xl-inline-block"/>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem className="text-danger" onClick={() => logout()}><i
            className="ri-shut-down-line align-middle mr-1 text-danger"/> {'Logout'}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
}

export default ProfileMenu;
