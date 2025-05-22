import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import MemoryStore from "memorystore";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { setupSwagger } from "./utils/swagger";
import { setupPassport } from "./utils/oauth";
import { errorHandler } from "./middlewares/error";

// Import route modules
import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";
import usersRoutes from "./routes/users";
import categoriesRoutes from "./routes/categories";

export async function registerRoutes(app: Express): Promise<Server> {
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false
  }));
  
  app.use(cors({
    origin: true,
    credentials: true
  }));

  // Initialize session
  const MemoryStoreSession = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || 'notice-board-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
  }));

  // Setup Passport
  setupPassport();
  app.use(passport.initialize());
  app.use(passport.session());

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postsRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/categories', categoriesRoutes);

  // Swagger documentation
  const swaggerDocument = setupSwagger();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV });
  });

  // Error handler
  app.use(errorHandler);

  const httpServer = createServer(app);

  return httpServer;
}
