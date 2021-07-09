import { BaseLayout } from "../../components/BaseLayout";
import { buildClient } from "../../api/build-client";
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/router";

const TicketShow = ({ currentUser, ticket }) => {
  const router = useRouter();
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },

    onSuccess: (order) => {
      router.push(`/orders/${order.id}`).catch((e) => {
        console.log(e);
      });
    },
  });

  return (
    <BaseLayout currentUser={currentUser}>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </BaseLayout>
  );
};

export default TicketShow;

export async function getServerSideProps(context) {
  const client = buildClient(context);

  let currentUser, ticket;
  try {
    const { ticketId } = context.query;
    const ticketRes = await client.get(`/api/tickets/${ticketId}`);
    ticket = ticketRes.data || null;
    console.log("ticket loaded in show ticket page", ticket);
    const currentUserRes = await client.get("/api/users/currentuser");
    currentUser = currentUserRes?.data?.currentUser || null;
    console.log("current user loaded in ticket page", currentUser);
  } catch (e) {
    console.log(
      "something wrong when fetching data from client in ticket page"
    );
  }

  return {
    props: { currentUser, ticket },
  };
}
