<template>
  <div class="foodtruck-app">
    <!-- Header -->
    <nav class="nav-wrapper gradient-bg">
      <div class="container">
        <a href="#" class="brand-logo center">FoodTruck Staffing Calculator</a>
      </div>
    </nav>

    <div class="container main-content">
      <!-- AI Recommendation Card -->
      <div class="row" v-if="showRecommendation">
        <div class="col s12">
          <div class="card recommendation-card z-depth-3">
            <div class="card-content white-text">
              <span class="card-title center-align">
                <i class="material-icons medium">psychology</i>
                AI Recommendation
              </span>
              <div class="recommendation-highlight center-align">
                <div class="big-number">{{ recommendation.recommended }}</div>
                <p class="recommendation-text">Recommended Employees</p>
              </div>
              <div class="row metrics-grid">
                <div class="col s12 m4">
                  <div class="metric-card">
                    <p class="metric-label">Utilization Rate</p>
                    <h5 class="metric-value">{{ recommendation.utilizationRate }}%</h5>
                  </div>
                </div>
                <div class="col s12 m4">
                  <div class="metric-card">
                    <p class="metric-label">Avg Wait Time</p>
                    <h5 class="metric-value">{{ recommendation.avgWaitTime }} min</h5>
                  </div>
                </div>
                <div class="col s12 m4">
                  <div class="metric-card">
                    <p class="metric-label">Wait Probability</p>
                    <h5 class="metric-value">{{ recommendation.probWaiting }}%</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Form Card -->
      <div class="row">
        <div class="col s12">
          <div class="card z-depth-2">
            <div class="card-content">
              <span class="card-title">
                <i class="material-icons left">settings</i>
                Configuration
              </span>
              <div class="row">
                <div class="input-field col s12 m6">
                  <i class="material-icons prefix">speed</i>
                  <input
                    id="mu-input"
                    type="number"
                    step="0.01"
                    v-model.number="mu"
                    @input="calculateResults">
                  <label for="mu-input" class="active">Service Rate (μ - customers/min)</label>
                  <span class="helper-text">How many customers can one employee serve per minute</span>
                </div>
                <div class="input-field col s12 m6">
                  <i class="material-icons prefix">people</i>
                  <select
                    id="employee-select"
                    v-model="form.employee"
                    @change="calculateResults"
                    class="browser-default">
                    <option value="" disabled>Select number of employees</option>
                    <option value="1">1 Employee</option>
                    <option value="2">2 Employees</option>
                    <option value="3">3 Employees</option>
                  </select>
                  <label for="employee-select" class="active">Number of Employees</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix">schedule</i>
                  <select
                    id="hour-select"
                    v-model="form.hour"
                    @change="calculateResults"
                    class="browser-default">
                    <option value="" disabled>Select time slot</option>
                    <option value="18:00">18:00 (6 PM)</option>
                    <option value="19:00">19:00 (7 PM)</option>
                    <option value="20:00">20:00 (8 PM)</option>
                  </select>
                  <label for="hour-select" class="active">Time Slot</label>
                </div>
              </div>
              <div class="row center-align">
                <button
                  class="btn-large waves-effect waves-light gradient-bg"
                  @click="calculateResults">
                  <i class="material-icons left">calculate</i>
                  Calculate Metrics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Card -->
      <div class="row" v-if="showResults">
        <div class="col s12">
          <div class="card z-depth-2">
            <div class="card-content">
              <span class="card-title">
                <i class="material-icons left">assessment</i>
                Queue Analysis Results
              </span>
              <div class="row">
                <!-- Customer Arrival Rate -->
                <div class="col s12 m6 l3">
                  <div class="result-card hoverable">
                    <div class="result-icon teal lighten-2">
                      <i class="material-icons">trending_up</i>
                    </div>
                    <p class="result-label">Arrival Rate (λ)</p>
                    <h5 class="result-value">{{ results.lambda }}</h5>
                    <p class="result-unit">customers/min</p>
                    <p class="grey-text text-darken-1">{{ results.salesCount }} customers/hour</p>
                  </div>
                </div>

                <!-- Traffic Intensity -->
                <div class="col s12 m6 l3">
                  <div class="result-card hoverable">
                    <div class="result-icon orange lighten-2">
                      <i class="material-icons">traffic</i>
                    </div>
                    <p class="result-label">Traffic Intensity (ρ)</p>
                    <h5 class="result-value">{{ results.trafficIntensity }}</h5>
                    <p :class="getTrafficChipClass(results.trafficIntensity)" class="chip">
                      {{ getTrafficStatus(results.trafficIntensity) }}
                    </p>
                  </div>
                </div>

                <!-- Probability of Waiting -->
                <div class="col s12 m6 l3">
                  <div class="result-card hoverable">
                    <div class="result-icon blue lighten-2">
                      <i class="material-icons">hourglass_empty</i>
                    </div>
                    <p class="result-label">Wait Probability</p>
                    <h5 class="result-value">{{ results.probWaiting }}%</h5>
                  </div>
                </div>

                <!-- Probability System Empty -->
                <div class="col s12 m6 l3">
                  <div class="result-card hoverable">
                    <div class="result-icon green lighten-2">
                      <i class="material-icons">check_circle</i>
                    </div>
                    <p class="result-label">System Empty</p>
                    <h5 class="result-value">{{ results.probNoUnits }}%</h5>
                  </div>
                </div>

                <!-- Average in Queue -->
                <div class="col s12 m6 l3">
                  <div class="result-card hoverable">
                    <div class="result-icon purple lighten-2">
                      <i class="material-icons">queue</i>
                    </div>
                    <p class="result-label">Avg in Queue</p>
                    <h5 class="result-value">{{ results.avgUnitsOnQueue }}</h5>
                    <p class="result-unit">customers</p>
                  </div>
                </div>

                <!-- Average in System -->
                <div class="col s12 m6 l3">
                  <div class="result-card hoverable">
                    <div class="result-icon indigo lighten-2">
                      <i class="material-icons">store</i>
                    </div>
                    <p class="result-label">Avg in System</p>
                    <h5 class="result-value">{{ results.avgUnitsOnSystem }}</h5>
                    <p class="result-unit">customers</p>
                  </div>
                </div>

                <!-- Wait Time Queue -->
                <div class="col s12 m6 l3">
                  <div class="result-card hoverable">
                    <div class="result-icon red lighten-2">
                      <i class="material-icons">timer</i>
                    </div>
                    <p class="result-label">Wait Time (Queue)</p>
                    <h5 class="result-value">{{ results.avgTimeWaitingOnQueue }}</h5>
                    <p class="result-unit">minutes</p>
                  </div>
                </div>

                <!-- Wait Time Total -->
                <div class="col s12 m6 l3">
                  <div class="result-card hoverable">
                    <div class="result-icon pink lighten-2">
                      <i class="material-icons">av_timer</i>
                    </div>
                    <p class="result-label">Wait Time (Total)</p>
                    <h5 class="result-value">{{ results.avgTimeWaitingOnSystem }}</h5>
                    <p class="result-unit">minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Hours Analysis -->
      <div class="row">
        <div class="col s12">
          <div class="card z-depth-2">
            <div class="card-content">
              <span class="card-title">
                <i class="material-icons left">table_chart</i>
                All Time Slots Analysis
              </span>
              <div class="center-align">
                <button
                  class="btn waves-effect waves-light blue"
                  @click="showAllHours">
                  <i class="material-icons left">visibility</i>
                  View All Hours
                </button>
              </div>

              <div v-if="allHoursData.length > 0" class="table-container">
                <table class="striped highlight responsive-table">
                  <thead>
                    <tr>
                      <th>Time Slot</th>
                      <th>Customers</th>
                      <th>Arrival Rate (λ)</th>
                      <th>Recommended Staff</th>
                      <th>Utilization</th>
                      <th>Avg Wait (min)</th>
                      <th>Wait Probability</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in allHoursData" :key="row.hour">
                      <td><strong>{{ row.hour }}</strong></td>
                      <td>{{ row.salesCount }}</td>
                      <td>{{ row.lambda }}</td>
                      <td>
                        <span class="chip green white-text">
                          <i class="material-icons tiny">person</i>
                          {{ row.recommended }} Employee{{ row.recommended > 1 ? 's' : '' }}
                        </span>
                      </td>
                      <td>
                        <span :class="getUtilizationChipClass(row.utilizationRate)" class="chip">
                          {{ row.utilizationRate }}%
                        </span>
                      </td>
                      <td>{{ row.avgWaitTime }}</td>
                      <td>{{ row.probWaiting }}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales History Management -->
      <div class="row">
        <div class="col s12">
          <div class="card z-depth-2">
            <div class="card-content">
              <span class="card-title">
                <i class="material-icons left">history</i>
                Sales History
              </span>
              <div class="center-align">
                <button
                  class="btn waves-effect waves-light gradient-bg"
                  @click="openAddSaleModal">
                  <i class="material-icons left">add</i>
                  Add New Sale
                </button>
              </div>

              <div class="table-container">
                <table class="striped highlight responsive-table">
                  <thead>
                    <tr>
                      <th>Sale ID</th>
                      <th>Hour</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="sale in salesList" :key="sale.saleId">
                      <td><strong>{{ sale.saleId }}</strong></td>
                      <td>{{ sale.hour }}</td>
                      <td>
                        <button
                          class="btn-small waves-effect waves-light red"
                          @click="deleteSale(sale.saleId)">
                          <i class="material-icons">delete</i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Sale Modal -->
    <div id="addSaleModal" class="modal">
      <div class="modal-content">
        <h4>
          <i class="material-icons left">add_circle</i>
          Add New Sale
        </h4>
        <div class="row">
          <div class="input-field col s12">
            <select v-model="newSaleHour" class="browser-default">
              <option value="" disabled>Select hour for new sale</option>
              <option value="18:00">18:00 (6 PM)</option>
              <option value="19:00">19:00 (7 PM)</option>
              <option value="20:00">20:00 (8 PM)</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-close btn-flat waves-effect">Cancel</button>
        <button
          class="btn waves-effect waves-light gradient-bg"
          @click="addSale">
          <i class="material-icons left">save</i>
          Add Sale
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import salesService from '../services/salesService';

export default {
  data() {
    return {
      mu: 0.30,
      form: {
        hour: '',
        employee: ''
      },
      results: {
        lambda: '',
        salesCount: 0,
        trafficIntensity: '',
        probWaiting: '',
        probNoUnits: '',
        avgUnitsOnQueue: '',
        avgUnitsOnSystem: '',
        avgTimeWaitingOnQueue: '',
        avgTimeWaitingOnSystem: ''
      },
      recommendation: {
        recommended: 0,
        avgWaitTime: 0,
        probWaiting: 0,
        utilizationRate: 0
      },
      allHoursData: [],
      showResults: false,
      showRecommendation: false,
      salesList: [],
      newSaleHour: '',
      modalInstance: null
    };
  },
  methods: {
    calculateResults() {
      if (this.form.hour && this.form.employee && this.mu > 0) {
        const hour = this.form.hour;
        const employees = parseInt(this.form.employee);
        const mu = this.mu;

        const lambda = salesService.getLambda(hour);
        const salesCount = salesService.getSalesByHour(hour).length;
        const trafficIntensity = lambda / (employees * mu);

        this.results = {
          lambda: lambda.toFixed(4),
          salesCount: salesCount,
          trafficIntensity: trafficIntensity.toFixed(3),
          probWaiting: (salesService.getProbabilityOfWaiting(hour, employees, mu) * 100).toFixed(2),
          probNoUnits: (salesService.getProbabilityOfNoUnits(hour, employees, mu) * 100).toFixed(2),
          avgUnitsOnQueue: salesService.getAverageOfUnitsOnQueue(hour, employees, mu).toFixed(3),
          avgUnitsOnSystem: salesService.getAverageOfUnitsOnSystem(hour, employees, mu).toFixed(3),
          avgTimeWaitingOnQueue: salesService.getAverageTimeOfWaitingOnQueue(hour, employees, mu).toFixed(2),
          avgTimeWaitingOnSystem: salesService.getAverageTimeOfWaitingOnSystem(hour, employees, mu).toFixed(2)
        };

        this.recommendation = salesService.getRecommendedEmployees(hour, mu);
        this.showResults = true;
        this.showRecommendation = true;
      }
    },
    showAllHours() {
      this.allHoursData = salesService.getAllHoursAnalysis(this.mu);
    },
    getTrafficChipClass(intensity) {
      const value = parseFloat(intensity);
      if (value < 0.5) return 'green white-text';
      if (value < 0.85) return 'orange white-text';
      return 'red white-text';
    },
    getTrafficStatus(intensity) {
      const value = parseFloat(intensity);
      if (value < 0.5) return 'Underutilized';
      if (value < 0.85) return 'Optimal';
      return 'Overutilized!';
    },
    getUtilizationChipClass(rate) {
      const value = parseFloat(rate);
      if (value < 50) return 'blue white-text';
      if (value < 85) return 'green white-text';
      return 'red white-text';
    },
    loadSalesList() {
      this.salesList = salesService.getSales();
    },
    openAddSaleModal() {
      this.newSaleHour = '';
      if (this.modalInstance) {
        this.modalInstance.open();
      }
    },
    addSale() {
      if (this.newSaleHour) {
        salesService.addSale(this.newSaleHour);
        this.loadSalesList();
        this.calculateResults();
        if (this.modalInstance) {
          this.modalInstance.close();
        }
        if (window.M && window.M.toast) {
          window.M.toast({html: 'Sale added successfully!', classes: 'green'});
        }
      } else {
        if (window.M && window.M.toast) {
          window.M.toast({html: 'Please select an hour', classes: 'red'});
        }
      }
    },
    deleteSale(saleId) {
      if (confirm('Are you sure you want to delete this sale?')) {
        const success = salesService.deleteSale(saleId);
        if (success) {
          this.loadSalesList();
          this.calculateResults();
          if (window.M && window.M.toast) {
            window.M.toast({html: 'Sale deleted successfully!', classes: 'green'});
          }
        } else {
          if (window.M && window.M.toast) {
            window.M.toast({html: 'Failed to delete sale', classes: 'red'});
          }
        }
      }
    }
  },
  mounted() {
    this.form.hour = '18:00';
    this.form.employee = '1';
    this.loadSalesList();
    this.calculateResults();

    // Initialize Materialize components
    if (window.M) {
      window.M.AutoInit();

      // Initialize modal
      const modalElem = document.getElementById('addSaleModal');
      if (modalElem) {
        this.modalInstance = window.M.Modal.init(modalElem, {});
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.foodtruck-app {
  min-height: 100vh;
  background: #f5f5f5;
}

.gradient-bg {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
}

.nav-wrapper {
  padding: 0 20px;
}

.brand-logo {
  font-size: 1.8rem !important;
  font-weight: 600;
}

.main-content {
  margin-top: 30px;
  margin-bottom: 40px;
}

/* Recommendation Card */
.recommendation-card {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  border-radius: 8px;
  margin-bottom: 30px;
}

.recommendation-highlight {
  padding: 20px 0;
}

.big-number {
  font-size: 6rem;
  font-weight: bold;
  line-height: 1;
  margin: 20px 0 10px;
}

.recommendation-text {
  font-size: 1.5rem;
  margin: 10px 0;
  opacity: 0.95;
}

.metrics-grid {
  margin-top: 30px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  margin: 10px 0;
}

.metric-label {
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 10px 0;
}

/* Input Form */
.card-title {
  font-weight: 600 !important;
  font-size: 1.8rem !important;
}

.card-title i {
  vertical-align: middle;
}

.input-field label {
  font-size: 1rem;
}

.helper-text {
  font-size: 0.85rem;
}

select.browser-default {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #9e9e9e;
  border-radius: 4px;
  font-size: 1rem;
}

select.browser-default:focus {
  outline: none;
  border-color: #e74c3c;
}

/* Result Cards */
.result-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  margin: 10px 0;
  border: 2px solid #f0f0f0;
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: #e74c3c;
}

.result-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-icon i {
  font-size: 2rem;
  color: white;
}

.result-label {
  font-size: 0.9rem;
  color: #757575;
  margin: 10px 0 5px;
  font-weight: 500;
}

.result-value {
  font-size: 2.2rem;
  font-weight: bold;
  color: #212121;
  margin: 10px 0;
}

.result-unit {
  font-size: 0.85rem;
  color: #9e9e9e;
  margin: 5px 0;
}

/* Table */
.table-container {
  margin-top: 30px;
  overflow-x: auto;
}

table.striped tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

table thead {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

table thead tr th {
  color: white;
  font-weight: 600;
}

table tbody tr:hover {
  background-color: #e3f2fd;
}

.chip {
  font-weight: 600;
  font-size: 0.9rem;
}

.chip i.tiny {
  font-size: 1rem;
  margin-right: 5px;
}

/* Buttons */
.btn, .btn-large {
  border-radius: 25px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.btn-small {
  border-radius: 20px;
  padding: 0 15px;
}

.btn-small i {
  font-size: 1.2rem;
}

/* Modal */
.modal {
  border-radius: 8px;
  max-width: 500px;
}

.modal h4 {
  color: #e74c3c;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.modal h4 i {
  margin-right: 10px;
}

.modal-footer {
  background-color: #f5f5f5;
}

/* Responsive */
@media only screen and (max-width: 600px) {
  .brand-logo {
    font-size: 1.2rem !important;
  }

  .big-number {
    font-size: 4rem;
  }

  .recommendation-text {
    font-size: 1.2rem;
  }

  .result-value {
    font-size: 1.8rem;
  }
}

@media only screen and (max-width: 992px) {
  .result-card {
    margin-bottom: 20px;
  }
}
</style>
