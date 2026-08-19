import prisma from "@/lib/prisma"
import crypto from "crypto"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: "Verification token required" })
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired verification token" })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    })

    res.json({ message: "Email verified successfully" })
  } catch (err) {
    console.error("Verification error:", err)
    res.status(500).json({ error: err.message })
  }
}
