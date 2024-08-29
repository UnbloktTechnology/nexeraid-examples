import {
  boolean,
  pgTable,
  serial,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  approved: boolean("approved").default(false),
});