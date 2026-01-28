    // app.js
    // Sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const navToggle = document.getElementById('navToggle');
    navToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

    // User profile dropdown toggle
    const userProfileToggle = document.getElementById('userProfileToggle');
    const userDropdown = document.getElementById('userDropdown');
    
    userProfileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      userProfileToggle.classList.toggle('open');
      userDropdown.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userProfileToggle.contains(e.target) && !userDropdown.contains(e.target)) {
        userProfileToggle.classList.remove('open');
        userDropdown.classList.remove('open');
      }
    });
    
    // Role management
    let currentRole = 'owner';
    const roleData = {
      owner: {
        name: 'John Doe',
        initials: 'JD',
        role: 'Owner',
        permissions: {
          canView: true,
          canWrite: true,
          canDelete: false,
          canMonitor: true
        }
      },
      admin: {
        name: 'Jane Smith',
        initials: 'JS',
        role: 'Admin',
        permissions: {
          canView: true,
          canWrite: true,
          canDelete: true,
          canMonitor: false
        }
      },
      nurse: {
        name: 'Maria Santos',
        initials: 'MS',
        role: 'Nurse',
        permissions: {
          canView: true,
          canWrite: false,
          canDelete: false,
          canMonitor: false
        }
      }
    };
    
    // Update UI based on role
    function updateUIForRole(role) {
      const data = roleData[role];
      currentRole = role;
      
      // Update user info
      document.getElementById('userName').textContent = data.name;
      document.getElementById('userRole').textContent = data.role;
      document.getElementById('userInitials').textContent = data.initials;
      
      // Update active role in dropdown
      document.querySelectorAll('.role-switch').forEach(btn => {
        if (btn.dataset.role === role) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      
      // Apply permission-based UI changes
      applyPermissions(data.permissions);
      
      // Close dropdown
      userProfileToggle.classList.remove('open');
      userDropdown.classList.remove('open');
    }
    
    // Apply permissions to UI elements
    function applyPermissions(permissions) {
      // Get all nav links
      const navLinks = {
        dashboard: document.querySelector('[data-page="dashboard"]'),
        inventory: document.querySelector('[data-page="inventory"]'),
        journals: document.querySelector('[data-page="journals"]'),
        accounts: document.querySelector('[data-page="accounts"]'),
        trial: document.querySelector('[data-page="trial"]'),
        financials: document.querySelector('[data-page="financials"]'),
        adjustments: document.querySelector('[data-page="adjustments"]'),
        reports: document.querySelector('[data-page="reports"]'),
        settings: document.querySelector('[data-page="settings"]')
      };
      
      // Nurse can only see: Accounts (Laboratory), Journals (Receipt), Adjustments, Reports, Settings
      if (!permissions.canWrite) {
        // Show only specific links for nurse
        const nursePages = ['accounts', 'journals', 'adjustments', 'reports', 'settings'];
        
        Object.keys(navLinks).forEach(key => {
          if (navLinks[key]) {
            if (nursePages.includes(key)) {
              navLinks[key].style.display = 'block';
            } else {
              navLinks[key].style.display = 'none';
            }
          }
        });
        
        // If currently on a hidden page, redirect to first available page (accounts/laboratory)
        const currentPage = document.querySelector('.page.active');
        if (currentPage && !nursePages.includes(currentPage.id)) {
          document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
          document.getElementById('accounts').classList.add('active');
          document.querySelectorAll('.sidebar nav a').forEach(l => l.classList.remove('active'));
          navLinks.accounts.classList.add('active');
        }
      } else {
        // Show all links for owner/admin
        Object.values(navLinks).forEach(link => {
          if (link) link.style.display = 'block';
        });
      }
      
      // Hide/show add product button based on write permission
      const addProductBtn = document.getElementById('addProductBtn');
      if (addProductBtn) {
        if (permissions.canWrite) {
          addProductBtn.style.display = 'block';
        } else {
          addProductBtn.style.display = 'none';
        }
      }
      
      // Hide/show category management for nurses
      const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
      if (manageCategoriesBtn) {
        if (permissions.canWrite) {
          manageCategoriesBtn.style.display = 'block';
        } else {
          manageCategoriesBtn.style.display = 'none';
        }
      }
      
      // Show notification about role change
      showRoleNotification(currentRole);
    }
    
    // Show role change notification
    function showRoleNotification(role) {
      const data = roleData[role];
      const permissions = [];
      
      if (data.permissions.canView) permissions.push('View');
      if (data.permissions.canWrite) permissions.push('Write');
      if (data.permissions.canDelete) permissions.push('Delete');
      if (data.permissions.canMonitor) permissions.push('Monitor');
      
      // Show in modal instead of alert
      stockDetailTitle.textContent = `Role Changed: ${data.role}`;
      stockDetailBody.innerHTML = `
        <div style="padding: 1rem 0;">
          <div style="margin-bottom: 1.5rem;">
            <div style="font-size: 1.1rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem;">
              Welcome, ${data.name}
            </div>
            <div style="color: #6b7280; font-size: 0.9rem;">
              You are now logged in as <strong>${data.role}</strong>
            </div>
          </div>
          
          <div class="stock-summary">
            <div class="stock-summary-title">Your Permissions</div>
            ${permissions.map(p => `
              <div style="padding: 0.5rem 0; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2rem;">✓</span>
                <span>${p}</span>
              </div>
            `).join('')}
          </div>
          
          <div style="margin-top: 1rem; padding: 0.875rem; background: #f3f4f6; border-radius: 6px; font-size: 0.85rem; color: #6b7280;">
            <strong>Note:</strong> This is a simulation. Database integration pending.
          </div>
        </div>
      `;
      stockDetailModal.classList.add('active');
    }
    
    // Role switch handlers
    document.querySelectorAll('.role-switch').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.dataset.role;
        updateUIForRole(role);
      });
    });
    
    // Logout handler
    document.querySelector('.logout-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        alert('Logout functionality will be implemented with backend integration.');
      }
    });

    // Page navigation
    const pageLinks = document.querySelectorAll('.sidebar nav a');
    const pages = document.querySelectorAll('.page');

    pageLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.dataset.page;

        // Hide all main pages
        pages.forEach(p => p.classList.remove('active'));
        
        // Hide restock and manual update pages (defined later in code)
        const restockPageEl = document.getElementById('restockPage');
        const manualUpdatePageEl = document.getElementById('manualUpdatePage');
        if (restockPageEl) restockPageEl.style.display = 'none';
        if (manualUpdatePageEl) manualUpdatePageEl.style.display = 'none';
        
        // Show target page
        const targetPage = document.getElementById(target);
        if (targetPage) targetPage.classList.add('active');

        // Update active link
        pageLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Close sidebar on mobile after clicking
        if (window.innerWidth < 768) {
          sidebar.classList.remove('open');
        }
      });
    });

    // Charts
    let revExpChart, cashFlowChart, profitMarginChart;
    
    // Sample dashboard data
    const dashboardData = {
      today: {
        assets: 500000,
        liabilities: 200000,
        revenue: 12000,
        expenses: 7500,
        netProfit: 4500,
        incomeExpenses: {
          labels: ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'],
          income: [300, 280, 250, 230, 200, 350, 500, 700, 900, 1100, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 2700, 2400, 2100, 1800, 1500],
          expenses: [200, 190, 180, 170, 150, 250, 350, 500, 650, 850, 1000, 1150, 1300, 1450, 1600, 1750, 1900, 2000, 2100, 2000, 1800, 1600, 1400, 1200]
        },
        cashFlow: {
          labels: ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'],
          data: [100, 90, 70, 60, 50, 100, 150, 200, 250, 250, 400, 450, 500, 550, 600, 650, 700, 800, 900, 700, 600, 500, 400, 300]
        },
        profitMargin: {
          labels: ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'],
          data: [33, 32, 28, 26, 25, 29, 30, 29, 28, 23, 29, 28, 28, 27, 27, 27, 27, 29, 30, 26, 25, 24, 22, 20]
        },
        transactions: [
          { date: '26-01-23 02:15', desc: 'Emergency #1028', amount: '₱3,500', status: 'Paid' },
          { date: '26-01-23 08:30', desc: 'Consultation #1030', amount: '₱2,000', status: 'Paid' },
          { date: '26-01-23 10:15', desc: 'Lab Test #1031', amount: '₱1,800', status: 'Paid' },
          { date: '26-01-23 14:20', desc: 'X-Ray #1032', amount: '₱2,500', status: 'Paid' },
          { date: '26-01-23 18:45', desc: 'Surgery #1033', amount: '₱15,000', status: 'Unpaid' },
          { date: '26-01-23 22:30', desc: 'Emergency #1034', amount: '₱4,200', status: 'Paid' }
        ],
        alerts: [
          { invoice: '#1033', dueDate: '26-01-23 20:00', status: 'Pending Payment' }
        ]
      },
      month: {
        assets: 500000,
        liabilities: 200000,
        revenue: 120000,
        expenses: 75500,
        netProfit: 44500,
        incomeExpenses: {
          labels: ['Day 1-5', 'Day 6-10', 'Day 11-15', 'Day 16-20', 'Day 21-25', 'Day 26-31'],
          income: [15000, 18000, 20000, 17000, 22000, 28000],
          expenses: [9000, 11000, 12000, 10500, 13000, 15000]
        },
        cashFlow: {
          labels: ['Day 1-5', 'Day 6-10', 'Day 11-15', 'Day 16-20', 'Day 21-25', 'Day 26-31'],
          data: [6000, 7000, 8000, 6500, 9000, 13000]
        },
        profitMargin: {
          labels: ['Day 1-5', 'Day 6-10', 'Day 11-15', 'Day 16-20', 'Day 21-25', 'Day 26-31'],
          data: [40, 39, 40, 38, 41, 46]
        },
        transactions: [
          { date: '26-01-10', desc: 'Invoice #1023', amount: '₱5,000', status: 'Paid' },
          { date: '26-01-11', desc: 'Invoice #1024', amount: '₱7,500', status: 'Unpaid' },
          { date: '26-01-12', desc: 'Invoice #1025', amount: '₱3,200', status: 'Paid' },
          { date: '26-01-15', desc: 'Invoice #1026', amount: '₱8,900', status: 'Paid' },
          { date: '26-01-18', desc: 'Invoice #1027', amount: '₱4,200', status: 'Paid' }
        ],
        alerts: [
          { invoice: '#1024', dueDate: '26-01-15', status: 'Overdue' }
        ]
      },
      year: {
        assets: 500000,
        liabilities: 200000,
        revenue: 1440000,
        expenses: 906000,
        netProfit: 534000,
        incomeExpenses: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          income: [15000, 18000, 20000, 17000, 22000, 28000, 24000, 26000, 23000, 25000, 27000, 30000],
          expenses: [9000, 11000, 12000, 10500, 13000, 15000, 14000, 15500, 13500, 14500, 16000, 17000]
        },
        cashFlow: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          data: [6000, 7000, 8000, 6500, 9000, 13000, 10000, 10500, 9500, 10500, 11000, 13000]
        },
        profitMargin: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          data: [40, 39, 40, 38, 41, 46, 42, 41, 41, 42, 41, 43]
        },
        transactions: [
          { date: '26-01-10', desc: 'Invoice #1023', amount: '₱5,000', status: 'Paid' },
          { date: '26-02-15', desc: 'Invoice #1024', amount: '₱7,500', status: 'Paid' },
          { date: '26-03-20', desc: 'Invoice #1025', amount: '₱8,200', status: 'Paid' },
          { date: '26-04-12', desc: 'Invoice #1026', amount: '₱6,500', status: 'Paid' },
          { date: '26-05-18', desc: 'Invoice #1027', amount: '₱9,200', status: 'Paid' }
        ],
        alerts: []
      }
    };
    
    function initializeCharts() {
      const data = dashboardData.month;
      
      revExpChart = new Chart(document.getElementById('revExp'), {
        type: 'line',
        data: {
          labels: data.incomeExpenses.labels,
          datasets: [
            { label: 'Income', data: data.incomeExpenses.income, borderColor:'#2563eb', tension:0.4, fill:false },
            { label: 'Expenses', data: data.incomeExpenses.expenses, borderColor:'#ef4444', tension:0.4, fill:false }
          ]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: true,
          plugins: { legend: { position:'bottom' } },
          scales: {
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 45,
                autoSkip: false,
                font: {
                  size: 10
                }
              }
            }
          }
        }
      });

      cashFlowChart = new Chart(document.getElementById('cashFlow'), {
        type: 'bar',
        data: {
          labels: data.cashFlow.labels,
          datasets: [{ label: 'Cash Flow', data: data.cashFlow.data, backgroundColor:'#10b981' }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: true,
          plugins: { legend: { display:false } },
          scales: {
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 45,
                autoSkip: false,
                font: {
                  size: 10
                }
              }
            }
          }
        }
      });

      profitMarginChart = new Chart(document.getElementById('profitMargin'), {
        type: 'line',
        data: {
          labels: data.profitMargin.labels,
          datasets: [{ label: 'Profit Margin %', data: data.profitMargin.data, borderColor:'#f59e0b', tension:0.4, fill:false }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: true,
          plugins: { legend: { position:'bottom' } }, 
          scales: { 
            y: { beginAtZero:true, max:100 },
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 45,
                autoSkip: false,
                font: {
                  size: 10
                }
              }
            }
          } 
        }
      });
    }
    
    function updateDashboardData(period) {
      const data = dashboardData[period];
      
      // Update date display
      const today = new Date();
      const dashboardDateEl = document.getElementById('dashboardDate');
      
      if (period === 'today') {
        // Format: "January 23, 2026"
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dashboardDateEl.textContent = today.toLocaleDateString('en-US', options);
      } else if (period === 'month') {
        // Format: "January 2026"
        const options = { year: 'numeric', month: 'long' };
        dashboardDateEl.textContent = today.toLocaleDateString('en-US', options);
      } else if (period === 'year') {
        // Format: "2026"
        dashboardDateEl.textContent = today.getFullYear().toString();
      }
      
      // Update financial cards
      document.getElementById('totalAssets').textContent = `₱${data.assets.toLocaleString()}`;
      document.getElementById('totalLiabilities').textContent = `₱${data.liabilities.toLocaleString()}`;
      document.getElementById('totalRevenue').textContent = `₱${data.revenue.toLocaleString()}`;
      document.getElementById('totalExpenses').textContent = `₱${data.expenses.toLocaleString()}`;
      document.getElementById('netProfit').textContent = `₱${data.netProfit.toLocaleString()}`;
      
      // Update chart titles
      const titleSuffix = period === 'today' ? ' (Today)' : period === 'month' ? ' (This Month)' : ' (This Year)';
      document.getElementById('incomeExpensesTitle').textContent = 'Income vs Expenses' + titleSuffix;
      document.getElementById('cashFlowTitle').textContent = 'Cash Flow Trends' + titleSuffix;
      document.getElementById('profitMarginTitle').textContent = 'Profit Margins' + titleSuffix;
      
      // Update charts
      revExpChart.data.labels = data.incomeExpenses.labels;
      revExpChart.data.datasets[0].data = data.incomeExpenses.income;
      revExpChart.data.datasets[1].data = data.incomeExpenses.expenses;
      revExpChart.update();
      
      cashFlowChart.data.labels = data.cashFlow.labels;
      cashFlowChart.data.datasets[0].data = data.cashFlow.data;
      cashFlowChart.update();
      
      profitMarginChart.data.labels = data.profitMargin.labels;
      profitMarginChart.data.datasets[0].data = data.profitMargin.data;
      profitMarginChart.update();
      
      // Update transactions
      const transactionsBody = document.getElementById('transactionsBody');
      transactionsBody.innerHTML = data.transactions.map(t => `
        <tr>
          <td class="date" data-label="Date">${t.date}</td>
          <td data-label="Description">${t.desc}</td>
          <td data-label="Amount">${t.amount}</td>
          <td data-label="Status">${t.status}</td>
        </tr>
      `).join('');
      
      // Update alerts
      const alertsBody = document.getElementById('alertsBody');
      if (data.alerts.length === 0) {
        alertsBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No alerts</td></tr>';
      } else {
        alertsBody.innerHTML = data.alerts.map(a => `
          <tr>
            <td data-label="Invoice">${a.invoice}</td>
            <td class="date" data-label="Due Date">${a.dueDate}</td>
            <td data-label="Status">${a.status}</td>
          </tr>
        `).join('');
      }
    }
    
    initializeCharts();

    // === DASHBOARD PERIOD SELECTOR (Moved outside inventory block) ===
    let currentPeriod = 'today';
    const periodBtns = document.querySelectorAll('.period-btn');
    
    periodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentPeriod = btn.dataset.period;
        periodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (typeof updateDashboardOverview === 'function') updateDashboardOverview();
        if (typeof updateDashboardData === 'function') updateDashboardData(currentPeriod);
      });
    });
    
    // === MODAL CLOSE HANDLERS (Moved outside inventory block) ===
    const addProductModal = document.getElementById('addProductModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const addProductForm = document.getElementById('addProductForm');
    const productDate = document.getElementById('productDate');
    const productCategory = document.getElementById('productCategory');
    
    // Categories array
    let categories = ['IV', 'TAB/CAPS', 'BY GALLON', 'BY BOX', 'BY PIECE'];
    
    // Populate category dropdown
    function populateCategoryDropdown() {
      if (productCategory) {
        productCategory.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat;
          option.textContent = cat;
          productCategory.appendChild(option);
        });
      }
    }
    
    // Category Management Modal
    const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
    const categoryModal = document.getElementById('categoryModal');
    const closeCategoryModal = document.getElementById('closeCategoryModal');
    const closeCategoryBtn = document.getElementById('closeCategoryBtn');
    const categoryList = document.getElementById('categoryList');
    const newCategoryInput = document.getElementById('newCategoryInput');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    
    // Render category list in management modal
    function renderCategoryList() {
      if (categoryList) {
        categoryList.innerHTML = categories.map((cat, index) => `
          <div class="category-item" data-index="${index}">
            <input type="text" class="category-name-input" value="${cat}" data-index="${index}" />
          </div>
        `).join('');
      }
    }
    
    // Save all category changes
    function saveAllCategories() {
      const inputs = document.querySelectorAll('.category-name-input');
      let hasChanges = false;
      
      inputs.forEach((input, index) => {
        const newName = input.value.trim();
        if (newName && newName !== categories[index]) {
          categories[index] = newName;
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        // Disable button and show loading state
        const saveBtn = document.getElementById('saveCategoriesBtn');
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.textContent = '💾 Saving...';
          saveBtn.style.opacity = '0.6';
        }
        
        // Simulate save with animation
        setTimeout(() => {
          populateCategoryDropdown();
          console.log('Updated categories:', categories);
          
          // Show success state
          if (saveBtn) {
            saveBtn.textContent = '✅ Saved!';
            saveBtn.style.background = '#10b981';
            saveBtn.style.opacity = '1';
          }
          
          // Close modal after short delay
          setTimeout(() => {
            if (categoryModal) {
              categoryModal.classList.remove('active');
            }
            
            // Reset button state
            if (saveBtn) {
              saveBtn.disabled = false;
              saveBtn.textContent = '💾 Save';
              saveBtn.style.background = '#2563eb';
            }
          }, 800);
          
        }, 600);
      } else {
        alert('ℹ️ No changes to save.');
      }
    }
    
    // Open category management modal
    if (manageCategoriesBtn && categoryModal) {
      manageCategoriesBtn.addEventListener('click', () => {
        categoryModal.classList.add('active');
        renderCategoryList();
      });
    }
    
    // Close category modal
    if (closeCategoryModal && categoryModal) {
      closeCategoryModal.addEventListener('click', () => {
        categoryModal.classList.remove('active');
      });
    }
    
    if (closeCategoryBtn && categoryModal) {
      closeCategoryBtn.addEventListener('click', () => {
        categoryModal.classList.remove('active');
      });
    }
    
    // Add new category
    const saveCategoriesBtn = document.getElementById('saveCategoriesBtn');
    
    if (saveCategoriesBtn) {
      saveCategoriesBtn.addEventListener('click', () => {
        saveAllCategories();
      });
    }
    
    if (addCategoryBtn && newCategoryInput) {
      addCategoryBtn.addEventListener('click', () => {
        const newCat = newCategoryInput.value.trim();
        if (newCat && !categories.includes(newCat)) {
          categories.push(newCat);
          newCategoryInput.value = '';
          renderCategoryList();
          populateCategoryDropdown();
          alert(`✅ Category "${newCat}" added successfully!`);
        } else if (categories.includes(newCat)) {
          alert('⚠️ This category already exists!');
        } else {
          alert('⚠️ Please enter a category name.');
        }
      });
    }
    
    // Initialize category dropdown
    populateCategoryDropdown();
    
    // Add Product Form Submit Handler
    console.log('=== SETTING UP ADD PRODUCT HANDLER ===');
    console.log('addProductForm:', addProductForm);
    
    if (addProductForm) {
      console.log('Adding submit event listener to form');
      
      // Try to attach to button directly as well
      const addProductBtn = addProductForm.querySelector('button[type="submit"]');
      console.log('Add Product Button:', addProductBtn);
      
      if (addProductBtn) {
        addProductBtn.addEventListener('click', (e) => {
          console.log('🔥 BUTTON CLICKED! 🔥');
          e.preventDefault(); // Prevent default form submission
          
          // Get form values
          const productDateVal = document.getElementById('productDate').value;
          const productCategoryVal = document.getElementById('productCategory').value;
          const productNameVal = document.getElementById('productName').value;
          const productExpiryVal = document.getElementById('productExpiry').value;
          const productQtyVal = document.getElementById('productQty').value;
          const productStatusVal = document.getElementById('productStatus').value;
          
          console.log('Form values:', {
            date: productDateVal,
            category: productCategoryVal,
            name: productNameVal,
            expiry: productExpiryVal,
            qty: productQtyVal,
            status: productStatusVal
          });
          
          // Validation
          if (!productCategoryVal) {
            alert('⚠️ Please select a category');
            return;
          }
          
          if (!productNameVal.trim()) {
            alert('⚠️ Please enter a product name');
            return;
          }
          
          if (!productExpiryVal) {
            alert('⚠️ Please select an expiry date');
            return;
          }
          
          const newProduct = {
            product: productNameVal.trim(),
            category: productCategoryVal,
            expiry: productExpiryVal,
            stock: parseInt(productQtyVal) || 0,  // Use 'stock' not 'qty'
            dateAdded: productDateVal
          };
          
          console.log('Adding product:', newProduct);
          
          // Add to productsMaster array
          productsMaster.push(newProduct);
          console.log('Product added! Total products:', productsMaster.length);
          
          // Show success animation
          addProductBtn.disabled = true;
          addProductBtn.textContent = '✓ Adding...';
          addProductBtn.style.background = '#6b7280';
          
          setTimeout(() => {
            // Success state
            addProductBtn.textContent = '✅ Added!';
            addProductBtn.style.background = '#10b981';
            
            // Re-render inventory if on inventory page
            if (typeof renderInventoryProducts === 'function') {
              renderInventoryProducts();
            }
            
            // Update dashboard if needed
            if (typeof updateDashboardOverview === 'function') {
              updateDashboardOverview();
            }
            
            // Close modal after delay
            setTimeout(() => {
              addProductModal.classList.remove('active');
              addProductForm.reset();
              if (productDate) productDate.value = new Date().toISOString().split('T')[0];
              
              // Reset button
              addProductBtn.disabled = false;
              addProductBtn.textContent = 'Add Product';
              addProductBtn.style.background = '#2563eb';
            }, 1000);
            
          }, 500);
        });
      }
      
      addProductForm.addEventListener('submit', (e) => {
        console.log('🔥 FORM SUBMITTED! 🔥');
        e.preventDefault();
        
        const productDateVal = document.getElementById('productDate').value;
        const productCategoryVal = document.getElementById('productCategory').value;
        const productNameVal = document.getElementById('productName').value;
        const productExpiryVal = document.getElementById('productExpiry').value;
        const productQtyVal = document.getElementById('productQty').value;
        const productStatusVal = document.getElementById('productStatus').value;
        
        if (!productCategoryVal) {
          alert('⚠️ Please select a category');
          return;
        }
        
        if (!productNameVal.trim()) {
          alert('⚠️ Please enter a product name');
          return;
        }
        
        const newProduct = {
          product: productNameVal.trim(),
          category: productCategoryVal,
          expiry: productExpiryVal,
          qty: parseInt(productQtyVal) || 0,
          status: productStatusVal,
          dateAdded: productDateVal
        };
        
        console.log('Adding product:', newProduct);
        
        // Add to productsMaster array
        productsMaster.push(newProduct);
        
        // Show success animation
        const submitBtn = addProductForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '✓ Adding...';
          submitBtn.style.background = '#6b7280';
        }
        
        setTimeout(() => {
          // Success state
          if (submitBtn) {
            submitBtn.textContent = '✅ Added!';
            submitBtn.style.background = '#10b981';
          }
          
          // Re-render inventory if on inventory page
          if (typeof renderInventoryProducts === 'function') {
            renderInventoryProducts();
          }
          
          // Update dashboard if needed
          if (typeof updateDashboardOverview === 'function') {
            updateDashboardOverview();
          }
          
          console.log('Product added! Total products:', productsMaster.length);
          
          // Close modal after delay
          setTimeout(() => {
            addProductModal.classList.remove('active');
            addProductForm.reset();
            if (productDate) productDate.value = new Date().toISOString().split('T')[0];
            
            // Reset button
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Add Product';
              submitBtn.style.background = '#2563eb';
            }
          }, 1000);
          
        }, 500);
      });
    }
    
    if (closeModal && addProductModal) {
      closeModal.addEventListener('click', () => {
        addProductModal.classList.remove('active');
        if (addProductForm) addProductForm.reset();
        if (productDate) productDate.value = new Date().toISOString().split('T')[0];
      });
    }
    
    if (cancelBtn && addProductModal) {
      cancelBtn.addEventListener('click', () => {
        addProductModal.classList.remove('active');
        if (addProductForm) addProductForm.reset();
        if (productDate) productDate.value = new Date().toISOString().split('T')[0];
      });
    }

    // === DASHBOARD INITIALIZATION ===
    // Removed from here - moved to after productsMaster is defined

    // === INVENTORY SYSTEM === (OLD - DISABLED)
    // Wrap in check to prevent errors since we're using new system
    if (document.getElementById('calendarViewBtn')) {
    const inventoryBody = document.getElementById('inventoryBody');
    const monthSelect = document.getElementById('monthSelect');
    const yearInput = document.getElementById('yearInput');
    const goDateBtn = document.getElementById('goDate');
    const searchInput = document.getElementById('searchProduct');
    const calendarViewBtn = document.getElementById('calendarViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const detailedViewBtn = document.getElementById('detailedViewBtn');
    const calendarViewContainer = document.getElementById('calendarViewContainer');
    const listViewContainer = document.getElementById('listViewContainer');
    const detailedViewContainer = document.getElementById('detailedViewContainer');
    const detailedInventoryBody = document.getElementById('detailedInventoryBody');
    const calendarHeader = document.getElementById('calendarHeader');
    const calendarDays = document.getElementById('calendarDays');
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductModal = document.getElementById('addProductModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const addProductForm = document.getElementById('addProductForm');
    const productDate = document.getElementById('productDate');
    const productCategory = document.getElementById('productCategory');
    
    // Date navigation controls
    const currentDateDisplay = document.getElementById('currentDateDisplay');
    const dateValueDisplay = document.getElementById('dateValueDisplay');
    const prevDateBtn = document.getElementById('prevDateBtn');
    const nextDateBtn = document.getElementById('nextDateBtn');
    
    console.log('Button elements:', { prevDateBtn, nextDateBtn });
    
    if (!prevDateBtn || !nextDateBtn) {
      console.error('Navigation buttons not found in DOM!');
    }
    
    // Category Management
    const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
    const categoryModal = document.getElementById('categoryModal');
    const closeCategoryModal = document.getElementById('closeCategoryModal');
    const closeCategoryBtn = document.getElementById('closeCategoryBtn');
    const categoryList = document.getElementById('categoryList');
    const newCategoryInput = document.getElementById('newCategoryInput');
    const addCategoryBtn = document.getElementById('addCategoryBtn');

    let currentMonth = new Date().getMonth(); // Current month
    let currentYear = new Date().getFullYear(); // Current year
    let currentView = 'calendar';
    let selectedDate = null;
    let viewingSpecificDate = false; // Track if viewing specific date or full month
    
    // Categories array
    let categories = ['IV', 'TABS/CAPS', 'GALLON', 'BOX', 'PIECE'];

    // Sample inventory data
    let inventoryData = [
      { date: '2026-01-21', category: 'BOX', product: 'Surgical Gloves', batch: 'A101/2027-06', qty: 50, status: 'Available' },
      { date: '2026-01-21', category: 'PIECE', product: 'Syringe 5ml', batch: 'B201/2027-12', qty: 30, status: 'Low Stock' },
      { date: '2026-01-22', category: 'IV', product: 'Saline Solution', batch: 'C301/2026-08', qty: 100, status: 'Available' },
      { date: '2026-01-23', category: 'BOX', product: 'Bandages', batch: 'D401/2027-03', qty: 75, status: 'Available' },
      { date: '2026-01-23', category: 'BOX', product: 'Alcohol Swabs', batch: 'E501/2026-11', qty: 15, status: 'Low Stock' },
      { date: '2026-01-25', category: 'PIECE', product: 'Face Masks', batch: 'F601/2027-01', qty: 200, status: 'Available' },
      { date: '2026-01-28', category: 'BOX', product: 'Cotton Balls', batch: 'G701/2027-05', qty: 5, status: 'Out of Stock' },
      { date: '2026-01-21', category: 'TABS/CAPS', product: 'Paracetamol 500mg', batch: 'H801/2027-09', qty: 120, status: 'Available' },
      { date: '2026-01-22', category: 'GALLON', product: 'Distilled Water', batch: 'I901/2026-12', qty: 25, status: 'Available' },
      { date: '2026-01-23', category: 'IV', product: 'Dextrose 5%', batch: 'J101/2027-04', qty: 45, status: 'Low Stock' },
    ];

    // Set today's date in modal by default
    const today = new Date().toISOString().split('T')[0];
    productDate.value = today;
    
    // Stock Detail Modal elements
    const stockDetailModal = document.getElementById('stockDetailModal');
    const closeStockDetailModal = document.getElementById('closeStockDetailModal');
    const closeStockDetailBtn = document.getElementById('closeStockDetailBtn');
    const stockDetailTitle = document.getElementById('stockDetailTitle');
    const stockDetailBody = document.getElementById('stockDetailBody');
    
    // Update dashboard inventory overview
    function updateDashboardOverview() {
      // Dashboard inventory overview is now updated by updateStatusCounts()
      // This function remains for compatibility with period buttons
      if (typeof updateStatusCounts === 'function') {
        updateStatusCounts();
      }
    }
    
    // Show stock detail modal
    function showStockDetail(status) {
      const today = new Date();
      let filteredItems = [];
      
      // Filter by period
      if (currentPeriod === 'today') {
        const todayStr = today.toISOString().split('T')[0];
        filteredItems = inventoryData.filter(item => item.date === todayStr);
      } else if (currentPeriod === 'month') {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        filteredItems = inventoryData.filter(item => item.date >= monthStart && item.date <= monthEnd);
      } else if (currentPeriod === 'year') {
        const yearStart = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        const yearEnd = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
        filteredItems = inventoryData.filter(item => item.date >= yearStart && item.date <= yearEnd);
      }
      
      let items;
      
      if (status === 'Expiring Soon') {
        // Get expiring items
        items = filteredItems.filter(item => {
          if (!item.batch) return false;
          const parts = item.batch.split('/');
          if (parts.length < 2) return false;
          const expiryParts = parts[1].split('-');
          if (expiryParts.length < 2) return false;
          
          const expiryYear = parseInt(expiryParts[0]);
          const expiryMonth = parseInt(expiryParts[1]) - 1;
          const expiryDate = new Date(expiryYear, expiryMonth, 1);
          
          const diffTime = expiryDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return diffDays <= 30 && diffDays >= 0;
        });
      } else {
        items = filteredItems.filter(item => item.status === status);
      }
      
      const periodText = currentPeriod === 'today' ? 'Today' : 
                        currentPeriod === 'month' ? 'This Month' : 'This Year';
      
      if (items.length === 0) {
        stockDetailTitle.textContent = `${status} - ${periodText}`;
        stockDetailBody.innerHTML = `
          <div class="empty-state" style="padding: 2rem;">
            <div class="empty-state-icon">📦</div>
            <p>No items with "${status}" status in ${periodText.toLowerCase()}</p>
          </div>
        `;
      } else {
        stockDetailTitle.textContent = `${status} - ${periodText}`;
        
        // Group by category
        const grouped = {};
        items.forEach(item => {
          if (!grouped[item.category]) grouped[item.category] = [];
          grouped[item.category].push(item);
        });
        
        let html = '';
        Object.keys(grouped).sort().forEach(category => {
          html += `
            <div class="stock-detail-category">
              <div class="stock-category-header">${category}</div>
          `;
          
          grouped[category].forEach(item => {
            html += `
              <div class="stock-item">
                <div class="stock-item-name">${item.product}</div>
                <div class="stock-item-details">
                  <div class="stock-item-detail">
                    <strong>Date:</strong> <span>${item.date}</span>
                  </div>
                  <div class="stock-item-detail">
                    <strong>Batch:</strong> <span>${item.batch}</span>
                  </div>
                  <div class="stock-item-detail">
                    <strong>Qty:</strong> <span>${item.qty}</span>
                  </div>
                  <div class="stock-item-detail">
                    <strong>Status:</strong> <span>${item.status}</span>
                  </div>
                </div>
              </div>
            `;
          });
          
          html += `</div>`;
        });
        
        // Add summary
        const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
        html += `
          <div class="stock-summary">
            <div class="stock-summary-title">Summary</div>
            <div><span>Total Items</span><span>${items.length}</span></div>
            <div><span>Total Quantity</span><span>${totalQty}</span></div>
          </div>
        `;
        
        stockDetailBody.innerHTML = html;
      }
      
      stockDetailModal.classList.add('active');
    }
    
    // Close stock detail modal
    closeStockDetailModal.addEventListener('click', () => {
      stockDetailModal.classList.remove('active');
    });
    
    closeStockDetailBtn.addEventListener('click', () => {
      stockDetailModal.classList.remove('active');
    });
    
    // Add click/touch handlers to overview cards
    document.querySelectorAll('.overview-card').forEach(card => {
      let touchTimer;
      let touchStarted = false;
      
      // Desktop: Double-click
      card.addEventListener('dblclick', () => {
        const status = card.dataset.status;
        showStockDetail(status);
      });
      
      // Mobile: Touch and hold
      card.addEventListener('touchstart', (e) => {
        touchStarted = true;
        card.classList.add('pressing');
        touchTimer = setTimeout(() => {
          const status = card.dataset.status;
          card.classList.remove('pressing');
          showStockDetail(status);
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }, 500);
      });
      
      card.addEventListener('touchend', () => {
        clearTimeout(touchTimer);
        card.classList.remove('pressing');
        setTimeout(() => { touchStarted = false; }, 100);
      });
      
      card.addEventListener('touchmove', () => {
        clearTimeout(touchTimer);
        card.classList.remove('pressing');
      });
    });
    
    // Update date display in list view
    function updateDateDisplay() {
      const dateValueEl = document.getElementById('dateValueDisplay');
      
      if (viewingSpecificDate && selectedDate) {
        const date = new Date(selectedDate + 'T00:00:00');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateValueEl.textContent = date.toLocaleDateString('en-US', options);
      } else {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        dateValueEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
      }
    }
    
    // Navigate to previous date
    window.handlePrevDate = function() {
      console.log('handlePrevDate called', { viewingSpecificDate, selectedDate, currentMonth, currentYear });
      
      if (viewingSpecificDate && selectedDate) {
        // Navigate to previous day
        const parts = selectedDate.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        
        const date = new Date(year, month, day);
        date.setDate(date.getDate() - 1);
        
        const newYear = date.getFullYear();
        const newMonth = String(date.getMonth() + 1).padStart(2, '0');
        const newDay = String(date.getDate()).padStart(2, '0');
        selectedDate = `${newYear}-${newMonth}-${newDay}`;
        
        // Update month/year if crossing month boundary
        currentMonth = date.getMonth();
        currentYear = date.getFullYear();
        monthSelect.value = currentMonth;
        yearInput.value = currentYear;
        
        console.log('Moving to previous day:', selectedDate);
        updateDateDisplay();
        renderListViewForDate(selectedDate);
      } else {
        // Navigate to previous month
        if (currentMonth === 0) {
          currentMonth = 11;
          currentYear--;
        } else {
          currentMonth--;
        }
        
        monthSelect.value = currentMonth;
        yearInput.value = currentYear;
        
        console.log('Moving to previous month:', currentMonth, currentYear);
        updateDateDisplay();
        renderListView();
      }
    };
    
    // Navigate to next date
    window.handleNextDate = function() {
      console.log('handleNextDate called', { viewingSpecificDate, selectedDate, currentMonth, currentYear });
      
      if (viewingSpecificDate && selectedDate) {
        // Navigate to next day
        const parts = selectedDate.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        
        const date = new Date(year, month, day);
        date.setDate(date.getDate() + 1);
        
        const newYear = date.getFullYear();
        const newMonth = String(date.getMonth() + 1).padStart(2, '0');
        const newDay = String(date.getDate()).padStart(2, '0');
        selectedDate = `${newYear}-${newMonth}-${newDay}`;
        
        // Update month/year if crossing month boundary
        currentMonth = date.getMonth();
        currentYear = date.getFullYear();
        monthSelect.value = currentMonth;
        yearInput.value = currentYear;
        
        console.log('Moving to next day:', selectedDate);
        updateDateDisplay();
        renderListViewForDate(selectedDate);
      } else {
        // Navigate to next month
        if (currentMonth === 11) {
          currentMonth = 0;
          currentYear++;
        } else {
          currentMonth++;
        }
        
        monthSelect.value = currentMonth;
        yearInput.value = currentYear;
        
        console.log('Moving to next month:', currentMonth, currentYear);
        updateDateDisplay();
        renderListView();
      }
    };
    
    // Populate category dropdown
    function populateCategoryDropdown() {
      productCategory.innerHTML = '<option value="">Select Category</option>';
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        productCategory.appendChild(option);
      });
    }
    
    // Render category list in management modal
    function renderCategoryList() {
      categoryList.innerHTML = categories.map((cat, index) => `
        <div class="category-item">
          <input type="text" value="${cat}" id="cat-${index}" disabled>
          <div class="category-item-actions">
            <button class="btn-icon edit" onclick="editCategory(${index})">✏️</button>
            <button class="btn-icon delete" onclick="deleteCategory(${index})">🗑️</button>
          </div>
        </div>
      `).join('');
    }
    
    // Edit category
    window.editCategory = function(index) {
      const input = document.getElementById(`cat-${index}`);
      const isDisabled = input.disabled;
      
      if (isDisabled) {
        input.disabled = false;
        input.focus();
        input.select();
      } else {
        const newName = input.value.trim();
        if (newName && newName !== categories[index]) {
          // Update category name in inventory data
          const oldName = categories[index];
          inventoryData.forEach(item => {
            if (item.category === oldName) {
              item.category = newName;
            }
          });
          categories[index] = newName;
          categories.sort();
          populateCategoryDropdown();
          renderCategoryList();
          
          // Refresh view if needed
          if (currentView === 'list') {
            renderListView();
          } else {
            renderCalendar();
          }
        }
        input.disabled = true;
      }
    };
    
    // Delete category
    window.deleteCategory = function(index) {
      const categoryToDelete = categories[index];
      const itemsInCategory = inventoryData.filter(item => item.category === categoryToDelete).length;
      
      if (itemsInCategory > 0) {
        if (!confirm(`There are ${itemsInCategory} product(s) in "${categoryToDelete}". Delete anyway?`)) {
          return;
        }
      }
      
      categories.splice(index, 1);
      populateCategoryDropdown();
      renderCategoryList();
      
      // Refresh view if needed
      if (currentView === 'list') {
        renderListView();
      }
    };
    
    // Add new category
    addCategoryBtn.addEventListener('click', () => {
      const newCategory = newCategoryInput.value.trim().toUpperCase();
      
      if (!newCategory) {
        alert('Please enter a category name');
        return;
      }
      
      if (categories.includes(newCategory)) {
        alert('Category already exists');
        return;
      }
      
      categories.push(newCategory);
      categories.sort();
      newCategoryInput.value = '';
      populateCategoryDropdown();
      renderCategoryList();
    });
    
    // Category modal controls
    manageCategoriesBtn.addEventListener('click', () => {
      renderCategoryList();
      categoryModal.classList.add('active');
    });
    
    closeCategoryModal.addEventListener('click', () => {
      categoryModal.classList.remove('active');
    });
    
    closeCategoryBtn.addEventListener('click', () => {
      categoryModal.classList.remove('active');
    });
    
    // Initialize category dropdown
    populateCategoryDropdown();

    // View Toggle
    calendarViewBtn.addEventListener('click', () => {
      currentView = 'calendar';
      viewingSpecificDate = false;
      calendarViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
      detailedViewBtn.classList.remove('active');
      calendarViewContainer.style.display = 'block';
      listViewContainer.classList.remove('active');
      detailedViewContainer.classList.remove('active');
      renderCalendar();
    });

    listViewBtn.addEventListener('click', () => {
      // Only switch if not already in list view
      if (currentView !== 'list') {
        currentView = 'list';
        listViewBtn.classList.add('active');
        calendarViewBtn.classList.remove('active');
        detailedViewBtn.classList.remove('active');
        calendarViewContainer.style.display = 'none';
        listViewContainer.classList.add('active');
        detailedViewContainer.classList.remove('active');
        
        // If a date was selected in calendar, show that specific date in list view
        if (selectedDate) {
          viewingSpecificDate = true;
          updateDateDisplay();
          renderListViewForDate(selectedDate);
        } else {
          // Otherwise show the full month
          viewingSpecificDate = false;
          updateDateDisplay();
          renderListView();
        }
      }
    });
    
    detailedViewBtn.addEventListener('click', () => {
      currentView = 'detailed';
      viewingSpecificDate = false;
      detailedViewBtn.classList.add('active');
      calendarViewBtn.classList.remove('active');
      listViewBtn.classList.remove('active');
      calendarViewContainer.style.display = 'none';
      listViewContainer.classList.remove('active');
      detailedViewContainer.classList.add('active');
      renderDetailedView();
    });

    // Month/Year Selection
    goDateBtn.addEventListener('click', () => {
      currentMonth = parseInt(monthSelect.value);
      currentYear = parseInt(yearInput.value) || 2026;
      
      // Reset to month view when using Go button - this shows entire month
      viewingSpecificDate = false;
      selectedDate = null;
      
      if (currentView === 'calendar') {
        renderCalendar();
      } else {
        // In list view, show entire month
        updateDateDisplay();
        renderListView();
      }
    });

    // Update calendar when month or year changes
    monthSelect.addEventListener('change', () => {
      currentMonth = parseInt(monthSelect.value);
      
      // When changing month dropdown, clear specific date and show month view
      viewingSpecificDate = false;
      selectedDate = null;
      
      if (currentView === 'calendar') {
        renderCalendar();
      } else {
        updateDateDisplay();
        renderListView();
      }
    });

    yearInput.addEventListener('change', () => {
      currentYear = parseInt(yearInput.value) || 2026;
      
      // When changing year, clear specific date and show month view
      viewingSpecificDate = false;
      selectedDate = null;
      
      if (currentView === 'calendar') {
        renderCalendar();
      } else {
        updateDateDisplay();
        renderListView();
      }
    });

    // Search
    searchInput.addEventListener('input', () => {
      if (currentView === 'list') {
        renderListView();
      }
    });

    // Modal Controls
    addProductBtn.addEventListener('click', () => {
      addProductModal.classList.add('active');
    });

    // Add Product Form Submit
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newProduct = {
        date: document.getElementById('productDate').value,
        category: document.getElementById('productCategory').value,
        product: document.getElementById('productName').value,
        batch: document.getElementById('productBatch').value,
        qty: parseInt(document.getElementById('productQty').value),
        status: document.getElementById('productStatus').value
      };
      
      inventoryData.push(newProduct);
      inventoryData.sort((a, b) => {
        const dateCompare = new Date(a.date) - new Date(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.category.localeCompare(b.category);
      });
      
      addProductModal.classList.remove('active');
      addProductForm.reset();
      productDate.value = today;
      
      // Update views
      if (currentView === 'calendar') {
        renderCalendar();
      } else {
        renderListView();
      }
      
      // Update dashboard overview
      updateDashboardOverview();
    });

    // Render Calendar View
    function renderCalendar() {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      
      calendarHeader.textContent = `${monthNames[currentMonth]} ${currentYear}`;
      
      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
      
      let html = '';
      
      // Previous month days
      for (let i = firstDay - 1; i >= 0; i--) {
        html += `<div class="calendar-day other-month">
          <div class="day-number">${prevMonthDays - i}</div>
        </div>`;
      }
      
      // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayItems = inventoryData.filter(item => item.date === dateStr);
        const isSelected = selectedDate === dateStr;
        
        html += `<div class="calendar-day ${isSelected ? 'selected' : ''}" data-date="${dateStr}">
          <div class="day-number">${day}</div>
          <div class="day-items">
            ${dayItems.length > 0 ? `<span class="day-badge">${dayItems.length} item${dayItems.length > 1 ? 's' : ''}</span>` : ''}
          </div>
        </div>`;
      }
      
      // Next month days
      const totalCells = firstDay + daysInMonth;
      const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
      for (let i = 1; i <= remainingCells; i++) {
        html += `<div class="calendar-day other-month">
          <div class="day-number">${i}</div>
        </div>`;
      }
      
      calendarDays.innerHTML = html;
      
      // Add click handlers to calendar days
      document.querySelectorAll('.calendar-day:not(.other-month)').forEach(day => {
        let touchTimer;
        let touchStarted = false;
        
        // Single click - just select/highlight
        day.addEventListener('click', (e) => {
          if (!touchStarted) {
            selectedDate = day.dataset.date;
            renderCalendar();
          }
        });
        
        // Touch and hold for mobile
        day.addEventListener('touchstart', (e) => {
          touchStarted = true;
          day.classList.add('pressing');
          touchTimer = setTimeout(() => {
            selectedDate = day.dataset.date;
            day.classList.remove('pressing');
            renderCalendar();
            showDayDetails(selectedDate);
            // Haptic feedback if available
            if (navigator.vibrate) {
              navigator.vibrate(50);
            }
          }, 500); // Hold for 500ms
        });
        
        day.addEventListener('touchend', () => {
          clearTimeout(touchTimer);
          day.classList.remove('pressing');
          setTimeout(() => { touchStarted = false; }, 100);
        });
        
        day.addEventListener('touchmove', () => {
          clearTimeout(touchTimer);
          day.classList.remove('pressing');
        });
        
        // Double-click to go to list view for that date
        day.addEventListener('dblclick', () => {
          selectedDate = day.dataset.date;
          viewingSpecificDate = true;
          currentView = 'list';
          listViewBtn.classList.add('active');
          calendarViewBtn.classList.remove('active');
          calendarViewContainer.style.display = 'none';
          listViewContainer.classList.add('active');
          updateDateDisplay();
          renderListViewForDate(selectedDate);
        });
      });
    }

    // Show day details when Enter is pressed (Desktop)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && selectedDate && currentView === 'calendar') {
        showDayDetails(selectedDate);
      }
    });

    // Show day details when Enter is pressed (Low Stock and Out of Stock only)
    function showDayDetails(dateStr) {
      const items = inventoryData.filter(item => item.date === dateStr);
      
      // Filter only Low Stock and Out of Stock items
      const criticalItems = items.filter(item => 
        item.status === 'Low Stock' || item.status === 'Out of Stock'
      );
      
      // Format the date for display
      const dateObj = new Date(dateStr + 'T00:00:00');
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = dateObj.toLocaleDateString('en-US', options);
      
      if (criticalItems.length === 0) {
        stockDetailTitle.textContent = `Stock Alert - ${formattedDate}`;
        stockDetailBody.innerHTML = `
          <div class="empty-state" style="padding: 2rem;">
            <div class="empty-state-icon" style="font-size: 3rem;">✅</div>
            <h3>All Good!</h3>
            <p>All inventory items are in good stock on this date</p>
          </div>
        `;
        stockDetailModal.classList.add('active');
        return;
      }
      
      // Group by category
      const grouped = {};
      criticalItems.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      });
      
      let lowStockCount = 0;
      let outOfStockCount = 0;
      
      let html = '';
      Object.keys(grouped).sort().forEach(category => {
        html += `
          <div class="stock-detail-category">
            <div class="stock-category-header">${category}</div>
        `;
        
        grouped[category].forEach(item => {
          const icon = item.status === 'Out of Stock' ? '🔴' : '🟡';
          
          html += `
            <div class="stock-item">
              <div class="stock-item-name">${icon} ${item.product}</div>
              <div class="stock-item-details">
                <div class="stock-item-detail">
                  <strong>Batch:</strong> <span>${item.batch}</span>
                </div>
                <div class="stock-item-detail">
                  <strong>Qty:</strong> <span>${item.qty}</span>
                </div>
                <div class="stock-item-detail">
                  <strong>Status:</strong> <span style="color: ${item.status === 'Out of Stock' ? '#ef4444' : '#f59e0b'};">${item.status}</span>
                </div>
              </div>
            </div>
          `;
          
          if (item.status === 'Low Stock') lowStockCount++;
          if (item.status === 'Out of Stock') outOfStockCount++;
        });
        
        html += `</div>`;
      });
      
      // Add summary
      html += `
        <div class="stock-summary">
          <div class="stock-summary-title">Summary</div>
          ${lowStockCount > 0 ? `<div><span>🟡 Low Stock</span><span>${lowStockCount} item(s)</span></div>` : ''}
          ${outOfStockCount > 0 ? `<div><span>🔴 Out of Stock</span><span>${outOfStockCount} item(s)</span></div>` : ''}
        </div>
      `;
      
      stockDetailTitle.textContent = `⚠️ Stock Alert - ${formattedDate}`;
      stockDetailBody.innerHTML = html;
      stockDetailModal.classList.add('active');
    }

    // Render List View
    function renderListView() {
      const search = searchInput.value.toLowerCase();
      
      // Update display to show "Results" if searching
      if (search) {
        const dateValueEl = document.getElementById('dateValueDisplay');
        dateValueEl.textContent = 'Search Results';
      } else {
        updateDateDisplay();
      }
      
      const monthStart = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
      const monthEnd = `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01`;
      
      let filtered = inventoryData.filter(item => {
        const itemDate = item.date;
        return itemDate >= monthStart && itemDate < monthEnd;
      });
      
      if (search) {
        filtered = filtered.filter(item => 
          item.product.toLowerCase().includes(search) ||
          item.batch.toLowerCase().includes(search) ||
          item.category.toLowerCase().includes(search)
        );
      }
      
      if (filtered.length === 0) {
        inventoryBody.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📦</div>
            <h3>No inventory found</h3>
            <p>Try adjusting your filters or add new products</p>
          </div>
        `;
        return;
      }
      
      // Group by category
      const groupedByCategory = {};
      filtered.forEach(item => {
        if (!groupedByCategory[item.category]) {
          groupedByCategory[item.category] = [];
        }
        groupedByCategory[item.category].push(item);
      });
      
      // Sort categories
      const categories = Object.keys(groupedByCategory).sort();
      
      let html = '';
      categories.forEach(category => {
        const items = groupedByCategory[category];
        html += `
          <div class="category-section">
            <div class="category-title">
              <span>${category}</span>
              <span class="category-count">${items.length} item${items.length > 1 ? 's' : ''}</span>
            </div>
            <div class="category-items">
        `;
        
        items.forEach(item => {
          const statusClass = item.status === 'Available' ? 'status-available' : 
                             item.status === 'Low Stock' ? 'status-low' : 'status-out';
          html += `
            <div class="inventory-card">
              <div class="card-field">
                <div class="card-label">Product Name</div>
                <div class="card-value product-name">${item.product}</div>
              </div>
              <div class="card-field">
                <div class="card-label">Batch / Expiry</div>
                <div class="card-value">${item.batch}</div>
              </div>
              <div class="card-field">
                <div class="card-label">Quantity</div>
                <div class="card-value">${item.qty}</div>
              </div>
              <div class="card-field">
                <div class="card-label">Status</div>
                <div class="status-badge ${statusClass}">${item.status}</div>
              </div>
            </div>
          `;
        });
        
        html += `
            </div>
          </div>
        `;
      });
      
      inventoryBody.innerHTML = html;
    }

    // Render List View for specific date
    function renderListViewForDate(dateStr) {
      const search = searchInput.value.toLowerCase();
      
      // Update display to show "Results" if searching
      if (search) {
        const dateValueEl = document.getElementById('dateValueDisplay');
        dateValueEl.textContent = 'Search Results';
      } else {
        updateDateDisplay();
      }
      
      let filtered = inventoryData.filter(item => item.date === dateStr);
      
      if (search) {
        filtered = filtered.filter(item => 
          item.product.toLowerCase().includes(search) ||
          item.batch.toLowerCase().includes(search) ||
          item.category.toLowerCase().includes(search)
        );
      }
      
      if (filtered.length === 0) {
        inventoryBody.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📦</div>
            <h3>No inventory for ${dateStr}</h3>
            <p>No products found for this date</p>
          </div>
        `;
        return;
      }
      
      // Group by category
      const groupedByCategory = {};
      filtered.forEach(item => {
        if (!groupedByCategory[item.category]) {
          groupedByCategory[item.category] = [];
        }
        groupedByCategory[item.category].push(item);
      });
      
      // Sort categories
      const categories = Object.keys(groupedByCategory).sort();
      
      let html = '';
      categories.forEach(category => {
        const items = groupedByCategory[category];
        html += `
          <div class="category-section">
            <div class="category-title">
              <span>${category}</span>
              <span class="category-count">${items.length} item${items.length > 1 ? 's' : ''}</span>
            </div>
            <div class="category-items">
        `;
        
        items.forEach(item => {
          const statusClass = item.status === 'Available' ? 'status-available' : 
                             item.status === 'Low Stock' ? 'status-low' : 'status-out';
          html += `
            <div class="inventory-card">
              <div class="card-field">
                <div class="card-label">Product Name</div>
                <div class="card-value product-name">${item.product}</div>
              </div>
              <div class="card-field">
                <div class="card-label">Batch / Expiry</div>
                <div class="card-value">${item.batch}</div>
              </div>
              <div class="card-field">
                <div class="card-label">Quantity</div>
                <div class="card-value">${item.qty}</div>
              </div>
              <div class="card-field">
                <div class="card-label">Status</div>
                <div class="status-badge ${statusClass}">${item.status}</div>
              </div>
            </div>
          `;
        });
        
        html += `
            </div>
          </div>
        `;
      });
      
      inventoryBody.innerHTML = html;
    }
    
    // Render Detailed View
    function renderDetailedView() {
      // Get all inventory data sorted by date (newest first)
      const sortedData = [...inventoryData].sort((a, b) => new Date(b.date) - new Date(a.date));
      
      if (sortedData.length === 0) {
        detailedInventoryBody.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📦</div>
            <h3>No inventory data</h3>
            <p>Add products to see detailed information</p>
          </div>
        `;
        return;
      }
      
      let html = `
        <table>
          <thead>
            <tr>
              <th data-short="Date"><div>Date</div></th>
              <th data-short="Product"><div>Product</div></th>
              <th data-short="Cat."><div>Category</div></th>
              <th data-short="Batch"><div>Batch</div></th>
              <th data-short="Qty"><div>Quantity</div></th>
              <th data-short="Status"><div>Status</div></th>
            </tr>
          </thead>
          <tbody>
      `;
      
      sortedData.forEach(item => {
        // Determine status class
        let statusClass = 'available';
        if (item.status === 'Low Stock') statusClass = 'low';
        else if (item.status === 'Out of Stock') statusClass = 'out';
        else if (item.status === 'Expiring Soon') statusClass = 'expiring';
        
        html += `
          <tr>
            <td data-label="Date">${item.date}</td>
            <td data-label="Product">${item.product}</td>
            <td data-label="Category"><span class="category-tag">${item.category}</span></td>
            <td data-label="Batch">${item.batch}</td>
            <td data-label="Quantity">${item.qty}</td>
            <td data-label="Status"><span class="status-badge ${statusClass}">${item.status}</span></td>
          </tr>
        `;
      });
      
      html += `
          </tbody>
        </table>
      `;
      
      detailedInventoryBody.innerHTML = html;
    }

    // Initialize
    monthSelect.value = currentMonth;
    yearInput.value = currentYear;
    renderCalendar();
    updateDashboardOverview();
    updateDashboardData('today');
    
    // Initialize role after everything else is set up
    setTimeout(() => {
      updateUIForRole('owner');
    }, 100);

    // === JOURNALS PAGE FUNCTIONALITY ===
    
    // Product Database
    const journalProductDatabase = {
      'Medicine': [
        { name: 'Paracetamol', price: 5 },
        { name: 'Ibuprofen', price: 8 },
        { name: 'Amoxicillin', price: 15 },
        { name: 'Cetirizine', price: 6 },
        { name: 'Vitamin C', price: 10 },
        { name: 'Cough Syrup', price: 25 }
      ],
      'PPE': [
        { name: 'Face Mask', price: 10 },
        { name: 'N95 Mask', price: 50 },
        { name: 'Gloves', price: 5 },
        { name: 'Face Shield', price: 30 },
        { name: 'Gown', price: 100 },
        { name: 'Hair Cap', price: 3 }
      ],
      'Supplies': [
        { name: 'Syringe', price: 8 },
        { name: 'Bandage', price: 15 },
        { name: 'Cotton', price: 20 },
        { name: 'Gauze', price: 25 },
        { name: 'Tape', price: 12 },
        { name: 'IV Catheter', price: 40 }
      ],
      'Equipment': [
        { name: 'Thermometer', price: 200 },
        { name: 'BP Monitor', price: 1500 },
        { name: 'Stethoscope', price: 800 },
        { name: 'Oximeter', price: 500 },
        { name: 'Nebulizer', price: 2000 }
      ],
      'Hygiene': [
        { name: 'Alcohol', price: 100 },
        { name: 'Hand Soap', price: 50 },
        { name: 'Sanitizer', price: 80 },
        { name: 'Wet Wipes', price: 60 },
        { name: 'Tissue', price: 30 }
      ],
      'Other': [
        { name: 'Water Bottle', price: 20 },
        { name: 'Bedpan', price: 150 },
        { name: 'Urinal', price: 120 },
        { name: 'Ice Pack', price: 50 },
        { name: 'Hot Pack', price: 50 }
      ]
    };

    // Journal State
    let journalCurrentItems = [];
    let journalCurrentQuantity = 1;
    let journalSelectedCategory = null;
    let journalSelectedProduct = null;
    let journalRecentReceipts = [];

    // Journal Elements
    const journalNurseName = document.getElementById('journalNurseName');
    const journalCurrentTime = document.getElementById('journalCurrentTime');
    const journalPatientNameInput = document.getElementById('journalPatientName');
    const journalItemsList = document.getElementById('journalItemsList');
    const journalSelectionTitle = document.getElementById('journalSelectionTitle');
    const journalCategoryGrid = document.getElementById('journalCategoryGrid');
    const journalProductGrid = document.getElementById('journalProductGrid');
    const journalQtyDisplay = document.getElementById('journalQtyDisplay');
    const journalDecreaseQtyBtn = document.getElementById('journalDecreaseQty');
    const journalIncreaseQtyBtn = document.getElementById('journalIncreaseQty');
    const journalAddItemBtn = document.getElementById('journalAddItemBtn');
    const journalOkBtn = document.getElementById('journalOkBtn');
    const journalRecentBtn = document.getElementById('journalRecentBtn');
    const journalRecentModal = document.getElementById('journalRecentModal');
    const closeJournalRecentModal = document.getElementById('closeJournalRecentModal');
    const journalRecentModalBody = document.getElementById('journalRecentModalBody');
    const journalPreviewModal = document.getElementById('journalPreviewModal');
    const closeJournalPreviewModal = document.getElementById('closeJournalPreviewModal');
    const journalPreviewModalBody = document.getElementById('journalPreviewModalBody');

    // Update Journal Time
    function updateJournalTime() {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const year = String(now.getFullYear()).slice(-2);
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      journalCurrentTime.textContent = `${month}/${day}/${year} - ${hours}:${minutes}`;
    }
    
    // Update nurse name from current user
    function updateJournalNurseName() {
      const currentUserName = document.getElementById('userName').textContent;
      journalNurseName.textContent = currentUserName;
    }

    updateJournalTime();
    updateJournalNurseName();
    setInterval(updateJournalTime, 60000);

    // Category Selection
    journalCategoryGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.journal-grid-btn');
      if (!btn) return;

      journalSelectedCategory = btn.dataset.category;
      showJournalProducts(journalSelectedCategory);
    });

    // Show Products
    function showJournalProducts(category) {
      journalCategoryGrid.classList.add('journal-hidden');
      journalProductGrid.classList.remove('journal-hidden');
      journalSelectionTitle.textContent = `Select ${category}`;

      const products = journalProductDatabase[category] || [];
      let html = '<button class="journal-back-to-category">← Back to Categories</button>';

      products.forEach(product => {
        html += `
          <button class="journal-grid-btn" data-product='${JSON.stringify(product)}'>
            <span class="journal-product-name">${product.name}</span>
            <span class="journal-product-price">₱${product.price}</span>
          </button>
        `;
      });

      journalProductGrid.innerHTML = html;

      // Back button
      journalProductGrid.querySelector('.journal-back-to-category').addEventListener('click', backToJournalCategories);

      // Product selection
      journalProductGrid.querySelectorAll('.journal-grid-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          journalProductGrid.querySelectorAll('.journal-grid-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          journalSelectedProduct = JSON.parse(btn.dataset.product);
          journalAddItemBtn.disabled = false;
        });
      });
    }

    // Back to Categories
    function backToJournalCategories() {
      journalProductGrid.classList.add('journal-hidden');
      journalCategoryGrid.classList.remove('journal-hidden');
      journalSelectionTitle.textContent = 'Select Category';
      journalSelectedProduct = null;
      journalAddItemBtn.disabled = true;
    }

    // Quantity Controls
    journalDecreaseQtyBtn.addEventListener('click', () => {
      if (journalCurrentQuantity > 1) {
        journalCurrentQuantity--;
        journalQtyDisplay.textContent = journalCurrentQuantity;
      }
    });

    journalIncreaseQtyBtn.addEventListener('click', () => {
      journalCurrentQuantity++;
      journalQtyDisplay.textContent = journalCurrentQuantity;
    });

    // Add Item
    journalAddItemBtn.addEventListener('click', () => {
      if (!journalSelectedProduct) return;

      const item = {
        name: journalSelectedProduct.name,
        price: journalSelectedProduct.price,
        quantity: journalCurrentQuantity,
        total: journalSelectedProduct.price * journalCurrentQuantity
      };

      journalCurrentItems.push(item);
      renderJournalItems();
      
      // Reset selection
      journalCurrentQuantity = 1;
      journalQtyDisplay.textContent = journalCurrentQuantity;
      journalSelectedProduct = null;
      journalAddItemBtn.disabled = true;
      backToJournalCategories();
      
      // Enable OK button
      journalOkBtn.disabled = false;

      // Animation
      journalItemsList.classList.add('journal-success-animation');
      setTimeout(() => journalItemsList.classList.remove('journal-success-animation'), 300);
    });

    // Render Items
    function renderJournalItems() {
      if (journalCurrentItems.length === 0) {
        journalItemsList.innerHTML = '<div class="journal-empty-inline">No items • Tap category to start</div>';
        return;
      }

      let html = '';
      let grandTotal = 0;

      journalCurrentItems.forEach(item => {
        html += `
          <div class="journal-item-compact">
            <div class="journal-item-left">
              <div class="journal-item-name">${item.name}</div>
              <div class="journal-item-details">${item.quantity} × ₱${item.price}</div>
            </div>
            <div class="journal-item-total">₱${item.total}</div>
          </div>
        `;
        grandTotal += item.total;
      });

      html += `
        <div class="journal-item-compact" style="border-top: 2px solid #e5e7eb; margin-top: 0.5rem; padding-top: 0.5rem;">
          <div class="journal-item-left">
            <div class="journal-item-name" style="font-weight: 700;">TOTAL</div>
          </div>
          <div class="journal-item-total" style="font-size: 1rem;">₱${grandTotal}</div>
        </div>
      `;

      journalItemsList.innerHTML = html;
    }

    // Save Receipt
    journalOkBtn.addEventListener('click', () => {
      const patientName = journalPatientNameInput.value.trim();
      
      if (!patientName) {
        alert('Please enter patient name');
        journalPatientNameInput.focus();
        return;
      }

      if (journalCurrentItems.length === 0) {
        alert('Please add at least one item');
        return;
      }

      const totalAmount = journalCurrentItems.reduce((sum, item) => sum + item.total, 0);
      const currentNurseName = document.getElementById('userName').textContent;

      const receipt = {
        id: Date.now(),
        nurse: currentNurseName,
        patient: patientName,
        items: [...journalCurrentItems],
        total: totalAmount,
        timestamp: new Date().toLocaleString()
      };

      journalRecentReceipts.unshift(receipt);
      
      // **NEW: Add to sales records**
      const salesRecord = {
        id: Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        patient: patientName,
        nurse: currentNurseName,
        items: journalCurrentItems.map(item => ({
          name: item.name,
          category: 'Medicine', // You can enhance this by tracking category
          quantity: item.quantity,
          price: item.price
        })),
        total: totalAmount
      };
      
      if (typeof salesRecords !== 'undefined') {
        salesRecords.unshift(salesRecord);
      }
      
      // Clear form
      journalPatientNameInput.value = '';
      journalCurrentItems = [];
      renderJournalItems();
      journalOkBtn.disabled = true;

      // Show success
      alert('Receipt saved and queued for printing!');
      
      // Show recent modal
      showJournalRecentModal();
    });

    // Recent Button
    journalRecentBtn.addEventListener('click', showJournalRecentModal);

    // Show Recent Modal
    function showJournalRecentModal() {
      if (journalRecentReceipts.length === 0) {
        journalRecentModalBody.innerHTML = '<div class="journal-empty">No receipts in queue</div>';
      } else {
        let html = '<div style="display: flex; flex-direction: column; gap: 0.75rem;">';
        journalRecentReceipts.forEach(receipt => {
          const itemsText = receipt.items.map(item => `${item.name} (${item.quantity})`).join(', ');
          html += `
            <div style="background: #f9fafb; padding: 1rem; border-radius: 8px; border: 2px solid #e5e7eb; cursor: pointer;" onclick="showJournalReceiptPreview(${receipt.id})">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-weight: 600; color: #111827;">${receipt.patient}</span>
                <span style="font-size: 0.8rem; color: #6b7280;">${receipt.timestamp}</span>
              </div>
              <div style="font-size: 0.85rem; color: #6b7280;">${itemsText}</div>
              <div style="font-weight: 600; color: #111827; margin-top: 0.5rem;">Total: ₱${receipt.total}</div>
              <button onclick="event.stopPropagation(); printJournalReceipt(${receipt.id})" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer; width: 100%;">🖨️ Print Receipt</button>
            </div>
          `;
        });
        html += '</div>';
        journalRecentModalBody.innerHTML = html;
      }
      journalRecentModal.classList.add('active');
    }

    // Show Receipt Preview
    window.showJournalReceiptPreview = function(receiptId) {
      const receipt = journalRecentReceipts.find(r => r.id === receiptId);
      if (!receipt) return;

      let html = '<div style="background: white; padding: 1.5rem; border: 2px dashed #d1d5db; border-radius: 8px; font-family: \'Courier New\', monospace; font-size: 0.85rem;">';
      html += '<div style="text-align: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px dashed #d1d5db;">';
      html += '<div style="font-weight: bold; font-size: 1.1rem;">HOSPITAL RECEIPT</div>';
      html += `<div>Nurse: ${receipt.nurse}</div>`;
      html += `<div>Date: ${receipt.timestamp}</div>`;
      html += `<div>Patient: ${receipt.patient}</div>`;
      html += '</div>';
      
      html += '<div style="margin-bottom: 1rem;">';
      receipt.items.forEach(item => {
        html += `<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">`;
        html += `<span>${item.name} x${item.quantity}</span>`;
        html += `<span>₱${item.total}</span>`;
        html += `</div>`;
      });
      html += '</div>';
      
      html += '<div style="padding-top: 1rem; border-top: 1px dashed #d1d5db; font-weight: bold;">';
      html += `<div style="display: flex; justify-content: space-between;">`;
      html += `<span>TOTAL</span>`;
      html += `<span>₱${receipt.total}</span>`;
      html += `</div>`;
      html += '</div>';
      
      html += '</div>';
      
      html += `<button onclick="printJournalReceipt(${receipt.id})" style="margin-top: 1rem; padding: 0.75rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; width: 100%;">🖨️ Print Receipt</button>`;
      
      journalPreviewModalBody.innerHTML = html;
      journalPreviewModal.classList.add('active');
    };

    // Print Receipt
    window.printJournalReceipt = function(receiptId) {
      const receipt = journalRecentReceipts.find(r => r.id === receiptId);
      if (!receipt) return;

      // In real implementation, this would send to server/printer
      console.log('Printing receipt:', receipt);
      alert('Sending to printer...\n(In production, this will print to the server printer)');
      
      // Remove from queue after printing
      journalRecentReceipts = journalRecentReceipts.filter(r => r.id !== receiptId);
      showJournalRecentModal();
    };

    // Close Modals
    closeJournalRecentModal.addEventListener('click', () => {
      journalRecentModal.classList.remove('active');
    });

    closeJournalPreviewModal.addEventListener('click', () => {
      journalPreviewModal.classList.remove('active');
    });

    // Close on background click
    journalRecentModal.addEventListener('click', (e) => {
      if (e.target === journalRecentModal) {
        journalRecentModal.classList.remove('active');
      }
    });

    journalPreviewModal.addEventListener('click', (e) => {
      if (e.target === journalPreviewModal) {
        journalPreviewModal.classList.remove('active');
      }
    });
    } // End of OLD inventory system check

    // === NEW INVENTORY SYSTEM ===
    // New Inventory Elements
    const inventoryCurrentDate = document.getElementById('inventoryCurrentDate');
    const inventorySearchInput = document.getElementById('inventorySearchInput');
    const datePickerInput = document.getElementById('datePickerInput');
    const inventoryProductsBody = document.getElementById('inventoryProductsBody');
    const statusBoxes = document.querySelectorAll('.status-box[data-status]');
    const addNewProductBox = document.getElementById('addNewProductBox');
    const allCountEl = document.getElementById('allCount');
    const lowCountEl = document.getElementById('lowCount');
    const outCountEl = document.getElementById('outCount');
    
    // Current filter status
    let currentStockFilter = 'all'; // 'all', 'low', 'out'
    
    // Current selected date (default to today)
    let currentSelectedDate = new Date();
    
    // Product master list - all products
    let productsMaster = [
      // Temporary test products
      { product: 'Surgical Gloves', category: 'BY BOX', expiry: '2027-06-15', stock: 150 },
      { product: 'Syringe 5ml', category: 'BY PIECE', expiry: '2027-12-20', stock: 300 },
      { product: 'Saline Solution', category: 'IV', expiry: '2026-08-10', stock: 85 },
      { product: 'Bandages', category: 'BY BOX', expiry: '2027-03-25', stock: 120 },
      { product: 'Alcohol Swabs', category: 'BY BOX', expiry: '2026-11-30', stock: 200 },
      { product: 'Face Masks', category: 'BY BOX', expiry: '2027-01-15', stock: 450 },
      { product: 'Cotton Balls', category: 'BY PIECE', expiry: '2027-05-20', stock: 180 },
      { product: 'Paracetamol 500mg', category: 'TAB/CAPS', expiry: '2027-09-10', stock: 95 },
      { product: 'Distilled Water', category: 'BY GALLON', expiry: '2026-12-15', stock: 60 },
      { product: 'Dextrose 5%', category: 'IV', expiry: '2027-04-22', stock: 110 },
      { product: 'Amoxicillin 500mg', category: 'TAB/CAPS', expiry: '2026-02-10', stock: 8 },
      { product: 'Normal Saline', category: 'IV', expiry: '2026-09-05', stock: 140 },
      
      // IV
      { product: 'D50 50ML', category: 'IV', expiry: '2026-12-31', stock: 75 },
      { product: 'DIPENHYDRAMINE', category: 'IV', expiry: '2027-03-15', stock: 50 },
      { product: 'EPOETIN ALFA', category: 'IV', expiry: '2026-09-20', stock: 25 },
      { product: 'EPINEPHRINE', category: 'IV', expiry: '2027-01-10', stock: 90 },
      { product: 'EPOETIN BETA', category: 'IV', expiry: '2026-08-25', stock: 30 },
      { product: 'GENTAMYCIN', category: 'IV', expiry: '2027-05-18', stock: 65 },
      { product: 'HEPARIN', category: 'IV', expiry: '2026-11-30', stock: 45 },
      { product: 'HYDROCORTISONE', category: 'IV', expiry: '2027-02-14', stock: 55 },
      { product: 'IV IRON', category: 'IV', expiry: '2027-04-22', stock: 40 },
      { product: 'IV PARACETAMOL', category: 'IV', expiry: '2026-10-15', stock: 80 },
      { product: 'PNSS IL', category: 'IV', expiry: '2027-06-30', stock: 200 },
      { product: 'SALBUTAMOL', category: 'IV', expiry: '2026-12-20', stock: 70 },
      
      // TAB/CAPS
      { product: 'CLONIDINE', category: 'TAB/CAPS', expiry: '2027-01-25', stock: 120 },
      { product: 'DUO GESIC', category: 'TAB/CAPS', expiry: '2026-09-10', stock: 5 },
      { product: 'FLUGARD', category: 'TAB/CAPS', expiry: '2027-03-05', stock: 95 },
      { product: 'MEFENAMIC ACID', category: 'TAB/CAPS', expiry: '2026-11-18', stock: 150 },
      { product: 'TRAMADOL OPIODEX', category: 'TAB/CAPS', expiry: '2027-02-28', stock: 60 },
      { product: 'TRAMADOL ROUNOX', category: 'TAB/CAPS', expiry: '2026-10-22', stock: 3 },
      { product: 'TRAMADOL IV', category: 'TAB/CAPS', expiry: '2027-04-15', stock: 85 },
      
      // BY GALLON
      { product: 'ALCOHOL', category: 'BY GALLON', expiry: '2027-12-31', stock: 45 },
      
      // BY BOX
      { product: 'FACEMASK', category: 'BY BOX', expiry: '2028-01-30', stock: 250 },
      { product: 'GLOVES', category: 'BY BOX', expiry: '2027-08-15', stock: 180 },
      { product: 'STERILE GLOVES', category: 'BY BOX', expiry: '2027-09-20', stock: 95 },
      { product: 'ALCOHOL PREP PAD', category: 'BY BOX', expiry: '2027-06-10', stock: 140 },
      
      // BY PIECE
      { product: 'BLANKET', category: 'BY PIECE', expiry: '2029-01-01', stock: 75 },
      { product: 'BLOODLINES', category: 'BY PIECE', expiry: '2027-05-20', stock: 120 },
      { product: 'CBG TESTING LANCET', category: 'BY PIECE', expiry: '2026-12-15', stock: 200 },
      { product: 'CBG TESTING TEST STRIP', category: 'BY PIECE', expiry: '2026-11-28', stock: 180 },
      { product: 'DISPOSABLE SYRINGE', category: 'BY PIECE', expiry: '2027-07-30', stock: 300 },
      { product: 'FISTULA KIT', category: 'BY PIECE', expiry: '2027-03-18', stock: 50 },
      { product: 'FISTULA NEEDLE SET', category: 'BY PIECE', expiry: '2027-04-25', stock: 60 },
      { product: 'HIFLUX DIALYZER', category: 'BY PIECE', expiry: '2026-10-31', stock: 0 },
      { product: 'LINEN', category: 'BY PIECE', expiry: '2029-01-01', stock: 100 },
      { product: 'MICROPORE', category: 'BY PIECE', expiry: '2027-08-22', stock: 150 },
      { product: 'MUPIROCIN', category: 'BY PIECE', expiry: '2026-09-14', stock: 8 },
      { product: 'NASAL CANNULA', category: 'BY PIECE', expiry: '2027-11-05', stock: 90 },
      { product: 'NEBU KIT', category: 'BY PIECE', expiry: '2027-02-10', stock: 110 },
      { product: 'NECK PILLOW', category: 'BY PIECE', expiry: '2029-01-01', stock: 40 },
      { product: 'OXYGEN MASK', category: 'BY PIECE', expiry: '2027-06-18', stock: 85 },
      { product: 'SUBCLAVIAN KIT', category: 'BY PIECE', expiry: '2027-01-28', stock: 2 },
      { product: 'TISSUE', category: 'BY PIECE', expiry: '2028-12-31', stock: 220 },
      { product: 'TUMBLER', category: 'BY PIECE', expiry: '2029-01-01', stock: 65 },
    ];
    
    // Sales data by date - keyed by date string "YYYY-MM-DD" -> { productName: salesCount }
    let salesByDate = {};
    
    // Initialize with random sales for demonstration
    function initializeSalesData() {
      const today = new Date();
      for (let i = -30; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        salesByDate[dateStr] = {};
        productsMaster.forEach(product => {
          salesByDate[dateStr][product.product] = Math.floor(Math.random() * 20);
        });
      }
    }
    
    initializeSalesData();
    
    // Update date display
    function updateInventoryDateDisplay() {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      inventoryCurrentDate.textContent = currentSelectedDate.toLocaleDateString('en-US', options);
    }
    
    // Render products table
    function renderInventoryProducts() {
      console.log('=== RENDERING PRODUCTS ===');
      console.log('inventorySearchInput:', inventorySearchInput);
      console.log('inventoryProductsBody:', inventoryProductsBody);
      
      if (!inventorySearchInput || !inventoryProductsBody) {
        console.error('Missing required elements!');
        return;
      }
      
      const searchTerm = inventorySearchInput.value.toLowerCase();
      const currentDateStr = currentSelectedDate.toISOString().split('T')[0];
      
      console.log('searchTerm:', searchTerm);
      console.log('currentDateStr:', currentDateStr);
      console.log('productsMaster:', productsMaster.length, 'products');
      
      // Filter products
      let filtered = productsMaster.filter(p => {
        const matchesSearch = p.product.toLowerCase().includes(searchTerm) || 
                             p.category.toLowerCase().includes(searchTerm);
        
        // Filter by stock status
        let matchesStockFilter = true;
        if (currentStockFilter === 'all') {
          matchesStockFilter = true; // Show all items
        } else if (currentStockFilter === 'low') {
          matchesStockFilter = (p.stock || 0) > 0 && (p.stock || 0) < 20;
        } else if (currentStockFilter === 'out') {
          matchesStockFilter = (p.stock || 0) === 0;
        }
        
        return matchesSearch && matchesStockFilter;
      });
      
      console.log('filtered:', filtered.length, 'products');
      
      // Sort by category, then by name
      filtered.sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.product.localeCompare(b.product);
      });
      
      // Build table HTML
      let html = '';
      let lastCategory = '';
      
      filtered.forEach((product, index) => {
        // Add separator row when category changes (except for first item)
        if (product.category !== lastCategory && lastCategory !== '') {
          html += `
            <tr class="category-separator">
              <td colspan="5" style="background: #f3f4f6; height: 8px; padding: 0; border: none;"></td>
            </tr>
          `;
        }
        lastCategory = product.category;
        
        // Get sales for today
        const salesToday = (salesByDate[currentDateStr] && salesByDate[currentDateStr][product.product]) || 0;
        const currentStock = product.stock || 0;
        
        // Determine stock status color
        let stockColor = '#10b981'; // Green for good stock
        if (currentStock === 0) {
          stockColor = '#dc2626'; // Red for out of stock
        } else if (currentStock < 20) {
          stockColor = '#f59e0b'; // Orange for low stock
        }
        
        html += `
          <tr>
            <td data-label="Category">${product.category}</td>
            <td data-label="Product">${product.product}</td>
            <td data-label="Current Stock"><span style="color: ${stockColor}; font-weight: 600;">${currentStock}</span></td>
            <td data-label="Expiry Date">${formatDate(product.expiry)}</td>
            <td data-label="Sales">${salesToday}</td>
          </tr>
        `;
      });
      
      console.log('Generated HTML length:', html.length);
      
      inventoryProductsBody.innerHTML = html || '<tr><td colspan="4" style="text-align:center; padding:2rem; color:#9ca3af;">No products found</td></tr>';
      
      console.log('Products rendered to table');
      
      // Update counts
      updateStatusCounts();
    }
    
    // Format date
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    
    // Update status counts
    function updateStatusCounts() {
      // Calculate real counts based on stock levels
      let allCount = productsMaster.length; // Total items
      let lowCount = 0;
      let outCount = 0;
      let availableCount = 0;
      let expiringCount = 0;
      
      const today = new Date();
      
      productsMaster.forEach(product => {
        const stock = product.stock || 0;
        
        // Count by stock status
        if (stock === 0) {
          outCount++;
        } else if (stock < 20) {
          lowCount++;
        } else {
          availableCount++;
        }
        
        // Check if expiring soon (within 90 days)
        if (product.expiry) {
          const expiryDate = new Date(product.expiry);
          const diffTime = expiryDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Expiring within 90 days
          if (diffDays <= 90 && diffDays >= 0) {
            expiringCount++;
          }
        }
      });
      
      // Update inventory page status boxes
      if (allCountEl) allCountEl.textContent = allCount;
      if (lowCountEl) lowCountEl.textContent = lowCount;
      if (outCountEl) outCountEl.textContent = outCount;
      
      // Update dashboard inventory overview
      const dashAvailableEl = document.getElementById('dashAvailableCount');
      const dashLowStockEl = document.getElementById('dashLowStockCount');
      const dashOutStockEl = document.getElementById('dashOutStockCount');
      const dashExpiringEl = document.getElementById('dashExpiringCount');
      
      if (dashAvailableEl) dashAvailableEl.textContent = availableCount;
      if (dashLowStockEl) dashLowStockEl.textContent = lowCount;
      if (dashOutStockEl) dashOutStockEl.textContent = outCount;
      if (dashExpiringEl) dashExpiringEl.textContent = expiringCount;
      
      console.log('Status counts updated (Inventory + Dashboard):', {
        all: allCount,
        available: availableCount,
        lowStock: lowCount,
        outStock: outCount,
        expiring: expiringCount
      });
    }
    
    // Status box click handlers
    statusBoxes.forEach(box => {
      box.addEventListener('click', () => {
        const status = box.dataset.status;
        
        // Update active state
        statusBoxes.forEach(b => b.classList.remove('active'));
        box.classList.add('active');
        
        // Update filter
        currentStockFilter = status;
        
        console.log('Filter changed to:', status);
        
        // Re-render products with new filter
        renderInventoryProducts();
      });
    });
    
    // Event listeners
    if (inventorySearchInput) {
      inventorySearchInput.addEventListener('input', renderInventoryProducts);
    }
    
    // Previous day button
    const prevDayBtn = document.getElementById('prevDayBtn');
    if (prevDayBtn) {
      prevDayBtn.addEventListener('click', () => {
        currentSelectedDate.setDate(currentSelectedDate.getDate() - 1);
        updateInventoryDateDisplay();
        if (datePickerInput) {
          datePickerInput.value = currentSelectedDate.toISOString().split('T')[0];
        }
        renderInventoryProducts();
      });
    }
    
    // Next day button
    const nextDayBtn = document.getElementById('nextDayBtn');
    if (nextDayBtn) {
      nextDayBtn.addEventListener('click', () => {
        currentSelectedDate.setDate(currentSelectedDate.getDate() + 1);
        updateInventoryDateDisplay();
        if (datePickerInput) {
          datePickerInput.value = currentSelectedDate.toISOString().split('T')[0];
        }
        renderInventoryProducts();
      });
    }
    
    // Calendar picker button
    const visibleDatePicker = document.getElementById('visibleDatePicker');
    
    // Setup visible date picker
    if (visibleDatePicker) {
      visibleDatePicker.value = currentSelectedDate.toISOString().split('T')[0];
      
      visibleDatePicker.addEventListener('change', (e) => {
        console.log('Date picker changed:', e.target.value);
        currentSelectedDate = new Date(e.target.value + 'T00:00:00');
        updateInventoryDateDisplay();
        renderInventoryProducts();
      });
    }
    
    // Date picker change
    if (datePickerInput) {
      datePickerInput.addEventListener('change', (e) => {
        console.log('Date changed:', e.target.value);
        currentSelectedDate = new Date(e.target.value + 'T00:00:00');
        updateInventoryDateDisplay();
        renderInventoryProducts();
        
        // Hide the date picker again
        datePickerInput.style.position = 'fixed';
        datePickerInput.style.top = '-9999px';
        datePickerInput.style.left = '-9999px';
        datePickerInput.style.width = '1px';
        datePickerInput.style.height = '1px';
        datePickerInput.style.zIndex = '-1';
      });
      
      // Also hide on blur (when calendar closes)
      datePickerInput.addEventListener('blur', () => {
        setTimeout(() => {
          datePickerInput.style.position = 'fixed';
          datePickerInput.style.top = '-9999px';
          datePickerInput.style.left = '-9999px';
          datePickerInput.style.width = '1px';
          datePickerInput.style.height = '1px';
          datePickerInput.style.zIndex = '-1';
        }, 200);
      });
    }
    
    // Status box click handlers
    statusBoxes.forEach(box => {
      box.addEventListener('click', () => {
        statusBoxes.forEach(b => b.classList.remove('active'));
        box.classList.add('active');
        // TODO: Filter by status
        renderInventoryProducts();
      });
    });
    
    // Add product box
    if (addNewProductBox) {
      addNewProductBox.addEventListener('click', () => {
        if (addProductModal) addProductModal.classList.add('active');
      });
    }
    
    // Initialize inventory system
    function initInventorySystem() {
      console.log('=== INITIALIZING INVENTORY ===');
      console.log('datePickerInput:', datePickerInput);
      console.log('inventoryProductsBody:', inventoryProductsBody);
      console.log('productsMaster length:', productsMaster.length);
      console.log('currentSelectedDate:', currentSelectedDate);
      
      if (datePickerInput) {
        datePickerInput.value = currentSelectedDate.toISOString().split('T')[0];
      }
      updateInventoryDateDisplay();
      renderInventoryProducts();
      console.log('=== INITIALIZATION COMPLETE ===');
    }
    
    // === RESTOCK SYSTEM ===
    const goToRestockBtn = document.getElementById('goToRestockBtn');
    const backFromRestockBtn = document.getElementById('backFromRestockBtn');
    const restockPage = document.getElementById('restockPage');
    const inventoryPage = document.getElementById('inventory');
    const restockItemsList = document.getElementById('restockItemsList');
    const restockFilterBtns = document.querySelectorAll('.restock-filter-btn');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    const updateStocksBtn = document.getElementById('updateStocksBtn');
    const updateCounter = document.getElementById('updateCounter');
    const restockSearchInput = document.getElementById('restockSearchInput');
    const restockCategoryFilter = document.getElementById('restockCategoryFilter');
    
    // Delete password
    const DELETE_PASSWORD = 'admin123'; // Change this to your desired password
    const MANUAL_UPDATE_PASSWORD = 'admin123'; // Password for manual inventory update access
    
    let currentRestockFilter = 'all';
    let currentRestockSearch = '';
    let currentRestockCategory = 'all';
    let restockData = [];
    
    // Initialize restock data from products
    function initializeRestockData() {
      restockData = productsMaster.map(product => ({
        product: product.product,
        category: product.category,
        status: Math.random() > 0.7 ? 'low' : (Math.random() > 0.9 ? 'out' : 'normal'),
        monthlySold: Math.floor(Math.random() * 300) + 50,
        currentStock: Math.floor(Math.random() * 100),
        previousCost: (Math.random() * 500 + 50).toFixed(2),
        newCost: '',
        newStockQty: 0,
        checked: false
      }));
      
      // Populate category filter
      populateRestockCategoryFilter();
    }
    
    // Populate category filter dropdown
    function populateRestockCategoryFilter() {
      if (!restockCategoryFilter) return;
      
      // Get unique categories from restockData
      const categories = [...new Set(restockData.map(item => item.category))].sort();
      
      restockCategoryFilter.innerHTML = '<option value="all">All Categories</option>';
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        restockCategoryFilter.appendChild(option);
      });
    }
    
    // Navigate to restock page
    if (goToRestockBtn) {
      goToRestockBtn.addEventListener('click', () => {
        inventoryPage.classList.remove('active');
        restockPage.style.display = 'block';
        initializeRestockData();
        renderRestockItems();
        setupDeleteButton(); // Setup delete button when page opens

        // Scroll to top
        window.scrollTo(0, 0);
      });
    }
    
    // Navigate back to inventory
    if (backFromRestockBtn) {
      backFromRestockBtn.addEventListener('click', () => {
        restockPage.style.display = 'none';
        inventoryPage.classList.add('active');
      });
    }
    
    // Filter buttons
    restockFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentRestockFilter = btn.dataset.filter;
        restockFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderRestockItems();
      });
    });
    
    // Search input
    if (restockSearchInput) {
      restockSearchInput.addEventListener('input', (e) => {
        currentRestockSearch = e.target.value;
        renderRestockItems();
      });
    }
    
    // Category filter
    if (restockCategoryFilter) {
      restockCategoryFilter.addEventListener('change', (e) => {
        currentRestockCategory = e.target.value;
        renderRestockItems();
      });
    }
    
    // Render restock items
    function renderRestockItems() {
      let filtered = restockData;
      
      // Apply stock status filter
      if (currentRestockFilter === 'low') {
        filtered = filtered.filter(item => item.status === 'low');
      } else if (currentRestockFilter === 'out') {
        filtered = filtered.filter(item => item.status === 'out');
      }
      
      // Apply search filter
      if (currentRestockSearch) {
        filtered = filtered.filter(item => 
          item.product.toLowerCase().includes(currentRestockSearch.toLowerCase())
        );
      }
      
      // Apply category filter
      if (currentRestockCategory !== 'all') {
        filtered = filtered.filter(item => item.category === currentRestockCategory);
      }
      
      let html = '';
      
      if (filtered.length === 0) {
        html = '<div style="text-align: center; padding: 3rem; color: #9ca3af;">No items found matching your filters.</div>';
      } else {
        filtered.forEach((item, index) => {
        const actualIndex = restockData.indexOf(item);
        const statusClass = item.status === 'low' ? 'low' : item.status === 'out' ? 'out' : '';
        const statusText = item.status === 'low' ? 'Low Stock' : item.status === 'out' ? 'Out of Stock' : 'Normal';
        
        html += `
          <div class="restock-card ${item.checked ? 'selected' : ''}" data-index="${actualIndex}">
            <div class="restock-card-header">
              <div class="restock-card-title">
                <div class="restock-product-name">${item.product}</div>
                <div class="restock-category-status">
                  <span class="restock-category">${item.category}</span>
                  ${statusClass ? `<span class="restock-status ${statusClass}">${statusText}</span>` : ''}
                </div>
              </div>
              <div class="restock-checkbox-delete">
                <input type="checkbox" class="restock-checkbox" data-index="${actualIndex}" ${item.checked ? 'checked' : ''}>
              </div>
            </div>
            
            <div class="restock-card-body">
              <div class="restock-field">
                <div class="restock-field-label">Monthly Sold</div>
                <div class="restock-field-value">${item.monthlySold}</div>
              </div>
              
              <div class="restock-field">
                <div class="restock-field-label">Current Stock</div>
                <div class="restock-field-value">${item.currentStock}</div>
              </div>
              
              <div class="restock-field">
                <div class="restock-field-label">Previous Cost</div>
                <div class="restock-field-value">₱${item.previousCost}</div>
              </div>
            </div>
            
            <div class="restock-card-footer">
              <div class="restock-inputs-row">
                <div class="restock-input-group">
                  <div class="restock-input-label">New Cost (Per Item)</div>
                  <input type="number" class="new-cost-input" data-index="${actualIndex}" 
                         placeholder="₱0.00" value="${item.newCost}" step="0.01">
                </div>
                
                <div class="restock-input-group">
                  <div class="restock-input-label">New Stocks (Qty)</div>
                  <input type="number" class="new-stock-input" data-index="${actualIndex}" 
                         placeholder="0" value="${item.newStockQty || ''}" min="0">
                </div>
              </div>
              
              <button class="btn-add-cost" data-index="${actualIndex}">+ New Cost</button>
            </div>
          </div>
        `;
        });
      }
      
      restockItemsList.innerHTML = html;
      
      // Add event listeners
      attachRestockEventListeners();
      updateRestockCounter();
    }
    
    // Attach event listeners to restock cards
    function attachRestockEventListeners() {
      // Checkboxes
      document.querySelectorAll('.restock-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const index = parseInt(e.target.dataset.index);
          restockData[index].checked = e.target.checked;
          renderRestockItems();
        });
      });
      
      // New cost inputs
      document.querySelectorAll('.new-cost-input').forEach(input => {
        input.addEventListener('input', (e) => {
          const index = parseInt(e.target.dataset.index);
          restockData[index].newCost = e.target.value;
        });
      });
      
      // New stock inputs - auto-check when value added
      document.querySelectorAll('.new-stock-input').forEach(input => {
        input.addEventListener('input', (e) => {
          const index = parseInt(e.target.dataset.index);
          const value = parseInt(e.target.value) || 0;
          restockData[index].newStockQty = value;
          
          // Auto-check if value > 0
          if (value > 0 && !restockData[index].checked) {
            restockData[index].checked = true;
            renderRestockItems();
          }
          updateRestockCounter();
        });
      });
      
      // Add cost buttons
      document.querySelectorAll('.btn-add-cost').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          const input = document.querySelector(`.new-cost-input[data-index="${index}"]`);
          if (input) input.focus();
        });
      });
    }
    
    // Update restock counter
    function updateRestockCounter() {
      const checkedCount = restockData.filter(item => item.checked && item.newStockQty > 0).length;
      updateCounter.textContent = `(${checkedCount})`;
      
      if (checkedCount > 0) {
        updateStocksBtn.classList.add('active');
        updateStocksBtn.style.cursor = 'pointer';
      } else {
        updateStocksBtn.classList.remove('active');
        updateStocksBtn.style.cursor = 'not-allowed';
      }
    }
    
    // Setup delete button handler
    function setupDeleteButton() {
      const btn = document.getElementById('deleteSelectedBtn');
      if (!btn) {
        console.error('Delete button NOT found!');
        return;
      }
      
      console.log('Setting up delete button handler');
      
      // Remove any existing listeners by cloning
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', () => {
        console.log('✕ Delete button clicked!');
        const toDelete = restockData.filter(item => item.checked);
        console.log('Items to delete:', toDelete.length);
        
        if (toDelete.length === 0) {
          alert('⚠️ No items selected. Please check items first.');
          return;
        }
        
        // Request password
        const password = prompt(`🔒 Enter password to delete ${toDelete.length} item(s):`);
        
        if (password === null) {
          // User cancelled
          console.log('User cancelled password prompt');
          return;
        }
        
        if (password !== DELETE_PASSWORD) {
          alert('❌ Incorrect password! Deletion cancelled.');
          console.log('Wrong password entered');
          return;
        }
        
        // Password correct, confirm deletion
        if (confirm(`✅ Password accepted. Delete ${toDelete.length} selected item(s)?`)) {
          restockData = restockData.filter(item => !item.checked);
          renderRestockItems();
          alert(`✓ ${toDelete.length} item(s) deleted successfully!`);
          console.log('Items deleted successfully');
        }
      });
      
      console.log('Delete button handler attached successfully');
    }
    
    // Update stocks
    if (updateStocksBtn) {
      updateStocksBtn.addEventListener('click', () => {
        const toUpdate = restockData.filter(item => item.checked && item.newStockQty > 0);
        
        if (toUpdate.length === 0) {
          alert('No items to update. Add stock quantities first.');
          return;
        }
        
        // Process updates
        toUpdate.forEach(item => {
          item.currentStock += item.newStockQty;
          if (item.newCost) {
            item.previousCost = item.newCost;
          }
          item.newStockQty = 0;
          item.newCost = '';
          item.checked = false;
        });
        
        alert(`Successfully updated ${toUpdate.length} item(s)!`);
        renderRestockItems();
      });
    }
    
    // END RESTOCK SYSTEM
    
    // === MANUAL INVENTORY UPDATE SYSTEM ===
    const goToManualUpdateBtn = document.getElementById('goToManualUpdateBtn');
    const backFromManualUpdateBtn = document.getElementById('backFromManualUpdateBtn');
    const manualUpdatePage = document.getElementById('manualUpdatePage');
    const manualUpdateList = document.getElementById('manualUpdateList');
    const manualUpdateDateDisplay = document.getElementById('manualUpdateDateDisplay');
    const saveManualUpdatesBtn = document.getElementById('saveManualUpdatesBtn');
    const manualUpdateSearchInput = document.getElementById('manualUpdateSearchInput');
    const manualUpdateCategoryFilter = document.getElementById('manualUpdateCategoryFilter');

    // Filter state
    let currentManualUpdateSearch = '';
    let currentManualUpdateCategory = 'all';

    // Search input for manual update
    if (manualUpdateSearchInput) {
      manualUpdateSearchInput.addEventListener('input', (e) => {
        currentManualUpdateSearch = e.target.value;
        renderManualUpdateList();
      });
    }

    // Category filter for manual update
    if (manualUpdateCategoryFilter) {
      manualUpdateCategoryFilter.addEventListener('change', (e) => {
        currentManualUpdateCategory = e.target.value;
        renderManualUpdateList();
      });
    }
    
    // Navigate to manual update page
    if (goToManualUpdateBtn) {
      goToManualUpdateBtn.addEventListener('click', () => {
        // Request password before opening
        const password = prompt('🔒 Enter password to access Manual Inventory Update:\n\n(This action will be logged for tracking purposes)');
        
        if (password === null) {
          // User cancelled
          console.log('Manual update access cancelled by user');
          return;
        }
        
        if (password !== MANUAL_UPDATE_PASSWORD) {
          alert('❌ Incorrect password! Access denied.');
          console.log('Failed manual update access attempt - wrong password');
          return;
        }
        
        // Password correct - log and open
        const timestamp = new Date().toLocaleString();
        console.log(`✅ Manual Inventory Update accessed at ${timestamp}`);
        console.log('User authenticated successfully');
        
        inventoryPage.classList.remove('active');
        manualUpdatePage.style.display = 'block';
        renderManualUpdateList();
        
        // Scroll to top
        window.scrollTo(0, 0);
      });
    }
    
    // Navigate back to inventory
    if (backFromManualUpdateBtn) {
      backFromManualUpdateBtn.addEventListener('click', () => {
        manualUpdatePage.style.display = 'none';
        inventoryPage.classList.add('active');
      });
    }

    // Populate manual update category filter
    function populateManualUpdateCategoryFilter() {
      if (!manualUpdateCategoryFilter) return;
      
      // Get unique categories from productsMaster
      const categories = [...new Set(productsMaster.map(item => item.category))].sort();
      
      manualUpdateCategoryFilter.innerHTML = '<option value="all">All Categories</option>';
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        manualUpdateCategoryFilter.appendChild(option);
      });
    }
    
    // Render manual update list
    function renderManualUpdateList() {
      const currentDateStr = currentSelectedDate.toISOString().split('T')[0];
      
      // Update date display
      if (manualUpdateDateDisplay) {
        manualUpdateDateDisplay.textContent = currentSelectedDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      if (!manualUpdateList) return;
      
      let html = '';
      
      // Filter products
      let filtered = [...productsMaster];
      
      // Apply search filter
      if (currentManualUpdateSearch) {
        filtered = filtered.filter(item => 
          item.product.toLowerCase().includes(currentManualUpdateSearch.toLowerCase())
        );
      }
      
      // Apply category filter
      if (currentManualUpdateCategory !== 'all') {
        filtered = filtered.filter(item => item.category === currentManualUpdateCategory);
      }
      
      // Sort products by category then name
      const sortedProducts = filtered.sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.product.localeCompare(b.product);
      });
      
      sortedProducts.forEach((product, index) => {
        const currentSales = (salesByDate[currentDateStr] && salesByDate[currentDateStr][product.product]) || 0;
        const currentStock = product.stock || 0;
        
        // Determine stock status color
        let stockColor = '#10b981'; // Green for good stock
        let stockStatus = 'Good';
        if (currentStock === 0) {
          stockColor = '#dc2626'; // Red for out of stock
          stockStatus = 'Out of Stock';
        } else if (currentStock < 20) {
          stockColor = '#f59e0b'; // Orange for low stock
          stockStatus = 'Low Stock';
        }
        
        html += `
          <div class="manual-update-item">
            <div class="manual-update-item-info">
              <div class="manual-update-item-name">${product.product}</div>
              <span class="manual-update-item-category">${product.category}</span>
            </div>
            
            <div class="manual-update-field">
              <div class="manual-update-field-label">Expiry Date</div>
              <div class="manual-update-field-value">${formatDate(product.expiry)}</div>
            </div>
            
            <div class="manual-update-field">
              <div class="manual-update-field-label">Current Stock</div>
              <div class="manual-update-field-value" style="color: ${stockColor}; font-weight: 700;">${currentStock}</div>
            </div>
            
            <div class="manual-update-field">
              <div class="manual-update-field-label">Sales (Edit)</div>
              <input type="number" 
                     class="manual-sales-input" 
                     data-product="${product.product}" 
                     value="${currentSales}" 
                     min="0">
            </div>
          </div>
        `;
      });
      
      manualUpdateList.innerHTML = html || '<p style="text-align:center; padding:2rem; color:#9ca3af;">No products found</p>';
    }
    
    // Save manual updates
    if (saveManualUpdatesBtn) {
      saveManualUpdatesBtn.addEventListener('click', () => {
        const currentDateStr = currentSelectedDate.toISOString().split('T')[0];
        const inputs = document.querySelectorAll('.manual-sales-input');
        let changesMade = false;
        
        // Ensure date exists in salesByDate
        if (!salesByDate[currentDateStr]) {
          salesByDate[currentDateStr] = {};
        }
        
        inputs.forEach(input => {
          const productName = input.dataset.product;
          const newValue = parseInt(input.value) || 0;
          const oldValue = salesByDate[currentDateStr][productName] || 0;
          
          if (newValue !== oldValue) {
            salesByDate[currentDateStr][productName] = newValue;
            changesMade = true;
          }
        });
        
        if (changesMade) {
          // Show saving animation
          saveManualUpdatesBtn.disabled = true;
          saveManualUpdatesBtn.textContent = '💾 Saving...';
          saveManualUpdatesBtn.style.opacity = '0.6';
          
          setTimeout(() => {
            // Success state
            saveManualUpdatesBtn.textContent = '✅ Saved!';
            saveManualUpdatesBtn.style.background = '#10b981';
            saveManualUpdatesBtn.style.opacity = '1';
            
            // Update inventory view if needed
            if (typeof renderInventoryProducts === 'function') {
              renderInventoryProducts();
            }
            
            console.log('Manual sales updates saved for:', currentDateStr);
            
            // Close and return after delay
            setTimeout(() => {
              manualUpdatePage.style.display = 'none';
              inventoryPage.style.display = 'block';
              
              // Reset button
              saveManualUpdatesBtn.disabled = false;
              saveManualUpdatesBtn.textContent = '💾 Save All Changes';
              saveManualUpdatesBtn.style.background = '#2563eb';
            }, 1000);
            
          }, 600);
        } else {
          alert('ℹ️ No changes to save.');
        }
      });
    }
    
    // END MANUAL INVENTORY UPDATE SYSTEM
    
    // === PATIENT LIST / LABORATORY LOGBOOK SYSTEM ===
    const patientNameInput = document.getElementById('patientNameInput');
    const labTypeSelect = document.getElementById('labTypeSelect');
    const addPatientBtn = document.getElementById('addPatientBtn');
    const patientRecordsBody = document.getElementById('patientRecordsBody');
    const manageLabTypesBtn = document.getElementById('manageLabTypesBtn');
    const labTypesModal = document.getElementById('labTypesModal');
    const closeLabTypesModal = document.getElementById('closeLabTypesModal');
    const labTypesList = document.getElementById('labTypesList');
    const newLabTypeInput = document.getElementById('newLabTypeInput');
    const addLabTypeBtn = document.getElementById('addLabTypeBtn');
    
    // Current nurse (from user profile - you can update this based on your auth system)
    let currentNurse = 'Mark Cruz'; // This should come from your login system
    
    // Lab types preset (can be modified)
    let labTypes = [
      'Complete Blood Count (CBC)',
      'Urinalysis',
      'Fecalysis',
      'Blood Chemistry',
      'Lipid Profile',
      'Blood Typing',
      'Pregnancy Test',
      'Drug Test',
      'X-Ray',
      'ECG',
      'Ultrasound',
      'CT Scan',
      'MRI'
    ];
    
    // Patient records storage
    let patientRecords = [];
    
    // Initialize lab types dropdown
    function populateLabTypeSelect() {
      if (labTypeSelect) {
        labTypeSelect.innerHTML = '<option value="">Select Lab Type</option>';
        labTypes.forEach(type => {
          const option = document.createElement('option');
          option.value = type;
          option.textContent = type;
          labTypeSelect.appendChild(option);
        });
      }
    }
    
    // Render lab types in management modal
    function renderLabTypesList() {
      if (labTypesList) {
        labTypesList.innerHTML = labTypes.map((type, index) => `
          <div class="lab-type-item">
            <span class="lab-type-name">${type}</span>
            <button class="btn-delete-lab-type" data-index="${index}">🗑️ Delete</button>
          </div>
        `).join('');
        
        // Add delete handlers
        document.querySelectorAll('.btn-delete-lab-type').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            if (confirm(`Delete "${labTypes[index]}"?`)) {
              labTypes.splice(index, 1);
              renderLabTypesList();
              populateLabTypeSelect();
            }
          });
        });
      }
    }
    
    // Add new lab type
    if (addLabTypeBtn && newLabTypeInput) {
      addLabTypeBtn.addEventListener('click', () => {
        const newType = newLabTypeInput.value.trim();
        if (newType && !labTypes.includes(newType)) {
          labTypes.push(newType);
          newLabTypeInput.value = '';
          renderLabTypesList();
          populateLabTypeSelect();
        } else if (labTypes.includes(newType)) {
          alert('⚠️ This lab type already exists!');
        } else {
          alert('⚠️ Please enter a lab type name.');
        }
      });
    }
    
    // Open lab types management modal
    if (manageLabTypesBtn && labTypesModal) {
      manageLabTypesBtn.addEventListener('click', () => {
        labTypesModal.classList.add('active');
        renderLabTypesList();
      });
    }
    
    // Close lab types modal
    if (closeLabTypesModal && labTypesModal) {
      closeLabTypesModal.addEventListener('click', () => {
        labTypesModal.classList.remove('active');
      });
    }
    
    // Add patient record
    if (addPatientBtn) {
      addPatientBtn.addEventListener('click', () => {
        const patientName = patientNameInput.value.trim();
        const labType = labTypeSelect.value;
        
        // Validation
        if (!patientName) {
          alert('⚠️ Please enter patient name');
          return;
        }
        
        if (!labType) {
          alert('⚠️ Please select laboratory type');
          return;
        }
        
        // Create timestamp
        const now = new Date();
        const timestamp = now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit',
          hour12: true 
        });
        const date = now.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        
        // Create record
        const record = {
          timestamp: timestamp,
          date: date,
          patientName: patientName,
          labType: labType,
          nurseOnDuty: currentNurse,
          assigned: '' // Empty for now
        };
        
        // Add to records
        patientRecords.unshift(record); // Add to beginning (newest first)
        
        // Clear form
        patientNameInput.value = '';
        labTypeSelect.value = '';
        
        // Render records
        renderPatientRecords();
        
        // Success feedback
        addPatientBtn.textContent = '✓ Added!';
        addPatientBtn.style.background = '#10b981';
        setTimeout(() => {
          addPatientBtn.textContent = '+ Add Patient';
          addPatientBtn.style.background = '#10b981';
        }, 2000);
      });
    }
    
    // Render patient records
    function renderPatientRecords() {
      if (patientRecordsBody) {
        if (patientRecords.length === 0) {
          patientRecordsBody.innerHTML = `
            <tr>
              <td colspan="6" style="text-align: center; padding: 2rem; color: #9ca3af;">
                No patient records yet. Add your first patient above.
              </td>
            </tr>
          `;
        } else {
          patientRecordsBody.innerHTML = patientRecords.map(record => `
            <tr>
              <td>${record.timestamp}</td>
              <td>${record.date}</td>
              <td style="font-weight: 600; color: #111827;">${record.patientName}</td>
              <td>${record.labType}</td>
              <td>${record.nurseOnDuty}</td>
              <td style="color: #9ca3af; font-style: italic;">${record.assigned || 'Pending'}</td>
            </tr>
          `).join('');
        }
      }
    }
    
    // Initialize patient list system
    populateLabTypeSelect();
    renderPatientRecords();
    
    // END PATIENT LIST / LABORATORY LOGBOOK SYSTEM
    
    // === SALES PAGE SYSTEM ===
    const salesTableBody = document.getElementById('salesTableBody');
    const salesTotalRevenue = document.getElementById('salesTotalRevenue');
    const salesTotalTransactions = document.getElementById('salesTotalTransactions');
    const salesTotalItems = document.getElementById('salesTotalItems');
    const salesAverageSale = document.getElementById('salesAverageSale');
    const salesSearchInput = document.getElementById('salesSearchInput');
    const exportSalesBtn = document.getElementById('exportSalesBtn');
    const salesPeriodBtns = document.querySelectorAll('.sales-period-btn');
    const categoryBreakdownGrid = document.getElementById('categoryBreakdownGrid');

    let currentSalesPeriod = 'today';
    let currentSalesSearch = '';

    // Check if mobile device
    function isMobileDevice() {
      return window.innerWidth <= 768;
    }

    // Format mobile-friendly item breakdown
    function formatItemsForMobile(items, total) {
      const itemsHtml = items.map(item => {
        const subtotal = item.quantity * item.price;
        return `
          <div class="sales-item-row">
            <span class="sales-item-name">${item.name}</span>
            <span class="sales-item-calculation">${item.quantity} × ₱${item.price.toLocaleString()}</span>
            <span class="sales-item-subtotal">= ₱${subtotal.toLocaleString()}</span>
          </div>
        `;
      }).join('');
      
      return `
        <div class="sales-items-breakdown">
          ${itemsHtml}
          <div class="sales-breakdown-total">
            <span class="sales-breakdown-total-label">TOTAL:</span>
            <span class="sales-breakdown-total-value">₱${total.toLocaleString()}</span>
          </div>
        </div>
      `;
    }

    // Sample sales data - in production, this would come from your database
    let salesRecords = [
      {
        id: 1,
        timestamp: '2026-01-26 09:30:00',
        patient: 'John Doe',
        nurse: 'Mark Cruz',
        items: [
          { name: 'Paracetamol', category: 'Medicine', quantity: 2, price: 5 },
          { name: 'Face Mask', category: 'PPE', quantity: 5, price: 10 }
        ],
        total: 60
      },
      {
        id: 2,
        timestamp: '2026-01-26 10:15:00',
        patient: 'Jane Smith',
        nurse: 'Maria Santos',
        items: [
          { name: 'Syringe', category: 'Supplies', quantity: 3, price: 8 },
          { name: 'Bandage', category: 'Supplies', quantity: 2, price: 15 }
        ],
        total: 54
      },
      {
        id: 3,
        timestamp: '2026-01-26 11:00:00',
        patient: 'Robert Johnson',
        nurse: 'Mark Cruz',
        items: [
          { name: 'Alcohol', category: 'Hygiene', quantity: 1, price: 100 },
          { name: 'Cotton', category: 'Supplies', quantity: 1, price: 20 }
        ],
        total: 120
      },
      {
        id: 4,
        timestamp: '2026-01-26 14:30:00',
        patient: 'Mary Williams',
        nurse: 'Jane Smith',
        items: [
          { name: 'Ibuprofen', category: 'Medicine', quantity: 3, price: 8 },
          { name: 'Vitamin C', category: 'Medicine', quantity: 2, price: 10 }
        ],
        total: 44
      },
      {
        id: 5,
        timestamp: '2026-01-25 15:45:00',
        patient: 'David Brown',
        nurse: 'Mark Cruz',
        items: [
          { name: 'N95 Mask', category: 'PPE', quantity: 10, price: 50 },
          { name: 'Gloves', category: 'PPE', quantity: 5, price: 5 }
        ],
        total: 525
      },
      {
        id: 6,
        timestamp: '2026-01-20 09:00:00',
        patient: 'Sarah Davis',
        nurse: 'Maria Santos',
        items: [
          { name: 'Thermometer', category: 'Equipment', quantity: 1, price: 200 },
          { name: 'Alcohol', category: 'Hygiene', quantity: 2, price: 100 }
        ],
        total: 400
      },
      {
        id: 7,
        timestamp: '2026-01-15 11:30:00',
        patient: 'Michael Wilson',
        nurse: 'Mark Cruz',
        items: [
          { name: 'Amoxicillin', category: 'Medicine', quantity: 1, price: 15 },
          { name: 'Face Shield', category: 'PPE', quantity: 2, price: 30 }
        ],
        total: 75
      },
      {
        id: 8,
        timestamp: '2025-12-28 16:20:00',
        patient: 'Lisa Martinez',
        nurse: 'Jane Smith',
        items: [
          { name: 'BP Monitor', category: 'Equipment', quantity: 1, price: 1500 },
          { name: 'Sanitizer', category: 'Hygiene', quantity: 3, price: 80 }
        ],
        total: 1740
      }
    ];

    // Period selector
    salesPeriodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentSalesPeriod = btn.dataset.period;
        salesPeriodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSalesRecords();
      });
    });

    // Search input
    if (salesSearchInput) {
      salesSearchInput.addEventListener('input', (e) => {
        currentSalesSearch = e.target.value.toLowerCase();
        renderSalesRecords();
      });
    }

    // Filter sales by period
    function filterSalesByPeriod(records) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const yearStart = new Date(now.getFullYear(), 0, 1);
      
      return records.filter(record => {
        const recordDate = new Date(record.timestamp);
        
        if (currentSalesPeriod === 'today') {
          return recordDate >= today;
        } else if (currentSalesPeriod === 'month') {
          return recordDate >= monthStart;
        } else if (currentSalesPeriod === 'year') {
          return recordDate >= yearStart;
        }
        
        return true;
      });
    }

    // Render sales records
    function renderSalesRecords() {
      let filtered = [...salesRecords];
      
      // Filter by period
      filtered = filterSalesByPeriod(filtered);
      
      // Filter by search
      if (currentSalesSearch) {
        filtered = filtered.filter(record => {
          const searchableText = `
            ${record.patient}
            ${record.nurse}
            ${record.items.map(item => item.name).join(' ')}
          `.toLowerCase();
          
          return searchableText.includes(currentSalesSearch);
        });
      }
      
      // Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // Calculate summary
      const totalRevenue = filtered.reduce((sum, record) => sum + record.total, 0);
      const totalTransactions = filtered.length;
      const totalItems = filtered.reduce((sum, record) => {
        return sum + record.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
      }, 0);
      const averageSale = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
      
      // Update summary cards
      if (salesTotalRevenue) salesTotalRevenue.textContent = `₱${totalRevenue.toLocaleString()}`;
      if (salesTotalTransactions) salesTotalTransactions.textContent = totalTransactions.toLocaleString();
      if (salesTotalItems) salesTotalItems.textContent = totalItems.toLocaleString();
      if (salesAverageSale) salesAverageSale.textContent = `₱${Math.round(averageSale).toLocaleString()}`;
      
      // Render table
      if (salesTableBody) {
        if (filtered.length === 0) {
          salesTableBody.innerHTML = `
            <tr>
              <td colspan="6">
                <div class="sales-empty-state">
                  <div class="sales-empty-icon">📊</div>
                  <h3>No sales records found</h3>
                  <p>No sales match your current filters</p>
                </div>
              </td>
            </tr>
          `;
        } else {
                salesTableBody.innerHTML = filtered.map(record => {
                const date = new Date(record.timestamp);
                const formattedDate = date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                });
                const formattedTime = date.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                });
                
                // Build detailed items breakdown
                const breakdownWithTotal = formatItemsForMobile(record.items, record.total);
                
                return `
                <tr>
                  <td class="sales-date" data-label="Date & Time">${formattedDate}<br><small>${formattedTime}</small></td>
                  <td class="sales-patient" data-label="Patient">${record.patient}</td>
                  <td class="sales-nurse" data-label="Nurse">${record.nurse}</td>
                  <td data-label="Items Breakdown">${breakdownWithTotal}</td>
                  <td class="sales-total" data-label="Total">₱${record.total.toLocaleString()}</td>
                </tr>
              `;
                    }).join('');
      
          // Make items collapsible on mobile
          setTimeout(makeItemsCollapsible, 100);
        }
      }
      
      // Render category breakdown
      renderCategoryBreakdown(filtered);
    }

    // Render category breakdown
    function renderCategoryBreakdown(records) {
      const categoryTotals = {};
      
      records.forEach(record => {
        record.items.forEach(item => {
          if (!categoryTotals[item.category]) {
            categoryTotals[item.category] = 0;
          }
          categoryTotals[item.category] += item.quantity * item.price;
        });
      });
      
      if (categoryBreakdownGrid) {
        const categories = Object.keys(categoryTotals).sort();
        
        if (categories.length === 0) {
          categoryBreakdownGrid.innerHTML = '<p style="color: #9ca3af; text-align: center;">No data available</p>';
        } else {
          categoryBreakdownGrid.innerHTML = categories.map(category => `
            <div class="category-breakdown-item">
              <div class="category-breakdown-name">${category}</div>
              <div class="category-breakdown-value">₱${categoryTotals[category].toLocaleString()}</div>
            </div>
          `).join('');
        }
      }
    }

    // Export to Excel (CSV format)
    if (exportSalesBtn) {
      exportSalesBtn.addEventListener('click', () => {
        let filtered = filterSalesByPeriod([...salesRecords]);
        
        if (currentSalesSearch) {
          filtered = filtered.filter(record => {
            const searchableText = `
              ${record.patient}
              ${record.nurse}
              ${record.items.map(item => item.name).join(' ')}
            `.toLowerCase();
            
            return searchableText.includes(currentSalesSearch);
          });
        }
        
        if (filtered.length === 0) {
          alert('No data to export');
          return;
        }
        
           // Create CSV content
            let csv = 'Date,Time,Patient Name,Nurse,Item Name,Quantity,Unit Price,Subtotal,Transaction Total\n';
            
            filtered.forEach(record => {
              const date = new Date(record.timestamp);
              const formattedDate = date.toLocaleDateString('en-US');
              const formattedTime = date.toLocaleTimeString('en-US');
              
              // Add a row for each item
              record.items.forEach((item, index) => {
                const subtotal = item.quantity * item.price;
                const transactionTotal = index === 0 ? record.total : ''; // Only show total on first item
                
                csv += `"${formattedDate}","${formattedTime}","${record.patient}","${record.nurse}","${item.name}",${item.quantity},${item.price},${subtotal},${transactionTotal}\n`;
              });
              
              // Add empty row between transactions for readability
              csv += '\n';
            });
        
        // Create download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const periodText = currentSalesPeriod === 'today' ? 'Today' : 
                          currentSalesPeriod === 'month' ? 'This_Month' : 'This_Year';
        
        link.setAttribute('href', url);
        link.setAttribute('download', `Sales_Report_${periodText}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        exportSalesBtn.textContent = '✓ Exported!';
        exportSalesBtn.style.background = '#10b981';
        setTimeout(() => {
          exportSalesBtn.textContent = '📊 Export to Excel';
          exportSalesBtn.style.background = '#10b981';
        }, 2000);
      });
    }


    // Make sales items collapsible on mobile
    function makeItemsCollapsible() {
      if (window.innerWidth <= 768) {
        document.querySelectorAll('.sales-items-breakdown').forEach((breakdown, index) => {
          const items = breakdown.querySelectorAll('.sales-item-row').length;
          const total = breakdown.querySelector('.sales-breakdown-total-value').textContent;
          
          const summary = document.createElement('div');
          summary.className = 'sales-items-summary sales-item-toggle';
          summary.textContent = `${items} item${items > 1 ? 's' : ''} • ${total}`;
          summary.onclick = function() {
            breakdown.classList.toggle('collapsed');
            this.classList.toggle('collapsed');
          };
          
          breakdown.parentElement.insertBefore(summary, breakdown);
          breakdown.classList.add('collapsed');
          summary.classList.add('collapsed');
        });
      }
    }

    // Call after rendering on mobile
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        renderSalesRecords();
      }
    });

    // Initialize sales page
    renderSalesRecords();

    // END SALES PAGE SYSTEM
    
    // === INITIALIZE DASHBOARD WITH REAL INVENTORY DATA ===
    console.log('=== INITIALIZING DASHBOARD WITH REAL DATA ===');
    
    if (typeof updateDashboardOverview === 'function') {
      console.log('Loading dashboard inventory overview...');
      updateDashboardOverview();
    }
    
    if (typeof updateDashboardData === 'function') {
      console.log('Loading dashboard data for: today');
      updateDashboardData('today');
    }
    
    console.log('Dashboard initialized with real inventory counts');
    
    // Run initialization immediately
    initInventorySystem();
    
    // Also run when inventory page becomes visible
    if (inventoryPage) {
      // Check if page is already active
      if (inventoryPage.classList.contains('active')) {
        initInventorySystem();
      }
      
      // Watch for when page becomes active
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (inventoryPage.classList.contains('active')) {
              initInventorySystem();
            }
          }
        });
      });
      
      observer.observe(inventoryPage, { attributes: true });
    }


    // Smooth scroll to top when changing filters on mobile
salesPeriodBtns.forEach(btn => {
  const originalHandler = btn.onclick;
  btn.addEventListener('click', () => {
    if (isMobileDevice()) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  });
});

// Optimize mobile performance - lazy load if many records
function optimizeMobileRendering() {
  if (isMobileDevice() && salesRecords.length > 20) {
    // Show loading state
    const loadingHtml = `
      <tr>
        <td colspan="5">
          <div style="text-align: center; padding: 2rem; color: #6b7280;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏳</div>
            <div>Loading sales records...</div>
          </div>
        </td>
      </tr>
    `;
    
    if (salesTableBody) {
      salesTableBody.innerHTML = loadingHtml;
    }
    
    // Render after a brief delay to show loading state
    setTimeout(renderSalesRecords, 100);
  } else {
    renderSalesRecords();
  }
}

// Use optimized rendering when opening sales page
const salesPageLink = document.querySelector('[data-page="accounts"]');
if (salesPageLink) {
  salesPageLink.addEventListener('click', () => {
    setTimeout(optimizeMobileRendering, 50);
  });
}
    

    // === LEAVE MANAGEMENT SYSTEM ===
    
    // Employee data (integrate with your employee masterlist)
    const employees = [
      { id: 'LRCI-001', name: 'Golloso, Cristina Gahita', position: 'Chief Operating Officer', department: 'Executive', vlEntitled: 15, slEntitled: 15, vlUsed: 0, slUsed: 0 },
      { id: 'LRCI-002', name: 'Santiago, Diana Bagual', position: 'Administrative Manager', department: 'Administrative', vlEntitled: 7, slEntitled: 7, vlUsed: 0, slUsed: 0 },
      { id: 'LRCI-003', name: 'Cabigas, Karen Sumagit', position: 'Medical Director', department: 'Executive', vlEntitled: 15, slEntitled: 15, vlUsed: 0, slUsed: 0 }
    ];

    // Current user (from your auth system)
    let currentUser = { id: 'LRCI-002', name: 'Santiago, Diana Bagual', role: 'owner', position: 'Administrative Manager', department: 'Administrative' };

    // Leave applications storage
    let leaveApplications = [];

    // Initialize Leave System
    function initializeLeaveSystem() {
      updateLeaveStats();
      renderLeaveRequests('pending');
      setupLeaveEventListeners();
    }

    // Setup Event Listeners
    function setupLeaveEventListeners() {
      const applyBtn = document.getElementById('applyLeaveBtn');
      const closeApply = document.getElementById('closeApplyLeaveModal');
      const cancelApply = document.getElementById('cancelApplyLeave');
      const form = document.getElementById('applyLeaveForm');
      const closeView = document.getElementById('closeViewLeaveModal');
      const startDate = document.getElementById('leaveStartDate');
      const endDate = document.getElementById('leaveEndDate');
      const leaveType = document.getElementById('leaveType');
      const leaveTabs = document.querySelectorAll('.leave-tab');

      if (applyBtn) applyBtn.addEventListener('click', () => {
        document.getElementById('applyLeaveModal').classList.add('active');
        updateLeaveBalance();
      });

      if (closeApply) closeApply.addEventListener('click', () => {
        document.getElementById('applyLeaveModal').classList.remove('active');
        form.reset();
      });

      if (cancelApply) cancelApply.addEventListener('click', () => {
        document.getElementById('applyLeaveModal').classList.remove('active');
        form.reset();
      });

      if (closeView) closeView.addEventListener('click', () => {
        document.getElementById('viewLeaveModal').classList.remove('active');
      });

      if (startDate) startDate.addEventListener('change', calculateLeaveDays);
      if (endDate) endDate.addEventListener('change', calculateLeaveDays);
      if (leaveType) leaveType.addEventListener('change', updateLeaveBalance);

      if (form) form.addEventListener('submit', handleLeaveApplication);

      leaveTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const filter = tab.dataset.filter;
          leaveTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          renderLeaveRequests(filter);
        });
      });
    }

    // Calculate Leave Days
    function calculateLeaveDays() {
      const start = document.getElementById('leaveStartDate').value;
      const end = document.getElementById('leaveEndDate').value;
      const daysInput = document.getElementById('leaveDays');

      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        
        if (endDate >= startDate) {
          const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
          daysInput.value = days;
          updateLeaveBalance();
        } else {
          daysInput.value = 0;
          alert('End date must be after start date!');
        }
      }
    }

    // Update Leave Balance
    function updateLeaveBalance() {
      const leaveType = document.getElementById('leaveType').value;
      const days = parseInt(document.getElementById('leaveDays').value) || 0;
      const balanceInfo = document.getElementById('leaveBalanceInfo');

      if (!leaveType || days === 0) {
        balanceInfo.innerHTML = '';
        return;
      }

      const employee = employees.find(e => e.id === currentUser.id);
      if (!employee) return;

      let entitled, used, balance, remaining;
      
      if (leaveType === 'Vacation Leave') {
        entitled = employee.vlEntitled;
        used = employee.vlUsed;
      } else {
        entitled = employee.slEntitled;
        used = employee.slUsed;
      }

      balance = entitled - used;
      remaining = balance - days;
      const sufficient = remaining >= 0;

      balanceInfo.innerHTML = `
        <div class="balance-row">
          <span class="balance-label">${leaveType} Entitled:</span>
          <span class="balance-value">${entitled} days</span>
        </div>
        <div class="balance-row">
          <span class="balance-label">Used:</span>
          <span class="balance-value">${used} days</span>
        </div>
        <div class="balance-row">
          <span class="balance-label">Current Balance:</span>
          <span class="balance-value ${sufficient ? 'sufficient' : 'insufficient'}">${balance} days</span>
        </div>
        <div class="balance-row" style="border-top: 2px solid #e5e7eb; margin-top: 0.5rem; padding-top: 0.5rem;">
          <span class="balance-label">After This Leave:</span>
          <span class="balance-value ${sufficient ? 'sufficient' : 'insufficient'}">${remaining} days</span>
        </div>
        ${!sufficient ? '<p style="color: #ef4444; margin-top: 0.5rem; font-weight: 600;">⚠️ Insufficient leave balance!</p>' : ''}
      `;
    }

    // Handle Leave Application
    function handleLeaveApplication(e) {
      e.preventDefault();

      const leaveType = document.getElementById('leaveType').value;
      const startDate = document.getElementById('leaveStartDate').value;
      const endDate = document.getElementById('leaveEndDate').value;
      const days = parseInt(document.getElementById('leaveDays').value);
      const reason = document.getElementById('leaveReason').value;

      const employee = employees.find(e => e.id === currentUser.id);
      let balance = leaveType === 'Vacation Leave' ? (employee.vlEntitled - employee.vlUsed) : (employee.slEntitled - employee.slUsed);

      if (days > balance) {
        alert('⚠️ Insufficient leave balance!');
        return;
      }

      const newApp = {
        id: `LV-${new Date().getFullYear()}-${String(leaveApplications.length + 1).padStart(3, '0')}`,
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        position: currentUser.position,
        department: currentUser.department,
        leaveType: leaveType,
        startDate: startDate,
        endDate: endDate,
        days: days,
        reason: reason,
        appliedDate: new Date().toISOString(),
        status: 'pending',
        approvedBy: null,
        approvedDate: null,
        remarks: null
      };

      leaveApplications.unshift(newApp);

      document.getElementById('applyLeaveModal').classList.remove('active');
      document.getElementById('applyLeaveForm').reset();

      updateLeaveStats();
      renderLeaveRequests('pending');

      alert('✅ Leave application submitted successfully!');
    }

    // Render Leave Requests
    function renderLeaveRequests(filter) {
      const list = document.getElementById('leaveRequestsList');
      if (!list) return;

      let filtered = leaveApplications;
      const today = new Date().toISOString().split('T')[0];

      if (filter === 'pending') filtered = leaveApplications.filter(a => a.status === 'pending');
      else if (filter === 'active') filtered = leaveApplications.filter(a => a.status === 'approved' && a.startDate <= today && a.endDate >= today);
      else if (filter === 'approved') filtered = leaveApplications.filter(a => a.status === 'approved');
      else if (filter === 'rejected') filtered = leaveApplications.filter(a => a.status === 'rejected');

      if (filtered.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-text">No ' + (filter === 'all' ? '' : filter) + ' leave requests</div></div>';
        return;
      }

      let html = '';
      filtered.forEach(app => {
        const isActive = app.status === 'approved' && new Date(app.startDate) <= new Date() && new Date(app.endDate) >= new Date();
        
        html += `
          <div class="leave-request-card" onclick="showLeaveDetails('${app.id}')">
            <div class="leave-request-header">
              <div class="leave-request-info">
                <div class="employee-name">${app.employeeName}</div>
                <div class="employee-position">${app.position} • ${app.department}</div>
              </div>
              <div class="leave-status-badge status-${isActive ? 'active' : app.status}">
                ${isActive ? 'On Leave' : app.status.toUpperCase()}
              </div>
            </div>
            <div class="leave-request-details">
              <div class="detail-item">
                <div class="detail-label">Leave Type</div>
                <div class="detail-value">${app.leaveType}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Start Date</div>
                <div class="detail-value">${formatDate(app.startDate)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">End Date</div>
                <div class="detail-value">${formatDate(app.endDate)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Duration</div>
                <div class="detail-value">${app.days} day${app.days > 1 ? 's' : ''}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Applied</div>
                <div class="detail-value">${formatDateTime(app.appliedDate)}</div>
              </div>
            </div>
          </div>
        `;
      });

      list.innerHTML = html;
    }

    // Show Leave Details
    window.showLeaveDetails = function(leaveId) {
      const app = leaveApplications.find(a => a.id === leaveId);
      if (!app) return;

      const content = document.getElementById('leaveDetailsContent');
      const actions = document.getElementById('leaveActionButtons');
      const isActive = app.status === 'approved' && new Date(app.startDate) <= new Date() && new Date(app.endDate) >= new Date();

      content.innerHTML = `
        <div class="leave-status-badge status-${isActive ? 'active' : app.status}" style="margin-bottom: 1.5rem;">
          ${isActive ? 'CURRENTLY ON LEAVE' : app.status.toUpperCase()}
        </div>

        <div class="leave-details-grid">
          <div class="detail-group">
            <div class="detail-group-label">Employee</div>
            <div class="detail-group-value">${app.employeeName}</div>
          </div>
          <div class="detail-group">
            <div class="detail-group-label">Position</div>
            <div class="detail-group-value">${app.position}</div>
          </div>
          <div class="detail-group">
            <div class="detail-group-label">Department</div>
            <div class="detail-group-value">${app.department}</div>
          </div>
          <div class="detail-group">
            <div class="detail-group-label">Leave Type</div>
            <div class="detail-group-value">${app.leaveType}</div>
          </div>
          <div class="detail-group">
            <div class="detail-group-label">Start Date</div>
            <div class="detail-group-value">${formatDate(app.startDate)}</div>
          </div>
          <div class="detail-group">
            <div class="detail-group-label">End Date</div>
            <div class="detail-group-value">${formatDate(app.endDate)}</div>
          </div>
          <div class="detail-group">
            <div class="detail-group-label">Duration</div>
            <div class="detail-group-value">${app.days} day${app.days > 1 ? 's' : ''}</div>
          </div>
          <div class="detail-group">
            <div class="detail-group-label">Applied On</div>
            <div class="detail-group-value">${formatDateTime(app.appliedDate)}</div>
          </div>
        </div>

        <div class="leave-reason-section">
          <h4>Reason for Leave:</h4>
          <div class="leave-reason-text">${app.reason}</div>
        </div>

        ${app.approvedBy ? `
          <div class="leave-reason-section">
            <h4>Approval Details:</h4>
            <div class="leave-details-grid">
              <div class="detail-group">
                <div class="detail-group-label">Approved By</div>
                <div class="detail-group-value">${app.approvedBy}</div>
              </div>
              <div class="detail-group">
                <div class="detail-group-label">Approved On</div>
                <div class="detail-group-value">${formatDateTime(app.approvedDate)}</div>
              </div>
            </div>
            ${app.remarks ? `<div class="leave-reason-text" style="margin-top: 1rem;">${app.remarks}</div>` : ''}
          </div>
        ` : ''}
      `;

      if ((currentUser.role === 'owner' || currentUser.role === 'admin') && app.status === 'pending') {
        actions.innerHTML = `
          <button type="button" class="btn-secondary" onclick="rejectLeave('${app.id}')">❌ Reject</button>
          <button type="button" class="btn-primary" onclick="approveLeave('${app.id}')">✅ Approve</button>
        `;
      } else {
        actions.innerHTML = `
          <button type="button" class="btn-secondary" onclick="document.getElementById('viewLeaveModal').classList.remove('active')">Close</button>
        `;
      }

      document.getElementById('viewLeaveModal').classList.add('active');
    };

    // Approve Leave
    window.approveLeave = function(leaveId) {
      const password = prompt('🔒 Enter password to approve leave:\n\n(This action will be logged)');
      
      if (password === null) return;
      
      if (password !== 'admin123') {
        alert('❌ Incorrect password!');
        return;
      }

      const app = leaveApplications.find(a => a.id === leaveId);
      if (!app) return;

      app.status = 'approved';
      app.approvedBy = currentUser.name;
      app.approvedDate = new Date().toISOString();

      const employee = employees.find(e => e.id === app.employeeId);
      if (employee) {
        if (app.leaveType === 'Vacation Leave') employee.vlUsed += app.days;
        else employee.slUsed += app.days;
      }

      console.log(`✅ Leave approved: ${leaveId} by ${currentUser.name} at ${new Date().toLocaleString()}`);

      document.getElementById('viewLeaveModal').classList.remove('active');
      updateLeaveStats();
      renderLeaveRequests('pending');

      alert('✅ Leave application approved!');
    };

    // Reject Leave
    window.rejectLeave = function(leaveId) {
      const password = prompt('🔒 Enter password to reject leave:\n\n(This action will be logged)');
      
      if (password === null) return;
      
      if (password !== 'admin123') {
        alert('❌ Incorrect password!');
        return;
      }

      const remarks = prompt('Reason for rejection (optional):');

      const app = leaveApplications.find(a => a.id === leaveId);
      if (!app) return;

      app.status = 'rejected';
      app.approvedBy = currentUser.name;
      app.approvedDate = new Date().toISOString();
      app.remarks = remarks || 'No remarks provided';

      console.log(`❌ Leave rejected: ${leaveId} by ${currentUser.name} at ${new Date().toLocaleString()}`);

      document.getElementById('viewLeaveModal').classList.remove('active');
      updateLeaveStats();
      renderLeaveRequests('pending');

      alert('Leave application rejected.');
    };

    // Update Statistics
    function updateLeaveStats() {
      const today = new Date().toISOString().split('T')[0];
      const month = new Date().getMonth();
      const year = new Date().getFullYear();

      const pending = leaveApplications.filter(a => a.status === 'pending').length;
      const active = leaveApplications.filter(a => a.status === 'approved' && a.startDate <= today && a.endDate >= today).length;
      const approved = leaveApplications.filter(a => {
        if (a.status !== 'approved') return false;
        const d = new Date(a.approvedDate);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length;
      const rejected = leaveApplications.filter(a => {
        if (a.status !== 'rejected') return false;
        const d = new Date(a.approvedDate);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length;

      const pendingEl = document.getElementById('pendingCount');
      const activeEl = document.getElementById('activeLeaveCount');
      const approvedEl = document.getElementById('approvedCount');
      const rejectedEl = document.getElementById('rejectedCount');

      if (pendingEl) pendingEl.textContent = pending;
      if (activeEl) activeEl.textContent = active;
      if (approvedEl) approvedEl.textContent = approved;
      if (rejectedEl) rejectedEl.textContent = rejected;
    }

    // Format Date
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Format DateTime
    function formatDateTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    // Initialize Leave System when page opens
    setTimeout(() => {
      if (document.getElementById('financials')) {
        initializeLeaveSystem();
      }
    }, 500);


    // === PAYROLL SYSTEM ===

// Payroll employee masterlist
let payrollEmployees = [];

// Current payroll data
let currentPayrollData = [];

// Payroll settings
let payrollPeriod = {
  cutOff: 1, // 1 or 2
  month: 11, // 0-11 (December = 11)
  year: 2025
};

// Initialize Payroll System
function initializePayrollSystem() {
  // Set current date
  const now = new Date();
  payrollPeriod.month = now.getMonth();
  payrollPeriod.year = now.getFullYear();
  payrollPeriod.cutOff = now.getDate() <= 15 ? 1 : 2;
  
  // Update UI
  document.getElementById('cutOffSelect').value = payrollPeriod.cutOff;
  document.getElementById('payrollMonthSelect').value = payrollPeriod.month;
  document.getElementById('payrollYearInput').value = payrollPeriod.year;
  
  updatePeriodDisplay();
  renderPayrollTable();
  updatePayrollSummary();
  
  setupPayrollEventListeners();
}

// Setup Event Listeners
function setupPayrollEventListeners() {
  const manageEmpBtn = document.getElementById('manageEmployeesBtn');
  const calculateBtn = document.getElementById('calculatePayrollBtn');
  const saveBtn = document.getElementById('savePayrollBtn');
  const exportBtn = document.getElementById('exportPayrollBtn');
  const cutOffSelect = document.getElementById('cutOffSelect');
  const monthSelect = document.getElementById('payrollMonthSelect');
  const yearInput = document.getElementById('payrollYearInput');
  const closeEmpModal = document.getElementById('closeEmployeeManagementModal');
  const addEmpBtn = document.getElementById('addEmployeeBtn');
  
  if (manageEmpBtn) {
    manageEmpBtn.addEventListener('click', () => {
      document.getElementById('employeeManagementModal').classList.add('active');
      renderEmployeeList();
    });
  }
  
  if (closeEmpModal) {
    closeEmpModal.addEventListener('click', () => {
      document.getElementById('employeeManagementModal').classList.remove('active');
      clearEmployeeForm();
    });
  }
  
  if (addEmpBtn) {
    addEmpBtn.addEventListener('click', addEmployee);
  }
  
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculatePayroll);
  }
  
  if (saveBtn) {
    saveBtn.addEventListener('click', savePayroll);
  }
  
  if (exportBtn) {
    exportBtn.addEventListener('click', exportPayrollToExcel);
  }
  
  if (cutOffSelect) {
    cutOffSelect.addEventListener('change', (e) => {
      payrollPeriod.cutOff = parseInt(e.target.value);
      updatePeriodDisplay();
      renderPayrollTable();
    });
  }
  
  if (monthSelect) {
    monthSelect.addEventListener('change', (e) => {
      payrollPeriod.month = parseInt(e.target.value);
      updatePeriodDisplay();
      renderPayrollTable();
    });
  }
  
  if (yearInput) {
    yearInput.addEventListener('change', (e) => {
      payrollPeriod.year = parseInt(e.target.value);
      updatePeriodDisplay();
      renderPayrollTable();
    });
  }
}

// Update period display
function updatePeriodDisplay() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dateRange = payrollPeriod.cutOff === 1 ? '1-15' : '16-31';
  const displayText = `${monthNames[payrollPeriod.month]} ${dateRange}, ${payrollPeriod.year}`;
  
  document.getElementById('periodDisplay').textContent = displayText;
}

// Add Employee
function addEmployee() {
  const name = document.getElementById('empName').value.trim();
  const position = document.getElementById('empPosition').value.trim();
  const dailyRate = parseFloat(document.getElementById('empDailyRate').value) || 0;
  const basicSalary = parseFloat(document.getElementById('empBasicSalary').value) || 0;
  const allowance = parseFloat(document.getElementById('empAllowance').value) || 0;
  const sss = parseFloat(document.getElementById('empSSS').value) || 0;
  const hdmf = parseFloat(document.getElementById('empHDMF').value) || 0;
  const philHealth = parseFloat(document.getElementById('empPhilHealth').value) || 0;
  const hmo = parseFloat(document.getElementById('empHMO').value) || 0;
  
  if (!name || !position || dailyRate === 0 || basicSalary === 0) {
    alert('⚠️ Please fill in all required fields (Name, Position, Daily Rate, Basic Salary)');
    return;
  }
  
  const employee = {
    id: Date.now(),
    name: name,
    position: position,
    dailyRate: dailyRate,
    hourlyRate: dailyRate / 8,
    basicSalary: basicSalary,
    allowance: allowance,
    sss: sss,
    hdmf: hdmf,
    philHealth: philHealth,
    hmo: hmo
  };
  
  payrollEmployees.push(employee);
  
  clearEmployeeForm();
  renderEmployeeList();
  renderPayrollTable();
  updatePayrollSummary();
  
  alert(`✅ ${name} added successfully!`);
}

// Clear employee form
function clearEmployeeForm() {
  document.getElementById('empName').value = '';
  document.getElementById('empPosition').value = '';
  document.getElementById('empDailyRate').value = '';
  document.getElementById('empBasicSalary').value = '';
  document.getElementById('empAllowance').value = '';
  document.getElementById('empSSS').value = '';
  document.getElementById('empHDMF').value = '';
  document.getElementById('empPhilHealth').value = '';
  document.getElementById('empHMO').value = '';
}

// Render employee list
function renderEmployeeList() {
  const container = document.getElementById('employeeListContainer');
  
  if (payrollEmployees.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 2rem;">No employees added yet.</p>';
    return;
  }
  
  let html = '';
  payrollEmployees.forEach((emp, index) => {
    html += `
      <div class="employee-item">
        <div class="employee-item-header">
          <div>
            <div class="employee-item-name">${emp.name}</div>
            <div class="employee-item-position">${emp.position}</div>
          </div>
          <div class="employee-item-actions">
            <button class="btn-edit-employee" onclick="editEmployee(${index})">✏️ Edit</button>
            <button class="btn-delete-employee" onclick="deleteEmployee(${index})">🗑️ Delete</button>
          </div>
        </div>
        <div class="employee-item-details">
          <div class="employee-detail">
            <span class="employee-detail-label">Daily Rate:</span>
            <span class="employee-detail-value">₱${emp.dailyRate.toLocaleString()}</span>
          </div>
          <div class="employee-detail">
            <span class="employee-detail-label">Basic Salary:</span>
            <span class="employee-detail-value">₱${emp.basicSalary.toLocaleString()}</span>
          </div>
          <div class="employee-detail">
            <span class="employee-detail-label">Allowance:</span>
            <span class="employee-detail-value">₱${emp.allowance.toLocaleString()}</span>
          </div>
          <div class="employee-detail">
            <span class="employee-detail-label">SSS:</span>
            <span class="employee-detail-value">₱${emp.sss.toLocaleString()}</span>
          </div>
          <div class="employee-detail">
            <span class="employee-detail-label">HDMF:</span>
            <span class="employee-detail-value">₱${emp.hdmf.toLocaleString()}</span>
          </div>
          <div class="employee-detail">
            <span class="employee-detail-label">PhilHealth:</span>
            <span class="employee-detail-value">₱${emp.philHealth.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Edit employee
window.editEmployee = function(index) {
  const emp = payrollEmployees[index];
  
  document.getElementById('empName').value = emp.name;
  document.getElementById('empPosition').value = emp.position;
  document.getElementById('empDailyRate').value = emp.dailyRate;
  document.getElementById('empBasicSalary').value = emp.basicSalary;
  document.getElementById('empAllowance').value = emp.allowance;
  document.getElementById('empSSS').value = emp.sss;
  document.getElementById('empHDMF').value = emp.hdmf;
  document.getElementById('empPhilHealth').value = emp.philHealth;
  document.getElementById('empHMO').value = emp.hmo;
  
  // Remove old employee
  payrollEmployees.splice(index, 1);
  renderEmployeeList();
  
  alert('📝 Employee loaded for editing. Update details and click "Add Employee" to save changes.');
};

// Delete employee
window.deleteEmployee = function(index) {
  const emp = payrollEmployees[index];
  
  if (confirm(`Delete ${emp.name}?\n\nThis will remove them from the payroll system.`)) {
    payrollEmployees.splice(index, 1);
    renderEmployeeList();
    renderPayrollTable();
    updatePayrollSummary();
    alert('✅ Employee deleted successfully!');
  }
};

// Render payroll table
function renderPayrollTable() {
  const tbody = document.getElementById('payrollTableBody');
  
  if (payrollEmployees.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="16" style="text-align: center; padding: 3rem; color: #9ca3af;">
          No employees added yet. Click "Manage Employees" to add employees.
        </td>
      </tr>
    `;
    return;
  }
  
  // Calculate basic salary for cut-off
  const cutOffMultiplier = payrollPeriod.cutOff === 1 ? 0.5 : 0.5; // Half month
  
  let html = '';
  currentPayrollData = [];
  
  payrollEmployees.forEach((emp, index) => {
    const basicForCutOff = emp.basicSalary * cutOffMultiplier;
    
    const payrollRow = {
      employee: emp,
      basicSalary: basicForCutOff,
      allowance: emp.allowance,
      holidayPay: 0,
      otHours: 0,
      otPay: 0,
      slvlPay: 0,
      sss: emp.sss,
      hdmf: emp.hdmf,
      philHealth: emp.philHealth,
      hmo: emp.hmo,
      loans: 0,
      otherDeductions: 0
    };
    
    currentPayrollData.push(payrollRow);
    
    const totalEarnings = basicForCutOff + payrollRow.allowance + payrollRow.holidayPay + 
                         payrollRow.otPay + payrollRow.slvlPay;
    const totalDeductions = payrollRow.sss + payrollRow.hdmf + payrollRow.philHealth + 
                           payrollRow.hmo + payrollRow.loans + payrollRow.otherDeductions;
    const netPay = totalEarnings - totalDeductions;
    
    html += `
      <tr>
        <td class="employee-name-cell">${emp.name}</td>
        <td class="position-cell">${emp.position}</td>
        <td>₱${emp.dailyRate.toLocaleString()}</td>
        <td>₱${basicForCutOff.toLocaleString()}</td>
        <td><input type="number" value="${payrollRow.allowance}" step="0.01" onchange="updatePayrollValue(${index}, 'allowance', this.value)"></td>
        <td><input type="number" value="${payrollRow.holidayPay}" step="0.01" onchange="updatePayrollValue(${index}, 'holidayPay', this.value)"></td>
        <td><input type="number" value="${payrollRow.otHours}" step="0.01" onchange="updateOTHours(${index}, this.value)"></td>
        <td>₱${payrollRow.otPay.toLocaleString()}</td>
        <td><input type="number" value="${payrollRow.slvlPay}" step="0.01" onchange="updatePayrollValue(${index}, 'slvlPay', this.value)"></td>
        <td><input type="number" value="${payrollRow.sss}" step="0.01" onchange="updatePayrollValue(${index}, 'sss', this.value)"></td>
        <td><input type="number" value="${payrollRow.hdmf}" step="0.01" onchange="updatePayrollValue(${index}, 'hdmf', this.value)"></td>
        <td><input type="number" value="${payrollRow.philHealth}" step="0.01" onchange="updatePayrollValue(${index}, 'philHealth', this.value)"></td>
        <td><input type="number" value="${payrollRow.hmo}" step="0.01" onchange="updatePayrollValue(${index}, 'hmo', this.value)"></td>
        <td><input type="number" value="${payrollRow.loans}" step="0.01" onchange="updatePayrollValue(${index}, 'loans', this.value)"></td>
        <td><input type="number" value="${payrollRow.otherDeductions}" step="0.01" onchange="updatePayrollValue(${index}, 'otherDeductions', this.value)"></td>
        <td style="font-weight: 700; color: #10b981;">₱${netPay.toLocaleString()}</td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
  updatePayrollTotals();
}

// Update payroll value
window.updatePayrollValue = function(index, field, value) {
  currentPayrollData[index][field] = parseFloat(value) || 0;
  updatePayrollTotals();
  updatePayrollSummary();
};

// Update OT hours and calculate OT pay
window.updateOTHours = function(index, hours) {
  const otHours = parseFloat(hours) || 0;
  const hourlyRate = currentPayrollData[index].employee.hourlyRate;
  const otPay = otHours * hourlyRate * 1.25; // 125% overtime rate
  
  currentPayrollData[index].otHours = otHours;
  currentPayrollData[index].otPay = otPay;
  
  renderPayrollTable();
  updatePayrollSummary();
};

// Update payroll totals (footer)
function updatePayrollTotals() {
  let totals = {
    basic: 0,
    allowance: 0,
    holiday: 0,
    otHours: 0,
    otPay: 0,
    slvl: 0,
    sss: 0,
    hdmf: 0,
    philHealth: 0,
    hmo: 0,
    loans: 0,
    deductions: 0,
    netPay: 0
  };
  
  currentPayrollData.forEach(row => {
    totals.basic += row.basicSalary;
    totals.allowance += row.allowance;
    totals.holiday += row.holidayPay;
    totals.otHours += row.otHours;
    totals.otPay += row.otPay;
    totals.slvl += row.slvlPay;
    totals.sss += row.sss;
    totals.hdmf += row.hdmf;
    totals.philHealth += row.philHealth;
    totals.hmo += row.hmo;
    totals.loans += row.loans;
    totals.deductions += row.otherDeductions;
    
    const earnings = row.basicSalary + row.allowance + row.holidayPay + row.otPay + row.slvlPay;
    const deductions = row.sss + row.hdmf + row.philHealth + row.hmo + row.loans + row.otherDeductions;
    totals.netPay += earnings - deductions;
  });
  
  document.getElementById('footBasic').textContent = `₱${totals.basic.toLocaleString()}`;
  document.getElementById('footAllowance').textContent = `₱${totals.allowance.toLocaleString()}`;
  document.getElementById('footHoliday').textContent = `₱${totals.holiday.toLocaleString()}`;
  document.getElementById('footOTHours').textContent = totals.otHours.toFixed(2);
  document.getElementById('footOTPay').textContent = `₱${totals.otPay.toLocaleString()}`;
  document.getElementById('footSLVL').textContent = `₱${totals.slvl.toLocaleString()}`;
  document.getElementById('footSSS').textContent = `₱${totals.sss.toLocaleString()}`;
  document.getElementById('footHDMF').textContent = `₱${totals.hdmf.toLocaleString()}`;
  document.getElementById('footPhilHealth').textContent = `₱${totals.philHealth.toLocaleString()}`;
  document.getElementById('footHMO').textContent = `₱${totals.hmo.toLocaleString()}`;
  document.getElementById('footLoans').textContent = `₱${totals.loans.toLocaleString()}`;
  document.getElementById('footDeductions').textContent = `₱${totals.deductions.toLocaleString()}`;
  document.getElementById('footNetPay').textContent = `₱${totals.netPay.toLocaleString()}`;
}

// Update payroll summary
function updatePayrollSummary() {
  let totalEarnings = 0;
  let totalDeductions = 0;
  
  currentPayrollData.forEach(row => {
    const earnings = row.basicSalary + row.allowance + row.holidayPay + row.otPay + row.slvlPay;
    const deductions = row.sss + row.hdmf + row.philHealth + row.hmo + row.loans + row.otherDeductions;
    
    totalEarnings += earnings;
    totalDeductions += deductions;
  });
  
  const netPayroll = totalEarnings - totalDeductions;
  
  document.getElementById('totalEarnings').textContent = `₱${totalEarnings.toLocaleString()}`;
  document.getElementById('totalDeductions').textContent = `₱${totalDeductions.toLocaleString()}`;
  document.getElementById('netPayroll').textContent = `₱${netPayroll.toLocaleString()}`;
  document.getElementById('employeeCount').textContent = payrollEmployees.length;
}

// Calculate payroll
function calculatePayroll() {
  if (payrollEmployees.length === 0) {
    alert('⚠️ No employees to calculate payroll for. Add employees first.');
    return;
  }
  
  const btn = document.getElementById('calculatePayrollBtn');
  btn.disabled = true;
  btn.textContent = '🧮 Calculating...';
  
  setTimeout(() => {
    renderPayrollTable();
    updatePayrollSummary();
    
    btn.textContent = '✅ Calculated!';
    btn.style.background = '#10b981';
    
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = '🧮 Calculate Payroll';
      btn.style.background = '#10b981';
    }, 2000);
    
    alert('✅ Payroll calculated successfully!\n\nYou can now edit individual values or save the payroll.');
  }, 800);
}

// Save payroll
function savePayroll() {
  if (currentPayrollData.length === 0) {
    alert('⚠️ No payroll data to save. Calculate payroll first.');
    return;
  }
  
  const password = prompt('🔒 Enter password to save payroll:\n\n(This action will be logged)');
  
  if (password === null) return;
  
  if (password !== 'admin123') {
    alert('❌ Incorrect password!');
    return;
  }
  
  const btn = document.getElementById('savePayrollBtn');
  btn.disabled = true;
  btn.textContent = '💾 Saving...';
  
  setTimeout(() => {
    const timestamp = new Date().toLocaleString();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const periodName = `${monthNames[payrollPeriod.month]} ${payrollPeriod.cutOff === 1 ? '1-15' : '16-31'}, ${payrollPeriod.year}`;
    
    console.log(`✅ Payroll saved: ${periodName} at ${timestamp}`);
    console.log('Payroll data:', currentPayrollData);
    
    btn.textContent = '✅ Saved!';
    btn.style.background = '#8b5cf6';
    
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = '💾 Save Payroll';
      btn.style.background = '#8b5cf6';
    }, 2000);
    
    alert('✅ Payroll saved successfully!\n\nData logged to console for development purposes.');
  }, 1000);
}

// Export payroll to Excel
function exportPayrollToExcel() {
  if (currentPayrollData.length === 0) {
    alert('⚠️ No payroll data to export. Calculate payroll first.');
    return;
  }
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];
  const periodName = `${monthNames[payrollPeriod.month]}_${payrollPeriod.cutOff === 1 ? '1-15' : '16-31'}_${payrollPeriod.year}`;
  
  // Create CSV content
  let csv = "EMPLOYEE'S NAME,POSITION,DAILY RATE,PER HOUR RATE,BASIC SALARY FOR THIS CUT OFF,ALLOWANCE,HOLIDAY PAY,OT TOTAL HOURS,OVERTIME PAY,SL/VL,SSS,HDMF,PHIC,HMO,SALARY LOAN,OTHER DEDUCTIONS,NET PAY\n";
  
  let totalRow = {
    basic: 0, allowance: 0, holiday: 0, otHours: 0, otPay: 0, slvl: 0,
    sss: 0, hdmf: 0, philHealth: 0, hmo: 0, loans: 0, deductions: 0, netPay: 0
  };
  
  currentPayrollData.forEach(row => {
    const emp = row.employee;
    const earnings = row.basicSalary + row.allowance + row.holidayPay + row.otPay + row.slvlPay;
    const deductions = row.sss + row.hdmf + row.philHealth + row.hmo + row.loans + row.otherDeductions;
    const netPay = earnings - deductions;
    
    csv += `"${emp.name}","${emp.position}",${emp.dailyRate.toFixed(2)},${emp.hourlyRate.toFixed(2)},${row.basicSalary.toFixed(2)},${row.allowance.toFixed(2)},${row.holidayPay.toFixed(2)},${row.otHours.toFixed(2)},${row.otPay.toFixed(2)},${row.slvlPay.toFixed(2)},${row.sss.toFixed(2)},${row.hdmf.toFixed(2)},${row.philHealth.toFixed(2)},${row.hmo.toFixed(2)},${row.loans.toFixed(2)},${row.otherDeductions.toFixed(2)},${netPay.toFixed(2)}\n`;
    
    // Accumulate totals
    totalRow.basic += row.basicSalary;
    totalRow.allowance += row.allowance;
    totalRow.holiday += row.holidayPay;
    totalRow.otHours += row.otHours;
    totalRow.otPay += row.otPay;
    totalRow.slvl += row.slvlPay;
    totalRow.sss += row.sss;
    totalRow.hdmf += row.hdmf;
    totalRow.philHealth += row.philHealth;
    totalRow.hmo += row.hmo;
    totalRow.loans += row.loans;
    totalRow.deductions += row.otherDeductions;
    totalRow.netPay += netPay;
  });
  
  // Add total row
  csv += `"TOTAL","","","",${totalRow.basic.toFixed(2)},${totalRow.allowance.toFixed(2)},${totalRow.holiday.toFixed(2)},${totalRow.otHours.toFixed(2)},${totalRow.otPay.toFixed(2)},${totalRow.slvl.toFixed(2)},${totalRow.sss.toFixed(2)},${totalRow.hdmf.toFixed(2)},${totalRow.philHealth.toFixed(2)},${totalRow.hmo.toFixed(2)},${totalRow.loans.toFixed(2)},${totalRow.deductions.toFixed(2)},${totalRow.netPay.toFixed(2)}\n`;
  
  // Create download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `Payroll_${periodName}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Show success
  const btn = document.getElementById('exportPayrollBtn');
  btn.textContent = '✅ Exported!';
  btn.style.background = '#f59e0b';
  setTimeout(() => {
    btn.textContent = '📊 Export to Excel';
    btn.style.background = '#f59e0b';
  }, 2000);
}

// Initialize payroll system when page loads
setTimeout(() => {
  if (document.getElementById('adjustments')) {
    initializePayrollSystem();
  }
}, 500);

// END PAYROLL SYSTEM
// ============================================
// PAYROLL SYSTEM
// ============================================

// Payroll data structure
let payrollSettings = {
  otRegularMultiplier: 1.25,
  otRestDayMultiplier: 1.3,
  holidayRegularRate: 30,
  holidaySpecialRate: 30,
  holidayDoubleRate: 100,
  sssFixed: true,
  sssAmount: 200,
  hdmfFixed: true,
  hdmfAmount: 200,
  philhealthFixed: false,
  philhealthAmount: 2
};

let payrollData = [];
let currentPayrollPeriod = {
  type: 'first', // 'first' or 'second'
  month: 0,
  year: 2025
};

// Load payroll settings from localStorage
function loadPayrollSettings() {
  const saved = localStorage.getItem('payrollSettings');
  if (saved) {
    payrollSettings = JSON.parse(saved);
    updatePayrollSettingsUI();
  }
}

// Save payroll settings to localStorage
function savePayrollSettings() {
  localStorage.setItem('payrollSettings', JSON.stringify(payrollSettings));
}

// Update payroll settings UI
function updatePayrollSettingsUI() {
  document.getElementById('otRegularMultiplier').value = payrollSettings.otRegularMultiplier;
  document.getElementById('otRestDayMultiplier').value = payrollSettings.otRestDayMultiplier;
  document.getElementById('holidayRegularRate').value = payrollSettings.holidayRegularRate;
  document.getElementById('holidaySpecialRate').value = payrollSettings.holidaySpecialRate;
  document.getElementById('holidayDoubleRate').value = payrollSettings.holidayDoubleRate;
  document.getElementById('sssDeductionType').checked = payrollSettings.sssFixed;
  document.getElementById('sssAmount').value = payrollSettings.sssAmount;
  document.getElementById('hdmfDeductionType').checked = payrollSettings.hdmfFixed;
  document.getElementById('hdmfAmount').value = payrollSettings.hdmfAmount;
  document.getElementById('philhealthDeductionType').checked = payrollSettings.philhealthFixed;
  document.getElementById('philhealthAmount').value = payrollSettings.philhealthAmount;
}

// Initialize payroll system
function initializePayroll() {
  loadPayrollSettings();
  updatePayrollPeriodDisplay();
  loadPayrollFromEmployees();
  renderPayrollTable();
}

// Update payroll period display
function updatePayrollPeriodDisplay() {
  const periodType = document.getElementById('payrollPeriodType').value;
  const month = parseInt(document.getElementById('payrollMonth').value);
  const year = parseInt(document.getElementById('payrollYear').value);
  
  currentPayrollPeriod = { type: periodType, month, year };
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  const lastDay = new Date(year, month + 1, 0).getDate();
  const dateRange = periodType === 'first' ? `1-15` : `16-${lastDay}`;
  
  document.getElementById('payrollPeriodDisplay').textContent = 
    `${monthNames[month]} ${dateRange}, ${year}`;
}

// Load payroll from employees
function loadPayrollFromEmployees() {
  if (!employees || employees.length === 0) {
    payrollData = [];
    return;
  }
  
  payrollData = employees.map(emp => ({
    id: emp.id,
    name: emp.name,
    position: emp.position,
    dailyRate: parseFloat(emp.dailyRate) || 0,
    hourlyRate: (parseFloat(emp.dailyRate) || 0) / 8,
    basicSalary: parseFloat(emp.basicSalary) || 0,
    allowance: parseFloat(emp.allowance) || 0,
    holiday30Days: 0,
    holiday30: 0,
    holiday2xDays: 0,
    holiday2x: 0,
    otHours: 0,
    otPay: 0,
    sss: parseFloat(emp.sss) || 0,
    hdmf: parseFloat(emp.hdmf) || 0,
    philhealth: parseFloat(emp.philhealth) || 0,
    hmo: parseFloat(emp.hmo) || 0,
    grossPay: 0,
    totalDeductions: 0,
    netPay: 0
  }));
}

// Calculate payroll for all employees
// Calculate payroll for all employees
function calculatePayroll() {
  payrollData.forEach(emp => {
    // Calculate OT Pay - Formula: Per Hour Rate × OT Hours
    emp.otPay = emp.otHours * emp.hourlyRate;
    
    // Calculate Holiday 30% - Formula: Daily Rate × 30% × Number of Days
    // Note: holiday30Days field will store number of holiday days (default 1)
    if (!emp.holiday30Days) emp.holiday30Days = 0;
    emp.holiday30 = emp.dailyRate * (payrollSettings.holidayRegularRate / 100) * emp.holiday30Days;
    
    // Calculate Holiday Double Pay - Formula: Daily Rate × 100% × Number of Days
    if (!emp.holiday2xDays) emp.holiday2xDays = 0;
    emp.holiday2x = emp.dailyRate * (payrollSettings.holidayDoubleRate / 100) * emp.holiday2xDays;
    
    // Calculate deductions
    if (payrollSettings.sssFixed) {
      emp.sss = payrollSettings.sssAmount;
    } else {
      emp.sss = emp.basicSalary * (payrollSettings.sssAmount / 100);
    }
    
    if (payrollSettings.hdmfFixed) {
      emp.hdmf = payrollSettings.hdmfAmount;
    } else {
      emp.hdmf = emp.basicSalary * (payrollSettings.hdmfAmount / 100);
    }
    
    if (payrollSettings.philhealthFixed) {
      emp.philhealth = payrollSettings.philhealthAmount;
    } else {
      emp.philhealth = emp.basicSalary * (payrollSettings.philhealthAmount / 100);
    }
    
    // Calculate gross pay
    emp.grossPay = emp.basicSalary + emp.allowance + emp.holiday30 + 
                   emp.holiday2x + emp.otPay;
    
    // Calculate total deductions
    emp.totalDeductions = emp.sss + emp.hdmf + emp.philhealth + emp.hmo;
    
    // Calculate net pay
    emp.netPay = emp.grossPay - emp.totalDeductions;
  });
  
  renderPayrollTable();
  updatePayrollSummary();
  showNotification('✅ Payroll calculated successfully!', 'success');
}

// Render payroll table (desktop)

function renderPayrollTable() {
  const tbody = document.getElementById('payrollTableBody');
  tbody.innerHTML = '';
  
  payrollData.forEach(emp => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="employee-name-cell">${emp.name}</td>
      <td class="position-cell">${emp.position}</td>
      <td>₱${emp.basicSalary.toFixed(2)}</td>
      <td><input type="number" class="editable-cell" value="${emp.allowance.toFixed(2)}" 
          onchange="updatePayrollField('${emp.id}', 'allowance', this.value)"></td>
      <td>
        <input type="number" class="editable-cell" value="${emp.holiday30Days || 0}" 
          onchange="updatePayrollField('${emp.id}', 'holiday30Days', this.value)" 
          style="width: 40px;" step="0.5" min="0" placeholder="Days">
        <span style="font-size: 0.75rem; color: #6b7280;"> = ₱${emp.holiday30.toFixed(2)}</span>
      </td>
      <td>
        <input type="number" class="editable-cell" value="${emp.holiday2xDays || 0}" 
          onchange="updatePayrollField('${emp.id}', 'holiday2xDays', this.value)" 
          style="width: 40px;" step="0.5" min="0" placeholder="Days">
        <span style="font-size: 0.75rem; color: #6b7280;"> = ₱${emp.holiday2x.toFixed(2)}</span>
      </td>
      <td><input type="number" class="editable-cell" value="${emp.otHours.toFixed(2)}" 
          onchange="updatePayrollField('${emp.id}', 'otHours', this.value)"></td>
      <td>₱${emp.otPay.toFixed(2)}</td>
      <td style="font-weight: 700; color: #10b981;">₱${emp.grossPay.toFixed(2)}</td>
      <td><input type="number" class="editable-cell" value="${emp.sss.toFixed(2)}" 
          onchange="updatePayrollField('${emp.id}', 'sss', this.value)"></td>
      <td><input type="number" class="editable-cell" value="${emp.hdmf.toFixed(2)}" 
          onchange="updatePayrollField('${emp.id}', 'hdmf', this.value)"></td>
      <td><input type="number" class="editable-cell" value="${emp.philhealth.toFixed(2)}" 
          onchange="updatePayrollField('${emp.id}', 'philhealth', this.value)"></td>
      <td><input type="number" class="editable-cell" value="${emp.hmo.toFixed(2)}" 
          onchange="updatePayrollField('${emp.id}', 'hmo', this.value)"></td>
      <td style="font-weight: 700; color: #ef4444;">₱${emp.totalDeductions.toFixed(2)}</td>
      <td style="font-weight: 700; color: #8b5cf6;">₱${emp.netPay.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });
  
  renderPayrollCards();
  updatePayrollFooter();
}

// Render payroll cards (mobile)
// Render payroll cards (mobile)
function renderPayrollCards() {
  const container = document.getElementById('payrollCardsContainer');
  container.innerHTML = '';
  
  payrollData.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'payroll-card';
    card.innerHTML = `
      <div class="payroll-card-header">
        <div class="payroll-card-employee">
          <div class="payroll-card-name">${emp.name}</div>
          <div class="payroll-card-position">${emp.position}</div>
        </div>
        <div class="payroll-card-net">
          <div class="payroll-card-net-label">Net Pay</div>
          <div class="payroll-card-net-value">₱${emp.netPay.toFixed(2)}</div>
        </div>
      </div>
      
      <div class="payroll-card-section">
        <div class="payroll-card-section-title">💰 Earnings</div>
        <div class="payroll-card-row">
          <span class="payroll-card-label">Basic Salary</span>
          <span class="payroll-card-value">₱${emp.basicSalary.toFixed(2)}</span>
        </div>
        <div class="payroll-card-row">
          <span class="payroll-card-label">Allowance</span>
          <input type="number" class="payroll-card-value editable" value="${emp.allowance.toFixed(2)}" 
            onchange="updatePayrollField('${emp.id}', 'allowance', this.value)">
        </div>
        <div class="payroll-card-row">
          <span class="payroll-card-label">Holiday 30% Days</span>
          <input type="number" class="payroll-card-value editable" value="${emp.holiday30Days || 0}" 
            onchange="updatePayrollField('${emp.id}', 'holiday30Days', this.value)" step="0.5" min="0">
        </div>
        <div class="payroll-card-row">
          <span class="payroll-card-label">Holiday 30% Amount</span>
          <span class="payroll-card-value">₱${emp.holiday30.toFixed(2)}</span>
        </div>
        <div class="payroll-card-row">
          <span class="payroll-card-label">Holiday 2x Days</span>
          <input type="number" class="payroll-card-value editable" value="${emp.holiday2xDays || 0}" 
            onchange="updatePayrollField('${emp.id}', 'holiday2xDays', this.value)" step="0.5" min="0">
        </div>
        <div class="payroll-card-row">
          <span class="payroll-card-label">Holiday 2x Amount</span>
          <span class="payroll-card-value">₱${emp.holiday2x.toFixed(2)}</span>
        </div>

        <div class="payroll-card-row">
          <span class="payroll-card-label">OT Hours</span>
          <input type="number" class="payroll-card-value editable" value="${emp.otHours.toFixed(2)}" 
            onchange="updatePayrollField('${emp.id}', 'otHours', this.value)">
        </div>
        <div class="payroll-card-row">
          <span class="payroll-card-label">OT Pay</span>
          <span class="payroll-card-value">₱${emp.otPay.toFixed(2)}</span>
        </div>
        <div class="payroll-card-row payroll-card-total">
          <span class="payroll-card-label">Gross Pay</span>
          <span class="payroll-card-value">₱${emp.grossPay.toFixed(2)}</span>
        </div>
      </div>
      
      <div class="payroll-card-section">
        <div class="payroll-card-section-title">📉 Deductions</div>
        <div class="payroll-card-row">
          <span class="payroll-card-label">SSS</span>
          <input type="number" class="payroll-card-value editable" value="${emp.sss.toFixed(2)}" 
            onchange="updatePayrollField('${emp.id}', 'sss', this.value)">
        </div>
        <div class="payroll-card-row">
          <span class="payroll-card-label">HDMF</span>
          <input type="number" class="payroll-card-value editable" value="${emp.hdmf.toFixed(2)}" 
            onchange="updatePayrollField('${emp.id}', 'hdmf', this.value)">
        </div>
        <div class="payroll-card-row">
          <span class="payroll-card-label">PhilHealth</span>
          <input type="number" class="payroll-card-value editable" value="${emp.philhealth.toFixed(2)}" 
            onchange="updatePayrollField('${emp.id}', 'philhealth', this.value)">
        </div>
        <div class="payroll-card-row">
          <span class="payroll-card-label">HMO</span>
          <input type="number" class="payroll-card-value editable" value="${emp.hmo.toFixed(2)}" 
            onchange="updatePayrollField('${emp.id}', 'hmo', this.value)">
        </div>
        <div class="payroll-card-row payroll-card-total">
          <span class="payroll-card-label">Total Deductions</span>
          <span class="payroll-card-value">₱${emp.totalDeductions.toFixed(2)}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Update payroll field
function updatePayrollField(employeeId, field, value) {
  const emp = payrollData.find(e => e.id === employeeId);
  if (emp) {
    emp[field] = parseFloat(value) || 0;
    calculatePayroll();
  }
}

// Update payroll footer totals
function updatePayrollFooter() {
  const totals = payrollData.reduce((acc, emp) => ({
    basicSalary: acc.basicSalary + emp.basicSalary,
    allowance: acc.allowance + emp.allowance,
    holiday30: acc.holiday30 + emp.holiday30,
    holiday2x: acc.holiday2x + emp.holiday2x,
    otHours: acc.otHours + emp.otHours,
    otPay: acc.otPay + emp.otPay,
    grossPay: acc.grossPay + emp.grossPay,
    sss: acc.sss + emp.sss,
    hdmf: acc.hdmf + emp.hdmf,
    philhealth: acc.philhealth + emp.philhealth,
    hmo: acc.hmo + emp.hmo,
    totalDeductions: acc.totalDeductions + emp.totalDeductions,
    netPay: acc.netPay + emp.netPay
  }), {
    basicSalary: 0, allowance: 0, holiday30: 0, holiday2x: 0,
    otHours: 0, otPay: 0, grossPay: 0, sss: 0, hdmf: 0,
    philhealth: 0, hmo: 0, totalDeductions: 0, netPay: 0
  });
  
  document.getElementById('footerBasicSalary').textContent = `₱${totals.basicSalary.toFixed(2)}`;
  document.getElementById('footerAllowance').textContent = `₱${totals.allowance.toFixed(2)}`;
  document.getElementById('footerHoliday30').textContent = `₱${totals.holiday30.toFixed(2)}`;
  document.getElementById('footerHoliday2x').textContent = `₱${totals.holiday2x.toFixed(2)}`;
  document.getElementById('footerOTHours').textContent = totals.otHours.toFixed(2);
  document.getElementById('footerOTPay').textContent = `₱${totals.otPay.toFixed(2)}`;
  document.getElementById('footerGrossPay').textContent = `₱${totals.grossPay.toFixed(2)}`;
  document.getElementById('footerSSS').textContent = `₱${totals.sss.toFixed(2)}`;
  document.getElementById('footerHDMF').textContent = `₱${totals.hdmf.toFixed(2)}`;
  document.getElementById('footerPhilHealth').textContent = `₱${totals.philhealth.toFixed(2)}`;
  document.getElementById('footerHMO').textContent = `₱${totals.hmo.toFixed(2)}`;
  document.getElementById('footerTotalDeductions').textContent = `₱${totals.totalDeductions.toFixed(2)}`;
  document.getElementById('footerNetPay').textContent = `₱${totals.netPay.toFixed(2)}`;
}

// Update payroll summary cards
function updatePayrollSummary() {
  const totals = payrollData.reduce((acc, emp) => ({
    grossPay: acc.grossPay + emp.grossPay,
    totalDeductions: acc.totalDeductions + emp.totalDeductions,
    netPay: acc.netPay + emp.netPay
  }), { grossPay: 0, totalDeductions: 0, netPay: 0 });
  
  document.getElementById('totalGrossPay').textContent = `₱${totals.grossPay.toFixed(2)}`;
  document.getElementById('totalDeductions').textContent = `₱${totals.totalDeductions.toFixed(2)}`;
  document.getElementById('totalNetPay').textContent = `₱${totals.netPay.toFixed(2)}`;
}

// Import Attendance Modal
const importAttendanceModal = document.getElementById('importAttendanceModal');
const importAttendanceBtn = document.getElementById('importAttendanceBtn');
const closeImportAttendanceModal = document.getElementById('closeImportAttendanceModal');
const cancelImportBtn = document.getElementById('cancelImportBtn');
const fileUploadArea = document.getElementById('fileUploadArea');
const attendanceFileInput = document.getElementById('attendanceFileInput');
const confirmImportBtn = document.getElementById('confirmImportBtn');
const importPreview = document.getElementById('importPreview');
const previewInfo = document.getElementById('previewInfo');

let importedAttendanceData = null;

importAttendanceBtn.addEventListener('click', () => {
  importAttendanceModal.classList.add('show');
});

closeImportAttendanceModal.addEventListener('click', () => {
  importAttendanceModal.classList.remove('show');
  resetImportModal();
});

cancelImportBtn.addEventListener('click', () => {
  importAttendanceModal.classList.remove('show');
  resetImportModal();
});

fileUploadArea.addEventListener('click', () => {
  attendanceFileInput.click();
});

// Drag and drop functionality
fileUploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  fileUploadArea.classList.add('dragover');
});

fileUploadArea.addEventListener('dragleave', () => {
  fileUploadArea.classList.remove('dragover');
});

fileUploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  fileUploadArea.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) {
    handleAttendanceFile(file);
  }
});

attendanceFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    handleAttendanceFile(file);
  }
});

// Handle attendance file upload
function handleAttendanceFile(file) {
  if (!file.name.match(/\.(xlsx|xls)$/)) {
    showNotification('❌ Please upload an Excel file (.xlsx or .xls)', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Parse the attendance sheet
      parseAttendanceData(workbook);
      
    } catch (error) {
      console.error('Error reading file:', error);
      showNotification('❌ Error reading Excel file', 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

// Parse attendance data from Excel
function parseAttendanceData(workbook) {
  const attendanceSheet = workbook.Sheets['ATTENDANCE'];
  if (!attendanceSheet) {
    showNotification('❌ No ATTENDANCE sheet found in the file', 'error');
    return;
  }
  
  const jsonData = XLSX.utils.sheet_to_json(attendanceSheet, { header: 1 });
  
  // Extract OT data
  const otData = {};
  let currentSection = null;
  
  jsonData.forEach((row, index) => {
    if (row[0] && typeof row[0] === 'string' && row[0] !== 'NAME') {
      const name = row[0].trim();
      
      // Look for TOTAL OT column
      const otIndex = row.indexOf('TOTAL OT');
      if (otIndex === -1 && row.length > 17) {
        // Try to find OT hours (usually has a formula like =C3+D3...)
        const possibleOT = row[17];
        if (possibleOT && (typeof possibleOT === 'number' || possibleOT.toString().startsWith('='))) {
          const otHours = typeof possibleOT === 'number' ? possibleOT : 0;
          if (!otData[name]) {
            otData[name] = 0;
          }
          otData[name] += otHours;
        }
      }
    }
  });
  
  importedAttendanceData = otData;
  
  // Show preview
  showImportPreview(otData);
}

// Show import preview
function showImportPreview(otData) {
  const employeeCount = Object.keys(otData).length;
  const totalOTHours = Object.values(otData).reduce((sum, hours) => sum + hours, 0);
  
  previewInfo.innerHTML = `
    <p><strong>📊 Employees Found:</strong> ${employeeCount}</p>
    <p><strong>⏰ Total OT Hours:</strong> ${totalOTHours.toFixed(2)} hours</p>
    <p><strong>📅 Period:</strong> ${document.getElementById('payrollPeriodDisplay').textContent}</p>
  `;
  
  importPreview.style.display = 'block';
  confirmImportBtn.style.display = 'inline-block';
}

// Confirm import
confirmImportBtn.addEventListener('click', () => {
  if (!importedAttendanceData) {
    showNotification('❌ No data to import', 'error');
    return;
  }
  
  // Match imported names with payroll data
  let matchedCount = 0;
  payrollData.forEach(emp => {
    // Try to find matching name (case-insensitive, flexible matching)
    const importedName = Object.keys(importedAttendanceData).find(name => 
      name.toLowerCase().includes(emp.name.toLowerCase().split(',')[0].toLowerCase()) ||
      emp.name.toLowerCase().includes(name.toLowerCase().split(',')[0].toLowerCase())
    );
    
    if (importedName) {
      emp.otHours = importedAttendanceData[importedName] || 0;
      matchedCount++;
    }
  });
  
  calculatePayroll();
  importAttendanceModal.classList.remove('show');
  resetImportModal();
  
  showNotification(`✅ Imported OT hours for ${matchedCount} employees!`, 'success');
});

// Reset import modal
function resetImportModal() {
  attendanceFileInput.value = '';
  importPreview.style.display = 'none';
  confirmImportBtn.style.display = 'none';
  previewInfo.innerHTML = '';
  importedAttendanceData = null;
}

// Payroll Settings Modal
const payrollSettingsModal = document.getElementById('payrollSettingsModal');
const payrollSettingsBtn = document.getElementById('payrollSettingsBtn');
const closePayrollSettingsModal = document.getElementById('closePayrollSettingsModal');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

payrollSettingsBtn.addEventListener('click', () => {
  payrollSettingsModal.classList.add('show');
  updatePayrollSettingsUI();
});

closePayrollSettingsModal.addEventListener('click', () => {
  payrollSettingsModal.classList.remove('show');
});

cancelSettingsBtn.addEventListener('click', () => {
  payrollSettingsModal.classList.remove('show');
});

saveSettingsBtn.addEventListener('click', () => {
  // Get values from form
  payrollSettings.otRegularMultiplier = parseFloat(document.getElementById('otRegularMultiplier').value) || 1.25;
  payrollSettings.otRestDayMultiplier = parseFloat(document.getElementById('otRestDayMultiplier').value) || 1.3;
  payrollSettings.holidayRegularRate = parseFloat(document.getElementById('holidayRegularRate').value) || 30;
  payrollSettings.holidaySpecialRate = parseFloat(document.getElementById('holidaySpecialRate').value) || 30;
  payrollSettings.holidayDoubleRate = parseFloat(document.getElementById('holidayDoubleRate').value) || 100;
  payrollSettings.sssFixed = document.getElementById('sssDeductionType').checked;
  payrollSettings.sssAmount = parseFloat(document.getElementById('sssAmount').value) || 0;
  payrollSettings.hdmfFixed = document.getElementById('hdmfDeductionType').checked;
  payrollSettings.hdmfAmount = parseFloat(document.getElementById('hdmfAmount').value) || 0;
  payrollSettings.philhealthFixed = document.getElementById('philhealthDeductionType').checked;
  payrollSettings.philhealthAmount = parseFloat(document.getElementById('philhealthAmount').value) || 0;
  
  savePayrollSettings();
  payrollSettingsModal.classList.remove('show');
  calculatePayroll();
  showNotification('✅ Payroll settings saved successfully!', 'success');
});

// Period selection change handlers
document.getElementById('payrollPeriodType').addEventListener('change', updatePayrollPeriodDisplay);
document.getElementById('payrollMonth').addEventListener('change', updatePayrollPeriodDisplay);
document.getElementById('payrollYear').addEventListener('change', updatePayrollPeriodDisplay);

// Calculate payroll button
document.getElementById('calculatePayrollBtn').addEventListener('click', calculatePayroll);

// Export payroll button
document.getElementById('exportPayrollBtn').addEventListener('click', () => {
  exportPayrollToExcel();
});

// Export payroll to Excel
function exportPayrollToExcel() {
  const wb = XLSX.utils.book_new();
  
  // Prepare data for export
  const exportData = [
    ['EMPLOYEE NAME', 'POSITION', 'BASIC SALARY', 'ALLOWANCE', 'HOLIDAY 30%', 'HOLIDAY 2X', 
     'OT HOURS', 'OT PAY', 'GROSS PAY', 'SSS', 'HDMF', 'PHILHEALTH', 'HMO', 'TOTAL DEDUCTIONS', 'NET PAY']
  ];
  
  payrollData.forEach(emp => {
    exportData.push([
      emp.name,
      emp.position,
      emp.basicSalary,
      emp.allowance,
      emp.holiday30,
      emp.holiday2x,
      emp.otHours,
      emp.otPay,
      emp.grossPay,
      emp.sss,
      emp.hdmf,
      emp.philhealth,
      emp.hmo,
      emp.totalDeductions,
      emp.netPay
    ]);
  });
  
  const ws = XLSX.utils.aoa_to_sheet(exportData);
  XLSX.utils.book_append_sheet(wb, ws, 'Payroll');
  
  const periodDisplay = document.getElementById('payrollPeriodDisplay').textContent;
  const fileName = `Payroll_${periodDisplay.replace(/ /g, '_')}.xlsx`;
  
  XLSX.writeFile(wb, fileName);
  showNotification('✅ Payroll exported successfully!', 'success');
}

// Add SheetJS library dynamically
if (typeof XLSX === 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js';
  script.onload = () => {
    console.log('SheetJS library loaded');
  };
  document.head.appendChild(script);
}

// Initialize payroll when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePayroll);
} else {
  initializePayroll();
}