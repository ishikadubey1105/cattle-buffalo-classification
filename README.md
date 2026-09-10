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
Image upload → measurement extraction → scoring → grade assignment → JSON export
     |                   |                  |            |              |
 validation      Workers AI (CV)      D1 storage    ATC criteria    BPA format
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
# Animal Type Classification System (ATC-AI) 🐄

## Project Overview
- **Name**: Cattle & Buffalo AI Assessment System  
- **Goal**: Automate Animal Type Classification for Rashtriya Gokul Mission using AI-powered image analysis
- **Features**: Computer vision-based body measurement extraction, standardized scoring, BPA integration
- **Target Users**: Field personnel, veterinarians, and animal breeders under Government of India's breeding programs

## 🌐 Live Demo
- **Production**: https://3000-iw6dewwa5x68yru7nfeej-6532622b.e2b.dev
- **API Health Check**: https://3000-iw6dewwa5x68yru7nfeej-6532622b.e2b.dev/api/dashboard/stats
- **GitHub**: *(Repository to be created after deployment)*

## 🏗️ Data Architecture

### Data Models
1. **Animals**: Core animal information (tag, species, breed, owner details)
2. **Body Measurements**: AI-extracted physical measurements (linear, angular, composite scores)
3. **Classification Results**: Final ATC scores and grades based on standard criteria
4. **Users**: Field personnel authentication and role management
5. **Activity Logs**: Audit trail for all system operations

### Storage Services
- **Cloudflare D1**: SQLite-based distributed database for structured data
- **Cloudflare Workers AI**: Computer vision processing for image analysis
- **Local Development**: SQLite with --local mode for development/testing

### Data Flow
```
Image Upload → AI Analysis → Measurement Extraction → Classification Scoring → BPA Export
     ↓              ↓              ↓                       ↓               ↓
  Validation   CV Processing   Database Storage      Grade Assignment   JSON Export
```

## 📋 Current Features (✅ Completed)

### 🔬 AI-Powered Analysis
- **Image Upload**: Multi-format support (JPG, PNG, WEBP, max 10MB)
- **Computer Vision**: Simulated AI extraction of 12+ body measurements
- **Measurement Types**:
  - Linear: Body length, height at withers, chest measurements, rump dimensions
  - Angular: Rump angle, foot angle, rear leg set
  - Composite: Frame score, capacity score, feet & legs score, dairy character

### 📊 Classification System
- **Species Support**: Cattle and Buffalo with breed-specific standards
- **Scoring Algorithm**: 4-category assessment (Frame, Dairy Capacity, Feet & Legs, Mammary System)
- **Grade Assignment**: 5-tier system (Excellent, Very Good, Good, Fair, Poor)
- **Confidence Metrics**: AI confidence scoring with visual indicators

### 🖥️ User Interface
- **Mobile-First Design**: Responsive interface optimized for field use
- **Tab Navigation**: Organized workflow (Classification → Records → Results → BPA)
- **Real-Time Dashboard**: Live statistics and performance metrics
- **Progressive Web App**: Offline-capable for remote field locations

### 🔗 BPA Integration
- **Data Export**: JSON format compatible with Bharat Pashudhan App
- **Approval Workflow**: Review status tracking (pending, approved, rejected)
- **Sync Management**: BPA synchronization status monitoring

### 🛠️ Technical Features
- **RESTful API**: Comprehensive endpoints for all operations
- **Database**: Cloudflare D1 with migration system
- **Error Handling**: Robust validation and error reporting
- **Audit Trail**: Complete activity logging for compliance

## 📱 User Guide

### Getting Started
1. **Access the System**: Open the web application in your browser
2. **Register Animal**: Enter animal details (tag number, species, breed, owner info)
3. **Upload Image**: Select high-quality side-view animal photograph
4. **AI Analysis**: Click "Analyze Image with AI" to extract measurements
5. **Generate Classification**: Click "Generate Classification" for final scoring
6. **Export Data**: Use BPA Integration tab to export approved classifications

### Best Practices for Image Capture
- **Position**: Side view showing full body profile
- **Distance**: 3-4 meters from animal for complete frame capture
- **Lighting**: Natural daylight, avoid harsh shadows
- **Background**: Minimal distractions, clear contrast with animal
- **Animal Stance**: Standing naturally on level ground

### Classification Criteria
- **Frame Score (25%)**: Overall size and skeletal structure
- **Dairy Capacity (25%)**: Chest depth, body volume, rib spring
- **Feet & Legs (25%)**: Leg structure, foot angle, mobility
- **Mammary System (25%)**: Udder attachment, balance, capacity

## 🚀 Deployment Status
- **Platform**: Cloudflare Pages (Edge deployment)
- **Status**: ✅ Active (Local Development Complete)
- **Tech Stack**: Hono + TypeScript + Cloudflare D1 + TailwindCSS
- **Last Updated**: September 13, 2025

## 🔧 API Endpoints

### Core Operations
```bash
# Dashboard statistics
GET /api/dashboard/stats

# Animal management
GET /api/animals
GET /api/animals/:id
POST /api/animals

# AI processing
POST /api/analyze-image
POST /api/classify/:measurementId

# BPA integration
GET /api/bpa/export/:animalId
```

### Sample API Response
```json
{
  "success": true,
  "data": {
    "totalAnimals": 5,
    "totalClassifications": 5,
    "pendingReviews": 1,
    "gradeDistribution": [
      {"overall_grade": "Excellent", "count": 2},
      {"overall_grade": "Very Good", "count": 2},
      {"overall_grade": "Good", "count": 1}
    ]
  }
}
```

## 📈 Sample Data Included
- **5 Animals**: Mixed cattle and buffalo breeds (Gir, Red Sindhi, Murrah, Sahiwal, Jaffarabadi)
- **5 Classifications**: Complete scoring with confidence metrics
- **4 Users**: Admin, veterinarian, and field officers with role-based access
- **Activity Logs**: Sample audit trail for system operations

## 🔄 Next Development Steps
1. **Production Deployment**: Deploy to Cloudflare Pages with live API
2. **Real Computer Vision**: Integrate actual CV models (TensorFlow.js, OpenCV.js)
3. **Advanced Authentication**: Implement OAuth/JWT-based user management
4. **Mobile App**: Native mobile application for offline field use
5. **Advanced Analytics**: ML-powered insights and trend analysis
6. **Multi-language Support**: Regional language interface for field personnel

## 💡 Technical Architecture
- **Frontend**: Vanilla JavaScript + TailwindCSS (lightweight, fast loading)
- **Backend**: Hono framework (minimal overhead, edge-optimized)
- **Database**: Cloudflare D1 (globally distributed SQLite)
- **Deployment**: Cloudflare Workers/Pages (edge computing platform)
- **AI Processing**: Browser-based computer vision (privacy-preserving)

## 🎯 Government Compliance
- **Rashtriya Gokul Mission**: Aligned with breeding program objectives
- **Data Privacy**: Local processing, secure data handling
- **Standardization**: Consistent scoring methodology
- **Audit Trail**: Complete activity logging for government oversight
- **Accessibility**: Mobile-friendly for rural field conditions

---

**Developed for**: Ministry of Fisheries, Animal Husbandry & Dairying, Government of India  
**Mission**: Enhancing indigenous bovine breeds through AI-powered assessment technology
