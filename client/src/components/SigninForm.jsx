import { useState } from "react";

const SigninForm = (props) => {
  const [userNameAndPassword, setUserNameAndPassword] = useState({
    username: "",
    password: "",
  });

  function changeHandler(event) {
    const { value, name } = event.target;
    setUserNameAndPassword((preValue) => {
      return { ...preValue, [name]: value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.checkValidation(userNameAndPassword);
  }
  return (
    <div className="w-full grid items-center">
      <form
        onSubmit={handleSubmit}
        // action=""
        // method="post"
        className="w-10/12  justify-self-center self-center grid gap-3 "
      >
        <label className="w-full block" htmlFor="email">
          Username
        </label>
        <input
          required
          autoFocus
          onChange={changeHandler}
          className="w-full h-10 block rounded border-2 border-slate-300 px-2"
          type="text"
          name="username"
          value={userNameAndPassword.username}
        />
        <label className="w-full block" htmlFor="password">
          Password
        </label>
        <input
          required
          value={userNameAndPassword.password}
          onChange={changeHandler}
          className="w-full h-10 block rounded border-2 border-slate-300 px-2"
          type="password"
          name="password"
        />
        <p className="w-full block text-center"></p>
        <button
          className=" border-2  rounded p-2 bg-lime-600 block w-full"
          type="submit"
        >
          sign in
        </button>
      </form>
    </div>
  );
};

export default SigninForm;
