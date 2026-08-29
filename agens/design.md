# Portfolio & Admin Dashboard Design System

## 1. Overview
This document outlines the design system, UI architecture, and technical styling for the **Portfolio** and its corresponding **Admin Dashboard**. The design embraces a modern **Brutalist / Paper** aesthetic, characterized by high contrast, hard solid shadows, thick borders, and distinct container separations.

## 2. Typography & Iconography
* **Primary Font:** `Montserrat` (sans-serif) imported via Google Fonts. 
* **Font Weights:** Regular (400), Medium (500), Semi-Bold (600), and Bold (700-900).
* **Iconography:** **Remix Icons** (v4.9.0) used for all UI icons (e.g., dashboard, skills, external links, social media).

## 3. Color Palette
The custom Tailwind CSS configuration utilizes the following primary colors:
* **Primary (Accent):** `hsl(90, 82%, 68%)` - A vibrant light green used for active states, buttons, and highlights.
* **Primary Alt:** `hsl(90, 78%, 64%)`
* **Title/Text:** `hsl(0, 0%, 4%)` - Near black for high legibility.
* **Background:** `#EAEAEA` - Slightly darker gray acting as the table/desk background.
* **Paper (Surface):** `#F3F3F3` - Lighter gray/off-white acting as the primary document container.

## 4. UI/UX Aesthetic (Brutalist & Paper)
The system relies on specific CSS properties to achieve its unique look:
* **Brutal Shadows:** Hard, unblurred box shadows (`box-shadow: 4px 4px 0 0 rgba(0,0,0,1)` or `8px 8px 0 0`).
* **Thick Borders:** Consistent `2px solid` borders around containers, buttons, and inputs.
* **Dashed Elements:** Dashed dividers (`border-dashed`) and decorative offset background borders (e.g., behind profile images) rotated slightly (e.g., `4deg`) to give a crafted, scrapbook feel.
* **Image Treatment:** Profile and project images default to `grayscale` and transition to full color/scale on hover (`hover:scale-105`).

## 5. Layout Architecture

### A. Admin Dashboard
* **Structure:** A standard web app layout featuring a fixed sidebar (left) and a main scrollable content area (right). Responsive design toggles the sidebar into a mobile menu.
* **Navigation:** Sidebar links switch between different sections (Dashboard, Profile, Skills & Tools, Experience, Education, Projects) using Vanilla JS to toggle CSS `hidden` classes.
* **Components:** 
  * **Stat Cards:** Grid layouts displaying total projects, skills, experience, and profile status.
  * **Modals:** Fixed full-screen backdrop with brutalist modal boxes (`max-w-md` and `max-w-2xl`) for CRUD operations (Add/Edit Skill, Project, Experience).
  * **Toast Notifications:** Slide-up notifications for user feedback on actions.

### B. Public Portfolio (Resume)
* **Structure:** A single centralized "Paper" container (`max-w-[1120px]`) centered on the page with thick padding (`py-16 md:py-24`), mimicking a physical printed resume.
* **Header Area:** Split layout with the user's name, title, and bio on the left, and a decorative dashed-border profile image on the right.
* **Tab Navigation:** Pill-shaped toggle switches between "Information" (Skills, Experience, Education) and "Projects". Includes smooth opacity transitions.
* **Grid Systems:** Uses CSS Grid (`grid-cols-1 md:grid-cols-[1.2fr_1fr]`) to separate content logically (e.g., Skills/Tools on the left, Experience/Education on the right).

## 6. Tech Stack
* **HTML5:** Semantic HTML markup.
* **Tailwind CSS:** Utilizing the CDN script for rapid prototyping and styling with custom configuration for theme extension.
* **Vanilla JavaScript:** Handles tab switching, sidebar toggling, modal state management, toast notifications, and local state (CRUD mimicking).
