import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as AppleStrategy } from 'passport-apple';
import { storage } from '../storage';

// Configure Passport.js for OAuth
export function setupPassport() {
  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (error) {
      done(error, undefined);
    }
  });

  // Google OAuth strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          
          // Check if user exists
          let user = await storage.getUserByGoogleId(googleId);
          
          if (user) {
            return done(null, user);
          }
          
          // Check if user exists with same email
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          
          if (email) {
            user = await storage.getUserByEmail(email);
            
            if (user) {
              // Update existing user with Google ID
              user = await storage.updateUser(user.id, { googleId, isVerified: true }) || user;
              return done(null, user);
            }
          }
          
          // No existing user, so create a new one
          if (email) {
            const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
            
            // Create new user
            user = await storage.createUser({
              username,
              email,
              name: profile.displayName || username,
              googleId,
              isVerified: true,
              location: 'chandigarh', // Default location
              visibility: 'public'
            });
            
            // Create default preferences
            await storage.createUserPreferences({
              userId: user.id,
              selectedCategories: ['announcement', 'event', 'news'],
              notificationPreferences: {
                all: true
              }
            });
            
            return done(null, user);
          }
          
          return done(new Error('No email found in Google profile'), undefined);
        } catch (error) {
          return done(error, undefined);
        }
      }
    ));
  }

  // Apple OAuth strategy
  if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
    passport.use(new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyString: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        callbackURL: '/api/auth/apple/callback',
        scope: ['name', 'email']
      },
      async (req, accessToken, refreshToken, idToken, profile, done) => {
        try {
          // Apple profile comes in a different format
          const appleId = profile.id;
          
          // Check if user exists
          let user = await storage.getUserByAppleId(appleId);
          
          if (user) {
            return done(null, user);
          }
          
          // Check if user exists with same email
          const email = profile.email;
          
          if (email) {
            user = await storage.getUserByEmail(email);
            
            if (user) {
              // Update existing user with Apple ID
              user = await storage.updateUser(user.id, { appleId, isVerified: true }) || user;
              return done(null, user);
            }
          }
          
          // No existing user, so create a new one
          if (email) {
            const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
            const name = profile.name?.firstName && profile.name?.lastName
              ? `${profile.name.firstName} ${profile.name.lastName}`
              : username;
            
            // Create new user
            user = await storage.createUser({
              username,
              email,
              name,
              appleId,
              isVerified: true,
              location: 'chandigarh', // Default location
              visibility: 'public'
            });
            
            // Create default preferences
            await storage.createUserPreferences({
              userId: user.id,
              selectedCategories: ['announcement', 'event', 'news'],
              notificationPreferences: {
                all: true
              }
            });
            
            return done(null, user);
          }
          
          return done(new Error('No email found in Apple profile'), undefined);
        } catch (error) {
          return done(error, undefined);
        }
      }
    ));
  }
}
