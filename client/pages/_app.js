import "bootstrap/dist/css/bootstrap.css";
import { buildClient } from "../api/build-client";
import { Header } from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

// app doesn't support getServersideProps
AppComponent.getInitialProps = async (appContext) => {
  //console.log(appContext);
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser").catch((e) => {
    console.log(e);
  });

  //console.log(data);
  return data;
};

export default AppComponent;
