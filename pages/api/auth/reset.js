import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ error: "Token and password required" })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" })
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    res.json({ message: "Password reset successfully" })
  } catch (err) {
    console.error("Reset password error:", err)
    res.status(500).json({ error: err.message })
  }
}
