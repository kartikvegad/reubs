import type { Metadata } from "next";
import { Eyebrow, Photo } from "@/components/site/Photo";
import { img } from "@/lib/media";

export const metadata: Metadata = { title: "Campus & facilities" };

const facilities = [
  [img.classroom, "Smart classrooms", "Boards, seating and a room organised for talk as well as notes. [Equipment list — office to confirm.]"],
  [img.science, "Science laboratories", "Spaces for demonstration and student practicals in the sciences, with safety as the first rule of the room."],
  [img.computer, "Computer / technology labs", "Scheduled computer work so digital skill is taught, not assumed."],
  [img.library, "Library", "A quiet collection for reading periods, reference and the habit of sitting with a book."],
  [img.chalkboard, "Mathematics learning spaces", "Rooms and corners used for board work, practice and small-group explanation."],
  [img.crafts, "Activity rooms", "Tables that can take paint, clay, models and the mess of making."],
  [img.sports, "Sports facilities", "Ground time for games and athletics. [Specific courts and equipment — to be listed by the school.]"],
  [img.concert, "Auditorium / multipurpose hall", "Assemblies, Annual Day, workshops and parent programmes."],
  [img.music, "Music & performing arts", "Practice and performance for voice, instrument and stage work."],
  [img.art, "Art & creative spaces", "Drawing, colour and display — student work on the walls, not only in files."],
  [img.playground, "Playground", "Open space for younger children and informal play under supervision."],
  [img.bus, "Transportation", "School transport where the office operates routes. [Route list — to be published.]"],
  [img.corridor, "Safe & secure campus", "A compact site, known adults, and procedures for arrival and dispersal. [Security details — office.]"],
  [img.teacher, "Student support areas", "Medical room, information desk and quiet places for a child who needs a pause."],
];

export default function CampusPage() {
  return (
    <main>
      <section className="relative min-h-[46vh]">
        <Photo src={img.campus} alt="Campus" className="absolute inset-0" sizes="100vw" priority />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-paper">
          <Eyebrow>Campus</Eyebrow>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Facilities on a compact Maninagar campus</h1>
          <p className="mt-4 max-w-2xl text-lg text-gold-soft">
            Prabhu Park is not a sprawling parkland school. It is a well-used set of rooms and
            grounds, kept for teaching. Descriptions below are open for the office to specify.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map(([src, title, copy]) => (
            <article key={title} className="bg-paper">
              <Photo src={src} alt={title} className="aspect-[4/3]" />
              <div className="border border-t-0 border-gold-soft p-5">
                <h2 className="font-display text-2xl">{title}</h2>
                <p className="mt-2 leading-7 text-muted">{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
