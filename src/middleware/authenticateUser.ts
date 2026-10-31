import { Request, Response, NextFunction } from "express";
import { verifyFirebaseToken } from "../config/firebaseAdmin";
import { User, IUser } from "../models/User";

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      firebaseUid?: string;
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: "Authentication token missing or invalid format. Expected 'Bearer <token>'.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyFirebaseToken(token);

    if (!decoded || !decoded.uid) {
      res.status(401).json({
        success: false,
        error: "Invalid or expired authentication credentials.",
      });
      return;
    }

    req.firebaseUid = decoded.uid;

    // Load corresponding authoritative MongoDB user profile
    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      // If user profile is not yet created, allow request through with firebaseUid
      // (used specifically for the onboarding/session creation endpoint)
      if (req.path === "/session" || req.path === "/onboarding") {
        next();
        return;
      }

      res.status(404).json({
        success: false,
        error: "User profile not found in application database. Please complete onboarding.",
      });
      return;
    }

    // Synchronize email verification status if changed in Firebase
    if (decoded.email_verified !== undefined && user.emailVerified !== decoded.email_verified) {
      user.emailVerified = decoded.email_verified;
      await user.save();
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error("[Auth Middleware Error]:", error.message);
    res.status(401).json({
      success: false,
      error: "Authentication failed. Token validation rejected.",
    });
  }
};

