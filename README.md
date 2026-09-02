# Travel App Architecture Summary

## 1. Project Overview

This project is a Next.js travel application built as a single multi-brand platform. The frontend is implemented in the root application under `app/`, `components/`, `config/`, `data/`, and `lib/`, while the backend API is implemented in the separate ASP.NET project under `TravelApp.Api/`.

The main design goal is to keep one shared application and one shared backend while changing presentation, branding, and user experience based on the active brand selected through configuration.

The application currently supports three brand variants:

- Wanderly
- TravelPro
- MyTravel

Each brand retains the same route structure, shared data model, and shared API usage, but changes its visual identity and UX behavior.

---

## 2. Configuration-Driven Multi-Brand Architecture

The brand system is driven by a centralized config layer in `config/index.ts`.

The active brand is selected using the environment variable:

- `NEXT_PUBLIC_BRAND`

Valid values are:

- `wanderly`
- `travelpro`
- `mytravel`

This configuration is then used by components and pages to switch layout, colors, hero content, splash behavior, destination presentation, and trip creation flows.

Key files:

- `config/index.ts`
- `config/wanderly.ts`
- `config/travelpro.ts`
- `config/mytravel.ts`
- `config/types.ts`

The architecture is intentionally configuration-driven rather than code-split into three separate apps.

---

## 3. Supported Brands

### Wanderly

- Editorial travel brand
- Warm paper/earth-tone styling
- Story-led destination experience
- Destination pages feel like travel magazine exploration

Brand config file:

- `config/wanderly.ts`

### TravelPro

- Professional booking-focused brand
- Clean business/travel platform styling
- Structured booking and destination presentation
- More utility/booking-oriented user flow

Brand config file:

- `config/travelpro.ts`

### MyTravel

- Personal travel planning brand
- Friendly, modern, and discovery-led styling
- More personalized trip planning experience

Brand config file:

- `config/mytravel.ts`

---

## 4. Shared Next.js Application

The frontend is a single Next.js application, not three separate applications.

Primary app folders:

- `app/`
- `components/`
- `config/`
- `data/`
- `lib/`
- `types/`

The routes are shared across brands:

- `/`
- `/about`
- `/contact`
- `/destinations`
- `/destinations/[id]`
- `/trips`
- `/trips/create`

The active brand changes how the same end-user pages are presented, but the route structure remains consistent.

---

## 5. Shared Navbar with Brand Variants

The shared Navbar is implemented in:

- `components/Navbar.tsx`

It reads the active brand configuration and adapts its layout and styling based on the brand name. The Navbar is shared for all app pages, but the look and navigation emphasis differ between Wanderly, TravelPro, and MyTravel.

This is a key example of the project's architecture:

- same component reused across the app
- different presentation based on config
- no duplicate navbar code for each app

---

## 6. Brand-Specific Splash Behavior

The app includes a brand startup splash screen implemented in:

- `components/BrandStartup.tsx`
- `components/brand/BrandSplash.tsx`

This behavior is active at app startup and shows a brief intro sequence based on the current brand. It is used before the main UI is displayed.

Examples of the splash behavior:

- Wanderly uses a warm editorial-style intro
- TravelPro uses a professional dark/blue presentation
- MyTravel uses a soft personal/purple experience

This is still part of the same application, just styled through configuration.

---

## 7. Brand-Specific Home UI

The home page is implemented in:

- `app/page.tsx`

The home UI is composed from a shared brand shell and brand-specific sections:

- `components/brand/BrandShell.tsx`
- `components/brand/BrandHero.tsx`
- `components/brand/BrandDestinations.tsx`
- `components/brand/BrandBooking.tsx`
- `components/brand/BrandPhilosophy.tsx`

Each brand has a custom hero, destination highlight section, and booking/story messaging, but they are all mounted into the same app shell.

---

## 8. Brand-Specific Destination Presentation

Destination pages remain in the same route system:

- `/destinations`
- `/destinations/[id]`

The project uses shared destination data and shared route logic while applying different UI treatment for each brand.

The relevant files are:

- `app/destinations/page.tsx`
- `app/destinations/[id]/page.tsx`
- `components/DestinationGrid.tsx`
- `components/DestinationCard.tsx`

The current implementation keeps one shared destination experience with brand-specific visual language for:

- Wanderly: editorial premium travel storytelling
- TravelPro: structured and booking-oriented presentation
- MyTravel: discovery and personal trip-planning style

This is shared in structure, not duplicated in application form.

---

## 9. Brand-Specific Trip Creation UX

Trip creation is one of the clearest examples of brand-specific UI within a shared app.

The trip creation page is:

- `app/trips/create/page.tsx`

The form logic is implemented in:

- `components/trips/BrandTripCreate.tsx`

The UI changes depending on the active brand:

- Wanderly: immersive editorial itinerary design
- TravelPro: professional booking form layout
- MyTravel: guided, conversational multi-step trip planning flow

The data flow still uses the same shared destination list and same shared API client calls. The difference is the presentation and user journey, not the backend contract.

---

## 10. Brand-Specific User/Trip Experience

The user experience is intentionally shaped by brand configuration. The app keeps the same fundamental travel flow but alters the emotional tone and UX strategy:

- Wanderly: discovery and storytelling
- TravelPro: booking and organization
- MyTravel: personal planning and comfort

The experience remains consistent in terms of user goals, but the interface language, layout, color palette, and workflow are brand-specific.

---

## 11. Shared API Architecture using `apiClient.ts`

The shared API logic is centralized in:

- `lib/apiClient.ts`

This file exposes `apiFetch`, which performs requests against the configured backend base URL using `NEXT_PUBLIC_API_URL`.

The current API base URL is read from the environment variable:

- `NEXT_PUBLIC_API_URL`

Example usage in the project:

- trip creation requests in `components/trips/BrandTripCreate.tsx`
- shared API access pattern for frontend/backend communication

This ensures the frontend does not manually construct backend calls repeatedly across the app.

---

## 12. Shared Destination Data using `destinations.ts`

The central destination dataset is stored in:

- `data/destinations.ts`

The destination type is defined in:

- `types/destination.ts`

This shared dataset includes:

- destination id
- name
- country
- description
- long description
- image URL
- price
- rating
- tags
- duration

This data is reused by:

- the destination list pages
- the destination detail pages
- the trip creation flow
- brand-specific destination cards and sections

This is one shared data source, not three app-specific data stores.

---

## 13. Shared Backend Architecture

The backend is implemented in the ASP.NET project:

- `TravelApp.Api/`

Main entry point:

- `TravelApp.Api/Program.cs`

The project uses:

- ASP.NET Core
- controllers
- Entity Framework Core
- SQLite configuration
- CORS configuration for the Next.js app

The backend is accessible from the frontend through the shared API client and is configured to allow requests from the app origin (`http://localhost:3000`).

Important note:

- The frontend and backend are separate technologies, but they are not separate applications from a product standpoint.
- The product is one travel system with one shared API layer and one shared database-backed backend service.

---

## 14. How the Brand Switch Works

The brand selection is done in the configuration layer:

- `config/index.ts`

It reads:

- `process.env.NEXT_PUBLIC_BRAND`

Then it validates the value and selects the matching config object:

- `wanderlyConfig`
- `travelproConfig`
- `mytravelConfig`

From that point onward, the app imports `config` and uses the active brand metadata and UI settings for rendering.

Example behavior:

- Navbar changes brand label and styling
- Splash screen changes look and tone
- Home page layout and content adapt
- Destination pages adapt visual treatment
- Trip creation UX changes

---

## 15. Why This Is One Application Instead of Three Applications

This is one application because:

- all shared routing lives in the same Next.js app
- all shared data types and destination data are centralized
- the same pages and API calls are reused across brands
- the brand is a runtime configuration choice, not a separate deployment or codebase
- the frontend and backend remain connected through one shared service model

In other words, the architecture is built around configuration-driven variation, not multi-app duplication.

This is a strong engineering pattern for product variation because it reduces maintenance and keeps the business logic unified.

---

## 16. Data Flow from Frontend to Backend

The data flow is straightforward:

1. User loads the frontend in the Next.js app.
2. The app reads the active brand from `NEXT_PUBLIC_BRAND`.
3. The UI renders according to the selected brand config.
4. User interaction triggers a request through `lib/apiClient.ts`.
5. `apiFetch` sends the request to the ASP.NET backend.
6. The ASP.NET API processes the request and interacts with data storage.
7. The frontend receives the response and updates the UI.

Typical example:

- user creates a trip in `BrandTripCreate.tsx`
- request is sent via `apiFetch("/api/trips", ...)`
- backend handles trip creation
- payment flow is triggered through `/api/payments/checkout`

This path stays consistent across all brands.

---

## 17. Benefits of the Configuration-Driven Architecture

This architecture provides several advantages:

- one shared application with lower maintenance cost
- consistent routes and logic across brands
- easier product scaling and variation management
- centralized brand logic in `config/`
- reusable API and data layer across all brands
- faster feature development because business logic is not duplicated
- clean separation between shared system logic and brand presentation

It is a practical and scalable approach for a multi-brand travel product.

---

## 18. Current Project Structure

```text
travel-app/
├── app/
│   ├── about/
│   ├── contact/
│   ├── destinations/
│   │   ├── [id]/
│   │   └── page.tsx
│   ├── trips/
│   │   ├── create/
│   │   └── ...
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── brand/
│   ├── home/
│   ├── trips/
│   ├── BrandStartup.tsx
│   ├── DestinationCard.tsx
│   ├── DestinationGrid.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   └── ...
├── config/
│   ├── index.ts
│   ├── mytravel.ts
│   ├── travelpro.ts
│   ├── types.ts
│   └── wanderly.ts
├── data/
│   └── destinations.ts
├── lib/
│   └── apiClient.ts
├── types/
│   └── destination.ts
├── TravelApp.Api/
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Models/
│   ├── Program.cs
│   └── ...
├── .env
├── package.json
├── next.config.ts
├── prisma.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── ...
```

---

## 19. Architecture Diagram

```text
One Next.js App
        ↓
Brand Configuration
        ↓
Wanderly / TravelPro / MyTravel
        ↓
Brand-specific UI
        ↓
Shared API Client
        ↓
Shared ASP.NET Backend
        ↓
Database
```

---

## 20. Short Final-Year Project / Interview Explanation

This project demonstrates a configuration-driven multi-brand web application built using Next.js and a shared ASP.NET backend. Instead of creating three separate applications, the project uses a single frontend and a single shared business/API layer, while brand-specific variations are controlled through configuration. The active brand is selected using `NEXT_PUBLIC_BRAND`, and the app changes its presentation, navigation, home experience, destination styling, and trip creation flow accordingly. This approach reduces duplication, keeps the codebase maintainable, and allows the system to scale into multiple branded travel experiences without losing a unified architecture.

This is a strong example of modern software design because it combines shared service architecture, maintainable configuration, and a user-focused brand experience in a single application.
