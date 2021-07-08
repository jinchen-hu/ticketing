import { useState } from "react";
import { useRouter } from "next/router";
import useRequest from "../../hooks/use-request";
import { BaseLayout } from "../../components/BaseLayout";
import { buildClient } from "../../api/build-client";

const Signup = ({ currentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => {
      router.push("/").catch((e) => {
        console.log(e);
      });
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    //Router.push("/");
    await doRequest();
  };

  // const renderErrors = (errs) => {
  //   if (errs?.length > 0) {
  //     return (
  //       <div className="alert alert-danger">
  //         <h4>Whoops...</h4>
  //         <ul className="my-0">
  //           {errs.map((err) => (
  //             <li key={err.message}>{err.message}</li>
  //           ))}
  //         </ul>
  //       </div>
  //     );
  //   }
  // };

  return (
    <BaseLayout currentUser={currentUser}>
      <form onSubmit={onSubmit}>
        <h1>Sign up</h1>
        <div className="form-group">
          <label>Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </BaseLayout>
  );
};

export default Signup;

export async function getServerSideProps(context) {
  console.log("update current user after sign up");
  const client = buildClient(context);

  let currentUser;
  try {
    const currentUserRes = await client.get("/api/users/currentuser");
    currentUser = currentUserRes?.data?.currentUser || null;
    console.log("current user loaded in sign up page", currentUser);
  } catch (e) {
    console.log(
      "something wrong when fetching data from client in sign up page"
    );
  }

  return {
    props: { currentUser },
  };
}
