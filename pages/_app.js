import "@/styles/globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <div id="container" className="ether-shell">
      <Sidebar />
      <div className="ether-content min-w-0 flex-1 pt-16 md:pt-0">
        <Header />
        <main id="tracks" className="text-center">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
