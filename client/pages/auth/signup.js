import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/users/signup", {
        email,
        password,
      });
    } catch (e) {
      setErrors(e.response.data.errors);
    }
  };

  const renderErrors = (errs) => {
    if (errs?.length > 0) {
      return (
        <div className="alert alert-danger">
          <h4>Whoops...</h4>
          <ul className="my-0">
            {errs.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return (
    <div>
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
        {/*{errors?.length > 0 && (*/}
        {/*  <div className="alert alert-danger">*/}
        {/*    <h4>Ooops...</h4>*/}
        {/*    <ul className="my-0">*/}
        {/*      {errors.map((err) => (*/}
        {/*        <li key={err.message}>{err.message}</li>*/}
        {/*      ))}*/}
        {/*    </ul>*/}
        {/*  </div>*/}
        {/*)}*/}
        {renderErrors(errors)}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default Signup;
