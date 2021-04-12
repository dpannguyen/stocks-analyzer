import React from 'react';

import img from "../assets/images/3.jpg"
import logodark from "../assets/images/logo-dark.png";
import {Button} from "reactstrap";
import {useAuth0} from "@auth0/auth0-react";


const AuthLockScreen = ({}) => {
  const {loginWithRedirect} = useAuth0()


  return (

    <div style={{
      backgroundImage: `url(${img})`, backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      width: "100vw",
      height: "100vh",
    }}>
      <div style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.63)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          width: "500px",
          backgroundColor: "rgb(255,255,255)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "30px",
          padding: "50px"
        }}>
          <div className={"my-5"}>
            <img src={logodark} alt="" width="350"/>
          </div>
          <div className={"mt-5"}>

            <Button className={"px-5 py-3"} color={"primary"} size={"lg"} onClick={() => loginWithRedirect()}>Login</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLockScreen;