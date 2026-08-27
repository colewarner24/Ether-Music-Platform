import "@/styles/globals.css";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <div id="container">
      <Header />
      <NavBar />
      <div id="tracks">
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  );
}
