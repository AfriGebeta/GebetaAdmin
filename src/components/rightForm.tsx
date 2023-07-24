import Form from "./form";

function rightForm() {
  return (
    <div className="w-1/2 h-screen  ">
        <div className=" w-full grid justify-center py-10">
          <img
            src="/image/logo.png"
            alt="logo"
            className=" justify-center"
          />
        </div>
        <h1 className=" w-full text-center text-3xl font-black p-10 pb-20">Sign Up</h1>
        <Form />
    </div>
  );
}

export default rightForm;
