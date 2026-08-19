import prisma from "@/lib/prisma"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email required" })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex")
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      })

      const baseUrl = process.env.NEXTAUTH_URL || `http://${req.headers.host}`
      await sendPasswordResetEmail(email, resetToken, baseUrl)
    }

    res.json({ message: "If an account exists with that email, a reset link has been sent" })
  } catch (err) {
    console.error("Forgot password error:", err)
    res.status(500).json({ error: err.message })
  }
}
