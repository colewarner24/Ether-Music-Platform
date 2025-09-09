import { useRouter } from "next/router"

export default function UserPage() {
  const router = useRouter()
  const { artistName } = router.query

  return (
    <div>
      <h1>{artistName}'s Profile</h1>
      <p>Welcome {artistName}! This is your page.</p>
      {/* TODO: later add profile photo, upload form, user’s tracks */}
    </div>
  )
}
