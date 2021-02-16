import React from "react";
import { Link } from "react-router-dom";
import "./notFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="mainbox">
      <div className="err">4</div>
      <div className="err2">0</div>
      <div className="err3">4</div>
      <div className="msg">
        Maybe this page moved? Got deleted? Is hiding out in quarantine? Never
        existed in the first place?
        <p>
          Let's go <Link to="/">Home</Link> and try from there.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
