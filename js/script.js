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
        const defaultBadgePath = theme === 'dark' ? 'badges/default-badge-dark.svg' : 'badges/default-badge.svg';
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
    const defaultBadgePath = currentTheme === 'dark' ? 'badges/default-badge-dark.svg' : 'badges/default-badge.svg';
    
    // Add each member row
    currentMembers.forEach(member => {
        const row = document.createElement('tr');
        
        // Handle backward compatibility with old member format
        const program = member.program || member.faculty || '';
        const designation = member.designation || '';
        const year = member.year || '';
        const grad = formatGradYear(member.grad) || '';
        
        // Get badge HTML and ensure it's wrapped correctly
        let badgeHTML;
        if (member.badge) {
            // Use member's badge if available
            badgeHTML = `
                <a href="${member.website}" target="_blank" rel="noopener noreferrer">
                    <img src="${member.badge}" alt="${member.name} Badge" class="member-badge" />
                </a>`;
        } else {
            // Use default badge as fallback
            badgeHTML = `
                <a href="${member.website}" target="_blank" rel="noopener noreferrer">
                    <img src="${defaultBadgePath}" alt="Default Badge" class="member-badge" />
                </a>`;
        }
        
        row.innerHTML = `
            <td>${badgeHTML}</td>
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
    const [websiteUrl, navQuery] = hashString.substring(1).split('?');
    
    if (!websiteUrl) return;
    
    const navDirection = navQuery ? navQuery.split('=')[1] : null;
    
    if (navDirection === 'prev' || navDirection === 'next') {
        // Find the current website in the members array
        const currentIndex = members.findIndex(member => member.website === websiteUrl);
        
        if (currentIndex !== -1) {
            let targetIndex;
            
            if (navDirection === 'prev') {
                // Go to previous website, or wrap around to the last one
                targetIndex = currentIndex === 0 ? members.length - 1 : currentIndex - 1;
            } else {
                // Go to next website, or wrap around to the first one
                targetIndex = (currentIndex + 1) % members.length;
            }
            
            // Navigate to the target website
            window.location.href = members[targetIndex].website;
        }
    } else {
        // Just a hash without navigation, possibly for embedding the webring
        // No action needed
    }
} 