import jwt from "jsonwebtoken";

export function decodeToken(req) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        console.error("No token found in request");
        return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    if (!userId) {
        console.error("Invalid token");
        return null;
    }

    return userId;
}