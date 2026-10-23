// All site content lives here, taken from the resume.
export const profile = {
  name: 'Sourabh Soni',
  role: 'Software Engineer',
  email: 'sonisourabh094@gmail.com',
  phone: '+91 75660 73022',
  location: 'Sheopur, India',
  linkedin: 'https://www.linkedin.com/in/sourabh-soni-04b54b137',
  github: 'https://github.com/sourabhsoni094',
};

export const stats = [
  { n: '3+', l: 'Years building' },
  { n: '16', l: 'Roles in one RBAC system' },
  { n: '40%', l: 'Max reported speed-up' },
  { n: '5', l: 'Project areas' },
];

export const projects = [
  {
    id: '01',
    title: 'Pharmaceutical Management System',
    type: 'Healthcare · Multi-module platform',
    blurb: 'One platform for inventory and expiry tracking, attendance, field activity, doctor visits and reporting.',
    points: [
      'Inventory and expiry tracking, employee attendance and leave, field activity, doctor visits and reporting in one platform.',
      'Role-based permissions covering 16 roles.',
      'Contributed to backend and API workflows and to performance improvements — project records report gains of up to 40%.',
    ],
    tags: ['PHP', 'Laravel', 'REST APIs', 'RBAC'],
    palette: ['#04121c', '#0e7c86', '#ff7a3d'],
    seed: 1,
  },
  {
    id: '02',
    title: 'Madd Education Platform',
    type: 'Education · Assessments',
    blurb: 'Free and paid tests, coaching-institute workflows and assessments tied to learning goals.',
    points: [
      'Free and paid tests, plus coaching-institute workflows.',
      'Teacher and student management.',
      'Assessments linked to learning goals.',
    ],
    tags: ['Assessments', 'Education', 'SaaS'],
    palette: ['#0d0a1f', '#5b3df5', '#ffc857'],
    seed: 2,
  },
  {
    id: '03',
    title: 'TaxGuru & E-commerce Apps',
    type: 'Finance · E-commerce',
    blurb: 'Backend features, data handling and application workflows for finance, tax and e-commerce products.',
    points: [
      'Contributed to finance/tax-related and e-commerce web application work.',
      'Backend features, data handling and application workflows.',
    ],
    tags: ['Finance', 'E-commerce', 'Backend'],
    palette: ['#07130f', '#1f9d6b', '#efe6c8'],
    seed: 3,
  },
  {
    id: '04',
    title: 'GTF — Get Together Finance',
    type: 'Finance · Learning platform',
    blurb: 'Share-market education with recorded weekly sessions and live weekend Q&A.',
    points: [
      'Share-market education that helps users build confidence and income in the stock market, through comprehensive learning resources.',
      'Flexible structure for busy professionals and students: recorded weekly sessions plus live weekend Q&A for real-time engagement.',
    ],
    tags: ['Finance', 'Learning', 'Live Q&A'],
    palette: ['#050d1f', '#2f6fed', '#a8d8ff'],
    seed: 4,
  },
  {
    id: '05',
    title: 'Landsharks Running Club',
    type: 'Sports · Race management',
    blurb: 'A high-concurrency race platform tracking 500+ participants with live timing and leaderboards.',
    points: [
      'High-concurrency race management platform tracking 500+ participants in real time.',
      'User-friendly registration engine and real-time timing system with performance analytics and leaderboards.',
    ],
    tags: ['Real-time', 'Leaderboards', 'Registration'],
    palette: ['#0c0809', '#e84a5f', '#feceab'],
    seed: 5,
  },
];

export const experience = [
  {
    n: '01',
    role: 'Software Engineer',
    org: 'Strivemindz Private Limited',
    when: 'Jun 2022 — Aug 2025',
    where: 'Jaipur, Rajasthan',
    points: [
      'Developed and maintained web application features using PHP, Laravel, JavaScript and relational databases.',
      'Built and integrated REST APIs to support connected modules and frontend workflows.',
      'Worked on a pharmaceutical management platform with role-based access across 16 roles.',
      'Improved slow screens by reducing unnecessary loops and optimizing database access — records report gains of up to 40%.',
      'Worked with multi-table data and API responses for dashboards, counts and reporting.',
    ],
  },
  {
    n: '02',
    role: 'Junior Web Designer',
    org: 'Spanco Web Technologies',
    when: 'Jan 2021 — Jun 2021',
    where: '',
    points: [
      'Website layout and frontend implementation with HTML, CSS, JavaScript and Bootstrap.',
      'Helped build and refine responsive page layouts and keep interfaces consistent.',
    ],
  },
  {
    n: '03',
    role: 'B.Tech, Computer Science Engineering',
    org: 'R.N. Modi Engineering College, Kota',
    when: '2015 — 2019',
    where: '',
    points: ['Higher Secondary in Mathematics, Excellence Higher Secondary School, Sheopur (2014 — 2015).'],
  },
];

export const skillGroups = [
  { title: 'Languages', items: ['PHP', 'Python', 'JavaScript', 'SQL', 'HTML', 'CSS'] },
  { title: 'Backend', items: ['Laravel', 'REST APIs', 'FastAPI', 'Django', 'CodeIgniter', 'MVC', 'OOP'] },
  { title: 'Frontend', items: ['React', 'Bootstrap', 'Tailwind CSS', 'jQuery', 'AJAX'] },
  { title: 'Databases', items: ['MySQL', 'PostgreSQL', 'MongoDB'] },
  { title: 'Workflow', items: ['Git', 'GitHub', 'Postman', 'JIRA', 'Docker', 'Linux', 'Agile / Scrum'] },
  { title: 'Concepts', items: ['Auth & RBAC', 'Database indexing', 'Caching', 'API integration', 'Debugging', 'Performance'] },
];

export const marquee = ['PHP', 'Laravel', 'Python', 'FastAPI', 'REST APIs', 'MySQL', 'React', 'Docker'];
