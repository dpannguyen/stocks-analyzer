import React from "react";
import {BrowserRouter as Router, Redirect, Switch} from "react-router-dom";
import {connect} from "react-redux";
import AppRoute from "./routes/route";
// layouts
import VerticalLayout from "./components";
// Import scss
import "./theme.scss";
//Fake backend
import Dashboard from "./pages/Dashboard";
import NonAuthLayout from "./components/NonAuthLayout";
import AuthLockScreen from "./pages/AuthLockScreen";
import {useAuth0} from "@auth0/auth0-react";
import {getServices, getSubscriptions, refreshTime} from "./server";
import {setServices, setSubscriptions} from "./store/services/actions";

const Xx = connect(x => x, {setSubscriptions, setServices})(props => {
  const {isAuthenticated, user} = useAuth0()

  React.useEffect(() => {
    const interval = setInterval(() => {
      getServices().then(({data}) => props.setServices(data))
      if (isAuthenticated)
        getSubscriptions(user).then(({data}) => props.setSubscriptions(data.services.split(",").map(x => x.trim())))
    }, refreshTime);
    return () => clearInterval(interval);
  }, [isAuthenticated]);


  return (
    isAuthenticated
      ?
      <VerticalLayout>
        <Dashboard/>
      </VerticalLayout>
      :
      <NonAuthLayout>
        <AuthLockScreen/>
      </NonAuthLayout>
  )
})

const App = ({}) => {

  return (
    <React.Fragment>
      <Router>
        <Switch>
          <AppRoute
            path={"/"}
            exact={true}
            layout={React.Fragment}
            component={Xx}
          />
          <AppRoute
            path={"/"}
            layout={React.Fragment}
            component={() => <Redirect to={"/"}/>}
          />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
    services: state.Services.services
  };
};


export default connect(mapStateToProps, null)(App);
