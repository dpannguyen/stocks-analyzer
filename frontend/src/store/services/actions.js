import {SET_SERVICES, SET_SUBSCRIPTIONS} from "./actionTypes";

export const setServices = (services) => ({
  type: SET_SERVICES,
  payload: services
});

export const setSubscriptions = (subscriptions) => ({
  type: SET_SUBSCRIPTIONS,
  payload: subscriptions
});