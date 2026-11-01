package com.campusconnect.config;

import com.campusconnect.entity.*;
import com.campusconnect.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final InterestRepository interestRepository;
    private final EventCategoryRepository categoryRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final BadgeRepository badgeRepository;
    private final StudentBadgeRepository studentBadgeRepository;
    private final PassportPointRepository passportPointRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentProfileRepository profileRepository,
                           InterestRepository interestRepository,
                           EventCategoryRepository categoryRepository,
                           EventRepository eventRepository,
                           RegistrationRepository registrationRepository,
                           BadgeRepository badgeRepository,
                           StudentBadgeRepository studentBadgeRepository,
                           PassportPointRepository passportPointRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.interestRepository = interestRepository;
        this.categoryRepository = categoryRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.badgeRepository = badgeRepository;
        this.studentBadgeRepository = studentBadgeRepository;
        this.passportPointRepository = passportPointRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already contains records. Skipping automatic initialization.");
            return;
        }

        logger.info("Initializing CampusConnect sample seed data...");

        // 1. Seed Interests
        Interest ai = interestRepository.save(new Interest("Artificial Intelligence", "artificial-intelligence", "Machine learning, deep learning, NLP, computer vision"));
        Interest ml = interestRepository.save(new Interest("Machine Learning", "machine-learning", "Predictive modeling, data analytics, neural networks"));
        Interest coding = interestRepository.save(new Interest("Coding", "coding", "Competitive programming, web development, app development, algorithms"));
        Interest tech = interestRepository.save(new Interest("Technology", "technology", "Emerging tech, robotics, IoT, cloud computing, cybersecurity"));
        Interest startup = interestRepository.save(new Interest("Entrepreneurship", "entrepreneurship", "Startups, venture building, pitching, business models"));
        Interest business = interestRepository.save(new Interest("Business", "business", "Finance, consulting, strategy, commerce, marketing"));
        Interest mgmt = interestRepository.save(new Interest("Management", "management", "Leadership, operations, project planning, team building"));
        Interest culture = interestRepository.save(new Interest("Cultural Activities", "cultural-activities", "Music, dance, theatre, fine arts, photography"));
        Interest sports = interestRepository.save(new Interest("Sports", "sports", "Football, cricket, basketball, badminton, chess, athletics"));
        Interest design = interestRepository.save(new Interest("Design", "design", "UI/UX design, graphic arts, industrial design, 3D modeling"));
        Interest social = interestRepository.save(new Interest("Social Impact", "social-impact", "Sustainability, volunteering, community outreach"));
        Interest innovation = interestRepository.save(new Interest("Innovation", "innovation", "Hackathons, research challenges, tech incubation"));

        // 2. Seed Categories
        EventCategory catTech = categoryRepository.save(new EventCategory("Technical & Coding", "technical-coding", "Code", "Hackathons, coding contests, bug-bounty hunts, and software workshops"));
        EventCategory catWork = categoryRepository.save(new EventCategory("Workshops & Seminars", "workshops-seminars", "BookOpen", "Hands-on masterclasses and industry guest speaker sessions"));
        EventCategory catCult = categoryRepository.save(new EventCategory("Cultural & Arts", "cultural-arts", "Music", "Concerts, dance showcases, dramatic plays, open-mics, and art exhibitions"));
        EventCategory catBiz = categoryRepository.save(new EventCategory("Entrepreneurship & Business", "business-startup", "Briefcase", "Pitch fests, case-study competitions, angel talks, and startup expos"));
        EventCategory catSport = categoryRepository.save(new EventCategory("Sports & Fitness", "sports-fitness", "Award", "Inter-department leagues, track & field meets, chess, and esports"));
        EventCategory catSoc = categoryRepository.save(new EventCategory("Social & Volunteering", "social-community", "Heart", "Blood drives, tree plantations, clean-up drives, and community camps"));

        // 3. Seed Users (all with password: password123)
        String encodedPass = passwordEncoder.encode("password123");

        User admin = userRepository.save(new User(
                "Dean of Student Affairs",
                "admin@campusconnect.edu",
                encodedPass,
                Role.COLLEGE_ADMIN,
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        ));

        User organizerRobotics = userRepository.save(new User(
                "Robotics & AI Club",
                "robotics@campusconnect.edu",
                encodedPass,
                Role.ORGANIZER,
                "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150"
        ));

        User organizerCultural = userRepository.save(new User(
                "Cultural Affairs Council",
                "cultural@campusconnect.edu",
                encodedPass,
                Role.ORGANIZER,
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
        ));

        User organizerEcell = userRepository.save(new User(
                "E-Cell Entrepreneurship Club",
                "ecell@campusconnect.edu",
                encodedPass,
                Role.ORGANIZER,
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
        ));

        User studentAmit = userRepository.save(new User(
                "Amit Kumar",
                "amit.student@campusconnect.edu",
                encodedPass,
                Role.STUDENT,
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
        ));

        User studentPriya = userRepository.save(new User(
                "Priya Sharma",
                "priya.student@campusconnect.edu",
                encodedPass,
                Role.STUDENT,
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
        ));

        // 4. Seed Student Profiles & Interests
        StudentProfile amitProfile = new StudentProfile(studentAmit, "REG2023CS101", "Computer Science & Engineering", 3);
        amitProfile.setBio("Passionate about Deep Learning, Web Dev and building open source tools.");
        amitProfile.setTotalXp(150);
        amitProfile.setCurrentLevel("Explorer");
        amitProfile.setInterests(new HashSet<>(List.of(ai, ml, coding, tech, innovation)));
        profileRepository.save(amitProfile);

        StudentProfile priyaProfile = new StudentProfile(studentPriya, "REG2024EC204", "Electronics & Communication", 2);
        priyaProfile.setBio("Design enthusiast, musician and aspiring product builder.");
        priyaProfile.setTotalXp(75);
        priyaProfile.setCurrentLevel("Novice");
        priyaProfile.setInterests(new HashSet<>(List.of(culture, design, startup, sports)));
        profileRepository.save(priyaProfile);

        // 5. Seed Badges
        Badge badge1 = badgeRepository.save(new Badge("First Step", "Attended your first verified college event!", "Footprints", 1, 50, "GENERAL"));
        Badge badge2 = badgeRepository.save(new Badge("Explorer", "Participated in at least 3 campus events.", "Compass", 3, 150, "GENERAL"));
        Badge badge3 = badgeRepository.save(new Badge("Campus Enthusiast", "Active presence across 5 campus events.", "Zap", 5, 250, "GENERAL"));
        Badge badge4 = badgeRepository.save(new Badge("Active Participant", "Legendary campus spirit with 10 verified events.", "Trophy", 10, 500, "GENERAL"));
        Badge badge5 = badgeRepository.save(new Badge("Tech Innovator", "Engaged in high-impact technical hackathons.", "Cpu", 2, 100, "SPECIALTY"));
        Badge badge6 = badgeRepository.save(new Badge("Cultural Icon", "Lit up the campus stage in arts & cultural showcases.", "Sparkles", 2, 100, "SPECIALTY"));

        studentBadgeRepository.save(new StudentBadge(studentAmit, badge1));
        studentBadgeRepository.save(new StudentBadge(studentAmit, badge5));

        // 6. Seed Events
        Event event1 = new Event();
        event1.setTitle("CampusHack 2026: GenAI & Web3 Sprint");
        event1.setDescription("Join the biggest 24-hour hackathon of the semester! Build next-generation applications powered by generative AI and decentralized protocols. Mentors from top tech companies will guide teams. Free food, exciting swags, and a cash pool of $10,000 for top 3 teams.");
        event1.setCategory(catTech);
        event1.setOrganizer(organizerRobotics);
        event1.setPosterUrl("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800");
        event1.setEventDate(LocalDate.now().plusDays(14));
        event1.setStartTime(LocalTime.of(9, 0));
        event1.setEndTime(LocalTime.of(18, 0));
        event1.setVenue("Auditorium Hall B, Tech Block");
        event1.setEligibility("All B.Tech & M.Tech Students");
        event1.setRegistrationDeadline(LocalDateTime.now().plusDays(13));
        event1.setMaxCapacity(150);
        event1.setCurrentRegistrations(1);
        event1.setStatus(EventStatus.APPROVED);
        event1.setTags("Artificial Intelligence, Coding, Technology, Innovation");
        eventRepository.save(event1);

        Event event2 = new Event();
        event2.setTitle("Hands-on Deep Learning & Vision Masterclass");
        event2.setDescription("A 4-hour immersive workshop covering Convolutional Neural Networks, Vision Transformers, and practical deployment using PyTorch and HuggingFace. Bring your laptop with Python 3.10+ pre-installed. Certificate of completion provided.");
        event2.setCategory(catWork);
        event2.setOrganizer(organizerRobotics);
        event2.setPosterUrl("https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800");
        event2.setEventDate(LocalDate.now().plusDays(19));
        event2.setStartTime(LocalTime.of(14, 0));
        event2.setEndTime(LocalTime.of(18, 0));
        event2.setVenue("CS Lab 3, Alan Turing Building");
        event2.setEligibility("Open to 2nd, 3rd, and 4th year students");
        event2.setRegistrationDeadline(LocalDateTime.now().plusDays(18));
        event2.setMaxCapacity(60);
        event2.setCurrentRegistrations(0);
        event2.setStatus(EventStatus.APPROVED);
        event2.setTags("Artificial Intelligence, Machine Learning, Technology, Coding");
        eventRepository.save(event2);

        Event event3 = new Event();
        event3.setTitle("Aura 2026: Annual Inter-College Musical Night");
        event3.setDescription("An electrifying evening of western music, classical fusion, vocal battles, and unplugged bands! Featuring renowned guest artists and our best campus vocalists. Food stalls and photo booths available across the venue.");
        event3.setCategory(catCult);
        event3.setOrganizer(organizerCultural);
        event3.setPosterUrl("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800");
        event3.setEventDate(LocalDate.now().plusDays(24));
        event3.setStartTime(LocalTime.of(17, 30));
        event3.setEndTime(LocalTime.of(22, 0));
        event3.setVenue("Open Air Theatre (OAT)");
        event3.setEligibility("Open to all university students & faculty");
        event3.setRegistrationDeadline(LocalDateTime.now().plusDays(23));
        event3.setMaxCapacity(500);
        event3.setCurrentRegistrations(1);
        event3.setStatus(EventStatus.APPROVED);
        event3.setTags("Cultural Activities, Design, Music");
        eventRepository.save(event3);

        Event event4 = new Event();
        event4.setTitle("Venture Pitch 2026: Student Startup Showcase");
        event4.setDescription("Got an early-stage startup idea or prototype? Present your venture in front of seed angel investors, venture capitalists, and alumni founders. Selected startups receive $5,000 in cloud credits, incubator space, and mentorship.");
        event4.setCategory(catBiz);
        event4.setOrganizer(organizerEcell);
        event4.setPosterUrl("https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800");
        event4.setEventDate(LocalDate.now().plusDays(27));
        event4.setStartTime(LocalTime.of(10, 0));
        event4.setEndTime(LocalTime.of(16, 0));
        event4.setVenue("Management Block Seminar Hall 1");
        event4.setEligibility("Open to all students with prototype or deck");
        event4.setRegistrationDeadline(LocalDateTime.now().plusDays(26));
        event4.setMaxCapacity(80);
        event4.setCurrentRegistrations(0);
        event4.setStatus(EventStatus.APPROVED);
        event4.setTags("Entrepreneurship, Business, Management, Innovation");
        eventRepository.save(event4);

        Event event5 = new Event();
        event5.setTitle("Inter-Department Futsal Championship");
        event5.setDescription("Annual high-speed 5v5 indoor football tournament! Trophies, medals, and best player awards up for grabs. Teams must register with their official department team rosters (5 players + 2 substitutes).");
        event5.setCategory(catSport);
        event5.setOrganizer(organizerCultural);
        event5.setPosterUrl("https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800");
        event5.setEventDate(LocalDate.now().plusDays(31));
        event5.setStartTime(LocalTime.of(16, 0));
        event5.setEndTime(LocalTime.of(20, 0));
        event5.setVenue("Indoor Sports Complex");
        event5.setEligibility("Department teams only");
        event5.setRegistrationDeadline(LocalDateTime.now().plusDays(30));
        event5.setMaxCapacity(32);
        event5.setCurrentRegistrations(0);
        event5.setStatus(EventStatus.APPROVED);
        event5.setTags("Sports, Fitness, Teamwork");
        eventRepository.save(event5);

        Event event6 = new Event();
        event6.setTitle("Green Campus: Tree Plantation & Solar Awareness Drive");
        event6.setDescription("Join the campus sustainability initiative! Plant 500 indigenous saplings across campus grounds, learn about rooftop solar microgrids, and contribute to our net-zero collegiate pledge. Refreshments and certificates awarded.");
        event6.setCategory(catSoc);
        event6.setOrganizer(organizerCultural);
        event6.setPosterUrl("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800");
        event6.setEventDate(LocalDate.now().plusDays(34));
        event6.setStartTime(LocalTime.of(8, 0));
        event6.setEndTime(LocalTime.of(12, 0));
        event6.setVenue("Botanical Gardens & North Lawn");
        event6.setEligibility("All students, staff, and faculty");
        event6.setRegistrationDeadline(LocalDateTime.now().plusDays(33));
        event6.setMaxCapacity(120);
        event6.setCurrentRegistrations(0);
        event6.setStatus(EventStatus.APPROVED);
        event6.setTags("Social Impact, Innovation");
        eventRepository.save(event6);

        Event event7 = new Event();
        event7.setTitle("UI/UX Designathon: Redesigning Campus Mobility");
        event7.setDescription("A 12-hour design sprint solving navigation, shuttle schedules, and accessibility challenges across campus. Use Figma to build interactive prototypes. Evaluated by senior design leads from tech studios.");
        event7.setCategory(catWork);
        event7.setOrganizer(organizerEcell);
        event7.setPosterUrl("https://images.unsplash.com/photo-1581291518655-9523c932deb4?w=800");
        event7.setEventDate(LocalDate.now().plusDays(39));
        event7.setStartTime(LocalTime.of(9, 0));
        event7.setEndTime(LocalTime.of(21, 0));
        event7.setVenue("Design Studio, Architecture Wing");
        event7.setEligibility("Individual or teams of 2");
        event7.setRegistrationDeadline(LocalDateTime.now().plusDays(38));
        event7.setMaxCapacity(50);
        event7.setCurrentRegistrations(0);
        event7.setStatus(EventStatus.APPROVED);
        event7.setTags("Design, Technology, Innovation");
        eventRepository.save(event7);

        Event event8 = new Event();
        event8.setTitle("CodeQuest: Competitive Algorithmic Battle");
        event8.setDescription("Test your data structures and problem-solving speed under intense time pressure! 3 rounds of increasing difficulty covering dynamic programming, graph theory, and number theory. Fast compilers & real-time leaderboard.");
        event8.setCategory(catTech);
        event8.setOrganizer(organizerRobotics);
        event8.setPosterUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800");
        event8.setEventDate(LocalDate.now().plusDays(43));
        event8.setStartTime(LocalTime.of(14, 0));
        event8.setEndTime(LocalTime.of(17, 30));
        event8.setVenue("Central Computing Centre (CCC)");
        event8.setEligibility("All engineering departments");
        event8.setRegistrationDeadline(LocalDateTime.now().plusDays(42));
        event8.setMaxCapacity(100);
        event8.setCurrentRegistrations(0);
        event8.setStatus(EventStatus.APPROVED);
        event8.setTags("Coding, Technology, Artificial Intelligence");
        eventRepository.save(event8);

        // Pending Event 1 (Waiting for Admin approval)
        Event eventPending1 = new Event();
        eventPending1.setTitle("RoboWars & Autonomous Drone Arena");
        eventPending1.setDescription("High-voltage combat robotics! 15kg featherweight combat robots clash in the custom-built polycarbonate battle cage, followed by autonomous obstacle course navigation by FPV drones.");
        eventPending1.setCategory(catTech);
        eventPending1.setOrganizer(organizerRobotics);
        eventPending1.setPosterUrl("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800");
        eventPending1.setEventDate(LocalDate.now().plusDays(47));
        eventPending1.setStartTime(LocalTime.of(11, 0));
        eventPending1.setEndTime(LocalTime.of(17, 0));
        eventPending1.setVenue("Central Courtyard Quadrangle");
        eventPending1.setEligibility("All engineering students");
        eventPending1.setRegistrationDeadline(LocalDateTime.now().plusDays(46));
        eventPending1.setMaxCapacity(200);
        eventPending1.setCurrentRegistrations(0);
        eventPending1.setStatus(EventStatus.PENDING);
        eventPending1.setTags("Technology, Coding, Innovation");
        eventRepository.save(eventPending1);

        // Pending Event 2
        Event eventPending2 = new Event();
        eventPending2.setTitle("E-Summit 2026: Angel Investors & Startup Bootcamp");
        eventPending2.setDescription("Annual flagship entrepreneurship conference! Features keynotes from unicorn founders, speed-mentorship roundtables, and live term sheet negotiations with regional venture capital firms.");
        eventPending2.setCategory(catBiz);
        eventPending2.setOrganizer(organizerEcell);
        eventPending2.setPosterUrl("https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800");
        eventPending2.setEventDate(LocalDate.now().plusDays(51));
        eventPending2.setStartTime(LocalTime.of(9, 30));
        eventPending2.setEndTime(LocalTime.of(18, 0));
        eventPending2.setVenue("Main Auditorium & Convention Foyer");
        eventPending2.setEligibility("Open to all aspiring entrepreneurs");
        eventPending2.setRegistrationDeadline(LocalDateTime.now().plusDays(49));
        eventPending2.setMaxCapacity(300);
        eventPending2.setCurrentRegistrations(0);
        eventPending2.setStatus(EventStatus.PENDING);
        eventPending2.setTags("Entrepreneurship, Business, Management");
        eventRepository.save(eventPending2);

        // Rejected Event 1 (With mandatory rejection reason)
        Event eventRejected1 = new Event();
        eventRejected1.setTitle("Late Night DJ Bash & Fireworks");
        eventRejected1.setDescription("An unauthorized celebration proposed past campus curfew hours without faculty supervision.");
        eventRejected1.setCategory(catCult);
        eventRejected1.setOrganizer(organizerCultural);
        eventRejected1.setPosterUrl("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800");
        eventRejected1.setEventDate(LocalDate.now().plusDays(29));
        eventRejected1.setStartTime(LocalTime.of(23, 0));
        eventRejected1.setEndTime(LocalTime.of(3, 0));
        eventRejected1.setVenue("Campus Main Lawn");
        eventRejected1.setEligibility("All Students");
        eventRejected1.setRegistrationDeadline(LocalDateTime.now().plusDays(28));
        eventRejected1.setMaxCapacity(300);
        eventRejected1.setCurrentRegistrations(0);
        eventRejected1.setStatus(EventStatus.REJECTED);
        eventRejected1.setRejectionReason("Violates campus safety protocol: Events cannot be hosted past 10:00 PM without prior Syndicate approval and security clearance.");
        eventRejected1.setTags("Cultural Activities");
        eventRepository.save(eventRejected1);

        // Rejected Event 2
        Event eventRejected2 = new Event();
        eventRejected2.setTitle("Off-Campus Extreme Motor Rally");
        eventRejected2.setDescription("An off-campus high-speed motorcycle sprint through forest foothills without institutional liability insurance.");
        eventRejected2.setCategory(catSport);
        eventRejected2.setOrganizer(organizerRobotics);
        eventRejected2.setPosterUrl("https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800");
        eventRejected2.setEventDate(LocalDate.now().plusDays(36));
        eventRejected2.setStartTime(LocalTime.of(6, 0));
        eventRejected2.setEndTime(LocalTime.of(14, 0));
        eventRejected2.setVenue("Eastern Foothills Highway");
        eventRejected2.setEligibility("Open to licensed riders");
        eventRejected2.setRegistrationDeadline(LocalDateTime.now().plusDays(34));
        eventRejected2.setMaxCapacity(40);
        eventRejected2.setCurrentRegistrations(0);
        eventRejected2.setStatus(EventStatus.REJECTED);
        eventRejected2.setRejectionReason("Safety and liability hazard: High-risk motorsport events off-campus cannot be sanctioned under college insurance coverage.");
        eventRejected2.setTags("Sports");
        eventRepository.save(eventRejected2);

        // 7. Seed Registrations
        registrationRepository.save(new Registration(event1, studentAmit));
        registrationRepository.save(new Registration(event3, studentPriya));

        // 8. Seed Passport Points for Amit
        passportPointRepository.save(new PassportPoint(studentAmit, event1, 100, "Attended & verified at TechFest 2025 Hackathon"));
        passportPointRepository.save(new PassportPoint(studentAmit, event2, 50, "Masterclass on PyTorch participation"));

        // 9. Seed Notifications
        notificationRepository.save(new Notification(studentAmit, "Registration Confirmed!", "You have secured a seat for CampusHack 2026: GenAI & Web3 Sprint.", "REGISTRATION", "EVENT", event1.getId()));
        notificationRepository.save(new Notification(organizerRobotics, "New Registration Alert", "Student Amit Kumar (REG2023CS101) registered for CampusHack 2026.", "REGISTRATION", "EVENT", event1.getId()));
        notificationRepository.save(new Notification(admin, "Pending Event Approval", "Robotics & AI Club submitted \"RoboWars & Autonomous Drone Arena\" for administrative review.", "APPROVAL", "EVENT", eventPending1.getId()));

        logger.info("CampusConnect sample seed data successfully initialized!");
    }
}
