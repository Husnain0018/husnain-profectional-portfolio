-- =============================================================================
-- Ali Husnain Portfolio — Verified Initial Seed Data
-- =============================================================================

INSERT INTO public.profiles (
  full_name,
  professional_title,
  hero_heading,
  hero_subheadline,
  short_bio,
  about_content,
  career_objective,
  professional_interests,
  development_philosophy,
  current_learning_goals,
  location,
  country,
  email,
  phone,
  avatar_url,
  resume_url,
  availability_status,
  github_username
) VALUES (
  'Ali Husnain',
  'Full-Stack Web Developer | Web Designer | App Developer | AI & Automation Enthusiast',
  'Hi, I''m Ali Husnain.',
  'Full-Stack Web Developer Building Modern Digital Experiences.',
  'I build responsive websites, full-stack applications, intuitive dashboards, and technology-driven solutions. I enjoy transforming ideas into useful digital products through clean design and practical development.',
  'I am Ali Husnain, a Computer Science student and NAVTTC-certified Full-Stack Web Developer. I enjoy building modern websites, responsive web applications, management dashboards, mobile applications, and AI-powered digital solutions. My technical interests include frontend development, backend systems, modern web technologies, application development, and intelligent automation. I focus on creating useful, user-friendly, responsive, and practical digital experiences while continuously improving my development skills.',
  'To leverage hands-on project experience and technical problem-solving skills in full-stack JavaScript (MERN/MEAN), Python backend development, and AI workflow automation to deliver reliable, high-quality software solutions.',
  'Frontend Architecture, Scalable REST APIs, Full-Stack Web Applications, AI Workflow Automation (LLMs, Gemini API, n8n), Administrative Dashboards, and Cross-Platform App Development.',
  'Writing clean, maintainable code paired with accessible, intuitive user interfaces—prioritizing practical problem-solving, responsive design, and real-world usability over unnecessary complexity.',
  'Deepening expertise in Next.js App Router architecture, TypeScript system design, cloud-native PostgreSQL databases, and real-time multi-agent AI integrations.',
  'Gujranwala, Pakistan',
  'Pakistan',
  'hafizhusnain018@gmail.com',
  '+923171784724',
  '/uploads/ali_husnain_profile.jpg',
  '/uploads/Ali_Husnain_CV.pdf',
  'Available for Opportunities & Freelance Projects',
  'Husnain0018'
);

-- Education Seed
INSERT INTO public.education (degree, institution, location, start_date, end_date, description, display_order)
VALUES
  ('Bachelor of Science in Computer Science (BSCS)', 'University of Gujrat', 'Pakistan', '2024', 'Present', 'Pursuing undergraduate degree in Computer Science (Expected 2027 • CGPA: 3.0). Coursework and practical academic projects cover Data Structures & Algorithms (BST, AVL Trees, Doubly Linked Lists in C++), Object-Oriented Programming, Database Systems, and Software Engineering.', 1),
  ('Full Stack Web Development (MEAN / MERN)', 'Dev Valley (NAVTTC — Prime Minister''s Youth Skills Development Program)', 'Gujranwala, Pakistan', 'Sep 2025', 'Dec 2025', 'Completed intensive national vocational certification in JavaScript Full-Stack Web Development (Summer of Code B-II), achieving Grade A+.', 2);

-- Certifications Seed
INSERT INTO public.certifications (
  title, organization, program_name, institution, technology_track, issue_date, duration, grade, certificate_number, registration_number, certificate_url, credential_url, description, display_order
) VALUES
  (
    'Full Stack Web Development (JavaScript Fullstack MEAN/MERN)',
    'NAVTTC — National Vocational & Technical Training Commission',
    'Prime Minister''s Youth Skills Development Program (Summer of Code B-II)',
    'Dev Valley, Gujranwala',
    'MERN / MEAN Stack',
    '21 Jan 2026',
    '01/09/2025 – 30/12/2025',
    'A+',
    '0082620 (SOC-B2-01083377)',
    'P-25-1083377',
    '/uploads/navttc_certificate.jpg',
    NULL,
    'Awarded by the Government of Pakistan (NAVTTC) upon successful completion of the JavaScript Fullstack (MEAN/MERN) certificate course at Dev Valley, Gujranwala with A+ Grade.',
    1
  ),
  (
    'Experience Certificate — WordPress Developer & AI Automation Intern',
    'Innovate Technologies Global (Innovate Technologies Pakistan)',
    'Professional Internship Certificate',
    'Innovate Technologies, Gujranwala',
    'WordPress Development & AI Workflow Automation',
    '05 Sep 2026',
    'Feb 2026 – Aug 2026',
    'Verified',
    'DOC-2026-00011',
    NULL,
    '/uploads/innovate_experience_letter.jpg',
    'https://innovatetechglobal.com/verify-document/?id=DOC-2026-00011',
    'Official experience certificate confirming tenure as WordPress Developer & AI Automation Intern from February 2026 to August 2026.',
    2
  );
