import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const sql = getDb();
  let users: any[] = [];

  if (sql) {
    try {
      users = await sql`
        SELECT 
          u.id, u.name, u.email, u.role, u.created_at as "createdAt",
          COUNT(c.id)::int as "complaintsCount"
        FROM users u
        LEFT JOIN complaints c ON u.id = c.user_id
        GROUP BY u.id, u.name, u.email, u.role, u.created_at
        ORDER BY u.created_at DESC;
      `;
    } catch (err) {
      console.warn("DB users fetch error, showing demo users:", err);
    }
  }

  // Fallback demo users if DB is empty
  if (users.length === 0) {
    users = [
      {
        id: "usr_admin_01",
        name: "City Infrastructure Commissioner",
        email: "admin@civiclens.gov",
        role: "ADMIN",
        complaintsCount: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_citizen_01",
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        role: "CITIZEN",
        complaintsCount: 3,
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_citizen_02",
        name: "Priya Patel",
        email: "priya.patel@example.com",
        role: "CITIZEN",
        complaintsCount: 2,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Users className="h-6 w-6 text-indigo-700" />
          Citizen &amp; Administrator Account Management ({users.length})
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Registered accounts with role assignments and activity metrics.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Citizen Name</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Complaints Filed</th>
                <th className="px-4 py-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === "ADMIN" ? "default" : "teal"}>
                      {u.role === "ADMIN" ? "Administrator" : "Citizen"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {u.complaintsCount || 0}
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {formatDate(u.createdAt).split(",")[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
