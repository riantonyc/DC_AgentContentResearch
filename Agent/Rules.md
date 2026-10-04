Project Engineering Rules

Role: Project-wide engineering constraints for the AI-Powered Content Research & Operations Platform.

Authority: agent.md is the master product and architecture specification. This file defines the engineering rules that must be followed when implementing or modifying the project.

1. Rule Precedence

When instructions conflict, apply this order:

System and platform safety requirements

User's explicit request for the current task

agent.md — product vision, architecture, and product decisions

rules.md — project-wide engineering constraints

Relevant skill.md — task-specific implementation procedure

Existing codebase conventions

Personal implementation preference

A deliberate user request may change an existing project decision. Treat that as an intentional project decision and update affected documentation when appropriate.

When uncertainty remains, preserve the existing architecture and minimize unnecessary changes.

2. Core Engineering Principles

The implementation must optimize for:

Correctness

Simplicity

Maintainability

Reusability

Security

Observability

Testability

Clear separation of concerns

Prefer:

simpler → clearer → reusable → maintainable → extensible

Do not add complexity merely because a technology or pattern is available.

3. Preserve Product Intent

Engineering decisions must preserve the product direction defined in agent.md.

Do not turn the product into:

a generic chatbot,

an unnecessary microservice system,

an over-engineered AI framework,

a generic project-management application,

or a feature collection without a coherent creator workflow.

Technical improvements are welcome only when they strengthen the intended product.

4. Technology Baseline

The documented stack is the project baseline, not an absolute prohibition against change.

Preferred baseline:

Frontend: Next.js + TypeScript

UI: Tailwind CSS + shadcn/ui

Backend: FastAPI + Python

Agent orchestration: LangGraph when orchestration is actually required

LLM: configured project provider

Database: PostgreSQL / Supabase

Vector retrieval: pgvector when retrieval requirements justify it

Data processing: Pandas / OpenPyXL where required

Do not replace a core technology without a concrete technical reason.

Technology changes must preserve:

product capability,

architecture integrity,

maintainability,

security,

portability.

5. Repository-First Development

Before modifying code:

Inspect the repository structure.

Identify the application entry points.

Identify the current architecture.

Inspect relevant dependencies.

Inspect environment configuration without exposing secrets.

Inspect relevant database schema and migrations.

Identify existing agents, tools, services, and reusable components.

Identify existing tests.

Identify current limitations.

Determine the smallest safe change.

Do not rebuild an existing implementation from scratch without a clear reason.

6. Change Scope

Every change should have a clear reason.

Avoid:

unrelated refactoring,

mass file replacement,

duplicate implementations,

speculative abstractions,

unnecessary migrations,

dependency changes unrelated to the task.

If an API contract, database schema, shared type, or component contract changes, inspect all affected consumers before finalizing the change.

7. Separation of Concerns

Keep responsibilities separated.

Preferred boundaries:

UI components → presentation and interaction

Hooks/client logic → frontend state and interaction orchestration

API routes/controllers → transport and request handling

Services → business logic

Agents → reasoning/workflow orchestration

Tools → external capabilities

Repositories/data access → persistence

Schemas/types → contracts and validation

Avoid giant files such as:

one giant agent.py,

one giant API module,

one giant React component,

one module containing unrelated business domains.

Use modularity where it improves comprehension, not merely to increase file count.

8. Type Safety and Contracts

Frontend code must use TypeScript.

Backend APIs must define explicit request and response contracts.

Rules:

Avoid any unless technically justified.

Validate external input.

Keep API contracts explicit.

Keep shared concepts consistently named.

Do not silently change response shapes.

Update consumers when contracts intentionally change.

External data must be treated as untrusted input.

9. Error Handling

Errors must be explicit and actionable.

Every meaningful workflow should account for:

invalid input,

unavailable dependencies,

authentication/authorization failure,

external API failure,

timeout,

malformed external data,

empty results,

unexpected internal errors.

Do not expose secrets, stack traces, internal credentials, or sensitive implementation details to users.

Do not silently swallow errors.

10. Frontend Rules

Frontend implementation must:

reuse existing components,

follow the established design system,

remain responsive,

remain keyboard accessible,

provide clear loading/empty/error/success states,

avoid unnecessary visual complexity,

keep interaction patterns consistent.

Do not introduce a new UI framework when an existing project primitive can solve the problem.

Do not hardcode production data into components.

Do not expose API keys or secrets in client-side code.

11. AI and Agent Rules

Use an agent only when the task requires reasoning, workflow selection, multi-step execution, or tool orchestration.

Do not create an agent for a simple deterministic function.

The orchestrator should:

understand the request,

identify relevant context,

select the appropriate workflow/agent,

invoke only required tools,

preserve useful intermediate state,

produce a clear result,

expose actionable next steps when appropriate.

Agent state should remain structured and inspectable.

Avoid uncontrolled agent loops and unnecessary tool calls.

12. Research Grounding

Research output must preserve source attribution.

Rules:

Never fabricate sources.

Never fabricate citations.

Distinguish retrieved facts from AI interpretation.

Preserve source identity and relevant metadata.

Prefer primary or authoritative sources when appropriate.

Do not claim that a source supports a statement when it does not.

If evidence is insufficient, say so.

Research data and long-term knowledge are different concepts and must not be conflated.

13. Memory and Context

Memory is user-controlled product data.

Rules:

Store only information that is useful for future interactions.

Do not treat every conversation message as permanent memory.

Respect workspace/project boundaries.

Avoid cross-user or cross-workspace leakage.

Prefer relevant memory over indiscriminate retrieval.

Never allow stale memory to override the current user request.

Maintain the distinction between:

conversation context,

project context,

reusable memory,

research,

stored knowledge.

14. Data and Persistence

Database changes must be intentional.

Before changing persistence:

inspect the existing schema,

understand relationships,

assess backward compatibility,

determine whether a migration is required,

update affected application logic,

verify access control.

User-scoped data must remain isolated.

Do not store sensitive information unless there is a justified product requirement and an appropriate security model.

15. Security

Never:

hardcode API keys,

commit secrets,

expose credentials to the browser,

trust unvalidated external input,

bypass authentication/authorization,

access another user's private data,

execute arbitrary user-provided code without an explicit secure sandbox design.

Use environment variables or the project's secret-management mechanism.

Log operational information, not secrets.

16. Human-in-the-Loop

The AI may automate low-risk, reversible, informational actions.

The AI must request user confirmation before actions that are:

destructive,

irreversible,

external-facing,

financially consequential,

privacy-sensitive,

security-sensitive,

capable of materially changing user data or settings.

Examples requiring confirmation:

deleting content,

deleting memory,

publishing content,

sending external communication,

changing important settings,

irreversible data operations.

Principle:

AI assists the creator in taking action; AI does not take control away from the creator.

17. Testing Rules

Tests should protect against meaningful regressions.

Prioritize testing for:

core business logic,

agent decision logic,

tool execution,

data transformation,

authentication and authorization,

memory retrieval/storage,

research processing,

analytics calculations,

API contracts,

critical user workflows.

For UI, test behavior and user interaction rather than implementation details.

Do not create tests only to increase coverage numbers.

Critical logic should not be considered complete when it is entirely untested.

18. Dependency Rules

Before adding a dependency, verify:

the project does not already provide equivalent functionality,

the dependency solves a real requirement,

its maintenance status is acceptable,

its security/licensing implications are acceptable,

the added complexity is justified.

Do not add infrastructure simply to make the architecture look more advanced.

Avoid adding Redis, Kafka, Kubernetes, Qdrant, n8n, GPU infrastructure, or additional microservices unless a concrete requirement justifies them.

19. MVP Discipline

The MVP should remain easy to:

Develop → Test → Debug → Deploy

Build the current phase before expanding into later phases.

Do not implement future-stage infrastructure prematurely.

Prefer a complete, reliable vertical slice over many partially implemented features.

20. Git and Change Hygiene

Use clear commit categories where applicable:

feat:

fix:

refactor:

docs:

test:

chore:

Avoid committing:

secrets,

generated junk,

unused files,

temporary debugging code,

unrelated refactors.

Keep each change focused and reviewable.

21. Quality Gate

Before considering a change complete, verify:

Does it solve the requested problem?

Does it follow agent.md?

Does it follow these rules?

Does it reuse existing code where appropriate?

Are types/contracts valid?

Are loading, empty, and error cases handled?

Are security boundaries preserved?

Are important tests present?

Does it avoid unnecessary dependencies?

Does it avoid unrelated changes?

Does it preserve backward compatibility where required?

If any answer is no, resolve it or explicitly document the reason.

22. Decision Rule

When multiple valid implementations exist, choose the one that:

best preserves product intent,

introduces the least unnecessary complexity,

is easiest to understand,

reuses existing project patterns,

is easiest to test and debug,

remains extensible without premature abstraction.

Do not optimize for architectural sophistication. Optimize for useful, reliable product capability.