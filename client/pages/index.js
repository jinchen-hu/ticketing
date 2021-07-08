import { buildClient } from "../api/build-client";
import { BaseLayout } from "../components/BaseLayout";
import Link from "next/link";
const HomePage = ({ currentUser, tickets }) => {
  const renderedTickets = tickets?.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={`/tickets/${encodeURIComponent(ticket.id)}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <BaseLayout currentUser={currentUser}>
      <div>
        <h1>Tickets</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>{renderedTickets}</tbody>
        </table>
      </div>
    </BaseLayout>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);

  let currentUser, tickets;
  try {
    const currentUserRes = await client.get("/api/users/currentuser");
    currentUser = currentUserRes?.data?.currentUser || null;
    console.log("current user loaded in homepage", currentUser);

    const ticketsRes = await client.get("/api/tickets");
    tickets = ticketsRes.data || null;
    console.log("list of tickets loaded in in homepage", tickets);
  } catch (e) {
    console.log("something wrong when fetching data from client in homepage");
  }

  return {
    props: { currentUser, tickets },
  };
}

export default HomePage;
