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

    let img3 = null;
    let img4 = null;
    let bannerImage = null;

    // QR Code — generated once and cached as an Image object
    let qrImage = null;

    function generateQRCode() {
        return new Promise((resolve) => {
            const container = document.getElementById('qr-container');
            container.innerHTML = ''; // Clear previous

            // qrcode.js renders a <canvas> (or <img>) into the container
            const qr = new QRCode(container, {
                text: 'https://ieeespsgs.org/',
                width: 400,
                height: 400,
                colorDark: '#0a1a3a',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H,
            });

            // qrcode.js renders asynchronously – poll until canvas/img appears
            const poll = setInterval(() => {
                const qrCanvas = container.querySelector('canvas');
                const qrImg = container.querySelector('img');
                const src = qrCanvas ? qrCanvas.toDataURL() : (qrImg ? qrImg.src : null);
                if (src && src !== 'data:,') {
                    clearInterval(poll);
                    const img = new Image();
                    img.onload = () => { qrImage = img; resolve(); };
                    img.src = src;
                }
            }, 50);
        });
    }

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

    const img3Obj = new Image();
    img3Obj.onload = () => {
        img3 = img3Obj;
        renderBadge();
    };
    img3Obj.src = 'logo3_clean.png';

    const img4Obj = new Image();
    img4Obj.onload = () => {
        img4 = img4Obj;
        renderBadge();
    };
    img4Obj.src = 'logo4_clean.png';

    // Combined logo banner (netsip26 (3).png) — exact reference layout
    const bannerObj = new Image();
    bannerObj.onload = () => {
        bannerImage = bannerObj;
        renderBadge();
    };
    bannerObj.src = 'netsip26%20(3).png';

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
        // Pre-generate the QR code so it's ready for first render
        await generateQRCode();
        renderBadge();
    }

    function drawNeuralNetwork(ctx, width, height) {
        ctx.save();

        // Draw some connected nodes (fixed coordinates to avoid jitter on redraw)
        const nodes = [
            { x: -50, y: 200 }, { x: 150, y: 100 }, { x: 350, y: -50 },
            { x: 80, y: 350 }, { x: 250, y: 250 }, { x: 450, y: 150 },
            { x: 650, y: 80 }, { x: 850, y: 150 }, { x: 1050, y: 50 },
            { x: 1150, y: 250 }, { x: 950, y: 350 }, { x: 750, y: 250 },
            { x: 550, y: 350 }, { x: 150, y: 550 }, { x: 350, y: 450 },
            { x: -50, y: 700 }, { x: 200, y: 750 }, { x: 400, y: 650 },
            { x: 600, y: 750 }, { x: 800, y: 550 }, { x: 950, y: 650 },
            { x: 1150, y: 750 }, { x: 1050, y: 900 }, { x: 850, y: 850 },
            { x: 700, y: 950 }, { x: 500, y: 900 }, { x: 250, y: 950 },
            { x: 50, y: 1100 }, { x: 350, y: 1150 }, { x: 600, y: 1200 },
            { x: 800, y: 1100 }, { x: 1000, y: 1250 }, { x: 1200, y: 1050 }
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
            { x: offset, y: offset },
            { x: width - offset, y: offset },
            { x: offset, y: height - offset },
            { x: width - offset, y: height - offset }
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

        // Event Title Logos — use combined banner strip for exact reference layout
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (bannerImage) {
            // Draw the pre-composed banner (netsip26 (3).png) centered at top
            const bannerW = CANVAS_WIDTH - 80; // 40px padding each side
            const bannerH = (bannerImage.height / bannerImage.width) * bannerW;
            const bannerX = 40;
            const bannerY = (320 - bannerH) / 2; // vertically center in top 320px zone

            ctx.globalCompositeOperation = 'multiply';
            ctx.drawImage(bannerImage, bannerX, bannerY, bannerW, bannerH);
            ctx.globalCompositeOperation = 'source-over';
        } else if (logoImage && ieeeLogoImage && img3 && img4) {
            // Fallback: draw 4 logos individually
            const w1 = 260;
            const h1 = (logoImage.height / logoImage.width) * w1;
            const w2 = 140;
            const h2 = (ieeeLogoImage.height / ieeeLogoImage.width) * w2;
            const w3 = 280;
            const h3 = (img3.height / img3.width) * w3;
            const w4 = 180;
            const h4 = (img4.height / img4.width) * w4;

            const spacing = 40;
            const totalWidth = w1 + w2 + w3 + w4 + (spacing * 3);
            const startX = (CANVAS_WIDTH - totalWidth) / 2;
            const centerY = 160;

            ctx.globalCompositeOperation = 'multiply';
            let currentX = startX;
            ctx.drawImage(logoImage, currentX, centerY - h1 / 2, w1, h1);
            currentX += w1 + spacing;
            ctx.drawImage(ieeeLogoImage, currentX, centerY - h2 / 2, w2, h2);
            currentX += w2 + spacing;
            ctx.drawImage(img3, currentX, centerY - h3 / 2, w3, h3);
            currentX += w3 + spacing;
            ctx.drawImage(img4, currentX, centerY - h4 / 2, w4, h4);
            ctx.globalCompositeOperation = 'source-over';
        } else if (logoImage && ieeeLogoImage) {
            // Minimal fallback
            const netsipWidth = 360;
            const netsipHeight = (logoImage.height / logoImage.width) * netsipWidth;
            const ieeeWidth = 220;
            const ieeeHeight = (ieeeLogoImage.height / ieeeLogoImage.width) * ieeeWidth;
            const spacing = 80;
            const totalWidth = netsipWidth + spacing + ieeeWidth;
            const startX = (CANVAS_WIDTH - totalWidth) / 2;
            const centerY = 160;

            ctx.globalCompositeOperation = 'multiply';
            ctx.drawImage(logoImage, startX, centerY - netsipHeight / 2, netsipWidth, netsipHeight);
            ctx.drawImage(ieeeLogoImage, startX + netsipWidth + spacing, centerY - ieeeHeight / 2, ieeeWidth, ieeeHeight);
            ctx.globalCompositeOperation = 'source-over';
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
        const dividerY = 1060;
        const dividerGrad = ctx.createLinearGradient(80, dividerY, CANVAS_WIDTH - 80, dividerY);
        dividerGrad.addColorStop(0, 'rgba(226, 232, 240, 0)');
        dividerGrad.addColorStop(0.5, 'rgba(203, 213, 225, 1)');
        dividerGrad.addColorStop(1, 'rgba(226, 232, 240, 0)');

        ctx.beginPath();
        ctx.moveTo(80, dividerY);
        ctx.lineTo(CANVAS_WIDTH - 80, dividerY);
        ctx.strokeStyle = dividerGrad;
        ctx.lineWidth = 2;
        ctx.stroke();

        // ── QR Code Section ──────────────────────────────────────────────────
        // QR sits bottom-center inside footer strip (1060-1350)
        const qrSize = 160;           // QR image size on canvas
        const qrPad = 14;             // padding inside white card
        const cardW = qrSize + qrPad * 2;   // 188
        const cardH = qrSize + qrPad * 2;   // 188
        const labelH = 42;            // dark SCAN ME bar
        const totalQRH = labelH + cardH;    // 230
        const qrCenterX = CANVAS_WIDTH / 2;
        // Center the QR block in the footer zone (1060..1350 = 290px tall)
        const qrTopY = 1060 + (290 - totalQRH) / 2;  // ~1090

        if (qrImage) {
            ctx.save();

            // ── SCAN ME label (rounded top corners) ──
            const labelW = cardW;
            const labelX = qrCenterX - labelW / 2;
            const labelY = qrTopY;

            ctx.shadowColor = 'rgba(0,0,0,0.20)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 5;

            ctx.fillStyle = '#0a1a3a';
            ctx.beginPath();
            ctx.moveTo(labelX + 10, labelY);
            ctx.lineTo(labelX + labelW - 10, labelY);
            ctx.quadraticCurveTo(labelX + labelW, labelY, labelX + labelW, labelY + 10);
            ctx.lineTo(labelX + labelW, labelY + labelH);
            ctx.lineTo(labelX, labelY + labelH);
            ctx.lineTo(labelX, labelY + 10);
            ctx.quadraticCurveTo(labelX, labelY, labelX + 10, labelY);
            ctx.closePath();
            ctx.fill();

            ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

            ctx.fillStyle = '#ffffff';
            ctx.font = '800 18px Inter';
            ctx.textAlign = 'center';
            if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '3px';
            ctx.fillText('SCAN ME', qrCenterX, labelY + labelH - 13);
            if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';

            // ── White card (rounded bottom corners) ──
            const cardX = qrCenterX - cardW / 2;
            const cardY = labelY + labelH;

            ctx.shadowColor = 'rgba(0,0,0,0.12)';
            ctx.shadowBlur = 16;
            ctx.shadowOffsetY = 4;

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(cardX, cardY);
            ctx.lineTo(cardX + cardW, cardY);
            ctx.lineTo(cardX + cardW, cardY + cardH - 10);
            ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - 10, cardY + cardH);
            ctx.lineTo(cardX + 10, cardY + cardH);
            ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - 10);
            ctx.lineTo(cardX, cardY);
            ctx.closePath();
            ctx.fill();

            ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

            // ── Draw QR image ──
            ctx.drawImage(qrImage, cardX + qrPad, cardY + qrPad, qrSize, qrSize);

            ctx.restore();
        }

        // ── Date (bottom-left) ──
        const footerY = 1230;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#64748b';
        ctx.font = '700 14px Inter';
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '2px';
        ctx.fillText('DATE', 80, footerY);
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
        ctx.fillStyle = '#1e293b';
        ctx.font = '800 22px Inter';
        ctx.fillText('24 - 25 July', 80, footerY + 32);
        ctx.fillStyle = '#4f46e5';
        ctx.fillText(' 2026', 80 + ctx.measureText('24 - 25 July').width, footerY + 32);

        // ── Venue (bottom-right) ──
        ctx.textAlign = 'right';
        ctx.fillStyle = '#64748b';
        ctx.font = '700 14px Inter';
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '2px';
        ctx.fillText('VENUE', CANVAS_WIDTH - 80, footerY);
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
        ctx.fillStyle = '#1e293b';
        ctx.font = '800 22px Inter';
        ctx.fillText('NFSU, Gandhinagar', CANVAS_WIDTH - 80, footerY + 32);

        // ── Website (bottom-center small) ──
        ctx.textAlign = 'center';
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 18px Inter';
        ctx.fillText('ieeespsgs.org', CANVAS_WIDTH / 2, 1310);

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
