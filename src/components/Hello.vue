<template>
  <div>
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
        <div v-if="lambda != null">
          {{ lambda }}
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
      form: {
        hour: null,
        employee: null,
        lambda: null
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
    updateLambda(hour){
        if(hour != null){
          this.lambda = salesService.getLambda(hour);
        }
    }
  },
  methods: {

  }
}
</script>