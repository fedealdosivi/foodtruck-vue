<template>
  <div class="container">
    <h1 class="app-title">FoodTruck Staffing Calculator</h1>

    <b-card class="recommendation-card mb-4" v-if="showRecommendation">
      <h3 class="recommendation-title">AI Recommendation</h3>
      <div class="recommendation-highlight">
        <div class="big-number">{{ recommendation.recommended }}</div>
        <div class="recommendation-text">Recommended Employees</div>
      </div>
      <div class="metrics-grid">
        <div class="metric-item">
          <div class="metric-label">Utilization Rate</div>
          <div class="metric-value">{{ recommendation.utilizationRate }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Avg Wait Time</div>
          <div class="metric-value">{{ recommendation.avgWaitTime }} min</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Probability of Waiting</div>
          <div class="metric-value">{{ recommendation.probWaiting }}%</div>
        </div>
      </div>
    </b-card>

    <b-card class="input-card">
      <b-form v-if="show">
        <b-row>
          <b-col md="6">
            <b-form-group label="Service Rate (μ - customers/min):" label-for="muInput">
              <b-form-input
                id="muInput"
                type="number"
                step="0.01"
                v-model.number="mu"
                @input="calculateResults"
                placeholder="0.30">
              </b-form-input>
              <small class="text-muted">How many customers can one employee serve per minute</small>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Number of Employees:" label-for="employeeInput">
              <b-form-select
                id="employeeInput"
                :options="employees"
                v-model="form.employee"
                @change="calculateResults">
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group label="Time Slot:" label-for="hourInput">
          <b-form-select
            id="hourInput"
            :options="hours"
            v-model="form.hour"
            @change="calculateResults">
          </b-form-select>
        </b-form-group>

        <b-button variant="primary" @click="calculateResults" block class="mb-3">
          Calculate Metrics
        </b-button>
      </b-form>
    </b-card>

    <b-card class="results-card" v-if="showResults">
      <h3>Queue Analysis Results</h3>
      <div class="results-grid">
        <div class="result-item">
          <div class="result-label">Customer Arrival Rate (λ)</div>
          <div class="result-value">{{ results.lambda }} customers/min</div>
          <small class="text-muted">{{ results.salesCount }} customers in the hour</small>
        </div>

        <div class="result-item">
          <div class="result-label">Traffic Intensity (ρ)</div>
          <div class="result-value">{{ results.trafficIntensity }}</div>
          <div :class="getTrafficClass(results.trafficIntensity)">
            {{ getTrafficStatus(results.trafficIntensity) }}
          </div>
        </div>

        <div class="result-item">
          <div class="result-label">Probability of Waiting</div>
          <div class="result-value">{{ results.probWaiting }}%</div>
        </div>

        <div class="result-item">
          <div class="result-label">Probability System is Empty</div>
          <div class="result-value">{{ results.probNoUnits }}%</div>
        </div>

        <div class="result-item">
          <div class="result-label">Avg Customers in Queue</div>
          <div class="result-value">{{ results.avgUnitsOnQueue }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">Avg Customers in System</div>
          <div class="result-value">{{ results.avgUnitsOnSystem }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">Avg Wait Time (Queue)</div>
          <div class="result-value">{{ results.avgTimeWaitingOnQueue }} min</div>
        </div>

        <div class="result-item">
          <div class="result-label">Avg Wait Time (Total)</div>
          <div class="result-value">{{ results.avgTimeWaitingOnSystem }} min</div>
        </div>
      </div>
    </b-card>

    <b-card class="all-hours-card mt-4">
      <h3>All Time Slots Analysis</h3>
      <b-button variant="info" @click="showAllHours" block>
        View Recommendations for All Hours
      </b-button>

      <div v-if="allHoursData.length > 0" class="mt-3">
        <b-table striped hover :items="allHoursData" :fields="tableFields">
          <template #cell(recommended)="data">
            <b-badge variant="success" class="employee-badge">
              {{ data.value }} Employee{{ data.value > 1 ? 's' : '' }}
            </b-badge>
          </template>
          <template #cell(utilizationRate)="data">
            <span :class="getUtilizationClass(data.value)">
              {{ data.value }}%
            </span>
          </template>
        </b-table>
      </div>
    </b-card>
  </div>
</template>

<script>
import salesService from '../services/salesService';

export default {
  data() {
    return {
      mu: 0.30,
      form: {
        hour: null,
        employee: null
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
      employees: [
        { text: 'Select number of employees', value: null },
        { text: '1 Employee', value: 1 },
        { text: '2 Employees', value: 2 },
        { text: '3 Employees', value: 3 }
      ],
      hours: [
        { text: 'Select time slot', value: null },
        { text: '18:00 (6 PM)', value: '18:00' },
        { text: '19:00 (7 PM)', value: '19:00' },
        { text: '20:00 (8 PM)', value: '20:00' }
      ],
      tableFields: [
        { key: 'hour', label: 'Time Slot' },
        { key: 'salesCount', label: 'Customers' },
        { key: 'lambda', label: 'Arrival Rate (λ)' },
        { key: 'recommended', label: 'Recommended Staff' },
        { key: 'utilizationRate', label: 'Utilization' },
        { key: 'avgWaitTime', label: 'Avg Wait (min)' },
        { key: 'probWaiting', label: 'Wait Probability' }
      ],
      show: true,
      showResults: false,
      showRecommendation: false
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
    getTrafficClass(intensity) {
      const value = parseFloat(intensity);
      if (value < 0.5) return 'text-success font-weight-bold';
      if (value < 0.85) return 'text-warning font-weight-bold';
      return 'text-danger font-weight-bold';
    },
    getTrafficStatus(intensity) {
      const value = parseFloat(intensity);
      if (value < 0.5) return 'Underutilized';
      if (value < 0.85) return 'Optimal';
      return 'Overutilized!';
    },
    getUtilizationClass(rate) {
      const value = parseFloat(rate);
      if (value < 50) return 'text-info';
      if (value < 85) return 'text-success font-weight-bold';
      return 'text-danger font-weight-bold';
    }
  },
  mounted() {
    this.form.hour = '18:00';
    this.form.employee = 1;
    this.calculateResults();
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.app-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: bold;
}

.recommendation-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.recommendation-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.recommendation-highlight {
  text-align: center;
  margin: 30px 0;
}

.big-number {
  font-size: 5rem;
  font-weight: bold;
  line-height: 1;
}

.recommendation-text {
  font-size: 1.3rem;
  margin-top: 10px;
  opacity: 0.95;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.metric-item {
  text-align: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.metric-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: bold;
}

.input-card {
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.results-card {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.result-item {
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.result-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.result-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.result-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
}

.all-hours-card {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.employee-badge {
  font-size: 1rem;
  padding: 8px 12px;
}

h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 600;
}

.text-success {
  color: #28a745 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.text-info {
  color: #17a2b8 !important;
}

.font-weight-bold {
  font-weight: bold;
}

@media (max-width: 768px) {
  .app-title {
    font-size: 1.8rem;
  }

  .big-number {
    font-size: 3.5rem;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>