import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import {
  CustomerStatuses,
  type CustomerStatus,
} from "@nexeraid/identity-schemas";

export const customerStatus = pgTable("customer_status", {
  address: text("address").primaryKey(),
  status: text("status", { enum: CustomerStatuses })
    .notNull()
    .$type<CustomerStatus>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
