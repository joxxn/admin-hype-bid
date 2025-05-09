import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";

type Data = {
  status: number;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { auth } = req.query as { auth: string };
    if (!auth) {
      return res.status(401).json({ status: 401, message: "Unauthorized" });
    }

    jwt.verify(auth, process.env.JWT_SECRET!, (err, decoded) => {      
      if (err) {
        return res.status(401).json({ status: 401, message: "Unauthorized" });
      }
      if (!decoded)
        return res.status(401).json({ status: 401, message: "Unauthorized" });

      const decodedPayload = decoded as JwtPayload;
      if (decodedPayload.role !== "Admin") {
        return res.status(401).json({ status: 401, message: "Unauthorized" });
      }

      return res.status(200).json({ status: 200, message: "OK" });
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }
}
