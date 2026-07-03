export const supervisorApplications = [
  {
    id: "RAP-1028",
    name: "Chinedu Okeke",
    vehicle: "Motorbike",
    city: "Lagos",
    status: "Pending Verification",
    submitted: "Today, 09:42",
    documents: 5,
  },
  {
    id: "RAP-1024",
    name: "Mariam Yusuf",
    vehicle: "Car",
    city: "Abuja",
    status: "More Info Required",
    submitted: "Yesterday, 16:10",
    documents: 4,
  },
  {
    id: "RAP-1019",
    name: "Victor Eze",
    vehicle: "Van",
    city: "Port Harcourt",
    status: "Pending Verification",
    submitted: "Jul 2, 12:18",
    documents: 5,
  },
  {
    id: "RAP-1011",
    name: "Blessing Musa",
    vehicle: "Motorbike",
    city: "Ibadan",
    status: "Pending Admin Review",
    submitted: "Jul 1, 08:31",
    documents: 5,
  },
];

export const assignedRiders = [
  {
    id: "RID-3381",
    name: "Tunde Salami",
    status: "Active",
    rating: "4.8",
    completed: 184,
    issues: 0,
    lastOnline: "7 min ago",
  },
  {
    id: "RID-3314",
    name: "Fatima Lawal",
    status: "Active",
    rating: "4.7",
    completed: 139,
    issues: 1,
    lastOnline: "22 min ago",
  },
  {
    id: "RID-3279",
    name: "Emeka Nwosu",
    status: "Under Review",
    rating: "4.2",
    completed: 71,
    issues: 2,
    lastOnline: "Yesterday",
  },
];

export const riderIssues = [
  {
    id: "ISS-410",
    rider: "Fatima Lawal",
    type: "Late pickup",
    priority: "Medium",
    status: "Open",
    reported: "36 min ago",
  },
  {
    id: "ISS-398",
    rider: "Emeka Nwosu",
    type: "Document recheck",
    priority: "High",
    status: "Under Review",
    reported: "Today, 10:21",
  },
  {
    id: "ISS-381",
    rider: "Tunde Salami",
    type: "Receiver complaint",
    priority: "Low",
    status: "Resolved",
    reported: "Jul 2, 15:44",
  },
];

export const reviewTrend = [
  { day: "Mon", approved: 8, rejected: 2 },
  { day: "Tue", approved: 11, rejected: 1 },
  { day: "Wed", approved: 7, rejected: 3 },
  { day: "Thu", approved: 14, rejected: 2 },
  { day: "Fri", approved: 10, rejected: 1 },
];

export const queueBreakdown = [
  { label: "NIN", value: 92, color: "#0f766e" },
  { label: "License", value: 78, color: "#f59e0b" },
  { label: "Voter ID", value: 63, color: "#2563eb" },
  { label: "Relatives", value: 54, color: "#b42318" },
];
