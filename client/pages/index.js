import { buildClient } from "../api/build-client";
const HomePage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

export async function getServerSideProps(context) {
  console.log("FROM INDEX PAGE");
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser").catch((e) => {
    console.log(e);
  });
  return {
    props: data,
  };
}

export default HomePage;
