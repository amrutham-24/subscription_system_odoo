# ⚡ Brightloop – Subscription Management MVP & Visual AI Revenue OS
### Repository: `subscription_system_odoo`

> **An all-in-one subscription management platform combining real-time SaaS financial analytics, event-driven drag-and-drop workflow automations, and natural language AI graph synthesis.**

Built for speed, intelligent operations, and seamless revenue recovery.

---

## 🌟 Key Highlights & Demo Features

### 1. 📊 Executive Financial Overview (LaunchPlan-Style UI)
- **Real-Time Financial Metrics**: Instant computation of **Monthly Recurring Revenue (MRR)**, **Annual Run Rate (ARR)**, **Active Subscriptions**, and **Net Churn Rate** directly from relational database records.
- **12-Month MRR Growth Trajectory**: Interactive Recharts bar visualization with progressive historical bars and an emerald green current-month indicator ($15,000 MRR).
- **Active Subscriptions Feed**: Real-time customer subscription roster showing company profiles, plan tiers, and monthly values.
- **Detailed MRR Movement Cards**: `New MRR ($5,000)`, `Expansion MRR ($2,000)`, `Churned MRR ($2,500)`, and `Net New MRR ($4,500)`.

### 2. ⚡ Visual Automation Builder (React Flow Canvas)
- **Interactive Drag-and-Drop Canvas**: Powered by `@xyflow/react` with custom node components:
  - `▶ Trigger`: Event listener badge (`invoice.overdue`, `payment.failed`, `customer.created`).
  - `✨ AI Logic`: Natural language classification and prompt routing.
  - `📊 Data Node`: Structured data sync to external tools (Google Sheets, Notion).
  - `💬 Slack Alert`: Real-time notification dispatch (`#sales`, `#billing-alerts`).
  - `✉️ Email Draft`: Automated customer recovery and onboarding email sequences.
  - `✅ Log Completed`: Execution settlement and audit termination.
- **Left Toolbox**: Collapsible *Object Blocks* and *Processing Blocks* (`Analyze`, `Send`, `Update`).
- **Right AI Inspector Drawer**:
  - LLM Model Selector (`GPT-4o-mini`, `GPT-4o`, `Claude 3.5 Sonnet`, `Gemini 1.5 Pro`).
  - Prompt configuration with inline syntax guidelines.
  - **Output Preview**: Formatted JSON code preview with 1-click clipboard copy.
  - Action controls: `Test Node`, `Optimize`, and `Save as Template`.
  - **Suggested Flow**: 5-step suggested pipeline with instant `Insert to Canvas` capability.
- **Live Workflow Execution Runner**: Simulates trigger events, traverses graph paths, evaluates condition rules, and records step results in database execution logs.

### 3. 🤖 AI Workflow Synthesizer & Churn Insights
- **Natural Language Graph Generation**: Type any plain-English prompt (*"When an enterprise customer payment fails, apply a 15% discount coupon and alert sales on Slack"*), and the AI automatically synthesizes and mounts connected React Flow nodes and edges.
- **AI Churn Risk Advisor**: Scans customer engagement, payment histories, and usage recency to flag high-risk accounts and recommend automated retention campaigns.

### 4. 💳 Subscriptions, Customers & Billing Lifecycle
- **Tiered Product & Plan Catalog**: Starter ($29/mo), Growth Pro ($99/mo), Enterprise Scale ($299/mo), and Enterprise Annual ($2,990/yr).
- **Customer Directory**: Customer profiles with account health status and AI churn risk tags (`HEALTHY`, `MEDIUM`, `HIGH RISK`).
- **Invoicing & Simulated Payment Settlements**: Automated tax calculation (8%), invoice generation, and 1-click **"Simulate Payment"** transitions to `PAID`.

---

## 🏗️ Architecture & Tech Stack

```
                          ┌─────────────────────────────────────┐
                          │         BRIGHTLOOP PLATFORM         │
                          └──────────────────┬──────────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             │                               │                               │
             ▼                               ▼                               ▼
    Frontend & Layout              Automation & AI Canvas           Backend & Database
    ─────────────────              ──────────────────────           ──────────────────
    • Next.js 16 (App Router)      • React Flow (@xyflow/react)     • Prisma ORM
    • Tailwind CSS v4              • Custom Canvas Nodes            • SQLite (dev.db) / PostgreSQL
    • Recharts Data Viz            • Semantic AI Graph Generator    • Custom Session Auth (Cookies)
    • Lucide React Icons           • Workflow Execution Engine      • REST API Route Handlers
```

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16 (Turbopack, App Router, TypeScript) |
| **Database & ORM** | Prisma ORM with SQLite (`dev.db`) — 100% PostgreSQL ready |
| **Authentication** | Custom session token system with `bcryptjs` hashing & HTTP-only cookies |
| **Visual Flow Engine** | `@xyflow/react` (React Flow) with custom drag-and-drop nodes |
| **Charts & Analytics**| Recharts (Area charts, Bar charts, Responsive containers) |
| **Styling** | Tailwind CSS v4 with custom light SaaS design tokens |

---

## 👥 3-Person Team Division (8-Hour Hackathon Plan)

| Member | Focus | Key Deliverables |
| :--- | :--- | :--- |
| **Engineer 1 (Backend & Data Architect)** | Database, Auth & Core APIs | 14-model Prisma schema, session authentication, customer/subscription/invoice/metrics REST endpoints. |
| **Engineer 2 (Frontend & Analytics Lead)** | UI Architecture & Dashboard | Light SaaS aesthetic, Recharts MRR growth bar chart, Customer directory, and Billing portal. |
| **Engineer 3 (Automation & AI Specialist)** *(Your Role)* | Visual Builder & AI Engine | React Flow canvas, custom nodes, Toolbox, AI Inspector drawer, AI workflow generation, and execution runner. |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20.x or higher (tested on v23.2.0)
- **npm**: v10.x or higher

### 2. Clone & Install Dependencies
```bash
cd odoohack
npm install
```

### 3. Database Setup & Seeding
```bash
# Push schema to local SQLite database
npx prisma db push

# Seed realistic demo data (customers, subscriptions, invoices, and pre-built workflows)
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```

Open **[http://localhost:3001](http://localhost:3001)** in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@brightloop.io` | `Password123!` |

*(Or click the **"Fill Demo Credentials"** button on the `/login` screen)*

---

## 🧭 Page Routes & Navigation Map

| Route | Description |
| :--- | :--- |
| `/` | Landing page with platform overview and quick launch CTAs |
| `/dashboard` | Executive Overview with $15k MRR hero, 12-month growth chart, and active subscribers |
| `/automations` | Workflows gallery with active rules and AI Copilot recommendations |
| `/automations/[id]` | Fullscreen React Flow visual builder with Toolbox and AI Inspector |
| `/customers` | Customer directory with active plans and AI churn risk assessment |
| `/subscriptions` | Pricing tiers and active subscription lifecycle management |
| `/billing` | Invoice tracking with 1-click simulated payment settlement |
| `/login` & `/register` | Custom session authentication screens |

---

## 🎙️ 3-Minute Hackathon Presentation Script

1. **The Executive Pitch (0:00 – 0:45)**:
   - Start on `/dashboard`.
   - Point out the **$15,000 MRR** headline, the progressive 12-month growth bar chart, and active enterprise accounts.
   - Explain how Brightloop replaces multiple disconnected tools (Stripe + ChartMogul + Zapier) in one unified interface.
2. **Subscription Operations & Billing (0:45 – 1:30)**:
   - Navigate to `/billing`.
   - Show an overdue invoice ($322.92). Click **"Simulate Payment"** to demonstrate instant transaction settlement and status transition to `PAID`.
3. **The Showstopper: Visual Flow Builder (1:30 – 2:30)**:
   - Open `/automations/cmvvxziha001bn55kgal2gzb2`.
   - Show the interactive React Flow canvas: Green Trigger, Purple AI Logic, Blue Data, Orange Slack Alert, and Green Email draft.
   - Highlight the **Right AI Inspector Drawer**: adjust the prompt, inspect the JSON output preview, or test the node.
   - Click **"Generate with Assist"**: type a plain English prompt and watch the AI synthesize a connected graph on the fly.
4. **Live Execution & Conclusion (2:30 – 3:00)**:
   - Click **"Test Flow"** to execute the pipeline and demonstrate the live execution engine.
   - Conclude with the business value: automated revenue recovery and zero churn leakage.

---

## 🗄️ Database Schema Summary (14 Models)

All business entities are isolated by multi-tenant `organizationId`:

- `User`: User profile and credentials.
- `Organization`: Multi-tenant business workspace.
- `Membership`: User role in organization (`ADMIN`, `STAFF`, `CUSTOMER`).
- `Session`: Database-backed session tokens.
- `Customer`: Customer records with churn risk scoring (`LOW`, `MEDIUM`, `HIGH`).
- `Product`: Products and service definitions.
- `Plan`: Pricing plans with billing intervals (`MONTHLY`, `YEARLY`) and features.
- `Subscription`: Active contracts linking customers to plans with renewal dates.
- `Invoice`: Billing receipts with subtotals, tax (8%), discounts, and statuses (`DRAFT`, `OPEN`, `PAID`, `PAST_DUE`).
- `Payment`: Financial transaction records with payment methods.
- `Workflow`: Revenue automation definitions with trigger events.
- `WorkflowVersion`: Versioned JSON serialization of React Flow nodes and edges.
- `WorkflowExecution`: Execution history and run status (`RUNNING`, `SUCCESS`, `FAILED`).
- `WorkflowExecutionNode`: Step-by-step traversal results with input/output payloads.
- `AuditLog`: Security and administrative activity tracking.

---

## 📄 License
MIT License. Built for the Hackathon by the Brightloop Team.
