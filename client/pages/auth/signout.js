import { useEffect } from "react";
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/router";

const Signout = () => {
  const router = useRouter();
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => router.push("/"),
  });

  useEffect(() => {
    async function fetchPost() {
      try {
        await doRequest();
      } catch (e) {
        console.log(e);
      }
    }
    fetchPost();
  }, []);

  return null;
};
export default Signout;
