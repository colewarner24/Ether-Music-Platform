import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: "./public/uploads", // folder where files will be saved
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + "-" + file.originalname);
//     },
//   }),
// });

// Apply Multer middleware for single file upload
// apiRoute.use(upload.single("profilePhoto")); // 'profilePhoto' matches the form field name


export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const { email, password, artistName } = req.body;
    if (!email || !password || !artistName) {
      return res.status(400).json({ error: "Missing fields" })
    }
    // const profilePhoto = req.file ? `/uploads/${req.file.filename}` : null;


    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "User already exists" });

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: { email, passwordHash, artistName }
    });

    // generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user });

  } catch (error) {
    return res.status(500).json({ error: "signup failed --> " + error.message, details: error.message });
  }
}
