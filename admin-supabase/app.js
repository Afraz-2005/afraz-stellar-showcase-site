// Main Application Logic for Supabase
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
        const videoUrl = formData.get('videoUrl');
        const thumbnailFile = formData.get('thumbnail');

        if (!videoFile && !videoUrl) {
            showMessage('Please select a video file or provide a video URL', 'error');
            return;
        }

        try {
            // Show progress section
            progressSection.style.display = 'block';
            uploadForm.style.display = 'none';
            
            let finalVideoUrl;
            let thumbnailUrl = null;
            
            if (videoFile && videoFile.size > 0) {
                // Upload video file to Supabase Storage
                finalVideoUrl = await uploadVideo(videoFile);
            } else if (videoUrl) {
                // Use provided video URL
                finalVideoUrl = videoUrl;
            }
            
            // Upload thumbnail if provided
            if (thumbnailFile && thumbnailFile.size > 0) {
                thumbnailUrl = await uploadThumbnail(thumbnailFile);
            }

            // Save metadata to Supabase Database
            await saveVideoMetadata({
                title,
                description,
                genre,
                date: date || 'Latest', // Provide default if date is empty
                video_url: finalVideoUrl,
                thumbnail_url: thumbnailUrl,
                upload_date: new Date().toISOString()
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

// Upload video to Supabase Storage
async function uploadVideo(file) {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `videos/${fileName}`;
    
    progressText.textContent = 'Uploading video...';
    
    const { data, error } = await window.supabaseClient.storage
        .from('videos')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        throw new Error('Video upload failed: ' + error.message);
    }

    // Get public URL
    const { data: urlData } = window.supabaseClient.storage
        .from('videos')
        .getPublicUrl(filePath);

    return urlData.publicUrl;
}

// Upload thumbnail to Supabase Storage
async function uploadThumbnail(file) {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `thumbnails/${fileName}`;
    
    progressText.textContent = 'Uploading thumbnail...';
    
    const { data, error } = await window.supabaseClient.storage
        .from('thumbnails')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        throw new Error('Thumbnail upload failed: ' + error.message);
    }

    // Get public URL
    const { data: urlData } = window.supabaseClient.storage
        .from('thumbnails')
        .getPublicUrl(filePath);

    return urlData.publicUrl;
}

// Save video metadata to Supabase Database
async function saveVideoMetadata(metadata) {
    console.log('Saving metadata:', metadata);
    
    const { data, error } = await window.supabaseClient
        .from('videos')
        .insert([metadata]);

    if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to save video metadata: ' + error.message);
    }

    console.log('Metadata saved successfully:', data);
    return data;
}

// Load recent uploads from Supabase Database
async function loadRecentUploads() {
    try {
        const { data, error } = await window.supabaseClient
            .from('videos')
            .select('*')
            .order('upload_date', { ascending: false })
            .limit(6);

        if (error) {
            throw error;
        }

        displayRecentUploads(data || []);
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
                <span>${new Date(upload.upload_date).toLocaleDateString()}</span>
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
        const { error } = await window.supabaseClient
            .from('videos')
            .delete()
            .eq('id', videoId);

        if (error) {
            throw error;
        }

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