import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { CustomerStatuses, type CustomerStatus } from "@nexeraid/identity-schemas";
import { sql } from "drizzle-orm";

export const customerStatus = pgTable("customer_status", {
  address: text("address").primaryKey(),
  status: text("status", { enum: CustomerStatuses }).notNull().$type<CustomerStatus>(),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});