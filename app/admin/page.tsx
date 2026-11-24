import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { AdminDashboard, AdminLogin } from "@/components/admin/Admin";
import { nowInRestaurant } from "@/lib/time";

export const metadata: Metadata = { title: "Staff", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;
  return <AdminDashboard today={nowInRestaurant().date} />;
}
