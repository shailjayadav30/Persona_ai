# Security Hardening Checklist — Persona AI

Generated from a full-project security audit (2026-07-07). Ordered by priority.

## 🔴 Critical — do first

- [ ] **Rotate all secrets in `.env`**: Neon Postgres password, `GEMINI_API_KEY`, `NEXT_AUTH_SECRET`.	
  These were printed to a terminal/transcript during an audit session and must be treated as compromised even though `.env` itself is gitignored and was never committed.
- [X] **Stop leaking the password hash from signup.**
  `app/api/auth/signup/route.ts` currently does:

  ```ts
  const user = await prisma.user.create({ data: { email, password: hashedPass, name } });
  return NextResponse.json(user, { status: 201 }); // leaks bcrypt hash to client
  ```

  Fix: use Prisma `select` to return only `{ id, email, name }`, never `password`.

## 🟠 High priority

- [X] **Add rate limiting** to:
  - `POST /api/auth/signup` (prevent mass account creation)
  - `POST /api/auth/[...nextauth]` credentials login (prevent brute-force/credential stuffing)
  - `POST /api/chat` (prevent cost-abuse of paid Gemini API)
    Use something like `@upstash/ratelimit` (if Redis available) or a simple in-memory/IP+user token bucket if single-instance.
- [X] **Fix user-enumeration in `lib/auth.ts`.** "Invalid email or password" vs "Invalid password" are distinguishable — use one identical generic error message/response for both the "no user" and "wrong password" branches.
- [ ] **Add `middleware.ts`** to centrally enforce auth on protected pages/APIs (e.g. via `next-auth/middleware`'s `withAuth`), instead of relying on each route handler to remember `getServerSession`. Fail closed by default for new routes.
- [ ] **Add real input validation to signup.** Currently just a truthy check. Add a Zod schema (mirroring `lib/validations/message.ts`) enforcing: valid email format, minimum password length/strength, max lengths on email/name/password.
- [ ] **Handle duplicate-email signup properly** — catch Prisma `P2002` and return `409 Conflict` with a clear message instead of falling through to a generic `500`.

## 🟡 Medium priority

- [ ] **Build a real moderation/guardrail layer**, not just prompt instructions.
  - `lib/llm/moderation.ts` currently has no logic, just an error class.
  - Add an independent server-side check (e.g. regex/keyword filter, or a second LLM-as-judge call) for prompt-injection attempts and system-prompt leakage — don't rely solely on the model following the guardrails prompt.
  - Consider widening Gemini `safetySettings` categories beyond harassment/hate/sexual/dangerous if relevant (e.g. civic integrity).
- [ ] **Remove/gate sensitive console logging.** Strip or wrap behind a debug flag:
  - `lib/auth.ts` — logs full JWT/session objects on every request.
  - `app/api/chat/route.ts` — logs full session + message content.
  - `app/api/auth/signup/route.ts` — stray debug logs.
- [ ] **Fix env var naming**: rename `NEXT_AUTH_SECRET` → `NEXTAUTH_SECRET` (NextAuth's documented convention) and set `NEXTAUTH_URL` explicitly for production/proxied deployments.
- [ ] **Add security headers** in `next.config.ts` (`headers()` function): CSP, `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`.
- [ ] **Fix `app/layout.tsx`** — remove unnecessary `"use client"` on the root layout so SSR and the `metadata` export work again.
- [ ] Be explicit about CORS if the API will ever be called cross-origin (currently implicitly same-origin only, which is fine as-is but undocumented).

## 🟢 Low priority / cleanup

- [ ] Remove dead files: `lib/llm/prompts.ts`, `lib/llm/provider.ts`, `lib/stream.ts` (all empty), or finish wiring them up if intended for real use.
- [ ] Remove unused `jsonwebtoken` dependency (never imported anywhere).
- [ ] Wire up `app/signup/page.tsx` (currently a placeholder `<div>`) to actually call `/api/auth/signup`.
- [ ] Implement chat history retrieval — `lib/history.ts` has the query already written but fully commented out, and no endpoint exposes it; `askGemini` currently has no multi-turn memory despite messages being persisted.
- [ ] Add a `.env.example` (variable names only, no real values) for onboarding.
- [ ] Add CI checks (ESLint rule or pre-commit hook) to fail on stray `console.log` in `app/`/`lib/`.
- [ ] Run `npm audit` / enable Dependabot or Snyk to catch known-vulnerable dependency versions going forward.

## ✅ Already solid (no action needed)

- No `dangerouslySetInnerHTML`/`innerHTML`/markdown rendering — LLM output rendered as escaped React text, no current XSS surface. **Caveat**: if markdown rendering is added later, use a sanitizing renderer (`react-markdown` + `rehype-sanitize`).
- No raw SQL — all DB access goes through Prisma's query builder, no injection surface.
- Passwords bcrypt-hashed (cost factor 10) before storage, compared via `bcrypt.compare`.
- `.env` correctly gitignored; confirmed no secret ever committed to git history.
- `GEMINI_API_KEY` only read server-side, never exposed to the client bundle.
- `/api/chat` correctly checks `getServerSession` and scopes `Message` rows to `session.user.id` — no IDOR found.
- Error responses are generic (no stack traces or raw DB errors leaked to clients).
