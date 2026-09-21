import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.notificationLog.deleteMany();
  await prisma.cashTicketRequest.deleteMany();
  await prisma.seatHold.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.staff.deleteMany();

  await prisma.staff.createMany({
    data: [
      {
        name: "School Admin",
        email: "admin@reubs.school",
        passwordHash: await bcrypt.hash("ReubsAdmin@2026", 10),
        role: "admin",
      },
      {
        name: "Gate Scanner",
        email: "scanner@reubs.school",
        passwordHash: await bcrypt.hash("ScanGate@2026", 10),
        role: "scanner",
      },
    ],
  });

  await prisma.student.createMany({
    data: [
      {
        enrollmentNumber: "REU2026-1001",
        name: "Aanya Shah",
        className: "8",
        section: "A",
        parentName: "Nirav Shah",
        parentPhone: "9876543210",
        parentEmail: "nirav.shah@example.com",
      },
      {
        enrollmentNumber: "REU2026-1002",
        name: "Kabir Patel",
        className: "10",
        section: "B",
        parentName: "Hetal Patel",
        parentPhone: "9876501122",
        parentEmail: "hetal.patel@example.com",
      },
      {
        enrollmentNumber: "REU2026-1003",
        name: "Meera Joshi",
        className: "12",
        section: "A",
        parentName: "Kavita Joshi",
        parentPhone: "9825012345",
        parentEmail: "kavita.joshi@example.com",
      },
      {
        enrollmentNumber: "REU2026-1004",
        name: "Arjun Mehta",
        className: "5",
        section: "C",
        parentName: "Rahul Mehta",
        parentPhone: "9909909909",
        parentEmail: "rahul.mehta@example.com",
      },
      {
        enrollmentNumber: "REU2026-1005",
        name: "Diya Desai",
        className: "9",
        section: "A",
        parentName: "Pooja Desai",
        parentPhone: "9876512340",
        parentEmail: "pooja.desai@example.com",
      },
      {
        enrollmentNumber: "REU2026-1006",
        name: "Vivaan Trivedi",
        className: "3",
        section: "B",
        parentName: "Amit Trivedi",
        parentPhone: "9090901234",
        parentEmail: "amit.trivedi@example.com",
      },
      {
        enrollmentNumber: "REU2026-1007",
        name: "Isha Rana",
        className: "11",
        section: "C",
        parentName: "Sneha Rana",
        parentPhone: "9724411122",
        parentEmail: "sneha.rana@example.com",
      },
      {
        enrollmentNumber: "REU2026-1008",
        name: "Reyansh Panchal",
        className: "6",
        section: "A",
        parentName: "Manish Panchal",
        parentPhone: "8460012345",
        parentEmail: "manish.panchal@example.com",
      },
    ],
  });

  await prisma.teacher.createMany({
    data: [
      {
        name: "Anjali Mehta",
        email: "anjali.mehta@reubs.school",
        phone: "9876500001",
        department: "Languages",
        className: "8",
        section: "A",
      },
      {
        name: "Rakesh Shah",
        email: "rakesh.shah@reubs.school",
        phone: "9876500002",
        department: "Mathematics",
        className: "10",
        section: "B",
      },
      {
        name: "Neha Trivedi",
        email: "neha.trivedi@reubs.school",
        phone: "9876500003",
        department: "Sciences",
        className: "12",
        section: "A",
      },
      {
        name: "Vikram Desai",
        email: "vikram.desai@reubs.school",
        phone: "9876500004",
        department: "Physical education",
      },
    ],
  });

  await prisma.event.createMany({
    data: [
      {
        title: "Annual Day 2026: Aatman",
        slug: "annual-day-2026",
        summary: "An evening of music, dance, and theatre by students from every house.",
        description:
          "Aatman is this year's Annual Day, a campus-wide celebration of performance and storytelling. Families are invited to the main auditorium. Entry is by e-pass only, with a reserved seat for each verified student.",
        category: "Culture",
        venue: "REUBS Auditorium, Maninagar",
        startsAt: new Date("2026-10-18T17:30:00+05:30"),
        endsAt: new Date("2026-10-18T21:00:00+05:30"),
        bookingOpensAt: new Date("2026-09-01T09:00:00+05:30"),
        bookingClosesAt: new Date("2026-10-17T18:00:00+05:30"),
        imageUrl:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
        priceInPaise: 25000,
        totalSeats: 192,
        maxPerStudent: 5,
      },
      {
        title: "Inter-House Sports Meet",
        slug: "sports-meet-2026",
        summary: "Track, field, and team finals across four houses on the main ground.",
        description:
          "Parents and students can book a ground pass for the championship Saturday. The pass covers opening march-past, finals, and the prize ceremony. Bring a scanned e-ticket at Gate 2.",
        category: "Sports",
        venue: "Main Sports Ground",
        startsAt: new Date("2026-11-08T08:00:00+05:30"),
        endsAt: new Date("2026-11-08T16:30:00+05:30"),
        bookingOpensAt: new Date("2026-10-01T09:00:00+05:30"),
        bookingClosesAt: new Date("2026-11-07T18:00:00+05:30"),
        imageUrl:
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80",
        priceInPaise: 10000,
        totalSeats: 192,
        maxPerStudent: 5,
      },
      {
        title: "Science & Innovation Fair",
        slug: "science-fair-2026",
        summary: "Student labs, robotics demos, and a junior makers' corner.",
        description:
          "Open to REUBS families. Each verified student pass includes one accompanying parent. Exhibit walkthroughs begin at 9:30 AM in the senior block.",
        category: "Academics",
        venue: "Senior Block & Smart Labs",
        startsAt: new Date("2026-12-05T09:30:00+05:30"),
        endsAt: new Date("2026-12-05T14:00:00+05:30"),
        bookingOpensAt: new Date("2026-11-01T09:00:00+05:30"),
        bookingClosesAt: new Date("2026-12-04T18:00:00+05:30"),
        imageUrl:
          "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80",
        priceInPaise: 0,
        totalSeats: 192,
        maxPerStudent: 5,
      },
      {
        title: "Winter Carnival & Food Fest",
        slug: "winter-carnival-2026",
        summary: "Stalls, games, and a twilight concert on the junior lawns.",
        description:
          "A community evening for REUBS families. Passes are limited. Students must be verified with their enrollment number at checkout.",
        category: "Community",
        venue: "Junior Lawns",
        startsAt: new Date("2026-12-20T16:00:00+05:30"),
        endsAt: new Date("2026-12-20T20:30:00+05:30"),
        bookingOpensAt: new Date("2026-11-20T09:00:00+05:30"),
        bookingClosesAt: new Date("2026-12-19T18:00:00+05:30"),
        imageUrl:
          "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=1600&q=80",
        priceInPaise: 15000,
        totalSeats: 192,
        maxPerStudent: 5,
      },
      {
        title: "Republic Day Cultural Evening",
        slug: "republic-day-2027",
        summary: "Flag assembly followed by a short cultural programme for families.",
        description:
          "Limited seating in the auditorium after the morning assembly. Book early. Valid only for current REUBS students and one parent.",
        category: "Culture",
        venue: "Assembly Court & Auditorium",
        startsAt: new Date("2027-01-26T08:00:00+05:30"),
        endsAt: new Date("2027-01-26T11:30:00+05:30"),
        bookingOpensAt: new Date("2027-01-01T09:00:00+05:30"),
        bookingClosesAt: new Date("2027-01-25T18:00:00+05:30"),
        imageUrl:
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80",
        priceInPaise: 0,
        totalSeats: 192,
        maxPerStudent: 5,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
