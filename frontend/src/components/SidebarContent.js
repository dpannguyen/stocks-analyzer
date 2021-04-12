import React, {Component} from "react";
// MetisMenu
import MetisMenu from "metismenujs";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Input, Label} from "reactstrap";
import {subscribeTo, unsubscribeFrom} from "../server"
import {useAuth0} from "@auth0/auth0-react";

//i18n


class SidebarContent extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initMenu();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {

      if (this.props.type !== prevProps.type) {
        this.initMenu();
      }

    }
  }

  initMenu() {
    new MetisMenu("#side-menu");

    var matchingMenuItem = null;
    var ul = document.getElementById("side-menu");
    var items = ul.getElementsByTagName("a");
    for (var i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  activateParentDropdown = item => {
    item.classList.add("active ");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  };

  render() {
    return (
      <React.Fragment>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{'Available Services'}</li>
            <ServicesComponent/>
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

const ServiceItem = ({serviceId, serviceName, serviceData, dateModified}, checked, onClick) => {
    return (
    <li key={serviceName}>
      <div className="form-check mx-4 my-2 waves-effect">
        <Input className="form-check-input" type="checkbox" value=""
               checked={checked[serviceName]}
               id={encodeURIComponent(serviceName) + "checkbox"}
               onChange={({target}) => onClick(serviceName)}/>
        <Label className="form-check-label " htmlFor={encodeURIComponent(serviceName) + "checkbox"}>
          <span className="ml-1">{serviceName}</span>
        </Label>
      </div>
    </li>
  )
}

const ServicesComponent = connect(({Services}) => ({...Services}))(({services, subscriptions}) => {
  const [checked, setChecked] = React.useState({})
  const {user} = useAuth0()

  React.useEffect(() => {
    setChecked(services.reduce((x, {serviceName}) => {
      x[serviceName] = !!find(subscriptions, serviceName)
      return x;
    }, {}))
  }, [services, subscriptions])

  function find(list, serviceName) {
    return list.find(x => x === serviceName)
  }

  function handleSubscribe(name) {
    setChecked(prev => {

      if (prev[name]) {
        unsubscribeFrom(user, name)
      } else {
        subscribeTo(user, name)
      }

      prev[name] = !prev[name]
      return prev
    })

  }

  return (
    <div>
      {services.map((service) => ServiceItem(service, checked, handleSubscribe))}
    </div>
  )
})


const mapStatetoProps = state => {
  return {...state.Layout, ...state.Services};
};

export default withRouter(connect(mapStatetoProps, {})(SidebarContent));
