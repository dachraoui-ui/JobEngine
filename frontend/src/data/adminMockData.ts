const minutesAgo = (mins: number) => new Date(Date.now() - mins * 60000).toISOString();
const hoursAgo = (hours: number) => minutesAgo(hours * 60);
const daysAgo = (days: number) => hoursAgo(days * 24);

export const ADMIN_MOCK_USERS = [
  { firstName: "System", lastName: "Admin", email: "admin@jobengine.com", role: "ADMIN", isVerified: true, isActive: true, createdAt: "2026-05-31T12:00:00.000Z" },
  { firstName: "adem", lastName: "dachraoui", email: "dachraouia903@gmail.com", role: "CANDIDATE", isVerified: true, isActive: false, createdAt: "2026-05-29T16:29:17.119Z" },
  { firstName: "oubaied", lastName: "oubaied", email: "oubaied29@gmail.com", role: "RECRUITER", isVerified: false, isActive: true, createdAt: "2026-05-29T14:07:34.680Z" },
  { firstName: "ahmed", lastName: "dachraoui", email: "ahhhmed@gmail.com", role: "ADMIN", isVerified: true, isActive: true, createdAt: "2026-05-07T15:23:49.637Z" },
  { firstName: "gezeni", lastName: "amin", email: "gezeniamin@gmail.com", role: "CANDIDATE", isVerified: true, isActive: true, createdAt: "2026-04-23T15:25:56.293Z" },
  { firstName: "Ahmed", lastName: "Dachraoui", email: "dachraouia193@gmail.com", role: "CANDIDATE", isVerified: true, isActive: true, createdAt: "2026-04-23T15:14:37.101Z" },
  { firstName: "dachraoui", lastName: "ahmed", email: "ahmed.dachraoui03@gmail.com", role: "CANDIDATE", isVerified: true, isActive: true, createdAt: "2026-04-23T11:21:38.822Z" },
  { firstName: "ahmed", lastName: "dachraoui", email: "ahmed@gmail.com", role: "ADMIN", isVerified: true, isActive: true, createdAt: "2026-04-23T10:39:10.565Z" },
  { firstName: "Amina", lastName: "Haddad", email: "amina.haddad@example.com", role: "CANDIDATE", createdAt: minutesAgo(12) },
  { firstName: "Lucas", lastName: "Meyer", email: "lucas.meyer@example.com", role: "CANDIDATE", createdAt: minutesAgo(35) },
  { firstName: "Sofia", lastName: "Rossi", email: "sofia.rossi@example.com", role: "CANDIDATE", createdAt: hoursAgo(3) },
  { firstName: "Omar", lastName: "Khalil", email: "omar.khalil@example.com", role: "CANDIDATE", createdAt: hoursAgo(6) },
  { firstName: "Lina", lastName: "Benali", email: "lina.benali@example.com", role: "CANDIDATE", createdAt: hoursAgo(9) },
  { firstName: "Hugo", lastName: "Martin", email: "hugo.martin@example.com", role: "CANDIDATE", createdAt: hoursAgo(12) },
  { firstName: "Nina", lastName: "Petrova", email: "nina.petrova@example.com", role: "CANDIDATE", createdAt: hoursAgo(18) },
  { firstName: "Karim", lastName: "Bensalem", email: "karim.bensalem@example.com", role: "CANDIDATE", createdAt: daysAgo(1) },
  { firstName: "Salma", lastName: "Farah", email: "salma.farah@example.com", role: "CANDIDATE", createdAt: daysAgo(1.5) },
  { firstName: "Adam", lastName: "Kowalski", email: "adam.kowalski@example.com", role: "CANDIDATE", createdAt: daysAgo(2) },
  { firstName: "Yasmine", lastName: "Nouri", email: "yasmine.nouri@example.com", role: "CANDIDATE", createdAt: daysAgo(3) },
  { firstName: "Noah", lastName: "Dubois", email: "noah.dubois@example.com", role: "CANDIDATE", createdAt: daysAgo(4) },
  { firstName: "Layla", lastName: "Saeed", email: "layla.saeed@example.com", role: "CANDIDATE", createdAt: daysAgo(5) },
  { firstName: "Matteo", lastName: "Ricci", email: "matteo.ricci@example.com", role: "CANDIDATE", createdAt: daysAgo(6) },
  { firstName: "Farid", lastName: "Idrissi", email: "farid.idrissi@example.com", role: "CANDIDATE", createdAt: daysAgo(7) },
  { firstName: "Clara", lastName: "Nguyen", email: "clara.nguyen@example.com", role: "CANDIDATE", createdAt: daysAgo(9) },
  { firstName: "Emma", lastName: "Laurent", email: "emma.laurent@example.com", role: "RECRUITER", isVerified: true, createdAt: hoursAgo(2) },
  { firstName: "Rami", lastName: "Kader", email: "rami.kader@example.com", role: "RECRUITER", isVerified: true, createdAt: hoursAgo(5) },
  { firstName: "Sara", lastName: "ElAmrani", email: "sara.elamrani@example.com", role: "RECRUITER", isVerified: false, createdAt: hoursAgo(11) },
  { firstName: "Julien", lastName: "Costa", email: "julien.costa@example.com", role: "RECRUITER", isVerified: true, createdAt: daysAgo(2.5) },
  { firstName: "Maha", lastName: "Zahid", email: "maha.zahid@example.com", role: "RECRUITER", isVerified: true, createdAt: daysAgo(3.5) },
  { firstName: "Victor", lastName: "Silva", email: "victor.silva@example.com", role: "RECRUITER", isVerified: false, createdAt: daysAgo(4.5) },
  { firstName: "Dalia", lastName: "Haddad", email: "dalia.haddad@example.com", role: "RECRUITER", isVerified: true, createdAt: daysAgo(6.5) },
  { firstName: "Aziz", lastName: "Rahman", email: "aziz.rahman@example.com", role: "RECRUITER", isVerified: true, createdAt: daysAgo(8) },
  { firstName: "Nadia", lastName: "Benyahia", email: "nadia.benyahia@example.com", role: "ADMIN", createdAt: daysAgo(10) },
  { firstName: "Thomas", lastName: "Klein", email: "thomas.klein@example.com", role: "ADMIN", createdAt: daysAgo(12) }
];

export const ADMIN_MOCK_JOBS = [
  { requiredSkills: ["React", "TypeScript", "Tailwind", "Vite"] },
  { requiredSkills: ["Node.js", "PostgreSQL", "Docker"] },
  { requiredSkills: ["Python", "FastAPI", "PostgreSQL"] },
  { requiredSkills: ["Java", "Spring", "AWS"] },
  { requiredSkills: ["React", "Redux", "TypeScript"] },
  { requiredSkills: ["Vue", "TypeScript", "CSS"] },
  { requiredSkills: ["Go", "Kubernetes", "Docker"] },
  { requiredSkills: ["React", "Node.js", "GraphQL"] },
  { requiredSkills: ["AWS", "Terraform", "Docker"] },
  { requiredSkills: ["Python", "Pandas", "SQL"] },
  { requiredSkills: ["TypeScript", "Next.js", "Tailwind"] },
  { requiredSkills: ["Java", "Kafka", "Spring"] }
];

