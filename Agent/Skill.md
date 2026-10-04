Frontend Component Generator

1. Purpose

This skill is the implementation procedure for frontend work.

It translates the product and architecture defined in agent.md into concrete Next.js/React UI without duplicating the product specification.

Use this skill when the user requests:

a new component,

a page,

a dashboard section,

an AI workspace UI,

a research interface,

a creative intelligence interface,

an operations interface,

an analytics/reporting interface,

a frontend workflow,

or a meaningful frontend modification.

2. Authority

Before implementation:

Read the relevant parts of agent.md.

Follow rules.md.

Apply this skill for frontend-specific procedure.

Inspect the existing repository before creating anything.

If instructions conflict, use the precedence defined in rules.md.

Do not invent a new product direction inside a component task.

3. Required Pre-Implementation Inspection

Inspect:

project structure,

Next.js version and routing model,

existing layouts,

existing design system,

shadcn/ui components,

shared components,

hooks,

state-management patterns,

API/client utilities,

authentication flow,

existing types,

existing tests,

relevant backend contracts.

Identify reusable components before creating new ones.

Do not recreate an existing button, modal, card, table, form, command bar, or layout pattern unless the existing implementation cannot satisfy the requirement.

4. Define the UI Contract

Before coding, determine:

Inputs

What does the component receive?

Examples:

props,

project context,

research data,

agent state,

API response,

user input.

Outputs

What does the component produce?

Examples:

user action,

callback,

navigation,

API request,

saved content.

States

At minimum, consider:

default,

loading,

empty,

error,

success,

disabled,

focus,

active.

For AI workflows also consider:

queued,

processing,

tool execution,

partial result,

completed,

retry.

5. Component Architecture

Prefer small, focused components.

Example structure:

components/
├── research/
│   ├── research-panel.tsx
│   ├── research-source-card.tsx
│   ├── research-summary.tsx
│   └── research-filters.tsx

Guidelines:

Keep presentation logic local.

Extract repeated patterns.

Extract complex stateful logic into hooks when appropriate.

Avoid giant conditional render trees.

Avoid abstraction until there is a real reuse boundary.

Prefer composition over deeply configurable components.

6. Design System Procedure

Before styling:

Find an existing equivalent component.

Reuse existing tokens and primitives.

Follow established spacing and typography.

Follow established borders, radius, and interaction patterns.

Confirm responsive behavior.

Confirm accessibility.

Avoid arbitrary:

colors,

gradients,

shadows,

animation,

spacing values,

typography styles.

The interface should remain:

clear,

professional,

readable,

information-dense without feeling crowded,

low-noise,

consistent.

7. AI Workspace UI

AI is a core interaction layer, not merely a text box.

When appropriate, expose:

current task,

relevant context,

processing state,

tool activity,

result,

sources,

next actions.

Agent activity should be understandable without exposing unnecessary internal reasoning.

Good:

Understanding request      ✓
Retrieving relevant data  ✓
Searching sources         ✓
Analyzing results         ●
Preparing response        ○

Avoid exposing chain-of-thought or private reasoning.

Do not use excessive animation.

8. Research UI

Research interfaces should support, where relevant:

research query,

search/research status,

source list,

source metadata,

key findings,

summary,

insights,

related topics,

saved research,

research history.

Source-grounded content must retain attribution.

A research result should make it clear which content is sourced and which content is AI interpretation.

Useful actions may include:

Save research

Create ideas

Create brief

Continue research

Only display actions relevant to the current result.

9. Creative Intelligence UI

Support the progression:

Research
   ↓
Insight
   ↓
Idea
   ↓
Angle
   ↓
Brief
   ↓
Script

UI should make transitions between stages obvious.

When presenting ideas, consider:

title,

angle,

hook,

rationale,

target audience,

format,

status,

source/research context.

Do not overload each card with every possible action.

10. Operations UI

Operations interfaces may include:

tasks,

deadlines,

content pipeline,

calendar,

production status,

project context.

Use clear status and priority semantics.

Avoid turning every operational screen into a dashboard full of unrelated metrics.

11. Analytics and Reports UI

Prioritize interpretation over decoration.

Use:

clear metric labels,

meaningful comparisons,

readable tables,

appropriate charts,

explicit units,

empty/insufficient-data states,

concise insights.

Do not imply statistical certainty when the available data is insufficient.

If a metric cannot be calculated reliably, communicate that limitation.

12. Memory and Knowledge UI

When memory is exposed in the UI:

distinguish memory from conversation history,

distinguish project context from reusable memory,

show appropriate provenance/context,

provide user control where the product supports it,

avoid implying that every message is permanently stored.

Memory-related destructive actions must follow the human-in-the-loop rules.

13. Data Integration

Do not hardcode production data.

Use the existing project data-access/API pattern.

For asynchronous data:

show an intentional loading state,

handle empty results,

handle errors,

render successful data,

support retry where useful.

Do not duplicate API clients or create an ad-hoc fetch pattern when the project already has one.

14. Forms and User Input

Forms must:

validate input,

provide useful labels,

show validation errors near the relevant field,

preserve user input when safe,

prevent accidental duplicate submission,

provide disabled/loading states,

support keyboard interaction.

For AI prompts:

preserve the user's text during transient failures where possible,

clearly indicate submission state,

avoid losing unsent input.

15. Responsive Behavior

Design from the content and interaction requirements, not from a fixed screenshot.

Verify:

desktop,

tablet,

mobile.

Use responsive layout primitives rather than separate duplicated components.

Tables, cards, navigation, dialogs, command bars, and AI outputs must remain usable on smaller screens.

16. Accessibility

Use:

semantic HTML,

accessible labels,

keyboard navigation,

visible focus states,

appropriate ARIA only when needed,

sufficient contrast,

non-color-only status indicators.

Do not make icons the only way to understand an action.

17. Error and Empty States

Every data-driven feature must have intentional empty and error states.

Good empty state:

No research yet

Start by asking the AI to research a topic.

[Start Research]

Good error state should explain:

what failed,

whether the user's work is preserved,

what they can do next.

Avoid generic:

Something went wrong.

when a more useful explanation is possible.

18. Performance

Avoid unnecessary:

client components,

re-renders,

network requests,

large dependencies,

expensive calculations during render.

Prefer server-side capabilities when compatible with the existing architecture.

Do not prematurely optimize.

Optimize when there is an actual performance problem or a clearly predictable bottleneck.

19. Implementation Sequence

Use this sequence:

Step 1 — Inspect

Understand the existing frontend.

Step 2 — Map

Identify reusable components, contracts, and affected screens.

Step 3 — Define

Define component boundaries, data types, states, and interactions.

Step 4 — Implement

Build the smallest complete version.

Step 5 — Integrate

Connect it to existing APIs/state/navigation.

Step 6 — Validate

Check responsive behavior, accessibility, error states, and type safety.

Step 7 — Test

Add meaningful tests for important behavior.

Step 8 — Review

Remove duplication, unnecessary abstractions, and unrelated changes.

20. Output Requirements

When delivering an implementation:

State what was changed.

Identify affected files.

Mention important API/type assumptions.

Mention states handled.

Mention tests or validation performed.

Call out any limitation or follow-up that is genuinely required.

Do not provide unrelated refactoring recommendations unless they materially affect the requested implementation.

21. Definition of Done

A frontend task is complete when:

the requested behavior works,

existing patterns are reused,

TypeScript is valid,

API/data contracts are respected,

loading/empty/error states are handled,

responsive behavior is addressed,

accessibility is addressed,

important interaction behavior is tested,

no secrets are exposed,

no unnecessary dependency was introduced,

no unrelated code was changed.

Build the smallest production-quality frontend change that fits the existing product and architecture.