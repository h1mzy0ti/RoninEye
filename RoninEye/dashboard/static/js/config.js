// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const mobileToggle = document.getElementById('mobile-toggle');
const endpointForm = document.getElementById('endpoint-form');
const endpointsTableBody = document.getElementById('endpoints-table-body');

// Toggle sidebar on desktop
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}

// Toggle sidebar on mobile
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });
}

// Sample endpoint data
const sampleEndpoints = [
    {
        name: 'User Authentication',
        url: 'https://api.example.com/auth',
        method: 'POST',
        tags: ['auth', 'users'],
        responseThreshold: 300,
        errorThreshold: 5,
        status: 'active'
    },
    {
        name: 'Product Search',
        url: 'https://api.example.com/products/search',
        method: 'GET',
        tags: ['products', 'search'],
        responseThreshold: 500,
        errorThreshold: 3,
        status: 'active'
    },
    {
        name: 'Order Processing',
        url: 'https://api.example.com/orders',
        method: 'POST',
        tags: ['orders', 'transactions'],
        responseThreshold: 400,
        errorThreshold: 2,
        status: 'active'
    },
    {
        name: 'Payment Gateway',
        url: 'https://api.example.com/payments',
        method: 'POST',
        tags: ['payments', 'transactions'],
        responseThreshold: 300,
        errorThreshold: 1,
        status: 'inactive'
    },
    {
        name: 'User Profile',
        url: 'https://api.example.com/users/profile',
        method: 'GET',
        tags: ['users', 'profile'],
        responseThreshold: 200,
        errorThreshold: 5,
        status: 'active'
    }
];

// Function to render endpoints table
function renderEndpointsTable() {
    if (!endpointsTableBody) return;
    
    endpointsTableBody.innerHTML = '';
    
    sampleEndpoints.forEach((endpoint, index) => {
        const row = document.createElement('tr');
        
        // Create tags HTML
        const tagsHtml = endpoint.tags.map(tag => 
            `<span class="endpoint-tag">${tag}</span>`
        ).join('');
        
        row.innerHTML = `
            <td>${endpoint.name}</td>
            <td>${endpoint.url}</td>
            <td>${endpoint.method}</td>
            <td>${tagsHtml}</td>
            <td>${endpoint.responseThreshold} ms</td>
            <td>${endpoint.errorThreshold}%</td>
            <td>
                <span class="endpoint-status ${endpoint.status === 'active' ? 'active' : 'inactive'}">
                    <i class="fas fa-circle"></i>
                    ${endpoint.status === 'active' ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <div class="endpoint-actions">
                    <button class="action-btn edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        endpointsTableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    const editButtons = document.querySelectorAll('.action-btn.edit');
    const deleteButtons = document.querySelectorAll('.action-btn.delete');
    
    editButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // In a real app, this would open an edit form
            alert(`Edit endpoint: ${sampleEndpoints[index].name}`);
        });
    });
    
    deleteButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // In a real app, this would show a confirmation dialog
            if (confirm(`Are you sure you want to delete ${sampleEndpoints[index].name}?`)) {
                sampleEndpoints.splice(index, 1);
                renderEndpointsTable();
            }
        });
    });
}

// Handle form submission
if (endpointForm) {
    endpointForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('endpoint-name').value;
        const url = document.getElementById('endpoint-url').value;
        const method = document.getElementById('endpoint-method').value;
        const tags = document.getElementById('endpoint-tags').value.split(',').map(tag => tag.trim());
        const responseThreshold = parseInt(document.getElementById('response-threshold').value);
        const errorThreshold = parseInt(document.getElementById('error-threshold').value);
        
        // Add new endpoint
        sampleEndpoints.push({
            name,
            url,
            method,
            tags,
            responseThreshold,
            errorThreshold,
            status: 'active'
        });
        
        // Reset form
        endpointForm.reset();
        
        // Update table
        renderEndpointsTable();
        
        // Show success message
        alert('Endpoint added successfully!');
    });
}

// Initialize the configuration page
function initConfigPage() {
    renderEndpointsTable();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initConfigPage);