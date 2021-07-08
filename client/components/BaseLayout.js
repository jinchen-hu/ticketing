import { Header } from "./header";

export const BaseLayout = ({ children, currentUser }) => {
  return (
    <div className="container">
      <Header currentUser={currentUser} />
      {children}
    </div>
  );
};
