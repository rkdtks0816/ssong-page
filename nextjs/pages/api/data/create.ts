import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

interface ExtendedRequest extends NextApiRequest {
  user?: string | JwtPayload;
}
// JWT 인증 미들웨어 함수
const authenticateToken = (
  req: ExtendedRequest,
  res: NextApiResponse,
  next: (error?: unknown) => void
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY; // .env 파일에 JWT_SECRET_KEY 추가
    if (!secretKey) {
      throw new Error("JWT secret key is not defined");
    }

    const decoded = jwt.verify(token, secretKey); // 토큰 검증
    req.user = decoded; // 검증된 사용자 정보 추가
    next(); // 다음 핸들러로 이동
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POST 요청만 허용
  if (req.method === "POST") {
    // JWT 인증 적용
    return authenticateToken(req, res, async () => {
      const { dbName, collectionName, data } = req.body;

      if (!dbName || !collectionName || !data) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      try {
        const client = await clientPromise;
        const db = client.db(dbName);

        // 현재 시간을 'yymmddhhmmss' 형식으로 추가
        const now = new Date();
        const yy = String(now.getFullYear()).slice(2);
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const currentTime = `${yy}${mm}${dd}${hh}${min}${ss}`;

        // time 필드 추가
        const dataWithTime = { ...data, time: currentTime };

        const result = await db
          .collection(collectionName)
          .insertOne(dataWithTime);

        res
          .status(201)
          .json({ message: "Data inserted", id: result.insertedId });
      } catch (error) {
        res.status(500).json({ message: "Failed to insert data", error });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
