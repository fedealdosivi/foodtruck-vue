<template>
  <div>
    <b-card class="text-center">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
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
      </b-form>
    </b-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        hour: null,
        employee: null
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
  methods: {
    onSubmit (evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    },
    onReset (evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.form.employee = null;
      this.form.hour = null;
      /* Trick to reset/clear native browser form validation state */
      this.show = false;
      this.$nextTick(() => { this.show = true });
    }
  }
}
</script>