import { TeacherForm } from "@/components/admin/TeacherForm";
import { prisma } from "@/lib/prisma";

export default async function AdminTeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; department?: string; className?: string }>;
}) {
  const { q = "", department = "", className = "" } = await searchParams;

  const teachers = await prisma.teacher.findMany({
    where: {
      AND: [
        department ? { department } : {},
        className ? { className } : {},
        q
          ? {
              OR: [
                { name: { contains: q } },
                { email: { contains: q } },
                { phone: { contains: q } },
                { department: { contains: q } },
              ],
            }
          : {},
      ],
    },
    orderBy: [{ department: "asc" }, { name: "asc" }],
  });

  const departments = [
    ...new Set((await prisma.teacher.findMany({ select: { department: true } })).map((t) => t.department)),
  ].sort();

  return (
    <main>
      <h1 className="font-display text-3xl">Teachers</h1>
      <p className="mt-2 text-sm text-muted">Faculty directory with class-teacher assignments.</p>

      <form className="mt-6 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, email, department"
          className="min-w-[220px] flex-1 border border-gold-soft bg-paper px-3 py-2 text-sm"
        />
        <select name="department" defaultValue={department} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
          <option value="">All departments</option>
          {departments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          name="className"
          defaultValue={className}
          placeholder="Class"
          className="w-24 border border-gold-soft bg-paper px-3 py-2 text-sm"
        />
        <button className="rounded-full bg-maroon px-4 py-2 text-sm text-paper">Apply</button>
      </form>

      <div className="mt-8">
        <TeacherForm />
      </div>

      <div className="mt-8 overflow-x-auto border border-gold-soft bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="bg-gold-soft/40">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Department</th>
              <th className="px-3 py-2">Class teacher</th>
              <th className="px-3 py-2">Contact</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="border-t border-gold-soft">
                <td className="px-3 py-2">{teacher.name}</td>
                <td className="px-3 py-2">{teacher.department}</td>
                <td className="px-3 py-2">
                  {teacher.className ? `${teacher.className}${teacher.section ? `-${teacher.section}` : ""}` : "-"}
                </td>
                <td className="px-3 py-2">
                  {teacher.email}
                  <div className="text-xs text-muted">{teacher.phone}</div>
                </td>
                <td className="px-3 py-2">{teacher.active ? "Active" : "Inactive"}</td>
              </tr>
            ))}
            {!teachers.length ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-muted">
                  No teachers yet. Add the first from the form above.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
