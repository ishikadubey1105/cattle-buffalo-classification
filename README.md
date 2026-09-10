# Cattle & Buffalo Type Classification (ATC-AI)

A web application for recording and scoring Animal Type Classification assessments of cattle and buffaloes, built around the evaluation criteria used in the Rashtriya Gokul Mission.

**Status: working prototype.** The application, data model and scoring logic are built and run locally. The computer-vision measurement extraction is scaffolded against Cloudflare Workers AI but has not been validated against ground-truth measurements — see Honest status below.

---

## The problem

Animal Type Classification scores an animal on physical conformation — body length, height at withers, chest width, rump angle and similar linear and angular measurements. Under the Rashtriya Gokul Mission this is done manually by trained field personnel, which makes it slow, inconsistent between assessors, and hard to audit.

This project asks whether the measurement step can be assisted from a photograph, with the scoring and record-keeping handled in one place.

## What's built

**Assessment workflow**

- Register an animal (tag, species, breed, owner details)
- Upload field photographs (JPG, PNG, WEBP)
- Record linear and angular body measurements
- Compute a composite ATC score and letter grade from the standard criteria
- Export records as JSON for downstream BPA integration

**Data model** — five tables in Cloudflare D1 (SQLite):

| Table | Holds |
| --- | --- |
| `animals` | tag, species, breed, owner |
| `body_measurements` | linear, angular and composite values |
| `classification_results` | final scores and assigned grades |
| `users` | field personnel and roles |
| `activity_logs` | audit trail of all operations |

**Pipeline**

```
Image upload -> measurement extraction -> scoring -> grade assignment -> JSON export
     |                   |                   |             |               |
 validation      Workers AI (CV)        D1 storage   ATC criteria    BPA format
```

## Honest status

Being specific about what is and isn't proven here:

- **Scoring logic: implemented and testable.** Given measurements, the composite score and grade follow the published ATC criteria.
- **Measurement extraction: scaffolded, not validated.** The Workers AI call is wired up, but I have no labelled dataset of animals with known measurements, so I cannot report accuracy for the extracted values. Any claim that this matches a trained assessor would be unsupported.
- **No deployed instance.** An earlier version ran on a temporary sandbox host; that URL has expired and has been removed rather than left in this README as a dead link.
- **Field data: none.** Everything has been exercised with sample records, not real herds.

## What would make this real

1. A labelled set of animal photographs with assessor-verified measurements — without this there is no way to evaluate the CV step at all
2. Inter-assessor agreement as the benchmark: the useful question is not "is the model right" but "is the model as consistent as two human assessors are with each other"
3. Calibration per breed, since conformation norms differ substantially
4. Offline capability — field use means poor connectivity

## Running locally

```bash
git clone https://github.com/ishikadubey1105/cattle-buffalo-classification
cd cattle-buffalo-classification
npm install

npx wrangler d1 execute DB --local --file=./0001_initial_schema.sql
npx wrangler d1 execute DB --local --file=./seed.sql
npm run dev
```

## Structure

```
_worker.js                Workers entry point
index.tsx / renderer.tsx  app and SSR rendering
app.js                    client-side logic
0001_initial_schema.sql   database schema
seed.sql                  sample data
wrangler.jsonc            Cloudflare configuration
```

**Stack:** TypeScript, Hono, Cloudflare Workers, Cloudflare D1, Vite

---

*Built by [Ishika Dubey](https://github.com/ishikadubey1105) — B.Tech CSE (AI & ML), SIT Nagpur*
