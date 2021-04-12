import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';

import store from './store';
import {Auth0Provider} from "@auth0/auth0-react";
import {frontendUrl} from "./server";

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <Auth0Provider
        domain={"dev-ldp7br7w.us.auth0.com"}
        clientId="E8xyGbrDqzzjzdk5bz8xB4ebGVOFywmy"
        redirectUri={frontendUrl}
      >
      <App/>
      </Auth0Provider>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();

