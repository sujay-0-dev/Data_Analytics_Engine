// Day 2 - Advanced Data Structures & Array Methods
// Data Analytics Engine

class DataAnalyticsEngine {
  constructor() {
    this.salesData = []
    this.filteredData = []
    this.uniqueRegions = new Set()
    this.productSalesMap = new Map()
    this.performanceMetrics = {
      processingTime: 0,
      operationsPerSecond: 0,
      memoryUsage: 0,
    }

    this.generateData()
    this.init()
  }

  // Generate realistic sample data
  generateData() {
    const products = [
      "Laptop Pro",
      "Smartphone X",
      "Tablet Air",
      "Headphones Premium",
      "Smart Watch",
      "Gaming Console",
      "Wireless Mouse",
      "Mechanical Keyboard",
      "Monitor 4K",
      "Webcam HD",
      "Speaker Set",
      "Power Bank",
      "USB Drive 64GB",
      "External Hard Drive",
      "Graphics Card RTX",
    ]

    const regions = ["North America", "Europe", "Asia Pacific", "South America", "Africa", "Middle East"]

    const categories = ["Electronics", "Accessories", "Gaming", "Computing", "Mobile"]

    this.salesData = []
    this.uniqueRegions = new Set()

    for (let i = 1; i <= 500; i++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const region = regions[Math.floor(Math.random() * regions.length)]
      const category = categories[Math.floor(Math.random() * categories.length)]
      const amount = Math.floor(Math.random() * 5000) + 100
      const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)

      this.salesData.push({
        id: i,
        product,
        amount,
        region,
        date: date.toISOString().split("T")[0],
        category,
      })

      this.uniqueRegions.add(region)
    }

    this.filteredData = [...this.salesData]
  }

  // Initialize the application
  init() {
    this.updateStats()
    this.populateFilters()
    this.renderTable()
    this.setupEventListeners()
    this.calculateMemoryUsage()
    this.updatePerformanceDisplay()
  }

  // Update statistics display
  updateStats() {
    const startTime = performance.now()

    const totalRevenue = this.filteredData.reduce((sum, sale) => sum + sale.amount, 0)

    // Find top product using Map
    this.productSalesMap.clear()
    this.filteredData.forEach((sale) => {
      const current = this.productSalesMap.get(sale.product) || 0
      this.productSalesMap.set(sale.product, current + sale.amount)
    })

    let topProduct = "No data"
    let topRevenue = 0

    if (this.productSalesMap.size > 0) {
      const topEntry = [...this.productSalesMap.entries()].reduce((max, current) =>
        current[1] > max[1] ? current : max,
      )
      topProduct = topEntry[0]
      topRevenue = topEntry[1]
    }

    // Get unique regions from filtered data
    const filteredRegions = new Set(this.filteredData.map((sale) => sale.region))

    const endTime = performance.now()
    this.performanceMetrics.processingTime = endTime - startTime

    // Update DOM
    document.getElementById("sales-count").textContent = this.filteredData.length.toLocaleString()
    document.getElementById("total-revenue").textContent = `$${totalRevenue.toLocaleString()}`
    document.getElementById("top-product").textContent = topProduct
    document.getElementById("unique-regions").textContent = filteredRegions.size
  }

  // Populate filter dropdowns
  populateFilters() {
    // Populate region filter
    const regionSelect = document.getElementById("region-filter")
    regionSelect.innerHTML = '<option value="all">All Regions</option>'

    const sortedRegions = [...this.uniqueRegions].sort()
    sortedRegions.forEach((region) => {
      const option = document.createElement("option")
      option.value = region
      option.textContent = region
      regionSelect.appendChild(option)
    })

    // Populate product filter
    const productSelect = document.getElementById("product-filter")
    productSelect.innerHTML = '<option value="all">All Products</option>'

    const uniqueProducts = [...new Set(this.salesData.map((sale) => sale.product))].sort()
    uniqueProducts.forEach((product) => {
      const option = document.createElement("option")
      option.value = product
      option.textContent = product
      productSelect.appendChild(option)
    })
  }

  // Render data table
  renderTable() {
    const tbody = document.getElementById("table-body")
    tbody.innerHTML = ""

    // Show first 100 records for performance
    const displayData = this.filteredData.slice(0, 100)

    displayData.forEach((sale) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${sale.id}</td>
                <td>${sale.product}</td>
                <td>$${sale.amount.toLocaleString()}</td>
                <td>${sale.region}</td>
                <td>${sale.date}</td>
                <td>${sale.category}</td>
            `
      tbody.appendChild(row)
    })

    // Add info row if more data exists
    if (this.filteredData.length > 100) {
      const infoRow = document.createElement("tr")
      infoRow.innerHTML = `
                <td colspan="6" style="text-align: center; font-style: italic; color: #718096;">
                    Showing first 100 of ${this.filteredData.length.toLocaleString()} records
                </td>
            `
      tbody.appendChild(infoRow)
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Filter controls
    document.getElementById("apply-filters").addEventListener("click", () => this.applyFilters())
    document.getElementById("reset-filters").addEventListener("click", () => this.resetFilters())

    // Table controls
    document.getElementById("sort-by-amount").addEventListener("click", () => this.sortByAmount())
    document.getElementById("sort-by-date").addEventListener("click", () => this.sortByDate())
    document.getElementById("group-by-region").addEventListener("click", () => this.groupByRegion())

    // Method demonstration buttons
    document.getElementById("transform-btn").addEventListener("click", () => this.demonstrateMap())
    document.getElementById("filter-btn").addEventListener("click", () => this.demonstrateFilter())
    document.getElementById("reduce-btn").addEventListener("click", () => this.demonstrateReduce())
    document.getElementById("find-btn").addEventListener("click", () => this.demonstrateFindSome())
    document.getElementById("set-btn").addEventListener("click", () => this.demonstrateSet())
    document.getElementById("map-collection-btn").addEventListener("click", () => this.demonstrateMapCollection())
  }

  // Apply filters using advanced array methods
  applyFilters() {
    const startTime = performance.now()

    const regionFilter = document.getElementById("region-filter").value
    const productFilter = document.getElementById("product-filter").value
    const minAmount = Number.parseInt(document.getElementById("min-amount").value) || 0

    console.log("Applying filters:", { regionFilter, productFilter, minAmount })

    this.filteredData = this.salesData
      .filter((sale) => {
        // Region filter
        if (regionFilter !== "all" && sale.region !== regionFilter) {
          return false
        }
        return true
      })
      .filter((sale) => {
        // Product filter
        if (productFilter !== "all" && sale.product !== productFilter) {
          return false
        }
        return true
      })
      .filter((sale) => {
        // Amount filter
        return sale.amount >= minAmount
      })

    const endTime = performance.now()
    this.performanceMetrics.processingTime = endTime - startTime
    this.performanceMetrics.operationsPerSecond = Math.round(
      this.salesData.length / (this.performanceMetrics.processingTime / 1000),
    )

    console.log("Filtered data:", this.filteredData.length, "records")

    this.updateStats()
    this.renderTable()
    this.updatePerformanceDisplay()

    // Show success message
    this.showFilterMessage()
  }

  showFilterMessage() {
    const originalCount = this.salesData.length
    const filteredCount = this.filteredData.length
    const message = `Filters applied! ${originalCount} → ${filteredCount} records (${((filteredCount / originalCount) * 100).toFixed(1)}%)`

    // Create temporary message element
    const messageEl = document.createElement("div")
    messageEl.textContent = message
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #48bb78;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      z-index: 1000;
      font-weight: bold;
    `
    document.body.appendChild(messageEl)

    setTimeout(() => {
      if (document.body.contains(messageEl)) {
        document.body.removeChild(messageEl)
      }
    }, 3000)
  }

  // Reset all filters
  resetFilters() {
    document.getElementById("region-filter").value = "all"
    document.getElementById("product-filter").value = "all"
    document.getElementById("min-amount").value = ""

    this.filteredData = [...this.salesData]
    this.updateStats()
    this.renderTable()
    this.updatePerformanceDisplay()

    console.log("Filters reset")
  }

  // Sort by amount (descending)
  sortByAmount() {
    const startTime = performance.now()
    this.filteredData.sort((a, b) => b.amount - a.amount)
    const endTime = performance.now()

    this.performanceMetrics.processingTime = endTime - startTime
    this.renderTable()
    this.updatePerformanceDisplay()
    console.log("Sorted by amount (highest first)")
  }

  // Sort by date (newest first)
  sortByDate() {
    const startTime = performance.now()
    this.filteredData.sort((a, b) => new Date(b.date) - new Date(a.date))
    const endTime = performance.now()

    this.performanceMetrics.processingTime = endTime - startTime
    this.renderTable()
    this.updatePerformanceDisplay()
    console.log("Sorted by date (newest first)")
  }

  // Group by region and show summary
  groupByRegion() {
    const startTime = performance.now()

    const regionGroups = this.filteredData.reduce((groups, sale) => {
      const region = sale.region
      if (!groups[region]) {
        groups[region] = {
          sales: [],
          totalRevenue: 0,
          count: 0,
          avgAmount: 0,
        }
      }
      groups[region].sales.push(sale)
      groups[region].totalRevenue += sale.amount
      groups[region].count += 1
      return groups
    }, {})

    // Calculate averages
    Object.keys(regionGroups).forEach((region) => {
      regionGroups[region].avgAmount = Math.round(regionGroups[region].totalRevenue / regionGroups[region].count)
    })

    const endTime = performance.now()
    this.performanceMetrics.processingTime = endTime - startTime

    console.log("Grouped by Region:", regionGroups)

    // Show grouped data in a formatted way
    let groupSummary = "📊 REGIONAL GROUPING RESULTS:\n\n"
    Object.entries(regionGroups)
      .sort(([, a], [, b]) => b.totalRevenue - a.totalRevenue)
      .forEach(([region, data]) => {
        groupSummary += `${region}:\n`
        groupSummary += `  • Sales: ${data.count.toLocaleString()}\n`
        groupSummary += `  • Revenue: $${data.totalRevenue.toLocaleString()}\n`
        groupSummary += `  • Avg Sale: $${data.avgAmount.toLocaleString()}\n\n`
      })

    alert(groupSummary)
    this.updatePerformanceDisplay()
  }

  // Calculate memory usage estimation
  calculateMemoryUsage() {
    const dataSize = JSON.stringify(this.salesData).length
    const filteredSize = JSON.stringify(this.filteredData).length
    const mapSize = this.productSalesMap.size * 50 // Rough estimate
    const setSize = this.uniqueRegions.size * 20 // Rough estimate

    this.performanceMetrics.memoryUsage = Math.round((dataSize + filteredSize + mapSize + setSize) / 1024) // KB
  }

  // Update performance display
  updatePerformanceDisplay() {
    document.getElementById("processing-time").textContent = `${this.performanceMetrics.processingTime.toFixed(2)}ms`
    document.getElementById("memory-usage").textContent = `${this.performanceMetrics.memoryUsage}KB`
    document.getElementById("operations-per-sec").textContent =
      this.performanceMetrics.operationsPerSecond.toLocaleString()
  }

  // Array Method Demonstrations
  demonstrateMap() {
    const output = document.getElementById("map-output")

    // Add this check at the beginning of each demonstration method
    if (this.filteredData.length === 0) {
      output.textContent = `❌ No data available to demonstrate this method.
  
Please reset filters or adjust your filter criteria to see results.
  
Current filters may have filtered out all records.`
      return
    }

    const startTime = performance.now()

    // Transform sales data to include profit margins and formatted data
    const transformedData = this.filteredData.slice(0, 10).map((sale, index) => ({
      ...sale,
      profit: Math.round(sale.amount * 0.2), // 20% profit margin
      formattedAmount: `$${sale.amount.toLocaleString()}`,
      quarter: `Q${Math.ceil((new Date(sale.date).getMonth() + 1) / 3)}`,
      rank: index + 1,
      profitMargin: "20%",
      status: sale.amount > 2000 ? "High Value" : "Standard",
    }))

    const endTime = performance.now()

    output.textContent = `🗺️ MAP TRANSFORMATION (${(endTime - startTime).toFixed(2)}ms):

Transformed ${this.filteredData.length} → ${transformedData.length} records (showing first 10)

${transformedData
  .map(
    (item) =>
      `${item.rank}. ${item.product}
   Amount: ${item.formattedAmount} → Profit: $${item.profit.toLocaleString()}
   Quarter: ${item.quarter} | Status: ${item.status}
   Region: ${item.region}`,
  )
  .join("\n\n")}

✅ Added profit calculations (20% margin)
✅ Formatted currency display
✅ Extracted quarter information
✅ Added ranking and status
✅ Preserved original data structure

Total Profit: $${transformedData.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}`
  }

  demonstrateFilter() {
    const output = document.getElementById("filter-output")

    // Add this check at the beginning of each demonstration method
    if (this.filteredData.length === 0) {
      output.textContent = `❌ No data available to demonstrate this method.
  
Please reset filters or adjust your filter criteria to see results.
  
Current filters may have filtered out all records.`
      return
    }

    const startTime = performance.now()

    // Filter high-value sales (>$2000)
    const highValueSales = this.filteredData.filter((sale) => sale.amount > 2000)

    // Chain multiple filters for premium electronics
    const premiumElectronics = this.filteredData
      .filter((sale) => sale.category === "Electronics")
      .filter((sale) => sale.amount > 1500)
      .filter((sale) => ["North America", "Europe"].includes(sale.region))

    // Filter by date range (recent sales)
    const recentSales = this.filteredData.filter((sale) => {
      const saleDate = new Date(sale.date)
      const cutoffDate = new Date("2024-06-01")
      return saleDate >= cutoffDate
    })

    const endTime = performance.now()

    const avgHighValue =
      highValueSales.length > 0
        ? Math.round(highValueSales.reduce((sum, sale) => sum + sale.amount, 0) / highValueSales.length)
        : 0

    output.textContent = `🔍 FILTER ANALYSIS (${(endTime - startTime).toFixed(2)}ms):

Original Dataset: ${this.filteredData.length.toLocaleString()} records

HIGH-VALUE SALES (>$2,000):
• Count: ${highValueSales.length.toLocaleString()} records
• Percentage: ${((highValueSales.length / this.filteredData.length) * 100).toFixed(1)}%
• Average: $${avgHighValue.toLocaleString()}
• Total Value: $${highValueSales.reduce((sum, sale) => sum + sale.amount, 0).toLocaleString()}

PREMIUM ELECTRONICS (NA/EU, >$1,500):
• Count: ${premiumElectronics.length} records
• Top Product: ${premiumElectronics[0]?.product || "None"}
• Avg Amount: $${premiumElectronics.length > 0 ? Math.round(premiumElectronics.reduce((sum, sale) => sum + sale.amount, 0) / premiumElectronics.length).toLocaleString() : 0}

RECENT SALES (June 2024+):
• Count: ${recentSales.length} records
• Percentage: ${((recentSales.length / this.filteredData.length) * 100).toFixed(1)}%

✅ Multiple filter conditions applied
✅ Chained filtering for complex criteria
✅ Date-based filtering implemented`
  }

  demonstrateReduce() {
    const output = document.getElementById("reduce-output")

    // Add this check at the beginning of each demonstration method
    if (this.filteredData.length === 0) {
      output.textContent = `❌ No data available to demonstrate this method.
  
Please reset filters or adjust your filter criteria to see results.
  
Current filters may have filtered out all records.`
      return
    }

    const startTime = performance.now()

    // Calculate totals by region
    const regionTotals = this.filteredData.reduce((totals, sale) => {
      totals[sale.region] = (totals[sale.region] || 0) + sale.amount
      return totals
    }, {})

    // Calculate average sale amount
    const totalRevenue = this.filteredData.reduce((sum, sale) => sum + sale.amount, 0)
    const averageSale = this.filteredData.length > 0 ? totalRevenue / this.filteredData.length : 0

    // Complex aggregation: category performance with detailed stats
    const categoryStats = this.filteredData.reduce((stats, sale) => {
      if (!stats[sale.category]) {
        stats[sale.category] = {
          total: 0,
          count: 0,
          products: new Set(),
          maxSale: 0,
          minSale: Number.POSITIVE_INFINITY,
        }
      }
      stats[sale.category].total += sale.amount
      stats[sale.category].count += 1
      stats[sale.category].products.add(sale.product)
      stats[sale.category].maxSale = Math.max(stats[sale.category].maxSale, sale.amount)
      stats[sale.category].minSale = Math.min(stats[sale.category].minSale, sale.amount)
      return stats
    }, {})

    // Calculate monthly trends
    const monthlyTrends = this.filteredData.reduce((trends, sale) => {
      const month = sale.date.substring(0, 7) // YYYY-MM
      trends[month] = (trends[month] || 0) + sale.amount
      return trends
    }, {})

    const endTime = performance.now()

    const topRegion = Object.entries(regionTotals).reduce(
      (max, current) => (current[1] > max[1] ? current : max),
      ["None", 0],
    )

    const topCategory = Object.entries(categoryStats).reduce(
      (max, current) => (current[1].total > max[1].total ? current : max),
      ["None", { total: 0 }],
    )

    output.textContent = `📊 REDUCE AGGREGATION (${(endTime - startTime).toFixed(2)}ms):

REGIONAL TOTALS:
${Object.entries(regionTotals)
  .sort(([, a], [, b]) => b - a)
  .map(([region, total]) => `• ${region}: $${total.toLocaleString()}`)
  .join("\n")}

TOP PERFORMERS:
• Best Region: ${topRegion[0]} ($${topRegion[1].toLocaleString()})
• Best Category: ${topCategory[0]} ($${topCategory[1].total.toLocaleString()})
• Overall Average: $${Math.round(averageSale).toLocaleString()}

CATEGORY PERFORMANCE:
${Object.entries(categoryStats)
  .sort(([, a], [, b]) => b.total - a.total)
  .map(
    ([cat, stats]) =>
      `• ${cat}: ${stats.count} sales, ${stats.products.size} products
     Range: $${stats.minSale.toLocaleString()} - $${stats.maxSale.toLocaleString()}`,
  )
  .join("\n")}

MONTHLY TRENDS: ${Object.keys(monthlyTrends).length} months tracked
Latest: ${Object.keys(monthlyTrends).sort().pop()} ($${monthlyTrends[Object.keys(monthlyTrends).sort().pop()]?.toLocaleString() || 0})

✅ Multi-level data aggregation
✅ Statistical calculations (min, max, avg)
✅ Complex object accumulation`
  }

  demonstrateFindSome() {
    const output = document.getElementById("find-output")

    // Add this check at the beginning of each demonstration method
    if (this.filteredData.length === 0) {
      output.textContent = `❌ No data available to demonstrate this method.
  
Please reset filters or adjust your filter criteria to see results.
  
Current filters may have filtered out all records.`
      return
    }

    const startTime = performance.now()

    // Find specific records
    const expensiveSale = this.filteredData.find((sale) => sale.amount > 4000)
    const laptopSale = this.filteredData.find((sale) => sale.product.toLowerCase().includes("laptop"))
    const recentSale = this.filteredData.find((sale) => new Date(sale.date) > new Date("2024-09-01"))

    // Check conditions with some/every
    const hasHighValueSales = this.filteredData.some((sale) => sale.amount > 3000)
    const allPositiveAmounts = this.filteredData.every((sale) => sale.amount > 0)
    const hasEuropeSales = this.filteredData.some((sale) => sale.region === "Europe")
    const allRecentSales = this.filteredData.every((sale) => new Date(sale.date) > new Date("2024-01-01"))

    // Find indexes
    const firstGamingIndex = this.filteredData.findIndex((sale) => sale.category === "Gaming")
    const firstHighValueIndex = this.filteredData.findIndex((sale) => sale.amount > 3000)

    // Advanced searches
    const topSaleInRegion = this.filteredData
      .filter((sale) => sale.region === "North America")
      .find(
        (sale) =>
          sale.amount ===
          Math.max(...this.filteredData.filter((s) => s.region === "North America").map((s) => s.amount)),
      )

    const endTime = performance.now()

    output.textContent = `🎯 FIND & SOME OPERATIONS (${(endTime - startTime).toFixed(2)}ms):

FIND RESULTS:
• Expensive sale (>$4,000): ${
      expensiveSale
        ? `${expensiveSale.product} - $${expensiveSale.amount.toLocaleString()} (${expensiveSale.region})`
        : "❌ None found"
    }
• Laptop sale: ${laptopSale ? `${laptopSale.product} - $${laptopSale.amount.toLocaleString()}` : "❌ None found"}
• Recent sale (Sep 2024+): ${recentSale ? `${recentSale.product} - ${recentSale.date}` : "❌ None found"}

SOME/EVERY VALIDATION:
• Has high-value sales (>$3,000): ${hasHighValueSales ? "✅ Yes" : "❌ No"}
• All amounts positive: ${allPositiveAmounts ? "✅ Yes" : "❌ No"}
• Has Europe sales: ${hasEuropeSales ? "✅ Yes" : "❌ No"}
• All sales from 2024: ${allRecentSales ? "✅ Yes" : "❌ No"}

FIND INDEX RESULTS:
• First gaming product: ${firstGamingIndex >= 0 ? `Index ${firstGamingIndex}` : "❌ Not found"}
• First high-value sale: ${firstHighValueIndex >= 0 ? `Index ${firstHighValueIndex}` : "❌ Not found"}

ADVANCED SEARCH:
• Top NA sale: ${
      topSaleInRegion ? `${topSaleInRegion.product} - $${topSaleInRegion.amount.toLocaleString()}` : "❌ None found"
    }

✅ Efficient single-item searches
✅ Boolean condition validation
✅ Index-based lookups
✅ Complex nested searches`
  }

  demonstrateSet() {
    const output = document.getElementById("set-output")

    // Add this check at the beginning of each demonstration method
    if (this.filteredData.length === 0) {
      output.textContent = `❌ No data available to demonstrate this method.
  
Please reset filters or adjust your filter criteria to see results.
  
Current filters may have filtered out all records.`
      return
    }

    const startTime = performance.now()

    // Create Sets for unique values
    const uniqueProducts = new Set(this.filteredData.map((sale) => sale.product))
    const uniqueCategories = new Set(this.filteredData.map((sale) => sale.category))
    const uniqueRegions = new Set(this.filteredData.map((sale) => sale.region))
    const uniqueDates = new Set(this.filteredData.map((sale) => sale.date))

    // Set operations with categories
    const electronicsProducts = new Set(
      this.filteredData.filter((sale) => sale.category === "Electronics").map((sale) => sale.product),
    )

    const gamingProducts = new Set(
      this.filteredData.filter((sale) => sale.category === "Gaming").map((sale) => sale.product),
    )

    const accessoryProducts = new Set(
      this.filteredData.filter((sale) => sale.category === "Accessories").map((sale) => sale.product),
    )

    // Advanced Set operations
    const intersection = new Set([...electronicsProducts].filter((product) => gamingProducts.has(product)))
    const union = new Set([...electronicsProducts, ...gamingProducts])
    const electronicsOnly = new Set([...electronicsProducts].filter((product) => !gamingProducts.has(product)))

    // High-value product set
    const highValueProducts = new Set(
      this.filteredData.filter((sale) => sale.amount > 2000).map((sale) => sale.product),
    )

    // Duplicate detection
    const originalProductCount = this.filteredData.length
    const uniqueProductCount = uniqueProducts.size
    const duplicateRate = (((originalProductCount - uniqueProductCount) / originalProductCount) * 100).toFixed(1)

    const endTime = performance.now()

    output.textContent = `📋 SET OPERATIONS (${(endTime - startTime).toFixed(2)}ms):

UNIQUE VALUE COUNTS:
• Products: ${uniqueProducts.size} unique (from ${this.filteredData.length} sales)
• Categories: ${uniqueCategories.size} unique
• Regions: ${uniqueRegions.size} unique  
• Trading Days: ${uniqueDates.size} unique

CATEGORY-BASED SETS:
• Electronics Products: ${electronicsProducts.size}
• Gaming Products: ${gamingProducts.size}
• Accessories Products: ${accessoryProducts.size}

SET OPERATIONS:
• Electronics ∩ Gaming: ${intersection.size} products
• Electronics ∪ Gaming: ${union.size} products
• Electronics Only: ${electronicsOnly.size} products

HIGH-VALUE ANALYSIS:
• High-value Products (>$2K): ${highValueProducts.size}
• Duplicate Rate: ${duplicateRate}%

SAMPLE UNIQUE PRODUCTS:
${[...uniqueProducts].slice(0, 8).join(", ")}...

SAMPLE HIGH-VALUE PRODUCTS:
${[...highValueProducts].slice(0, 5).join(", ")}

✅ Eliminated duplicates efficiently
✅ Fast O(1) lookup operations
✅ Set intersection & union operations
✅ Memory-efficient unique collections`
  }

  demonstrateMapCollection() {
    const output = document.getElementById("map-collection-output")

    // Add this check at the beginning of each demonstration method
    if (this.filteredData.length === 0) {
      output.textContent = `❌ No data available to demonstrate this method.
  
Please reset filters or adjust your filter criteria to see results.
  
Current filters may have filtered out all records.`
      return
    }

    const startTime = performance.now()

    // Create Maps for grouping and advanced analytics
    const salesByRegion = new Map()
    const productPerformance = new Map()
    const monthlyTrends = new Map()
    const categoryRegionMatrix = new Map()

    this.filteredData.forEach((sale) => {
      // Group by region with detailed stats
      if (!salesByRegion.has(sale.region)) {
        salesByRegion.set(sale.region, {
          sales: [],
          totalRevenue: 0,
          count: 0,
          avgAmount: 0,
          topProduct: "",
          topProductRevenue: 0,
        })
      }
      const regionData = salesByRegion.get(sale.region)
      regionData.sales.push(sale)
      regionData.totalRevenue += sale.amount
      regionData.count += 1

      // Track product performance with detailed metrics
      if (!productPerformance.has(sale.product)) {
        productPerformance.set(sale.product, {
          totalRevenue: 0,
          salesCount: 0,
          regions: new Set(),
          avgPrice: 0,
          maxSale: 0,
          minSale: Number.POSITIVE_INFINITY,
        })
      }
      const productData = productPerformance.get(sale.product)
      productData.totalRevenue += sale.amount
      productData.salesCount += 1
      productData.regions.add(sale.region)
      productData.maxSale = Math.max(productData.maxSale, sale.amount)
      productData.minSale = Math.min(productData.minSale, sale.amount)

      // Monthly trends with category breakdown
      const month = sale.date.substring(0, 7)
      if (!monthlyTrends.has(month)) {
        monthlyTrends.set(month, {
          totalRevenue: 0,
          salesCount: 0,
          categories: new Map(),
        })
      }
      const monthData = monthlyTrends.get(month)
      monthData.totalRevenue += sale.amount
      monthData.salesCount += 1

      if (!monthData.categories.has(sale.category)) {
        monthData.categories.set(sale.category, 0)
      }
      monthData.categories.set(sale.category, monthData.categories.get(sale.category) + sale.amount)

      // Category-Region matrix
      const categoryRegionKey = `${sale.category}-${sale.region}`
      if (!categoryRegionMatrix.has(categoryRegionKey)) {
        categoryRegionMatrix.set(categoryRegionKey, {
          revenue: 0,
          count: 0,
          products: new Set(),
        })
      }
      const matrixData = categoryRegionMatrix.get(categoryRegionKey)
      matrixData.revenue += sale.amount
      matrixData.count += 1
      matrixData.products.add(sale.product)
    })

    // Find top performers
    let topRegion = { name: "", revenue: 0 }
    salesByRegion.forEach((data, region) => {
      if (data.totalRevenue > topRegion.revenue) {
        topRegion = { name: region, revenue: data.totalRevenue }
      }
    })

    let topProduct = { name: "", revenue: 0, regions: 0 }
    productPerformance.forEach((data, product) => {
      if (data.totalRevenue > topProduct.revenue) {
        topProduct = { name: product, revenue: data.totalRevenue, regions: data.regions.size }
      }
    })

    const endTime = performance.now()

    // Safe access to product performance data
    const topProductData = topProduct.name ? productPerformance.get(topProduct.name) : null

    output.textContent = `🗂️ MAP COLLECTIONS (${(endTime - startTime).toFixed(2)}ms):

REGIONAL PERFORMANCE:
${[...salesByRegion.entries()]
  .sort(([, a], [, b]) => b.totalRevenue - a.totalRevenue)
  .map(
    ([region, data]) =>
      `• ${region}: ${data.count} sales, $${data.totalRevenue.toLocaleString()} (avg: $${data.avgAmount.toLocaleString()})`,
  )
  .join("\n")}

TOP PERFORMERS:
• Best Region: ${topRegion.name || "No data"} ($${topRegion.revenue.toLocaleString()})
• Best Product: ${topProduct.name || "No data"} 
  Revenue: $${topProduct.revenue.toLocaleString()}
  Regions: ${topProduct.regions}
  Sales: ${topProductData ? topProductData.salesCount : 0}

MONTHLY TRENDS (${monthlyTrends.size} months):
${[...monthlyTrends.entries()]
  .sort(([a], [b]) => b.localeCompare(a))
  .slice(0, 3)
  .map(([month, data]) => `• ${month}: $${data.totalRevenue.toLocaleString()} (${data.salesCount} sales)`)
  .join("\n")}

CATEGORY-REGION MATRIX:
Top combinations:
${[...categoryRegionMatrix.entries()]
  .sort(([, a], [, b]) => b.revenue - a.revenue)
  .slice(0, 5)
  .map(([key, data]) => {
    const [category, region] = key.split("-")
    return `• ${category} in ${region}: $${data.revenue.toLocaleString()} (${data.count} sales)`
  })
  .join("\n")}

PERFORMANCE METRICS:
• Maps Created: 4 collections
• Total Entries: ${salesByRegion.size + productPerformance.size + monthlyTrends.size + categoryRegionMatrix.size}
• Lookup Complexity: O(1) for all operations
• Memory Efficiency: Optimized grouping

✅ Efficient multi-dimensional grouping
✅ Complex nested data structures
✅ Real-time aggregation calculations
✅ Cross-category analysis capabilities`
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  try {
    window.analytics = new DataAnalyticsEngine()
    console.log("🚀 Day 2 Data Analytics Engine loaded!")
    console.log("📊 Sample data generated:", window.analytics.salesData.length, "records")
    console.log("🌍 Unique regions:", [...window.analytics.uniqueRegions].join(", "))
  } catch (error) {
    console.error("Error initializing analytics engine:", error)
  }
})
