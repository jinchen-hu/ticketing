import { buildClient } from "../api/build-client";
import { BaseLayout } from "../components/BaseLayout";
const HomePage = ({ currentUser }) => {
  return (
    <BaseLayout currentUser={currentUser ? currentUser.currentUser : null}>
      Hello {currentUser?.currentUser ? "You are signed in" : "Please sign in"}
    </BaseLayout>
  );
};

export async function getServerSideProps(context) {
  console.log("FROM INDEX PAGE");
  const client = buildClient(context);

  let currentUser, tickets;
  try {
    const currentUserRes = await client.get("/api/users/currentuser");
    currentUser = currentUserRes.data || null;
    console.log("current user loaded in index.js", currentUser);
  } catch (e) {
    console.log("something wrong when fetching data from client");
  }

  return {
    props: { currentUser },
  };
}

export default HomePage;
