import { createTRPCRouter } from "@/server/api/trpc";
import { complianceRouter } from "@/server/api/routers/complianceRouter";
import { identityRouter } from "@/server/api/routers/identityRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  compliance: complianceRouter,
  identity: identityRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
