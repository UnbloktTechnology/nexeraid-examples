/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTRPCRouter } from "@/server/api/trpc";
import { complianceRouter } from "@/server/api/routers/complianceRouter";
import { accessRouter } from "@/server/api/routers/accessRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  compliance: complianceRouter,
  access: accessRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
