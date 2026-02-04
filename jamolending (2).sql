-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 28, 2026 at 02:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jamolending`
--

-- --------------------------------------------------------

--
-- Table structure for table `amortizationschedule`
--

CREATE TABLE `amortizationschedule` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `installment_no` int(11) NOT NULL,
  `interest_amount` decimal(15,2) NOT NULL,
  `penalty_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `due_date` datetime NOT NULL,
  `status` enum('Paid','Unpaid','Overdue') NOT NULL DEFAULT 'Unpaid',
  `holiday_id` bigint(20) UNSIGNED DEFAULT NULL,
  `loan_id` bigint(20) UNSIGNED NOT NULL,
  `installment_amount` decimal(15,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `amount_paid` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `amortizationschedule`
--

INSERT INTO `amortizationschedule` (`ID`, `installment_no`, `interest_amount`, `penalty_amount`, `due_date`, `status`, `holiday_id`, `loan_id`, `installment_amount`, `created_at`, `updated_at`, `amount_paid`) VALUES
(680, 1, 83.33, 0.00, '2025-12-01 03:59:48', 'Paid', NULL, 127, 1712.15, '2025-11-30 03:59:48', '2025-11-30 23:07:18', 1795.48),
(681, 2, 76.55, 0.00, '2025-12-31 03:59:48', 'Paid', NULL, 127, 1712.15, '2025-11-30 03:59:48', '2026-01-09 06:15:50', 1788.70),
(682, 3, 69.73, 0.00, '2026-01-30 03:59:48', 'Unpaid', NULL, 127, 1712.15, '2025-11-30 03:59:48', '2025-11-30 03:59:48', 0.00),
(683, 4, 62.89, 0.00, '2026-02-28 03:59:48', 'Unpaid', NULL, 127, 1712.15, '2025-11-30 03:59:48', '2025-11-30 03:59:48', 0.00),
(684, 5, 56.02, 0.00, '2026-03-30 03:59:48', 'Unpaid', NULL, 127, 1712.15, '2025-11-30 03:59:48', '2025-11-30 03:59:48', 0.00),
(685, 6, 49.12, 0.00, '2026-04-30 03:59:48', 'Unpaid', NULL, 127, 1712.15, '2025-11-30 03:59:48', '2025-11-30 03:59:48', 0.00),
(686, 7, 42.19, 0.00, '2026-05-30 03:59:48', 'Unpaid', NULL, 127, 1712.15, '2025-11-30 03:59:48', '2025-11-30 03:59:48', 0.00),
(687, 8, 35.23, 0.00, '2026-06-30 03:59:48', 'Unpaid', NULL, 127, 1712.15, '2025-11-30 03:59:48', '2025-11-30 03:59:48', 0.00),
(688, 9, 28.24, 0.00, '2026-07-30 03:59:48', 'Unpaid', NULL, 127, 1712.15, '2025-11-30 03:59:48', '2025-11-30 03:59:48', 0.00),
(689, 10, 21.22, 0.00, '2026-08-30 03:59:48', 'Unpaid', NULL, 127, 1712.15, '2025-11-30 03:59:48', '2025-11-30 03:59:48', 0.00),
(690, 11, 14.18, 0.00, '2026-09-30 03:59:48', 'Unpaid', NULL, 127, 1712.15, '2025-11-30 03:59:48', '2025-11-30 03:59:48', 0.00),
(691, 12, 7.10, 0.00, '2026-10-30 03:59:48', 'Unpaid', NULL, 127, 1712.15, '2025-11-30 03:59:48', '2025-11-30 03:59:48', 0.00),
(692, 1, 4.17, 0.00, '2025-12-01 23:40:39', 'Paid', NULL, 138, 85.61, '2025-11-30 23:40:39', '2025-11-30 23:59:42', 89.78),
(693, 2, 3.83, 0.00, '2025-12-31 23:40:39', 'Paid', NULL, 138, 85.61, '2025-11-30 23:40:39', '2025-12-01 02:07:12', 89.44),
(694, 3, 3.49, 0.00, '2026-01-30 23:40:39', 'Paid', NULL, 138, 85.61, '2025-11-30 23:40:39', '2025-12-01 02:07:12', 89.10),
(695, 4, 3.14, 0.00, '2026-02-28 23:40:39', 'Paid', NULL, 138, 85.61, '2025-11-30 23:40:39', '2025-12-01 02:07:12', 88.75),
(696, 5, 2.80, 0.00, '2026-03-30 23:40:39', 'Paid', NULL, 138, 85.61, '2025-11-30 23:40:39', '2025-12-01 02:07:12', 88.41),
(697, 6, 2.46, 0.00, '2026-04-30 23:40:39', 'Paid', NULL, 138, 85.61, '2025-11-30 23:40:39', '2025-12-01 02:07:12', 88.07),
(698, 7, 2.11, 0.00, '2026-05-30 23:40:39', 'Paid', NULL, 138, 85.61, '2025-11-30 23:40:39', '2025-12-01 02:08:04', 87.72),
(699, 8, 1.76, 0.00, '2026-06-30 23:40:39', 'Paid', NULL, 138, 85.61, '2025-11-30 23:40:39', '2025-12-01 02:08:04', 87.37),
(700, 9, 1.41, 0.00, '2026-07-30 23:40:39', 'Paid', NULL, 138, 85.61, '2025-11-30 23:40:39', '2025-12-01 02:08:04', 87.02),
(701, 10, 1.06, 0.00, '2026-08-30 23:40:39', 'Paid', NULL, 138, 85.61, '2025-11-30 23:40:39', '2025-12-01 02:08:04', 86.67),
(702, 11, 0.71, 0.00, '2026-09-30 23:40:39', 'Paid', NULL, 138, 85.61, '2025-11-30 23:40:39', '2025-12-01 02:08:04', 86.32),
(703, 12, 0.36, 0.00, '2026-10-30 23:40:39', 'Paid', NULL, 138, 85.61, '2025-11-30 23:40:39', '2025-12-01 02:08:04', 85.97),
(704, 1, 750.00, 0.00, '2025-12-01 00:12:44', 'Paid', NULL, 141, 3250.00, '2025-12-01 00:12:44', '2025-12-01 00:32:24', 4000.00),
(705, 2, 625.00, 0.00, '2026-01-02 00:12:44', 'Paid', NULL, 141, 3125.00, '2025-12-01 00:12:44', '2025-12-01 00:33:03', 3750.00),
(706, 3, 500.00, 0.00, '2026-02-01 00:12:44', 'Unpaid', NULL, 141, 3000.00, '2025-12-01 00:12:44', '2025-12-01 00:12:44', 0.00),
(707, 4, 375.00, 0.00, '2026-03-01 00:12:44', 'Unpaid', NULL, 141, 2875.00, '2025-12-01 00:12:44', '2025-12-01 00:12:44', 0.00),
(708, 5, 250.00, 0.00, '2026-04-01 00:12:44', 'Unpaid', NULL, 141, 2750.00, '2025-12-01 00:12:44', '2025-12-01 00:12:44', 0.00),
(709, 6, 125.00, 0.00, '2026-05-02 00:12:44', 'Unpaid', NULL, 141, 2625.00, '2025-12-01 00:12:44', '2025-12-01 00:12:44', 0.00),
(710, 1, 4166.67, 0.00, '2025-12-01 03:47:39', 'Unpaid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 03:58:02', 9578.06),
(711, 2, 4114.80, 0.00, '2026-01-02 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 9526.19),
(712, 3, 4060.78, 0.00, '2026-02-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 9472.17),
(713, 4, 4004.50, 0.00, '2026-03-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 9415.89),
(714, 5, 3945.88, 0.00, '2026-04-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 9357.27),
(715, 6, 3884.82, 0.00, '2026-05-02 03:47:39', 'Unpaid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 9296.21),
(716, 7, 3821.21, 0.00, '2026-06-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 9232.60),
(717, 8, 3754.96, 0.00, '2026-07-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 9166.35),
(718, 9, 3685.94, 0.00, '2026-08-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 9097.33),
(719, 10, 3614.04, 0.00, '2026-09-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 9025.43),
(720, 11, 3539.15, 0.00, '2026-10-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 8950.54),
(721, 12, 3461.14, 0.00, '2026-11-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 8872.53),
(722, 13, 3379.88, 0.00, '2026-12-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 8791.27),
(723, 14, 3295.24, 0.00, '2027-01-02 03:47:39', 'Unpaid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 8706.63),
(724, 15, 3207.06, 0.00, '2027-02-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 8618.45),
(725, 16, 3115.22, 0.00, '2027-03-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 8526.61),
(726, 17, 3019.54, 0.00, '2027-04-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 8430.93),
(727, 18, 2919.88, 0.00, '2027-05-02 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 8331.27),
(728, 19, 2816.07, 0.00, '2027-06-01 03:47:39', 'Unpaid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 8227.46),
(729, 20, 2707.93, 0.00, '2027-07-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 8119.32),
(730, 21, 2595.29, 0.00, '2027-08-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 8006.68),
(731, 22, 2477.95, 0.00, '2027-09-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 7889.34),
(732, 23, 2355.72, 0.00, '2027-10-01 03:47:39', 'Unpaid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 7767.11),
(733, 24, 2228.40, 0.00, '2027-11-01 03:47:39', 'Unpaid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 7639.79),
(734, 25, 2095.78, 0.00, '2027-12-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 7507.17),
(735, 26, 1957.63, 0.00, '2028-01-02 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 7369.02),
(736, 27, 1813.72, 0.00, '2028-02-01 03:47:39', 'Unpaid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 7225.11),
(737, 28, 1663.82, 0.00, '2028-03-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 7075.21),
(738, 29, 1507.67, 0.00, '2028-04-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 6919.06),
(739, 30, 1345.01, 0.00, '2028-05-02 03:47:39', 'Unpaid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 6756.40),
(740, 31, 1175.58, 0.00, '2028-06-01 03:47:39', 'Paid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 6586.97),
(741, 32, 999.09, 0.00, '2028-07-01 03:47:39', 'Unpaid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 04:00:21', 93.69),
(742, 33, 815.24, 0.00, '2028-08-01 03:47:39', 'Unpaid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 03:47:40', 0.00),
(743, 34, 623.74, 0.00, '2028-09-01 03:47:39', 'Unpaid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 03:47:40', 0.00),
(744, 35, 424.25, 0.00, '2028-10-01 03:47:39', 'Unpaid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 03:47:40', 0.00),
(745, 36, 216.46, 0.00, '2028-11-01 03:47:39', 'Unpaid', NULL, 142, 5411.39, '2025-12-01 03:47:40', '2025-12-01 03:47:40', 0.00),
(746, 1, 41.67, 0.00, '2025-12-01 05:07:57', 'Paid', NULL, 143, 856.07, '2025-12-01 05:07:57', '2025-12-01 05:14:08', 897.74),
(747, 2, 38.27, 0.00, '2026-01-02 05:07:57', 'Unpaid', NULL, 143, 856.07, '2025-12-01 05:07:57', '2025-12-01 05:07:57', 0.00),
(748, 3, 34.87, 0.00, '2026-02-01 05:07:57', 'Unpaid', NULL, 143, 856.07, '2025-12-01 05:07:57', '2025-12-01 05:07:57', 0.00),
(749, 4, 31.44, 0.00, '2026-03-01 05:07:57', 'Unpaid', NULL, 143, 856.07, '2025-12-01 05:07:57', '2025-12-01 05:07:57', 0.00),
(750, 5, 28.01, 0.00, '2026-04-01 05:07:57', 'Unpaid', NULL, 143, 856.07, '2025-12-01 05:07:57', '2025-12-01 05:07:57', 0.00),
(751, 6, 24.56, 0.00, '2026-05-02 05:07:57', 'Unpaid', NULL, 143, 856.07, '2025-12-01 05:07:57', '2025-12-01 05:07:57', 0.00),
(752, 7, 21.09, 0.00, '2026-06-01 05:07:57', 'Unpaid', NULL, 143, 856.07, '2025-12-01 05:07:57', '2025-12-01 05:07:57', 0.00),
(753, 8, 17.61, 0.00, '2026-07-01 05:07:57', 'Unpaid', NULL, 143, 856.07, '2025-12-01 05:07:57', '2025-12-01 05:07:57', 0.00),
(754, 9, 14.12, 0.00, '2026-08-01 05:07:57', 'Unpaid', NULL, 143, 856.07, '2025-12-01 05:07:57', '2025-12-01 05:07:57', 0.00),
(755, 10, 10.61, 0.00, '2026-09-01 05:07:57', 'Unpaid', NULL, 143, 856.07, '2025-12-01 05:07:57', '2025-12-01 05:07:57', 0.00),
(756, 11, 7.09, 0.00, '2026-10-01 05:07:57', 'Unpaid', NULL, 143, 856.07, '2025-12-01 05:07:57', '2025-12-01 05:07:57', 0.00),
(757, 12, 3.55, 0.00, '2026-11-01 05:07:57', 'Unpaid', NULL, 143, 856.07, '2025-12-01 05:07:57', '2025-12-01 05:07:57', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `atmcollateraldetails`
--

CREATE TABLE `atmcollateraldetails` (
  `ID` bigint(20) NOT NULL,
  `bank_name` enum('BDO','BPI','LandBank','MetroBank') NOT NULL,
  `account_no` varchar(20) NOT NULL,
  `cardno_4digits` int(11) NOT NULL,
  `collateral_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `atmcollateraldetails`
--

INSERT INTO `atmcollateraldetails` (`ID`, `bank_name`, `account_no`, `cardno_4digits`, `collateral_id`) VALUES
(1, 'BDO', '15555788', 1234, 22),
(2, 'MetroBank', '155488235', 0, 24);

-- --------------------------------------------------------

--
-- Table structure for table `borrower`
--

CREATE TABLE `borrower` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `contact_no` varchar(15) NOT NULL,
  `land_line` varchar(20) DEFAULT NULL,
  `marital_status` char(10) DEFAULT NULL,
  `numof_dependentchild` int(11) DEFAULT NULL,
  `home_ownership` enum('Owned','Rented','Mortgage') DEFAULT NULL,
  `membership_date` datetime DEFAULT current_timestamp(),
  `status` enum('Active','Pending','Closed','Blacklisted') DEFAULT NULL,
  `birth_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrower`
--

INSERT INTO `borrower` (`ID`, `user_id`, `first_name`, `last_name`, `age`, `gender`, `email`, `contact_no`, `land_line`, `marital_status`, `numof_dependentchild`, `home_ownership`, `membership_date`, `status`, `birth_date`) VALUES
(34, 22, 'Rj', 'Arevalo', 21, 'Male', 'rjarevalo9@gmail.com', '09856001363', '0123456', 'Single', 1, 'Owned', '2025-11-29 22:51:22', 'Active', '2025-11-12'),
(35, 23, 'Myrtle', 'Co', NULL, 'Female', 'bbird9124@gmail.com', '09910096343', NULL, 'Single', NULL, 'Owned', '2025-11-30 12:58:31', 'Active', '2002-01-09'),
(36, 24, 'Rhea', 'Ridge', NULL, 'Female', 'rijx62@gmail.com', '09224477662', NULL, 'Single', NULL, 'Owned', '2025-11-30 22:58:24', 'Pending', '2025-12-02'),
(38, 25, 'Jun', 'Tan', NULL, 'Male', 'jun@gmail.com', '091144668427', NULL, 'Single', NULL, 'Owned', '2025-11-30 23:44:42', 'Pending', '1988-10-04'),
(39, 26, 'Vico', 'Ty', NULL, 'Male', 'v@gmail.com', '09224488662', NULL, 'Single', NULL, 'Owned', '2025-12-01 00:10:33', 'Active', '2007-06-05'),
(42, 27, 'Ariel', 'Lapinas', NULL, 'Male', 'ariel@lapinas.com', '09778998544', NULL, 'Single', NULL, 'Owned', '2025-12-01 03:36:59', 'Active', '2008-05-05'),
(43, 28, 'Rafael', 'Sanchez', NULL, 'Male', 'josh@gmail.com', '09288785554', NULL, 'Single', NULL, 'Owned', '2025-12-01 05:01:46', 'Active', '2003-01-20');

-- --------------------------------------------------------

--
-- Table structure for table `borrower_addresses`
--

CREATE TABLE `borrower_addresses` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `borrower_id` bigint(20) UNSIGNED NOT NULL,
  `address` varchar(50) NOT NULL,
  `city` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrower_addresses`
--

INSERT INTO `borrower_addresses` (`ID`, `borrower_id`, `address`, `city`) VALUES
(10, 35, 'Poblacion', 'Davao'),
(11, 36, 'Boulevard', 'Davao'),
(13, 38, 'Maa', 'Davao'),
(14, 38, 'Maa', 'Davao'),
(15, 39, 'Sasa', 'Davao'),
(18, 42, 'Acacia', 'Davao'),
(19, 43, 'Buhangin', 'Davao');

-- --------------------------------------------------------

--
-- Table structure for table `borrower_employments`
--

CREATE TABLE `borrower_employments` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `employment_status` enum('Employed','UnEmployed') DEFAULT NULL,
  `income_source` varchar(20) DEFAULT NULL,
  `occupation` varchar(20) DEFAULT NULL,
  `position` varchar(20) DEFAULT NULL,
  `agency_address` varchar(50) DEFAULT NULL,
  `monthly_income` decimal(10,2) NOT NULL,
  `borrower_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrower_employments`
--

INSERT INTO `borrower_employments` (`ID`, `employment_status`, `income_source`, `occupation`, `position`, `agency_address`, `monthly_income`, `borrower_id`) VALUES
(24, 'Employed', 'Salary', 'Teacher', 'Teacher I', 'Torres, Davao', 20000.00, 35),
(25, 'Employed', 'Salary', 'Journalist', NULL, 'Matina', 25000.00, 36),
(27, 'Employed', 'Salary', 'Accountant', 'Senior', 'Matina', 50000.00, 38),
(28, 'Employed', 'Salary', 'Kagawad', NULL, 'Sasa', 30000.00, 39),
(31, 'Employed', 'Salary', 'Teacher', 'Faculty', 'Acacia', 5000.00, 42),
(32, 'Employed', 'Salary', 'Teacher', 'Faculty', 'Acacia', 25500.00, 43);

-- --------------------------------------------------------

--
-- Table structure for table `borrower_ids`
--

CREATE TABLE `borrower_ids` (
  `ID` bigint(20) NOT NULL,
  `id_type` varchar(20) NOT NULL,
  `id_number` varchar(20) NOT NULL,
  `borrower_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrower_ids`
--

INSERT INTO `borrower_ids` (`ID`, `id_type`, `id_number`, `borrower_id`) VALUES
(2, 'Philippine Passport', '12259984', 35),
(3, 'Driver\'s License', '455566', 36),
(5, 'Philippine Passport', '188331451', 38),
(6, 'Philippine Passport', '345324', 39),
(7, 'Philippine Passport', '153135156', 42),
(8, 'Philippine Passport', '4184221', 43);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collateral`
--

CREATE TABLE `collateral` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `type` enum('Land','Vehicle','ATM') DEFAULT NULL,
  `estimated_value` decimal(10,2) DEFAULT NULL,
  `appraisal_date` datetime DEFAULT NULL,
  `ownership_proof` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('Pledged','Released','Forfeited','Pending') DEFAULT NULL,
  `remarks` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `appraised_by` bigint(20) UNSIGNED DEFAULT NULL,
  `loan_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `collateral`
--

INSERT INTO `collateral` (`ID`, `type`, `estimated_value`, `appraisal_date`, `ownership_proof`, `status`, `remarks`, `description`, `appraised_by`, `loan_id`) VALUES
(16, 'Vehicle', NULL, '2025-11-30 03:59:31', NULL, 'Pending', NULL, NULL, NULL, 127),
(21, 'Vehicle', NULL, '2025-11-30 23:38:31', NULL, 'Pending', NULL, NULL, NULL, 138),
(22, 'ATM', NULL, '2025-11-30 23:55:26', NULL, 'Pending', NULL, NULL, NULL, 140),
(23, 'Land', NULL, '2025-12-01 00:12:20', NULL, 'Pending', NULL, '120 m2', NULL, 141),
(24, 'ATM', NULL, '2025-12-01 03:43:37', NULL, 'Pending', NULL, NULL, NULL, 142),
(25, 'Vehicle', NULL, '2025-12-01 05:07:05', NULL, 'Pending', NULL, NULL, NULL, 143);

-- --------------------------------------------------------

--
-- Table structure for table `co_borrower`
--

CREATE TABLE `co_borrower` (
  `ID` bigint(20) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `birth_date` date NOT NULL,
  `address` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `contact_no` varchar(15) NOT NULL,
  `occupation` varchar(20) DEFAULT NULL,
  `position` varchar(20) DEFAULT NULL,
  `agency_address` varchar(50) DEFAULT NULL,
  `marital_status` char(10) DEFAULT NULL,
  `home_ownership` enum('Owned','Rented','Mortgage') DEFAULT NULL,
  `borrower_id` bigint(20) UNSIGNED NOT NULL,
  `net_pay` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `co_borrower`
--

INSERT INTO `co_borrower` (`ID`, `first_name`, `last_name`, `age`, `birth_date`, `address`, `email`, `contact_no`, `occupation`, `position`, `agency_address`, `marital_status`, `home_ownership`, `borrower_id`, `net_pay`) VALUES
(17, 'Myrtle', 'Cute', NULL, '1998-10-18', 'Sasa', 'bbird9124@gmail.com', '09788784545', 'Employee', NULL, NULL, 'Single', NULL, 36, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `file_type` enum('id_document','photo','contract','collateral_documennt') DEFAULT NULL,
  `file_name` varchar(20) NOT NULL,
  `file_path` varchar(100) NOT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp(),
  `description` varchar(100) DEFAULT NULL,
  `borrower_id` bigint(20) UNSIGNED NOT NULL,
  `collateral_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `formula`
--

CREATE TABLE `formula` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `name` varchar(50) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `expression` varchar(500) DEFAULT NULL,
  `variables` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `formula`
--

INSERT INTO `formula` (`ID`, `created_at`, `name`, `description`, `expression`, `variables`) VALUES
(1, '2025-11-21 11:39:45', 'Compound Interest Loan', NULL, 'principal*(rate*(1+rate)^term)/((1+rate)^term-1)', '[\"principal\",\"rate\",\"term\"]'),
(2, '2025-11-21 11:39:45', 'Diminishing Balance Loan', NULL, 'remaining_principal*rate', '[\"remaining_principal\",\"rate\"]');

-- --------------------------------------------------------

--
-- Table structure for table `holidays`
--

CREATE TABLE `holidays` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `holiday_name` varchar(50) NOT NULL,
  `holiday_date` date NOT NULL,
  `holiday_type` enum('Regular','Special','Company') DEFAULT 'Regular',
  `description` varchar(100) DEFAULT NULL,
  `is_Recurring` tinyint(1) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `holidays`
--

INSERT INTO `holidays` (`ID`, `holiday_name`, `holiday_date`, `holiday_type`, `description`, `is_Recurring`, `created_at`) VALUES
(1, 'New Year\'s Day', '2025-01-01', 'Regular', 'New Year Celebration', 1, '2025-11-15 12:02:50'),
(2, 'Holy Week (Maundy Thursday)', '2025-04-17', 'Special', 'Maundy Thursday', 1, '2025-11-15 12:03:56'),
(3, 'Holy Week (Good Friday)', '2025-04-18', 'Special', 'Good Friday', 1, '2025-11-15 12:04:31'),
(4, 'Araw ng Kagitingan', '2025-04-09', 'Regular', 'Day of Valor', 1, '2025-11-15 12:06:00'),
(5, 'Labor Day', '2025-05-01', 'Regular', 'Labor Day', 1, '2025-11-15 12:06:23'),
(6, 'Independence Day', '2025-06-12', 'Regular', 'Philippine Independence', 1, '2025-11-15 12:07:02'),
(7, 'National Heroes Day', '2025-08-25', 'Regular', 'National Heroes Day', 1, '2025-11-15 12:07:26'),
(8, 'Ninoy Aquino Day', '2025-08-21', 'Special', 'Commemoration of Ninoy Aquino', 1, '2025-11-15 12:07:49'),
(9, 'Bonifacio Day', '2025-11-30', 'Regular', 'Bonifacio Day', 1, '2025-11-15 12:08:16'),
(10, 'Christmas Day', '2025-12-25', 'Regular', 'Christmas', 1, '2025-11-15 12:08:43'),
(11, 'Rizal Day', '2025-12-30', 'Regular', 'Rizal Day', 1, '2025-11-15 12:09:01');

-- --------------------------------------------------------

--
-- Table structure for table `jamouser`
--

CREATE TABLE `jamouser` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `contact_no` varchar(15) NOT NULL,
  `account_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jamouser`
--

INSERT INTO `jamouser` (`ID`, `first_name`, `last_name`, `email`, `contact_no`, `account_id`) VALUES
(1, 'Ruby Jan', 'Sanchez', 'rjarevalo9@gmail.com', '123456789', 1);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `landcollateraldetails`
--

CREATE TABLE `landcollateraldetails` (
  `ID` bigint(20) NOT NULL,
  `titleNo` bigint(20) NOT NULL,
  `lotNo` bigint(20) NOT NULL,
  `location` varchar(50) NOT NULL,
  `areaSize` varchar(20) NOT NULL,
  `collateralID` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `landcollateraldetails`
--

INSERT INTO `landcollateraldetails` (`ID`, `titleNo`, `lotNo`, `location`, `areaSize`, `collateralID`) VALUES
(1, 5748578578, 0, 'Sasa', 'Davao', 23);

-- --------------------------------------------------------

--
-- Table structure for table `loan`
--

CREATE TABLE `loan` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `term_months` int(11) NOT NULL,
  `repayment_frequency` enum('Weekly','Monthly','Yearly') DEFAULT NULL,
  `principal_amount` decimal(10,2) NOT NULL,
  `interest_rate` float NOT NULL,
  `interest_type` enum('Compound','Diminishing') NOT NULL,
  `loan_type` varchar(50) DEFAULT NULL,
  `status` enum('Active','Fully_Paid','Bad_Debt','Rejected','Pending') DEFAULT 'Pending',
  `balance_remaining` decimal(10,2) NOT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `borrower_id` bigint(20) UNSIGNED NOT NULL,
  `formula_id` bigint(20) UNSIGNED DEFAULT NULL,
  `released_amount` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loan`
--

INSERT INTO `loan` (`ID`, `start_date`, `end_date`, `term_months`, `repayment_frequency`, `principal_amount`, `interest_rate`, `interest_type`, `loan_type`, `status`, `balance_remaining`, `approved_by`, `created_at`, `updated_at`, `borrower_id`, `formula_id`, `released_amount`) VALUES
(127, '2025-11-30 03:59:48', '2026-10-30 03:59:48', 12, 'Monthly', 20000.00, 5, 'Compound', 'Personal', 'Active', 17507.42, 1, '2025-11-30 03:59:31', '2026-01-09 06:15:50', 34, 1, 18400.00),
(138, '2025-11-30 23:40:39', '2026-10-30 23:40:39', 12, 'Monthly', 1000.00, 5, 'Compound', 'Personal Loan', 'Fully_Paid', 0.00, 1, '2025-11-30 23:38:31', '2025-12-01 02:08:04', 35, 1, 920.00),
(140, NULL, NULL, 6, 'Monthly', 13000.00, 5, 'Compound', 'Personal Loan', 'Pending', 13000.00, NULL, '2025-11-30 23:55:26', '2025-11-30 23:55:26', 36, 1, 0.00),
(141, '2025-12-01 00:12:44', '2026-05-01 00:12:44', 6, 'Monthly', 15000.00, 5, 'Diminishing', 'Home Loan', 'Active', 12500.00, 1, '2025-12-01 00:12:20', '2025-12-01 00:33:03', 39, 1, 13800.00),
(142, '2025-12-01 03:47:39', '2028-11-01 03:47:39', 36, 'Monthly', 100000.00, 50, 'Compound', 'Personal Loan', 'Active', 30042.04, 1, '2025-12-01 03:43:37', '2025-12-01 04:00:21', 42, 1, 500000.00),
(143, '2025-12-01 05:07:57', '2026-11-01 05:07:57', 12, 'Monthly', 10000.00, 5, 'Compound', 'Personal Loan', 'Active', 9647.99, 1, '2025-12-01 05:07:05', '2025-12-01 05:14:08', 43, 1, 9200.00);

-- --------------------------------------------------------

--
-- Table structure for table `loancomments`
--

CREATE TABLE `loancomments` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `comment_text` varchar(100) NOT NULL,
  `commented_by` bigint(20) UNSIGNED NOT NULL,
  `comment_date` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `loan_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_08_26_100418_add_two_factor_columns_to_users_table', 1),
(5, '2025_11_20_035232_create_permission_tables', 2),
(6, '2025_11_20_040542_create_cache_table', 2),
(7, '2025_11_30_144324_add_receipt_number_to_payment_table', 3),
(8, '2026_01_18_131946_add_user_id_to_borrowers_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(1, 'App\\Models\\User', 4),
(1, 'App\\Models\\User', 15),
(1, 'App\\Models\\User', 19),
(2, 'App\\Models\\User', 2),
(2, 'App\\Models\\User', 3),
(2, 'App\\Models\\User', 5),
(2, 'App\\Models\\User', 11),
(2, 'App\\Models\\User', 12),
(2, 'App\\Models\\User', 13),
(2, 'App\\Models\\User', 14),
(3, 'App\\Models\\User', 22),
(3, 'App\\Models\\User', 23),
(3, 'App\\Models\\User', 24),
(3, 'App\\Models\\User', 25),
(3, 'App\\Models\\User', 26),
(3, 'App\\Models\\User', 27),
(3, 'App\\Models\\User', 28),
(3, 'App\\Models\\User', 29),
(3, 'App\\Models\\User', 30),
(3, 'App\\Models\\User', 31),
(3, 'App\\Models\\User', 32);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `receipt_number` varchar(50) NOT NULL,
  `payment_date` datetime DEFAULT current_timestamp(),
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('Bank','Cash','GCash','Cebuana') NOT NULL,
  `reference_no` varchar(50) DEFAULT NULL,
  `remarks` varchar(100) DEFAULT NULL,
  `verified_by` bigint(20) UNSIGNED DEFAULT NULL,
  `verified_date` datetime DEFAULT NULL,
  `schedule_id` bigint(20) UNSIGNED NOT NULL,
  `loan_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`ID`, `receipt_number`, `payment_date`, `amount`, `payment_method`, `reference_no`, `remarks`, `verified_by`, `verified_date`, `schedule_id`, `loan_id`) VALUES
(56, 'RCP-E262281D-20251130230718', '2025-12-01 00:00:00', 1795.48, 'Cash', '', NULL, 1, NULL, 680, 127),
(58, 'RCP-A6EBE4A8-20251130235942', '2025-12-01 00:00:00', 89.78, 'Cash', NULL, NULL, 1, NULL, 692, 138),
(59, 'RCP-21875325-20251201003224', '2025-12-01 00:00:00', 4000.00, 'Cash', NULL, NULL, 1, NULL, 704, 141),
(60, 'RCP-23FDBED1-20251201003303', '2026-01-02 00:00:00', 3750.00, 'Cash', NULL, NULL, 1, NULL, 705, 141),
(61, 'RCP-85050317-20251201020712', '2025-12-31 00:00:00', 500.00, 'Cash', NULL, NULL, 1, NULL, 693, 138),
(62, 'RCP-8848B6B5-20251201020804', '2026-05-30 00:00:00', 465.00, 'Cash', NULL, NULL, 1, NULL, 698, 138),
(63, 'RCP-1A921F82-20251201035521', '2025-12-01 00:00:00', 1000.00, 'Cash', NULL, NULL, 1, NULL, 710, 142),
(64, 'RCP-24A00837-20251201035802', '2025-12-01 00:00:00', 8578.06, 'Cash', NULL, NULL, 1, NULL, 710, 142),
(65, 'RCP-2D541FB9-20251201040021', '2025-12-01 00:00:00', 250000.00, 'Cash', NULL, NULL, 1, NULL, 710, 142),
(66, 'RCP-4205AE16-20251201051408', '2025-12-01 00:00:00', 897.74, 'Cash', NULL, NULL, 1, NULL, 746, 143),
(67, 'RCP-D1613A71-20260109061550', '2025-12-31 00:00:00', 1788.70, 'Cash', NULL, NULL, 1, NULL, 681, 127);

-- --------------------------------------------------------

--
-- Table structure for table `penalty`
--

CREATE TABLE `penalty` (
  `ID` bigint(20) NOT NULL,
  `type` enum('Late_Payment','Bounced_Cheque','Other') DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `date_applied` date DEFAULT curdate(),
  `schedule_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('Pending','Paid','Waived') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `permission_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`ID`, `permission_name`) VALUES
(1, 'awexawex');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'loan.create', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(2, 'loan.view', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(3, 'loan.update', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(4, 'loan.delete', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(5, 'borrower.create', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(6, 'borrower.view', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(7, 'borrower.update', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(8, 'borrower.delete', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(9, 'user.create', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(10, 'user.view', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(11, 'user.update', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(12, 'user.delete', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(13, 'repayment.create', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(14, 'repayment.view', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(15, 'repayment.update', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(16, 'repayment.delete', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(17, 'reports.view', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(18, 'collection.daily', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(19, 'loan.view.own', 'web', '2026-01-09 13:59:31', '2026-01-09 13:59:31'),
(20, 'repayment.view.own', 'web', '2026-01-09 13:59:31', '2026-01-09 13:59:31'),
(21, 'profile.view', 'web', '2026-01-09 13:59:31', '2026-01-09 13:59:31'),
(22, 'profile.update', 'web', '2026-01-09 13:59:31', '2026-01-09 13:59:31');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`ID`, `role_name`, `permission_id`) VALUES
(1, 'Manager', 1);

-- --------------------------------------------------------

--
-- Table structure for table `rolepermission`
--

CREATE TABLE `rolepermission` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(2, 'cashier', 'web', '2025-11-19 16:42:53', '2025-11-19 16:42:53'),
(3, 'customer', 'web', '2026-01-09 13:59:38', '2026-01-09 13:59:38');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(2, 1),
(2, 2),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(6, 2),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(13, 2),
(14, 1),
(14, 2),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(18, 2),
(19, 3),
(20, 3),
(21, 3),
(22, 3);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('CkK2CRNOVITGFulEXZLZ1SJta7uBfHgcKQPaaw0M', 23, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoicEhLMTRnU2dSMk5Kd3ZnRkhkbXVyOGtGNHZqSHpsRWxUUldtOHdIVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9jdXN0b21lci9kYXNoYm9hcmQiO3M6NToicm91dGUiO3M6MTg6ImN1c3RvbWVyLmRhc2hib2FyZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjIzO30=', 1769520204),
('e0pSySTKcpGozcH1V8FhLCTmUOGJeGbFB34YAqQk', 23, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiOHVkUnBxUlhiYWRDSHI4bXhqRDBENllNUmF4YjNBZ1RtZzl0RlV6NiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9jdXN0b21lci9kYXNoYm9hcmQiO3M6NToicm91dGUiO3M6MTg6ImN1c3RvbWVyLmRhc2hib2FyZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjIzO30=', 1769564482),
('mRM6bkgs86ceZeW1S07t8YoK3M3S4oZprT0zsN3W', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiR3BWaUFKa2ZDNkhVcWtRSTQ4OFAwTkVqNE11QWZaRzhYN2ZsVjNhNyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769519361);

-- --------------------------------------------------------

--
-- Table structure for table `spouse`
--

CREATE TABLE `spouse` (
  `ID` bigint(20) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `contact_no` varchar(15) NOT NULL,
  `occupation` varchar(20) DEFAULT NULL,
  `position` varchar(20) DEFAULT NULL,
  `agency_address` varchar(50) DEFAULT NULL,
  `borrower_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `useraccount`
--

CREATE TABLE `useraccount` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(20) NOT NULL,
  `password_hash` varchar(20) NOT NULL,
  `status` enum('Active','InActive') DEFAULT 'Active',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `useraccount`
--

INSERT INTO `useraccount` (`ID`, `username`, `password_hash`, `status`, `created_at`, `updated_at`) VALUES
(1, 'rjarevalo', '123456789', 'Active', '2025-11-17 13:50:47', '2025-11-17 13:50:47');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `username`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `created_at`, `updated_at`, `deleted_at`, `last_login_at`) VALUES
(1, 'Admin', 'admin@example.com', 'admin', NULL, '$2y$12$hiYYS7mFPd44qqJONWu99O/jDWirPB/ME/Sp05F7zYRvzFBbkW48S', NULL, NULL, NULL, 'w16nXmpi9UbUcKFz0kCEZxc9RNBEtPjDSGjUBO101JKvgutrUBerJ7EaYjPK', '2025-11-19 15:09:37', '2025-11-19 15:09:37', NULL, '2025-11-19 15:09:37'),
(2, 'Cashier', 'cashier@example.com', 'cashier', NULL, '$2y$12$JKZ8rPc3ZRu5FG3SGONQN.J7Elo7WuMODSyIiOZGnLnk5wC/2dDu6', NULL, NULL, NULL, NULL, '2025-11-20 09:52:01', '2025-11-20 09:52:01', NULL, '2025-11-20 09:52:01'),
(3, 'Jericca Oracion', 'jca@gmail.com', 'j.oracion', NULL, '$2y$12$BLRbEqUTbdPSoSzIDk4myOlL88fTDQFkRwKNMs2V4pke1AtA0QVym', NULL, NULL, NULL, NULL, '2025-11-20 15:15:35', '2025-11-20 15:15:35', NULL, NULL),
(4, 'Josh Sanchez', 'josh@jamo.com', 'j.sanchez', NULL, '$2y$12$KLZxqdTg1yB.0aOwrBgGbeF7G3d.XYpOA7SKeLlaENJ1THttwxDyi', NULL, NULL, NULL, NULL, '2025-11-20 15:22:44', '2025-11-20 15:22:44', NULL, NULL),
(11, 'Day Si', 'days@jamo.com', 'd.si', NULL, '$2y$12$otqCUUXxb9YUW9JmTfILguHvoRtIRpJZJfjDz9lDtAFLfjBBKr022', NULL, NULL, NULL, NULL, '2025-11-20 16:18:18', '2025-11-20 16:18:18', NULL, NULL),
(12, 'firt fgs', 'as@gmail.com', 'f.fgs', NULL, '$2y$12$gPQEWSa6s3OYMhqgNfTkteUR6l8es5ewb5bipu/MWr3hUsWMbad8S', NULL, NULL, NULL, NULL, '2025-11-20 16:19:42', '2025-11-20 16:19:42', NULL, NULL),
(13, 'Tabang Help', 'help@jamo.com', 't.help', NULL, '$2y$12$lGIAsGY6J1XeJRGDfMtgSebrYu1Fc.mR8LqP6.36hSQn7FlSHW8f2', NULL, NULL, NULL, NULL, '2025-11-20 16:24:28', '2025-11-20 16:24:28', NULL, NULL),
(14, 'Help tabang', 'tabangp@jamo.com', 'h.tabang', NULL, '$2y$12$lVtjfUOR5tMcz8/rV1dBp.BjO5Y.T1Z3FY.XTUnJ7EIWVar6eEyPC', NULL, NULL, NULL, NULL, '2025-11-20 16:27:44', '2025-11-20 16:27:44', NULL, NULL),
(15, 'Kristine Hilario', 'k@gmailcom', 'k.hilario', NULL, '$2y$12$jARNIRUqqrbCD2.3dExByuYEOqKxW1zjrK5Iygi7alXUYUdAHEACu', NULL, NULL, NULL, NULL, '2025-11-26 00:38:05', '2025-11-26 00:38:05', NULL, NULL),
(19, 'Jericca Oracion', 'jeikamax62@gmail.com', 'j.oracion1', NULL, '$2y$12$zss8KXqvGTb7zXpUz5Icpuc6qML6vJg8lAs1FnFjche/DUw9Ap1jG', NULL, NULL, NULL, '6LhdfmGlG2YuRz2EZg5FFuDvYa0LoZjNPY8f71jXKterjO8HnlIijjaCvnQL', '2025-11-30 16:35:32', '2025-11-30 16:35:32', NULL, NULL),
(22, 'Rj Arevalo', 'rjarevalo9@gmail.com', 'r.arevalo', NULL, '$2y$12$VTF/FP8FVpEV9GiSQilO9umZyG4iyuIuh/P50XremrMtJ2vWhxjy2', NULL, NULL, NULL, NULL, '2026-01-19 21:01:15', '2026-01-19 21:01:15', NULL, NULL),
(23, 'Myrtle Co', 'bbird9124@gmail.com', 'm.co', NULL, '$2y$12$/VC/DRFk8cVeL/N2yrkf4e9/yfsNOqVujjibHXJo3cTCqCI14WEPW', NULL, NULL, NULL, 'FZatQONxeCNggDrnT4xViaHIdfnQMuLTGo85qhGDwCVLaa9iHXypMtjPgLJ9', '2026-01-19 21:01:15', '2026-01-19 21:01:15', NULL, NULL),
(24, 'Rhea Ridge', 'rijx62@gmail.com', 'r.ridge', NULL, '$2y$12$HQBzPQhhk1pC/IcqIO2HfehH3H4dwY6CUcL/hVqsfpJY13m0riot.', NULL, NULL, NULL, NULL, '2026-01-19 21:01:15', '2026-01-19 21:01:15', NULL, NULL),
(25, 'Jun Tan', 'jun@gmail.com', 'j.tan', NULL, '$2y$12$OxEqVEMGct/soJQ9DIBlFuavpjlEnqT7fYCVlfmuICS/4NICjEhbC', NULL, NULL, NULL, NULL, '2026-01-19 21:01:15', '2026-01-19 21:01:15', NULL, NULL),
(26, 'Vico Ty', 'v@gmail.com', 'v.ty', NULL, '$2y$12$q8PzB50j6Rs2yMzApchZCeRxD6x2NwzeAjojQRF/WXisnkOIZmMEm', NULL, NULL, NULL, NULL, '2026-01-19 21:01:16', '2026-01-19 21:01:16', NULL, NULL),
(27, 'Ariel Lapinas', 'ariel@lapinas.com', 'a.lapinas', NULL, '$2y$12$0ncC/RxZh.mEX9wzkVIqGuVcrcbU573bFGI3mgmqRdKKIM7q4JS4W', NULL, NULL, NULL, NULL, '2026-01-19 21:01:16', '2026-01-19 21:01:16', NULL, NULL),
(28, 'Rafael Sanchez', 'josh@gmail.com', 'r.sanchez', NULL, '$2y$12$EADb0mJKrXFgAXqDJvvvQ.Qbz2qpWTmWRCYweoh8mHaiWDbLBLkbS', NULL, NULL, NULL, NULL, '2026-01-19 21:01:16', '2026-01-19 21:01:16', NULL, NULL),
(29, 'Test Customer', 'customer@example.com', 't.customer', NULL, '$2y$12$XbiSnb0A8//bSxaiqY9mCe3HjQsQR8fNaDvy.lfT94i.mOx9gRc3i', NULL, NULL, NULL, NULL, '2026-01-20 21:18:21', '2026-01-20 21:18:21', NULL, NULL),
(31, 'Jelly Karina', 'jellyk060@gmail.com', 'j.karina', NULL, '$2y$12$lrDKKTSqyJXwJ9h2xnACAufst6waU3sUv8EnfYBYPqB08a1vRu.o.', NULL, NULL, NULL, NULL, '2026-01-22 19:03:42', '2026-01-22 19:03:42', NULL, NULL),
(32, 'Tiel Biyay', 'biyay@gmail.com', 't.biyay', NULL, '$2y$12$dXnvaDDcso./1MI16RLuw.theU4cLkXM2cbbrLZpYzE.qAR1cdV4u', NULL, NULL, NULL, NULL, '2026-01-26 00:41:05', '2026-01-26 00:41:05', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`id`, `user_id`, `phone`, `email`, `avatar_url`, `meta`, `created_at`, `updated_at`) VALUES
(1, 3, '092122648577', 'jca@gmail.com', NULL, NULL, '2025-11-20 15:15:35', '2025-11-20 15:15:35'),
(2, 4, '09255467455', 'josh@jamo.com', NULL, NULL, '2025-11-20 15:22:44', '2025-11-20 15:22:44'),
(4, 11, '0912421530263', 'days@jamo.com', NULL, NULL, '2025-11-20 16:18:18', '2025-11-20 16:18:18'),
(5, 12, '064563423454', 'as@gmail.com', NULL, NULL, '2025-11-20 16:19:42', '2025-11-20 16:19:42'),
(6, 13, '0928874126', 'help@jamo.com', NULL, NULL, '2025-11-20 16:24:28', '2025-11-20 16:24:28'),
(7, 14, '09288741288', 'tabangp@jamo.com', NULL, NULL, '2025-11-20 16:27:44', '2025-11-20 16:27:44'),
(8, 15, '09234423452', 'k@gmailcom', NULL, NULL, '2025-11-26 00:38:05', '2025-11-26 00:38:05'),
(12, 19, '09910094454', 'jeikamax62@gmail.com', NULL, NULL, '2025-11-30 16:35:32', '2025-11-30 16:35:32');

-- --------------------------------------------------------

--
-- Table structure for table `vehiclecollateraldetails`
--

CREATE TABLE `vehiclecollateraldetails` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `type` enum('Car','Motorcycle','Truck') DEFAULT NULL,
  `brand` varchar(20) NOT NULL,
  `model` varchar(20) NOT NULL,
  `year_model` year(4) DEFAULT NULL,
  `plate_no` varchar(20) DEFAULT NULL,
  `engine_no` varchar(20) DEFAULT NULL,
  `transmission_type` enum('Manual','Automatic') DEFAULT NULL,
  `fuel_type` varchar(20) DEFAULT NULL,
  `collateral_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehiclecollateraldetails`
--

INSERT INTO `vehiclecollateraldetails` (`ID`, `type`, `brand`, `model`, `year_model`, `plate_no`, `engine_no`, `transmission_type`, `fuel_type`, `collateral_id`) VALUES
(12, 'Car', 'Toyota', 'Brand New', '2000', '1234', '1234', 'Manual', 'Fuel', 16),
(17, 'Car', 'Toyota', 'CSF', '2015', 'GOT781A', '45551886', 'Manual', 'Gasoline', 21),
(18, 'Car', 'Toyota', '15615', '2014', '1515616', '1651', 'Manual', 'Gasoline', 25);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amortizationschedule`
--
ALTER TABLE `amortizationschedule`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_AmortizationSchedule_Holidays` (`holiday_id`),
  ADD KEY `FK_AmortizationSchedule_Loan` (`loan_id`);

--
-- Indexes for table `atmcollateraldetails`
--
ALTER TABLE `atmcollateraldetails`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_ATM_Collateral` (`collateral_id`);

--
-- Indexes for table `borrower`
--
ALTER TABLE `borrower`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `borrower_user_id_foreign` (`user_id`);

--
-- Indexes for table `borrower_addresses`
--
ALTER TABLE `borrower_addresses`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_Borrower_Addresses` (`borrower_id`);

--
-- Indexes for table `borrower_employments`
--
ALTER TABLE `borrower_employments`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_Employments_Borrower` (`borrower_id`);

--
-- Indexes for table `borrower_ids`
--
ALTER TABLE `borrower_ids`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_Ids_Borrower` (`borrower_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `collateral`
--
ALTER TABLE `collateral`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_Collateral_User` (`appraised_by`),
  ADD KEY `FK_Collateral_Loan` (`loan_id`);

--
-- Indexes for table `co_borrower`
--
ALTER TABLE `co_borrower`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_CoBorrower_Borrower` (`borrower_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_Files_Borrower` (`borrower_id`),
  ADD KEY `FK_Files_Collateral` (`collateral_id`);

--
-- Indexes for table `formula`
--
ALTER TABLE `formula`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `holidays`
--
ALTER TABLE `holidays`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `jamouser`
--
ALTER TABLE `jamouser`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_User_UserAccount` (`account_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `landcollateraldetails`
--
ALTER TABLE `landcollateraldetails`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_Land_Collateral` (`collateralID`);

--
-- Indexes for table `loan`
--
ALTER TABLE `loan`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_Loan_Borrower` (`borrower_id`),
  ADD KEY `FK_Loan_User` (`approved_by`),
  ADD KEY `FK_Loan_Formula` (`formula_id`);

--
-- Indexes for table `loancomments`
--
ALTER TABLE `loancomments`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_LoanComments_User` (`commented_by`),
  ADD KEY `FK_LoanComments_loan` (`loan_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `payment_receipt_number_unique` (`receipt_number`),
  ADD UNIQUE KEY `reference_no` (`reference_no`),
  ADD KEY `FK_Payment_AmortizationSchedule` (`schedule_id`),
  ADD KEY `FK_Payment_Loan` (`loan_id`),
  ADD KEY `FK_Payment_Users` (`verified_by`);

--
-- Indexes for table `penalty`
--
ALTER TABLE `penalty`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_Penalty_AmortizationSchedule` (`schedule_id`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_Role_Permission` (`permission_id`);

--
-- Indexes for table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD KEY `FK_RolePermission_Role` (`role_id`),
  ADD KEY `FK_RolePermission_Permission` (`permission_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `spouse`
--
ALTER TABLE `spouse`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_Spouse_Borrower` (`borrower_id`);

--
-- Indexes for table `useraccount`
--
ALTER TABLE `useraccount`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehiclecollateraldetails`
--
ALTER TABLE `vehiclecollateraldetails`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_Vehicle_Collateral` (`collateral_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `amortizationschedule`
--
ALTER TABLE `amortizationschedule`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=758;

--
-- AUTO_INCREMENT for table `atmcollateraldetails`
--
ALTER TABLE `atmcollateraldetails`
  MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `borrower`
--
ALTER TABLE `borrower`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `borrower_addresses`
--
ALTER TABLE `borrower_addresses`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `borrower_employments`
--
ALTER TABLE `borrower_employments`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `borrower_ids`
--
ALTER TABLE `borrower_ids`
  MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `collateral`
--
ALTER TABLE `collateral`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `co_borrower`
--
ALTER TABLE `co_borrower`
  MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `formula`
--
ALTER TABLE `formula`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `holidays`
--
ALTER TABLE `holidays`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `jamouser`
--
ALTER TABLE `jamouser`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `landcollateraldetails`
--
ALTER TABLE `landcollateraldetails`
  MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `loan`
--
ALTER TABLE `loan`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=144;

--
-- AUTO_INCREMENT for table `loancomments`
--
ALTER TABLE `loancomments`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `penalty`
--
ALTER TABLE `penalty`
  MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `spouse`
--
ALTER TABLE `spouse`
  MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `useraccount`
--
ALTER TABLE `useraccount`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `vehiclecollateraldetails`
--
ALTER TABLE `vehiclecollateraldetails`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `amortizationschedule`
--
ALTER TABLE `amortizationschedule`
  ADD CONSTRAINT `FK_AmortizationSchedule_Holidays` FOREIGN KEY (`holiday_id`) REFERENCES `holidays` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AmortizationSchedule_Loan` FOREIGN KEY (`loan_id`) REFERENCES `loan` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `atmcollateraldetails`
--
ALTER TABLE `atmcollateraldetails`
  ADD CONSTRAINT `FK_ATM_Collateral` FOREIGN KEY (`collateral_id`) REFERENCES `collateral` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `borrower`
--
ALTER TABLE `borrower`
  ADD CONSTRAINT `borrower_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `borrower_addresses`
--
ALTER TABLE `borrower_addresses`
  ADD CONSTRAINT `FK_Borrower_Addresses` FOREIGN KEY (`borrower_id`) REFERENCES `borrower` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `borrower_employments`
--
ALTER TABLE `borrower_employments`
  ADD CONSTRAINT `FK_Employments_Borrower` FOREIGN KEY (`borrower_id`) REFERENCES `borrower` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `borrower_ids`
--
ALTER TABLE `borrower_ids`
  ADD CONSTRAINT `FK_Ids_Borrower` FOREIGN KEY (`borrower_id`) REFERENCES `borrower` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `collateral`
--
ALTER TABLE `collateral`
  ADD CONSTRAINT `FK_Collateral_Loan` FOREIGN KEY (`loan_id`) REFERENCES `loan` (`ID`),
  ADD CONSTRAINT `FK_Collateral_User` FOREIGN KEY (`appraised_by`) REFERENCES `jamouser` (`ID`);

--
-- Constraints for table `co_borrower`
--
ALTER TABLE `co_borrower`
  ADD CONSTRAINT `FK_CoBorrower_Borrower` FOREIGN KEY (`borrower_id`) REFERENCES `borrower` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `FK_Files_Borrower` FOREIGN KEY (`borrower_id`) REFERENCES `borrower` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Files_Collateral` FOREIGN KEY (`collateral_id`) REFERENCES `collateral` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `jamouser`
--
ALTER TABLE `jamouser`
  ADD CONSTRAINT `FK_User_UserAccount` FOREIGN KEY (`account_id`) REFERENCES `useraccount` (`ID`);

--
-- Constraints for table `loan`
--
ALTER TABLE `loan`
  ADD CONSTRAINT `FK_Loan_Borrower` FOREIGN KEY (`borrower_id`) REFERENCES `borrower` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Loan_Formula` FOREIGN KEY (`formula_id`) REFERENCES `formula` (`ID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Loan_User` FOREIGN KEY (`approved_by`) REFERENCES `jamouser` (`ID`);

--
-- Constraints for table `loancomments`
--
ALTER TABLE `loancomments`
  ADD CONSTRAINT `FK_LoanComments_User` FOREIGN KEY (`commented_by`) REFERENCES `jamouser` (`ID`),
  ADD CONSTRAINT `FK_LoanComments_loan` FOREIGN KEY (`loan_id`) REFERENCES `loan` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `FK_Payment_AmortizationSchedule` FOREIGN KEY (`schedule_id`) REFERENCES `amortizationschedule` (`ID`),
  ADD CONSTRAINT `FK_Payment_Loan` FOREIGN KEY (`loan_id`) REFERENCES `loan` (`ID`),
  ADD CONSTRAINT `FK_Payment_Users` FOREIGN KEY (`verified_by`) REFERENCES `jamouser` (`ID`) ON UPDATE CASCADE;

--
-- Constraints for table `penalty`
--
ALTER TABLE `penalty`
  ADD CONSTRAINT `FK_Penalty_AmortizationSchedule` FOREIGN KEY (`schedule_id`) REFERENCES `amortizationschedule` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role`
--
ALTER TABLE `role`
  ADD CONSTRAINT `FK_Role_Permission` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`ID`);

--
-- Constraints for table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD CONSTRAINT `FK_RolePermission_Permission` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_RolePermission_Role` FOREIGN KEY (`role_id`) REFERENCES `role` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `spouse`
--
ALTER TABLE `spouse`
  ADD CONSTRAINT `FK_Spouse_Borrower` FOREIGN KEY (`borrower_id`) REFERENCES `borrower` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `vehiclecollateraldetails`
--
ALTER TABLE `vehiclecollateraldetails`
  ADD CONSTRAINT `FK_Vehicle_Collateral` FOREIGN KEY (`collateral_id`) REFERENCES `collateral` (`ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
