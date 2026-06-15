import { useState, useEffect, useRef } from "react";

// ── GRADES (PreK–2nd removed) ─────────────────────────────────────────────────
const GRADES = ["3rd Grade","4th Grade","5th Grade","6th Grade","7th Grade","8th Grade","9th Grade","10th Grade","11th Grade","12th Grade","Other"];

// age band helper
function ageBand(grade) {
  if (["3rd Grade","4th Grade","5th Grade","6th Grade"].includes(grade)) return "elementary";
  if (["7th Grade","8th Grade"].includes(grade)) return "middle";
  return "high"; // 9–12 + Other
}

// ── CAREER GROUPS ─────────────────────────────────────────────────────────────
const CAREER_GROUPS = ["Healthcare & Human Services","Science & Research","Engineering & Technology","Business & Entrepreneurship","Arts, Media & Design","Public Service & Law","Skilled Trades & Technical Careers","Agriculture, Environment & Natural Resources"];

// ── CATEGORY META ─────────────────────────────────────────────────────────────
const CATEGORY_META = {
  purpose:         { label:"Purpose",          color:"#e57373" },
  workEnvironment: { label:"Work Environment", color:"#66bb6a" },
  workStyle:       { label:"Work Style",       color:"#ab47bc" },
  lifestyle:       { label:"Lifestyle",        color:"#ffc107" },
};

// ── CARDS (by band) ───────────────────────────────────────────────────────────
const CARDS_HIGH = {
  purpose: [
    { id:"Help People",         desc:"I like to improve people's lives by helping them learn, heal, grow, or overcome challenges." },
    { id:"Create Things",       desc:"I like to bring new ideas, products, art, or experiences into the world." },
    { id:"Solve Problems",      desc:"I like to tackle challenges and find practical solutions that make things work better." },
    { id:"Discover Knowledge",  desc:"I like to explore questions, uncover new information, and better understand how things work." },
    { id:"Protect & Serve",     desc:"I like to keep people, information, or communities safe and secure." },
    { id:"Lead & Influence",    desc:"I like to guide others, make decisions, and inspire positive change." },
    { id:"Care for the Planet", desc:"I like to protect natural resources and help create a healthier environment." },
    { id:"Build Communities",   desc:"I like to improve places and systems so people can live, work, and thrive together." },
  ],
  workEnvironment: [
    { id:"Office",               desc:"I like working in professional spaces where I can focus, collaborate, and use technology." },
    { id:"Outdoors",             desc:"I like being outside and working in changing environments rather than staying indoors all day." },
    { id:"Lab",                  desc:"I like working with equipment, experiments, data, or technical tools to investigate ideas." },
    { id:"Service Setting",      desc:"I like working directly with people in places where support, care, or assistance is provided." },
    { id:"Learning Environment", desc:"I like being in places where people learn, teach, and develop new skills." },
    { id:"Workshop",             desc:"I like working with tools, machines, materials, or hands-on projects." },
    { id:"Creative Studio",      desc:"I like working in spaces where creativity, design, and self-expression are important." },
    { id:"Flexible Workplace",   desc:"I like having variety in where I work, whether that's traveling, working remotely, or changing locations." },
  ],
  workStyle: [
    { id:"Lead & Organize",        desc:"I like setting goals, making decisions, and helping groups work together effectively." },
    { id:"Work with People",       desc:"I like interacting with others, building relationships, and collaborating as part of a team." },
    { id:"Analyze & Investigate",  desc:"I like gathering information, spotting patterns, and solving complex questions." },
    { id:"Create & Design",        desc:"I like imagining new ideas and turning them into something useful, beautiful, or meaningful." },
    { id:"Build & Fix",            desc:"I like making things, improving systems, and solving hands-on problems." },
    { id:"Teach & Guide",          desc:"I like helping others learn, develop skills, and achieve their goals." },
    { id:"Persuade & Communicate", desc:"I like sharing ideas, influencing decisions, and helping others understand my point of view." },
    { id:"Plan & Coordinate",      desc:"I like organizing details, managing resources, and making sure projects run smoothly." },
  ],
  lifestyle: [
    { id:"High Income",         desc:"I want a career that offers strong earning potential and financial opportunities." },
    { id:"Work-Life Balance",   desc:"I want time and energy for my interests, family, and life outside of work." },
    { id:"Flexible Schedule",   desc:"I want control over when, where, or how I work." },
    { id:"Job Security",        desc:"I want a career with steady opportunities and long-term stability." },
    { id:"Continuous Learning", desc:"I want a career where I can keep learning and growing throughout my life." },
    { id:"Creative Freedom",    desc:"I want the freedom to express my ideas and approach problems in my own way." },
    { id:"Travel & Adventure",  desc:"I want opportunities to explore new places, experiences, or environments." },
    { id:"Making a Difference", desc:"I want my work to have a positive impact on people, communities, or the world." },
  ],
};

const CARDS_ELEMENTARY = {
  purpose: [
    { id:"Help People",         desc:"I like helping people learn, feel better, grow, and solve problems." },
    { id:"Create Things",       desc:"I like bringing new ideas, products, art, or experiences into the world." },
    { id:"Solve Problems",      desc:"I like solving problems and finding ways to make things work better." },
    { id:"Discover Knowledge",  desc:"I like asking questions, learning new things, and finding out how things work." },
    { id:"Protect & Serve",     desc:"I like helping keep people and communities safe." },
    { id:"Lead & Influence",    desc:"I like leading groups, making decisions, and helping others do their best." },
    { id:"Care for the Planet", desc:"I like protecting nature and helping keep the Earth healthy." },
    { id:"Build Communities",   desc:"I like making places better so people can work and live together." },
  ],
  workEnvironment: [
    { id:"Office",               desc:"I like working in an office where I can use computers and work with other people." },
    { id:"Outdoors",             desc:"I like being outside and working in different places instead of staying indoors all day." },
    { id:"Lab",                  desc:"I like doing experiments and using tools to learn how things work." },
    { id:"Service Setting",      desc:"I like helping people in places such as hospitals, stores, or community centers." },
    { id:"Learning Environment", desc:"I like being in places where people learn and teach new skills." },
    { id:"Workshop",             desc:"I like building and fixing things with tools and materials." },
    { id:"Creative Studio",      desc:"I like places where I can create art, design things, and share my ideas." },
    { id:"Flexible Workplace",   desc:"I like working in different places instead of staying in the same place every day." },
  ],
  workStyle: [
    { id:"Lead & Organize",        desc:"I like leading groups, making plans, and helping people work together." },
    { id:"Work with People",       desc:"I like talking with people, building friendships, and working as part of a team." },
    { id:"Analyze & Investigate",  desc:"I like finding information, noticing patterns, and solving puzzles." },
    { id:"Create & Design",        desc:"I like imagining new ideas and turning them into something useful, beautiful, or meaningful." },
    { id:"Build & Fix",            desc:"I like building things, fixing problems, and working with my hands." },
    { id:"Teach & Guide",          desc:"I like helping others learn new skills and reach their goals." },
    { id:"Persuade & Communicate", desc:"I like sharing ideas and helping others understand what I think." },
    { id:"Plan & Coordinate",      desc:"I like organizing things and helping projects stay on track." },
  ],
  lifestyle: [
    { id:"High Income",         desc:"I want a job where I can earn a lot of money." },
    { id:"Work-Life Balance",   desc:"I want time for my family, hobbies, and other things I enjoy." },
    { id:"Flexible Schedule",   desc:"I want choices about when and where I work." },
    { id:"Job Security",        desc:"I want a job that will be available for a long time." },
    { id:"Continuous Learning", desc:"I want a job where I can keep learning new things." },
    { id:"Creative Freedom",    desc:"I want to use my own ideas and be creative." },
    { id:"Travel & Adventure",  desc:"I want opportunities to explore new places and have exciting experiences." },
    { id:"Making a Difference", desc:"I want my work to help people and make the world better." },
  ],
};

// middle uses same cards as high
// const CARDS_MIDDLE = CARDS_HIGH;

function getCards(band) {
  if (band==="elementary") return CARDS_ELEMENTARY;
  return CARDS_HIGH; // middle & high
}

// ── PAGE QUESTIONS (by band) ──────────────────────────────────────────────────
const PAGE_QUESTIONS = {
  high: {
    purpose:        "What impact do you want to have on the world?",
    workEnvironment:"Where do you want to spend most of your working time?",
    workStyle:      "How do you prefer to work?",
    lifestyle:      "What matters most to you in a career?",
  },
  middle: {
    purpose:        "What impact do you want to have on the world?",
    workEnvironment:"Where do you want to spend most of your working time?",
    workStyle:      "How do you prefer to work?",
    lifestyle:      "What matters most to you in a career?",
  },
  elementary: {
    purpose:        "What Difference Do You Want to Make in the World?",
    workEnvironment:"Where Do You Like to Work?",
    workStyle:      "How Do You Like to Work?",
    lifestyle:      "What Is Important to You?",
  },
};

// ── CARD → CAREER MAP ─────────────────────────────────────────────────────────
const CARD_MAP = {
  purpose: {
    "Help People":         ["Healthcare & Human Services","Public Service & Law"],
    "Create Things":       ["Arts, Media & Design","Engineering & Technology"],
    "Solve Problems":      ["Engineering & Technology","Science & Research","Business & Entrepreneurship"],
    "Discover Knowledge":  ["Science & Research"],
    "Protect & Serve":     ["Public Service & Law","Healthcare & Human Services"],
    "Lead & Influence":    ["Business & Entrepreneurship","Public Service & Law"],
    "Care for the Planet": ["Agriculture, Environment & Natural Resources","Science & Research"],
    "Build Communities":   ["Public Service & Law","Business & Entrepreneurship","Healthcare & Human Services"],
  },
  workEnvironment: {
    "Office":               ["Business & Entrepreneurship","Engineering & Technology"],
    "Outdoors":             ["Agriculture, Environment & Natural Resources","Skilled Trades & Technical Careers"],
    "Lab":                  ["Science & Research","Healthcare & Human Services","Engineering & Technology"],
    "Service Setting":      ["Healthcare & Human Services","Public Service & Law"],
    "Learning Environment": ["Healthcare & Human Services"],
    "Workshop":             ["Skilled Trades & Technical Careers","Engineering & Technology"],
    "Creative Studio":      ["Arts, Media & Design"],
    "Flexible Workplace":   ["Business & Entrepreneurship","Public Service & Law","Agriculture, Environment & Natural Resources"],
  },
  workStyle: {
    "Lead & Organize":        ["Business & Entrepreneurship","Public Service & Law"],
    "Work with People":       ["Healthcare & Human Services","Business & Entrepreneurship"],
    "Analyze & Investigate":  ["Science & Research","Engineering & Technology"],
    "Create & Design":        ["Arts, Media & Design","Engineering & Technology"],
    "Build & Fix":            ["Skilled Trades & Technical Careers","Engineering & Technology"],
    "Teach & Guide":          ["Healthcare & Human Services"],
    "Persuade & Communicate": ["Business & Entrepreneurship","Public Service & Law","Arts, Media & Design"],
    "Plan & Coordinate":      ["Business & Entrepreneurship","Engineering & Technology","Public Service & Law"],
  },
  lifestyle: {
    "High Income":         ["Business & Entrepreneurship","Healthcare & Human Services","Engineering & Technology"],
    "Work-Life Balance":   ["Healthcare & Human Services","Science & Research","Agriculture, Environment & Natural Resources"],
    "Flexible Schedule":   ["Business & Entrepreneurship","Arts, Media & Design"],
    "Job Security":        ["Skilled Trades & Technical Careers","Healthcare & Human Services","Public Service & Law"],
    "Continuous Learning": ["Science & Research","Healthcare & Human Services","Engineering & Technology"],
    "Creative Freedom":    ["Arts, Media & Design","Business & Entrepreneurship"],
    "Travel & Adventure":  ["Agriculture, Environment & Natural Resources","Public Service & Law","Business & Entrepreneurship"],
    "Making a Difference": ["Healthcare & Human Services","Public Service & Law","Agriculture, Environment & Natural Resources"],
  },
};

// ── SUBJECTS (by band) ────────────────────────────────────────────────────────
const SUBJECT_GROUPS_HIGH = [
  { group:"Science & Health",             subjects:["Biology","Chemistry","Physics","Earth Science","Environmental Science","Anatomy & Physiology","Psychology","Health Science"] },
  { group:"Mathematics & Data",           subjects:["Algebra & Advanced Mathematics","Statistics"] },
  { group:"Technology & Engineering",     subjects:["Computer Science","Cybersecurity","Engineering","Robotics"] },
  { group:"Agriculture & Environment",    subjects:["Agriculture","Animal Science","Horticulture","Natural Resources"] },
  { group:"Trades & Technical Education", subjects:["Construction","Automotive Technology","Welding","Manufacturing","HVAC / Electrical Technology"] },
  { group:"Business & Entrepreneurship",  subjects:["Business","Marketing","Accounting","Entrepreneurship"] },
  { group:"Social Studies & Society",     subjects:["Sociology","U.S. History","World History","Government & Civics","Economics"] },
  { group:"Language Arts & Communication",subjects:["English","Journalism","Public Speaking / Debate"] },
  { group:"Arts, Media & Design",         subjects:["Graphic Design","Visual Arts","Music","Theater","Film & Media Production"] },
  { group:"Education & Human Services",   subjects:["Education & Training"] },
];

const SUBJECT_GROUPS_MIDDLE = [
  { group:"Science & Health",             subjects:["Life Science","Physical Science","Earth & Environmental Science","Health"] },
  { group:"Mathematics & Data",           subjects:["Mathematics"] },
  { group:"Technology & Engineering",     subjects:["Computer Science","Engineering & Robotics"] },
  { group:"Agriculture & Environment",    subjects:["Agriculture","Animals & Nature"] },
  { group:"Trades & Technical Education", subjects:["Building & Construction","Technology & Manufacturing"] },
  { group:"Business & Entrepreneurship",  subjects:["Business & Entrepreneurship"] },
  { group:"Social Studies & Society",     subjects:["Social Studies"] },
  { group:"Language Arts & Communication",subjects:["English Language Arts","Journalism & Media","Public Speaking & Debate"] },
  { group:"Arts, Media & Design",         subjects:["Art & Design","Music","Theater & Film"] },
  { group:"Education & Human Services",   subjects:["Teaching & Helping Others"] },
];

const SUBJECT_GROUPS_ELEMENTARY = [
  { group:"Science & Nature",          subjects:["Science","Nature & Animals","Health"] },
  { group:"Math & Problem Solving",    subjects:["Math"] },
  { group:"Technology & Building",     subjects:["Technology & Computers","Building & Making Things"] },
  { group:"People & Communities",      subjects:["Social Studies","Helping People"] },
  { group:"Reading & Communication",   subjects:["Reading & Writing","Speaking & Sharing Ideas"] },
  { group:"Arts & Creativity",         subjects:["Art","Music","Theater, Movies & Media"] },
  { group:"Business & Leadership",     subjects:["Business & Leadership"] },
];

function getSubjectGroups(band) {
  if (band==="elementary") return SUBJECT_GROUPS_ELEMENTARY;
  if (band==="middle")     return SUBJECT_GROUPS_MIDDLE;
  return SUBJECT_GROUPS_HIGH;
}

// ── SUBJECT → CAREER MAP (all bands) ─────────────────────────────────────────
const SUBJECT_MAP = {
  // HIGH
  "Biology":                       ["Healthcare & Human Services","Science & Research","Agriculture, Environment & Natural Resources"],
  "Chemistry":                     ["Science & Research","Engineering & Technology","Healthcare & Human Services"],
  "Physics":                       ["Science & Research","Engineering & Technology"],
  "Earth Science":                 ["Science & Research","Agriculture, Environment & Natural Resources","Engineering & Technology"],
  "Environmental Science":         ["Science & Research","Agriculture, Environment & Natural Resources"],
  "Anatomy & Physiology":          ["Healthcare & Human Services","Science & Research"],
  "Psychology":                    ["Healthcare & Human Services","Science & Research"],
  "Health Science":                ["Healthcare & Human Services","Science & Research"],
  "Algebra & Advanced Mathematics":["Science & Research","Engineering & Technology","Business & Entrepreneurship"],
  "Statistics":                    ["Science & Research","Business & Entrepreneurship","Healthcare & Human Services"],
  "Computer Science":              ["Engineering & Technology","Business & Entrepreneurship"],
  "Cybersecurity":                 ["Engineering & Technology","Public Service & Law"],
  "Engineering":                   ["Engineering & Technology","Skilled Trades & Technical Careers"],
  "Robotics":                      ["Engineering & Technology","Skilled Trades & Technical Careers"],
  "Agriculture":                   ["Agriculture, Environment & Natural Resources","Skilled Trades & Technical Careers"],
  "Animal Science":                ["Agriculture, Environment & Natural Resources","Healthcare & Human Services"],
  "Horticulture":                  ["Agriculture, Environment & Natural Resources"],
  "Natural Resources":             ["Agriculture, Environment & Natural Resources","Science & Research"],
  "Construction":                  ["Skilled Trades & Technical Careers","Engineering & Technology"],
  "Automotive Technology":         ["Skilled Trades & Technical Careers"],
  "Welding":                       ["Skilled Trades & Technical Careers"],
  "Manufacturing":                 ["Skilled Trades & Technical Careers","Engineering & Technology"],
  "HVAC / Electrical Technology":  ["Skilled Trades & Technical Careers","Engineering & Technology"],
  "Business":                      ["Business & Entrepreneurship"],
  "Marketing":                     ["Business & Entrepreneurship","Arts, Media & Design"],
  "Accounting":                    ["Business & Entrepreneurship"],
  "Entrepreneurship":              ["Business & Entrepreneurship"],
  "Sociology":                     ["Healthcare & Human Services","Public Service & Law","Science & Research"],
  "U.S. History":                  ["Public Service & Law","Science & Research"],
  "World History":                 ["Public Service & Law","Science & Research"],
  "Government & Civics":           ["Public Service & Law","Business & Entrepreneurship"],
  "Economics":                     ["Business & Entrepreneurship","Science & Research"],
  "English":                       ["Arts, Media & Design","Business & Entrepreneurship"],
  "Journalism":                    ["Arts, Media & Design","Public Service & Law"],
  "Public Speaking / Debate":      ["Business & Entrepreneurship","Public Service & Law","Arts, Media & Design"],
  "Graphic Design":                ["Arts, Media & Design","Engineering & Technology"],
  "Visual Arts":                   ["Arts, Media & Design"],
  "Music":                         ["Arts, Media & Design"],
  "Theater":                       ["Arts, Media & Design"],
  "Film & Media Production":       ["Arts, Media & Design","Business & Entrepreneurship"],
  "Education & Training":          ["Healthcare & Human Services","Public Service & Law"],
  // MIDDLE
  "Life Science":                  ["Healthcare & Human Services","Science & Research","Agriculture, Environment & Natural Resources"],
  "Physical Science":              ["Science & Research","Engineering & Technology"],
  "Earth & Environmental Science": ["Science & Research","Agriculture, Environment & Natural Resources","Engineering & Technology"],
  "Health":                        ["Healthcare & Human Services","Science & Research"],
  "Mathematics":                   ["Engineering & Technology","Science & Research","Business & Entrepreneurship"],
  "Engineering & Robotics":        ["Engineering & Technology","Skilled Trades & Technical Careers"],
  "Animals & Nature":              ["Agriculture, Environment & Natural Resources","Healthcare & Human Services","Science & Research"],
  "Building & Construction":       ["Skilled Trades & Technical Careers","Engineering & Technology"],
  "Technology & Manufacturing":    ["Skilled Trades & Technical Careers","Engineering & Technology"],
  "Business & Entrepreneurship":   ["Business & Entrepreneurship"],
  "Social Studies":                ["Public Service & Law","Business & Entrepreneurship","Healthcare & Human Services"],
  "English Language Arts":         ["Arts, Media & Design","Public Service & Law","Healthcare & Human Services"],
  "Journalism & Media":            ["Arts, Media & Design","Public Service & Law"],
  "Public Speaking & Debate":      ["Public Service & Law","Business & Entrepreneurship"],
  "Art & Design":                  ["Arts, Media & Design"],
  "Theater & Film":                ["Arts, Media & Design"],
  "Teaching & Helping Others":     ["Healthcare & Human Services"],
  // ELEMENTARY
  "Science":                       ["Science & Research","Healthcare & Human Services","Engineering & Technology","Agriculture, Environment & Natural Resources"],
  "Nature & Animals":              ["Agriculture, Environment & Natural Resources","Science & Research","Healthcare & Human Services"],
  "Math":                          ["Engineering & Technology","Science & Research","Business & Entrepreneurship"],
  "Technology & Computers":        ["Engineering & Technology","Science & Research","Business & Entrepreneurship"],
  "Building & Making Things":      ["Engineering & Technology","Skilled Trades & Technical Careers"],
  "Helping People":                ["Healthcare & Human Services","Public Service & Law"],
  "Reading & Writing":             ["Arts, Media & Design","Public Service & Law","Healthcare & Human Services","Business & Entrepreneurship"],
  "Speaking & Sharing Ideas":      ["Public Service & Law","Business & Entrepreneurship","Arts, Media & Design"],
  "Art":                           ["Arts, Media & Design"],
  "Theater, Movies & Media":       ["Arts, Media & Design"],
  "Business & Leadership":         ["Business & Entrepreneurship","Public Service & Law"],
};

// ── CAREER DATA (by band) ─────────────────────────────────────────────────────
const CAREER_DATA_BASE = {
  "Healthcare & Human Services":                  { icon:"🩺", desc:"Careers in this group focus on helping people improve their health, learning, well-being, or quality of life." },
  "Science & Research":                           { icon:"🔬", desc:"Careers in this group focus on discovering new knowledge, conducting investigations, and solving questions about the natural, social, or technological world." },
  "Engineering & Technology":                     { icon:"⚙️", desc:"Careers in this group focus on designing, building, improving, and maintaining systems, technologies, and solutions to complex problems." },
  "Business & Entrepreneurship":                  { icon:"💼", desc:"Careers in this group focus on leading organizations, managing resources, creating value, and driving economic growth." },
  "Arts, Media & Design":                         { icon:"🎨", desc:"Careers in this group focus on creating, communicating, and expressing ideas through visual, written, digital, or performing arts." },
  "Public Service & Law":                         { icon:"⚖️", desc:"Careers in this group focus on protecting communities, serving the public, upholding laws, and leading civic institutions." },
  "Skilled Trades & Technical Careers":           { icon:"🔧", desc:"Careers in this group focus on building, repairing, installing, operating, and maintaining physical systems, equipment, and infrastructure." },
  "Agriculture, Environment & Natural Resources": { icon:"🌿", desc:"Careers in this group focus on managing natural resources, producing food, protecting ecosystems, and working with living systems." },
};

const CAREERS_BY_BAND = {
  high: {
    "Healthcare & Human Services":                  ["Doctor","Nurse","Dentist","Pharmacist","Physical Therapist","Occupational Therapist","Speech-Language Pathologist","Psychologist","Counselor","Social Worker","Teacher","School Counselor","School Administrator","Special Education Teacher","Child Life Specialist","Dietitian","Public Health Educator","Veterinarian"],
    "Science & Research":                           ["Biologist","Chemist","Physicist","Astronomer","Environmental Scientist","Geologist","Medical Researcher","Data Scientist","Statistician","Economist","Political Scientist","Archaeologist","Historian","Anthropologist","Laboratory Scientist","Epidemiologist","Neuroscientist","Marine Scientist"],
    "Engineering & Technology":                     ["Mechanical Engineer","Civil Engineer","Electrical Engineer","Aerospace Engineer","Chemical Engineer","Biomedical Engineer","Software Developer","Computer Programmer","Cybersecurity Analyst","Data Engineer","AI Engineer","Robotics Engineer","Network Engineer","Systems Analyst","IT Specialist","Web Developer","UX Designer"],
    "Business & Entrepreneurship":                  ["Entrepreneur","Business Owner","Marketing Manager","Financial Analyst","Accountant","Investment Banker","Human Resources Manager","Operations Manager","Project Manager","Sales Manager","Real Estate Agent","Business Consultant","Supply Chain Manager","Retail Manager","Product Manager","Financial Planner"],
    "Arts, Media & Design":                         ["Graphic Designer","Animator","Filmmaker","Photographer","Musician","Actor","Writer","Journalist","Editor","Architect","Interior Designer","Fashion Designer","Game Designer","UX/UI Designer","Illustrator","Art Director","Content Creator","Social Media Manager"],
    "Public Service & Law":                         ["Lawyer","Judge","Police Officer","Detective","Firefighter","EMT","Paramedic","Military Officer","Intelligence Analyst","Public Administrator","Diplomat","Politician","Emergency Management Specialist","Corrections Officer","Park Police Officer","Homeland Security Specialist"],
    "Skilled Trades & Technical Careers":           ["Electrician","Plumber","Carpenter","Welder","HVAC Technician","Automotive Technician","Diesel Mechanic","Aircraft Mechanic","Machinist","Construction Manager","Heavy Equipment Operator","Industrial Maintenance Technician","Solar Installer","Wind Turbine Technician","Elevator Technician"],
    "Agriculture, Environment & Natural Resources": ["Farmer","Rancher","Forester","Wildlife Biologist","Conservation Officer","Park Ranger","Fisheries Scientist","Horticulturist","Agronomist","Environmental Consultant","Soil Scientist","Marine Biologist","Urban Forester","Sustainability Specialist","Agricultural Engineer","Landscape Architect","Natural Resource Manager"],
  },
  middle: {
    "Healthcare & Human Services":                  ["Doctor","Nurse","Dentist","Pharmacist","Physical Therapist","Psychologist","Counselor","Social Worker","Teacher","School Counselor","Special Education Teacher","Veterinarian"],
    "Science & Research":                           ["Biologist","Chemist","Physicist","Astronomer","Environmental Scientist","Geologist","Medical Researcher","Data Scientist","Archaeologist","Historian","Marine Scientist"],
    "Engineering & Technology":                     ["Mechanical Engineer","Civil Engineer","Electrical Engineer","Aerospace Engineer","Biomedical Engineer","Software Developer","Cybersecurity Analyst","AI Engineer","Robotics Engineer","IT Specialist","Web Developer"],
    "Business & Entrepreneurship":                  ["Entrepreneur","Business Owner","Marketing Manager","Accountant","Human Resources Manager","Project Manager","Sales Manager","Real Estate Agent","Business Consultant","Financial Planner"],
    "Arts, Media & Design":                         ["Graphic Designer","Animator","Filmmaker","Photographer","Musician","Actor","Writer","Journalist","Architect","Fashion Designer","Game Designer","Illustrator","Content Creator"],
    "Public Service & Law":                         ["Lawyer","Judge","Police Officer","Detective","Firefighter","EMT","Paramedic","Military Officer","Diplomat","Politician","Park Police Officer"],
    "Skilled Trades & Technical Careers":           ["Electrician","Plumber","Carpenter","Welder","HVAC Technician","Automotive Technician","Aircraft Mechanic","Construction Manager","Heavy Equipment Operator","Solar Installer","Wind Turbine Technician"],
    "Agriculture, Environment & Natural Resources": ["Farmer","Forester","Wildlife Biologist","Conservation Officer","Park Ranger","Fisheries Scientist","Horticulturist","Environmental Consultant","Marine Biologist","Sustainability Specialist","Agricultural Engineer","Landscape Architect"],
  },
  elementary: {
    "Healthcare & Human Services":                  ["Doctor","Nurse","Dentist","Psychologist","Teacher","School Counselor","Veterinarian"],
    "Science & Research":                           ["Biologist","Chemist","Astronomer","Environmental Scientist","Archaeologist","Marine Scientist"],
    "Engineering & Technology":                     ["Mechanical Engineer","Civil Engineer","Aerospace Engineer","Software Developer","Robotics Engineer","Web Developer"],
    "Business & Entrepreneurship":                  ["Entrepreneur","Business Owner","Marketing Manager","Accountant","Real Estate Agent"],
    "Arts, Media & Design":                         ["Graphic Designer","Animator","Filmmaker","Photographer","Musician","Actor","Writer","Game Designer"],
    "Public Service & Law":                         ["Police Officer","Firefighter","Lawyer","Judge","Detective"],
    "Skilled Trades & Technical Careers":           ["Electrician","Plumber","Carpenter","Welder","Automotive Technician"],
    "Agriculture, Environment & Natural Resources": ["Farmer","Wildlife Biologist","Conservation Officer","Park Ranger","Horticulturist","Marine Biologist"],
  },
};

function getCareerData(band) {
  return Object.fromEntries(
    CAREER_GROUPS.map(g => [g, { ...CAREER_DATA_BASE[g], careers: CAREERS_BY_BAND[band][g] }])
  );
}

// ── CAREER DESCRIPTIONS ───────────────────────────────────────────────────────
const CAREER_DESCS = {
  "Doctor":"Doctors find out what is making people sick or injured and help them get better.",
  "Nurse":"Nurses care for patients, give treatments, and help people understand their health.",
  "Dentist":"Dentists care for people's teeth, gums, and mouths.",
  "Pharmacist":"Pharmacists prepare medicines and explain how people should use them safely.",
  "Physical Therapist":"Physical therapists help people rebuild strength, movement, and balance after injuries or illness.",
  "Occupational Therapist":"Occupational therapists help people build skills for daily life, school, work, or independence.",
  "Speech-Language Pathologist":"Speech-language pathologists help people improve speech, language, communication, and swallowing skills.",
  "Psychologist":"Psychologists study thoughts, feelings, and behavior to help people understand and manage challenges.",
  "Counselor":"Counselors help people talk through problems, make decisions, and handle emotions.",
  "Social Worker":"Social workers connect people and families with support, resources, and services they need.",
  "Teacher":"Teachers help students learn new knowledge, skills, and ways of thinking.",
  "School Counselor":"School counselors support students with learning, emotions, friendships, and future planning.",
  "School Administrator":"School administrators lead schools and help teachers, students, and families succeed.",
  "Special Education Teacher":"Special education teachers help students with different learning needs reach their goals.",
  "Child Life Specialist":"Child life specialists help children and families cope with illness, hospitals, and medical care.",
  "Dietitian":"Dietitians help people choose foods that support their health and nutrition needs.",
  "Public Health Educator":"Public health educators teach communities how to stay healthy and prevent illness.",
  "Veterinarian":"Veterinarians care for animals' health and treat injuries and illnesses.",
  "Biologist":"Biologists study living things, including plants, animals, cells, and ecosystems.",
  "Chemist":"Chemists study materials and how substances change, mix, and react.",
  "Physicist":"Physicists study forces, energy, matter, and how the universe works.",
  "Astronomer":"Astronomers study stars, planets, galaxies, and space.",
  "Environmental Scientist":"Environmental scientists study the environment and help solve problems like pollution and habitat loss.",
  "Geologist":"Geologists study rocks, minerals, landforms, and Earth's history.",
  "Medical Researcher":"Medical researchers study diseases, treatments, and ways to improve human health.",
  "Data Scientist":"Data scientists use information and patterns to answer questions and solve problems.",
  "Statistician":"Statisticians collect and analyze data to help people make smart decisions.",
  "Economist":"Economists study how people, businesses, and governments use money and resources.",
  "Political Scientist":"Political scientists study governments, laws, elections, and how people make decisions in society.",
  "Archaeologist":"Archaeologists study objects and places from the past to learn how people used to live.",
  "Historian":"Historians study past events, people, and cultures to better understand the world today.",
  "Anthropologist":"Anthropologists study human cultures, communities, and how people live.",
  "Laboratory Scientist":"Laboratory scientists test samples and study results to help answer scientific or medical questions.",
  "Epidemiologist":"Epidemiologists study how diseases spread and how communities can prevent them.",
  "Neuroscientist":"Neuroscientists study the brain, nerves, and how they affect thoughts, movement, and behavior.",
  "Marine Scientist":"Marine scientists study oceans, sea life, and marine environments.",
  "Mechanical Engineer":"Mechanical engineers design and improve machines, tools, engines, and moving systems.",
  "Civil Engineer":"Civil engineers design and build structures like roads, bridges, buildings, and water systems.",
  "Electrical Engineer":"Electrical engineers design and improve systems that use electricity and electronics.",
  "Aerospace Engineer":"Aerospace engineers design aircraft, spacecraft, satellites, and flight systems.",
  "Chemical Engineer":"Chemical engineers use chemistry to design products, materials, fuels, and manufacturing processes.",
  "Biomedical Engineer":"Biomedical engineers design technology and devices that help improve health care.",
  "Software Developer":"Software developers create apps, programs, and digital tools people use.",
  "Computer Programmer":"Computer programmers write code that tells computers and apps what to do.",
  "Cybersecurity Analyst":"Cybersecurity analysts protect computer systems and information from hackers and threats.",
  "Data Engineer":"Data engineers build systems that collect, organize, and move large amounts of data.",
  "AI Engineer":"AI engineers create computer systems that can learn, recognize patterns, and make predictions.",
  "Robotics Engineer":"Robotics engineers design and build robots that can complete tasks.",
  "Network Engineer":"Network engineers build and maintain systems that connect computers and devices.",
  "Systems Analyst":"Systems analysts study technology systems and find ways to make them work better.",
  "IT Specialist":"IT specialists help people set up, fix, and use computers and technology.",
  "Web Developer":"Web developers build and improve websites and web apps.",
  "UX Designer":"UX designers make websites, apps, and products easier and better for people to use.",
  "Entrepreneur":"Entrepreneurs create new businesses, products, or services.",
  "Business Owner":"Business owners run companies and make decisions about how they operate.",
  "Marketing Manager":"Marketing managers plan ways to promote products, services, or ideas.",
  "Financial Analyst":"Financial analysts study money information to help people and businesses make decisions.",
  "Accountant":"Accountants track, organize, and check financial records.",
  "Investment Banker":"Investment bankers help companies and organizations raise and manage large amounts of money.",
  "Human Resources Manager":"Human resources managers help hire, support, and manage employees.",
  "Operations Manager":"Operations managers make sure a business runs smoothly day to day.",
  "Project Manager":"Project managers organize people, tasks, and timelines to complete projects.",
  "Sales Manager":"Sales managers lead teams that help customers choose and buy products or services.",
  "Real Estate Agent":"Real estate agents help people buy, sell, or rent homes and properties.",
  "Business Consultant":"Business consultants give advice to help organizations solve problems and improve.",
  "Supply Chain Manager":"Supply chain managers organize how products move from suppliers to customers.",
  "Retail Manager":"Retail managers run stores and help staff serve customers well.",
  "Product Manager":"Product managers guide the planning and improvement of products people use.",
  "Financial Planner":"Financial planners help people make plans for saving, spending, and reaching money goals.",
  "Graphic Designer":"Graphic designers create visual designs for posters, logos, websites, and other media.",
  "Animator":"Animators create moving images for videos, games, movies, and digital media.",
  "Filmmaker":"Filmmakers plan, record, and edit movies, videos, or documentaries.",
  "Photographer":"Photographers take and edit photos to tell stories or capture important moments.",
  "Musician":"Musicians perform, write, or record music.",
  "Actor":"Actors perform characters in plays, movies, shows, or other productions.",
  "Writer":"Writers create stories, articles, scripts, books, or other written work.",
  "Journalist":"Journalists research and report news and information to the public.",
  "Editor":"Editors review and improve writing, videos, or other media before they are shared.",
  "Architect":"Architects design buildings and spaces that people use.",
  "Interior Designer":"Interior designers plan indoor spaces to make them useful, safe, and appealing.",
  "Fashion Designer":"Fashion designers create clothing, shoes, and accessories.",
  "Game Designer":"Game designers create the rules, stories, challenges, and experiences in games.",
  "UX/UI Designer":"UX/UI designers design how apps and websites look and feel for users.",
  "Illustrator":"Illustrators create drawings or images for books, products, games, and media.",
  "Art Director":"Art directors guide the visual style of projects like magazines, ads, films, or games.",
  "Content Creator":"Content creators make videos, posts, images, or writing for online audiences.",
  "Social Media Manager":"Social media managers plan and share content for organizations on social media.",
  "Lawyer":"Lawyers give legal advice and help people understand and follow the law.",
  "Judge":"Judges lead court cases and make decisions based on laws and evidence.",
  "Police Officer":"Police officers help protect people, respond to emergencies, and enforce laws.",
  "Detective":"Detectives investigate crimes and gather information to solve cases.",
  "Firefighter":"Firefighters respond to fires, emergencies, and rescues to keep people safe.",
  "EMT":"EMTs give emergency medical care before patients reach a hospital.",
  "Paramedic":"Paramedics provide advanced emergency medical care during serious health emergencies.",
  "Military Officer":"Military officers lead service members and help plan missions to protect the country.",
  "Intelligence Analyst":"Intelligence analysts study information to help identify risks and support safety decisions.",
  "Public Administrator":"Public administrators manage government programs and services for communities.",
  "Diplomat":"Diplomats represent their country and work with other countries to solve problems.",
  "Politician":"Politicians make decisions, create laws, and represent people in government.",
  "Emergency Management Specialist":"Emergency management specialists plan for disasters and help communities respond safely.",
  "Corrections Officer":"Corrections officers supervise people in jails or prisons and help maintain safety.",
  "Park Police Officer":"Park police officers protect people, wildlife, and public lands in parks.",
  "Homeland Security Specialist":"Homeland security specialists help protect the country from major threats and emergencies.",
  "Electrician":"Electricians install and repair electrical systems in homes, buildings, and other places.",
  "Plumber":"Plumbers install and repair pipes that carry water, gas, and waste.",
  "Carpenter":"Carpenters build and repair structures using wood and other materials.",
  "Welder":"Welders join metal parts together to build or repair structures and equipment.",
  "HVAC Technician":"HVAC technicians install and fix heating, cooling, and ventilation systems.",
  "Automotive Technician":"Automotive technicians inspect, maintain, and repair cars and trucks.",
  "Diesel Mechanic":"Diesel mechanics repair vehicles and machines that use diesel engines.",
  "Aircraft Mechanic":"Aircraft mechanics inspect and repair airplanes and other aircraft.",
  "Machinist":"Machinists use tools and machines to make precise metal or plastic parts.",
  "Construction Manager":"Construction managers plan and supervise building projects.",
  "Heavy Equipment Operator":"Heavy equipment operators use large machines to move materials and build structures.",
  "Industrial Maintenance Technician":"Industrial maintenance technicians repair and maintain machines used in factories and workplaces.",
  "Solar Installer":"Solar installers set up solar panels that turn sunlight into electricity.",
  "Wind Turbine Technician":"Wind turbine technicians install and repair turbines that create wind energy.",
  "Elevator Technician":"Elevator technicians install and repair elevators, escalators, and lifts.",
  "Farmer":"Farmers grow crops and raise animals for food and other products.",
  "Rancher":"Ranchers raise livestock and manage land for animals like cattle, sheep, or horses.",
  "Forester":"Foresters manage forests and help keep trees, wildlife, and land healthy.",
  "Wildlife Biologist":"Wildlife biologists study animals and their habitats.",
  "Conservation Officer":"Conservation officers protect wildlife, natural resources, and outdoor areas.",
  "Park Ranger":"Park rangers care for parks and help visitors enjoy them safely.",
  "Fisheries Scientist":"Fisheries scientists study fish, waterways, and aquatic ecosystems.",
  "Horticulturist":"Horticulturists grow and study plants, flowers, fruits, and vegetables.",
  "Agronomist":"Agronomists study soil and crops to help farms grow food more effectively.",
  "Environmental Consultant":"Environmental consultants help organizations understand and reduce their impact on the environment.",
  "Soil Scientist":"Soil scientists study soil and how it supports plants, water, and ecosystems.",
  "Marine Biologist":"Marine biologists study ocean animals, plants, and habitats.",
  "Urban Forester":"Urban foresters care for trees and green spaces in cities and towns.",
  "Sustainability Specialist":"Sustainability specialists help organizations use resources wisely and reduce waste.",
  "Agricultural Engineer":"Agricultural engineers design tools, systems, and technology that improve farming.",
  "Landscape Architect":"Landscape architects design outdoor spaces like parks, gardens, campuses, and public areas.",
  "Natural Resource Manager":"Natural resource managers help protect and manage land, water, wildlife, and other natural resources.",
};

const PAGE_CATEGORIES = ["purpose","workEnvironment","workStyle","lifestyle"];
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMc1EbU5U9lqRWbHEHp59pgIE7E2h-yu9WYPpt4LRZvjTCZOsWtGY5VM-aJWbOTw_l/exec";

// ── SCORING ───────────────────────────────────────────────────────────────────
function calcCareerFitScores(sel) {
  const sc=Object.fromEntries(CAREER_GROUPS.map(g=>[g,0]));
  for (const cat of PAGE_CATEGORIES) {
    const {firstChoice,secondChoice}=sel[cat];
    if (firstChoice)  (CARD_MAP[cat][firstChoice]||[]).forEach(g=>sc[g]+=2);
    if (secondChoice) (CARD_MAP[cat][secondChoice]||[]).forEach(g=>sc[g]+=1);
  }
  return sc;
}
function calcSubjectScores(subjects) {
  const sc=Object.fromEntries(CAREER_GROUPS.map(g=>[g,0]));
  for (const s of subjects) (SUBJECT_MAP[s]||[]).forEach(g=>sc[g]+=1);
  return sc;
}
function determineResults(sel, subjects) {
  const fitSc=calcCareerFitScores(sel);
  const subjSc=calcSubjectScores(subjects);
  const finalSc=Object.fromEntries(CAREER_GROUPS.map(g=>[g,fitSc[g]+subjSc[g]]));
  const qualifying=CAREER_GROUPS.filter(g=>fitSc[g]>0&&subjSc[g]>0);
  const sortFn=(a,b)=>{
    if(finalSc[b]!==finalSc[a]) return finalSc[b]-finalSc[a];
    if(fitSc[b]!==fitSc[a])    return fitSc[b]-fitSc[a];
    if(subjSc[b]!==subjSc[a])  return subjSc[b]-subjSc[a];
    return CAREER_GROUPS.indexOf(a)-CAREER_GROUPS.indexOf(b);
  };
  const sortedQ=[...qualifying].sort(sortFn);
  const uniqFinal=[...new Set(sortedQ.map(g=>finalSc[g]))];
  const top3Finals=uniqFinal.slice(0,3);
  const displayed=sortedQ.filter(g=>top3Finals.includes(finalSc[g]));
  let topMatches=[],secondaryMatches=[],additionalMatches=[];
  if(displayed.length>0){
    const hi=finalSc[displayed[0]];
    topMatches=displayed.filter(g=>finalSc[g]===hi);
    secondaryMatches=displayed.filter(g=>finalSc[g]<hi);
  }
  const allShown=[...topMatches,...secondaryMatches];
  if(allShown.length<3){
    const nonQ=CAREER_GROUPS.filter(g=>!qualifying.includes(g)&&fitSc[g]>0);
    const sorted=[...nonQ].sort((a,b)=>fitSc[b]!==fitSc[a]?fitSc[b]-fitSc[a]:CAREER_GROUPS.indexOf(a)-CAREER_GROUPS.indexOf(b));
    additionalMatches=sorted.slice(0,3-allShown.length);
  }
  return {topMatches,secondaryMatches,additionalMatches,fitScores:fitSc,subjScores:subjSc,finalScores:finalSc};
}

// ── CSV ───────────────────────────────────────────────────────────────────────
// function toCSV(rows){
//   const hdrs=["student_name","grade_level","submitted_at","purpose_first","purpose_second","work_env_first","work_env_second","work_style_first","work_style_second","lifestyle_first","lifestyle_second","favorite_subjects","hhs_fit","sci_fit","eng_fit","biz_fit","arts_fit","psl_fit","trades_fit","agr_fit","hhs_subj","sci_subj","eng_subj","biz_subj","arts_subj","psl_subj","trades_subj","agr_subj","top_matches","secondary_matches","additional_matches"];
//   const cell=v=>`"${(v||"").toString().replace(/"/g,'""')}"`;
//   const lines=[hdrs.join(",")];
//   for(const r of rows){
//     const f=r.fitScores||{},s=r.subjScores||{};
//     lines.push([
//       cell(r.studentName),cell(r.gradeLevel),cell(r.submittedAt),
//       cell(r.selections?.purpose?.firstChoice),cell(r.selections?.purpose?.secondChoice),
//       cell(r.selections?.workEnvironment?.firstChoice),cell(r.selections?.workEnvironment?.secondChoice),
//       cell(r.selections?.workStyle?.firstChoice),cell(r.selections?.workStyle?.secondChoice),
//       cell(r.selections?.lifestyle?.firstChoice),cell(r.selections?.lifestyle?.secondChoice),
//       cell((r.favoriteSubjects||[]).join(";")),
//       f["Healthcare & Human Services"]||0,f["Science & Research"]||0,f["Engineering & Technology"]||0,
//       f["Business & Entrepreneurship"]||0,f["Arts, Media & Design"]||0,f["Public Service & Law"]||0,
//       f["Skilled Trades & Technical Careers"]||0,f["Agriculture, Environment & Natural Resources"]||0,
//       s["Healthcare & Human Services"]||0,s["Science & Research"]||0,s["Engineering & Technology"]||0,
//       s["Business & Entrepreneurship"]||0,s["Arts, Media & Design"]||0,s["Public Service & Law"]||0,
//       s["Skilled Trades & Technical Careers"]||0,s["Agriculture, Environment & Natural Resources"]||0,
//       cell((r.results?.topMatches||[]).join(";")),cell((r.results?.secondaryMatches||[]).join(";")),cell((r.results?.additionalMatches||[]).join(";")),
//     ].join(","));
//   }
//   return lines.join("\n");
// }

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const wiggleCSS=`@keyframes wiggle{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}.wiggle{animation:wiggle .4s ease;}`;
const S={
  app:  {fontFamily:"'Segoe UI',system-ui,sans-serif",minHeight:"100vh",background:"#f8f6ff",color:"#2d2d2d"},
  page: {maxWidth:940,margin:"0 auto",padding:"24px 16px",minHeight:"100vh",display:"flex",flexDirection:"column"},
  h1:   {fontSize:"clamp(1.5rem,4vw,2.1rem)",fontWeight:800,margin:0},
  h2:   {fontSize:"clamp(1rem,3vw,1.35rem)",fontWeight:700,margin:"0 0 8px"},
  input:{width:"100%",padding:"12px 16px",borderRadius:12,border:"2px solid #e0e0e0",fontSize:"1rem",outline:"none",boxSizing:"border-box"},
  btn:  (bg="#6c63ff",c="#fff")=>({background:bg,color:c,border:"none",borderRadius:50,padding:"12px 28px",fontSize:"1rem",fontWeight:700,cursor:"pointer",boxShadow:"0 2px 6px rgba(0,0,0,0.12)"}),
  tag:  (bg)=>({background:bg,color:"#fff",borderRadius:50,padding:"3px 10px",fontSize:"0.75rem",fontWeight:700,display:"inline-block"}),
};

// ── PROGRESS BAR ──────────────────────────────────────────────────────────────
function ProgressBar({page}){
  const steps=["Purpose","Work Environment","Work Style","Lifestyle","Fav. Subjects"];
  const colors=["#e57373","#66bb6a","#ab47bc","#ffc107","#4db6ac"];
  return(
    <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
      {steps.map((s,i)=>{
        const sp=i+2,done=page>sp,active=page===sp;
        return(
          <div key={s} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:done||active?colors[i]:"#e0e0e0",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:"0.75rem",flexShrink:0}}>
              {done?"✓":i+1}
            </div>
            <span style={{fontSize:"0.75rem",color:active?colors[i]:done?"#555":"#bbb",fontWeight:active?700:400}}>{s}</span>
            {i<4&&<span style={{color:"#ddd",fontSize:"0.8rem"}}>›</span>}
          </div>
        );
      })}
    </div>
  );
}

// ── CHOICE SLOT ───────────────────────────────────────────────────────────────
function ChoiceSlot({label,optional,card,accentColor,onDrop,onClear}){
  const [over,setOver]=useState(false);
  return(
    <div onDragOver={e=>{e.preventDefault();setOver(true);}} onDragLeave={()=>setOver(false)}
      onDrop={e=>{e.preventDefault();setOver(false);onDrop(e.dataTransfer.getData("cardId"));}}
      onClick={()=>card&&onClear()} tabIndex={0} role="button"
      onKeyDown={e=>(e.key==="Enter"||e.key===" ")&&card&&onClear()}
      style={{minHeight:88,borderRadius:16,border:`3px dashed ${over?accentColor:card?accentColor:"#ccc"}`,
        background:over?`${accentColor}22`:card?`${accentColor}15`:"#fafafa",
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        padding:10,transition:"all .15s",cursor:card?"pointer":"default",outline:"none"}}>
      <div style={{fontSize:"0.72rem",fontWeight:700,color:accentColor,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>
        {label}{optional?<span style={{fontWeight:400,color:"#bbb"}}> (optional)</span>:<span style={{color:"#e57373"}}>*</span>}
      </div>
      {card
        ?<div style={{background:"#fff",borderRadius:12,padding:"6px 12px",textAlign:"center",fontWeight:700,fontSize:"0.88rem",border:`2px solid ${accentColor}`,width:"100%",position:"relative"}}>
          {card.id}<span style={{position:"absolute",top:4,right:8,fontSize:"0.68rem",color:"#bbb"}}>✕</span>
        </div>
        :<div style={{color:"#ccc",fontSize:"0.8rem"}}>Drag or tap a card here</div>}
    </div>
  );
}

// ── INTEREST CARD ─────────────────────────────────────────────────────────────
function InterestCard({card,isFirst,isSecond,accentColor,onDragStart,onClick,wiggling}){
  const placed=isFirst||isSecond;
  return(
    <div draggable onDragStart={onDragStart} onClick={onClick} tabIndex={0} role="button"
      onKeyDown={e=>(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),onClick())}
      className={wiggling?"wiggle":""}
      style={{background:isFirst?`${accentColor}22`:isSecond?`${accentColor}11`:"#fff",
        borderLeft:`5px solid ${placed?accentColor:"#e0e0e0"}`,borderRadius:12,
        padding:"11px 13px",cursor:"pointer",userSelect:"none",
        boxShadow:"0 2px 8px rgba(0,0,0,0.07)",outline:"none"}}>
      <div style={{fontWeight:700,fontSize:"0.9rem",marginBottom:3}}>
        {card.id}
        {isFirst&&<span style={{...S.tag(accentColor),marginLeft:8,fontSize:"0.68rem"}}>1st</span>}
        {isSecond&&<span style={{...S.tag("#bbb"),marginLeft:8,fontSize:"0.68rem"}}>2nd</span>}
      </div>
      <div style={{color:"#666",fontSize:"0.78rem",lineHeight:1.4}}>{card.desc}</div>
    </div>
  );
}

// ── CARD SORT PAGE ────────────────────────────────────────────────────────────
function CardSortPage({category,selections,onUpdate,onBack,onNext,isFirstPage,studentName,band}){
  const meta=CATEGORY_META[category];
  const cards=getCards(band)[category];
  const question=PAGE_QUESTIONS[band][category];
  const [error,setError]=useState("");
  const [wigglers,setWigglers]=useState({});
  const {firstChoice,secondChoice}=selections;
  const findCard=id=>cards.find(c=>c.id===id);

  const triggerWiggle=id=>{setWigglers(p=>({...p,[id]:true}));setTimeout(()=>setWigglers(p=>({...p,[id]:false})),500);};

  const handleCardClick=id=>{
    if(firstChoice===id||secondChoice===id) return;
    if(!firstChoice){onUpdate({firstChoice:id,secondChoice});setError("");}
    else if(!secondChoice) onUpdate({firstChoice,secondChoice:id});
    else triggerWiggle(id);
  };

  const handleDrop=(slot,id)=>{
    if(slot==="first"){onUpdate({firstChoice:id,secondChoice:secondChoice===id?null:secondChoice});setError("");}
    else onUpdate({firstChoice:firstChoice===id?null:firstChoice,secondChoice:id});
  };

  const handleNext=()=>{
    if(!firstChoice){setError("Please choose your First Choice before continuing.");return;}
    onNext();
  };

  return(
    <div style={S.page}>
      <style>{wiggleCSS}</style>
      <ProgressBar page={PAGE_CATEGORIES.indexOf(category)+2}/>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:"0.75rem",fontWeight:700,color:meta.color,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{meta.label}</div>
        <h2 style={{...S.h2,borderBottom:`3px solid ${meta.color}`,paddingBottom:8}}>{question}</h2>
        <div style={{fontSize:"0.8rem",color:"#999"}}>Hi {studentName}! Tap a card to choose it, or drag it into a slot below.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <ChoiceSlot label="First Choice" optional={false} card={findCard(firstChoice)} accentColor={meta.color}
          onDrop={id=>handleDrop("first",id)} onClear={()=>onUpdate({firstChoice:null,secondChoice})}/>
        <ChoiceSlot label="Second Choice" optional={true} card={findCard(secondChoice)} accentColor={meta.color}
          onDrop={id=>handleDrop("second",id)} onClear={()=>onUpdate({firstChoice,secondChoice:null})}/>
      </div>
      {error&&<div style={{background:"#fdecea",border:"2px solid #e57373",borderRadius:10,padding:"9px 14px",color:"#c62828",marginBottom:12,fontSize:"0.85rem"}}>{error}</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10,flex:1}}>
        {cards.map(card=>(
          <InterestCard key={card.id} card={card}
            isFirst={firstChoice===card.id} isSecond={secondChoice===card.id}
            accentColor={meta.color} wiggling={!!wigglers[card.id]}
            onDragStart={e=>e.dataTransfer.setData("cardId",card.id)}
            onClick={()=>handleCardClick(card.id)}/>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:isFirstPage?"flex-end":"space-between",marginTop:18,gap:12}}>
        {!isFirstPage&&<button style={S.btn("#e0e0e0","#555")} onClick={onBack}>← Back</button>}
        <button style={S.btn(meta.color)} onClick={handleNext}>Next →</button>
      </div>
    </div>
  );
}

// ── FAVORITE SUBJECTS PAGE ────────────────────────────────────────────────────
function FavoriteSubjectsPage({selected,onUpdate,onBack,onSubmit,band}){
  const groups=getSubjectGroups(band);
  const accentColor="#4db6ac";
  const toggle=s=>onUpdate(selected.includes(s)?selected.filter(x=>x!==s):[...selected,s]);

  const question = band==="elementary"
    ? "Which subjects do you enjoy?"
    : band==="middle"
    ? "Which subjects do you enjoy or find interesting?"
    : "Which subjects do you enjoy or find interesting?";

  return(
    <div style={S.page}>
      <ProgressBar page={6}/>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:"0.75rem",fontWeight:700,color:accentColor,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Favorite Subjects</div>
        <h2 style={{...S.h2,borderBottom:`3px solid ${accentColor}`,paddingBottom:8}}>{question}</h2>
        <div style={{fontSize:"0.82rem",color:"#999"}}>Select as many as you like — or none if none apply.</div>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {groups.map(({group,subjects})=>(
          <div key={group} style={{marginBottom:20}}>
            <div style={{fontSize:"0.78rem",fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:1,marginBottom:8,borderBottom:"1px solid #eee",paddingBottom:4}}>{group}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {subjects.map(s=>{
                const sel=selected.includes(s);
                return(
                  <button key={s} onClick={()=>toggle(s)}
                    style={{background:sel?accentColor:"#fff",color:sel?"#fff":"#444",
                      border:`2px solid ${sel?accentColor:"#ddd"}`,borderRadius:50,
                      padding:"7px 16px",fontSize:"0.85rem",fontWeight:sel?700:400,cursor:"pointer",
                      transition:"all .15s",boxShadow:sel?"0 2px 6px rgba(77,182,172,0.3)":"none"}}>
                    {sel&&"✓ "}{s}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {selected.length>0&&<div style={{fontSize:"0.8rem",color:accentColor,fontWeight:600,marginTop:8}}>{selected.length} subject{selected.length!==1?"s":""} selected</div>}
      <div style={{display:"flex",justifyContent:"space-between",marginTop:18,gap:12}}>
        <button style={S.btn("#e0e0e0","#555")} onClick={onBack}>← Back</button>
        <button style={S.btn(accentColor)} onClick={onSubmit}>See My Results →</button>
      </div>
    </div>
  );
}

// ── WHY THIS MATCHES YOU ──────────────────────────────────────────────────────
function WhyThisMatches({group,selections,favoriteSubjects,matchType,band}){
  const [open,setOpen]=useState(true);
  const subjectGroups=getSubjectGroups(band);

  const contribCards=[];
  for(const cat of PAGE_CATEGORIES){
    const {firstChoice,secondChoice}=selections[cat];
    if(firstChoice&&(CARD_MAP[cat][firstChoice]||[]).includes(group)) contribCards.push({cat,card:firstChoice,rank:"1st Choice"});
    if(secondChoice&&(CARD_MAP[cat][secondChoice]||[]).includes(group)) contribCards.push({cat,card:secondChoice,rank:"2nd Choice"});
  }

  const contribSubjects=favoriteSubjects.filter(s=>(SUBJECT_MAP[s]||[]).includes(group));
  const subjByGroup=subjectGroups.map(({group:g,subjects})=>{
    const hits=subjects.filter(s=>contribSubjects.includes(s));
    return hits.length?{group:g,subjects:hits}:null;
  }).filter(Boolean);

  return(
    <div style={{marginTop:20,borderTop:"1px solid #eee",paddingTop:16}}>
      <button onClick={()=>setOpen(p=>!p)}
        style={{background:"none",border:"none",color:"#6c63ff",fontWeight:700,cursor:"pointer",fontSize:"0.9rem",padding:0,display:"flex",alignItems:"center",gap:6}}>
        {open?"▾":"▸"} Why This Matches You
      </button>
      {open&&(
        <div style={{marginTop:12}}>
          {contribCards.length>0&&(
            <div style={{marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:"0.85rem",color:"#555",marginBottom:8}}>Your Career Preferences</div>
              {contribCards.map(({cat,card,rank},i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,fontSize:"0.85rem"}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:CATEGORY_META[cat].color,flexShrink:0,display:"inline-block"}}/>
                  <span style={{color:"#666"}}><b style={{color:CATEGORY_META[cat].color}}>{CATEGORY_META[cat].label}:</b> {card}</span>
                  <span style={{...S.tag(rank==="1st Choice"?"#6c63ff":"#bbb"),fontSize:"0.68rem",padding:"2px 8px"}}>{rank}</span>
                </div>
              ))}
            </div>
          )}
          <div>
            <div style={{fontWeight:700,fontSize:"0.85rem",color:"#555",marginBottom:8}}>Your Favorite Subjects</div>
            {matchType==="Additional Match"&&subjByGroup.length===0
              ?<div style={{fontSize:"0.83rem",color:"#aaa",fontStyle:"italic"}}>No selected subjects directly matched this career group. It appeared because of your strong career preference score.</div>
              :subjByGroup.length===0
                ?<div style={{fontSize:"0.83rem",color:"#aaa",fontStyle:"italic"}}>No selected subjects directly matched this career group.</div>
                :subjByGroup.map(({group:g,subjects})=>(
                  <div key={g} style={{marginBottom:8}}>
                    <div style={{fontSize:"0.78rem",fontWeight:700,color:"#888",marginBottom:3}}>{g}</div>
                    {subjects.map(s=><div key={s} style={{fontSize:"0.83rem",color:"#555",paddingLeft:12,marginBottom:2}}>• {s}</div>)}
                  </div>
                ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ── CAREER POPUP ──────────────────────────────────────────────────────────────
function CareerPopup({career,onClose}){
  const ref=useRef();
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))onClose();};
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[onClose]);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:16}}>
      <div ref={ref} style={{background:"#fff",borderRadius:20,padding:28,maxWidth:360,width:"100%",boxShadow:"0 8px 32px rgba(0,0,0,0.18)",textAlign:"center"}}>
        <div style={{fontWeight:800,fontSize:"1.1rem",marginBottom:12}}>{career}</div>
        <p style={{color:"#555",lineHeight:1.7,fontSize:"0.92rem",margin:0}}>{CAREER_DESCS[career]||"A rewarding career path."}</p>
        <button style={{...S.btn("#6c63ff"),marginTop:20,padding:"9px 24px",fontSize:"0.88rem"}} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// ── SELECTIONS SUMMARY ────────────────────────────────────────────────────────
function SelectionsSummary({selections,favoriteSubjects}){
  const [open,setOpen]=useState(true);
  return(
    <div style={{marginTop:20,background:"#f0eeff",borderRadius:14,padding:"14px 18px"}}>
      <button onClick={()=>setOpen(p=>!p)}
        style={{background:"none",border:"none",color:"#6c63ff",fontSize:"0.88rem",fontWeight:700,cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:6,width:"100%"}}>
        {open?"▾":"▸"} <span>Your Card Selections</span>
        {!open&&<span style={{marginLeft:"auto",fontSize:"0.75rem",color:"#9b8ec4",fontWeight:400}}>click to view</span>}
      </button>
      {open&&(
        <div style={{marginTop:12,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:8}}>
          {PAGE_CATEGORIES.map(cat=>{
            const meta=CATEGORY_META[cat];
            const {firstChoice,secondChoice}=selections[cat];
            return(
              <div key={cat} style={{background:"#fff",borderRadius:12,padding:"10px 14px",borderLeft:`4px solid ${meta.color}`,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:"0.7rem",fontWeight:700,color:meta.color,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{meta.label}</div>
                <div style={{fontSize:"0.8rem"}}><b>1st:</b> {firstChoice||"—"}</div>
                <div style={{fontSize:"0.8rem",color:"#999"}}><b>2nd:</b> {secondChoice||"—"}</div>
              </div>
            );
          })}
          {favoriteSubjects.length>0&&(
            <div style={{background:"#fff",borderRadius:12,padding:"10px 14px",borderLeft:"4px solid #4db6ac",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:"0.7rem",fontWeight:700,color:"#4db6ac",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Fav. Subjects</div>
              <div style={{fontSize:"0.78rem",color:"#555",lineHeight:1.6}}>{favoriteSubjects.join(", ")}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── RESULTS PAGE ──────────────────────────────────────────────────────────────
function ResultsPage({student,selections,favoriteSubjects,band,onRestart}){
  const careerData=getCareerData(band);
  const {topMatches,secondaryMatches,additionalMatches}=determineResults(selections,favoriteSubjects);
  const all=[...topMatches,...secondaryMatches,...additionalMatches];
  const [selected,setSelected]=useState(all[0]||null);
  const [showConfirm,setShowConfirm]=useState(false);
  const [careerPopup,setCareerPopup]=useState(null);
  const detail=selected?careerData[selected]:null;

  const matchType=g=>topMatches.includes(g)?"Top Match":secondaryMatches.includes(g)?"Secondary Match":"Additional Match";
  const tagColor=g=>topMatches.includes(g)?"#f59e42":secondaryMatches.includes(g)?"#90a4ae":"#a29bfe";
  const tagLabel=g=>topMatches.includes(g)?"⭐ Top Match":secondaryMatches.includes(g)?"✨ Secondary Match":"➕ Additional Match";

  return(
    <div style={S.page}>
      <div style={{textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:"2rem"}}>🎉</div>
        <h1 style={{...S.h1,color:"#6c63ff"}}>Your Career Matches</h1>
        <p style={{color:"#666",margin:"6px 0 0"}}>Great work, {student.name}! Here are the career groups that fit your interests.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"minmax(210px,290px) 1fr",gap:18,flex:1}}>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {all.map(g=>(
            <div key={g} onClick={()=>setSelected(g)}
              style={{background:selected===g?"#f0eeff":"#fff",borderRadius:14,padding:"13px 15px",cursor:"pointer",
                border:`3px solid ${selected===g?"#6c63ff":"#e0e0e0"}`,transition:"all .15s"}}>
              <div style={S.tag(tagColor(g))}>{tagLabel(g)}</div>
              <div style={{fontWeight:700,marginTop:5,fontSize:"0.92rem"}}>{careerData[g]?.icon} {g}</div>
            </div>
          ))}
        </div>
        {detail&&(
          <div style={{background:"#fff",borderRadius:16,padding:22,boxShadow:"0 2px 8px rgba(0,0,0,0.08)",overflowY:"auto"}}>
            <div style={{fontSize:"2.4rem",marginBottom:8}}>{detail.icon}</div>
            <div style={S.tag(tagColor(selected))}>{tagLabel(selected)}</div>
            <h2 style={{...S.h2,marginTop:10}}>{selected}</h2>
            <p style={{color:"#555",lineHeight:1.7,marginBottom:14,fontSize:"0.92rem"}}>{detail.desc}</p>
            <div style={{fontWeight:700,marginBottom:8,color:"#6c63ff",fontSize:"0.9rem"}}>Possible Careers</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:4}}>
              {detail.careers.map(c=>(
                <button key={c} onClick={()=>setCareerPopup(c)}
                  style={{background:"#f0eeff",border:"none",borderRadius:50,padding:"5px 13px",fontSize:"0.8rem",fontWeight:500,color:"#6c63ff",cursor:"pointer"}}
                  onMouseOver={e=>e.target.style.background="#e0d8ff"} onMouseOut={e=>e.target.style.background="#f0eeff"}>
                  {c}
                </button>
              ))}
            </div>
            <WhyThisMatches group={selected} selections={selections} favoriteSubjects={favoriteSubjects} matchType={matchType(selected)} band={band}/>
          </div>
        )}
      </div>
      <SelectionsSummary selections={selections} favoriteSubjects={favoriteSubjects}/>
      <div style={{textAlign:"center",marginTop:22}}>
        <button style={S.btn("#e57373")} onClick={()=>setShowConfirm(true)}>Start Over</button>
      </div>
      {careerPopup&&<CareerPopup career={careerPopup} onClose={()=>setCareerPopup(null)}/>}
      {showConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
          <div style={{background:"#fff",borderRadius:20,padding:28,maxWidth:340,textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.18)"}}>
            <div style={{fontWeight:700,fontSize:"1.1rem",marginBottom:12}}>Start Over?</div>
            <p style={{color:"#666",marginBottom:20}}>Are you sure you want to start over? Your current results will be cleared.</p>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button style={S.btn("#e57373")} onClick={onRestart}>Yes, Start Over</button>
              <button style={S.btn("#e0e0e0","#555")} onClick={()=>setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── START PAGE ────────────────────────────────────────────────────────────────
function StartPage({onStart}){
  const [name,setName]=useState("");
  const [grade,setGrade]=useState("");
  const [errors,setErrors]=useState({});

  const handleStart=()=>{
    const e={};
    if(!name.trim()) e.name="Please enter your name.";
    if(!grade) e.grade="Please choose your grade level.";
    if(Object.keys(e).length){setErrors(e);return;}
    onStart(name.trim(),grade);
  };

  return(
    <div style={{...S.page,alignItems:"center",justifyContent:"center",textAlign:"center",gap:22}}>
      <div>
        <div style={{fontSize:"3rem",marginBottom:6}}>🧭</div>
        <h1 style={{...S.h1,color:"#6c63ff"}}>Career Compass</h1>
      </div>
      <p style={{maxWidth:480,color:"#555",lineHeight:1.6,fontSize:"1rem"}}>
        Choose the cards that best describe what matters to you. At the end, you'll see career groups that may be a good fit for your interests.
      </p>
      <div style={{width:"100%",maxWidth:400,display:"flex",flexDirection:"column",gap:13}}>
        <div>
          <input style={{...S.input,borderColor:errors.name?"#e57373":"#e0e0e0"}}
            placeholder="Your name" value={name} onChange={e=>{setName(e.target.value);setErrors(p=>({...p,name:null}));}}/>
          {errors.name&&<div style={{color:"#e57373",fontSize:"0.8rem",marginTop:3}}>{errors.name}</div>}
        </div>
        <div>
          <select style={{...S.input,borderColor:errors.grade?"#e57373":"#e0e0e0",background:"#fff"}}
            value={grade} onChange={e=>{setGrade(e.target.value);setErrors(p=>({...p,grade:null}));}}>
            <option value="">Select your grade level…</option>
            {GRADES.map(g=><option key={g}>{g}</option>)}
          </select>
          {errors.grade&&<div style={{color:"#e57373",fontSize:"0.8rem",marginTop:3}}>{errors.grade}</div>}
        </div>
        <button style={{...S.btn(),marginTop:6}} onClick={handleStart}>Start →</button>
      </div>
      <div style={{position:"absolute",bottom:12,right:16,fontSize:"0.62rem",color:"#ddd"}}>v1.3</div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
const initSel=()=>({purpose:{firstChoice:null,secondChoice:null},workEnvironment:{firstChoice:null,secondChoice:null},workStyle:{firstChoice:null,secondChoice:null},lifestyle:{firstChoice:null,secondChoice:null}});

export default function App(){
  const [page,setPage]         =useState(1);
  const [student,setStudent]   =useState({name:"",gradeLevel:""});
  const [selections,setSel]    =useState(initSel());
  const [subjects,setSubjects] =useState([]);

  const band = ageBand(student.gradeLevel);

  const handleStart=(name,gradeLevel)=>{setStudent({name,gradeLevel});setPage(2);};
  const handleUpdate=(cat,val)=>setSel(p=>({...p,[cat]:val}));

  const handleSubmit = async () => {
    const fitScores  = calcCareerFitScores(selections);
    const subjScores = calcSubjectScores(subjects);
    const results    = determineResults(selections, subjects);

    const payload = {
      studentName:      student.name,
      gradeLevel:       student.gradeLevel,
      submittedAt:      new Date().toISOString(),
      selections,
      favoriteSubjects: subjects,
      fitScores,
      subjScores,
      results: {
        topMatches:        results.topMatches,
        secondaryMatches:  results.secondaryMatches,
        additionalMatches: results.additionalMatches,
      },
    };

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Submission error:", err);
    }

    setPage(7);
  };

  const handleRestart=()=>{setPage(1);setStudent({name:"",gradeLevel:""});setSel(initSel());setSubjects([]);};

  if(page===1) return <div style={S.app}><StartPage onStart={handleStart}/></div>;
  if(page===6) return <div style={S.app}><FavoriteSubjectsPage selected={subjects} onUpdate={setSubjects} onBack={()=>setPage(5)} onSubmit={handleSubmit} band={band}/></div>;
  if(page===7) return <div style={S.app}><ResultsPage student={student} selections={selections} favoriteSubjects={subjects} band={band} onRestart={handleRestart}/></div>;

  const catIdx=page-2;
  const cat=PAGE_CATEGORIES[catIdx];

  return(
    <div style={S.app}>
      <CardSortPage key={cat} category={cat} selections={selections[cat]}
        onUpdate={val=>handleUpdate(cat,val)}
        onBack={()=>setPage(p=>p-1)}
        onNext={()=>setPage(p=>p+1)}
        isFirstPage={catIdx===0}
        studentName={student.name}
        band={band}/>
    </div>
  );
}
