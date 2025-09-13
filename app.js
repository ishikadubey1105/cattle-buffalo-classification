// Animal Type Classification System - Frontend Application

class AnimalClassificationApp {
    constructor() {
        this.currentAnimalId = null;
        this.currentMeasurementId = null;
        this.selectedImage = null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupTabNavigation();
        await this.loadDashboardStats();
        await this.loadAnimals();
        this.setupBreedOptions();
    }

    setupEventListeners() {
        // Image upload
        const imageUpload = document.getElementById('image-upload');
        imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));

        // Form buttons
        document.getElementById('register-animal-btn').addEventListener('click', () => this.registerAnimal());
        document.getElementById('analyze-image-btn').addEventListener('click', () => this.analyzeImage());
        document.getElementById('generate-classification-btn').addEventListener('click', () => this.generateClassification());

        // Species change handler for breed options
        document.getElementById('species').addEventListener('change', (e) => this.updateBreedOptions(e.target.value));
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // Update active button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show/hide tab content
                tabContents.forEach(content => {
                    if (content.id === `tab-${targetTab}`) {
                        content.classList.remove('hidden');
                    } else {
                        content.classList.add('hidden');
                    }
                });

                // Load tab-specific data
                this.loadTabData(targetTab);
            });
        });
    }

    async loadTabData(tab) {
        switch (tab) {
            case 'animals':
                await this.loadAnimals();
                break;
            case 'results':
                await this.loadResults();
                break;
            case 'bpa':
                await this.loadBPAExport();
                break;
        }
    }

    setupBreedOptions() {
        const cattleBreeds = [
            'Gir', 'Red Sindhi', 'Sahiwal', 'Tharparkar', 'Rathi', 'Hariana', 'Ongole', 'Krishna Valley',
            'Hallikar', 'Amritmahal', 'Kangayam', 'Umblachery', 'Pulikulam', 'Alambadi', 'Bargur'
        ];
        
        const buffaloBreeds = [
            'Murrah', 'Jaffarabadi', 'Surti', 'Nili-Ravi', 'Mehsana', 'Nagpuri', 'Pandharpuri',
            'Kalahandi', 'Sambalpuri', 'Chilika', 'Marathwadi', 'Toda'
        ];

        this.breedOptions = { cattle: cattleBreeds, buffalo: buffaloBreeds };
    }

    updateBreedOptions(species) {
        const breedSelect = document.getElementById('breed');
        breedSelect.innerHTML = '<option value="">Select Breed</option>';
        
        if (species && this.breedOptions[species]) {
            this.breedOptions[species].forEach(breed => {
                const option = document.createElement('option');
                option.value = breed;
                option.textContent = breed;
                breedSelect.appendChild(option);
            });
        }
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        this.selectedImage = file;
        
        // Show image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('image-preview');
            const img = document.getElementById('preview-img');
            img.src = e.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);

        // Enable analyze button if animal is registered
        if (this.currentAnimalId) {
            document.getElementById('analyze-image-btn').disabled = false;
        }
    }

    async registerAnimal() {
        const formData = {
            tag_number: document.getElementById('tag-number').value.trim(),
            name: document.getElementById('animal-name').value.trim(),
            species: document.getElementById('species').value,
            breed: document.getElementById('breed').value,
            age_months: parseInt(document.getElementById('age-months').value) || null,
            sex: document.getElementById('sex').value,
            owner_name: document.getElementById('owner-name').value.trim(),
            location: document.getElementById('location').value.trim()
        };

        // Validate required fields
        if (!formData.tag_number || !formData.species) {
            alert('Tag number and species are required');
            return;
        }

        try {
            this.showLoading('Registering animal...');
            
            const response = await axios.post('/api/animals', formData);
            
            if (response.data.success) {
                this.currentAnimalId = response.data.data.id;
                this.showSuccess('Animal registered successfully!');
                
                // Enable image analysis if image is selected
                if (this.selectedImage) {
                    document.getElementById('analyze-image-btn').disabled = false;
                }
                
                // Refresh dashboard stats
                await this.loadDashboardStats();
            } else {
                throw new Error(response.data.error);
            }
        } catch (error) {
            this.showError('Registration failed: ' + (error.response?.data?.error || error.message));
        } finally {
            this.hideLoading();
        }
    }

    async analyzeImage() {
        if (!this.currentAnimalId || !this.selectedImage) {
            alert('Please register animal and select an image first');
            return;
        }

        try {
            this.showLoading('AI is analyzing the image...');
            
            // Convert image to base64
            const imageData = await this.fileToBase64(this.selectedImage);
            
            const response = await axios.post('/api/analyze-image', {
                animal_id: this.currentAnimalId,
                image_data: imageData
            });
            
            if (response.data.success) {
                this.currentMeasurementId = response.data.data.measurement_id;
                this.displayMeasurementResults(response.data.data.measurements);
                
                // Enable classification button
                document.getElementById('generate-classification-btn').disabled = false;
                
                this.showSuccess('Image analysis completed!');
            } else {
                throw new Error(response.data.error);
            }
        } catch (error) {
            this.showError('Image analysis failed: ' + (error.response?.data?.error || error.message));
        } finally {
            this.hideLoading();
        }
    }

    async generateClassification() {
        if (!this.currentMeasurementId) {
            alert('Please analyze an image first');
            return;
        }

        try {
            this.showLoading('Generating classification scores...');
            
            const response = await axios.post(`/api/classify/${this.currentMeasurementId}`);
            
            if (response.data.success) {
                this.displayClassificationResults(response.data.data);
                this.showSuccess('Classification completed!');
                
                // Refresh dashboard stats
                await this.loadDashboardStats();
            } else {
                throw new Error(response.data.error);
            }
        } catch (error) {
            this.showError('Classification failed: ' + (error.response?.data?.error || error.message));
        } finally {
            this.hideLoading();
        }
    }

    displayMeasurementResults(measurements) {
        const resultsDiv = document.getElementById('analysis-results');
        
        const html = `
            <div class="bg-white rounded-lg shadow p-6 fade-in">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    <i class="fas fa-ruler text-blue-500 mr-2"></i>
                    Body Measurements Extracted
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-medium text-gray-700 mb-2">Linear Measurements</h4>
                        <div class="space-y-1 text-sm">
                            <div>Body Length: <span class="font-medium">${measurements.body_length.toFixed(1)} cm</span></div>
                            <div>Height at Withers: <span class="font-medium">${measurements.height_at_withers.toFixed(1)} cm</span></div>
                            <div>Chest Width: <span class="font-medium">${measurements.chest_width.toFixed(1)} cm</span></div>
                            <div>Chest Depth: <span class="font-medium">${measurements.chest_depth.toFixed(1)} cm</span></div>
                            <div>Chest Girth: <span class="font-medium">${measurements.chest_girth.toFixed(1)} cm</span></div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-medium text-gray-700 mb-2">Rump Measurements</h4>
                        <div class="space-y-1 text-sm">
                            <div>Rump Length: <span class="font-medium">${measurements.rump_length.toFixed(1)} cm</span></div>
                            <div>Rump Width: <span class="font-medium">${measurements.rump_width.toFixed(1)} cm</span></div>
                            <div>Pin Bone Width: <span class="font-medium">${measurements.pin_bone_width.toFixed(1)} cm</span></div>
                            <div>Thurl Width: <span class="font-medium">${measurements.thurl_width.toFixed(1)} cm</span></div>
                            <div>Rump Angle: <span class="font-medium">${measurements.rump_angle.toFixed(1)}°</span></div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-medium text-gray-700 mb-2">Composite Scores</h4>
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <span class="text-sm">Frame Score</span>
                                <span class="font-medium">${measurements.frame_score.toFixed(1)}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm">Capacity Score</span>
                                <span class="font-medium">${measurements.capacity_score.toFixed(1)}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm">Feet & Legs Score</span>
                                <span class="font-medium">${measurements.feet_legs_score.toFixed(1)}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm">Dairy Character</span>
                                <span class="font-medium">${measurements.dairy_character_score.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center">
                        <i class="fas fa-brain text-blue-500 mr-2"></i>
                        <span class="font-medium text-blue-900">AI Confidence: ${(measurements.confidence_score * 100).toFixed(1)}%</span>
                    </div>
                    <div class="w-full bg-blue-200 rounded-full h-2 mt-2">
                        <div class="confidence-${this.getConfidenceLevel(measurements.confidence_score)} h-2 rounded-full" 
                             style="width: ${(measurements.confidence_score * 100)}%"></div>
                    </div>
                </div>
            </div>
        `;
        
        resultsDiv.innerHTML = html;
        resultsDiv.classList.remove('hidden');
    }

    displayClassificationResults(classification) {
        const resultsDiv = document.getElementById('analysis-results');
        const existingContent = resultsDiv.innerHTML;
        
        const gradeClass = `score-${classification.overall_grade.toLowerCase().replace(' ', '-')}`;
        
        const classificationHtml = `
            <div class="bg-white rounded-lg shadow p-6 fade-in mt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    <i class="fas fa-star text-purple-500 mr-2"></i>
                    Animal Type Classification Results
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <h4 class="font-medium text-gray-700">Individual Scores</h4>
                        
                        <div class="space-y-3">
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-sm text-gray-600">Frame Score</span>
                                    <span class="font-medium">${classification.frame_score}/100</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${classification.frame_score}%"></div>
                                </div>
                            </div>
                            
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-sm text-gray-600">Dairy Capacity</span>
                                    <span class="font-medium">${classification.dairy_capacity_score}/100</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${classification.dairy_capacity_score}%"></div>
                                </div>
                            </div>
                            
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-sm text-gray-600">Feet & Legs</span>
                                    <span class="font-medium">${classification.feet_legs_score}/100</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${classification.feet_legs_score}%"></div>
                                </div>
                            </div>
                            
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-sm text-gray-600">Mammary System</span>
                                    <span class="font-medium">${classification.mammary_system_score}/100</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${classification.mammary_system_score}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <h4 class="font-medium text-gray-700">Final Classification</h4>
                        
                        <div class="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                            <div class="grade-badge ${gradeClass} text-lg font-bold mb-2">
                                ${classification.overall_grade}
                            </div>
                            <div class="text-3xl font-bold text-gray-900 mb-1">
                                ${classification.final_score}/100
                            </div>
                            <div class="text-sm text-gray-600">
                                Final Score
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Classification Confidence</span>
                                <span class="font-medium">${(classification.confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div class="confidence-${this.getConfidenceLevel(classification.confidence)} h-2 rounded-full" 
                                     style="width: ${(classification.confidence * 100)}%"></div>
                            </div>
                        </div>
                        
                        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div class="flex items-center">
                                <i class="fas fa-check-circle text-green-500 mr-2"></i>
                                <span class="font-medium text-green-900">Ready for BPA Export</span>
                            </div>
                            <p class="text-green-700 text-sm mt-1">
                                Classification data can now be exported to Bharat Pashudhan App
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        resultsDiv.innerHTML = existingContent + classificationHtml;
    }

    getConfidenceLevel(confidence) {
        if (confidence >= 0.8) return 'high';
        if (confidence >= 0.6) return 'medium';
        return 'low';
    }

    async loadDashboardStats() {
        try {
            const response = await axios.get('/api/dashboard/stats');
            if (response.data.success) {
                const stats = response.data.data;
                
                document.getElementById('total-animals').textContent = stats.totalAnimals;
                document.getElementById('total-classifications').textContent = stats.totalClassifications;
                document.getElementById('pending-reviews').textContent = stats.pendingReviews;
                
                // Count excellent grades
                const excellentCount = stats.gradeDistribution.find(g => g.overall_grade === 'Excellent')?.count || 0;
                document.getElementById('excellent-count').textContent = excellentCount;
            }
        } catch (error) {
            console.error('Failed to load dashboard stats:', error);
        }
    }

    async loadAnimals() {
        try {
            const response = await axios.get('/api/animals');
            if (response.data.success) {
                this.displayAnimals(response.data.data);
            }
        } catch (error) {
            console.error('Failed to load animals:', error);
        }
    }

    displayAnimals(animals) {
        const container = document.getElementById('animals-list');
        
        if (!animals || animals.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-cow text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">No animals registered yet</p>
                </div>
            `;
            return;
        }

        const html = animals.map(animal => `
            <div class="animal-card">
                <div class="flex items-center justify-between mb-3">
                    <div>
                        <h3 class="font-semibold text-gray-900">${animal.name || 'Unnamed'}</h3>
                        <p class="text-sm text-gray-600">Tag: ${animal.tag_number}</p>
                    </div>
                    <div class="text-right">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ${animal.species}
                        </span>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>Breed: ${animal.breed || 'Not specified'}</div>
                    <div>Age: ${animal.age_months ? animal.age_months + ' months' : 'Not specified'}</div>
                    <div>Owner: ${animal.owner_name || 'Not specified'}</div>
                    <div>Location: ${animal.location || 'Not specified'}</div>
                </div>
                
                <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div class="text-sm text-gray-600">
                        Classifications: ${animal.classification_count || 0}
                    </div>
                    ${animal.best_score ? `
                        <div class="text-sm font-medium text-green-600">
                            Best Score: ${animal.best_score}/100
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">${html}</div>`;
    }

    async loadResults() {
        // Implementation for loading classification results
        const container = document.getElementById('results-list');
        container.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-chart-bar text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Results view coming soon</p>
            </div>
        `;
    }

    async loadBPAExport() {
        // Implementation for BPA export interface
        const container = document.getElementById('bpa-export-section');
        container.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-download text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">BPA export interface coming soon</p>
            </div>
        `;
    }

    // Utility methods
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    showLoading(text = 'Processing...') {
        const modal = document.getElementById('loading-modal');
        const textEl = document.getElementById('loading-text');
        textEl.textContent = text;
        modal.classList.remove('hidden');
    }

    hideLoading() {
        const modal = document.getElementById('loading-modal');
        modal.classList.add('hidden');
    }

    showSuccess(message) {
        // Simple alert for now - could be enhanced with toast notifications
        alert('✓ ' + message);
    }

    showError(message) {
        // Simple alert for now - could be enhanced with toast notifications
        alert('✗ ' + message);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AnimalClassificationApp();
});