import passport from "passport";
import { Strategy as GoogleStrategy, type Profile, type VerifyCallback } from "passport-google-oauth20";
import User from "../models/User.js";
import env from "./env.js";
import type { IUser } from "../types/index.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackURL: env.googleCallbackUrl,
      scope: ["profile", "email"],
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;

        console.log(`🔑 Google OAuth callback received for email: ${email}, profile id: ${profile.id}`);

        // Check if a user with this googleId already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          console.log(`✅ Existing Google user found: ${user.email}`);
          return done(null, user);
        }

        // Check if a user with this email already exists (link accounts)
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            console.log(`🔗 Linking Google ID to existing email account: ${email}`);
            user.googleId = profile.id;
            user.avatar = user.avatar || profile.photos?.[0]?.value || "";
            user.isEmailVerified = true;
            await user.save();
            return done(null, user);
          }
        }

        // Create a new user
        console.log(`🆕 Creating new Google user: ${email}`);
        user = await User.create({
          name: profile.displayName || "Google User",
          email,
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value || "",
          password: null, // Google-only account — no password
          isEmailVerified: true,
        });

        return done(null, user);
      } catch (error) {
        console.error("❌ Google OAuth strategy error:", error);
        return done(error as Error, undefined);
      }
    }
  )
);

// Serialize / Deserialize (only needed if using sessions; we use JWT instead,
// but passport requires these to be defined)
passport.serializeUser((user, done) => done(null, (user as IUser)._id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
