import { eq, sql, type SQL } from "drizzle-orm";
import { db } from "./db";
import { CustomerTable } from "./schema";
import { type AnyPgColumn } from "drizzle-orm/pg-core";

type NewCustomer = typeof CustomerTable.$inferInsert;
export type SelectCustomer = typeof CustomerTable.$inferSelect;
export const CustomerRepo = {
  upsert: (values: NewCustomer) =>
    db
      .insert(CustomerTable)
      .values(values)
      .onConflictDoUpdate({
        target: [CustomerTable.nexeraCustomerId],
        set: {
          userStatus: values.userStatus,
          walletAddress: values.walletAddress,
        },
      }),

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
