import { BaseLayout } from "../../components/BaseLayout";
import { buildClient } from "../../api/build-client";

const OrderList = ({ currentUser, orders }) => {
  const renderOrders = orders.map((order) => {
    return (
      <li key={order.id}>
        {order.ticket.title} - {order.status}
      </li>
    );
  });

  return (
    <BaseLayout currentUser={currentUser}>
      <ul>{renderOrders}</ul>
    </BaseLayout>
  );
};

export default OrderList;

export async function getServerSideProps(context) {
  const client = buildClient(context);

  let currentUser, orders;
  try {
    const currentUserRes = await client.get("/api/users/currentuser");
    currentUser = currentUserRes?.data?.currentUser || null;

    console.log("current user loaded in show order page", currentUser);

    const ordersRes = await client.get("/api/orders");
    orders = ordersRes?.data || null;
    console.log("order loaded in show order page", orders);
  } catch (e) {
    console.log(
      "something wrong when fetching data from client in show order page"
    );
  }

  return {
    props: { currentUser, orders },
  };
}
