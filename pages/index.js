export async function getServerSideProps() {
  return { redirect: { destination: "/tracks", permanent: false } };
}
export default function Index() { return null; }