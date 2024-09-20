import { eq, sql, type SQL } from "drizzle-orm";
import { db } from "./db";
import { CustomerTable } from "./schema";
import { type AnyPgColumn } from "drizzle-orm/pg-core";

export type NewCustomer = typeof CustomerTable.$inferInsert;
export type SelectCustomer = typeof CustomerTable.$inferSelect;
export const CustomerRepo = {
  selectOrInsertByAddress: async (
    values: NewCustomer,
  ): Promise<SelectCustomer> => {
    // fetch the customer by address if it exists
    const existing = await db
      .select()
      .from(CustomerTable)
      .where(
        eq(
          addressFormat(CustomerTable.walletAddress),
          values.walletAddress.toLocaleLowerCase(),
        ),
      )
      .limit(1)
      .execute();

    if (existing.length > 0) {
      if (existing.length > 1 || !existing[0]) {
        throw new Error("Failed to fetch customer");
      }
      return existing[0];
    }

    // insert the customer if it doesn't exist
    const inserted = await db
      .insert(CustomerTable)
      .values(values)
      .returning()
      .execute();

    if (!inserted || inserted.length === 0 || !inserted[0]) {
      throw new Error("Failed to insert customer");
    }
    return inserted[0];
  },

  setLastLogin: (customerId: number) =>
    db
      .update(CustomerTable)
      .set({
        lastLogin: new Date(),
      })
      .where(eq(CustomerTable.id, customerId))
      .execute(),

  updateById: (values: Partial<NewCustomer>) =>
    db
      .update(CustomerTable)
      .set(values)
      .where(eq(CustomerTable.id, values.id!))
      .execute(),

  searchByAddress: async (address: string): Promise<SelectCustomer | null> => {
    const res = await db
      .select()
      .from(CustomerTable)
      .where(
        eq(
          addressFormat(CustomerTable.walletAddress),
          address.toLocaleLowerCase(),
        ),
      )
      .limit(1)
      .execute();

    return res[0] ?? null;
  },
};

// custom lower function
const addressFormat = (email: AnyPgColumn | string): SQL => {
  return sql`lower(${email})`;
};
