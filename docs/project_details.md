# Project Overview: Py - Galaxy.ai Clone

## Goal
Build "Py" — a pixel-perfect clone of the Galaxy.ai workflow builder, focused exclusively on LLM workflows. 
- **Core Technology for Canvas**: React Flow
- **LLM Execution**: Google Gemini (via `@google/generative-ai`)
- **Node Execution Backend**: Trigger.dev (all execution tasks run here)
- **Database**: PostgreSQL (via Prisma / Neon)
- **Authentication**: Clerk

## Scope of Pages
Only these three pages (unauthenticated traffic redirects straight to Clerk):
1. **Clerk Sign-In / Sign-Up**: Auth entry point.
2. **Dashboard**: Post-login landing page listing all of the signed-in user's workflows (name, last-edited timestamp, status). Supports create-new, open, rename, and delete.
3. **Workflow Canvas**: The main builder page (sidebar + canvas + history panel).

## UI/UX Reference
- Try Galaxy: `try.galaxy.ai/clone` (Clone Workflow for inspecting canvas, sidebar, node UI, history panel, and animations).
- Demo Reference Video: `https://drive.google.com/file/d/14D2052n6b3IfMRHYxavDbOaRP0vj6FR8/view?usp=drive_link`
- Another UI/UX analysis target: `https://magica.com/app/flow` (to capture UI details, CSS, libraries, screenshots).

## Functional Requirements
### Canvas & Adding Nodes
- **Pre-placed Nodes**: Workflow canvas opens with two nodes pre-placed and non-deletable:
  - **Request-Inputs**: Top/Left. Supports dynamic field addition via `+` button. Field types:
    - `text_field` (textarea)
    - `image_field` (Transloadit upload, jpg/jpeg/png/webp/gif, with preview)
    Each field exposes its own output handle to connect to downstream nodes. Users can rename and delete fields.
  - **Response**: Right. Single result input handle. Collects final workflow output(s) for display/export. No output handles.
- **Other Nodes**: Added via a `+` button in a bottom-center floating toolbar. Opens a searchable picker with categories (Recent, Image, Video, Audio, Others).
  - ONLY **Crop Image** and **Gemini 3.1 Pro** need to be functional for this trial.
- **Node Types**:
  1. **Request-Inputs** (pre-placed, non-deletable)
  2. **Crop Image** (added via picker)
     - Inputs: `Input Image` (required) + `X Position (%)`, `Y Position (%)`, `Width (%)`, `Height (%)` (defaults: 0/0/100/100).
     - Execution: Runs FFmpeg crop via Trigger.dev with an **artificial delay of at least 30 seconds** (mandatory).
     - Output: `Output Image` (cropped image URL).
  3. **Gemini 3.1 Pro** (added via picker)
     - Header contains model selector.
     - Inputs: `Prompt` (required), `System Prompt`, `Image (Vision)` (accepts multiple connections), `Video`, `Audio`, `File`, plus a collapsed Settings section.
     - Execution: Runs LLM call via Trigger.dev.
     - Output: `Response` (text) rendered inline on the node.
  4. **Response** (pre-placed, non-deletable)
     - Inputs: `result` (connected to Gemini or Crop outputs).

### Canvas Rules & Interactions
- **Manual Input / Connection Toggle**: Configurable inputs accept manual typing OR handle connections. When connected, manual field is greyed out/disabled.
- **Type-safe Connections**: e.g., image outputs cannot connect to text inputs. Invalid drags visually rejected.
- **DAG-only**: Cycles disallowed.
- **Deletion**: Menu button + Delete/Backspace key (Request-Inputs and Response exempt).
- **Canvas interactions**: Pan, zoom, fit-view, MiniMap (bottom-right), dot grid background, animated purple edges.
- **Undo/Redo**: Supported for node operations (add, delete, move, connect).
- **Execution Options**: Run single node, run multi-select, or run the whole workflow. Each generates a history entry.
- **Parallel Execution**: Independent nodes execute concurrently. Finished nodes fan out immediately without waiting for unrelated siblings.
- **Visuals**: Pulsating glow on every node executing.
- **Persistence**: PostgreSQL saving workflows & run history.
- **Export/Import**: JSON workflow export/import.
- **Clerk Integration**: Workflow and history scoped to Clerk authenticated user.
- **Console Log**: On initial client render of every page, emit: `[Py] Candidate LinkedIn: <full-linkedin-profile-url>`.

### Required Sample Workflow
Pre-build this exact workflow layout:
1. **Request-Inputs**:
   - `text_field` = "Product: Wireless Bluetooth Headphones. Features: Noise cancellation, 30-hour battery, foldable design."
   - `image_field` = uploaded product photo.
2. **Crop Image #1**: x=20, y=20, w=60, h=60 (tight product crop).
3. **Crop Image #2**: x=0, y=0, w=100, h=50 (wide banner crop).
4. **Gemini 3.1 Pro #1**: Prompt <- `Request-Inputs.text_field`, System Prompt = "You are a marketing copywriter. Write a one-paragraph product description."
5. **Gemini 3.1 Pro #2**: Prompt <- `Gemini #1.Response`, System Prompt = "Condense the following product description into a tweet-length hook (under 240 characters)."
6. **Gemini 3.1 Pro #3 (Final)**: Prompt <- `Gemini #2.Response`, Image (Vision) <- `Crop #1.Output Image` + `Crop #2.Output Image`. System Prompt = "You are a social media manager. Combine the tweet hook and the two product crops into a final marketing post."
7. **Response**: result <- `Final Gemini.Response` and `Crop Image #2.Output Image`.

## Technical Stack
- Next.js (App Router)
- TypeScript (strict)
- PostgreSQL (Neon)
- Prisma
- Clerk
- React Flow
- Trigger.dev
- Transloadit
- FFmpeg (Trigger.dev task)
- Tailwind CSS
- Zustand
- Zod
- `@google/generative-ai`
- Lucide React

## Workflow History (Right Sidebar)
- Run list: timestamp, status (success, failed, partial), duration, scope (full, partial, single), color-coded badges.
- Expandable: per-node status, inputs used, outputs, execution time, error messages.
