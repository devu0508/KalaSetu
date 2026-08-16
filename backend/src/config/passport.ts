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

        // Check if a user with this googleId already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if a user with this email already exists (link accounts)
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            user.avatar = user.avatar || profile.photos?.[0]?.value || "";
            await user.save();
            return done(null, user);
          }
        }

        // Create a new user
        user = await User.create({
          name: profile.displayName || "Google User",
          email,
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value || "",
          password: null, // Google-only account — no password
        });

        return done(null, user);
      } catch (error) {
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
