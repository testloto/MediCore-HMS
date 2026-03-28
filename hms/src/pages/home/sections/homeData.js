// All static data for homepage sections — shared, imported once
export const STATS = [
  { value:'250+', label:'Beds',             icon:'🛏' },
  { value:'40+',  label:'Specialists',       icon:'🩺' },
  { value:'1,200+',label:'Patients/Month',  icon:'👥' },
  { value:'24/7', label:'Emergency Care',    icon:'🚑' },
];

export const DEPARTMENTS = [
  { name:'Cardiology',     icon:'❤️', desc:'Advanced cardiac care, ECG, angiography & surgical interventions.', color:'#ef4444' },
  { name:'Neurology',      icon:'🧠', desc:'Brain & spine disorders, MRI, EEG and neuro-rehab programs.',       color:'#8b5cf6' },
  { name:'Orthopaedics',   icon:'🦴', desc:'Bone, joint & muscle care, arthroscopy and joint replacements.',    color:'#3b82f6' },
  { name:'Gynaecology',    icon:'👶', desc:"Women's health, maternity, NICU and fertility services.",           color:'#ec4899' },
  { name:'Laboratory',     icon:'🔬', desc:'CBC, MRI, CT scans, pathology and diagnostic imaging.',             color:'#18ae94' },
  { name:'Emergency',      icon:'🚑', desc:'24/7 trauma care, ICU, ventilator support and rapid response.',     color:'#f59e0b' },
  { name:'Pharmacy',       icon:'💊', desc:'In-house pharmacy with 1000+ medicines and home delivery.',         color:'#06b6d4' },
  { name:'General Surgery',icon:'⚕️', desc:'Laparoscopic, robotic and open surgical procedures.',               color:'#10b981' },
];

export const DOCTORS_HIGHLIGHT = [
  { name:'Dr. Arjun Mehra',   spec:'Cardiologist',   exp:'15 yrs', rating:4.9, emoji:'❤️', color:'#ef4444' },
  { name:'Dr. Kavitha Patel', spec:'Neurologist',    exp:'12 yrs', rating:4.8, emoji:'🧠', color:'#8b5cf6' },
  { name:'Dr. Ananya Rao',    spec:'Gynaecologist',  exp:'18 yrs', rating:4.9, emoji:'👶', color:'#ec4899' },
  { name:'Dr. Rohit Singh',   spec:'Orthopaedist',   exp:'10 yrs', rating:4.7, emoji:'🦴', color:'#3b82f6' },
];

export const TESTIMONIALS = [
  { name:'Ramesh Iyer',    city:'Mumbai', initials:'RI', rating:5, text:'The cardiology team saved my life. Dr. Mehra and his team are exceptional — fast, precise, and compassionate.' },
  { name:'Sunita Bose',    city:'Pune',   initials:'SB', rating:5, text:'Best maternity experience I could have hoped for. The nurses were so caring and the facility is spotless.' },
  { name:'Vikram Agarwal', city:'Delhi',  initials:'VA', rating:5, text:'Very professional staff. Lab results came within hours and the online billing was smooth and transparent.' },
];

export const ANNOUNCEMENTS = [
  { type:'new',   text:'New Robotic Surgery unit inaugurated — Block C, Floor 3' },
  { type:'event', text:'Free cardiac screening camp — Every Sunday 9AM–1PM' },
  { type:'info',  text:'OPD hours extended to 8PM on weekdays' },
  { type:'new',   text:'Telemedicine consultations now available online' },
];

export const WHY_US = [
  { icon:'🏆', title:'Award-Winning Care',     desc:'Ranked #1 multi-speciality hospital in Western India — Times Health 2025' },
  { icon:'🔬', title:'Latest Technology',       desc:'3T MRI, robotic surgery, AI-assisted diagnostics and digital health records' },
  { icon:'💚', title:'Patient-First Approach',  desc:'98.7% patient satisfaction score — because every life matters to us' },
  { icon:'🌐', title:'Global Standards',        desc:'JCI, NABH accredited — care quality matching international benchmarks' },
];

export const FOOTER_COLS = [
  { title:'Departments', links:['Cardiology','Neurology','Orthopaedics','Gynaecology','Surgery'] },
  { title:'Services',    links:['OPD Consultations','Emergency Care','Laboratory','Pharmacy','Telemedicine'] },
  { title:'Quick Links', links:['About Us','Our Doctors','Book Appointment','Patient Portal','Careers'] },
];
