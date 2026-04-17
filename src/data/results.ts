import type {
  Programme as DbProgramme,
  StudentResultRow,
} from "@/server/db/schema";

export type Medal = "gold" | "silver" | "bronze" | null;

export type ResultCategory = StudentResultRow["result"];

/** Re-exports so consuming UI components don't pull from the server package
 *  directly. */
export type StudentResult = StudentResultRow;
export type Programme = DbProgramme;

export function medalForRank(rank: number | null | undefined): Medal {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return null;
}

export function medalLabel(m: Medal): string | null {
  return m ? `${m[0].toUpperCase()}${m.slice(1)}` : null;
}
