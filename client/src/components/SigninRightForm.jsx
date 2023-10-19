import { Logo } from "../assets";
import Form from "./SigninForm";

function SigninRightForm(props) {
  return (
    <div className="w-1/2 h-screen  ">
      <div className=" w-full grid justify-center py-10">
        <img src={Logo} alt="logo" className=" justify-center" />
      </div>
      <h1 className=" w-full text-center text-3xl font-black p-10 pb-20">
        Sign In
      </h1>
      <Form checkValidation={props.checkValidation} />
    </div>
  );
}

export default SigninRightForm;
