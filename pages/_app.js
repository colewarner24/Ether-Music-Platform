import "@/styles/globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import styles from "@/styles/Sidebar.module.css";

export default function App({ Component, pageProps }) {
  return (
    <div id="container" className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <main id="tracks">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
