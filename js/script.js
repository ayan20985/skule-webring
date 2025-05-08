// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    // Check for saved theme preference or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Function to update icon based on theme
    function updateIcon(theme) {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        
        // Set the appropriate icon based on theme
        const iconPath = theme === 'dark' ? 'img/icon-dark.svg' : 'img/icon.svg';
        
        // Update the example widget in the page
        const widgetIconImg = document.getElementById('widget-demo-icon');
        if (widgetIconImg) {
            widgetIconImg.src = `${iconPath}?t=${timestamp}`;
        }
        
        // Update the homepage navigation widget
        const homepageWidgetIcon = document.getElementById('homepage-widget-icon');
        if (homepageWidgetIcon) {
            homepageWidgetIcon.src = `${iconPath}?t=${timestamp}`;
            console.log(`Theme changed to ${theme}, icons updated to: ${iconPath}`);
        }
        
        // Update all default badges
        const defaultBadgePath = theme === 'dark' ? 'badges/default-badge-dark.png' : 'badges/default-badge.png';
        const defaultBadges = document.querySelectorAll('.member-badge[src^="badges/default-badge"]');
        defaultBadges.forEach(badge => {
            badge.src = `${defaultBadgePath}?t=${timestamp}`;
        });
        
        // Update pixel art background colors based on theme
        if (window.pixelArtParams) {
            if (theme === 'dark') {
                window.pixelArtParams.waveColor = [0.35, 0.35, 0.35]; // Brighter gray for dark theme
            } else {
                window.pixelArtParams.waveColor = [0.85, 0.85, 0.85]; // Softer gray for light theme
            }
        }
    }
    
    // Apply theme based on saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.setAttribute('data-theme', 'dark');
        updateIcon('dark');
    } else {
        updateIcon('light');
    }
    
    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateIcon(currentTheme);
    });
    
    // Preload badge images to ensure they're in the browser cache
    function preloadBadgeImages() {
        // Preload both light and dark default badges
        const defaultBadges = ['badges/default-badge.png', 'badges/default-badge-dark.png'];
        
        // Preload all member badges
        const memberBadges = members.map(member => member.badge).filter(badge => badge);
        
        // Combine both arrays and remove duplicates
        const allBadges = [...new Set([...defaultBadges, ...memberBadges])];
        
        // Create image objects to preload
        allBadges.forEach(badgeSrc => {
            const img = new Image();
            img.src = badgeSrc;
        });
    }
    
    // Preload badges on page load
    preloadBadgeImages();
    
    // Handle report broken link button
    const reportLinkBtn = document.getElementById('report-link');
    if (reportLinkBtn) {
        reportLinkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const issueUrl = "https://github.com/ayan20985/webring/issues/new";
            const issueTitle = encodeURIComponent("Broken Link Report");
            const issueBody = encodeURIComponent("## Broken Link Report\n\nPlease fill out the information below:\n\n* **Website URL**: [Enter the broken link here]\n* **Member Name**: [Enter member name if known]\n* **Issue Description**: [Describe the issue (e.g., site not loading, domain expired)]\n\nThank you for helping maintain the webring!");
            window.open(`${issueUrl}?title=${issueTitle}&body=${issueBody}`, '_blank');
        });
    }
    
    // Initialize the pixel art background
    initPixelArtBackground();
    
    // Initialize the webring
    initWebring();
});

// ========== Pixel Art Background ==========
// WebGL setup variables
let canvas, gl, program;
let quadBuffer;
let startTime;
let mousePosition = { x: 0, y: 0 };
let mouseActive = false; // Always false now that we've removed mouse effects
window.pixelArtParams = {
    pixelSize: 4,
    waveSpeed: 0.02,
    waveColor: [0.92, 0.92, 0.92], // Default to light theme color
    edgeFade: 0.4 // Controls how visible the pattern is in the center vs edges
};

// ========== Shader Source ==========
const vertexShaderSource = `
attribute vec2 position;
varying vec2 vUv;

void main() {
    vUv = 0.5 * (position + 1.0);
    gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShaderSource = `
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform vec3 waveColor;
uniform float pixelSize;
uniform vec2 mousePos;
uniform float mouseRadius;
uniform bool mouseActive;
uniform float edgeFade;

// Classic Perlin noise implementation
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0);
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

// Fractal Brownian Motion function
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 3.0;
    float amp = 0.3;
    
    for (int i = 0; i < 8; i++) {
        value += amplitude * abs(cnoise(p));
        p *= frequency;
        amplitude *= amp;
    }
    return value;
}

// Pattern function
float pattern(vec2 p) {
    vec2 p2 = p - time * waveSpeed;
    return fbm(p - fbm(p + fbm(p2)));
}

// Dithering function
float dither8x8(vec2 position, float brightness) {
    int x = int(mod(position.x, 8.0));
    int y = int(mod(position.y, 8.0));
    
    int index = x + y * 8;
    float limit = 0.0;
    
    if (x < 8) {
        if (index == 0) limit = 0.0;
        if (index == 1) limit = 48.0;
        if (index == 2) limit = 12.0;
        if (index == 3) limit = 60.0;
        if (index == 4) limit = 3.0;
        if (index == 5) limit = 51.0;
        if (index == 6) limit = 15.0;
        if (index == 7) limit = 63.0;
        if (index == 8) limit = 32.0;
        if (index == 9) limit = 16.0;
        if (index == 10) limit = 44.0;
        if (index == 11) limit = 28.0;
        if (index == 12) limit = 35.0;
        if (index == 13) limit = 19.0;
        if (index == 14) limit = 47.0;
        if (index == 15) limit = 31.0;
        if (index == 16) limit = 8.0;
        if (index == 17) limit = 56.0;
        if (index == 18) limit = 4.0;
        if (index == 19) limit = 52.0;
        if (index == 20) limit = 11.0;
        if (index == 21) limit = 59.0;
        if (index == 22) limit = 7.0;
        if (index == 23) limit = 55.0;
        if (index == 24) limit = 40.0;
        if (index == 25) limit = 24.0;
        if (index == 26) limit = 36.0;
        if (index == 27) limit = 20.0;
        if (index == 28) limit = 43.0;
        if (index == 29) limit = 27.0;
        if (index == 30) limit = 39.0;
        if (index == 31) limit = 23.0;
        if (index == 32) limit = 2.0;
        if (index == 33) limit = 50.0;
        if (index == 34) limit = 14.0;
        if (index == 35) limit = 62.0;
        if (index == 36) limit = 1.0;
        if (index == 37) limit = 49.0;
        if (index == 38) limit = 13.0;
        if (index == 39) limit = 61.0;
        if (index == 40) limit = 34.0;
        if (index == 41) limit = 18.0;
        if (index == 42) limit = 46.0;
        if (index == 43) limit = 30.0;
        if (index == 44) limit = 33.0;
        if (index == 45) limit = 17.0;
        if (index == 46) limit = 45.0;
        if (index == 47) limit = 29.0;
        if (index == 48) limit = 10.0;
        if (index == 49) limit = 58.0;
        if (index == 50) limit = 6.0;
        if (index == 51) limit = 54.0;
        if (index == 52) limit = 9.0;
        if (index == 53) limit = 57.0;
        if (index == 54) limit = 5.0;
        if (index == 55) limit = 53.0;
        if (index == 56) limit = 42.0;
        if (index == 57) limit = 26.0;
        if (index == 58) limit = 38.0;
        if (index == 59) limit = 22.0;
        if (index == 60) limit = 41.0;
        if (index == 61) limit = 25.0;
        if (index == 62) limit = 37.0;
        if (index == 63) limit = 21.0;
    }
    
    return brightness < limit / 64.0 ? 0.0 : 1.0;
}

void main() {
    // Apply pixelation by rounding to nearest pixel
    vec2 pixelated = floor(gl_FragCoord.xy / pixelSize) * pixelSize;
    vec2 uv = pixelated / resolution.xy;
    
    // Adjust aspect ratio
    uv = uv * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    
    // Calculate distance from center
    float distFromCenter = length(uv) * 0.75;
    
    // Calculate edge fade factor - more visible on edges, less in center
    float edgeFactor = smoothstep(0.0, 1.0, distFromCenter);
    
    // Apply edgeFade parameter
    edgeFactor = mix(edgeFade, 1.0, edgeFactor);
    
    // Calculate pattern value
    float f = pattern(uv) * edgeFactor; // Apply edge factor
    
    // Handle mouse interaction with improved fall-off effect
    if (mouseActive) {
        float dist = length(uv - mousePos);
        
        // Create an extended radius for the fall-off effect
        float extendedRadius = mouseRadius * 1.5;
        
        if (dist < extendedRadius) {
            // Inner core effect (stronger)
            float innerEffect = 0.0;
            if (dist < mouseRadius) {
                // Create a cubic curve for more natural fall-off within the core radius
                float t = dist / mouseRadius;
                innerEffect = 1.0 - (t * t * (3.0 - 2.0 * t));
                f -= innerEffect * 0.8;
            }
            
            // Outer fall-off effect (weaker, gradual transition)
            if (dist >= mouseRadius * 0.7 && dist < extendedRadius) {
                // Normalized distance in the fall-off region
                float fallOffT = (dist - mouseRadius * 0.7) / (extendedRadius - mouseRadius * 0.7);
                
                // Create smooth transition curve for fall-off
                float fallOffEffect = exp(-fallOffT * 3.0) * 0.6; // Exponential fall-off
                
                // Ring highlight effect at the boundary
                float ringEffect = smoothstep(mouseRadius * 0.8, mouseRadius, dist) * 
                                  smoothstep(mouseRadius, mouseRadius * 0.8, dist);
                
                // Combine effects - apply fall-off and add ring
                f -= fallOffEffect * (1.0 - fallOffT) * 0.6;
                f += ringEffect * 0.3 * (1.0 - fallOffT);
            }
        }
    }
    
    // Apply dithering for retro look
    vec2 ditherCoord = floor(gl_FragCoord.xy / pixelSize);
    float dithered = dither8x8(ditherCoord, f);
    
    // Mix color based on dithered value
    vec3 col = dithered * waveColor;
    
    gl_FragColor = vec4(col, 1.0);
}`;

// ========== WebGL Utilities ==========
function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return null;
    }
    
    return program;
}

// ========== Mouse Handling ==========
// Mouse handling functions removed - no longer needed

// Initialize Pixel Art Background
function initPixelArtBackground() {
    // Get canvas and setup WebGL
    canvas = document.getElementById('background-canvas');
    if (!canvas) return;
    
    gl = canvas.getContext('webgl', { alpha: true }) || canvas.getContext('experimental-webgl', { alpha: true });
    
    if (!gl) {
        console.error('WebGL not supported by your browser');
        return;
    }
    
    // Determine initial theme
    const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    if (currentTheme === 'dark') {
        window.pixelArtParams.waveColor = [0.35, 0.35, 0.35]; // Brighter gray for dark theme
    } else {
        window.pixelArtParams.waveColor = [0.85, 0.85, 0.85]; // Softer gray for light theme
    }
    
    // Create shader program
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    program = createProgram(gl, vertexShader, fragmentShader);
    
    // Create quad (two triangles) that covers entire screen
    const vertices = new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
    ]);
    
    quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Get attribute and uniform locations
    const positionAttrib = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttrib);
    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);
    
    // Handle canvas resizing
    window.addEventListener('resize', resizePixelArtBackground);
    resizePixelArtBackground();
    
    // Mouse event listeners removed
    
    // Start timer for animation
    startTime = Date.now();
    
    // Start rendering
    animatePixelArtBackground();
}

// Animation loop
function animatePixelArtBackground() {
    if (!gl || !canvas) return;
    
    // Calculate elapsed time
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000; // convert to seconds
    
    // Clear canvas with transparent background
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Use our shader program
    gl.useProgram(program);
    
    // Update uniforms
    gl.uniform2f(gl.getUniformLocation(program, 'resolution'), canvas.width, canvas.height);
    gl.uniform1f(gl.getUniformLocation(program, 'time'), elapsedTime);
    gl.uniform1f(gl.getUniformLocation(program, 'waveSpeed'), window.pixelArtParams.waveSpeed);
    gl.uniform3f(gl.getUniformLocation(program, 'waveColor'), 
        window.pixelArtParams.waveColor[0], 
        window.pixelArtParams.waveColor[1], 
        window.pixelArtParams.waveColor[2]);
    gl.uniform1f(gl.getUniformLocation(program, 'pixelSize'), window.pixelArtParams.pixelSize);
    gl.uniform1f(gl.getUniformLocation(program, 'edgeFade'), window.pixelArtParams.edgeFade);
    
    // Mouse parameters no longer passed to shader
    
    // Draw the quad
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    
    // Request next frame
    requestAnimationFrame(animatePixelArtBackground);
}

// Canvas resize function
function resizePixelArtBackground() {
    if (!canvas || !gl) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Update WebGL viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
}

// Initialize the Webring
function initWebring() {
    const membersList = document.getElementById('members-list');
    const memberCountElement = document.getElementById('member-count');
    const lastUpdatedElement = document.getElementById('last-updated');
    const randomLink = document.getElementById('random-link');
    const currentHash = window.location.hash;
    const searchInput = document.getElementById('member-search');
    const searchButton = document.getElementById('search-button');
    const paginationContainer = document.getElementById('members-pagination');
    
    // Update the member count
    memberCountElement.textContent = members.length;
    
    // Update the last updated date from the master variable in webring-data.js
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = lastUpdated;
    }
    
    // If there's a URL hash with a navigation parameter, handle the navigation
    if (currentHash) {
        handleNavigation(currentHash);
    }
    
    // Add an event listener for hash changes to handle navigation
    window.addEventListener('hashchange', () => {
        handleNavigation(window.location.hash);
    });
    
    // Set up random link functionality
    randomLink.addEventListener('click', (e) => {
        e.preventDefault();
        const randomIndex = Math.floor(Math.random() * members.length);
        window.location.href = members[randomIndex].website;
    });
    
    // Set up pagination state
    let currentPage = 1;
    const membersPerPage = 10;
    let filteredMembers = [...members];
    
    // Set up search functionality
    searchButton.addEventListener('click', () => {
        performSearch();
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            filteredMembers = [...members];
        } else {
            filteredMembers = members.filter(member => {
                return (
                    (member.name && member.name.toLowerCase().includes(searchTerm)) ||
                    (member.website && member.website.toLowerCase().includes(searchTerm)) ||
                    (member.program && member.program.toLowerCase().includes(searchTerm)) ||
                    (member.faculty && member.faculty.toLowerCase().includes(searchTerm)) || // For backward compatibility
                    (member.designation && member.designation.toLowerCase().includes(searchTerm))
                );
            });
        }
        
        currentPage = 1;
        renderMembersList(membersList, filteredMembers, currentPage, membersPerPage);
        renderPagination(paginationContainer, filteredMembers.length, currentPage, membersPerPage);
    }
    
    // Initial render
    renderMembersList(membersList, filteredMembers, currentPage, membersPerPage);
    renderPagination(paginationContainer, filteredMembers.length, currentPage, membersPerPage);
}

// Render the list of members with pagination
function renderMembersList(container, membersArray, currentPage, membersPerPage) {
    // Clear container
    container.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * membersPerPage;
    const endIndex = Math.min(startIndex + membersPerPage, membersArray.length);
    const currentMembers = membersArray.slice(startIndex, endIndex);
    
    // If no members to display
    if (currentMembers.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7">No matching members found.</td>`;
        container.appendChild(row);
        return;
    }
    
    // Determine current theme for default badge
    const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const defaultBadgePath = currentTheme === 'dark' ? 'badges/default-badge-dark.png' : 'badges/default-badge.png';
    
    // Add each member row
    currentMembers.forEach(member => {
        const row = document.createElement('tr');
        
        // Handle backward compatibility with old member format
        const program = member.program || member.faculty || '';
        const designation = member.designation || '';
        const year = member.year || '';
        const grad = formatGradYear(member.grad) || '';
        
        // Create badge cell with image and link separately to ensure proper rendering
        const badgeCell = document.createElement('td');
        const badgeLink = document.createElement('a');
        badgeLink.href = member.website;
        badgeLink.target = '_blank';
        badgeLink.rel = 'noopener noreferrer';
        
        const badgeImg = document.createElement('img');
        badgeImg.className = 'member-badge';
        badgeImg.alt = member.name ? `${member.name} Badge` : 'Member Badge';
        
        // Use member badge if available, otherwise use default badge
        badgeImg.src = member.badge || defaultBadgePath;
        
        // Add error handling for badge image
        badgeImg.onerror = function() {
            // If badge fails to load, try the default badge instead
            this.src = defaultBadgePath;
            console.log(`Badge for ${member.name} could not be loaded, using default badge`);
        };
        
        badgeLink.appendChild(badgeImg);
        badgeCell.appendChild(badgeLink);
        
        row.appendChild(badgeCell);
        
        // Add the rest of the row content
        row.innerHTML += `
            <td><a href="${member.website}" target="_blank" rel="noopener noreferrer">${formatUrl(member.website)}</a></td>
            <td>${member.name}</td>
            <td>${program}</td>
            <td>${designation}</td>
            <td>${year}</td>
            <td>${grad}</td>
        `;
        
        container.appendChild(row);
    });
}

// Render pagination controls
function renderPagination(container, totalItems, currentPage, itemsPerPage) {
    container.innerHTML = '';
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // If only one page or no items, don't render pagination
    if (totalPages <= 1) {
        return;
    }
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = '←';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    });
    container.appendChild(prevButton);
    
    // Page buttons
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page if not visible
    if (startPage > 1) {
        const firstButton = document.createElement('button');
        firstButton.textContent = '1';
        firstButton.addEventListener('click', () => goToPage(1));
        container.appendChild(firstButton);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.margin = '0 5px';
            container.appendChild(ellipsis);
        }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => goToPage(i));
        container.appendChild(pageButton);
    }
    
    // Last page if not visible
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.margin = '0 5px';
            container.appendChild(ellipsis);
        }
        
        const lastButton = document.createElement('button');
        lastButton.textContent = totalPages;
        lastButton.addEventListener('click', () => goToPage(totalPages));
        container.appendChild(lastButton);
    }
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = '→';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    });
    container.appendChild(nextButton);
    
    // Function to change page
    function goToPage(page) {
        const membersList = document.getElementById('members-list');
        const paginationContainer = document.getElementById('members-pagination');
        const searchInput = document.getElementById('member-search');
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        let filteredMembers = [...members];
        if (searchTerm !== '') {
            filteredMembers = members.filter(member => {
                return (
                    (member.name && member.name.toLowerCase().includes(searchTerm)) ||
                    (member.website && member.website.toLowerCase().includes(searchTerm)) ||
                    (member.program && member.program.toLowerCase().includes(searchTerm)) ||
                    (member.faculty && member.faculty.toLowerCase().includes(searchTerm)) ||
                    (member.designation && member.designation.toLowerCase().includes(searchTerm))
                );
            });
        }
        
        renderMembersList(membersList, filteredMembers, page, itemsPerPage);
        renderPagination(paginationContainer, filteredMembers.length, page, itemsPerPage);
    }
}

// Format URL for display (remove https:// and trailing slashes)
function formatUrl(url) {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

// Format graduation year to support both standard and UofT formats
function formatGradYear(grad) {
    if (!grad) return 'N/A';
    
    // If it's already in UofT format (e.g., 2T5)
    if (/^\d{1}T\d{1}$/i.test(grad)) {
        return grad.toUpperCase();
    }
    
    // If it's a standard year (e.g., 2025)
    if (/^20\d{2}$/.test(grad)) {
        const year = grad.substring(2); // Get the last two digits
        const firstDigit = year.charAt(0);
        const lastDigit = year.charAt(1);
        return `${firstDigit}T${lastDigit}`;
    }
    
    // If it's neither format, just return as is
    return grad;
}

// Handle webring navigation (prev/next)
function handleNavigation(hashString) {
    // Extract website URL and navigation direction from hash
    // Expected format: #https://example.com?nav=prev or #https://example.com?nav=next
    if (!hashString || hashString.length <= 1) return;
    
    console.log('Handling navigation for hash:', hashString);
    
    const [websiteUrl, navQuery] = hashString.substring(1).split('?');
    
    if (!websiteUrl) return;
    
    const navDirection = navQuery ? navQuery.split('=')[1] : null;
    console.log('Navigation direction:', navDirection);
    console.log('Website URL:', websiteUrl);
    
    // Special case: If navigating from the webring homepage
    if (websiteUrl === 'webring.ayanali.net' || websiteUrl === 'https://webring.ayanali.net') {
        console.log('Navigating from webring homepage');
        if (navDirection === 'next') {
            // Go to first member when clicking next
            console.log('Going to first member');
            window.location.href = members[0].website;
        } else {
            // Go to last member when clicking prev
            console.log('Going to last member');
            window.location.href = members[members.length - 1].website;
        }
        return;
    }
    
    if (navDirection === 'prev' || navDirection === 'next') {
        // Find the current website in the members array
        const currentIndex = members.findIndex(member => 
            member.website === websiteUrl || 
            member.website === 'https://' + websiteUrl || 
            member.website === 'http://' + websiteUrl
        );
        
        console.log('Current index in members array:', currentIndex);
        
        if (currentIndex !== -1) {
            let targetIndex;
            
            if (navDirection === 'prev') {
                // Go to previous website, or wrap around to the last one
                targetIndex = currentIndex === 0 ? members.length - 1 : currentIndex - 1;
            } else {
                // Go to next website, or wrap around to the first one
                targetIndex = (currentIndex + 1) % members.length;
            }
            
            console.log('Target index:', targetIndex);
            console.log('Navigating to:', members[targetIndex].website);
            
            // Navigate to the target website
            window.location.href = members[targetIndex].website;
        } else {
            // If website not found in members array, go to first member
            console.log('Website not found in members array, going to first member');
            window.location.href = members[0].website;
        }
    } else {
        // Just a hash without navigation, possibly for embedding the webring
        console.log('No navigation direction specified');
    }
} 