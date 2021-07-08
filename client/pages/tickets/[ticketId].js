import { BaseLayout } from "../../components/BaseLayout";
import { buildClient } from "../../api/build-client";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ currentUser, ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },

    onSuccess: (order) => {
      console.log(order);
    },
  });

  return (
    <BaseLayout currentUser={currentUser?.currentUser}>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={doRequest} className="btn btn-primary">
        Purchase
      </button>
    </BaseLayout>
  );
};

export default TicketShow;

export async function getServerSideProps(context) {
  console.log("Show ticket page loads ticket by id on server");
  const client = buildClient(context);

  let ticket;
  try {
    const { ticketId } = context.query;
    const ticketRes = await client.get(`/api/tickets/${ticketId}`);
    ticket = ticketRes.data || null;

    console.log("ticket loaded in showTicket.js", ticket);
  } catch (e) {
    console.log("something wrong when fetching data from client");
  }

  return {
    props: { ticket },
  };
}
