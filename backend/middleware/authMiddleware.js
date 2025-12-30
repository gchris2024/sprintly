import jwt from 'jsonwebtoken'

// Validate JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

export default function authMiddleware(req, res, next) {
  const token = req.headers['authorization']

  if (!token) { return res.status(401).json({message: "No token provided"}) }

  // Verify given token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) { return res.status(401).json({message: "Invalid token"})}

    // new field to easily store user id (from decoded JWT)
    req.userId = decoded.id

    next() // passed this checkpoint, head to the endpoint
  })
}
