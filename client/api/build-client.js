import axios from "axios";

export const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // on the server
    // http://namespace.servicename.svc.cluster.local to reach the service outside the current namespace
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};
