import Link from "next/link";
import prisma from "@/lib/prisma";

export async function getServerSideProps() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { artistName: "asc" },
      select: {
        artistName: true,
        profilePhoto: true,
      },
    });

    return { props: { users } };
  } catch (error) {
    console.error("Failed to load public users page:", error);
    return { props: { users: [], error: "Unable to load users right now." } };
  }
}

export default function UsersPage({ users, error }) {
  return (
    <div className="mx-auto my-9 max-w-5xl px-2.5 text-left">
      <h1 className="mb-2 text-center text-[clamp(24px,5vw,32px)] font-bold">
        Artists
      </h1>
      <p className="mb-6 text-center text-ether-200">
        Discover the artists sharing music on Ether.
      </p>

      {error && (
        <p className="ether-feedback border-red-500/50 bg-red-50 p-4 text-red-800" role="alert">
          {error}
        </p>
      )}

      {!error && users.length === 0 && (
        <p className="ether-feedback p-4 text-center">
          No artist profiles are available yet.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map(({ artistName, profilePhoto }) => (
          <Link
            key={artistName}
            href={`/user/${encodeURIComponent(artistName)}`}
            className="ether-panel flex min-h-28 items-center gap-4 p-4 text-white no-underline hover:border-ether-400 hover:bg-ether-800"
          >
            <img
              src={profilePhoto || "/images/default-avatar.jpg"}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-full object-cover"
            />
            <span className="break-words text-lg font-semibold">{artistName}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
