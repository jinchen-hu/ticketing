import { BaseLayout } from "../../components/BaseLayout";
import { useState } from "react";
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/router";
import { buildClient } from "../../api/build-client";

const NewTicket = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  console.log(currentUser);
  const router = useRouter();
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => {
      router.push("/").catch((e) => {
        console.log(e);
      });
    },
  });

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest().catch((err) => {
      console.log(err);
    });
  };

  return (
    <BaseLayout currentUser={currentUser}>
      <div>
        <h1>Create a Ticket</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              onBlur={onBlur}
              className="form-control"
            />
          </div>
          {errors}
          <button className="btn btn-primary">Submit</button>
        </form>
      </div>
    </BaseLayout>
  );
};
export default NewTicket;

export async function getServerSideProps(context) {
  const client = buildClient(context);

  let currentUser;
  try {
    const currentUserRes = await client.get("/api/users/currentuser");
    currentUser = currentUserRes?.data?.currentUser || null;
    console.log("current user loaded in new ticket page", currentUser);
  } catch (e) {
    console.log(
      "something wrong when fetching data from client in new ticket page"
    );
  }

  return {
    props: { currentUser },
  };
}
