-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: quizapp
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


--
-- Dumping data for table `leaderboard`
--

LOCK TABLES `leaderboard` WRITE;
/*!40000 ALTER TABLE `leaderboard` DISABLE KEYS */;
INSERT INTO `leaderboard` VALUES (1,2,3,'2024-12-13 02:37:35'),(2,3,1,'2024-12-13 02:38:31'),(5,4,4,'2024-12-13 02:40:09'),(6,5,1,'2024-12-13 02:47:11');
/*!40000 ALTER TABLE `leaderboard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `quiz_questions`
--

LOCK TABLES `quiz_questions` WRITE;
/*!40000 ALTER TABLE `quiz_questions` DISABLE KEYS */;
INSERT INTO `quiz_questions` VALUES (1,1,'Who wrote the young adult novel \"The Fault in Our Stars\"?','John Green','[\"Stephenie Meyer\",\"Suzanne Collins\",\"Stephen Chbosky\"]'),(2,1,'What was Sir Handel\'s original name in \"The Railway Series\" and it\'s animated counterpart \"Thomas and Friends?\"','Falcon','[\"Eagle\",\"Kyte\",\"Swallow\"]'),(3,1,'Under what pseudonym did Stephen King publish five novels between 1977 and 1984?','Richard Bachman','[\"J. D. Robb\",\"Mark Twain\",\"Lewis Carroll\"]'),(4,1,'Which of the following is the world\'s best-selling book?','The Lord of the Rings','[\"The Little Prince\",\"Harry Potter and the Philosopher\'s Stone\",\"The Da Vinci Code\"]'),(5,1,'Who wrote \"A Tale of Two Cities\"?','Charles Dickens','[\"Charles Darwin\",\"Mark Twain\",\"Roald Dahl\"]'),(6,1,'Who wrote \"Harry Potter\"?','J.K. Rowling','[\"J.R.R. Tolkien\",\"Terry Pratchett\",\"Daniel Radcliffe\"]'),(7,1,'What is the name of the three headed dog in Harry Potter and the Sorcerer\'s Stone?','Fluffy','[\"Spike\",\"Poofy\",\"Spot\"]'),(8,1,'What is the name of the protagonist of J.D. Salinger\'s novel Catcher in the Rye?','Holden Caulfield','[\"Fletcher Christian\",\"Jay Gatsby\",\"Randall Flagg\"]'),(9,2,'Which of these car models are produced by Lamborghini?','Aventador','[\"Huayra\",\"918\",\"Chiron\"]'),(10,2,'Which of the following countries has officially banned the civilian use of dash cams in cars?','Austria','[\"United States\",\"Czechia\",\"South Korea\"]'),(11,2,'Enzo Ferrari was originally an auto racer for what manufacturer before founding his own car company?','Alfa Romeo','[\"Auto Union\",\"Mercedes Benz\",\"Bentley\"]'),(12,2,'Which Japanese company is the world\'s largest manufacturer of motorcycles?','Honda','[\"Yamaha\",\"Suzuki\",\"Kawasaki\"]'),(13,2,'What do the 4 Rings in Audi\'s Logo represent?','Previously independent automobile manufacturers','[\"States in which Audi makes the most sales\",\"Main cities vital to Audi\",\"Countries in which Audi makes the most sales\"]'),(14,2,'What nickname was given to Air Canada Flight 143 after it ran out of fuel and glided to safety in 1983?','Gimli Glider','[\"Gimli Microlight\",\"Gimli Chaser\",\"Gimli Superb\"]'),(15,2,'What part of an automobile engine uses lobes to open and close intake and exhaust valves, and allows an air/fuel mixture into the engine?','Camshaft','[\"Piston\",\"Drive shaft\",\"Crankshaft\"]'),(16,2,'Which of the following passenger jets is the longest?','Boeing 747-8','[\"Airbus A350-1000\",\"Airbus A330-200\",\"Boeing 787-10\"]'),(17,2,'When was Cadillac founded?','1902','[\"1964\",\"1898\",\"1985\"]'),(18,2,'Which one is NOT the function of engine oil in car engines?','Combustion','[\"Lubrication\",\"Cooling\",\"Reduce corrosion\"]'),(19,3,'The likeness of which president is featured on the rare $2 bill of USA currency?','Thomas Jefferson','[\"Martin Van Buren\",\"Ulysses Grant\",\"John Quincy Adams\"]'),(20,3,'The New York Times slogan is, “All the News That’s Fit to…”','Print','[\"Digest\",\"Look\",\"Read\"]'),(21,3,'What kind of aircraft was developed by Igor Sikorsky in the United States in 1942?','Helicopter','[\"Stealth Blimp\",\"Jet\",\"Space Capsule\"]'),(22,3,'According to Sherlock Holmes, \"If you eliminate the impossible, whatever remains, however improbable, must be the...\"','Truth','[\"Answer\",\"Cause\",\"Source\"]'),(23,3,'Which restaurant\'s mascot is a clown?','McDonald\'s','[\"Whataburger\",\"Burger King\",\"Sonic\"]'),(24,3,'Virgin Trains, Virgin Atlantic and Virgin Racing, are all companies owned by which famous entrepreneur?   ','Richard Branson','[\"Alan Sugar\",\"Donald Trump\",\"Bill Gates\"]'),(25,3,'Which sign of the zodiac comes between Virgo and Scorpio?','Libra','[\"Gemini\",\"Taurus\",\"Capricorn\"]'),(26,3,'What is on display in the Madame Tussaud\'s museum in London?','Wax sculptures','[\"Designer clothing\",\"Unreleased film reels\",\"Vintage cars\"]'),(27,3,'What machine element is located in the center of fidget spinners?','Bearings','[\"Axles\",\"Gears\",\"Belts\"]'),(28,3,'What does the \'S\' stand for in the abbreviation SIM, as in SIM card? ','Subscriber','[\"Single\",\"Secure\",\"Solid\"]'),(29,3,'The “fairy” type made it’s debut in which generation of the Pokemon core series games?','6th','[\"2nd\",\"7th\",\"4th\"]'),(30,3,'On a dartboard, what number is directly opposite No. 1?','19','[\"20\",\"12\",\"15\"]'),(31,3,'What company developed the vocaloid Hatsune Miku?','Crypton Future Media','[\"Sega\",\"Sony\",\"Yamaha Corporation\"]'),(32,3,'What is the first book of the Old Testament?','Genesis','[\"Exodus\",\"Leviticus\",\"Numbers\"]'),(33,3,'What is the Zodiac symbol for Gemini?','Twins','[\"Fish\",\"Scales\",\"Maiden\"]'),(34,3,'Foie gras is a French delicacy typically made from what part of a duck or goose?','Liver','[\"Heart\",\"Stomach\",\"Intestines\"]'),(35,3,'Which of the following card games revolves around numbers and basic math?','Uno','[\"Go Fish\",\"Twister\",\"Munchkin\"]'),(36,3,'Which best selling toy of 1983 caused hysteria, resulting in riots breaking out in stores?','Cabbage Patch Kids','[\"Transformers\",\"Care Bears\",\"Rubik’s Cube\"]'),(37,3,'The drug cartel run by Pablo Escobar originated in which South American city?','Medellín','[\"Bogotá\",\"Quito\",\"Cali\"]'),(38,3,'Which sign of the zodiac is represented by the Crab?','Cancer','[\"Libra\",\"Virgo\",\"Sagittarius\"]'),(39,4,'Area 51 is located in which US state?','Nevada','[\"Arizona\",\"New Mexico\",\"Utah\"]'),(40,4,'What kind of aircraft was developed by Igor Sikorsky in the United States in 1942?','Helicopter','[\"Stealth Blimp\",\"Jet\",\"Space Capsule\"]'),(41,4,'What is Cynophobia the fear of?','Dogs','[\"Birds\",\"Flying\",\"Germs\"]'),(42,4,'In the video-game franchise Kingdom Hearts, the main protagonist, carries a weapon with what shape?','Key','[\"Sword\",\"Pen\",\"Cellphone\"]'),(43,4,'What is the French word for \"fish\"?','poisson','[\"fiche\",\"escargot\",\"mer\"]'),(44,4,'The drug cartel run by Pablo Escobar originated in which South American city?','Medellín','[\"Bogotá\",\"Quito\",\"Cali\"]'),(45,4,'What is the Spanish word for \"donkey\"?','Burro','[\"Caballo\",\"Toro\",\"Perro\"]'),(46,4,'What was the first ever London Underground line to be built?','Metropolitan Line','[\"Circle Line\",\"Bakerloo Line\",\"Victoria Line\"]'),(47,4,'What is the Zodiac symbol for Gemini?','Twins','[\"Fish\",\"Scales\",\"Maiden\"]'),(48,4,'What was the nickname given to the Hughes H-4 Hercules, a heavy transport flying boat which achieved flight in 1947?','Spruce Goose','[\"Noah\'s Ark\",\"Fat Man\",\"Trojan Horse\"]'),(49,4,'Five dollars is worth how many nickles?','100','[\"50\",\"25\",\"69\"]'),(50,4,'What is the famous Papa John\'s last name?','Schnatter','[\"Chowder\",\"Williams\",\"ANDERSON\"]'),(51,4,'Waluigi\'s first appearance was in what game?','Mario Tennis 64 (N64)','[\"Wario Land: Super Mario Land 3\",\"Mario Party (N64)\",\"Super Smash Bros. Ultimate\"]'),(52,4,'What machine element is located in the center of fidget spinners?','Bearings','[\"Axles\",\"Gears\",\"Belts\"]'),(53,4,'If you are caught \"Goldbricking\", what are you doing wrong?','Slacking','[\"Smoking\",\"Stealing\",\"Cheating\"]'),(54,4,'Which country has the union jack in its flag?','New Zealand','[\"South Africa\",\"Canada\",\"Hong Kong\"]');
/*!40000 ALTER TABLE `quiz_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
INSERT INTO `quizzes` VALUES (1,'Quiz (Books, easy, 8 Questions)',10,'easy',8,2,'2024-12-13 02:37:21'),(2,'Quiz (Vehicles, medium, 10 Questions)',28,'medium',10,3,'2024-12-13 02:38:17'),(3,'Quiz (General Knowledge, easy, 20 Questions)',9,'easy',20,4,'2024-12-13 02:39:47'),(4,'Quiz (General Knowledge, easy, 16 Questions)',9,'easy',16,5,'2024-12-13 02:46:34');
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test','test@gmail.com',0,'$2b$10$LXdxk4V7B05Ido9j2Xbj1.dXqUOSWM4H00ErL2iI8gSANfj64lqkm','2024-12-13 02:36:27'),(2,'john22','john22@gmail.com',3,'$2b$10$5ojw0k.N4RHxo1hbKU4G8Oer9pVd9R2eq7318T/ZAoUb0R3Y1haqW','2024-12-13 02:36:59'),(3,'peterplayz511','peterplayz511@gmail.com',8,'$2b$10$9HyYslIJpmvzDoK78GGsvOWy4HOPWgtkgE5V02xI9dw3Wby/yLIiq','2024-12-13 02:38:02'),(4,'megatron711','megatron711@gmail.com',4,'$2b$10$dsV3uhT4yKZmY4kLQqIXsubsx74JB8S7aTPZahFsO/pfwNV1QLPau','2024-12-13 02:39:35'),(5,'danielplayz123','daniel@gmail.com',1,'$2b$10$EiXS.vOGjqSJmni3UkkojuUtjivrNlL4KaNXkMFjk7Ez7xpB4Hiz2','2024-12-13 02:44:07');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-13  2:58:41
