import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CivicLens database seeding...");

  // Clear existing demonstration data if any
  await prisma.adminRemark.deleteMany({});
  await prisma.complaintHistory.deleteMany({});
  await prisma.complaintImage.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Initial Administrator Account
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "Admin@CivicLens2026!";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.create({
    data: {
      name: "City Infrastructure Commissioner",
      email: "admin@civiclens.gov",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin account created: admin@civiclens.gov (Password from env or default)`);

  // 2. Create Sample Citizen Accounts
  const citizenPasswordHash = await bcrypt.hash("Citizen@123!", 10);

  const citizen1 = await prisma.user.create({
    data: {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      passwordHash: citizenPasswordHash,
      role: "CITIZEN",
    },
  });

  const citizen2 = await prisma.user.create({
    data: {
      name: "Priya Patel",
      email: "priya.patel@example.com",
      passwordHash: citizenPasswordHash,
      role: "CITIZEN",
    },
  });

  const citizen3 = await prisma.user.create({
    data: {
      name: "Rohan Mukherjee",
      email: "rohan.mukherjee@example.com",
      passwordHash: citizenPasswordHash,
      role: "CITIZEN",
    },
  });
  console.log(`✅ 3 Citizen accounts created`);

  // 3. Realistic Civic Complaints Dataset with Real Geographic Coordinates
  // Centered around metropolitan urban corridors
  const sampleComplaints = [
    {
      referenceId: "CIV-2026-10492",
      title: "Severe Pothole Cluster and Road Subsidence on 4th Main Avenue",
      description:
        "Multiple deep potholes spanning over 6 meters have formed following recent monsoon showers. Two-wheelers frequently swerve dangerously into oncoming lanes to avoid axle damage. Water collects here whenever it rains, completely concealing the hazard.",
      aiSummary:
        "Hazardous pothole cluster causing acute traffic disruption and accident risk for two-wheelers.",
      category: "ROADS_AND_POTHOLES",
      severity: "HIGH",
      status: "IN_PROGRESS",
      address: "4th Main Avenue, Near Metro Pillar 142, Indiranagar",
      latitude: 12.9784,
      longitude: 77.6408,
      userId: citizen1.id,
      images: [
        {
          s3Key: "demo/pothole-indiranagar.jpg",
          url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
          originalFilename: "road_hazard_indiranagar.jpg",
          mimeType: "image/jpeg",
          fileSize: 420100,
        },
      ],
      history: [
        {
          previousStatus: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Initial report logged via CivicLens Mobile Web",
          changedBy: citizen1.name,
        },
        {
          previousStatus: "SUBMITTED",
          newStatus: "UNDER_REVIEW",
          remarks: "Dispatched to Zone 3 Highway Operations division",
          changedBy: adminUser.name,
        },
        {
          previousStatus: "UNDER_REVIEW",
          newStatus: "IN_PROGRESS",
          remarks: "Asphalt patching crew and steamroller scheduled on site",
          changedBy: adminUser.name,
        },
      ],
    },
    {
      referenceId: "CIV-2026-10834",
      title: "Overflowing Garbage Dump and Biomass Accumulation near Vegetable Market",
      description:
        "The municipal trash dumpster has not been cleared for over 5 days. Organic waste and plastic packaging have spilled onto pedestrian walkways, attracting stray animals and generating a severe health hazard for adjoining residential apartments.",
      aiSummary:
        "Chronic municipal waste accumulation causing pedestrian obstruction and sanitary risks near market.",
      category: "GARBAGE_AND_WASTE",
      severity: "CRITICAL",
      status: "UNDER_REVIEW",
      address: "Old Subzi Mandi Road, Sector 12 Market Complex",
      latitude: 12.9856,
      longitude: 77.6124,
      userId: citizen2.id,
      images: [
        {
          s3Key: "demo/garbage-market.jpg",
          url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
          originalFilename: "market_waste_sector12.jpg",
          mimeType: "image/jpeg",
          fileSize: 580920,
        },
      ],
      history: [
        {
          previousStatus: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Report filed with photo attachment",
          changedBy: citizen2.name,
        },
        {
          previousStatus: "SUBMITTED",
          newStatus: "UNDER_REVIEW",
          remarks: "Notified Solid Waste Management Field Inspector",
          changedBy: adminUser.name,
        },
      ],
    },
    {
      referenceId: "CIV-2026-11209",
      title: "High-Pressure Water Main Pipe Burst and Road Flooding",
      description:
        "A major subsurface drinking water distribution pipe ruptured early this morning. Potable water is spewing continuously onto the arterial road, eroding the road base and starving neighboring residential towers of water pressure.",
      aiSummary:
        "Pressurized municipal water main rupture causing severe clean water loss and asphalt erosion.",
      category: "WATER_SUPPLY_AND_LEAKAGE",
      severity: "CRITICAL",
      status: "RESOLVED",
      address: "Crossroad 7, Near Central Water Tank, Koramangala",
      latitude: 12.9352,
      longitude: 77.6245,
      userId: citizen3.id,
      images: [
        {
          s3Key: "demo/water-burst.jpg",
          url: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
          originalFilename: "water_main_leak.jpg",
          mimeType: "image/jpeg",
          fileSize: 312400,
        },
      ],
      history: [
        {
          previousStatus: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Emergency pipeline report submitted",
          changedBy: citizen3.name,
        },
        {
          previousStatus: "SUBMITTED",
          newStatus: "IN_PROGRESS",
          remarks: "Valve 4 shut off; pipeline welding team deployed",
          changedBy: adminUser.name,
        },
        {
          previousStatus: "IN_PROGRESS",
          newStatus: "RESOLVED",
          remarks: "Replaced 3.5m cast-iron pipe section. Pressure restored and road stabilized.",
          changedBy: adminUser.name,
        },
      ],
    },
    {
      referenceId: "CIV-2026-11540",
      title: "Non-Functional Streetlights on Public School Transit Corridor",
      description:
        "A sequence of six consecutive sodium streetlights have been completely dark for over two weeks along the primary pedestrian route leading to the Government Senior School. Lack of illumination creates acute safety concerns for evening commuters and children.",
      aiSummary:
        "Extended dark corridor of 6 non-operational streetlights along school access route.",
      category: "STREETLIGHTS_AND_ELECTRICITY",
      severity: "HIGH",
      status: "APPROVED",
      address: "Govt School Road, HSR Layout Sector 3",
      latitude: 12.9116,
      longitude: 77.6389,
      userId: citizen1.id,
      images: [],
      history: [
        {
          previousStatus: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Report filed by resident",
          changedBy: citizen1.name,
        },
        {
          previousStatus: "SUBMITTED",
          newStatus: "APPROVED",
          remarks: "Approved for LED luminaire replacement batch #42",
          changedBy: adminUser.name,
        },
      ],
    },
    {
      referenceId: "CIV-2026-11881",
      title: "Blocked Stormwater Drain Culvert Causing Stagnant Backflow",
      description:
        "The roadside concrete stormwater culvert is heavily congested with plastic debris, silt, and construction rubble. Sewage water has begun overflowing onto driveways, producing foul odors and mosquito breeding grounds.",
      aiSummary:
        "Stormwater culvert clogged with solid waste resulting in stagnant wastewater overflow.",
      category: "DRAINAGE_AND_SANITATION",
      severity: "MEDIUM",
      status: "SUBMITTED",
      address: "Lakeview Road, Near BDA Park Gate 2, BTM Layout",
      latitude: 12.9166,
      longitude: 77.6101,
      userId: citizen2.id,
      images: [],
      history: [
        {
          previousStatus: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Report submitted with coordinates",
          changedBy: citizen2.name,
        },
      ],
    },
    {
      referenceId: "CIV-2026-12015",
      title: "Collapsed Concrete Pedestrian Footbridge Railing",
      description:
        "A 4-meter section of the reinforced protective railing on the public footbridge over the railway canal has collapsed due to corrosion. Pedestrians, elderly citizens, and cyclists are exposed to an 8-foot drop hazard.",
      aiSummary:
        "Critical structural failure of pedestrian footbridge railing posing immediate fall danger.",
      category: "PUBLIC_INFRASTRUCTURE",
      severity: "CRITICAL",
      status: "IN_PROGRESS",
      address: "Railway Canal Footpath, Malleshwaram 8th Cross",
      latitude: 13.0034,
      longitude: 77.5685,
      userId: citizen3.id,
      images: [],
      history: [
        {
          previousStatus: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Report submitted",
          changedBy: citizen3.name,
        },
        {
          previousStatus: "SUBMITTED",
          newStatus: "IN_PROGRESS",
          remarks: "Emergency yellow safety barricades erected; structural fabrication underway",
          changedBy: adminUser.name,
        },
      ],
    },
    {
      referenceId: "CIV-2026-12199",
      title: "Request for Relocation of Unused Private Billboard Blocking Traffic Sightline",
      description:
        "An abandoned private commercial hoarding billboard on private property does not directly violate municipal code, though citizen requested removal.",
      aiSummary:
        "Private property hoarding dispute outside public jurisdiction.",
      category: "OTHER",
      severity: "LOW",
      status: "REJECTED",
      address: "Bannerghatta Main Road, Opposite Shopper Stop",
      latitude: 12.8942,
      longitude: 77.5991,
      userId: citizen1.id,
      images: [],
      history: [
        {
          previousStatus: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Report submitted",
          changedBy: citizen1.name,
        },
        {
          previousStatus: "SUBMITTED",
          newStatus: "REJECTED",
          remarks: "Site inspection concluded signage is on private demarcated land. Referred to Zonal Town Planning Authority.",
          changedBy: adminUser.name,
        },
      ],
    },
  ];

  for (const item of sampleComplaints) {
    const { images, history, ...complaintData } = item;
    const complaint = await prisma.complaint.create({
      data: {
        ...(complaintData as any),
        images: {
          create: images as any,
        },
        history: {
          create: history as any,
        },
      },
    });

    // Add sample admin remark for in-progress and under-review items
    if (item.status === "IN_PROGRESS" || item.status === "UNDER_REVIEW") {
      await prisma.adminRemark.create({
        data: {
          complaintId: complaint.id,
          adminId: adminUser.id,
          remark: `Priority assigned by Municipal Dispatch. Work order referenced: WO-${complaint.referenceId}.`,
        },
      });
    }
  }

  console.log(`✅ ${sampleComplaints.length} sample complaints successfully seeded!`);
  console.log("✨ Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
