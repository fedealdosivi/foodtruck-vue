<template>
  <div>
  <h1>FoodTruck application</h1>
    <b-card class="text-center">
      <b-form v-if="show">
        <b-form-group id="exampleInputGroup3"
                      label="How many employees ?:"
                      label-for="exampleInput3">
          <b-form-select id="exampleInput3"
                        :options="employees"
                        required
                        v-model="form.employee">
          </b-form-select>
        </b-form-group>
        <b-form-group id="exampleInputGroup3"
                      label="At what time ?:"
                      label-for="exampleInput3">
          <b-form-select id="exampleInput3"
                        :options="hours"
                        required
                        v-model="form.hour">
          </b-form-select>
        </b-form-group>
        <div>
           <h4 v-if="results.lambda != ''">lambda: {{ results.lambda }}</h4>
           <h4 v-if="results.probWaiting != ''">Probability of waiting Ψ: {{ results.probWaiting }}</h4>
           <h4 v-if="results.probNoUnits != ''">Probability of No Units: {{ results.probNoUnits }}</h4>
           <h4 v-if="results.avgUnitsOnQueue != ''">Average of Units on Queue: {{ results.avgUnitsOnQueue }}</h4>
           <h4 v-if="results.avgUnitsOnSystem != ''">Average of Units on System: {{ results.avgUnitsOnSystem }}</h4>
           <h4 v-if="results.avgTimeWaitingOnQueue != ''">Average of Time waiting on Queue: {{ results.avgTimeWaitingOnQueue }}</h4>
           <h4 v-if="results.avgTimeWaitingOnSystem != ''">Average of Time waiting on System: {{ results.avgTimeWaitingOnSystem }}</h4>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import salesService from '../services/salesService';
export default {
  data () {
    return {
      mu: 0.30,
      form: {
        hour: '',
        employee: 1,
        lambda: ''
      },
      results: {
        lambda: '',
        probWaiting: '',
        probNoUnits: '',
        avgUnitsOnQueue: '',
        avgUnitsOnSystem: '',
        avgTimeWaitingOnQueue: '',
        avgTimeWaitingOnSystem: ''
      },
      employees: [
        { text: 'Select the number of employees', value: null },
        '1', '2', '3'
      ],
      hours: [
        { text: 'Select hour', value: null },
        '18:00', '19:00', '20:00'
      ],
      show: true
    }
  },
  computed:{
    updateLambda(){
      if(this.form.hour != null && this.form.hour != ''){
        this.results.lambda = salesService.getLambda(this.form.hour);
      }
    },
    updateProbWaiting(){
      if(this.form.hour != null && this.form.hour != '' && this.form.employees != ''){
        this.results.probWaiting = salesService.getProbabilityOfWaiting(this.form.hour, this.form.employees, this.mu);
      }
    },
    updateProbOfNoUnits(){
      if(this.form.hour != null && this.form.hour != '' && this.form.employees != ''){
        this.results.probNoUnits = salesService.getProbabilityOfNoUnits(this.form.hour, this.form.employees, this.mu);
      }
    },
    updateAvgOfUnitsOnQueue(){
      if(this.form.hour != null && this.form.hour != '' && this.form.employees != ''){
        this.results.avgUnitsOnQueue = salesService.getAverageOfUnitsOnQueue(this.form.hour, this.form.employees, this.mu);
      }
    },
    updateAvgUnitsOnSystem(){
      if(this.form.hour != null && this.form.hour != '' && this.form.employees != ''){
        this.results.avgUnitsOnSystem = salesService.getAverageOfUnitsOnSystem(this.form.hour, this.form.employees, this.mu);
      }
    },
    updateAvgTimeWaitingOnQueue(){
      if(this.form.hour != null && this.form.hour != '' && this.form.employees != ''){
        this.results.avgTimeWaitingOnQueue = salesService.getAverageTimeOfWaitingOnQueue(this.form.hour, this.form.employees, this.mu);
      }
    },
    updateAvgTimeWaitingOnSystem(){
      if(this.form.hour != null && this.form.hour != '' && this.form.employees != ''){
        this.results.avgTimeWaitingOnSystem = salesService.getAverageTimeOfWaitingOnSystem(this.form.hour, this.form.employees, this.mu);
      }
    }
  },
  methods: {

  }
}
</script>