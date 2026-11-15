import { getDb, ensureTablesExist } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting CivicLens NeonDB database seeding...");

  const sql = getDb();
  if (!sql) {
    console.error("❌ DATABASE_URL is not set or contains placeholder. Set your NeonDB connection string in .env");
    process.exit(1);
  }

  // Ensure tables exist first
  await ensureTablesExist();

  // Clear existing demo records
  await sql`DELETE FROM admin_remarks;`;
  await sql`DELETE FROM complaint_history;`;
  await sql`DELETE FROM complaint_images;`;
  await sql`DELETE FROM complaints;`;
  await sql`DELETE FROM users;`;

  // 1. Create Initial Administrator Account
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "Admin@CivicLens2026!";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const adminId = "usr_admin_01";

  await sql`
    INSERT INTO users (id, name, email, password_hash, role)
    VALUES (${adminId}, 'City Infrastructure Commissioner', 'admin@civiclens.gov', ${adminPasswordHash}, 'ADMIN');
  `;
  console.log("✅ Admin account created: admin@civiclens.gov");

  // 2. Create Sample Citizen Accounts
  const citizenPasswordHash = await bcrypt.hash("Citizen@123!", 10);
  const citizen1Id = "usr_citizen_01";
  const citizen2Id = "usr_citizen_02";
  const citizen3Id = "usr_citizen_03";

  await sql`
    INSERT INTO users (id, name, email, password_hash, role)
    VALUES 
      (${citizen1Id}, 'Aarav Sharma', 'aarav.sharma@example.com', ${citizenPasswordHash}, 'CITIZEN'),
      (${citizen2Id}, 'Priya Patel', 'priya.patel@example.com', ${citizenPasswordHash}, 'CITIZEN'),
      (${citizen3Id}, 'Rohan Mukherjee', 'rohan.mukherjee@example.com', ${citizenPasswordHash}, 'CITIZEN');
  `;
  console.log("✅ 3 Citizen accounts created");

  // 3. Realistic Civic Complaints Dataset
  const sampleComplaints = [
    {
      id: "cmp_01",
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
      userId: citizen1Id,
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      history: [
        {
          id: "hist_01",
          prev: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Initial report logged via CivicLens Mobile Web",
          by: "Aarav Sharma",
        },
        {
          id: "hist_02",
          prev: "SUBMITTED",
          newStatus: "UNDER_REVIEW",
          remarks: "Dispatched to Zone 3 Highway Operations division",
          by: "City Infrastructure Commissioner",
        },
        {
          id: "hist_03",
          prev: "UNDER_REVIEW",
          newStatus: "IN_PROGRESS",
          remarks: "Asphalt patching crew and steamroller scheduled on site",
          by: "City Infrastructure Commissioner",
        },
      ],
      remark: "Priority assigned by Municipal Dispatch. Work order referenced: WO-CIV-2026-10492.",
    },
    {
      id: "cmp_02",
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
      userId: citizen2Id,
      imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
      history: [
        {
          id: "hist_04",
          prev: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Report filed with photo attachment",
          by: "Priya Patel",
        },
        {
          id: "hist_05",
          prev: "SUBMITTED",
          newStatus: "UNDER_REVIEW",
          remarks: "Notified Solid Waste Management Field Inspector",
          by: "City Infrastructure Commissioner",
        },
      ],
      remark: "Solid waste sanitary supervisor dispatched for inspection.",
    },
    {
      id: "cmp_03",
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
      userId: citizen3Id,
      imageUrl: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
      history: [
        {
          id: "hist_06",
          prev: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Emergency pipeline report submitted",
          by: "Rohan Mukherjee",
        },
        {
          id: "hist_07",
          prev: "SUBMITTED",
          newStatus: "IN_PROGRESS",
          remarks: "Valve 4 shut off; pipeline welding team deployed",
          by: "City Infrastructure Commissioner",
        },
        {
          id: "hist_08",
          prev: "IN_PROGRESS",
          newStatus: "RESOLVED",
          remarks: "Replaced 3.5m cast-iron pipe section. Pressure restored and road stabilized.",
          by: "City Infrastructure Commissioner",
        },
      ],
      remark: "Emergency pipe section replaced and pressure equalized.",
    },
    {
      id: "cmp_04",
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
      userId: citizen1Id,
      imageUrl: null,
      history: [
        {
          id: "hist_09",
          prev: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Report filed by resident",
          by: "Aarav Sharma",
        },
        {
          id: "hist_10",
          prev: "SUBMITTED",
          newStatus: "APPROVED",
          remarks: "Approved for LED luminaire replacement batch #42",
          by: "City Infrastructure Commissioner",
        },
      ],
      remark: null,
    },
    {
      id: "cmp_05",
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
      userId: citizen2Id,
      imageUrl: null,
      history: [
        {
          id: "hist_11",
          prev: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Report submitted with coordinates",
          by: "Priya Patel",
        },
      ],
      remark: null,
    },
    {
      id: "cmp_06",
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
      userId: citizen3Id,
      imageUrl: null,
      history: [
        {
          id: "hist_12",
          prev: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Report submitted",
          by: "Rohan Mukherjee",
        },
        {
          id: "hist_13",
          prev: "SUBMITTED",
          newStatus: "IN_PROGRESS",
          remarks: "Emergency yellow safety barricades erected; structural fabrication underway",
          by: "City Infrastructure Commissioner",
        },
      ],
      remark: "Emergency safety barricades installed.",
    },
    {
      id: "cmp_07",
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
      userId: citizen1Id,
      imageUrl: null,
      history: [
        {
          id: "hist_14",
          prev: "SUBMITTED",
          newStatus: "SUBMITTED",
          remarks: "Report submitted",
          by: "Aarav Sharma",
        },
        {
          id: "hist_15",
          prev: "SUBMITTED",
          newStatus: "REJECTED",
          remarks: "Site inspection concluded signage is on private demarcated land. Referred to Zonal Town Planning Authority.",
          by: "City Infrastructure Commissioner",
        },
      ],
      remark: "Out of municipal scope; referred to planning authority.",
    },
  ];

  for (const c of sampleComplaints) {
    await sql`
      INSERT INTO complaints (
        id, reference_id, title, description, ai_summary, category, severity, status, address, latitude, longitude, user_id
      ) VALUES (
        ${c.id}, ${c.referenceId}, ${c.title}, ${c.description}, ${c.aiSummary}, ${c.category}, ${c.severity}, ${c.status}, ${c.address}, ${c.latitude}, ${c.longitude}, ${c.userId}
      );
    `;

    if (c.imageUrl) {
      await sql`
        INSERT INTO complaint_images (
          id, complaint_id, s3_key, url, original_filename, mime_type, file_size
        ) VALUES (
          ${`img_${c.id}`}, ${c.id}, ${`demo/${c.referenceId}.jpg`}, ${c.imageUrl}, 'evidence.jpg', 'image/jpeg', 350000
        );
      `;
    }

    for (const h of c.history) {
      await sql`
        INSERT INTO complaint_history (
          id, complaint_id, previous_status, new_status, remarks, changed_by
        ) VALUES (
          ${h.id}, ${c.id}, ${h.prev}, ${h.newStatus}, ${h.remarks}, ${h.by}
        );
      `;
    }

    if (c.remark) {
      await sql`
        INSERT INTO admin_remarks (
          id, complaint_id, admin_id, remark
        ) VALUES (
          ${`rem_${c.id}`}, ${c.id}, ${adminId}, ${c.remark}
        );
      `;
    }
  }

  console.log(`✅ ${sampleComplaints.length} Sample complaints seeded successfully!`);
  console.log("✨ Seeding completed successfully on NeonDB.");
}

main().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
