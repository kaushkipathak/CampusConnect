-- ========================================================
-- CampusConnect Sample Demonstration Data
-- Password for all demo accounts: password123
-- BCrypt Hash: $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
-- ========================================================

USE campusconnect;

-- 1. SEED INTERESTS
INSERT INTO interests (id, name, slug, description) VALUES
(1, 'Artificial Intelligence', 'artificial-intelligence', 'Machine learning, deep learning, NLP, computer vision and LLMs'),
(2, 'Machine Learning', 'machine-learning', 'Predictive modeling, data analytics, neural networks'),
(3, 'Coding', 'coding', 'Competitive programming, web development, app development, algorithms'),
(4, 'Technology', 'technology', 'Emerging tech, robotics, IoT, cloud computing, cybersecurity'),
(5, 'Entrepreneurship', 'entrepreneurship', 'Startups, venture building, pitching, business models'),
(6, 'Business', 'business', 'Finance, consulting, strategy, commerce, marketing'),
(7, 'Management', 'management', 'Leadership, operations, project planning, team building'),
(8, 'Cultural Activities', 'cultural-activities', 'Music, dance, theatre, fashion, fine arts, photography'),
(9, 'Sports', 'sports', 'Football, cricket, basketball, badminton, athletics, chess'),
(10, 'Design', 'design', 'UI/UX design, graphic arts, industrial design, 3D modeling'),
(11, 'Social Impact', 'social-impact', 'Sustainability, volunteering, community outreach, NGO initiatives'),
(12, 'Innovation', 'innovation', 'Hackathons, patenting, research challenges, tech incubation');

-- 2. SEED EVENT CATEGORIES
INSERT INTO event_categories (id, name, slug, icon, description) VALUES
(1, 'Technical & Coding', 'technical-coding', 'Code', 'Hackathons, coding contests, bug-bounty hunts, and software workshops'),
(2, 'Workshops & Seminars', 'workshops-seminars', 'BookOpen', 'Hands-on masterclasses and industry guest speaker sessions'),
(3, 'Cultural & Arts', 'cultural-arts', 'Music', 'Concerts, dance showcases, dramatic plays, open-mics, and art exhibitions'),
(4, 'Entrepreneurship & Business', 'business-startup', 'Briefcase', 'Pitch fests, case-study competitions, angel talks, and startup expos'),
(5, 'Sports & Fitness', 'sports-fitness', 'Award', 'Inter-department leagues, track & field meets, chess, and esports'),
(6, 'Social & Volunteering', 'social-community', 'Heart', 'Blood drives, tree plantations, clean-up drives, and community camps');

-- 3. SEED USERS
-- Password for all demo accounts: password123
INSERT INTO users (id, full_name, email, password, role, avatar_url) VALUES
(1, 'Dean of Student Affairs', 'admin@campusconnect.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'COLLEGE_ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(2, 'Robotics & AI Club', 'robotics@campusconnect.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ORGANIZER', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150'),
(3, 'Cultural Affairs Council', 'cultural@campusconnect.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ORGANIZER', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
(4, 'E-Cell Entrepreneurship Club', 'ecell@campusconnect.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ORGANIZER', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
(5, 'Amit Kumar', 'amit.student@campusconnect.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'STUDENT', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'),
(6, 'Priya Sharma', 'priya.student@campusconnect.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'STUDENT', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150');

-- 4. SEED STUDENT PROFILES
INSERT INTO student_profiles (id, user_id, registration_number, department, year_of_study, bio, total_xp, current_level) VALUES
(1, 5, 'REG2023CS101', 'Computer Science & Engineering', 3, 'Passionate about Deep Learning, Web Dev and building open source tools.', 150, 'Explorer'),
(2, 6, 'REG2024EC204', 'Electronics & Communication', 2, 'Design enthusiast, musician and aspiring product builder.', 75, 'Novice');

-- 5. SEED STUDENT INTERESTS
-- Amit: AI, Machine Learning, Coding, Technology, Innovation
INSERT INTO student_interests (student_profile_id, interest_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 12);

-- Priya: Cultural Activities, Design, Entrepreneurship, Sports
INSERT INTO student_interests (student_profile_id, interest_id) VALUES
(2, 8), (2, 10), (2, 5), (2, 9);

-- 6. SEED BADGES
INSERT INTO badges (id, name, description, icon, required_events, required_xp, badge_type) VALUES
(1, 'First Step', 'Attended your first verified college event!', 'Footprints', 1, 50, 'GENERAL'),
(2, 'Explorer', 'Participated in at least 3 campus events.', 'Compass', 3, 150, 'GENERAL'),
(3, 'Campus Enthusiast', 'Active presence across 5 campus events.', 'Zap', 5, 250, 'GENERAL'),
(4, 'Active Participant', 'Legendary campus spirit with 10 verified events.', 'Trophy', 10, 500, 'GENERAL'),
(5, 'Tech Innovator', 'Engaged in high-impact technical hackathons.', 'Cpu', 2, 100, 'SPECIALTY'),
(6, 'Cultural Icon', 'Lit up the campus stage in arts & cultural showcases.', 'Sparkles', 2, 100, 'SPECIALTY');

-- 7. SEED EVENTS (12 Sample Events Across Diverse Categories and Statuses)
INSERT INTO events (id, title, description, category_id, organizer_id, poster_url, event_date, start_time, end_time, venue, eligibility, registration_deadline, max_capacity, current_registrations, status, rejection_reason, tags) VALUES
-- Approved Events
(1, 'CampusHack 2026: GenAI & Web3 Sprint', 
 'Join the biggest 24-hour hackathon of the semester! Build next-generation applications powered by generative AI and decentralized protocols. Mentors from top tech companies will guide teams. Free food, exciting swags, and a cash pool of $10,000 for top 3 teams.',
 1, 2, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800', 
 '2026-11-15', '09:00:00', '18:00:00', 'Auditorium Hall B, Tech Block', 'All B.Tech & M.Tech Students', '2026-11-14 23:59:59', 150, 1, 'APPROVED', NULL, 'Artificial Intelligence, Coding, Technology, Innovation'),

(2, 'Hands-on Deep Learning & Vision Masterclass',
 'A 4-hour immersive workshop covering Convolutional Neural Networks, Vision Transformers, and practical deployment using PyTorch and HuggingFace. Bring your laptop with Python 3.10+ pre-installed. Certificate of completion provided.',
 2, 2, 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800',
 '2026-11-20', '14:00:00', '18:00:00', 'CS Lab 3, Alan Turing Building', 'Open to 2nd, 3rd, and 4th year students', '2026-11-19 18:00:00', 60, 0, 'APPROVED', NULL, 'Artificial Intelligence, Machine Learning, Technology, Coding'),

(3, 'Aura 2026: Annual Inter-College Musical Night',
 'An electrifying evening of western music, classical fusion, vocal battles, and unplugged bands! Featuring renowned guest artists and our best campus vocalists. Food stalls and photo booths available across the venue.',
 3, 3, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
 '2026-11-25', '17:30:00', '22:00:00', 'Open Air Theatre (OAT)', 'Open to all university students & faculty', '2026-11-24 12:00:00', 500, 1, 'APPROVED', NULL, 'Cultural Activities, Design, Music'),

(4, 'Venture Pitch 2026: Student Startup Showcase',
 'Got an early-stage startup idea or prototype? Present your venture in front of seed angel investors, venture capitalists, and alumni founders. Selected startups receive $5,000 in cloud credits, incubator space, and mentorship.',
 4, 4, 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
 '2026-11-28', '10:00:00', '16:00:00', 'Management Block Seminar Hall 1', 'Open to all students with prototype or deck', '2026-11-27 17:00:00', 80, 0, 'APPROVED', NULL, 'Entrepreneurship, Business, Management, Innovation'),

(5, 'Inter-Department Futsal Championship',
 'Annual high-speed 5v5 indoor football tournament! Trophies, medals, and best player awards up for grabs. Teams must register with their official department team rosters (5 players + 2 substitutes).',
 5, 3, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
 '2026-12-02', '16:00:00', '20:00:00', 'Indoor Sports Complex', 'Department teams only', '2026-12-01 12:00:00', 32, 0, 'APPROVED', NULL, 'Sports, Fitness, Teamwork'),

(6, 'Green Campus: Tree Plantation & Solar Awareness Drive',
 'Join the campus sustainability initiative! Plant 500 indigenous saplings across campus grounds, learn about rooftop solar microgrids, and contribute to our net-zero collegiate pledge. Refreshments and certificates awarded.',
 6, 3, 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
 '2026-12-05', '08:00:00', '12:00:00', 'Botanical Gardens & North Lawn', 'All students, staff, and faculty', '2026-12-04 18:00:00', 120, 0, 'APPROVED', NULL, 'Social Impact, Innovation'),

(7, 'UI/UX Designathon: Redesigning Campus Mobility',
 'A 12-hour design sprint solving navigation, shuttle schedules, and accessibility challenges across campus. Use Figma to build interactive prototypes. Evaluated by senior design leads from tech studios.',
 2, 4, 'https://images.unsplash.com/photo-1581291518655-9523c932deb4?w=800',
 '2026-12-10', '09:00:00', '21:00:00', 'Design Studio, Architecture Wing', 'Individual or teams of 2', '2026-12-09 20:00:00', 50, 0, 'APPROVED', NULL, 'Design, Technology, Innovation'),

(8, 'CodeQuest: Competitive Algorithmic Battle',
 'Test your data structures and problem-solving speed under intense time pressure! 3 rounds of increasing difficulty covering dynamic programming, graph theory, and number theory. Fast compilers & real-time leaderboard.',
 1, 2, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
 '2026-12-14', '14:00:00', '17:30:00', 'Central Computing Centre (CCC)', 'All engineering departments', '2026-12-13 18:00:00', 100, 0, 'APPROVED', NULL, 'Coding, Technology, Artificial Intelligence'),

-- Pending Events (Awaiting Admin Review)
(9, 'RoboWars & Autonomous Drone Arena',
 'High-voltage combat robotics! 15kg featherweight combat robots clash in the custom-built polycarbonate battle cage, followed by autonomous obstacle course navigation by FPV drones.',
 1, 2, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
 '2026-12-18', '11:00:00', '17:00:00', 'Central Courtyard Quadrangle', 'All engineering students', '2026-12-17 18:00:00', 200, 0, 'PENDING', NULL, 'Technology, Coding, Innovation'),

(10, 'E-Summit 2026: Angel Investors & Startup Bootcamp',
 'Annual flagship entrepreneurship conference! Features keynotes from unicorn founders, speed-mentorship roundtables, and live term sheet negotiations with regional venture capital firms.',
 4, 4, 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
 '2026-12-22', '09:30:00', '18:00:00', 'Main Auditorium & Convention Foyer', 'Open to all aspiring entrepreneurs', '2026-12-20 23:59:59', 300, 0, 'PENDING', NULL, 'Entrepreneurship, Business, Management'),

-- Rejected Events (With Admin Justification)
(11, 'Late Night DJ Bash & Fireworks',
 'An unauthorized celebration proposed past campus curfew hours without faculty supervision.',
 3, 3, 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
 '2026-11-30', '23:00:00', '03:00:00', 'Campus Main Lawn', 'All Students', '2026-11-29 18:00:00', 300, 0, 'REJECTED', 'Violates campus safety protocol: Events cannot be hosted past 10:00 PM without prior Syndicate approval and security clearance.', 'Cultural Activities'),

(12, 'Off-Campus Extreme Motor Rally',
 'An off-campus high-speed motorcycle sprint through forest foothills without institutional liability insurance.',
 5, 2, 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
 '2026-12-07', '06:00:00', '14:00:00', 'Eastern Foothills Highway', 'Open to licensed riders', '2026-12-05 18:00:00', 40, 0, 'REJECTED', 'Safety and liability hazard: High-risk motorsport events off-campus cannot be sanctioned under college insurance coverage.', 'Sports');

-- 8. SEED REGISTRATIONS
-- Amit registered for CampusHack 2026
INSERT INTO registrations (id, event_id, student_id, status, registration_date) VALUES
(1, 1, 5, 'CONFIRMED', '2026-11-01 10:15:00');

-- Priya registered for Aura Musical Night
INSERT INTO registrations (id, event_id, student_id, status, registration_date) VALUES
(2, 3, 6, 'CONFIRMED', '2026-11-01 11:30:00');

-- 9. SEED PASSPORT POINTS & BADGES FOR AMIT
INSERT INTO passport_points (id, student_id, event_id, points, reason, awarded_at) VALUES
(1, 5, 1, 100, 'Attended & verified at TechFest 2025 Hackathon', '2026-10-15 16:30:00'),
(2, 5, 2, 50, 'Masterclass on PyTorch participation', '2026-10-22 18:00:00');

INSERT INTO student_badges (id, student_id, badge_id, earned_at) VALUES
(1, 5, 1, '2026-10-15 16:30:00'),
(2, 5, 5, '2026-10-15 16:30:00');

-- 10. SEED NOTIFICATIONS
INSERT INTO notifications (id, user_id, title, message, type, is_read, related_entity_type, related_entity_id) VALUES
(1, 5, 'Registration Confirmed!', 'You have successfully secured a seat for CampusHack 2026: GenAI & Web3 Sprint.', 'REGISTRATION', FALSE, 'EVENT', 1),
(2, 2, 'New Registration Alert', 'Student Amit Kumar (REG2023CS101) registered for CampusHack 2026.', 'REGISTRATION', FALSE, 'EVENT', 1),
(3, 1, 'Pending Event Approval', 'Robotics & AI Club submitted "RoboWars & Autonomous Drone Arena" for administrative review.', 'APPROVAL', FALSE, 'EVENT', 9);
