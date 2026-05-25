# KITSW Unofficial

Student-first campus hub for Kakatiya Institute of Technology & Science, Warangal.

## What is built

- A polished home feed with tabs for Events, Notes, and Campus Feed.
- Animated tab switching and card motion with Framer Motion.
- Supabase-backed events and notes loading with loading, empty, and error states.
- Event cards with themed styling, register links, and client-side likes.
- Note cards with file-type pills, instant download, and admin hide actions.
- A hero section with animated stats and call-to-action buttons.
- A right sidebar with upcoming events, suggested people, and a sponsored card.
- A complete event creation page with structured sections and validation.
- Draft autosave for event creation with last-saved time and reset support.
- Success and error toast notifications for form submissions.
- A sticky submit bar that shows missing required fields and submit state.
- A light/dark theme toggle on the event creation page.
- An admin verification modal that opens only from the Add event button.
- Admin verification against the `admin_users` table by email and password.
- An Add Note modal available to everyone, backed by the `notes` table.

## Current data sources

The app currently uses these Supabase tables:

```sql
admin_users
  id, username, email, password_hash, is_active

events
  id, category, title, description, venue, date_range,
  timings, fee, certificate, technologies,
  host, industry_expert, coordinator, contact_phone,
  registration_url, seat_note, theme, likes

notes
  id, title, subject, description,
  file_url, file_type, event_id, is_active, created_at
```

Example admin row:

```sql
INSERT INTO admin_users (username, email, password_hash)
VALUES ('admin', 'admin@kitsw.ac.in', 'example1@password');
```

## Notes status

The Notes tab now loads live data from the `notes` table where `is_active = true`,
ordered by `created_at DESC`.

Each note card shows the title, subject, description, file type pill, and a direct download button.
Students can add notes without logging in.

Admin users can hide spam or bad submissions by setting `is_active = false`.

## Admin access flow

1. Click **Add event** on the home page.
2. Enter the admin email and password.
3. The app fetches the matching row from `admin_users`.
4. The entered password is compared with the stored value.
5. If the credentials match and the account is active, the event form opens.

The same admin state also enables note hiding controls in the Notes tab.

## Event creation flow

1. Fill the structured event form.
2. Required fields are validated before submit.
3. Draft data is autosaved locally while you type.
4. Submitting stores the event through Supabase.
5. Toast messages confirm success or show validation/save errors.

## Setup

1. Install dependencies with `npm install`.
2. Set these environment variables in `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Start the app with `npm run dev`.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build

## Tech stack

- React + Vite
- Tailwind CSS
- Framer Motion
- Supabase
