import { buildClient } from "../api/build-client";
import { BaseLayout } from "../components/BaseLayout";
const HomePage = ({ currentUser, tickets }) => {
  const renderedTickets = tickets?.tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
      </tr>
    );
  });

  return (
    <BaseLayout currentUser={currentUser ? currentUser.currentUser : null}>
      <div>
        <h1>Tickets</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{renderedTickets}</tbody>
        </table>
      </div>
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

    const ticketsRes = await client.get("/api/tickets");
    tickets = ticketsRes.data || null;
    console.log("list of tickets loaded in index.js", tickets);
  } catch (e) {
    console.log("something wrong when fetching data from client");
  }

  return {
    props: { currentUser, tickets },
  };
}

export default HomePage;
