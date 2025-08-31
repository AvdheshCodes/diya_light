/**
 * ===============================================
 * BUSINESS DASHBOARD - JAVASCRIPT FUNCTIONALITY
 * ===============================================
 */

// Global application state
const Dashboard = {
    // Configuration
    config: {
        animationDuration: 300,
        chartColors: {
            primary: '#2563eb',
            secondary: '#10b981',
            accent: '#f59e0b',
            danger: '#ef4444',
            info: '#06b6d4',
            purple: '#8b5cf6'
        },
        apiDelay: 1500 // Simulate API delay
    },

    // Application state
    state: {
        sidebarCollapsed: false,
        currentSection: 'dashboard',
        charts: {},
        data: {
            revenue: { current: 1250000, previous: 1112500, change: 12.5 },
            users: { current: 45672, previous: 42194, change: 8.2 },
            sales: { current: 1847, previous: 1886, change: -2.1 },
            growth: { current: 23.4, previous: 20.3, change: 15.3 }
        }
    },

    // Mock data for charts and tables
    mockData: {
        revenueData: [
            { label: 'Jan', value: 850000 },
            { label: 'Feb', value: 920000 },
            { label: 'Mar', value: 1100000 },
            { label: 'Apr', value: 980000 },
            { label: 'May', value: 1200000 },
            { label: 'Jun', value: 1350000 },
            { label: 'Jul', value: 1250000 }
        ],
        salesData: [
            { label: 'Electronics', value: 35, color: '#2563eb' },
            { label: 'Clothing', value: 25, color: '#10b981' },
            { label: 'Home & Garden', value: 20, color: '#f59e0b' },
            { label: 'Sports', value: 12, color: '#ef4444' },
            { label: 'Books', value: 8, color: '#8b5cf6' }
        ],
        demographicsData: [
            { label: '18-25', value: 28, color: '#2563eb' },
            { label: '26-35', value: 35, color: '#10b981' },
            { label: '36-45', value: 22, color: '#f59e0b' },
            { label: '46-55', value: 10, color: '#ef4444' },
            { label: '55+', value: 5, color: '#8b5cf6' }
        ],
        activityData: [
            { user: 'John Smith', activity: 'Completed purchase', time: '2 minutes ago', status: 'completed' },
            { user: 'Sarah Johnson', activity: 'Updated profile', time: '5 minutes ago', status: 'completed' },
            { user: 'Mike Chen', activity: 'Failed payment', time: '8 minutes ago', status: 'failed' },
            { user: 'Emma Wilson', activity: 'Started checkout', time: '12 minutes ago', status: 'pending' },
            { user: 'David Brown', activity: 'Viewed products', time: '15 minutes ago', status: 'completed' },
            { user: 'Lisa Garcia', activity: 'Added to cart', time: '18 minutes ago', status: 'completed' },
            { user: 'Tom Anderson', activity: 'Registered account', time: '25 minutes ago', status: 'completed' },
            { user: 'Amy Taylor', activity: 'Sent support ticket', time: '32 minutes ago', status: 'pending' }
        ]
    }
};

/**
 * ===============================================
 * INITIALIZATION AND EVENT LISTENERS
 * ===============================================
 */

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    showLoadingOverlay();
    
    // Simulate loading time
    setTimeout(() => {
        setupEventListeners();
        loadDashboardData();
        renderCharts();
        populateActivityTable();
        hideLoadingOverlay();
        
        // Add entrance animations
        animateCardsEntrance();
    }, Dashboard.config.apiDelay);
}

function setupEventListeners() {
    // Sidebar toggle (desktop)
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileSidebar);
    }

    // User profile dropdown
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userDropdown = document.getElementById('userDropdown');
    if (userProfileBtn && userDropdown) {
        userProfileBtn.addEventListener('click', toggleUserDropdown);
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userProfileBtn.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }

    // Navigation menu items
    const menuItems = document.querySelectorAll('.menu-item a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            handleNavigation(this);
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Chart controls
    const timeFilter = document.querySelector('.time-filter');
    if (timeFilter) {
        timeFilter.addEventListener('change', handleTimeFilterChange);
    }

    // Responsive sidebar handling
    handleResponsiveSidebar();
    window.addEventListener('resize', handleResponsiveSidebar);

    // Card click handlers
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', handleCardClick);
    });
}

/**
 * ===============================================
 * SIDEBAR AND NAVIGATION FUNCTIONALITY
 * ===============================================
 */

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    Dashboard.state.sidebarCollapsed = !Dashboard.state.sidebarCollapsed;
    sidebar.classList.toggle('collapsed', Dashboard.state.sidebarCollapsed);
    
    // Save preference to localStorage
    localStorage.setItem('sidebarCollapsed', Dashboard.state.sidebarCollapsed);
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

function handleResponsiveSidebar() {
    const sidebar = document.getElementById('sidebar');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        sidebar.classList.remove('collapsed');
        sidebar.classList.remove('show');
    } else {
        sidebar.classList.remove('show');
        // Restore desktop sidebar state
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
            sidebar.classList.add('collapsed');
            Dashboard.state.sidebarCollapsed = true;
        }
    }
}

function handleNavigation(element) {
    // Update active state
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    element.parentElement.classList.add('active');
    
    // Update page title
    const section = element.dataset.section;
    const pageTitle = document.querySelector('.page-title');
    const sectionTitles = {
        dashboard: 'Dashboard Overview',
        analytics: 'Analytics',
        sales: 'Sales Management',
        reports: 'Reports',
        settings: 'Settings'
    };
    
    if (pageTitle) {
        pageTitle.textContent = sectionTitles[section] || 'Dashboard';
    }
    
    // Close mobile sidebar
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('show');
    
    Dashboard.state.currentSection = section;
}

function toggleUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    userDropdown.classList.toggle('show');
}

/**
 * ===============================================
 * DATA LOADING AND MANAGEMENT
 * ===============================================
 */

function loadDashboardData() {
    // Update summary cards with animation
    updateSummaryCard('totalRevenue', Dashboard.state.data.revenue.current, '$', true);
    updateSummaryCard('activeUsers', Dashboard.state.data.users.current, '', true);
    updateSummaryCard('salesToday', Dashboard.state.data.sales.current, '', false);
    updateSummaryCard('growthRate', Dashboard.state.data.growth.current, '%', false);
}

function updateSummaryCard(elementId, value, prefix = '', animate = true) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (animate) {
        animateValue(element, 0, value, 1500, prefix);
    } else {
        element.textContent = formatValue(value, prefix);
    }
}

function animateValue(element, start, end, duration, prefix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutExpo = 1 - Math.pow(2, -10 * progress);
        const current = start + (end - start) * easeOutExpo;
        
        element.textContent = formatValue(Math.round(current), prefix);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function formatValue(value, prefix = '') {
    let formattedValue;
    
    if (prefix === '$') {
        formattedValue = value.toLocaleString();
    } else if (prefix === '%') {
        formattedValue = value.toFixed(1);
    } else {
        formattedValue = value.toLocaleString();
    }
    
    return prefix + formattedValue + (prefix === '%' ? '' : '');
}

/**
 * ===============================================
 * CHART RENDERING (CANVAS-BASED)
 * ===============================================
 */

function renderCharts() {
    renderRevenueChart();
    renderSalesChart();
    renderDemographicsChart();
}

function renderRevenueChart() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = Dashboard.mockData.revenueData;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Find min and max values
    const values = data.map(d => d.value);
    const minValue = Math.min(...values) * 0.9;
    const maxValue = Math.max(...values) * 1.1;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw line chart
    const points = data.map((d, i) => {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = height - padding - ((d.value - minValue) / (maxValue - minValue)) * chartHeight;
        return { x, y, value: d.value, label: d.label };
    });
    
    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach(point => {
        ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fill();
    
    // Draw line
    ctx.strokeStyle = Dashboard.config.chartColors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point, i) => {
        if (i > 0) {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.stroke();
    
    // Draw points
    points.forEach(point => {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = Dashboard.config.chartColors.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    });
    
    // Draw labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    points.forEach(point => {
        ctx.fillText(point.label, point.x, height - padding + 20);
    });
    
    // Draw y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        const value = maxValue - ((maxValue - minValue) / 5) * i;
        ctx.fillText('$' + Math.round(value / 1000) + 'K', padding - 10, y + 4);
    }
    
    Dashboard.state.charts.revenue = { canvas, ctx, data, points };
}

function renderSalesChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = Dashboard.mockData.salesData;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding - 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find max value
    const maxValue = Math.max(...data.map(d => d.value)) * 1.2;
    
    // Draw bars
    const barWidth = chartWidth / data.length * 0.6;
    const barSpacing = chartWidth / data.length;
    
    data.forEach((item, i) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const x = padding + barSpacing * i + (barSpacing - barWidth) / 2;
        const y = height - padding - 40 - barHeight;
        
        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, item.color);
        gradient.addColorStop(1, item.color + '80');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value on top
        ctx.fillStyle = '#64748b';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.value + '%', x + barWidth / 2, y - 5);
        
        // Draw label
        ctx.fillText(item.label, x + barWidth / 2, height - padding - 20);
    });
    
    Dashboard.state.charts.sales = { canvas, ctx, data };
}

function renderDemographicsChart() {
    const canvas = document.getElementById('demographicsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = Dashboard.mockData.demographicsData;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate angles
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2; // Start at top
    
    data.forEach((item, i) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        const endAngle = currentAngle + sliceAngle;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, endAngle);
        ctx.closePath();
        
        // Create gradient for slice
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, item.color);
        gradient.addColorStop(1, item.color + '80');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.value + '%', labelX, labelY);
        
        currentAngle = endAngle;
    });
    
    // Draw legend
    const legendX = 20;
    let legendY = 30;
    
    data.forEach(item => {
        // Color box
        ctx.fillStyle = item.color;
        ctx.fillRect(legendX, legendY - 10, 15, 15);
        
        // Label
        ctx.fillStyle = '#64748b';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(item.label + ' (' + item.value + '%)', legendX + 20, legendY);
        
        legendY += 20;
    });
    
    Dashboard.state.charts.demographics = { canvas, ctx, data };
}

/**
 * ===============================================
 * TABLE AND ACTIVITY MANAGEMENT
 * ===============================================
 */

function populateActivityTable() {
    const tableBody = document.getElementById('activityTableBody');
    if (!tableBody) return;
    
    const data = Dashboard.mockData.activityData;
    
    tableBody.innerHTML = data.map(activity => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.8rem;">
                        ${activity.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span>${activity.user}</span>
                </div>
            </td>
            <td>${activity.activity}</td>
            <td>${activity.time}</td>
            <td>
                <span class="status-badge status-${activity.status}">
                    ${activity.status}
                </span>
            </td>
        </tr>
    `).join('');
}

/**
 * ===============================================
 * SEARCH AND FILTER FUNCTIONALITY
 * ===============================================
 */

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length === 0) {
        // Reset view
        return;
    }
    
    // Simple search simulation
    console.log('Searching for:', query);
    
    // In a real app, this would filter data and update views
}

function handleTimeFilterChange(e) {
    const timeRange = e.target.value;
    console.log('Time filter changed:', timeRange);
    
    // Simulate loading new data
    showLoadingOverlay();
    
    setTimeout(() => {
        // Re-render revenue chart with new data
        renderRevenueChart();
        hideLoadingOverlay();
    }, 800);
}

/**
 * ===============================================
 * UI ANIMATIONS AND INTERACTIONS
 * ===============================================
 */

function animateCardsEntrance() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function handleCardClick(e) {
    const card = e.currentTarget;
    
    // Add ripple effect
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    card.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // Simulate navigation or action
    console.log('Card clicked:', card.className);
}

function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

/**
 * ===============================================
 * UTILITY FUNCTIONS
 * ===============================================
 */

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format numbers for display
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Generate random data for demo purposes
function generateRandomData(length, min, max) {
    return Array.from({ length }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

// Handle window resize for charts
window.addEventListener('resize', debounce(() => {
    // Re-render charts on window resize
    setTimeout(() => {
        renderCharts();
    }, 100);
}, 250));

/**
 * ===============================================
 * RIPPLE EFFECT CSS (Injected)
 * ===============================================
 */

// Add ripple effect styles dynamically
const rippleStyles = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(37, 99, 235, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);

/**
 * ===============================================
 * KEYBOARD SHORTCUTS AND ACCESSIBILITY
 * ===============================================
 */

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modals/dropdowns
    if (e.key === 'Escape') {
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.classList.remove('show');
        }
        
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth <= 768 && sidebar) {
            sidebar.classList.remove('show');
        }
    }
});

// Focus management for accessibility
document.addEventListener('focusin', function(e) {
    if (e.target.matches('.search-input')) {
        e.target.parentElement.classList.add('focused');
    }
});

document.addEventListener('focusout', function(e) {
    if (e.target.matches('.search-input')) {
        e.target.parentElement.classList.remove('focused');
    }
});

/**
 * ===============================================
 * PERFORMANCE MONITORING (OPTIONAL)
 * ===============================================
 */

// Performance metrics
const performanceMetrics = {
    startTime: performance.now(),
    
    logMetric(name, value) {
        console.log(`📊 ${name}: ${value}ms`);
    },
    
    measureChartRender() {
        const start = performance.now();
        renderCharts();
        const end = performance.now();
        this.logMetric('Chart Render Time', Math.round(end - start));
    }
};

// Export Dashboard object for debugging (in development)
if (typeof window !== 'undefined') {
    window.Dashboard = Dashboard;
    window.performanceMetrics = performanceMetrics;
}

console.log('🚀 Business Dashboard initialized successfully!');
