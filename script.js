document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('badge-canvas');
    const ctx = canvas.getContext('2d');
    
    const nameInput = document.getElementById('name');
    const positionInput = document.getElementById('position');
    const roleSelect = document.getElementById('role');
    const photoInput = document.getElementById('photo-upload');
    const uploadArea = document.getElementById('upload-area');
    const downloadBtn = document.getElementById('download-btn');
    
    // Cropper elements
    const cropModal = document.getElementById('crop-modal');
    const cropImage = document.getElementById('image-to-crop');
    const cancelCropBtn = document.getElementById('cancel-crop');
    const applyCropBtn = document.getElementById('apply-crop');
    
    let uploadedImage = null;
    let cropper = null;
    let logoImage = null;
    let ieeeLogoImage = null;
    
    const logoObj = new Image();
    logoObj.onload = () => {
        logoImage = logoObj;
        renderBadge();
    };
    logoObj.src = 'Netsip%202026%20colorlogo.png';

    const ieeeLogoObj = new Image();
    ieeeLogoObj.onload = () => {
        ieeeLogoImage = ieeeLogoObj;
        renderBadge();
    };
    ieeeLogoObj.src = 'IEEE%20SPS%20Gujarat%20Section%20Logo%20(RGB).png';
    
    // Draw constants
    const CANVAS_WIDTH = 1080;
    const CANVAS_HEIGHT = 1350;
    
    // Set up canvas initial state
    initCanvas();
    validateForm(); // Disable download button initially
    
    // Event Listeners
    nameInput.addEventListener('input', () => {
        validateForm();
        renderBadge();
    });
    
    positionInput.addEventListener('input', renderBadge);
    
    roleSelect.addEventListener('change', renderBadge);
    
    photoInput.addEventListener('change', handlePhotoUpload);
    
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            photoInput.click();
        });
    }
    
    cancelCropBtn.addEventListener('click', cancelCrop);
    applyCropBtn.addEventListener('click', applyCrop);
    
    downloadBtn.addEventListener('click', downloadBadge);
    
    function validateForm() {
        if (nameInput.value.trim().length > 0 && uploadedImage !== null) {
            downloadBtn.disabled = false;
        } else {
            downloadBtn.disabled = true;
        }
    }
    
    function handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            // Show modal and initialize cropper
            cropImage.src = event.target.result;
            cropModal.classList.remove('hidden');
            
            if (cropper) {
                cropper.destroy();
            }
            
            // Allow image to render before initializing cropper
            setTimeout(() => {
                cropper = new Cropper(cropImage, {
                    aspectRatio: 1, // Circular badge photo needs 1:1 ratio
                    viewMode: 1,
                    dragMode: 'move',
                    autoCropArea: 1,
                    restore: false,
                    guides: false,
                    center: false,
                    highlight: false,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    toggleDragModeOnDblclick: false,
                });
            }, 100);
        };
        reader.readAsDataURL(file);
        
        // Reset the input so the same file can be uploaded again if canceled
        e.target.value = '';
    }
    
    function cancelCrop() {
        cropModal.classList.add('hidden');
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    }
    
    function applyCrop() {
        if (!cropper) return;
        
        // Get the cropped canvas
        const croppedCanvas = cropper.getCroppedCanvas({
            width: 800,
            height: 800,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });
        
        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
            renderBadge();
            validateForm();
        };
        img.src = croppedCanvas.toDataURL('image/png');
        
        cropModal.classList.add('hidden');
        cropper.destroy();
        cropper = null;
    }
    
    function getRole() {
        return roleSelect.value;
    }
    
    async function initCanvas() {
        // Ensure fonts are loaded before initial render if possible
        await document.fonts.ready;
        renderBadge();
    }
    
    function drawNeuralNetwork(ctx, width, height) {
        ctx.save();
        
        // Draw some connected nodes (fixed coordinates to avoid jitter on redraw)
        const nodes = [
            {x: -50, y: 200}, {x: 150, y: 100}, {x: 350, y: -50},
            {x: 80, y: 350}, {x: 250, y: 250}, {x: 450, y: 150},
            {x: 650, y: 80}, {x: 850, y: 150}, {x: 1050, y: 50},
            {x: 1150, y: 250}, {x: 950, y: 350}, {x: 750, y: 250},
            {x: 550, y: 350}, {x: 150, y: 550}, {x: 350, y: 450},
            {x: -50, y: 700}, {x: 200, y: 750}, {x: 400, y: 650},
            {x: 600, y: 750}, {x: 800, y: 550}, {x: 950, y: 650},
            {x: 1150, y: 750}, {x: 1050, y: 900}, {x: 850, y: 850},
            {x: 700, y: 950}, {x: 500, y: 900}, {x: 250, y: 950},
            {x: 50, y: 1100}, {x: 350, y: 1150}, {x: 600, y: 1200},
            {x: 800, y: 1100}, {x: 1000, y: 1250}, {x: 1200, y: 1050}
        ];
        
        // Shadow for glowing effect
        ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
        ctx.shadowBlur = 10;
        
        ctx.lineWidth = 1.5;
        
        // Create gradient for lines
        const lineGrad = ctx.createLinearGradient(0, 0, width, height);
        lineGrad.addColorStop(0, 'rgba(99, 102, 241, 0.3)'); // Indigo
        lineGrad.addColorStop(1, 'rgba(168, 85, 247, 0.3)'); // Purple
        ctx.strokeStyle = lineGrad;
        
        // Draw lines
        ctx.beginPath();
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
                if (dist < 320) {
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                }
            }
        }
        ctx.stroke();
        
        // Draw nodes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)';
        ctx.lineWidth = 2;
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Add decorative tech crosses in corners
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.15)';
        ctx.lineWidth = 2;
        const offset = 80;
        const crosses = [
            {x: offset, y: offset}, 
            {x: width - offset, y: offset}, 
            {x: offset, y: height - offset}, 
            {x: width - offset, y: height - offset}
        ];
        crosses.forEach(c => {
            ctx.beginPath();
            ctx.moveTo(c.x - 12, c.y); ctx.lineTo(c.x + 12, c.y);
            ctx.moveTo(c.x, c.y - 12); ctx.lineTo(c.x, c.y + 12);
            ctx.stroke();
        });
        
        ctx.restore();
    }
    
    function renderBadge() {
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Base subtle linear gradient
        const baseGrad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        baseGrad.addColorStop(0, '#f8fafc');
        baseGrad.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Vibrant glows
        const grad1 = ctx.createRadialGradient(CANVAS_WIDTH * 0.8, -100, 0, CANVAS_WIDTH * 0.8, -100, 800);
        grad1.addColorStop(0, 'rgba(99, 102, 241, 0.25)'); // Indigo
        grad1.addColorStop(1, 'rgba(99, 102, 241, 0)');
        
        const grad2 = ctx.createRadialGradient(-100, CANVAS_HEIGHT * 0.4, 0, -100, CANVAS_HEIGHT * 0.4, 800);
        grad2.addColorStop(0, 'rgba(168, 85, 247, 0.2)'); // Purple
        grad2.addColorStop(1, 'rgba(168, 85, 247, 0)');
        
        const grad3 = ctx.createRadialGradient(CANVAS_WIDTH, CANVAS_HEIGHT, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 700);
        grad3.addColorStop(0, 'rgba(56, 189, 248, 0.2)'); // Sky Blue
        grad3.addColorStop(1, 'rgba(56, 189, 248, 0)');
        
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = grad3;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Neural network background
        drawNeuralNetwork(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Event Title Logos
        if (logoImage && ieeeLogoImage) {
            // NetSIP logo is typically wide, IEEE is more square
            // We'll set specific target widths and preserve aspect ratio
            const netsipWidth = 360;
            const netsipHeight = (logoImage.height / logoImage.width) * netsipWidth;
            
            const ieeeWidth = 220;
            const ieeeHeight = (ieeeLogoImage.height / ieeeLogoImage.width) * ieeeWidth;
            
            const spacing = 80;
            const totalWidth = netsipWidth + spacing + ieeeWidth;
            const startX = (CANVAS_WIDTH - totalWidth) / 2;
            
            // Vertically center them relative to a fixed Y coordinate
            const centerY = 160;
            
            // We use image smoothing for better quality when scaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(logoImage, startX, centerY - netsipHeight / 2, netsipWidth, netsipHeight);
            ctx.drawImage(ieeeLogoImage, startX + netsipWidth + spacing, centerY - ieeeHeight / 2, ieeeWidth, ieeeHeight);
            
        } else if (logoImage) {
            const logoWidth = 420;
            const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
            const logoX = (CANVAS_WIDTH - logoWidth) / 2;
            ctx.drawImage(logoImage, logoX, 100, logoWidth, logoHeight);
        }
        
        // Draw Photo area
        const photoY = 320;
        const photoSize = 360;
        const photoX = (CANVAS_WIDTH - photoSize) / 2;
        const photoRadius = photoSize / 2;
        const photoCenterY = photoY + photoRadius;
        
        ctx.save();
        
        // Outer glowing ring
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH / 2, photoCenterY, photoRadius + 25, 0, Math.PI * 2);
        const ringGrad = ctx.createLinearGradient(
            CANVAS_WIDTH / 2 - photoRadius, photoCenterY - photoRadius,
            CANVAS_WIDTH / 2 + photoRadius, photoCenterY + photoRadius
        );
        ringGrad.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        ringGrad.addColorStop(1, 'rgba(168, 85, 247, 0.3)');
        ctx.fillStyle = ringGrad;
        ctx.fill();
        
        // Photo border with shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 15;
        
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH / 2, photoCenterY, photoRadius + 8, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        // Reset shadow for stroke
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        // Premium gradient stroke
        const strokeGrad = ctx.createLinearGradient(
            CANVAS_WIDTH / 2 - photoRadius, photoCenterY - photoRadius,
            CANVAS_WIDTH / 2 + photoRadius, photoCenterY + photoRadius
        );
        strokeGrad.addColorStop(0, '#e0e7ff');
        strokeGrad.addColorStop(1, '#f3e8ff');
        ctx.lineWidth = 8;
        ctx.strokeStyle = strokeGrad;
        ctx.stroke();
        
        // Clip path for photo
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH / 2, photoCenterY, photoRadius, 0, Math.PI * 2);
        ctx.clip();
        
        if (uploadedImage) {
            ctx.drawImage(uploadedImage, photoX, photoY, photoSize, photoSize);
        } else {
            // Placeholder
            const placeholderGrad = ctx.createLinearGradient(photoX, photoY, photoX, photoY + photoSize);
            placeholderGrad.addColorStop(0, '#f8fafc');
            placeholderGrad.addColorStop(1, '#e2e8f0');
            ctx.fillStyle = placeholderGrad;
            ctx.fillRect(photoX, photoY, photoSize, photoSize);
            
            ctx.fillStyle = '#cbd5e1';
            
            // Draw person icon
            ctx.beginPath();
            ctx.arc(CANVAS_WIDTH / 2, photoCenterY - 35, 55, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(CANVAS_WIDTH / 2, photoCenterY + 115, 105, Math.PI, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
        
        // User Name
        const name = nameInput.value.trim() || 'Your Name';
        ctx.fillStyle = '#0f172a';
        ctx.font = '900 72px Inter'; // Slightly larger
        ctx.textAlign = 'center';
        
        // Auto-scale text if too long
        const maxTextWidth = 900;
        let fontSize = 72;
        let textWidth = ctx.measureText(name).width;
        
        while (textWidth > maxTextWidth && fontSize > 30) {
            fontSize -= 2;
            ctx.font = `900 ${fontSize}px Inter`;
            textWidth = ctx.measureText(name).width;
        }
        
        const position = positionInput.value.trim();
        let nameY = position ? 790 : 830;
        
        ctx.fillText(name, CANVAS_WIDTH / 2, nameY);
        
        // Position Description
        let roleY = nameY + 60;
        
        if (position) {
            ctx.fillStyle = '#64748b'; // Slate 500
            ctx.font = '600 32px Inter';
            ctx.fillText(position, CANVAS_WIDTH / 2, nameY + 55);
            roleY = nameY + 130;
        }
        
        // Role Badge
        const role = getRole();
        ctx.font = '900 36px Inter'; // Larger font
        const roleWidth = ctx.measureText(role.toUpperCase()).width + 140; // More padding for a bigger pill
        const roleHeight = 76; // Taller pill
        const roleX = (CANVAS_WIDTH - roleWidth) / 2;
        
        // Gradient background for role pill
        const roleGrad = ctx.createLinearGradient(roleX, roleY, roleX + roleWidth, roleY);
        roleGrad.addColorStop(0, '#4f46e5'); // Indigo 600
        roleGrad.addColorStop(1, '#7c3aed'); // Violet 600
        
        ctx.save();
        ctx.shadowColor = 'rgba(79, 70, 229, 0.4)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 8;
        
        ctx.fillStyle = roleGrad;
        roundRect(ctx, roleX, roleY, roleWidth, roleHeight, roleHeight / 2); // Fully rounded
        ctx.fill();
        ctx.restore();
        
        ctx.fillStyle = 'white';
        // Handle letterSpacing if supported, else rely on natural spacing
        if (ctx.letterSpacing !== undefined) {
            ctx.letterSpacing = '4px'; // Slightly more letter spacing
        }
        ctx.fillText(role.toUpperCase(), CANVAS_WIDTH / 2, roleY + 51); // Vertically center (76/2 + 36*0.35 = 38 + 12.6 = ~51)
        if (ctx.letterSpacing !== undefined) {
            ctx.letterSpacing = '0px';
        }
        
        // Footer section divider - make it a subtle gradient line
        const dividerGrad = ctx.createLinearGradient(150, 1130, CANVAS_WIDTH - 150, 1130);
        dividerGrad.addColorStop(0, 'rgba(226, 232, 240, 0)');
        dividerGrad.addColorStop(0.5, 'rgba(203, 213, 225, 1)');
        dividerGrad.addColorStop(1, 'rgba(226, 232, 240, 0)');
        
        ctx.beginPath();
        ctx.moveTo(150, 1130);
        ctx.lineTo(CANVAS_WIDTH - 150, 1130);
        ctx.strokeStyle = dividerGrad;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Event Details Footer
        const footerY = 1180;
        
        // Date
        ctx.textAlign = 'left';
        ctx.fillStyle = '#64748b'; // Slate 500
        ctx.font = '700 15px Inter';
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '2px';
        ctx.fillText('DATE', 120, footerY); // Pushed further out
        
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
        ctx.fillStyle = '#1e293b'; // Slate 800
        ctx.font = '800 24px Inter';
        ctx.fillText('24 - 25 July', 120, footerY + 35);
        ctx.fillStyle = '#4f46e5'; // Indigo accent
        ctx.fillText(' 2026', 120 + ctx.measureText('24 - 25 July').width, footerY + 35);
        
        // Venue
        ctx.textAlign = 'right';
        ctx.fillStyle = '#64748b';
        ctx.font = '700 15px Inter';
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '2px';
        ctx.fillText('VENUE', CANVAS_WIDTH - 120, footerY);
        
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
        ctx.fillStyle = '#1e293b';
        ctx.font = '800 24px Inter';
        ctx.fillText('NFSU, Gandhinagar', CANVAS_WIDTH - 120, footerY + 35);
        
        // Contact (Center)
        ctx.textAlign = 'center';
        ctx.fillStyle = '#64748b';
        ctx.font = '700 15px Inter';
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '2px';
        ctx.fillText('CONTACT', CANVAS_WIDTH / 2, footerY);
        
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
        ctx.fillStyle = '#1e293b';
        ctx.font = '700 20px Inter';
        ctx.fillText('ieeespsgs@gmail.com', CANVAS_WIDTH / 2, footerY + 35);
        
        // Add a premium border to the whole canvas (gradient)
        const borderGrad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        borderGrad.addColorStop(0, '#e0e7ff');
        borderGrad.addColorStop(0.5, '#f1f5f9');
        borderGrad.addColorStop(1, '#f3e8ff');
        
        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = 24;
        ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    
    // Helper function to draw rounded rectangles
    function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    
    function downloadBadge() {
        const name = nameInput.value.trim() || 'attendee';
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const filename = `netsip-2026-${slug}-badge.png`;
        
        // Convert canvas to data URL (synchronous to prevent popup blockers)
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});
