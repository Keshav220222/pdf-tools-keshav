const { PDFDocument } = PDFLib;

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const mergeDropZone = document.getElementById('mergeDropZone');
    const mergeInput = document.getElementById('mergeInput');
    const mergeFileList = document.getElementById('mergeFileList');
    const mergeButton = document.getElementById('mergeButton');
    const mergeDownloadLink = document.getElementById('mergeDownloadLink');
    const compressDropZone = document.getElementById('compressDropZone');
    const compressInput = document.getElementById('compressInput');
    const compressButton = document.getElementById('compressButton');
    const compressDownloadLink = document.getElementById('compressDownloadLink');
    const compressPreview = document.getElementById('compressPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const splitDropZone = document.getElementById('splitDropZone');
    const splitInput = document.getElementById('splitInput');
    const splitPage = document.getElementById('splitPage');
    const splitButton = document.getElementById('splitButton');
    const splitDownloadLink = document.getElementById('splitDownloadLink');
    const rotateDropZone = document.getElementById('rotateDropZone');
    const rotateInput = document.getElementById('rotateInput');
    const rotateAngle = document.getElementById('rotateAngle');
    const rotateButton = document.getElementById('rotateButton');
    const rotateDownloadLink = document.getElementById('rotateDownloadLink');
    const jpgToPdfDropZone = document.getElementById('jpgToPdfDropZone');
    const jpgToPdfInput = document.getElementById('jpgToPdfInput');
    const jpgToPdfFileList = document.getElementById('jpgToPdfFileList');
    const jpgToPdfButton = document.getElementById('jpgToPdfButton');
    const jpgToPdfDownloadLink = document.getElementById('jpgToPdfDownloadLink');
    const pdfToJpgDropZone = document.getElementById('pdfToJpgDropZone');
    const pdfToJpgInput = document.getElementById('pdfToJpgInput');
    const pdfToJpgButton = document.getElementById('pdfToJpgButton');
    const pdfToJpgDownloadLink = document.getElementById('pdfToJpgDownloadLink');
    const imageDropZone = document.getElementById('imageDropZone');
    const imageInput = document.getElementById('imageInput');
    const cropCanvas = document.getElementById('cropCanvas');
    const cropButton = document.getElementById('cropButton');
    const passportSize = document.getElementById('passportSize');
    const photoCount = document.getElementById('photoCount');
    const outputFormat = document.getElementById('outputFormat');
    const convertButton = document.getElementById('convertButton');
    const passportDownloadLink = document.getElementById('passportDownloadLink');
    const adminToggle = document.getElementById('adminToggle');
    const adminPassword = document.getElementById('adminPassword');
    const adminModal = document.getElementById('adminModal');
    const closeModal = document.getElementById('closeModal');
    const lastLogin = document.getElementById('lastLogin');

    let mergeFiles = [];
    let compressFile = null;
    let splitFile = null;
    let rotateFile = null;
    let jpgToPdfFiles = [];
    let pdfToJpgFile = null;
    let imageFile = null;
    let croppedImage = null;

    // Merge PDFs
    mergeDropZone.addEventListener('click', () => mergeInput.click());
    mergeDropZone.addEventListener('dragover', (e) => e.preventDefault());
    mergeDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        handleMergeFiles(e.dataTransfer.files);
    });
    mergeInput.addEventListener('change', () => handleMergeFiles(mergeInput.files));

    function handleMergeFiles(files) {
        mergeFiles = [...mergeFiles, ...files].filter(file => file.type === 'application/pdf');
        updateMergeFileList();
        mergeButton.disabled = mergeFiles.length < 2;
    }

    function updateMergeFileList() {
        mergeFileList.innerHTML = mergeFiles.map((file, i) => `${i + 1}. ${file.name}`).join('<br>');
    }

    mergeButton.addEventListener('click', async () => {
        const mergedPdf = await PDFDocument.create();
        for (const file of mergeFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }
        const pdfBytes = await mergedPdf.save();
        downloadFile(pdfBytes, 'merged.pdf', mergeDownloadLink);
    });

    // Compress PDF
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
        const arrayBuffer = await compressFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: false });
        compressedSize.textContent = formatSize(compressedPdfBytes.length);
        downloadFile(compressedPdfBytes, 'compressed.pdf', compressDownloadLink);
    });

    // Split PDF
    splitDropZone.addEventListener('click', () => splitInput.click());
    splitDropZone.addEventListener('dragover', (e) => e.preventDefault());
    splitDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        handleSplitFile(e.dataTransfer.files[0]);
    });
    splitInput.addEventListener('change', () => handleSplitFile(splitInput.files[0]));

    function handleSplitFile(file) {
        if (file && file.type === 'application/pdf') {
            splitFile = file;
            splitButton.disabled = false;
            splitDropZone.textContent = `Selected: ${file.name}`;
        }
    }

    splitButton.addEventListener('click', async () => {
        const arrayBuffer = await splitFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        const splitAt = parseInt(splitPage.value) || 1;
        if (splitAt < 1 || splitAt >= pageCount) return alert('Invalid split page');

        const pdf1 = await PDFDocument.create();
        const pdf2 = await PDFDocument.create();
        const pages = await pdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.slice(0, splitAt).forEach(page => pdf1.addPage(page));
        pages.slice(splitAt).forEach(page => pdf2.addPage(page));

        const pdf1Bytes = await pdf1.save();
        const pdf2Bytes = await pdf2.save();
        const zip = new Blob([pdf1Bytes, pdf2Bytes], { type: 'application/zip' });
        const url = URL.createObjectURL(zip);
        splitDownloadLink.href = url;
        splitDownloadLink.download = 'split_pdfs.zip';
        splitDownloadLink.textContent = 'Download Split PDFs';
        splitDownloadLink.style.display = 'block';
    });

    // Rotate PDF
    rotateDropZone.addEventListener('click', () => rotateInput.click());
    rotateDropZone.addEventListener('dragover', (e) => e.preventDefault());
    rotateDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        handleRotateFile(e.dataTransfer.files[0]);
    });
    rotateInput.addEventListener('change', () => handleRotateFile(rotateInput.files[0]));

    function handleRotateFile(file) {
        if (file && file.type === 'application/pdf') {
            rotateFile = file;
            rotateButton.disabled = false;
            rotateDropZone.textContent = `Selected: ${file.name}`;
        }
    }

    rotateButton.addEventListener('click', async () => {
        const arrayBuffer = await rotateFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const angle = parseInt(rotateAngle.value);
        pdfDoc.getPages().forEach(page => page.setRotation((page.getRotation() + angle) % 360));
        const pdfBytes = await pdfDoc.save();
        downloadFile(pdfBytes, 'rotated.pdf', rotateDownloadLink);
    });

    // JPG to PDF
    jpgToPdfDropZone.addEventListener('click', () => jpgToPdfInput.click());
    jpgToPdfDropZone.addEventListener('dragover', (e) => e.preventDefault());
    jpgToPdfDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        handleJpgToPdfFiles(e.dataTransfer.files);
    });
    jpgToPdfInput.addEventListener('change', () => handleJpgToPdfFiles(jpgToPdfInput.files));

    function handleJpgToPdfFiles(files) {
        jpgToPdfFiles = [...jpgToPdfFiles, ...files].filter(file => file.type.startsWith('image/'));
        updateJpgToPdfFileList();
        jpgToPdfButton.disabled = jpgToPdfFiles.length === 0;
    }

    function updateJpgToPdfFileList() {
        jpgToPdfFileList.innerHTML = jpgToPdfFiles.map((file, i) => `${i + 1}. ${file.name}`).join('<br>');
    }

    jpgToPdfButton.addEventListener('click', async () => {
        const pdfDoc = await PDFDocument.create();
        for (const file of jpgToPdfFiles) {
            const imgData = await loadImageAsDataUrl(file);
            const img = await (file.type === 'image/png' ? pdfDoc.embedPng(imgData) : pdfDoc.embedJpg(imgData));
            const page = pdfDoc.addPage([img.width, img.height]);
            page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        const pdfBytes = await pdfDoc.save();
        downloadFile(pdfBytes, 'images_to_pdf.pdf', jpgToPdfDownloadLink);
    });

    // PDF to JPG
    pdfToJpgDropZone.addEventListener('click', () => pdfToJpgInput.click());
    pdfToJpgDropZone.addEventListener('dragover', (e) => e.preventDefault());
    pdfToJpgDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        handlePdfToJpgFile(e.dataTransfer.files[0]);
    });
    pdfToJpgInput.addEventListener('change', () => handlePdfToJpgFile(pdfToJpgInput.files[0]));

    function handlePdfToJpgFile(file) {
        if (file && file.type === 'application/pdf') {
            pdfToJpgFile = file;
            pdfToJpgButton.disabled = false;
            pdfToJpgDropZone.textContent = `Selected: ${file.name}`;
        }
    }

    pdfToJpgButton.addEventListener('click', async () => {
        const arrayBuffer = await pdfToJpgFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        const blobs = [];
        for (let i = 0; i < pages.length; i++) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = pages[i].getWidth();
            canvas.height = pages[i].getHeight();
            // Basic rendering (limited by pdf-lib in browser)
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
            blobs.push(blob);
        }
        const zip = new Blob(blobs, { type: 'application/zip' });
        const url = URL.createObjectURL(zip);
        pdfToJpgDownloadLink.href = url;
        pdfToJpgDownloadLink.download = 'pdf_to_jpgs.zip';
        pdfToJpgDownloadLink.textContent = 'Download JPGs';
        pdfToJpgDownloadLink.style.display = 'block';
    });

    // Passport Photo
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
            downloadFile(pdfBytes, `passport_${passportSize.value}.pdf`, passportDownloadLink);
        } else {
            const blob = await new Promise(resolve => cropCanvas.toBlob(resolve, `image/${format}`));
            const url = URL.createObjectURL(blob);
            passportDownloadLink.href = url;
            passportDownloadLink.download = `passport_${passportSize.value}.${format}`;
            passportDownloadLink.textContent = `Download ${format.toUpperCase()}`;
            passportDownloadLink.style.display = 'block';
        }
    });

    // Admin Panel
    adminToggle.addEventListener('click', () => {
        if (adminPassword.value === 'admin123') {
            adminModal.style.display = 'block';
            lastLogin.textContent = new Date().toLocaleString();
            adminPassword.value = '';
        } else {
            alert('Incorrect admin password');
        }
    });

    closeModal.addEventListener('click', () => adminModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === adminModal) adminModal.style.display = 'none';
    });

    // Utility Functions
    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    function downloadFile(bytes, filename, linkElement) {
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        linkElement.href = url;
        linkElement.download = filename;
        linkElement.textContent = `Download ${filename.split('.')[1].toUpperCase()}`;
        linkElement.style.display = 'block';
    }

    function loadImageAsDataUrl(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    }
});
