const { PDFDocument } = PDFLib;

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const mergeButton = document.getElementById('mergeButton');
    const downloadLink = document.getElementById('downloadLink');
    const compressDropZone = document.getElementById('compressDropZone');
    const compressInput = document.getElementById('compressInput');
    const compressButton = document.getElementById('compressButton');
    const compressDownloadLink = document.getElementById('compressDownloadLink');
    const compressPreview = document.getElementById('compressPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const imageDropZone = document.getElementById('imageDropZone');
    const imageInput = document.getElementById('imageInput');
    const cropCanvas = document.getElementById('cropCanvas');
    const cropButton = document.getElementById('cropButton');
    const passportSize = document.getElementById('passportSize');
    const photoCount = document.getElementById('photoCount');
    const outputFormat = document.getElementById('outputFormat');
    const convertButton = document.getElementById('convertButton');
    const passportDownloadLink = document.getElementById('passportDownloadLink');
    const adminButton = document.getElementById('adminButton');
    const adminModal = document.getElementById('adminModal');
    const closeModal = document.getElementById('closeModal');
    const lastLogin = document.getElementById('lastLogin');
    const userList = document.getElementById('userList');
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const userPanel = document.getElementById('userPanel');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const logoutButton = document.getElementById('logoutButton');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const regUsername = document.getElementById('regUsername');
    const regPassword = document.getElementById('regPassword');
    const userNameDisplay = document.getElementById('userNameDisplay');

    let pdfFiles = [];
    let compressFile = null;
    let imageFile = null;
    let croppedImage = null;
    let users = { 'admin': { password: 'admin123', role: 'admin' } };
    let currentUser = null;

    // PDF Merge Handling
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        handlePdfFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => handlePdfFiles(fileInput.files));

    function handlePdfFiles(selectedFiles) {
        pdfFiles = [...pdfFiles, ...selectedFiles].filter(file => file.type === 'application/pdf');
        updateFileList();
        mergeButton.disabled = pdfFiles.length < 2;
    }

    function updateFileList() {
        fileList.innerHTML = '';
        pdfFiles.forEach((file, index) => {
            const div = document.createElement('div');
            div.textContent = `${index + 1}. ${file.name}`;
            fileList.appendChild(div);
        });
    }

    mergeButton.addEventListener('click', async () => {
        if (pdfFiles.length < 2) return;
        const mergedPdf = await PDFDocument.create();
        for (const file of pdfFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }
        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = 'merged.pdf';
        downloadLink.textContent = 'Download Merged PDF';
        downloadLink.style.display = 'block';
    });

    // PDF Compression Handling
    compressDropZone.addEventListener('click', () => compressInput.click());
    compressDropZone.addEventListener('dragover', (e) => e.preventDefault());
    compressDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        handleCompressFile(e.dataTransfer.files[0]);
    });
    compressInput.addEventListener('change', () => handleCompressFile(compressInput.files[0]));

    function handleCompressFile(file) {
        if (file && file.type === 'application/pdf') {
            compressFile = file;
            compressButton.disabled = false;
            compressDropZone.textContent = `Selected: ${file.name}`;
            originalSize.textContent = formatSize(file.size);
            compressPreview.style.display = 'block';
            compressedSize.textContent = 'Calculating...';
        }
    }

    compressButton.addEventListener('click', async () => {
        if (!compressFile) return;

        const arrayBuffer = await compressFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        // Basic compression: Re-save with minimal optimizations
        const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: false });
        
        const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        // Update preview with compressed size
        compressedSize.textContent = formatSize(compressedPdfBytes.length);
        
        compressDownloadLink.href = url;
        compressDownloadLink.download = 'compressed.pdf';
        compressDownloadLink.textContent = 'Download Compressed PDF';
        compressDownloadLink.style.display = 'block';
    });

    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    // Passport Photo Handling
    imageDropZone.addEventListener('click', () => imageInput.click());
    imageDropZone.addEventListener('dragover', (e) => e.preventDefault());
    imageDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        handleImageFile(e.dataTransfer.files[0]);
    });
    imageInput.addEventListener('change', () => handleImageFile(imageInput.files[0]));

    function handleImageFile(file) {
        if (file && file.type.startsWith('image/')) {
            imageFile = file;
            convertButton.disabled = false;
            imageDropZone.textContent = `Selected: ${file.name}`;
            showCropCanvas(file);
        }
    }

    function showCropCanvas(file) {
        const ctx = cropCanvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            cropCanvas.width = img.width;
            cropCanvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            cropCanvas.style.display = 'block';
            cropButton.style.display = 'block';
        };
        img.src = URL.createObjectURL(file);
    }

    cropButton.addEventListener('click', () => {
        const ctx = cropCanvas.getContext('2d');
        const size = Math.min(cropCanvas.width, cropCanvas.height);
        const x = (cropCanvas.width - size) / 2;
        const y = (cropCanvas.height - size) / 2;
        croppedImage = ctx.getImageData(x, y, size, size);
        cropCanvas.width = size;
        cropCanvas.height = size;
        ctx.putImageData(croppedImage, 0, 0);
    });

    convertButton.addEventListener('click', async () => {
        if (!imageFile && !croppedImage) return;

        const format = outputFormat.value;
        const count = parseInt(photoCount.value);
        const sizes = {
            india: { width: 3.5 * 28.35, height: 4.5 * 28.35 },
            us: { width: 2 * 72, height: 2 * 72 },
            uk: { width: 3.5 * 28.35, height: 4.5 * 28.35 }
        };
        const selectedSize = sizes[passportSize.value];

        if (format === 'pdf') {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([selectedSize.width * count, selectedSize.height]);
            const imgData = croppedImage ? cropCanvas.toDataURL('image/png') : await loadImageAsDataUrl(imageFile);
            const img = await (imgData.includes('png') ? pdfDoc.embedPng(imgData) : pdfDoc.embedJpg(imgData));
            const scale = Math.min(selectedSize.width / img.width, selectedSize.height / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;

            for (let i = 0; i < count; i++) {
                page.drawImage(img, {
                    x: i * selectedSize.width + (selectedSize.width - scaledWidth) / 2,
                    y: (selectedSize.height - scaledHeight) / 2,
                    width: scaledWidth,
                    height: scaledHeight
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            passportDownloadLink.href = url;
            passportDownloadLink.download = `passport_${passportSize.value}.pdf`;
        } else {
            const blob = await new Promise(resolve => cropCanvas.toBlob(resolve, `image/${format}`));
            const url = URL.createObjectURL(blob);
            passportDownloadLink.href = url;
            passportDownloadLink.download = `passport_${passportSize.value}.${format}`;
        }

        passportDownloadLink.textContent = `Download ${format.toUpperCase()}`;
        passportDownloadLink.style.display = 'block';
    });

    function loadImageAsDataUrl(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    }

    // User Login/Register Handling
    loginButton.addEventListener('click', () => {
        const user = username.value;
        const pass = password.value;
        if (users[user] && users[user].password === pass) {
            currentUser = user;
            loginSection.style.display = 'none';
            userPanel.style.display = 'block';
            userNameDisplay.textContent = user;
            if (user === 'admin') adminButton.style.display = 'block';
        } else {
            alert('Invalid credentials');
        }
    });

    registerButton.addEventListener('click', () => {
        const user = regUsername.value;
        const pass = regPassword.value;
        if (!users[user]) {
            users[user] = { password: pass, role: 'user' };
            alert('Registration successful! Please login.');
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        } else {
            alert('Username already exists');
        }
    });

    logoutButton.addEventListener('click', () => {
        currentUser = null;
        userPanel.style.display = 'none';
        loginSection.style.display = 'block';
        adminButton.style.display = 'none';
    });

    showRegister.addEventListener('click', () => {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });

    showLogin.addEventListener('click', () => {
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    // Admin Panel Handling
    adminButton.style.display = 'none';
    adminButton.addEventListener('click', () => {
        adminModal.style.display = 'block';
        lastLogin.textContent = new Date().toLocaleString();
        userList.innerHTML = '';
        for (const [user, data] of Object.entries(users)) {
            const li = document.createElement('li');
            li.textContent = `${user} - ${data.role}`;
            userList.appendChild(li);
        }
    });

    closeModal.addEventListener('click', () => adminModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === adminModal) adminModal.style.display = 'none';
    });
});
