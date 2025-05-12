// 3D Model Viewer for O-Wind Turbine Website
// This file provides enhanced 3D model functionality

// Import required model-viewer script
function loadModelViewer() {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    document.head.appendChild(script);
    
    console.log('Model viewer script loaded');
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadModelViewer();
    
    // Setup model viewer once it's loaded
    window.addEventListener('load', setupModelViewer);
});

// Enhance the model viewer with additional functionality
function setupModelViewer() {
    const modelViewer = document.querySelector('model-viewer');
    if (!modelViewer) return;
    
    console.log('Setting up model viewer');
    
    // Add hotspots to highlight key features
    addHotspots(modelViewer);
    
    // Add custom camera positions
    addCameraPositions(modelViewer);
    
    // Add annotation overlays with detailed info
    addAnnotations(modelViewer);
}

// Add interactive hotspots to model
function addHotspots(modelViewer) {
    // In a real implementation, these would point to specific parts of your turbine model
    const hotspots = [
        { position: '0 1 1', name: 'blade-design', title: 'Aerodynamic Blade Design' },
        { position: '1 0 0', name: 'generator', title: 'Compact Generator' },
        { position: '0 0 -1', name: 'mounting', title: 'Universal Mounting System' }
    ];
    
    hotspots.forEach(spot => {
        const hotspot = document.createElement('button');
        hotspot.slot = `hotspot-${spot.name}`;
        hotspot.classList.add('hotspot');
        hotspot.dataset.position = spot.position;
        hotspot.dataset.normalX = '0';
        hotspot.dataset.normalY = '1';
        hotspot.dataset.normalZ = '0';
        
        const annotation = document.createElement('div');
        annotation.classList.add('annotation');
        annotation.textContent = spot.title;
        
        hotspot.appendChild(annotation);
        modelViewer.appendChild(hotspot);
    });
}

// Add predefined camera views
function addCameraPositions(modelViewer) {
    const views = {
        'front': '0deg 90deg 2m',
        'side': '90deg 90deg 2m',
        'top': '0deg 0deg 2m',
        'detail': '30deg 60deg 1m'
    };
    
    // Add view buttons
    const viewContainer = document.createElement('div');
    viewContainer.classList.add('model-view-buttons');
    
    Object.keys(views).forEach(view => {
        const button = document.createElement('button');
        button.textContent = view.charAt(0).toUpperCase() + view.slice(1) + ' View';
        button.classList.add('view-button');
        button.addEventListener('click', () => {
            modelViewer.cameraOrbit = views[view];
        });
        viewContainer.appendChild(button);
    });
    
    // Add container after model viewer
    modelViewer.parentNode.insertBefore(viewContainer, modelViewer.nextSibling);
}

// Add detailed annotations about the product
function addAnnotations(modelViewer) {
    // Create annotation panel
    const annotationPanel = document.createElement('div');
    annotationPanel.classList.add('annotation-panel');
    annotationPanel.innerHTML = `
        <h4>O-Wind Turbine Features</h4>
        <ul class="feature-list">
            <li>Omnidirectional wind capture technology</li>
            <li>Efficient in turbulent urban wind conditions</li>
            <li>Compact design for easy installation</li>
            <li>Durable materials for all weather conditions</li>
            <li>Low maintenance requirements</li>
        </ul>
        <p class="annotation-detail">
            The unique spherical design allows for wind capture from any direction without 
            the need for repositioning, making it ideal for urban environments.
        </p>
    `;
    
    // Add panel after the view buttons
    const viewButtons = document.querySelector('.model-view-buttons');
    if (viewButtons) {
        viewButtons.parentNode.insertBefore(annotationPanel, viewButtons.nextSibling);
    } else {
        modelViewer.parentNode.appendChild(annotationPanel);
    }
}
