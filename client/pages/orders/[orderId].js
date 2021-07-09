import { BaseLayout } from "../../components/BaseLayout";
import { buildClient } from "../../api/build-client";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { STRIPE_PUB_KEY } from "../../config";
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/router";

const OrderShow = ({ currentUser, order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const router = useRouter();
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order?.id,
    },
    onSuccess: () => {
      router.push("/orders").catch((e) => {
        console.log(e);
      });
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      setTimeLeft(Math.round((new Date(order.expiresAt) - new Date()) / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  // test visa card: 4242424242424242
  const timerDisplay =
    timeLeft <= 0 ? "OrderExpired" : `Time left to pay: ${timeLeft} seconds`;
  return (
    <BaseLayout currentUser={currentUser}>
      {timerDisplay}
      {timeLeft > 0 && (
        <StripeCheckout
          token={({ id }) => {
            doRequest({ token: id }).catch((e) => {
              console.log(e);
            });
          }}
          stripeKey={`${STRIPE_PUB_KEY}`}
          amount={order?.ticket?.price * 100}
          email={currentUser.email}
        />
      )}
      {errors}
    </BaseLayout>
  );
};

export default OrderShow;

export async function getServerSideProps(context) {
  const client = buildClient(context);

  let currentUser, order;
  try {
    const currentUserRes = await client.get("/api/users/currentuser");
    currentUser = currentUserRes?.data?.currentUser || null;

    const { orderId } = context.query;
    console.log("current user loaded in show order page", currentUser);

    const orderRes = await client.get(`/api/orders/${orderId}`);
    order = orderRes?.data || null;
    console.log("order loaded in show order page", order);
  } catch (e) {
    console.log(
      "something wrong when fetching data from client in show order page"
    );
  }

  return {
    props: { currentUser, order },
  };
}
