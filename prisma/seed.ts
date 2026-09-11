import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.answer.deleteMany();
  await prisma.assessmentAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.competencyScore.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.competency.deleteMany();
  await prisma.user.deleteMany();

  const hash = (pw: string) => bcryptjs.hashSync(pw, 10);

  // ========================================================================
  // COMPETENCIES
  // ========================================================================
  console.log('  📊 Creating competencies...');
  const competencies = await Promise.all([
    prisma.competency.create({ data: { name: 'Data Analytics', description: 'Ability to analyze, interpret, and visualize data to drive business decisions', category: 'Technical', icon: '📊' } }),
    prisma.competency.create({ data: { name: 'Cloud Computing', description: 'Proficiency in cloud platforms, services, deployment and infrastructure management', category: 'Technical', icon: '☁️' } }),
    prisma.competency.create({ data: { name: 'Cybersecurity', description: 'Knowledge of security protocols, threat detection, and risk management', category: 'Technical', icon: '🔒' } }),
    prisma.competency.create({ data: { name: 'Project Management', description: 'Skills in planning, executing, and delivering projects efficiently', category: 'Management', icon: '📋' } }),
    prisma.competency.create({ data: { name: 'AI & Machine Learning', description: 'Understanding of AI/ML algorithms, model training, and deployment', category: 'Technical', icon: '🤖' } }),
    prisma.competency.create({ data: { name: 'DevOps', description: 'Expertise in CI/CD, containerization, and infrastructure automation', category: 'Technical', icon: '⚙️' } }),
    prisma.competency.create({ data: { name: 'Leadership', description: 'Ability to lead teams, make strategic decisions, and inspire others', category: 'Soft Skills', icon: '👑' } }),
    prisma.competency.create({ data: { name: 'Communication', description: 'Effective verbal, written, and presentation communication skills', category: 'Soft Skills', icon: '💬' } }),
    prisma.competency.create({ data: { name: 'Software Engineering', description: 'Proficiency in software design patterns, clean code, and architecture', category: 'Technical', icon: '💻' } }),
    prisma.competency.create({ data: { name: 'Agile Methodologies', description: 'Knowledge of Scrum, Kanban, and agile project delivery frameworks', category: 'Management', icon: '🔄' } }),
  ]);

  const [dataAnalytics, cloudComputing, cybersecurity, projectMgmt, aiMl, devops, leadership, communication, softwareEng, agile] = competencies;

  // ========================================================================
  // ADMIN
  // ========================================================================
  console.log('  👤 Creating admin...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@capacityconnect.com',
      name: 'System Administrator',
      passwordHash: hash('admin123'),
      role: 'ADMIN',
      status: 'APPROVED',
      bio: 'Platform administrator for Capacity Connect',
      skills: JSON.stringify(['Platform Management', 'Analytics', 'User Management']),
      qualifications: JSON.stringify(['MBA', 'PMP']),
      interests: JSON.stringify(['Organizational Development', 'EdTech']),
      experienceYears: 15,
    },
  });

  // ========================================================================
  // TRAINERS (5)
  // ========================================================================
  console.log('  🎓 Creating trainers...');
  const trainers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'priya.sharma@example.com',
        name: 'Priya Sharma',
        passwordHash: hash('trainer123'),
        role: 'TRAINER',
        status: 'APPROVED',
        bio: 'Senior Data Scientist with 12+ years of experience in analytics and ML. Former lead at top tech companies.',
        skills: JSON.stringify(['Python', 'R', 'SQL', 'Tableau', 'Power BI', 'TensorFlow', 'Statistics']),
        qualifications: JSON.stringify(['PhD Data Science', 'MS Statistics', 'Google Cloud Certified']),
        interests: JSON.stringify(['Deep Learning', 'NLP', 'Data Visualization']),
        experienceYears: 12,
        trainerProfile: {
          create: {
            expertise: JSON.stringify(['Data Analytics', 'Machine Learning', 'Statistical Modeling', 'Data Visualization']),
            certifications: JSON.stringify(['Google Professional Data Engineer', 'AWS ML Specialty', 'Tableau Desktop Specialist']),
            rating: 4.8,
            totalReviews: 156,
            available: true,
            specialization: 'Data Science & Analytics',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'rajesh.kumar@example.com',
        name: 'Rajesh Kumar',
        passwordHash: hash('trainer123'),
        role: 'TRAINER',
        status: 'APPROVED',
        bio: 'Cloud Solutions Architect with expertise in AWS, Azure, and GCP. Helped 50+ organizations migrate to cloud.',
        skills: JSON.stringify(['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'Docker']),
        qualifications: JSON.stringify(['MS Computer Science', 'AWS Solutions Architect Professional']),
        interests: JSON.stringify(['Multi-Cloud', 'Serverless', 'Cloud Security']),
        experienceYears: 10,
        trainerProfile: {
          create: {
            expertise: JSON.stringify(['Cloud Computing', 'DevOps', 'Infrastructure', 'Kubernetes']),
            certifications: JSON.stringify(['AWS Solutions Architect Professional', 'Azure Solutions Architect', 'CKA', 'Terraform Associate']),
            rating: 4.6,
            totalReviews: 98,
            available: true,
            specialization: 'Cloud Architecture & DevOps',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'anita.desai@example.com',
        name: 'Anita Desai',
        passwordHash: hash('trainer123'),
        role: 'TRAINER',
        status: 'APPROVED',
        bio: 'Cybersecurity Expert and Ethical Hacker. CISO at a leading fintech company. Published author on security frameworks.',
        skills: JSON.stringify(['Penetration Testing', 'SIEM', 'Incident Response', 'Risk Assessment', 'Compliance']),
        qualifications: JSON.stringify(['MS Cybersecurity', 'CISSP', 'CEH', 'CISM']),
        interests: JSON.stringify(['Zero Trust', 'Threat Intelligence', 'Security Automation']),
        experienceYears: 14,
        trainerProfile: {
          create: {
            expertise: JSON.stringify(['Cybersecurity', 'Risk Management', 'Compliance', 'Ethical Hacking']),
            certifications: JSON.stringify(['CISSP', 'CEH', 'CISM', 'CompTIA Security+']),
            rating: 4.9,
            totalReviews: 134,
            available: true,
            specialization: 'Cybersecurity & Risk Management',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'vikram.patel@example.com',
        name: 'Vikram Patel',
        passwordHash: hash('trainer123'),
        role: 'TRAINER',
        status: 'APPROVED',
        bio: 'Agile Coach and PMP-certified Project Manager. Led digital transformation at Fortune 500 companies.',
        skills: JSON.stringify(['Scrum', 'Kanban', 'SAFe', 'JIRA', 'Stakeholder Management', 'Risk Management']),
        qualifications: JSON.stringify(['MBA Operations', 'PMP', 'SAFe Agilist', 'Scrum Master']),
        interests: JSON.stringify(['Lean Management', 'Change Management', 'Team Building']),
        experienceYears: 11,
        trainerProfile: {
          create: {
            expertise: JSON.stringify(['Project Management', 'Agile Methodologies', 'Leadership', 'Stakeholder Management']),
            certifications: JSON.stringify(['PMP', 'SAFe 6.0 Agilist', 'PSM II', 'PRINCE2']),
            rating: 4.7,
            totalReviews: 112,
            available: true,
            specialization: 'Project Management & Agile',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'meera.nair@example.com',
        name: 'Meera Nair',
        passwordHash: hash('trainer123'),
        role: 'TRAINER',
        status: 'APPROVED',
        bio: 'Full-Stack Software Engineer and Tech Lead. Speaker at international conferences on software architecture.',
        skills: JSON.stringify(['React', 'Node.js', 'Python', 'System Design', 'Microservices', 'GraphQL']),
        qualifications: JSON.stringify(['MS Software Engineering', 'Google Cloud Architect']),
        interests: JSON.stringify(['Clean Architecture', 'DDD', 'Performance Engineering']),
        experienceYears: 9,
        trainerProfile: {
          create: {
            expertise: JSON.stringify(['Software Engineering', 'System Design', 'Full-Stack Development', 'AI & Machine Learning']),
            certifications: JSON.stringify(['Google Cloud Professional Architect', 'MongoDB Certified Developer', 'React Certification']),
            rating: 4.5,
            totalReviews: 87,
            available: true,
            specialization: 'Software Engineering & Architecture',
          },
        },
      },
    }),
  ]);

  const [priya, rajesh, anita, vikram, meera] = trainers;

  // ========================================================================
  // TRAINEES (10)
  // ========================================================================
  console.log('  👥 Creating trainees...');
  const trainees = await Promise.all([
    prisma.user.create({
      data: {
        email: 'rahul.kumar@example.com', name: 'Rahul Kumar', passwordHash: hash('trainee123'),
        role: 'TRAINEE', status: 'APPROVED',
        bio: 'Junior software developer eager to upskill in cloud and data analytics',
        skills: JSON.stringify(['JavaScript', 'HTML', 'CSS', 'Basic SQL']),
        qualifications: JSON.stringify(['B.Tech Computer Science']),
        interests: JSON.stringify(['Cloud Computing', 'Data Analytics', 'Full Stack']),
        experienceYears: 2,
      },
    }),
    prisma.user.create({
      data: {
        email: 'sneha.gupta@example.com', name: 'Sneha Gupta', passwordHash: hash('trainee123'),
        role: 'TRAINEE', status: 'APPROVED',
        bio: 'Marketing analyst transitioning to data science. Passionate about ML.',
        skills: JSON.stringify(['Excel', 'Google Analytics', 'Basic Python', 'SQL']),
        qualifications: JSON.stringify(['BBA Marketing', 'Google Analytics Certificate']),
        interests: JSON.stringify(['Data Analytics', 'Machine Learning', 'Visualization']),
        experienceYears: 3,
      },
    }),
    prisma.user.create({
      data: {
        email: 'arjun.singh@example.com', name: 'Arjun Singh', passwordHash: hash('trainee123'),
        role: 'TRAINEE', status: 'APPROVED',
        bio: 'System administrator looking to transition into DevOps and cloud engineering',
        skills: JSON.stringify(['Linux', 'Networking', 'Bash', 'Basic AWS']),
        qualifications: JSON.stringify(['B.Tech IT', 'CompTIA A+']),
        interests: JSON.stringify(['DevOps', 'Cloud Computing', 'Cybersecurity']),
        experienceYears: 4,
      },
    }),
    prisma.user.create({
      data: {
        email: 'kavitha.rao@example.com', name: 'Kavitha Rao', passwordHash: hash('trainee123'),
        role: 'TRAINEE', status: 'APPROVED',
        bio: 'Project coordinator aspiring to become a certified project manager',
        skills: JSON.stringify(['MS Project', 'JIRA', 'Communication', 'Documentation']),
        qualifications: JSON.stringify(['MBA General', 'CAPM']),
        interests: JSON.stringify(['Project Management', 'Agile', 'Leadership']),
        experienceYears: 5,
      },
    }),
    prisma.user.create({
      data: {
        email: 'amit.joshi@example.com', name: 'Amit Joshi', passwordHash: hash('trainee123'),
        role: 'TRAINEE', status: 'APPROVED',
        bio: 'Backend developer interested in AI/ML and software architecture',
        skills: JSON.stringify(['Python', 'Java', 'PostgreSQL', 'REST APIs']),
        qualifications: JSON.stringify(['M.Tech Computer Science']),
        interests: JSON.stringify(['AI & Machine Learning', 'Software Engineering', 'Cloud Computing']),
        experienceYears: 3,
      },
    }),
    prisma.user.create({
      data: {
        email: 'deepa.menon@example.com', name: 'Deepa Menon', passwordHash: hash('trainee123'),
        role: 'TRAINEE', status: 'APPROVED',
        bio: 'HR professional exploring digital transformation and data-driven HR',
        skills: JSON.stringify(['People Management', 'MS Office', 'Basic Analytics']),
        qualifications: JSON.stringify(['MBA HR', 'SHRM-CP']),
        interests: JSON.stringify(['Leadership', 'Communication', 'Data Analytics']),
        experienceYears: 7,
      },
    }),
    prisma.user.create({
      data: {
        email: 'sanjay.verma@example.com', name: 'Sanjay Verma', passwordHash: hash('trainee123'),
        role: 'TRAINEE', status: 'APPROVED',
        bio: 'IT support engineer aiming to specialize in cybersecurity',
        skills: JSON.stringify(['Windows Server', 'Networking', 'Help Desk', 'Basic Security']),
        qualifications: JSON.stringify(['B.Sc IT', 'ITIL Foundation']),
        interests: JSON.stringify(['Cybersecurity', 'Cloud Computing', 'DevOps']),
        experienceYears: 4,
      },
    }),
    prisma.user.create({
      data: {
        email: 'nisha.reddy@example.com', name: 'Nisha Reddy', passwordHash: hash('trainee123'),
        role: 'TRAINEE', status: 'APPROVED',
        bio: 'Frontend developer keen on learning full-stack and software architecture',
        skills: JSON.stringify(['React', 'TypeScript', 'CSS', 'UI/UX']),
        qualifications: JSON.stringify(['B.Tech Computer Science']),
        interests: JSON.stringify(['Software Engineering', 'DevOps', 'Agile Methodologies']),
        experienceYears: 2,
      },
    }),
    prisma.user.create({
      data: {
        email: 'rohan.mehta@example.com', name: 'Rohan Mehta', passwordHash: hash('trainee123'),
        role: 'TRAINEE', status: 'APPROVED',
        bio: 'Business analyst transitioning to product management with data skills',
        skills: JSON.stringify(['Excel', 'SQL', 'Tableau', 'Business Analysis']),
        qualifications: JSON.stringify(['BBA Finance', 'Lean Six Sigma Green Belt']),
        interests: JSON.stringify(['Data Analytics', 'Project Management', 'Communication']),
        experienceYears: 5,
      },
    }),
    prisma.user.create({
      data: {
        email: 'pooja.iyer@example.com', name: 'Pooja Iyer', passwordHash: hash('trainee123'),
        role: 'TRAINEE', status: 'PENDING',
        bio: 'Fresh graduate looking to start career in tech',
        skills: JSON.stringify(['C++', 'Basic Python', 'HTML']),
        qualifications: JSON.stringify(['B.Tech Computer Science']),
        interests: JSON.stringify(['Software Engineering', 'AI & Machine Learning']),
        experienceYears: 0,
      },
    }),
  ]);

  const [rahul, sneha, arjun, kavitha, amit, deepa, sanjay, nisha, rohan, pooja] = trainees;

  // ========================================================================
  // COURSES (10)
  // ========================================================================
  console.log('  📚 Creating courses...');
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: 'Data Analytics Fundamentals',
        description: 'Master the foundations of data analytics including data collection, cleaning, analysis, and visualization. Learn to use Python, SQL, and popular BI tools to derive actionable insights from raw data.',
        trainerId: priya.id, competencyId: dataAnalytics.id,
        difficulty: 'BEGINNER', durationHours: 20,
        tags: JSON.stringify(['Python', 'SQL', 'Visualization', 'Statistics']),
        thumbnail: '/images/courses/data-analytics.jpg',
      },
    }),
    prisma.course.create({
      data: {
        title: 'Advanced Machine Learning',
        description: 'Deep dive into supervised and unsupervised learning, neural networks, NLP, and model deployment. Hands-on projects with real-world datasets.',
        trainerId: priya.id, competencyId: aiMl.id,
        difficulty: 'ADVANCED', durationHours: 40,
        tags: JSON.stringify(['TensorFlow', 'PyTorch', 'NLP', 'Deep Learning']),
        thumbnail: '/images/courses/machine-learning.jpg',
      },
    }),
    prisma.course.create({
      data: {
        title: 'AWS Cloud Practitioner to Architect',
        description: 'Comprehensive journey from cloud basics to architecting scalable solutions on AWS. Covers EC2, S3, Lambda, VPC, and more with hands-on labs.',
        trainerId: rajesh.id, competencyId: cloudComputing.id,
        difficulty: 'INTERMEDIATE', durationHours: 35,
        tags: JSON.stringify(['AWS', 'EC2', 'S3', 'Lambda', 'VPC']),
        thumbnail: '/images/courses/aws-cloud.jpg',
      },
    }),
    prisma.course.create({
      data: {
        title: 'DevOps Engineering with Docker & Kubernetes',
        description: 'Learn containerization, orchestration, CI/CD pipelines, and infrastructure as code. Build production-ready deployment pipelines.',
        trainerId: rajesh.id, competencyId: devops.id,
        difficulty: 'INTERMEDIATE', durationHours: 30,
        tags: JSON.stringify(['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform']),
        thumbnail: '/images/courses/devops.jpg',
      },
    }),
    prisma.course.create({
      data: {
        title: 'Cybersecurity Essentials',
        description: 'Understand threat landscapes, security frameworks, ethical hacking basics, and incident response. Prepare for security certifications.',
        trainerId: anita.id, competencyId: cybersecurity.id,
        difficulty: 'BEGINNER', durationHours: 25,
        tags: JSON.stringify(['Security', 'Ethical Hacking', 'Risk Assessment', 'NIST']),
        thumbnail: '/images/courses/cybersecurity.jpg',
      },
    }),
    prisma.course.create({
      data: {
        title: 'Advanced Threat Detection & Response',
        description: 'Master SIEM tools, threat hunting, malware analysis, and advanced incident response techniques used by security operations centers.',
        trainerId: anita.id, competencyId: cybersecurity.id,
        difficulty: 'ADVANCED', durationHours: 35,
        tags: JSON.stringify(['SIEM', 'Threat Hunting', 'Malware Analysis', 'SOC']),
        thumbnail: '/images/courses/threat-detection.jpg',
      },
    }),
    prisma.course.create({
      data: {
        title: 'PMP Certification Prep & Project Leadership',
        description: 'Comprehensive PMP exam preparation with real-world project management scenarios. Master the PMBOK Guide and project lifecycle management.',
        trainerId: vikram.id, competencyId: projectMgmt.id,
        difficulty: 'INTERMEDIATE', durationHours: 30,
        tags: JSON.stringify(['PMP', 'PMBOK', 'Risk Management', 'Stakeholders']),
        thumbnail: '/images/courses/project-management.jpg',
      },
    }),
    prisma.course.create({
      data: {
        title: 'Agile & Scrum Mastery',
        description: 'Become proficient in Agile methodologies including Scrum, Kanban, and SAFe. Learn sprint planning, retrospectives, and agile leadership.',
        trainerId: vikram.id, competencyId: agile.id,
        difficulty: 'BEGINNER', durationHours: 20,
        tags: JSON.stringify(['Scrum', 'Kanban', 'SAFe', 'Sprint Planning']),
        thumbnail: '/images/courses/agile.jpg',
      },
    }),
    prisma.course.create({
      data: {
        title: 'Full-Stack Software Architecture',
        description: 'Design scalable software systems using clean architecture, microservices, event-driven design, and modern full-stack technologies.',
        trainerId: meera.id, competencyId: softwareEng.id,
        difficulty: 'ADVANCED', durationHours: 45,
        tags: JSON.stringify(['System Design', 'Microservices', 'React', 'Node.js']),
        thumbnail: '/images/courses/software-arch.jpg',
      },
    }),
    prisma.course.create({
      data: {
        title: 'Effective Business Communication',
        description: 'Develop professional communication skills including presentations, writing, negotiation, and cross-cultural communication for the tech industry.',
        trainerId: vikram.id, competencyId: communication.id,
        difficulty: 'BEGINNER', durationHours: 15,
        tags: JSON.stringify(['Presentations', 'Writing', 'Negotiation', 'Public Speaking']),
        thumbnail: '/images/courses/communication.jpg',
      },
    }),
  ]);

  const [cDataAnalytics, cML, cAWS, cDevOps, cCyberBasic, cCyberAdv, cPMP, cAgile, cSoftArch, cComm] = courses;

  // ========================================================================
  // RESOURCES
  // ========================================================================
  console.log('  📎 Creating resources...');
  const resourceData = [
    // Data Analytics Fundamentals
    { courseId: cDataAnalytics.id, title: 'Introduction to Data Analytics', type: 'VIDEO', url: 'https://example.com/videos/intro-analytics.mp4', orderIndex: 1, durationMinutes: 45 },
    { courseId: cDataAnalytics.id, title: 'Python for Data Analysis - PDF Guide', type: 'PDF', url: '/uploads/python-data-guide.pdf', orderIndex: 2, durationMinutes: 30 },
    { courseId: cDataAnalytics.id, title: 'SQL Fundamentals Presentation', type: 'PRESENTATION', url: '/uploads/sql-fundamentals.pptx', orderIndex: 3, durationMinutes: 60 },
    { courseId: cDataAnalytics.id, title: 'Hands-on: Building Your First Dashboard', type: 'VIDEO', url: 'https://example.com/videos/first-dashboard.mp4', orderIndex: 4, durationMinutes: 90 },
    // Advanced ML
    { courseId: cML.id, title: 'Neural Networks Deep Dive', type: 'VIDEO', url: 'https://example.com/videos/neural-networks.mp4', orderIndex: 1, durationMinutes: 120 },
    { courseId: cML.id, title: 'TensorFlow Getting Started Guide', type: 'PDF', url: '/uploads/tensorflow-guide.pdf', orderIndex: 2, durationMinutes: 45 },
    { courseId: cML.id, title: 'NLP with Transformers', type: 'PRESENTATION', url: '/uploads/nlp-transformers.pptx', orderIndex: 3, durationMinutes: 90 },
    // AWS Cloud
    { courseId: cAWS.id, title: 'AWS Core Services Overview', type: 'VIDEO', url: 'https://example.com/videos/aws-core.mp4', orderIndex: 1, durationMinutes: 60 },
    { courseId: cAWS.id, title: 'Cloud Architecture Best Practices', type: 'PDF', url: '/uploads/cloud-arch.pdf', orderIndex: 2, durationMinutes: 40 },
    { courseId: cAWS.id, title: 'Hands-on: Deploy a Serverless App', type: 'VIDEO', url: 'https://example.com/videos/serverless-lab.mp4', orderIndex: 3, durationMinutes: 75 },
    // DevOps
    { courseId: cDevOps.id, title: 'Docker Fundamentals', type: 'VIDEO', url: 'https://example.com/videos/docker-basics.mp4', orderIndex: 1, durationMinutes: 60 },
    { courseId: cDevOps.id, title: 'Kubernetes in Production', type: 'PRESENTATION', url: '/uploads/k8s-production.pptx', orderIndex: 2, durationMinutes: 90 },
    // Cybersecurity
    { courseId: cCyberBasic.id, title: 'Security Threat Landscape 2024', type: 'VIDEO', url: 'https://example.com/videos/threat-landscape.mp4', orderIndex: 1, durationMinutes: 50 },
    { courseId: cCyberBasic.id, title: 'NIST Framework Guide', type: 'PDF', url: '/uploads/nist-guide.pdf', orderIndex: 2, durationMinutes: 35 },
    // PMP
    { courseId: cPMP.id, title: 'PMBOK Overview Presentation', type: 'PRESENTATION', url: '/uploads/pmbok-overview.pptx', orderIndex: 1, durationMinutes: 60 },
    { courseId: cPMP.id, title: 'Project Planning Deep Dive', type: 'VIDEO', url: 'https://example.com/videos/project-planning.mp4', orderIndex: 2, durationMinutes: 90 },
    // Agile
    { courseId: cAgile.id, title: 'Scrum Framework Explained', type: 'VIDEO', url: 'https://example.com/videos/scrum-framework.mp4', orderIndex: 1, durationMinutes: 45 },
    { courseId: cAgile.id, title: 'Agile Manifesto & Principles', type: 'PDF', url: '/uploads/agile-manifesto.pdf', orderIndex: 2, durationMinutes: 20 },
    // Software Architecture
    { courseId: cSoftArch.id, title: 'Clean Architecture Principles', type: 'VIDEO', url: 'https://example.com/videos/clean-arch.mp4', orderIndex: 1, durationMinutes: 75 },
    { courseId: cSoftArch.id, title: 'Microservices Design Patterns', type: 'PDF', url: '/uploads/microservices-patterns.pdf', orderIndex: 2, durationMinutes: 45 },
    // Communication
    { courseId: cComm.id, title: 'Presentation Skills Masterclass', type: 'VIDEO', url: 'https://example.com/videos/presentation-skills.mp4', orderIndex: 1, durationMinutes: 55 },
    { courseId: cComm.id, title: 'Business Writing Essentials', type: 'PDF', url: '/uploads/business-writing.pdf', orderIndex: 2, durationMinutes: 30 },
  ];

  for (const r of resourceData) {
    await prisma.resource.create({ data: r });
  }

  // ========================================================================
  // ENROLLMENTS
  // ========================================================================
  console.log('  📝 Creating enrollments...');
  const enrollmentData = [
    { userId: rahul.id, courseId: cDataAnalytics.id, status: 'COMPLETED', progress: 100, completedAt: new Date('2024-08-15') },
    { userId: rahul.id, courseId: cAWS.id, status: 'IN_PROGRESS', progress: 65 },
    { userId: rahul.id, courseId: cAgile.id, status: 'ENROLLED', progress: 10 },
    { userId: sneha.id, courseId: cDataAnalytics.id, status: 'COMPLETED', progress: 100, completedAt: new Date('2024-07-20') },
    { userId: sneha.id, courseId: cML.id, status: 'IN_PROGRESS', progress: 45 },
    { userId: arjun.id, courseId: cDevOps.id, status: 'IN_PROGRESS', progress: 70 },
    { userId: arjun.id, courseId: cAWS.id, status: 'COMPLETED', progress: 100, completedAt: new Date('2024-09-01') },
    { userId: arjun.id, courseId: cCyberBasic.id, status: 'ENROLLED', progress: 20 },
    { userId: kavitha.id, courseId: cPMP.id, status: 'IN_PROGRESS', progress: 80 },
    { userId: kavitha.id, courseId: cAgile.id, status: 'COMPLETED', progress: 100, completedAt: new Date('2024-06-10') },
    { userId: kavitha.id, courseId: cComm.id, status: 'IN_PROGRESS', progress: 55 },
    { userId: amit.id, courseId: cML.id, status: 'IN_PROGRESS', progress: 60 },
    { userId: amit.id, courseId: cSoftArch.id, status: 'ENROLLED', progress: 15 },
    { userId: deepa.id, courseId: cComm.id, status: 'COMPLETED', progress: 100, completedAt: new Date('2024-08-01') },
    { userId: deepa.id, courseId: cDataAnalytics.id, status: 'IN_PROGRESS', progress: 40 },
    { userId: sanjay.id, courseId: cCyberBasic.id, status: 'IN_PROGRESS', progress: 75 },
    { userId: sanjay.id, courseId: cAWS.id, status: 'ENROLLED', progress: 5 },
    { userId: nisha.id, courseId: cSoftArch.id, status: 'IN_PROGRESS', progress: 50 },
    { userId: nisha.id, courseId: cDevOps.id, status: 'ENROLLED', progress: 10 },
    { userId: rohan.id, courseId: cDataAnalytics.id, status: 'COMPLETED', progress: 100, completedAt: new Date('2024-07-30') },
    { userId: rohan.id, courseId: cPMP.id, status: 'IN_PROGRESS', progress: 35 },
    { userId: rohan.id, courseId: cComm.id, status: 'ENROLLED', progress: 25 },
  ];

  for (const e of enrollmentData) {
    await prisma.enrollment.create({ data: e });
  }

  // ========================================================================
  // COMPETENCY SCORES
  // ========================================================================
  console.log('  📈 Creating competency scores...');
  const scoreData = [
    // Rahul
    { userId: rahul.id, competencyId: dataAnalytics.id, score: 72, level: 'ADVANCED' },
    { userId: rahul.id, competencyId: cloudComputing.id, score: 45, level: 'PROFICIENT' },
    { userId: rahul.id, competencyId: softwareEng.id, score: 55, level: 'PROFICIENT' },
    { userId: rahul.id, competencyId: agile.id, score: 20, level: 'BEGINNER' },
    { userId: rahul.id, competencyId: cybersecurity.id, score: 15, level: 'BEGINNER' },
    // Sneha
    { userId: sneha.id, competencyId: dataAnalytics.id, score: 68, level: 'ADVANCED' },
    { userId: sneha.id, competencyId: aiMl.id, score: 35, level: 'DEVELOPING' },
    { userId: sneha.id, competencyId: communication.id, score: 60, level: 'PROFICIENT' },
    // Arjun
    { userId: arjun.id, competencyId: devops.id, score: 58, level: 'PROFICIENT' },
    { userId: arjun.id, competencyId: cloudComputing.id, score: 75, level: 'ADVANCED' },
    { userId: arjun.id, competencyId: cybersecurity.id, score: 30, level: 'DEVELOPING' },
    // Kavitha
    { userId: kavitha.id, competencyId: projectMgmt.id, score: 70, level: 'ADVANCED' },
    { userId: kavitha.id, competencyId: agile.id, score: 82, level: 'EXPERT' },
    { userId: kavitha.id, competencyId: communication.id, score: 48, level: 'PROFICIENT' },
    { userId: kavitha.id, competencyId: leadership.id, score: 40, level: 'DEVELOPING' },
    // Amit
    { userId: amit.id, competencyId: aiMl.id, score: 52, level: 'PROFICIENT' },
    { userId: amit.id, competencyId: softwareEng.id, score: 65, level: 'ADVANCED' },
    { userId: amit.id, competencyId: cloudComputing.id, score: 28, level: 'DEVELOPING' },
    // Deepa
    { userId: deepa.id, competencyId: communication.id, score: 85, level: 'EXPERT' },
    { userId: deepa.id, competencyId: leadership.id, score: 62, level: 'ADVANCED' },
    { userId: deepa.id, competencyId: dataAnalytics.id, score: 32, level: 'DEVELOPING' },
    // Sanjay
    { userId: sanjay.id, competencyId: cybersecurity.id, score: 55, level: 'PROFICIENT' },
    { userId: sanjay.id, competencyId: cloudComputing.id, score: 22, level: 'DEVELOPING' },
    { userId: sanjay.id, competencyId: devops.id, score: 18, level: 'BEGINNER' },
    // Nisha
    { userId: nisha.id, competencyId: softwareEng.id, score: 48, level: 'PROFICIENT' },
    { userId: nisha.id, competencyId: devops.id, score: 15, level: 'BEGINNER' },
    { userId: nisha.id, competencyId: agile.id, score: 35, level: 'DEVELOPING' },
    // Rohan
    { userId: rohan.id, competencyId: dataAnalytics.id, score: 78, level: 'ADVANCED' },
    { userId: rohan.id, competencyId: projectMgmt.id, score: 38, level: 'DEVELOPING' },
    { userId: rohan.id, competencyId: communication.id, score: 42, level: 'PROFICIENT' },
  ];

  for (const s of scoreData) {
    await prisma.competencyScore.create({ data: s });
  }

  // ========================================================================
  // ASSESSMENTS + QUESTIONS
  // ========================================================================
  console.log('  📝 Creating assessments and questions...');

  // Data Analytics Assessment
  const aDataAnalytics = await prisma.assessment.create({
    data: {
      courseId: cDataAnalytics.id,
      title: 'Data Analytics Fundamentals Assessment',
      passingScore: 60,
      timeLimitMinutes: 20,
      deadline: new Date('2025-12-31'),
    },
  });

  const daQuestions = [
    { assessmentId: aDataAnalytics.id, questionText: 'Which Python library is primarily used for data manipulation and analysis?', options: JSON.stringify(['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn']), correctOption: 1, points: 10, orderIndex: 1 },
    { assessmentId: aDataAnalytics.id, questionText: 'What does SQL stand for?', options: JSON.stringify(['Simple Query Language', 'Structured Query Language', 'Standard Question Language', 'Sequential Query Logic']), correctOption: 1, points: 10, orderIndex: 2 },
    { assessmentId: aDataAnalytics.id, questionText: 'Which type of chart is best for showing trends over time?', options: JSON.stringify(['Pie Chart', 'Bar Chart', 'Line Chart', 'Scatter Plot']), correctOption: 2, points: 10, orderIndex: 3 },
    { assessmentId: aDataAnalytics.id, questionText: 'What is the purpose of data normalization?', options: JSON.stringify(['To delete duplicate data', 'To scale data to a standard range', 'To encrypt sensitive data', 'To compress data files']), correctOption: 1, points: 10, orderIndex: 4 },
    { assessmentId: aDataAnalytics.id, questionText: 'Which measure of central tendency is most affected by outliers?', options: JSON.stringify(['Median', 'Mode', 'Mean', 'Range']), correctOption: 2, points: 10, orderIndex: 5 },
    { assessmentId: aDataAnalytics.id, questionText: 'What is a JOIN in SQL used for?', options: JSON.stringify(['Sorting data', 'Combining rows from two or more tables', 'Creating new tables', 'Deleting records']), correctOption: 1, points: 10, orderIndex: 6 },
    { assessmentId: aDataAnalytics.id, questionText: 'Which visualization tool is developed by Tableau Software?', options: JSON.stringify(['Power BI', 'Looker', 'Tableau Desktop', 'QlikView']), correctOption: 2, points: 10, orderIndex: 7 },
    { assessmentId: aDataAnalytics.id, questionText: 'What does ETL stand for in data processing?', options: JSON.stringify(['Extract, Transform, Load', 'Evaluate, Test, Launch', 'Enter, Track, Log', 'Export, Transfer, Link']), correctOption: 0, points: 10, orderIndex: 8 },
  ];

  for (const q of daQuestions) {
    await prisma.question.create({ data: q });
  }

  // ML Assessment
  const aML = await prisma.assessment.create({
    data: {
      courseId: cML.id,
      title: 'Advanced Machine Learning Assessment',
      passingScore: 70,
      timeLimitMinutes: 30,
      deadline: new Date('2025-12-31'),
    },
  });

  const mlQuestions = [
    { assessmentId: aML.id, questionText: 'What is the vanishing gradient problem?', options: JSON.stringify(['Gradients become too large', 'Gradients approach zero in deep networks', 'Loss function becomes zero', 'Learning rate is too high']), correctOption: 1, points: 10, orderIndex: 1 },
    { assessmentId: aML.id, questionText: 'Which activation function is commonly used in hidden layers of deep networks?', options: JSON.stringify(['Sigmoid', 'ReLU', 'Softmax', 'Step Function']), correctOption: 1, points: 10, orderIndex: 2 },
    { assessmentId: aML.id, questionText: 'What is the purpose of dropout regularization?', options: JSON.stringify(['Speed up training', 'Prevent overfitting', 'Increase model capacity', 'Reduce underfitting']), correctOption: 1, points: 10, orderIndex: 3 },
    { assessmentId: aML.id, questionText: 'Which architecture is best suited for sequence data?', options: JSON.stringify(['CNN', 'RNN/LSTM', 'GAN', 'Autoencoder']), correctOption: 1, points: 10, orderIndex: 4 },
    { assessmentId: aML.id, questionText: 'What does BERT stand for?', options: JSON.stringify(['Binary Encoded Representation Technique', 'Bidirectional Encoder Representations from Transformers', 'Basic Embedding Retrieval Tool', 'Batch Evaluation & Recognition Transformer']), correctOption: 1, points: 10, orderIndex: 5 },
  ];

  for (const q of mlQuestions) {
    await prisma.question.create({ data: q });
  }

  // AWS Cloud Assessment
  const aAWS = await prisma.assessment.create({
    data: {
      courseId: cAWS.id,
      title: 'AWS Cloud Architecture Assessment',
      passingScore: 65,
      timeLimitMinutes: 25,
      deadline: new Date('2025-12-31'),
    },
  });

  const awsQuestions = [
    { assessmentId: aAWS.id, questionText: 'Which AWS service is used for object storage?', options: JSON.stringify(['EBS', 'S3', 'EFS', 'Glacier']), correctOption: 1, points: 10, orderIndex: 1 },
    { assessmentId: aAWS.id, questionText: 'What is the purpose of an AWS VPC?', options: JSON.stringify(['Content delivery', 'Virtual private network in the cloud', 'Database management', 'Container orchestration']), correctOption: 1, points: 10, orderIndex: 2 },
    { assessmentId: aAWS.id, questionText: 'Which service provides serverless computing on AWS?', options: JSON.stringify(['EC2', 'ECS', 'Lambda', 'Lightsail']), correctOption: 2, points: 10, orderIndex: 3 },
    { assessmentId: aAWS.id, questionText: 'What does the AWS shared responsibility model define?', options: JSON.stringify(['Pricing tiers', 'Security responsibilities between AWS and customer', 'Service availability', 'Data transfer costs']), correctOption: 1, points: 10, orderIndex: 4 },
    { assessmentId: aAWS.id, questionText: 'Which AWS service is a managed relational database?', options: JSON.stringify(['DynamoDB', 'RDS', 'ElastiCache', 'Redshift']), correctOption: 1, points: 10, orderIndex: 5 },
    { assessmentId: aAWS.id, questionText: 'What is AWS CloudFormation used for?', options: JSON.stringify(['Monitoring', 'Infrastructure as Code', 'Load Balancing', 'DNS Management']), correctOption: 1, points: 10, orderIndex: 6 },
  ];

  for (const q of awsQuestions) {
    await prisma.question.create({ data: q });
  }

  // Cybersecurity Assessment
  const aCyber = await prisma.assessment.create({
    data: {
      courseId: cCyberBasic.id,
      title: 'Cybersecurity Essentials Assessment',
      passingScore: 60,
      timeLimitMinutes: 20,
      deadline: new Date('2025-12-31'),
    },
  });

  const cyberQuestions = [
    { assessmentId: aCyber.id, questionText: 'What is the CIA triad in cybersecurity?', options: JSON.stringify(['Central Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Computer Incident Analysis', 'Critical Infrastructure Assessment']), correctOption: 1, points: 10, orderIndex: 1 },
    { assessmentId: aCyber.id, questionText: 'What type of attack uses social engineering to trick users?', options: JSON.stringify(['DDoS', 'SQL Injection', 'Phishing', 'Buffer Overflow']), correctOption: 2, points: 10, orderIndex: 2 },
    { assessmentId: aCyber.id, questionText: 'What is a firewall?', options: JSON.stringify(['Antivirus software', 'Network security device that filters traffic', 'Encryption algorithm', 'Backup system']), correctOption: 1, points: 10, orderIndex: 3 },
    { assessmentId: aCyber.id, questionText: 'What does SIEM stand for?', options: JSON.stringify(['Security Information and Event Management', 'System Integration and Error Monitoring', 'Secure Internet Email Management', 'Software Incident & Emergency Module']), correctOption: 0, points: 10, orderIndex: 4 },
    { assessmentId: aCyber.id, questionText: 'Which protocol provides secure web communication?', options: JSON.stringify(['HTTP', 'FTP', 'HTTPS', 'SMTP']), correctOption: 2, points: 10, orderIndex: 5 },
  ];

  for (const q of cyberQuestions) {
    await prisma.question.create({ data: q });
  }

  // PMP Assessment
  const aPMP = await prisma.assessment.create({
    data: {
      courseId: cPMP.id,
      title: 'Project Management Professional Assessment',
      passingScore: 65,
      timeLimitMinutes: 25,
      deadline: new Date('2025-12-31'),
    },
  });

  const pmpQuestions = [
    { assessmentId: aPMP.id, questionText: 'What are the five process groups in project management?', options: JSON.stringify(['Plan, Do, Check, Act, Close', 'Initiating, Planning, Executing, Monitoring & Controlling, Closing', 'Research, Design, Build, Test, Deploy', 'Scope, Time, Cost, Quality, Risk']), correctOption: 1, points: 10, orderIndex: 1 },
    { assessmentId: aPMP.id, questionText: 'What is the critical path in project management?', options: JSON.stringify(['The shortest path through the project', 'The longest sequence of dependent tasks', 'The path with most resources', 'The most expensive task sequence']), correctOption: 1, points: 10, orderIndex: 2 },
    { assessmentId: aPMP.id, questionText: 'What is a Work Breakdown Structure (WBS)?', options: JSON.stringify(['Team organization chart', 'Hierarchical decomposition of project deliverables', 'Budget allocation document', 'Risk assessment matrix']), correctOption: 1, points: 10, orderIndex: 3 },
    { assessmentId: aPMP.id, questionText: 'What does the term "scope creep" refer to?', options: JSON.stringify(['Project ahead of schedule', 'Uncontrolled expansion of project scope', 'Budget overrun', 'Staff turnover']), correctOption: 1, points: 10, orderIndex: 4 },
    { assessmentId: aPMP.id, questionText: 'Which chart shows task durations and dependencies visually?', options: JSON.stringify(['Pie Chart', 'Gantt Chart', 'Pareto Chart', 'Control Chart']), correctOption: 1, points: 10, orderIndex: 5 },
  ];

  for (const q of pmpQuestions) {
    await prisma.question.create({ data: q });
  }

  // Agile Assessment
  const aAgile = await prisma.assessment.create({
    data: {
      courseId: cAgile.id,
      title: 'Agile & Scrum Mastery Assessment',
      passingScore: 60,
      timeLimitMinutes: 15,
      deadline: new Date('2025-12-31'),
    },
  });

  const agileQuestions = [
    { assessmentId: aAgile.id, questionText: 'What is the typical length of a Scrum sprint?', options: JSON.stringify(['1 day', '1-4 weeks', '3 months', '6 months']), correctOption: 1, points: 10, orderIndex: 1 },
    { assessmentId: aAgile.id, questionText: 'Who is responsible for the product backlog in Scrum?', options: JSON.stringify(['Scrum Master', 'Product Owner', 'Development Team', 'Stakeholders']), correctOption: 1, points: 10, orderIndex: 2 },
    { assessmentId: aAgile.id, questionText: 'What is the purpose of a sprint retrospective?', options: JSON.stringify(['Plan the next sprint', 'Review completed work', 'Reflect on process improvement', 'Update requirements']), correctOption: 2, points: 10, orderIndex: 3 },
    { assessmentId: aAgile.id, questionText: 'What is a "user story" in Agile?', options: JSON.stringify(['Technical specification', 'Short description of a feature from end-user perspective', 'Bug report', 'Test case']), correctOption: 1, points: 10, orderIndex: 4 },
    { assessmentId: aAgile.id, questionText: 'What is the Kanban method primarily focused on?', options: JSON.stringify(['Time boxing', 'Visualizing workflow and limiting WIP', 'Daily standups', 'Sprint planning']), correctOption: 1, points: 10, orderIndex: 5 },
  ];

  for (const q of agileQuestions) {
    await prisma.question.create({ data: q });
  }

  // ========================================================================
  // ASSESSMENT ATTEMPTS
  // ========================================================================
  console.log('  ✅ Creating assessment attempts...');
  const attemptData = [
    { userId: rahul.id, assessmentId: aDataAnalytics.id, score: 87.5, passed: true, timeTakenSeconds: 720, completedAt: new Date('2024-08-15') },
    { userId: sneha.id, assessmentId: aDataAnalytics.id, score: 75, passed: true, timeTakenSeconds: 900, completedAt: new Date('2024-07-20') },
    { userId: arjun.id, assessmentId: aAWS.id, score: 83.3, passed: true, timeTakenSeconds: 1020, completedAt: new Date('2024-09-01') },
    { userId: kavitha.id, assessmentId: aAgile.id, score: 90, passed: true, timeTakenSeconds: 540, completedAt: new Date('2024-06-10') },
    { userId: deepa.id, assessmentId: aDataAnalytics.id, score: 50, passed: false, timeTakenSeconds: 1200, completedAt: new Date('2024-07-15') },
    { userId: rohan.id, assessmentId: aDataAnalytics.id, score: 87.5, passed: true, timeTakenSeconds: 660, completedAt: new Date('2024-07-30') },
  ];

  for (const a of attemptData) {
    await prisma.assessmentAttempt.create({ data: a });
  }

  // ========================================================================
  // CERTIFICATES
  // ========================================================================
  console.log('  🏆 Creating certificates...');
  const certData = [
    { userId: rahul.id, courseId: cDataAnalytics.id, certificateNumber: 'CC-DA-2024-001', issuedAt: new Date('2024-08-15') },
    { userId: sneha.id, courseId: cDataAnalytics.id, certificateNumber: 'CC-DA-2024-002', issuedAt: new Date('2024-07-20') },
    { userId: arjun.id, courseId: cAWS.id, certificateNumber: 'CC-AWS-2024-001', issuedAt: new Date('2024-09-01') },
    { userId: kavitha.id, courseId: cAgile.id, certificateNumber: 'CC-AGI-2024-001', issuedAt: new Date('2024-06-10') },
    { userId: deepa.id, courseId: cComm.id, certificateNumber: 'CC-COM-2024-001', issuedAt: new Date('2024-08-01') },
    { userId: rohan.id, courseId: cDataAnalytics.id, certificateNumber: 'CC-DA-2024-003', issuedAt: new Date('2024-07-30') },
  ];

  for (const c of certData) {
    await prisma.certificate.create({ data: c });
  }

  // ========================================================================
  // FEEDBACK
  // ========================================================================
  console.log('  💬 Creating feedback...');
  const feedbackData = [
    { userId: rahul.id, courseId: cDataAnalytics.id, rating: 5, comment: 'Excellent course! Priya explains complex concepts clearly. The hands-on projects were very valuable.' },
    { userId: sneha.id, courseId: cDataAnalytics.id, rating: 4, comment: 'Great foundational course. Would love more advanced visualization techniques.' },
    { userId: arjun.id, courseId: cAWS.id, rating: 5, comment: 'Rajesh is an amazing instructor. The lab exercises were practical and industry-relevant.' },
    { userId: kavitha.id, courseId: cAgile.id, rating: 4, comment: 'Well-structured course. The Scrum simulation exercises were the highlight.' },
    { userId: deepa.id, courseId: cComm.id, rating: 5, comment: 'Transformed my presentation skills. Highly recommend for all professionals.' },
    { userId: rohan.id, courseId: cDataAnalytics.id, rating: 5, comment: 'Best analytics course I have taken. Perfect blend of theory and practice.' },
    { userId: kavitha.id, courseId: cPMP.id, rating: 4, comment: 'Comprehensive PMP prep material. Vikram is very knowledgeable.' },
    { userId: nisha.id, courseId: cSoftArch.id, rating: 5, comment: 'Meera depth of knowledge in system design is incredible. Learned so much.' },
  ];

  for (const f of feedbackData) {
    await prisma.feedback.create({ data: f });
  }

  // ========================================================================
  // ANNOUNCEMENTS
  // ========================================================================
  console.log('  📢 Creating announcements...');
  await prisma.announcement.create({
    data: {
      adminId: admin.id,
      title: '🎉 New Cybersecurity Course Launch',
      content: 'We are excited to announce the launch of "Advanced Threat Detection & Response" by Anita Desai. Enroll now to enhance your security skills!',
      type: 'INFO',
    },
  });
  await prisma.announcement.create({
    data: {
      adminId: admin.id,
      title: '🏆 Top Performer: Kavitha Rao',
      content: 'Congratulations to Kavitha Rao for achieving Expert level in Agile Methodologies! She completed the certification with a score of 90%.',
      type: 'ACHIEVEMENT',
    },
  });
  await prisma.announcement.create({
    data: {
      adminId: admin.id,
      title: '⚠️ Platform Maintenance Scheduled',
      content: 'Capacity Connect will undergo scheduled maintenance on December 15th from 2:00 AM to 4:00 AM IST. Please save your work beforehand.',
      type: 'ALERT',
    },
  });

  // ========================================================================
  // NOTIFICATIONS
  // ========================================================================
  console.log('  🔔 Creating notifications...');
  const notificationData = [
    { userId: rahul.id, title: 'Course Recommendation', message: 'Based on your competency gaps, we recommend "AWS Cloud Practitioner to Architect"', link: '/trainee/recommendations' },
    { userId: rahul.id, title: 'Assessment Available', message: 'A new assessment is available for "Data Analytics Fundamentals"', link: '/trainee/assessments', read: true },
    { userId: sneha.id, title: 'Course Progress', message: 'You are 45% through "Advanced Machine Learning". Keep going!', link: '/trainee/courses' },
    { userId: arjun.id, title: 'Certificate Earned', message: 'Congratulations! You earned a certificate for "AWS Cloud Practitioner to Architect"', link: '/trainee/certificates' },
    { userId: kavitha.id, title: 'Competency Level Up!', message: 'You reached Expert level in Agile Methodologies!', link: '/trainee/competencies' },
  ];

  for (const n of notificationData) {
    await prisma.notification.create({ data: n });
  }

  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('📧 Demo Credentials:');
  console.log('  Admin:   admin@capacityconnect.com / admin123');
  console.log('  Trainer: priya.sharma@example.com / trainer123');
  console.log('  Trainee: rahul.kumar@example.com / trainee123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
