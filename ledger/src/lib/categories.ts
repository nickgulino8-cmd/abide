import type { PrismaClient } from "@prisma/client";

type Group = {
  name: string;
  icon: string;
  color: string;
  kind?: "expense" | "income" | "transfer" | "uncategorized";
  bucket?: "need" | "want" | "savings";
  children: (string | [string, "need" | "want" | "savings"])[];
};

// Your default two-level categories. Everything here is editable in the app.
export const DEFAULT_CATEGORIES: Group[] = [
  { name: "Food & Dining", icon: "🍽️", color: "#f97316", bucket: "want",
    children: [["Groceries", "need"], "Restaurants", "Fast Food", "Coffee Shops", "Food Delivery", "Alcohol & Bars"] },
  { name: "Transportation", icon: "🚗", color: "#3b82f6", bucket: "need",
    children: ["Gas", "Car Payment", "Car Insurance", "Maintenance & Repairs", "Parking", "Tolls", ["Rideshare", "want"], "Public Transit"] },
  { name: "Housing", icon: "🏠", color: "#8b5cf6", bucket: "need",
    children: ["Rent", "Utilities", "Internet", "Phone", "Renter's Insurance", "Household Supplies", ["Furniture", "want"]] },
  { name: "Subscriptions", icon: "🔁", color: "#ec4899", bucket: "want",
    children: ["Streaming", "Music", "Apps & Software", "AI Tools", "Cloud Storage", "Memberships"] },
  { name: "Health & Fitness", icon: "💪", color: "#10b981", bucket: "need",
    children: [["Gym", "want"], ["Supplements", "want"], ["Sports Gear", "want"], "Pharmacy", "Doctor & Dental"] },
  { name: "Personal Care", icon: "💈", color: "#14b8a6", bucket: "want",
    children: ["Haircuts & Barber", "Skincare", "Grooming Products", "Clothing", "Shoes"] },
  { name: "Education", icon: "🎓", color: "#6366f1", bucket: "need",
    children: ["Tuition", "Textbooks", "School Supplies", "Course Fees"] },
  { name: "Entertainment", icon: "🎟️", color: "#eab308", bucket: "want",
    children: ["Events & Concerts", "Games", "Hobbies", "Movies", "Nightlife"] },
  { name: "Social & Dating", icon: "💬", color: "#f43f5e", bucket: "want",
    children: ["Dates", "Gifts", "Going Out with Friends"] },
  { name: "Travel", icon: "✈️", color: "#0ea5e9", bucket: "want",
    children: ["Flights", "Hotels", "Vacation Spending"] },
  { name: "Shopping", icon: "🛍️", color: "#a855f7", bucket: "want",
    children: ["Amazon", "Electronics", "General Retail"] },
  { name: "Financial", icon: "🏦", color: "#64748b", kind: "transfer", bucket: "savings",
    children: ["Savings Transfers", "Investments", "Credit Card Payments", ["Bank Fees", "need"], ["Interest", "need"]] },
  { name: "Giving", icon: "🤝", color: "#84cc16", bucket: "want",
    children: ["Donations", "Charity"] },
  { name: "Income", icon: "💵", color: "#22c55e", kind: "income",
    children: ["Paychecks", "Cash Tips", "Card Tips", "Side Income", "Refunds"] },
  { name: "Uncategorized", icon: "❓", color: "#9ca3af", kind: "uncategorized",
    children: [] },
];

export async function seedCategories(db: PrismaClient) {
  let order = 0;
  for (const g of DEFAULT_CATEGORIES) {
    const kind = g.kind ?? "expense";
    const parent = await db.category.create({
      data: { name: g.name, icon: g.icon, color: g.color, kind, bucket: g.bucket, sortOrder: order++ },
    });
    let childOrder = 0;
    for (const c of g.children) {
      const [name, bucket] = Array.isArray(c) ? c : [c, g.bucket];
      // Investments and savings transfers are "savings", not spending.
      const childKind = kind === "transfer" && (name === "Bank Fees" || name === "Interest") ? "expense" : kind;
      await db.category.create({
        data: { name, parentId: parent.id, kind: childKind, bucket, color: g.color, sortOrder: childOrder++ },
      });
    }
  }
}

/** Fresh-install data: categories + a manual "Cash" wallet for cash purchases. */
export async function seedDefaults(db: PrismaClient) {
  if ((await db.category.count()) === 0) await seedCategories(db);
  if ((await db.account.count({ where: { isManual: true } })) === 0) {
    await db.account.create({
      data: { name: "Cash", type: "cash", subtype: "cash", isManual: true, currentCents: 0 },
    });
  }
}
