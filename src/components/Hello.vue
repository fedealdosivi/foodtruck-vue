<template>
  <div>
    <b-card class="text-center">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="exampleInputGroup3"
                      label="How many employees?:"
                      label-for="exampleInput3">
          <b-form-select id="exampleInput3"
                        :options="employees"
                        required
                        v-model="form.employee">
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
        employee: null
      },
      employees: [
        { text: 'Select One', value: null },
        '1', '2', '3'
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
      /* Trick to reset/clear native browser form validation state */
      this.show = false;
      this.$nextTick(() => { this.show = true });
    }
  }
}
</script>