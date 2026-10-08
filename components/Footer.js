import styles from "@/styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>&copy; 2026 Ether Music Platform</span>
      <span aria-hidden="true">·</span>
      <span>v0.1.0</span>
      <span aria-hidden="true">·</span>
      <a
        href="https://github.com/colewarner24/Ether-Music-Platform"
        target="_blank"
        rel="noreferrer"
      >
        Open source on GitHub
      </a>
    </footer>
  );
}
