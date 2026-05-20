# Figma AI Prompt — Recreate "SJS Form Builder" UI

Use this document as the prompt you paste into Figma's AI (Figma Make / First Draft / AI design assistant) to recreate the **SJS Form Builder** application UI in Figma.

> ⚠️ **IMPORTANT — Component library:** Design this UI using **Material UI (MUI v9) component visual styles**. **Do NOT use Tailwind, do NOT use shadcn, do NOT use Chakra, do NOT use Bootstrap.** All buttons, chips, text fields, dialogs, paper/cards, drawers, tooltips, alerts, snackbars, and typography must visually match MUI's default Material Design 3 look-and-feel. If Figma's AI offers a Tailwind-styled output, reject it and ask for MUI styling.

---

## 1. High-level brief (paste this into Figma AI as a single prompt)

```
Design a desktop web application called "SJS Form Builder".

Component library and styling: Material UI (MUI v9) — Material Design 3.
DO NOT USE TAILWIND. DO NOT USE shadcn/ui. DO NOT USE Chakra.
All visual primitives (Button, Chip, TextField, Paper, Drawer, Dialog,
Tooltip, Alert, Snackbar, IconButton, Typography) must look like
default MUI components. Use MUI icons (Material Icons - Outlined set).

Theme:
- Mode: light
- Primary color: #5b3df5 (purple)
- Secondary color: #19a974 (green)
- Background default: #f6f7fb
- Surface / paper: #ffffff
- Border radius: 10px on Paper/Cards/Buttons
- Font: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
- H6 / titles: font-weight 600
- Typography scale: MUI default

Layout shell (every page uses this):
- Full viewport height (100vh)
- Left: permanent vertical "nav rail" Drawer, 84px wide, white background,
  1px right divider in MUI "divider" color.
  Contents top-to-bottom:
    * 36x36 rounded-square logo tile (radius 8px), filled with primary
      color #5b3df5, white bold text "SJS" centered, 16px.
    * Tiny caption below: "Builder" (10px, text.secondary)
    * 1px bottom divider
    * Vertical list of 4 rail items, each item is a NavLink button:
        1. "Forms" — icon: DescriptionOutlined
        2. "New" — icon: AddCircleOutline
        3. "Screens" — icon: ViewKanbanOutlined
        4. "About" — icon: InfoOutlined
      Each rail item is a vertical stack: 40x32 rounded icon tile on
      top, 11px caption label below. Active state: left border 3px
      solid primary, icon tile filled primary with white icon, label
      colored primary, item background = action.selected (very light
      purple tint). Inactive: text.secondary, transparent tile.
      Hover: action.hover background.
- Right: main content area, flex grow, scrolls internally,
  background = background.default (#f6f7fb).
```

---

## 2. Screens to design

Generate one Figma frame per screen. All frames should be **1440 × 900** desktop frames with the left nav rail included.

### 2.1 Forms list — `/forms` (default landing screen)

```
Page header row (padding 32px):
- Left: H5 "Forms" (weight 600). Subtitle body2 in text.secondary:
  "Define and edit forms with the SurveyJS visual builder."
- Right: MUI Button variant="contained" color="primary" with leading
  AddIcon, label "New form".

Below header, a vertical Stack (gap 20px) containing:

A) Filter bar — MUI Paper variant="outlined", radius 8px, padding 16px.
   Row layout, space-between:
   - Left: MUI TextField size="small" label="Search forms"
     placeholder="Search by form name", min width 320px.
   - Right: 3 MUI Chips in a row (gap 8px):
        * "All"   — primary filled when active, otherwise outlined default
        * "Draft" — warning filled when active, otherwise outlined default
        * "Live"  — success filled when active, otherwise outlined default

B) Card grid — flex-wrap, gap 16px. Each card is MUI Paper
   variant="outlined", radius 8px, padding 16px, min-height 180px,
   flex-basis 320px. Card content top-to-bottom:
   - Header row (space-between):
       * Left column:
           - subtitle1 form name, weight 600, truncates with ellipsis.
           - If version > 1: caption "Version 2" in text.secondary.
       * Right: status Chip
           - "Live"  -> color="success", size="small", filled
           - "Draft" -> color="warning", size="small", variant="outlined"
   - Stack of two body2 lines in text.secondary:
       * "Questions: 12"
       * "Updated: May 18, 2026, 3:24 PM"
   - Footer row (space-between), margin-top 12px:
       * Left: row of small MUI IconButtons inside Tooltips.
           DRAFT cards show: Edit, Rename, Delete (icons: Edit,
           DriveFileRenameOutline, DeleteOutline).
           LIVE cards show: Preview (icon: Visibility).
       * Right: MUI Button size="small"
           - DRAFT: variant="contained" with PublishIcon, label "Publish"
           - LIVE:  variant="outlined" with AddCircleOutline,
             label "New version"

Render at least 6 example cards mixing Draft and Live states with
realistic names like "Customer onboarding", "Employee survey",
"Site inspection", "Order intake", "Bug report", "Health screening".

Empty state (separate variant of this screen):
  Centered MUI Paper variant="outlined", padding 48px, text-align center:
    H6 "No forms yet"
    body2 text.secondary "Create your first form to start building with SurveyJS."
    MUI Button variant="contained" with AddIcon "Create a form".

Filtered-but-empty state (separate variant):
  Centered MUI Paper variant="outlined", padding 40px, text-align center:
    H6 "No matching forms"
    body2 text.secondary "Try a different name or filter."
    MUI Button variant="text" label "Clear filters".

Dialogs (overlay variants):
  "New form" — MUI Dialog maxWidth="xs" fullWidth.
    DialogTitle: "New form"
    DialogContent: MUI TextField autoFocus, label "Form name", fullWidth, dense margin.
    DialogActions: Button "Cancel" (text), Button variant="contained" "Create & edit".

  "Rename form" — same structure, title "Rename form", primary action "Save".
```

### 2.2 Screens list — `/screens`

```
Page header (padding 32px):
- Left: H5 "Screens" weight 600. Subtitle body2 text.secondary:
  "Build screens by composing forms as single blocks or one-to-many grids."
- Right: Button variant="contained" with AddIcon "New screen".

Below header, a stack (gap 20px):

A) Screen tile grid — flex-wrap, gap 16px. Each tile = MUI Paper
   variant="outlined", radius 8px, padding 16px, min-width 260px,
   flex-basis 260px, cursor pointer. Active tile: border-color primary.main
   and bgcolor action.selected. Contents:
     subtitle1 (weight 600): screen name
     body2 text.secondary "Sections: 3"
     body2 text.secondary "Assigned forms: 5"
     caption text.disabled "Updated: May 18, 2026, 3:24 PM"

B) Active screen editor panel — MUI Paper variant="outlined",
   radius 8px, padding 20px. Inside:
   - Top row space-between:
       * Left: H6 screen name weight 600, body2 text.secondary
         "Configure sections as single (one form) or grid (many forms)."
       * Right row: Button size="small" variant="outlined" with
         VisibilityIcon "Preview"; IconButton (Rename, icon
         DriveFileRenameOutline) inside Tooltip; IconButton (Delete,
         DeleteOutline) inside Tooltip.
   - MUI Divider.
   - "Add section" row: TextField size="small" label "Section name"
     flex-1, then two Chips clickable: "Single" with ListAltOutlined
     icon, "Grid" with ViewModuleOutlined icon (active = primary filled,
     inactive = outlined default), then Button variant="contained"
     "Add section".
   - Sections list (vertical stack, gap 16px). Each section = MUI Paper
     variant="outlined" padding 16px:
       * Top row: TextField size="small" label "Section name" flex-1,
         then small Chips "Single"/"Grid" with the same icons (active
         primary filled), then IconButton "Remove section"
         (DeleteOutline) in Tooltip.
       * caption text.secondary: "Single form: Pick one form" OR
         "Grid: Pick one or many forms".
       * A wrapping flex row of clickable Chips, one per available
         form. Selected = color="primary" filled, unselected =
         variant="outlined" default.

Empty state variant: centered Paper outlined padding 48px with H6
"No screens yet", body2 "Create a screen and assign forms as single
or grid sections.", Button contained "Create screen".

Dialogs: "New screen" and "Rename screen" — same MUI Dialog pattern
as Forms, maxWidth xs, fullWidth.
```

### 2.3 Form editor — `/editor/:id`

```
A full-bleed editor screen. Top is a sticky header bar, below it
either the SurveyJS builder canvas (draft) or a locked state (live).

Header (padding 24px horizontal, 12px vertical, white background,
1px bottom divider):
- Left cluster (row, gap 12px, center-aligned):
    * IconButton small with ArrowBack
    * Column:
        - Row gap 8px center: subtitle1 form name weight 600;
          caption text.disabled "v2" if version > 1;
          status Chip ("Live" success filled OR "Draft" warning outlined),
          size small
        - caption text.secondary:
          "SurveyJS editor — autosaves to your browser" for draft,
          OR "This form is published and read-only" for live
- Right cluster (row, gap 12px center):
    * For draft only, after first save: Chip size="small" color="success"
      variant="outlined" label "Saved 3:24:11 PM"
    * Button variant="outlined" with VisibilityIcon "Preview"
    * Draft: Button variant="contained" color="primary" with PublishIcon "Publish"
      Live:  Button variant="outlined" color="primary" with
             AddCircleOutline "New version"

Below header:
- Live variant only: MUI Alert severity="info" full width with bottom
  divider, action slot = small Button with AddCircleOutline
  "New version". Body text: 'This form is **live** and cannot be
  edited. Create a new version to make changes — it will start as a
  draft until you publish it.'

Main area (draft state): a placeholder rectangle representing the
SurveyJS Creator. Show a stylized 3-column layout to fake the
SurveyJS Creator look:
  - Left rail: Toolbox panel with mocked list of element types
    (Single-Line Input, Checkboxes, Radio Group, Dropdown, Rating, etc.)
  - Center: an empty page card with a "Drag elements here" hint and a
    couple of mocked question blocks (a text field and a radio group).
  - Right: properties panel with collapsible MUI-style sections.
  Annotate this region in Figma with: "Placeholder for SurveyJS
  Creator — third-party widget, not an MUI component. Keep as a
  bordered region."

Main area (live state): centered column, gap 16px:
  H6 "Form is live"
  body2 "Preview it or create a new draft version to continue editing."
  Row of two buttons: outlined "Preview" with VisibilityIcon,
  contained "New version" with AddCircleOutline.

Toasts: an MUI Snackbar bottom-left with message "Form saved",
shown as a separate state variant of this screen.
```

### 2.4 Form preview — `/preview/:id`

```
A simple full-page preview wrapper.

Header (same structural style as the editor header, padding 24px/12px,
1px bottom divider):
- Left: IconButton ArrowBack + subtitle1 form name + status Chip.
- Right: Button variant="outlined" with EditIcon "Edit" (only when draft).

Below header: centered content column max-width ~720px, padding 32px.
- MUI Paper variant="outlined" radius 8px padding 24px hosting the
  rendered SurveyJS form. Mock a small example survey inside it:
    H6 "Customer onboarding"
    body2 text.secondary intro line
    A few mocked question blocks (text input, radio group, rating).
    A primary Button "Complete" at the bottom right of the form card.
Annotate the Paper region in Figma: "Placeholder for SurveyJS UI
runtime — keep as a bordered region with MUI-styled controls around
it."
```

### 2.5 Screen preview — `/screens/preview/:id`

```
A screen preview that stacks the screen's sections.

Header (same pattern):
- Left: ArrowBack IconButton + subtitle1 screen name.
- Right: Button variant="outlined" with EditIcon "Edit screen".

Main area (padding 32px, scroll vertically), vertical Stack gap 24px.
For each section:
- subtitle1 section name weight 600.
- caption text.secondary "Single form" OR "Grid".
- If Single: one MUI Paper variant="outlined" radius 8px padding 24px
  hosting one mocked SurveyJS form (same placeholder pattern as
  Form preview).
- If Grid: a flex-wrap grid of multiple Paper cards
  (3 columns at 1440px), each one a smaller mocked form card with
  the form's name as H6 inside.
```

### 2.6 About — `/about`

```
Padding 32px. Max content width 720px.
- H5 "About" weight 600.
- body2 text.secondary "A front-end proof of concept for building forms with SurveyJS."
- Vertical Stack gap 16px of 3 MUI Paper variant="outlined" panels,
  padding 16px each. Each panel has a subtitle1 weight 600 title
  followed by body2 text.secondary description:
    1) "Stack" — "Vite + React + TypeScript, MUI for the shell,
       SurveyJS Creator for authoring, SurveyJS UI for rendering."
    2) "Storage" — "Form definitions are saved in your browser's
       localStorage. There is no backend — clearing site data will
       erase your forms."
    3) "How to use" — an ordered list:
         1. Create a form from the Forms page.
         2. Use the SurveyJS visual builder, JSON editor, logic and
            translation tabs to edit it. Edits autosave.
         3. Preview to fill the form as an end user would.
```

---

## 3. Component spec reminder (paste this if Figma AI drifts toward Tailwind)

```
Restyle every component using MUI v9 / Material Design 3 defaults.
Replace any Tailwind utility classes or Tailwind-looking visual styles
with MUI equivalents:
- Cards/containers => MUI Paper variant="outlined", radius 10px.
- Buttons => MUI Button (variants: contained / outlined / text).
  Use MUI elevation and ripple-ready styling, not flat Tailwind buttons.
- Text inputs => MUI TextField (outlined, size small where shown).
- Tags/pills => MUI Chip (filled vs outlined, with MUI palette colors:
  primary, success, warning, default).
- Side nav => MUI Drawer variant="permanent".
- Icons => @mui/icons-material (Outlined set where specified).
- Modals => MUI Dialog with DialogTitle / DialogContent / DialogActions.
- Banners => MUI Alert (severity info/success/warning).
- Toasts => MUI Snackbar.
- Typography => MUI Typography variants (h5, h6, subtitle1, body2,
  caption). Do not use Tailwind text-* classes.
Color tokens come from the MUI palette declared in section 1 (primary
#5b3df5, secondary #19a974, etc.). Do not introduce any other palette.
```

---

## 4. Deliverables checklist for the Figma AI

- [ ] One Figma page named **SJS Form Builder**.
- [ ] One desktop frame (1440 × 900) per screen above (Forms list, Screens list, Form editor draft, Form editor live, Form preview, Screen preview, About).
- [ ] State variants where called out (empty Forms, filtered-empty Forms, empty Screens, Snackbar visible, New form dialog open, Rename dialog open).
- [ ] Reusable Figma **components** for: NavRail item, Form card, Screen tile, Section card, Status chip, Filter chip, App header bar.
- [ ] Local Figma **color styles** matching the palette in section 1.
- [ ] Local Figma **text styles** matching the MUI typography scale.
- [ ] No Tailwind utility names or shadcn/Chakra components anywhere in the file.
