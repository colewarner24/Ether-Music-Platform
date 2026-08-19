import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { sendVerificationEmail } from "@/lib/email"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  try {
    const { email, password, artistName } = req.body

    if (!email || !password || !artistName) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" })
    }

    const existingArtist = await prisma.user.findUnique({ where: { artistName } })
    if (existingArtist) {
      return res.status(400).json({ error: "Artist name already taken" })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        artistName,
        emailVerified: false,
        verificationToken,
        verificationTokenExpiry,
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL || `http://${req.headers.host}`
    await sendVerificationEmail(email, verificationToken, baseUrl)

    res.status(201).json({
      message: "User created. Check your email to verify your account.",
      user: { id: user.id, email: user.email, artistName: user.artistName },
    })
  } catch (err) {
    console.error("Register error:", err)
    res.status(500).json({ error: err.message })
  }
}
