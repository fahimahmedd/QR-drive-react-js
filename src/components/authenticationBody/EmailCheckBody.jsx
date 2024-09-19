import React, { Fragment, useEffect, useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import Logo from "../../asset/image/logo.png";
import AuthenticationGraphix from "./AuthenticationGraphix";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { userCheckUrl } from "../api/Api";
import Loader from "../Loader/Loader";
import { ToastContainer } from "react-toastify";
import { errorNotify } from "../Toast/Toast";
import { ReactSession } from "react-client-session";
const EmailCheckBody = () => {
  ReactSession.setStoreType("localStorage");

  const [loaderVisible, setLoaderVisible] = useState("none");
  const location = useLocation();
  const navigate = useNavigate();
  const [uuid, setUuid] = useState(ReactSession.get("uuid"));
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    setLoaderVisible("");
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(regex)) {
      axios
        .post(userCheckUrl, {
          email: email,
        })
        .then((res) => {
          ReactSession.set("email", email);
          if (res.data.length > 0) {
            ReactSession.set("user_id", res.data[0].id);
            navigate("/activation-code");
          } else {
            navigate("/register");
          }
        })
        .catch(function (error) {
          setEmail("");
          setLoaderVisible("none");
          errorNotify("Invalid. Please try again!", 4000);
        });
    } else {
      setLoaderVisible("none");
      errorNotify("Invalid Email.Please give valid Email");
    }
  };
  return (
    <Fragment>
      <div className="entry_bg">
        <div className="entry_container">
          <Grid container spacing={2} alignItems="center">
            <Grid className="mob_none" item lg={6} md={12} sm={12} xs={12}>
              <AuthenticationGraphix showValue={0} />
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <div className="entry_conetnt_two">
                <div className="logo">
                  <img src={Logo} alt="" />
                </div>
                <h4> Enter Your E-mail </h4>
                <div className="entry_process_container">
                  <div className="process_wrapper">
                    <TextField
                      id="filled-basic"
                      label="Your E-mail"
                      variant="filled"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="button_side">
                      {email ? (
                        <>
                          <Button
                            onClick={(e) => handleSubmit()}
                            variant="contained"
                            className="submit_btn"
                          >
                            Submit
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={(e) => handleSubmit()}
                            variant="contained"
                            className="submit_btn"
                            disabled
                          >
                            Submit
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <Box component="span" sx={{ display: `${loaderVisible}` }}>
                    <Loader />
                  </Box>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default EmailCheckBody;