import axios from "axios";

// const apiGatewayUrl = "https://4471-apigateway.azurewebsites.net/"
// const subscribeUrl = "https://4471-apigateway.azurewebsites.net/"
const apiGatewayUrl = "http://localhost:4444"
const subscribeUrl = "http://localhost:4444"
const frontendUrl = "http://localhost:3000"
const refreshTime = 1000


axios.interceptors.response.use(function (response) {
  const key = response.config.url
  const value = response.data

  console.log(key, value)
  return response;
});

function getUserId(user) {
  return user.sub.replace(/[^A-z0-9]/g, "")
}

function getServices() {
  return axios.get([apiGatewayUrl, "GetServices"].join("/"))
}

function subscribeTo(user, serviceName) {
  return axios.get([subscribeUrl, "subscribe", getUserId(user), encodeURIComponent(serviceName)].join("/"))
}

function unsubscribeFrom(user, serviceName) {
  return axios.get([subscribeUrl, "unsubscribe", getUserId(user), encodeURIComponent(serviceName)].join("/"))
}

function getSubscriptions(user) {
  return axios.get([subscribeUrl, getUserId(user)].join("/"))
}


export {getServices, subscribeTo, unsubscribeFrom, frontendUrl, getSubscriptions, refreshTime}