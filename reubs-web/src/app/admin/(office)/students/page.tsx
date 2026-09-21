import { StudentForm } from "@/components/admin/StudentForm";
import { prisma } from "@/lib/prisma";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; className?: string; section?: string; sort?: string }>;
}) {
  const { q = "", className = "", section = "", sort = "enrollment" } = await searchParams;

  const students = await prisma.student.findMany({
    where: {
      AND: [
        className ? { className } : {},
        section ? { section } : {},
        q
          ? {
              OR: [
                { name: { contains: q } },
                { enrollmentNumber: { contains: q } },
                { parentName: { contains: q } },
                { parentPhone: { contains: q } },
              ],
            }
          : {},
      ],
    },
    include: { _count: { select: { tickets: true } } },
    orderBy:
      sort === "name"
        ? { name: "asc" }
        : sort === "class"
          ? [{ className: "asc" }, { section: "asc" }, { name: "asc" }]
          : { enrollmentNumber: "asc" },
  });

  const all = await prisma.student.findMany({ select: { className: true, section: true } });
  const classes = [...new Set(all.map((s) => s.className))].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
  const sections = [...new Set(all.map((s) => s.section))].sort();

  const byClass = new Map<string, number>();
  const bySection = new Map<string, number>();
  for (const student of students) {
    byClass.set(student.className, (byClass.get(student.className) || 0) + 1);
    const key = `${student.className}-${student.section}`;
    bySection.set(key, (bySection.get(key) || 0) + 1);
  }

  return (
    <main>
      <h1 className="font-display text-3xl">Students</h1>
      <p className="mt-2 text-sm text-muted">Roll management with standard and section classification.</p>

      <form className="mt-6 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, enrollment, parent"
          className="min-w-[220px] flex-1 border border-gold-soft bg-paper px-3 py-2 text-sm"
        />
        <select name="className" defaultValue={className} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
          <option value="">All standards</option>
          {classes.map((item) => (
            <option key={item} value={item}>
              Class {item}
            </option>
          ))}
        </select>
        <select name="section" defaultValue={section} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
          <option value="">All sections</option>
          {sections.map((item) => (
            <option key={item} value={item}>
              Section {item}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
          <option value="enrollment">Sort by enrollment</option>
          <option value="name">Sort by name</option>
          <option value="class">Sort by class</option>
        </select>
        <button className="rounded-full bg-maroon px-4 py-2 text-sm text-paper">Apply</button>
      </form>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <article className="border border-gold-soft bg-paper p-4">
          <h2 className="font-display text-lg">By standard</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            {[...byClass.entries()]
              .sort((a, b) => Number(a[0]) - Number(b[0]) || a[0].localeCompare(b[0]))
              .map(([key, count]) => (
                <li key={key} className="flex justify-between border border-gold-soft/60 px-2 py-1">
                  <span>Class {key}</span>
                  <strong>{count}</strong>
                </li>
              ))}
          </ul>
        </article>
        <article className="border border-gold-soft bg-paper p-4">
          <h2 className="font-display text-lg">By section</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            {[...bySection.entries()].sort().map(([key, count]) => (
              <li key={key} className="flex justify-between border border-gold-soft/60 px-2 py-1">
                <span>{key}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <div className="mt-8">
        <StudentForm />
      </div>

      <div className="mt-8 overflow-x-auto border border-gold-soft bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="bg-gold-soft/40">
            <tr>
              <th className="px-3 py-2">Enrollment</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Class</th>
              <th className="px-3 py-2">Parent</th>
              <th className="px-3 py-2">Tickets</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-gold-soft">
                <td className="px-3 py-2">{student.enrollmentNumber}</td>
                <td className="px-3 py-2">{student.name}</td>
                <td className="px-3 py-2">
                  {student.className}-{student.section}
                </td>
                <td className="px-3 py-2">
                  {student.parentName}
                  <div className="text-xs text-muted">{student.parentPhone}</div>
                </td>
                <td className="px-3 py-2">{student._count.tickets}</td>
                <td className="px-3 py-2">{student.active ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
