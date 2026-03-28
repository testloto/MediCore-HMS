// ─── PATIENTS ──────────────────────────────────────────────────────
export const PATIENTS = [
  { id: 'P-0001', name: 'Aarav Sharma',   age: 34, gender: 'Male',   ward: 'Cardiology',   status: 'active',    blood: 'A+',  phone: '98765 43210', admitted: '2026-03-10', doctor: 'Dr. Arjun Mehra',    city: 'Mumbai',  insurance: 'Star Health', color: '#18ae94' },
  { id: 'P-0002', name: 'Priya Nair',     age: 28, gender: 'Female', ward: 'Neurology',    status: 'critical',  blood: 'B+',  phone: '91234 56789', admitted: '2026-03-12', doctor: 'Dr. Kavitha Patel',  city: 'Pune',    insurance: 'HDFC Ergo',   color: '#ef4444' },
  { id: 'P-0003', name: 'Rajesh Kumar',   age: 52, gender: 'Male',   ward: 'Orthopedics',  status: 'discharged',blood: 'O-',  phone: '99887 76655', admitted: '2026-03-01', doctor: 'Dr. Rohit Singh',    city: 'Delhi',   insurance: 'LIC Health',  color: '#6366f1' },
  { id: 'P-0004', name: 'Sunita Verma',   age: 45, gender: 'Female', ward: 'General',      status: 'active',    blood: 'AB+', phone: '96543 21098', admitted: '2026-03-13', doctor: 'Dr. Ananya Rao',     city: 'Chennai', insurance: 'Max Bupa',    color: '#a855f7' },
  { id: 'P-0005', name: 'Vikram Desai',   age: 62, gender: 'Male',   ward: 'ICU',          status: 'critical',  blood: 'A-',  phone: '97418 52963', admitted: '2026-03-14', doctor: 'Dr. Arjun Mehra',    city: 'Ahmedabad',insurance: 'Care Health', color: '#ef4444' },
  { id: 'P-0006', name: 'Neha Gupta',     age: 31, gender: 'Female', ward: 'Maternity',    status: 'active',    blood: 'O+',  phone: '96321 47852', admitted: '2026-03-11', doctor: 'Dr. Ananya Rao',     city: 'Bangalore',insurance: 'Niva Bupa',  color: '#ec4899' },
  { id: 'P-0007', name: 'Suresh Pillai',  age: 70, gender: 'Male',   ward: 'Geriatrics',   status: 'active',    blood: 'B-',  phone: '99001 23456', admitted: '2026-03-09', doctor: 'Dr. Suresh Iyer',    city: 'Kochi',   insurance: 'Oriental',    color: '#f59e0b' },
  { id: 'P-0008', name: 'Meera Joshi',    age: 22, gender: 'Female', ward: 'General',      status: 'discharged',blood: 'A+',  phone: '88001 11223', admitted: '2026-03-08', doctor: 'Dr. Rohit Singh',    city: 'Nagpur',  insurance: 'United India',color: '#06b6d4' },
];

// ─── DOCTORS ───────────────────────────────────────────────────────
export const DOCTORS = [
  { id: 'D-001', name: 'Dr. Arjun Mehra',   spec: 'Cardiologist',     patients: 12, status: 'available', emoji: '❤️', rating: 4.9, exp: '15 yrs', schedule: 'Mon–Fri', fee: '₹1,500', quals: 'MBBS, MD, DM Cardiology' },
  { id: 'D-002', name: 'Dr. Kavitha Patel', spec: 'Neurologist',      patients: 8,  status: 'busy',      emoji: '🧠', rating: 4.8, exp: '12 yrs', schedule: 'Mon–Sat', fee: '₹1,200', quals: 'MBBS, MD Neurology' },
  { id: 'D-003', name: 'Dr. Rohit Singh',   spec: 'Orthopedist',      patients: 10, status: 'available', emoji: '🦴', rating: 4.7, exp: '10 yrs', schedule: 'Tue–Sun', fee: '₹1,000', quals: 'MBBS, MS Orthopaedics' },
  { id: 'D-004', name: 'Dr. Ananya Rao',    spec: 'Gynaecologist',    patients: 14, status: 'off-duty',  emoji: '👶', rating: 4.9, exp: '18 yrs', schedule: 'Mon–Fri', fee: '₹1,800', quals: 'MBBS, MS OBG, DNB' },
  { id: 'D-005', name: 'Dr. Suresh Iyer',   spec: 'General Surgeon',  patients: 6,  status: 'available', emoji: '⚕️', rating: 4.6, exp: '8 yrs',  schedule: 'Mon–Sat', fee: '₹900',   quals: 'MBBS, MS General Surgery' },
];

// ─── APPOINTMENTS ─────────────────────────────────────────────────
export const APPOINTMENTS = [
  { id: 'APT-001', time: '09:00 AM', patient: 'Aarav Sharma',  doctor: 'Dr. Arjun Mehra',   type: 'Cardiology Review', status: 'scheduled', date: 'Mar 15, 2026', room: 'OPD-3' },
  { id: 'APT-002', time: '09:45 AM', patient: 'Priya Nair',    doctor: 'Dr. Kavitha Patel', type: 'Neuro Consultation',status: 'pending',   date: 'Mar 15, 2026', room: 'OPD-7' },
  { id: 'APT-003', time: '10:30 AM', patient: 'Sunita Verma',  doctor: 'Dr. Ananya Rao',    type: 'Routine Checkup',   status: 'scheduled', date: 'Mar 15, 2026', room: 'OPD-1' },
  { id: 'APT-004', time: '11:15 AM', patient: 'Neha Gupta',    doctor: 'Dr. Ananya Rao',    type: 'Maternity Check',   status: 'scheduled', date: 'Mar 15, 2026', room: 'OPD-2' },
  { id: 'APT-005', time: '12:00 PM', patient: 'Vikram Desai',  doctor: 'Dr. Arjun Mehra',   type: 'Follow-up',         status: 'pending',   date: 'Mar 15, 2026', room: 'OPD-3' },
  { id: 'APT-006', time: '02:00 PM', patient: 'Rajesh Kumar',  doctor: 'Dr. Rohit Singh',   type: 'Ortho Consultation',status: 'scheduled', date: 'Mar 15, 2026', room: 'OPD-5' },
  { id: 'APT-007', time: '03:15 PM', patient: 'Suresh Pillai', doctor: 'Dr. Suresh Iyer',   type: 'General Surgery',   status: 'scheduled', date: 'Mar 15, 2026', room: 'OPD-6' },
];

// ─── BILLING ─────────────────────────────────────────────────────
export const INVOICES = [
  { id: 'INV-2026-001', patient: 'Aarav Sharma',  amount: 12500,  paid: 12500, status: 'paid',    date: 'Mar 10, 2026', services: ['Consultation ₹1,500', 'ECG ₹800', 'CBC ₹600', 'Medicines ₹9,600'], insurance: 'Star Health' },
  { id: 'INV-2026-002', patient: 'Priya Nair',    amount: 45000,  paid: 0,     status: 'unpaid',  date: 'Mar 12, 2026', services: ['MRI Brain ₹18,000', 'Consultation ₹1,200', 'ICU Charges ₹25,800'], insurance: 'HDFC Ergo' },
  { id: 'INV-2026-003', patient: 'Rajesh Kumar',  amount: 28000,  paid: 28000, status: 'paid',    date: 'Mar 01, 2026', services: ['Surgery ₹20,000', 'Anaesthesia ₹5,000', 'Room Charges ₹3,000'], insurance: 'LIC Health' },
  { id: 'INV-2026-004', patient: 'Neha Gupta',    amount: 9500,   paid: 5000,  status: 'pending', date: 'Mar 11, 2026', services: ['Maternity Consult ₹1,500', 'Ultrasound ₹3,000', 'Lab Tests ₹5,000'], insurance: 'Niva Bupa' },
];

// ─── MEDICINES ───────────────────────────────────────────────────
export const MEDICINES = [
  { id: 'MED-001', name: 'Paracetamol 500mg',   category: 'Analgesic',      stock: 450, unit: 'Strips', threshold: 50,  expiry: 'Dec 2026', supplier: 'Sun Pharma',    price: 28 },
  { id: 'MED-002', name: 'Amoxicillin 250mg',   category: 'Antibiotic',     stock: 32,  unit: 'Caps',   threshold: 100, expiry: 'Aug 2026', supplier: 'Cipla',         price: 85 },
  { id: 'MED-003', name: 'Metformin 500mg',     category: 'Antidiabetic',   stock: 280, unit: 'Tabs',   threshold: 50,  expiry: 'Jun 2027', supplier: 'Dr. Reddy\'s',  price: 42 },
  { id: 'MED-004', name: 'Atorvastatin 10mg',   category: 'Statin',         stock: 18,  unit: 'Tabs',   threshold: 60,  expiry: 'Apr 2026', supplier: 'Lupin',         price: 120 },
  { id: 'MED-005', name: 'Cetirizine 10mg',     category: 'Antihistamine',  stock: 190, unit: 'Tabs',   threshold: 40,  expiry: 'Nov 2026', supplier: 'Mankind',       price: 35 },
  { id: 'MED-006', name: 'Pantoprazole 40mg',   category: 'PPI',            stock: 8,   unit: 'Tabs',   threshold: 80,  expiry: 'Jul 2026', supplier: 'Abbott',        price: 95 },
  { id: 'MED-007', name: 'Azithromycin 500mg',  category: 'Antibiotic',     stock: 120, unit: 'Tabs',   threshold: 40,  expiry: 'Oct 2026', supplier: 'Cipla',         price: 180 },
  { id: 'MED-008', name: 'Amlodipine 5mg',      category: 'Antihypertensive',stock: 340, unit: 'Tabs',  threshold: 60,  expiry: 'Jan 2027', supplier: 'Zydus',         price: 55 },
];

// ─── LAB TESTS ────────────────────────────────────────────────────
export const LAB_TESTS = [
  { id: 'LT-001', patient: 'Aarav Sharma',  test: 'Complete Blood Count',       ordered: '08:30 AM', orderedBy: 'Dr. Mehra',   status: 'active',  result: 'Normal',   priority: 'routine' },
  { id: 'LT-002', patient: 'Priya Nair',    test: 'MRI Brain',                  ordered: '09:00 AM', orderedBy: 'Dr. Patel',   status: 'pending', result: '—',         priority: 'urgent' },
  { id: 'LT-003', patient: 'Sunita Verma',  test: 'Lipid Panel',                ordered: '07:45 AM', orderedBy: 'Dr. Rao',     status: 'active',  result: 'Borderline',priority: 'routine' },
  { id: 'LT-004', patient: 'Vikram Desai',  test: 'ECG + Echo',                 ordered: '10:00 AM', orderedBy: 'Dr. Mehra',   status: 'active',  result: 'Abnormal', priority: 'urgent' },
  { id: 'LT-005', patient: 'Rajesh Kumar',  test: 'X-Ray Lumber Spine',         ordered: '11:30 AM', orderedBy: 'Dr. Singh',   status: 'pending', result: '—',         priority: 'routine' },
  { id: 'LT-006', patient: 'Neha Gupta',    test: 'Obstetric Ultrasound',       ordered: '02:00 PM', orderedBy: 'Dr. Rao',     status: 'pending', result: '—',         priority: 'routine' },
];

// ─── STAFF ───────────────────────────────────────────────────────
export const STAFF = [
  { id: 'STF-001', name: 'Ritu Sharma',    role: 'Head Nurse',        dept: 'Cardiology',   shift: 'Morning', status: 'active', phone: '98001 12345', joined: '2019-04-01' },
  { id: 'STF-002', name: 'Mohan Lal',      role: 'Receptionist',      dept: 'Front Desk',   shift: 'Morning', status: 'active', phone: '97001 22334', joined: '2021-06-15' },
  { id: 'STF-003', name: 'Deepa Nair',     role: 'Nurse',             dept: 'ICU',          shift: 'Night',   status: 'active', phone: '96001 33445', joined: '2020-01-10' },
  { id: 'STF-004', name: 'Anil Kumar',     role: 'Lab Technician',    dept: 'Laboratory',   shift: 'Evening', status: 'active', phone: '95001 44556', joined: '2018-09-20' },
  { id: 'STF-005', name: 'Sonal Mehta',    role: 'Nurse',             dept: 'Maternity',    shift: 'Morning', status: 'active', phone: '94001 55667', joined: '2022-03-05' },
  { id: 'STF-006', name: 'Kiran Desai',    role: 'Ward Boy',          dept: 'General',      shift: 'Evening', status: 'active', phone: '93001 66778', joined: '2023-01-18' },
  { id: 'STF-007', name: 'Pooja Singh',    role: 'Pharmacist',        dept: 'Pharmacy',     shift: 'Morning', status: 'active', phone: '92001 77889', joined: '2020-11-30' },
];

// ─── NOTIFICATIONS ───────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: 1, icon: '🚨', color: 'bg-red-500/15 text-red-400',     title: 'Critical Alert',         text: 'Vikram Desai vitals deteriorating — ICU', time: '2 min ago',   unread: true },
  { id: 2, icon: '💊', color: 'bg-amber-500/15 text-amber-400', title: 'Low Stock Warning',      text: 'Amoxicillin 250mg — only 32 units left',  time: '18 min ago',  unread: true },
  { id: 3, icon: '📅', color: 'bg-blue-500/15 text-blue-400',   title: 'Appointment Reminder',   text: 'Dr. Mehra has 3 patients in 30 minutes',  time: '30 min ago',  unread: true },
  { id: 4, icon: '✅', color: 'bg-emerald-500/15 text-emerald-400', title: 'Payment Received', text: 'INV-2026-003 — ₹28,000 settled',          time: '1 hr ago',    unread: false },
  { id: 5, icon: '🧾', color: 'bg-purple-500/15 text-purple-400',  title: 'New Invoice',     text: 'INV-2026-004 generated for Neha Gupta',   time: '2 hrs ago',   unread: false },
];

// ─── REVENUE CHART DATA ───────────────────────────────────────────
export const REVENUE_DATA = [
  { month: 'Oct', revenue: 310000, expenses: 180000, patients: 98 },
  { month: 'Nov', revenue: 285000, expenses: 165000, patients: 88 },
  { month: 'Dec', revenue: 340000, expenses: 200000, patients: 112 },
  { month: 'Jan', revenue: 298000, expenses: 172000, patients: 95 },
  { month: 'Feb', revenue: 375000, expenses: 210000, patients: 124 },
  { month: 'Mar', revenue: 421000, expenses: 225000, patients: 138 },
];

// ─── MEDICAL HISTORY ─────────────────────────────────────────────
export const MEDICAL_HISTORY = [
  { date: 'Mar 10, 2026', title: 'Admitted – Cardiology',    desc: 'Chest pain, ECG abnormality. Started on aspirin and beta-blockers.',       type: 'admission',   color: '#ef4444' },
  { date: 'Feb 14, 2026', title: 'Outpatient Consultation',  desc: 'Routine follow-up post-hypertension diagnosis. BP: 145/90.',               type: 'opd',         color: '#3b82f6' },
  { date: 'Jan 05, 2026', title: 'Lab Tests',                desc: 'Lipid panel, HbA1c, CBC. All within normal range except LDL slightly high.',type: 'lab',         color: '#18ae94' },
  { date: 'Nov 20, 2025', title: 'Prescription Update',      desc: 'Atorvastatin 10mg added. Counselled on diet and exercise.',               type: 'prescription',color: '#a855f7' },
];

// ─── WARD OCCUPANCY ───────────────────────────────────────────────
export const WARD_DATA = [
  { name: 'Cardiology',  occupied: 18, total: 24, color: '#ef4444' },
  { name: 'Neurology',   occupied: 10, total: 16, color: '#a855f7' },
  { name: 'ICU',         occupied: 9,  total: 10, color: '#f59e0b' },
  { name: 'Orthopedics', occupied: 12, total: 20, color: '#3b82f6' },
  { name: 'Maternity',   occupied: 8,  total: 14, color: '#ec4899' },
  { name: 'General',     occupied: 25, total: 40, color: '#18ae94' },
];
