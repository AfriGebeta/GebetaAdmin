
const Form = () => {
  return (
    <div className="w-full grid items-center">
        <form action="" method="post" className="w-10/12  justify-self-center self-center grid gap-3 ">
          <label className="w-full block" htmlFor="email">
            Email
          </label>
          <input
            className="w-full h-10 block rounded border-2 border-slate-300 px-2"
            type="email"
            name="email"
          />
          <label className="w-full block" htmlFor="password">
            Password
          </label>
          <input
            className="w-full h-10 block rounded border-2 border-slate-300 px-2"
            type="password"
            name="password"
          />
          <p className="w-full block text-center"></p>
          <button
            className=" border-2  rounded p-2 bg-lime-600 block w-full"
            type="submit"
          >
            sign up
          </button>
        </form>
      </div>
  )
}

export default Form;