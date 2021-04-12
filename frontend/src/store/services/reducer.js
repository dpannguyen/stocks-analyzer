// @flow
import {ADD_SERVICE, REMOVE_SERVICE, SET_SERVICES, SET_SUBSCRIPTIONS,} from "./actionTypes";
import {MDBDataTable} from "mdbreact";
import React from "react";




const INIT_STATE = {
  services: [],
  subscriptions: []
};


const Services = (state = INIT_STATE, {type, payload}) => {
  switch (type) {
    case SET_SERVICES: {
      return {
        ...state,
        services: payload
      }
    }
    case SET_SUBSCRIPTIONS: {
      return {
        ...state,
        subscriptions: payload
      }
    }

    default:
      return state;
  }
};

export default Services;
