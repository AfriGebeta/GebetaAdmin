import React from "react";
import { SigninLeftImage, SigninRightForm } from "../components";

const SigninPage = (props) => (
  <div className="bg-primary w-full overflow-hidden absolute flex">
    <SigninLeftImage />
    <SigninRightForm checkValidation={props.checkValidation} />
  </div>
);
export default SigninPage;
