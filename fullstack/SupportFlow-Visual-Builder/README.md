# SupportFlow Visual Builder

A visual decision-tree editor for building and testing automated Help Bot conversation flows, built for SupportFlow AI to replace their error-prone spreadsheet-based configuration process.

Non-technical managers can see their bot's conversation logic as a flowchart, edit questions in real time, and test-drive the bot instantly.

## Features

### Visual Flow Canvas
- Renders conversation nodes as draggable cards, positioned absolutely from JSON coordinates.
- Parent → child relationships are drawn as SVG connector lines, computed manually from node coordinates and measured DOM dimensions (no charting/graph library used).
- A dot-grid canvas background gives the workspace a native "design tool" feel.

### Real-Time Editing
- Clicking a node (as opposed to dragging it) opens an edit modal.
- Changes are held in local component state and applied to the canvas immediately on save, no backend or persistence layer required.

### Preview / Test-Drive Mode
- A chat-style interface that lets you walk through the bot's logic exactly as a real customer would.
- Each answer selection appends to a running chat log and advances to the next node.
- Reaching an `end` node surfaces a **Restart** action to run through the flow again.

### Search
- A search bar lets you filter the canvas by node text.
- Non-matching nodes are dimmed to 50% opacity rather than removed, so the overall shape of the flow stays visible.
- Connectors are hidden entirely when either endpoint doesn't match the current search, since a connector isn't meaningful once one of the two nodes it joins is no longer relevant.

**Why this feature:** as a bot's flow grows to dozens or hundreds of nodes, visually scanning the whole canvas to find a specific question becomes impractical, exactly the kind of friction this tool exists to remove.

### Motion
- Nodes animate in with a subtle scale/fade using Framer Motion, rather than appearing abruptly.
- Search-driven opacity changes transition smoothly instead of snapping instantly.

---

## Tech Stack


| Framework | React + TypeScript (Vite) |
| Styling | Tailwind CSS v4 (custom `@theme` tokens, no component libraries) |
| Animation | Framer Motion |
| Canvas / Connectors | Custom SVG + DOM coordinate math |
| Package manager | pnpm |

---

## Design System

Design file: [Figma design](https://www.figma.com/design/OqX5NNPFFd842pOxH0fb8J/SupportFlow-Visual-Builder-This-challenge-is-designed-to-test-your-ability-to-bridge-Computer-Scienc?node-id=4-4&t=g45nS8779KAvkxNu-1)

---

## Project Structure

```
src/
 ├─ components/
 │   ├─ Canvas/
 │   │   ├─ Canvas.tsx        # Owns node state, positions, dimensions, search, modal state
 │   │   ├─ Node.tsx          # Presentational node card
 │   │   ├─ Connector.tsx     # SVG line between two nodes
 │   │   └─ EditModal.tsx     # Click-to-edit node modal
 │   ├─ Header.tsx
 │   └─ Footer.tsx
 ├─ pages/
 │   ├─ EditorView.tsx        # Flowchart / editing view
 │   └─ PreviewMode.tsx       # Chat-style "test drive" runner
 ├─ types/
 │   └─ Node/NodeTypes.ts     # FlowNode, NodeOption, Dimensions, etc.
 ├─ data/
 │   └─ flow_data.json        # Source conversation data
 └─ App.tsx
```

---

## Getting Started

```bash
# install dependencies
pnpm install

# start the dev server
pnpm dev

# type-check
pnpm tsc --noEmit

# production build
pnpm build
```

