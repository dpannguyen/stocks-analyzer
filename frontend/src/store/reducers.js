import {combineReducers} from 'redux';

import Layout from './layout/reducer';
import Services from "./services/reducer";

const rootReducer = combineReducers({
  Layout,
  Services
});

export default rootReducer;