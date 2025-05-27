document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        themeToggle.querySelector('i').classList.toggle('fa-moon');
        themeToggle.querySelector('i').classList.toggle('fa-sun');
    });

    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('hidden'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.remove('hidden');
        });
    });

    // Image Generator
    const imageForm = document.getElementById('image-form');
    const promptInput = document.getElementById('prompt-input');
    const styleSelect = document.getElementById('style-select');
    const generateBtn = document.getElementById('generate-btn');
    const surpriseBtn = document.getElementById('surprise-btn');
    const imageGallery = document.getElementById('image-gallery');
    const historyGallery = document.getElementById('history-gallery');
    let history = JSON.parse(localStorage.getItem('imageHistory')) || [];

    const randomPrompts = [
        "A futuristic city at night with neon lights",
        "A serene forest with magical creatures",
        "An anime-style warrior in a desert",
        "A 3D render of a glowing crystal cave"
    ];

    surpriseBtn.addEventListener('click', () => {
        promptInput.value = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    });

    imageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        generateBtn.classList.add('loading');
        generateBtn.disabled = true;

        const prompt = promptInput.value;
        const style = styleSelect.value;

        // Mock Clipdrop API call (replace with actual API integration)
        try {
            // Placeholder for Clipdrop API
            // const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
            //     method: 'POST',
            //     headers: { 'x-api-key': 'YOUR_CLIPDROP_API_KEY' },
            //     body: JSON.stringify({ prompt, style })
            // });
            // const imageUrl = await response.json().image_url;

            // Mock response
            const imageUrl = 'https://via.placeholder.com/300?text=AI+Generated+Image';
            const imageCard = document.createElement('div');
            imageCard.classList.add('fade-in', 'relative');
            imageCard.innerHTML = `
                <img src="${imageUrl}" alt="${prompt}" class="w-full h-64 object-cover rounded-lg">
                <div class="absolute bottom-2 right-2 flex space-x-2">
                    <button class="download-btn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Download</button>
                    <button class="regenerate-btn px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">Regenerate</button>
                </div>
            `;
            imageGallery.prepend(imageCard);

            // Add to history
            history.unshift({ prompt, style, imageUrl });
            localStorage.setItem('imageHistory', JSON.stringify(history));
            updateHistory();

            // Download button
            imageCard.querySelector('.download-btn').addEventListener('click', () => {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = 'generated-image.png';
                link.click();
            });

            // Regenerate button
            imageCard.querySelector('.regenerate-btn').addEventListener('click', () => {
                promptInput.value = prompt;
                styleSelect.value = style;
                imageForm.dispatchEvent(new Event('submit'));
            });
        } catch (error) {
            console.error('Error generating image:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
        }
    });

    function updateHistory() {
        historyGallery.innerHTML = '';
        history.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('fade-in');
            card.innerHTML = `<img src="${item.imageUrl}" alt="${item.prompt}" class="w-full h-32 object-cover rounded-lg">`;
            historyGallery.appendChild(card);
        });
    }
    updateHistory();

    // Meta Generator
    document.getElementById('generate-meta-btn').addEventListener('click', () => {
        const input = document.getElementById('meta-input').value;
        const keywords = input.split(' ').slice(0, 10).join(', ');
        const description = input.substring(0, 160);
        const result = `
            <div class="fade-in">
                <p><strong>Keywords (max 10):</strong> ${keywords}</p>
                <p><strong>Description (max 160 chars):</strong> ${description}</p>
                <button class="download-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2">Download Meta Tags</button>
            </div>
        `;
        document.getElementById('meta-result').innerHTML = result;
        document.querySelector('.download-btn').addEventListener('click', () => {
            const blob = new Blob([`<meta name="keywords" content="${keywords}">\n<meta name="description" content="${description}">`], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'meta-tags.html';
            link.click();
        });
    });

    // Favicon Generator
    document.getElementById('generate-favicon-btn').addEventListener('click', () => {
        const file = document.getElementById('favicon-upload').files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const manifest = {
                name: 'AI Art & SEO Suite',
                icons: [{ src: url, sizes: '192x192', type: file.type }]
            };
            const result = `
                <div class="fade-in">
                    <img src="${url}" class="w-16 h-16">
                    <p>Favicon and manifest generated!</p>
                    <button class="download-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2">Download Manifest</button>
                </div>
            `;
            document.getElementById('favicon-result').innerHTML = result;
            document.querySelector('.download-btn').addEventListener('click', () => {
                const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'manifest.json';
                link.click();
            });
        }
    });

    // Logo Generator
    document.getElementById('generate-logo-btn').addEventListener('click', () => {
        const text = document.getElementById('logo-text').value;
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(0, 0, 200, 100);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(text, 10, 50);
        const url = canvas.toDataURL('image/png');
        const result = `
            <div class="fade-in">
                <img src="${url}" class="w-32">
                <button class="download-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2">Download Logo</button>
            </div>
        `;
        document.getElementById('logo-result').innerHTML = result;
        document.querySelector('.download-btn').addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = url;
            link.download = 'logo.png';
            link.click();
        });
    });

    // Color Checker
    document.getElementById('check-color-btn').addEventListener('click', () => {
        const bgColor = document.getElementById('bg-color').value;
        const fgColor = document.getElementById('fg-color').value;
        const result = `
            <div class="fade-in">
                <div class="w-32 h-16" style="background-color: ${bgColor}; color: ${fgColor};">Sample Text</div>
                <p>Background: ${bgColor}, Foreground: ${fgColor}</p>
            </div>
        `;
        document.getElementById('color-result').innerHTML = result;
    });

    // Backlinks Checker (Mock)
    document.getElementById('check-backlinks-btn').addEventListener('click', () => {
        const url = document.getElementById('backlinks-url').value;
        const result = `
            <div class="fade-in">
                <p>Mock backlinks for ${url}: example.com, test.com</p>
            </div>
        `;
        document.getElementById('backlinks-result').innerHTML = result;
    });

    // Open Graph Checker
    document.getElementById('check-og-btn').addEventListener('click', () => {
        const url = document.getElementById('og-url').value;
        const ogTags = `
            <meta property="og:title" content="Sample Title">
            <meta property="og:description" content="Sample Description">
            <meta property="og:image" content="https://via.placeholder.com/300">
            <meta property="og:url" content="${url}">
        `;
        const result = `
            <div class="fade-in">
                <p>Generated Open Graph Tags:</p>
                <pre>${ogTags}</pre>
                <button class="download-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2">Download OG Tags</button>
            </div>
        `;
        document.getElementById('og-result').innerHTML = result;
        document.querySelector('.download-btn').addEventListener('clip', () => {
            const blob = new Blob([ogTags], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'og-tags.html';
            link.click();
        });
    });

    // Sitemap Generator
    document.getElementById('generate-sitemap-btn').addEventListener('click', () => {
        const url = document.getElementById('sitemap-url').value;
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
    </url>
</urlset>`;
        const result = `
            <div class="fade-in">
                <pre>${sitemap}</pre>
                <button class="download-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2">Download Sitemap</button>
            </div>
        `;
        document.getElementById('sitemap-result').innerHTML = result;
        document.querySelector('.download-btn').addEventListener('click', () => {
            const blob = new Blob([sitemap], { type: 'text/xml' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'sitemap.xml';
            link.click();
        });
    });

    // Word to PDF
    document.getElementById('convert-word-btn').addEventListener('click', () => {
        const text = document.getElementById('word-input').value;
        const result = `
            <div class="fade-in">
                <p>PDF conversion placeholder for: ${text.substring(0, 50)}...</p>
                <button class="download-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2">Download PDF</button>
            </div>
        `;
        document.getElementById('word-result').innerHTML = result;
        document.querySelector('.download-btn').addEventListener('click', () => {
            alert('PDF conversion requires a library like jsPDF for full functionality.');
        });
    });

    // Thumbnail Generator
    document.getElementById('generate-thumbnail-btn').addEventListener('click', () => {
        const file = document.getElementById('thumbnail-upload').files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const result = `
                <div class="fade-in">
                    <img src="${url}" class="w-32">
                    <button class="download-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2">Download Thumbnail</button>
                </div>
            `;
            document.getElementById('thumbnail-result').innerHTML = result;
            document.querySelector('.download-btn').addEventListener('click', () => {
                const link = document.createElement('a');
                link.href = url;
                link.download = 'thumbnail.png';
                link.click();
            });
        }
    });

    // Title Creator
    document.getElementById('generate-title-btn').addEventListener('click', () => {
        const input = document.getElementById('title-input').value;
        const title = input.substring(0, 60);
        const result = `
            <div class="fade-in">
                <p><strong>Title (max 60 chars):</strong> ${title}</p>
                <button class="download-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2">Download Title</button>
            </div>
        `;
        document.getElementById('title-result').innerHTML = result;
        document.querySelector('.download-btn').addEventListener('click', () => {
            const blob = new Blob([title], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'title.txt';
            link.click();
        });
    });

    // Plagiarism Checker (Mock)
    document.getElementById('check-plagiarism-btn').addEventListener('click', () => {
        const text = document.getElementById('plagiarism-input').value;
        const result = `
            <div class="fade-in">
                <p>No plagiarism detected for: ${text.substring(0, 50)}...</p>
                <p>Suggestion: Your text is original!</p>
            </div>
        `;
        document.getElementById('plagiarism-result').innerHTML = result;
    });

    // Grammar Checker (Basic)
    document.getElementById('check-grammar-btn').addEventListener('click', () => {
        const text = document.getElementById('grammar-input').value;
        const errors = text.split('.').length > 1 ? 'Possible run-on sentence detected.' : 'No major grammar issues found.';
        const result = `
            <div class="fade-in">
                <p>${errors}</p>
                <p>Paragraph check: ${text.split('\n').length} paragraphs detected.</p>
            </div>
        `;
        document.getElementById('grammar-result').innerHTML = result;
    });
});