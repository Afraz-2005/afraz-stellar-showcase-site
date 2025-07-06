// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const recentUploads = document.getElementById('recentUploads');
    const previewModal = document.getElementById('previewModal');
    const previewContent = document.getElementById('previewContent');
    const closeModal = document.querySelector('.close');

    // File input handlers
    const videoFileInput = document.getElementById('videoFile');
    const fileInfo = document.getElementById('fileInfo');

    videoFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            fileInfo.innerHTML = `
                <strong>Selected:</strong> ${file.name}<br>
                <strong>Size:</strong> ${sizeMB} MB<br>
                <strong>Type:</strong> ${file.type}
            `;
        }
    });

    // Form submission
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(uploadForm);
        const title = formData.get('title');
        const description = formData.get('description');
        const genre = formData.get('genre');
        const date = formData.get('date');
        const videoFile = formData.get('videoFile');
        const thumbnailFile = formData.get('thumbnail');

        if (!videoFile) {
            showMessage('Please select a video file', 'error');
            return;
        }

        try {
            // Show progress section
            progressSection.style.display = 'block';
            uploadForm.style.display = 'none';
            
            // Upload video to Firebase Storage
            const videoUrl = await uploadVideo(videoFile);
            
            // Upload thumbnail if provided
            let thumbnailUrl = null;
            if (thumbnailFile && thumbnailFile.size > 0) {
                thumbnailUrl = await uploadThumbnail(thumbnailFile);
            }

            // Save metadata to Firestore
            await saveVideoMetadata({
                title,
                description,
                genre,
                date,
                videoUrl,
                thumbnailUrl,
                uploadDate: new Date().toISOString()
            });

            showMessage('Video uploaded successfully!', 'success');
            uploadForm.reset();
            fileInfo.innerHTML = '';
            loadRecentUploads();

        } catch (error) {
            console.error('Upload error:', error);
            showMessage('Upload failed: ' + error.message, 'error');
        } finally {
            progressSection.style.display = 'none';
            uploadForm.style.display = 'block';
        }
    });

    // Preview button
    document.getElementById('previewBtn').addEventListener('click', function() {
        const formData = new FormData(uploadForm);
        const title = formData.get('title');
        const description = formData.get('description');
        const genre = formData.get('genre');
        const date = formData.get('date');

        if (!title || !description || !genre) {
            showMessage('Please fill in title, description, and genre for preview', 'error');
            return;
        }

        previewContent.innerHTML = `
            <div class="upload-card">
                <h4>${title}</h4>
                <p>${description}</p>
                <div class="upload-meta">
                    <span>${genre}</span>
                    <span>${date}</span>
                </div>
            </div>
        `;
        previewModal.style.display = 'block';
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        previewModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });

    // Load recent uploads on page load
    loadRecentUploads();
});

// Upload video to Firebase Storage
async function uploadVideo(file) {
    const storageRef = storage.ref();
    const videoRef = storageRef.child(`videos/${Date.now()}_${file.name}`);
    
    const uploadTask = videoRef.put(file);
    
    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressFill.style.width = progress + '%';
                progressText.textContent = `Uploading video... ${Math.round(progress)}%`;
            },
            (error) => {
                reject(error);
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}

// Upload thumbnail to Firebase Storage
async function uploadThumbnail(file) {
    const storageRef = storage.ref();
    const thumbnailRef = storageRef.child(`thumbnails/${Date.now()}_${file.name}`);
    
    const uploadTask = thumbnailRef.put(file);
    
    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressText.textContent = `Uploading thumbnail... ${Math.round(progress)}%`;
            },
            (error) => {
                reject(error);
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}

// Save video metadata to Firestore
async function saveVideoMetadata(metadata) {
    try {
        await db.collection('videos').add(metadata);
    } catch (error) {
        throw new Error('Failed to save video metadata: ' + error.message);
    }
}

// Load recent uploads from Firestore
async function loadRecentUploads() {
    try {
        const snapshot = await db.collection('videos')
            .orderBy('uploadDate', 'desc')
            .limit(6)
            .get();

        const uploads = [];
        snapshot.forEach(doc => {
            uploads.push({ id: doc.id, ...doc.data() });
        });

        displayRecentUploads(uploads);
    } catch (error) {
        console.error('Error loading recent uploads:', error);
        showMessage('Failed to load recent uploads', 'error');
    }
}

// Display recent uploads in the grid
function displayRecentUploads(uploads) {
    const recentUploads = document.getElementById('recentUploads');
    
    if (uploads.length === 0) {
        recentUploads.innerHTML = '<p style="text-align: center; color: #666;">No videos uploaded yet.</p>';
        return;
    }

    recentUploads.innerHTML = uploads.map(upload => `
        <div class="upload-card">
            <h4>${upload.title}</h4>
            <p>${upload.description}</p>
            <div class="upload-meta">
                <span>${upload.genre}</span>
                <span>${upload.date}</span>
                <span>${new Date(upload.uploadDate).toLocaleDateString()}</span>
            </div>
            <div style="margin-top: 10px;">
                <button onclick="deleteVideo('${upload.id}')" class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Delete video function
async function deleteVideo(videoId) {
    if (!confirm('Are you sure you want to delete this video?')) {
        return;
    }

    try {
        await db.collection('videos').doc(videoId).delete();
        showMessage('Video deleted successfully', 'success');
        loadRecentUploads();
    } catch (error) {
        console.error('Error deleting video:', error);
        showMessage('Failed to delete video', 'error');
    }
}

// Show message function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
} 