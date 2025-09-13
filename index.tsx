import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
  AI: any;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for all routes
app.use('*', cors({
  origin: ['*'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))

// Initialize database tables
const initializeDatabase = async (db: D1Database) => {
  // Create tables if they don't exist (for local development)
  // Create animals table
  await db.prepare(`CREATE TABLE IF NOT EXISTS animals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag_number TEXT UNIQUE NOT NULL,
    name TEXT,
    species TEXT NOT NULL CHECK (species IN ('cattle', 'buffalo')),
    breed TEXT,
    age_months INTEGER,
    sex TEXT CHECK (sex IN ('male', 'female')),
    owner_name TEXT,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`).run();
  
  // Create body_measurements table
  await db.prepare(`CREATE TABLE IF NOT EXISTS body_measurements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    animal_id INTEGER NOT NULL,
    body_length REAL,
    height_at_withers REAL,
    chest_width REAL,
    chest_depth REAL,
    chest_girth REAL,
    rump_length REAL,
    rump_width REAL,
    pin_bone_width REAL,
    thurl_width REAL,
    rump_angle REAL,
    foot_angle REAL,
    rear_leg_set REAL,
    frame_score REAL,
    capacity_score REAL,
    feet_legs_score REAL,
    dairy_character_score REAL,
    image_url TEXT,
    image_width INTEGER,
    image_height INTEGER,
    confidence_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
  )`).run();
  
  // Create classification_results table
  await db.prepare(`CREATE TABLE IF NOT EXISTS classification_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    animal_id INTEGER NOT NULL,
    measurement_id INTEGER NOT NULL,
    frame_score INTEGER CHECK (frame_score >= 0 AND frame_score <= 100),
    dairy_capacity_score INTEGER CHECK (dairy_capacity_score >= 0 AND dairy_capacity_score <= 100),
    feet_legs_score INTEGER CHECK (feet_legs_score >= 0 AND feet_legs_score <= 100),
    mammary_system_score INTEGER CHECK (mammary_system_score >= 0 AND mammary_system_score <= 100),
    overall_grade TEXT CHECK (overall_grade IN ('Excellent', 'Very Good', 'Good', 'Fair', 'Poor')),
    final_score INTEGER CHECK (final_score >= 0 AND final_score <= 100),
    measurement_confidence REAL,
    classification_confidence REAL,
    reviewed_by TEXT,
    review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
    bpa_sync_status TEXT DEFAULT 'pending' CHECK (bpa_sync_status IN ('pending', 'synced', 'failed')),
    bpa_reference_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
    FOREIGN KEY (measurement_id) REFERENCES body_measurements(id) ON DELETE CASCADE
  )`).run();
}

// API Routes

// Get all animals
app.get('/api/animals', async (c) => {
  const { env } = c;
  
  try {
    await initializeDatabase(env.DB);
    
    const result = await env.DB.prepare(`
      SELECT a.*, 
             COUNT(cr.id) as classification_count,
             MAX(cr.final_score) as best_score,
             MAX(cr.created_at) as last_classification
      FROM animals a
      LEFT JOIN classification_results cr ON a.id = cr.animal_id
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `).all();

    return c.json({
      success: true,
      data: result.results,
      count: result.results?.length || 0
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch animals',
      details: error.message
    }, 500);
  }
});

// Get single animal with classifications
app.get('/api/animals/:id', async (c) => {
  const { env } = c;
  const animalId = c.req.param('id');
  
  try {
    await initializeDatabase(env.DB);
    
    const animal = await env.DB.prepare(`
      SELECT * FROM animals WHERE id = ?
    `).bind(animalId).first();

    if (!animal) {
      return c.json({ success: false, error: 'Animal not found' }, 404);
    }

    const measurements = await env.DB.prepare(`
      SELECT * FROM body_measurements WHERE animal_id = ? ORDER BY created_at DESC
    `).bind(animalId).all();

    const classifications = await env.DB.prepare(`
      SELECT * FROM classification_results WHERE animal_id = ? ORDER BY created_at DESC
    `).bind(animalId).all();

    return c.json({
      success: true,
      data: {
        animal,
        measurements: measurements.results || [],
        classifications: classifications.results || []
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch animal details',
      details: error.message
    }, 500);
  }
});

// Add new animal
app.post('/api/animals', async (c) => {
  const { env } = c;
  
  try {
    await initializeDatabase(env.DB);
    
    const body = await c.req.json();
    const { tag_number, name, species, breed, age_months, sex, owner_name, location } = body;

    if (!tag_number || !species) {
      return c.json({
        success: false,
        error: 'Tag number and species are required'
      }, 400);
    }

    const result = await env.DB.prepare(`
      INSERT INTO animals (tag_number, name, species, breed, age_months, sex, owner_name, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(tag_number, name, species, breed, age_months, sex, owner_name, location).run();

    return c.json({
      success: true,
      data: { id: result.meta.last_row_id, ...body }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to create animal record',
      details: error.message
    }, 500);
  }
});

// Process image and extract measurements (AI endpoint)
app.post('/api/analyze-image', async (c) => {
  const { env } = c;
  
  try {
    const body = await c.req.json();
    const { image_data, animal_id } = body;

    if (!image_data || !animal_id) {
      return c.json({
        success: false,
        error: 'Image data and animal ID are required'
      }, 400);
    }

    // Simulate AI processing - In production, this would use actual CV models
    const simulatedMeasurements = {
      body_length: Math.random() * 50 + 150, // 150-200 cm
      height_at_withers: Math.random() * 30 + 120, // 120-150 cm
      chest_width: Math.random() * 15 + 40, // 40-55 cm
      chest_depth: Math.random() * 20 + 60, // 60-80 cm
      chest_girth: Math.random() * 50 + 180, // 180-230 cm
      rump_length: Math.random() * 15 + 45, // 45-60 cm
      rump_width: Math.random() * 15 + 40, // 40-55 cm
      pin_bone_width: Math.random() * 5 + 15, // 15-20 cm
      thurl_width: Math.random() * 15 + 35, // 35-50 cm
      rump_angle: Math.random() * 15 + 15, // 15-30 degrees
      foot_angle: Math.random() * 15 + 35, // 35-50 degrees
      rear_leg_set: Math.random() * 10 + 10, // 10-20 degrees
      confidence_score: Math.random() * 0.3 + 0.7 // 0.7-1.0
    };

    // Calculate composite scores
    const frame_score = (simulatedMeasurements.body_length / 200 + simulatedMeasurements.height_at_withers / 150) * 50;
    const capacity_score = (simulatedMeasurements.chest_width / 55 + simulatedMeasurements.chest_depth / 80) * 50;
    const feet_legs_score = 100 - (Math.abs(simulatedMeasurements.foot_angle - 42.5) / 42.5) * 20;
    const dairy_character_score = (simulatedMeasurements.confidence_score * 100);

    // Store measurements in database
    const measurementResult = await env.DB.prepare(`
      INSERT INTO body_measurements (
        animal_id, body_length, height_at_withers, chest_width, chest_depth, chest_girth,
        rump_length, rump_width, pin_bone_width, thurl_width, rump_angle, foot_angle,
        rear_leg_set, frame_score, capacity_score, feet_legs_score, dairy_character_score,
        confidence_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      animal_id, ...Object.values(simulatedMeasurements),
      frame_score, capacity_score, feet_legs_score, dairy_character_score
    ).run();

    return c.json({
      success: true,
      data: {
        measurement_id: measurementResult.meta.last_row_id,
        measurements: {
          ...simulatedMeasurements,
          frame_score,
          capacity_score,
          feet_legs_score,
          dairy_character_score
        }
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to analyze image',
      details: error.message
    }, 500);
  }
});

// Generate classification score
app.post('/api/classify/:measurementId', async (c) => {
  const { env } = c;
  const measurementId = c.req.param('measurementId');
  
  try {
    await initializeDatabase(env.DB);
    
    // Get measurement data
    const measurement = await env.DB.prepare(`
      SELECT bm.*, a.species, a.breed 
      FROM body_measurements bm 
      JOIN animals a ON bm.animal_id = a.id 
      WHERE bm.id = ?
    `).bind(measurementId).first();

    if (!measurement) {
      return c.json({
        success: false,
        error: 'Measurement not found'
      }, 404);
    }

    // Calculate classification scores based on species and breed standards
    const baseScores = {
      frame_score: Math.round(measurement.frame_score || 75),
      dairy_capacity_score: Math.round(measurement.capacity_score || 75),
      feet_legs_score: Math.round(measurement.feet_legs_score || 75),
      mammary_system_score: Math.round(measurement.dairy_character_score || 75)
    };

    // Calculate final score and grade
    const final_score = Math.round(
      (baseScores.frame_score + baseScores.dairy_capacity_score + 
       baseScores.feet_legs_score + baseScores.mammary_system_score) / 4
    );

    let overall_grade = 'Poor';
    if (final_score >= 90) overall_grade = 'Excellent';
    else if (final_score >= 80) overall_grade = 'Very Good';
    else if (final_score >= 70) overall_grade = 'Good';
    else if (final_score >= 60) overall_grade = 'Fair';

    // Store classification result
    const classificationResult = await env.DB.prepare(`
      INSERT INTO classification_results (
        animal_id, measurement_id, frame_score, dairy_capacity_score, 
        feet_legs_score, mammary_system_score, overall_grade, final_score,
        measurement_confidence, classification_confidence
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      measurement.animal_id, measurementId, 
      baseScores.frame_score, baseScores.dairy_capacity_score,
      baseScores.feet_legs_score, baseScores.mammary_system_score,
      overall_grade, final_score,
      measurement.confidence_score, measurement.confidence_score * 0.95
    ).run();

    return c.json({
      success: true,
      data: {
        classification_id: classificationResult.meta.last_row_id,
        ...baseScores,
        overall_grade,
        final_score,
        confidence: measurement.confidence_score * 0.95
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to generate classification',
      details: error.message
    }, 500);
  }
});

// BPA Integration - Export data
app.get('/api/bpa/export/:animalId', async (c) => {
  const { env } = c;
  const animalId = c.req.param('animalId');
  
  try {
    await initializeDatabase(env.DB);
    
    const result = await env.DB.prepare(`
      SELECT 
        a.tag_number, a.name, a.species, a.breed, a.age_months, a.sex,
        a.owner_name, a.location,
        cr.frame_score, cr.dairy_capacity_score, cr.feet_legs_score,
        cr.mammary_system_score, cr.overall_grade, cr.final_score,
        cr.classification_confidence, cr.created_at as classification_date
      FROM animals a
      JOIN classification_results cr ON a.id = cr.animal_id
      WHERE a.id = ? AND cr.review_status = 'approved'
      ORDER BY cr.created_at DESC
      LIMIT 1
    `).bind(animalId).first();

    if (!result) {
      return c.json({
        success: false,
        error: 'No approved classification found for this animal'
      }, 404);
    }

    // Format data for BPA integration
    const bpaData = {
      animalDetails: {
        tagNumber: result.tag_number,
        animalName: result.name,
        species: result.species,
        breed: result.breed,
        age: result.age_months,
        sex: result.sex,
        ownerName: result.owner_name,
        location: result.location
      },
      classificationScores: {
        frameScore: result.frame_score,
        dairyCapacityScore: result.dairy_capacity_score,
        feetLegsScore: result.feet_legs_score,
        mammarySystemScore: result.mammary_system_score,
        overallGrade: result.overall_grade,
        finalScore: result.final_score
      },
      metadata: {
        classificationDate: result.classification_date,
        confidence: result.classification_confidence,
        systemVersion: "ATC-AI-v1.0",
        exportDate: new Date().toISOString()
      }
    };

    return c.json({
      success: true,
      data: bpaData
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to export BPA data',
      details: error.message
    }, 500);
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', async (c) => {
  const { env } = c;
  
  try {
    await initializeDatabase(env.DB);
    
    const totalAnimals = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM animals
    `).first();

    const totalClassifications = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM classification_results
    `).first();

    const pendingReviews = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM classification_results WHERE review_status = 'pending'
    `).first();

    const gradeDistribution = await env.DB.prepare(`
      SELECT overall_grade, COUNT(*) as count 
      FROM classification_results 
      GROUP BY overall_grade
    `).all();

    return c.json({
      success: true,
      data: {
        totalAnimals: totalAnimals?.count || 0,
        totalClassifications: totalClassifications?.count || 0,
        pendingReviews: pendingReviews?.count || 0,
        gradeDistribution: gradeDistribution.results || []
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to fetch dashboard stats',
      details: error.message
    }, 500);
  }
});

// Main frontend route
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Animal Type Classification System - Cattle & Buffalo AI Assessment</title>
        <meta name="description" content="AI-powered Animal Type Classification system for cattle and buffaloes under Rashtriya Gokul Mission">
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <div id="app">
            <!-- Navigation -->
            <nav class="bg-green-600 text-white shadow-lg">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16">
                        <div class="flex items-center">
                            <i class="fas fa-cow text-2xl mr-3"></i>
                            <div>
                                <h1 class="text-xl font-bold">Animal Type Classification System</h1>
                                <p class="text-sm text-green-100">Rashtriya Gokul Mission - AI Assessment</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4">
                            <span class="bg-green-700 px-3 py-1 rounded-full text-sm">Field Version</span>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Main Content -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Dashboard Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <i class="fas fa-cow text-3xl text-blue-500 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">Total Animals</p>
                                <p class="text-2xl font-bold text-gray-900" id="total-animals">-</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <i class="fas fa-brain text-3xl text-green-500 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">AI Classifications</p>
                                <p class="text-2xl font-bold text-gray-900" id="total-classifications">-</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <i class="fas fa-clock text-3xl text-yellow-500 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">Pending Reviews</p>
                                <p class="text-2xl font-bold text-gray-900" id="pending-reviews">-</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <i class="fas fa-star text-3xl text-purple-500 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">Excellent Grade</p>
                                <p class="text-2xl font-bold text-gray-900" id="excellent-count">-</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Interface Tabs -->
                <div class="bg-white rounded-lg shadow">
                    <div class="border-b border-gray-200">
                        <nav class="-mb-px flex">
                            <button class="tab-button active" data-tab="classify">
                                <i class="fas fa-camera mr-2"></i>New Classification
                            </button>
                            <button class="tab-button" data-tab="animals">
                                <i class="fas fa-list mr-2"></i>Animal Records
                            </button>
                            <button class="tab-button" data-tab="results">
                                <i class="fas fa-chart-bar mr-2"></i>Results
                            </button>
                            <button class="tab-button" data-tab="bpa">
                                <i class="fas fa-sync mr-2"></i>BPA Integration
                            </button>
                        </nav>
                    </div>

                    <!-- Tab Content -->
                    <div class="p-6">
                        <!-- New Classification Tab -->
                        <div id="tab-classify" class="tab-content">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">AI-Powered Animal Classification</h2>
                            
                            <!-- Animal Registration Form -->
                            <div class="bg-gray-50 rounded-lg p-6 mb-6">
                                <h3 class="text-lg font-semibold mb-4">1. Animal Information</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Tag Number *</label>
                                        <input type="text" id="tag-number" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Animal Name</label>
                                        <input type="text" id="animal-name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Species *</label>
                                        <select id="species" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                            <option value="">Select Species</option>
                                            <option value="cattle">Cattle</option>
                                            <option value="buffalo">Buffalo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                                        <select id="breed" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                            <option value="">Select Breed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Age (months)</label>
                                        <input type="number" id="age-months" min="12" max="180" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Sex</label>
                                        <select id="sex" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                            <option value="">Select Sex</option>
                                            <option value="female">Female</option>
                                            <option value="male">Male</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                                        <input type="text" id="owner-name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <input type="text" id="location" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    </div>
                                </div>
                            </div>

                            <!-- Image Upload Section -->
                            <div class="bg-gray-50 rounded-lg p-6 mb-6">
                                <h3 class="text-lg font-semibold mb-4">2. Animal Image Analysis</h3>
                                <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                                    <p class="text-lg text-gray-600 mb-2">Upload Animal Image for AI Analysis</p>
                                    <p class="text-sm text-gray-500 mb-4">Supported formats: JPG, PNG, WEBP (Max 10MB)</p>
                                    <input type="file" id="image-upload" accept="image/*" class="hidden">
                                    <button onclick="document.getElementById('image-upload').click()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                                        <i class="fas fa-camera mr-2"></i>Choose Image
                                    </button>
                                    <div id="image-preview" class="mt-4 hidden">
                                        <img id="preview-img" class="max-h-64 mx-auto rounded-lg border">
                                    </div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex space-x-4">
                                <button id="register-animal-btn" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                                    <i class="fas fa-plus mr-2"></i>Register Animal
                                </button>
                                <button id="analyze-image-btn" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50" disabled>
                                    <i class="fas fa-brain mr-2"></i>Analyze Image with AI
                                </button>
                                <button id="generate-classification-btn" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50" disabled>
                                    <i class="fas fa-star mr-2"></i>Generate Classification
                                </button>
                            </div>

                            <!-- Results Display -->
                            <div id="analysis-results" class="mt-8 hidden">
                                <!-- Results will be displayed here -->
                            </div>
                        </div>

                        <!-- Animal Records Tab -->
                        <div id="tab-animals" class="tab-content hidden">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">Animal Records</h2>
                            <div id="animals-list">
                                <!-- Animals list will be loaded here -->
                            </div>
                        </div>

                        <!-- Results Tab -->
                        <div id="tab-results" class="tab-content hidden">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">Classification Results</h2>
                            <div id="results-list">
                                <!-- Classification results will be loaded here -->
                            </div>
                        </div>

                        <!-- BPA Integration Tab -->
                        <div id="tab-bpa" class="tab-content hidden">
                            <h2 class="text-2xl font-bold text-gray-900 mb-6">Bharat Pashudhan App Integration</h2>
                            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <div class="flex items-center mb-4">
                                    <i class="fas fa-info-circle text-blue-500 text-xl mr-3"></i>
                                    <h3 class="text-lg font-semibold text-blue-900">BPA Data Export</h3>
                                </div>
                                <p class="text-blue-800 mb-4">Export approved classification data in BPA-compatible format for seamless integration.</p>
                                <div id="bpa-export-section">
                                    <!-- BPA export interface will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading Modal -->
        <div id="loading-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="bg-white rounded-lg p-8 text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-green-600 mb-4"></i>
                <p class="text-lg font-semibold">Processing...</p>
                <p class="text-gray-600" id="loading-text">Please wait while AI analyzes the image</p>
            </div>
        </div>

        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
});

export default app
