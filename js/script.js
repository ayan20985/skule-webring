const WEBRING_DATA_PATH = 'js/webring-data.json';
let members = [];
let lastUpdated = '';

async function loadWebringData() {
    try {
        const response = await fetch(WEBRING_DATA_PATH);
        if (!response.ok) {
            throw new Error(`Failed to load data: ${response.status}`);
        }

        const data = await response.json();
        members = Array.isArray(data.members) ? data.members : [];
        lastUpdated = typeof data.lastUpdated === 'string' ? data.lastUpdated : '';
    } catch (error) {
        console.error('Unable to load webring data from JSON:', error);
        members = [];
        lastUpdated = '';
    }
}

function updateBenefitsMemberCount() {
    const benefitsMemberCount = document.getElementById('benefits-member-count');
    if (benefitsMemberCount) {
        benefitsMemberCount.textContent = members.length;
    }
}

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', async () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const dataLoadPromise = loadWebringData();
    
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
    await dataLoadPromise;
    preloadBadgeImages();

    updateBenefitsMemberCount();
    
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
    
    // Initialize the webring
    initWebring();
});

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

    // Only initialize directory features on the homepage where these elements exist.
    if (!membersList || !memberCountElement || !randomLink || !searchInput || !searchButton || !paginationContainer) {
        return;
    }

    if (!Array.isArray(members) || members.length === 0) {
        memberCountElement.textContent = '0';
        membersList.innerHTML = '<tr><td colspan="7">No members available.</td></tr>';
        return;
    }
    
    // Update the member count
    memberCountElement.textContent = members.length;
    
    // Update the last updated date from the master value in webring-data.json
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
    const membersPerPage = 30;
    let filteredMembers = [...members];
    
    // Set up search functionality
    searchButton.addEventListener('click', () => {
        performSearch();
    });
    
    searchInput.addEventListener('input', () => {
        performSearch();
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
                    (member.websitedisplay && member.websitedisplay.toLowerCase().includes(searchTerm)) ||
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
            // If badge fails to load, use the default badge once.
            this.onerror = null;
            this.src = defaultBadgePath;
            console.log(`Badge for ${member.name} could not be loaded, using default badge`);
        };
        
        badgeLink.appendChild(badgeImg);
        badgeCell.appendChild(badgeLink);
        
        row.appendChild(badgeCell);
        
        // Add the rest of the row content without using innerHTML so listeners stay attached.
        const websiteCell = document.createElement('td');
        const websiteLink = document.createElement('a');
        const displayWebsiteRaw = member.websitedisplay || member.website || '';
        const displayWebsiteUrl = normalizeWebsiteUrl(displayWebsiteRaw);
        const useDisplayPath = Boolean(member.websitedisplay);
        websiteLink.href = displayWebsiteUrl;
        websiteLink.target = '_blank';
        websiteLink.rel = 'noopener noreferrer';
        websiteLink.textContent = formatUrl(displayWebsiteUrl, useDisplayPath);
        websiteCell.appendChild(websiteLink);

        const nameCell = document.createElement('td');
        nameCell.textContent = member.name || '';

        const programCell = document.createElement('td');
        programCell.textContent = program;

        const designationCell = document.createElement('td');
        designationCell.textContent = designation;

        const yearCell = document.createElement('td');
        yearCell.textContent = year;

        const gradCell = document.createElement('td');
        gradCell.textContent = grad;

        row.appendChild(websiteCell);
        row.appendChild(nameCell);
        row.appendChild(programCell);
        row.appendChild(designationCell);
        row.appendChild(yearCell);
        row.appendChild(gradCell);
        
        container.appendChild(row);
    });
}

// Render pagination controls
function renderPagination(container, totalItems, currentPage, itemsPerPage) {
    container.innerHTML = '';
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // If no items, don't render pagination
    if (totalItems === 0) {
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
                    (member.websitedisplay && member.websitedisplay.toLowerCase().includes(searchTerm)) ||
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

function normalizeWebsiteUrl(url) {
    if (!url || typeof url !== 'string') {
        return '';
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
        return '';
    }

    return /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`;
}

// Format URL for display (remove protocol and optionally keep path)
function formatUrl(url, keepPath = false) {
    if (!url) {
        return '';
    }

    // First remove protocol (http:// or https://)
    let formattedUrl = url.replace(/^https?:\/\//, '');

    // Optionally show only the domain for cleaner table display.
    if (!keepPath) {
        formattedUrl = formattedUrl.split('/')[0];
    }
    
    // Remove trailing slash if any
    return formattedUrl.replace(/\/$/, '');
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

const WEBRING_HOME_URL = 'https://webring.skule.ca';

function normalizePathname(pathname) {
    if (!pathname || pathname === '/') return '';
    return pathname.replace(/\/+$/, '');
}

function parseWebsiteReference(websiteRef) {
    if (!websiteRef || typeof websiteRef !== 'string') {
        return null;
    }

    const trimmed = websiteRef.trim();
    if (!trimmed) {
        return null;
    }

    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    try {
        return new URL(withProtocol);
    } catch {
        return null;
    }
}

function getNormalizedWebsiteParts(websiteRef) {
    const parsed = parseWebsiteReference(websiteRef);
    if (!parsed) {
        return null;
    }

    const hostname = parsed.hostname.toLowerCase();
    return {
        hostnameNoWww: hostname.replace(/^www\./, ''),
        pathname: normalizePathname(parsed.pathname.toLowerCase())
    };
}

function findMemberIndexByWebsiteReference(websiteRef) {
    const incoming = getNormalizedWebsiteParts(websiteRef);
    if (!incoming) {
        return -1;
    }

    // Prefer full host+path match first when possible.
    const exactPathMatch = members.findIndex((member) => {
        const candidate = getNormalizedWebsiteParts(member.website);
        return candidate &&
            candidate.hostnameNoWww === incoming.hostnameNoWww &&
            candidate.pathname === incoming.pathname;
    });

    if (exactPathMatch !== -1) {
        return exactPathMatch;
    }

    // Fallback: host-only match for widgets that omit path and/or www.
    return members.findIndex((member) => {
        const candidate = getNormalizedWebsiteParts(member.website);
        return candidate && candidate.hostnameNoWww === incoming.hostnameNoWww;
    });
}

function navigateToWebringHome(reason) {
    if (reason) {
        console.warn(reason);
    }
    window.location.href = WEBRING_HOME_URL;
}

// Handle webring navigation (prev/next)
function handleNavigation(hashString) {
    // Extract website URL and navigation direction from hash
    // Expected format: #https://example.com?nav=prev or #https://example.com?nav=next
    if (!hashString || hashString.length <= 1) return;
    
    console.log('Handling navigation for hash:', hashString);
    
    // Ensure members array is loaded before processing navigation
    if (!Array.isArray(members) || members.length === 0) {
        console.error('Members array not loaded, redirecting to webring homepage');
        navigateToWebringHome();
        return;
    }
    
    const hashPayload = hashString.substring(1);
    const querySeparator = hashPayload.lastIndexOf('?');
    const websiteUrl = querySeparator === -1 ? hashPayload : hashPayload.substring(0, querySeparator);
    const navQuery = querySeparator === -1 ? '' : hashPayload.substring(querySeparator + 1);
    
    if (!websiteUrl) {
        console.error('No website URL found in hash string');
        navigateToWebringHome();
        return;
    }
    
    const navDirection = navQuery ? new URLSearchParams(navQuery).get('nav') : null;
    console.log('Navigation direction:', navDirection);
    console.log('Website URL:', websiteUrl);

    if (navDirection !== 'prev' && navDirection !== 'next') {
        // Just a hash without valid navigation, possibly for embedding the webring
        console.log('No valid navigation direction specified');
        return;
    }
    
    // Special case: If navigating from the webring homepage
    const normalizedWebsite = getNormalizedWebsiteParts(websiteUrl);
    if (normalizedWebsite && normalizedWebsite.hostnameNoWww === 'webring.skule.ca') {
        console.log('Navigating from webring homepage');
        if (navDirection === 'next') {
            // Go to first member when clicking next
            console.log('Going to first member');
            window.location.href = members[0].website;
        } else if (navDirection === 'prev') {
            // Go to last member when clicking prev
            console.log('Going to last member');
            window.location.href = members[members.length - 1].website;
        } else {
            console.log('No valid navigation direction specified for homepage');
        }
        return;
    }
    
    // Find the current website in the members array, allowing www/no-www/path differences.
    const currentIndex = findMemberIndexByWebsiteReference(websiteUrl);
    
    console.log('Current index in members array:', currentIndex);
    console.log('Members array length:', members.length);
    
    if (currentIndex === -1) {
        navigateToWebringHome(`Website not found in members array: ${websiteUrl}`);
        return;
    }

    let targetIndex;
    if (navDirection === 'prev') {
        // Go to previous website, or wrap around to the last one
        targetIndex = currentIndex === 0 ? members.length - 1 : currentIndex - 1;
        console.log('Previous navigation: current index', currentIndex, '-> target index', targetIndex);
    } else {
        // Go to next website, or wrap around to the first one
        targetIndex = (currentIndex + 1) % members.length;
        console.log('Next navigation: current index', currentIndex, '-> target index', targetIndex);
    }

    // Validate target index
    if (targetIndex < 0 || targetIndex >= members.length) {
        navigateToWebringHome(`Invalid target index: ${targetIndex}`);
        return;
    }

    const targetMember = members[targetIndex];
    if (!targetMember || !targetMember.website) {
        navigateToWebringHome(`Invalid target member at index: ${targetIndex}`);
        return;
    }

    console.log('Target index:', targetIndex);
    console.log('Target member:', targetMember.name);
    console.log('Navigating to:', targetMember.website);
    
    // Navigate to the target website
    window.location.href = targetMember.website;
} 

// Table Scroll Indicators
document.addEventListener('DOMContentLoaded', () => {
    const tableWrapper = document.getElementById('table-wrapper');
    const scrollLeftIndicator = document.getElementById('scroll-left');
    const scrollRightIndicator = document.getElementById('scroll-right');
    
    if (!tableWrapper || !scrollLeftIndicator || !scrollRightIndicator) {
        return; // Elements not found, skip initialization
    }
    
    function updateScrollIndicators() {
        const { scrollLeft, scrollWidth, clientWidth } = tableWrapper;
        const maxScrollLeft = scrollWidth - clientWidth;
        
        // Show/hide left indicator
        if (scrollLeft > 5) {
            scrollLeftIndicator.classList.add('visible');
        } else {
            scrollLeftIndicator.classList.remove('visible');
        }
        
        // Show/hide right indicator
        if (scrollLeft < maxScrollLeft - 5) {
            scrollRightIndicator.classList.add('visible');
        } else {
            scrollRightIndicator.classList.remove('visible');
        }
    }
    
    // Check scroll indicators on scroll
    tableWrapper.addEventListener('scroll', updateScrollIndicators);
    
    // Check scroll indicators on resize
    window.addEventListener('resize', () => {
        setTimeout(updateScrollIndicators, 100);
    });
    
    // Check scroll indicators when table content changes
    const observer = new MutationObserver(() => {
        setTimeout(updateScrollIndicators, 100);
    });
    
    const membersTable = document.getElementById('members-table');
    if (membersTable) {
        observer.observe(membersTable, { childList: true, subtree: true });
    }
    
    // Click handlers for scroll indicators
    scrollLeftIndicator.addEventListener('click', () => {
        tableWrapper.scrollBy({ left: -200, behavior: 'smooth' });
    });
    
    scrollRightIndicator.addEventListener('click', () => {
        tableWrapper.scrollBy({ left: 200, behavior: 'smooth' });
    });
    
    // Initial check
    setTimeout(updateScrollIndicators, 500);
});
