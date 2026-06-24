import Router from "./router";
import Footer from "./component/footer_component/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactInfo from "./component/common/ContactInfo";
import Header from "./component/header_component/Header";

const App = () => {
  return (
    <>
      <ToastContainer />
      <ContactInfo />
      <Header />
      <Router />
      <Footer />
    </>
  );
};

export default App;
