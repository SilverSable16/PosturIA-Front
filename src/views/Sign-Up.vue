<template>
  <div>
    <!-- Sign Up Image And Headings -->
    <div class="sign-up-header" style="background-image: url('images/bg-signup.jpg')">
      <div class="content">
        <h1 class="mb-5">Sign Up</h1>
        <p class="text-lg">Use these awesome forms to login or create new account in your project for free.</p>
      </div>
    </div>
    <!-- / Sign Up Image And Headings -->

    <!-- Sign Up Form -->
    <a-card :bordered="false" class="card-signup header-solid h-full" :bodyStyle="{ paddingTop: 0 }">
      <template #title>
        <h5 class="font-semibold text-center">Register With</h5>
      </template>
      <div class="sign-up-gateways">
        <a-button>
          <img src="images/logos/logos-facebook.svg" alt=""/>
        </a-button>
        <a-button>
          <img src="images/logos/logo-apple.svg" alt=""/>
        </a-button>
        <a-button>
          <img src="images/logos/Google__G__Logo.svg.png" alt=""/>
        </a-button>
      </div>
      <p class="text-center my-25 font-semibold text-muted">Or</p>
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <!-- First Name -->
        <a-form-item class="mb-10">
          <a-input
            v-decorator="[ 
              'first_name', 
              { rules: [{ required: true, message: 'Please input your first name!' }] } 
            ]"
            placeholder="First Name"
          />
        </a-form-item>

        <!-- Last Name -->
        <a-form-item class="mb-10">
          <a-input
            v-decorator="[ 
              'last_name', 
              { rules: [{ required: true, message: 'Please input your last name!' }] } 
            ]"
            placeholder="Last Name"
          />
        </a-form-item>

        <!-- Email -->
        <a-form-item class="mb-10">
          <a-input
            v-decorator="[ 
              'email', 
              { rules: [{ required: true, message: 'Please input your email!' }] } 
            ]"
            placeholder="Email"
          />
        </a-form-item>

        <!-- Password -->
        <a-form-item class="mb-5">
          <a-input
            v-decorator="[ 
              'password', 
              { rules: [{ required: true, message: 'Please input your Password!' }] } 
            ]"
            type="password"
            placeholder="Password"
          />
        </a-form-item>

        <!-- Date of Birth -->
        <a-form-item class="mb-10">
          <a-input
            v-decorator="[ 
              'date_of_birth', 
              { rules: [{ required: true, message: 'Please input your date of birth!' }] } 
            ]"
            type="date"
            placeholder="Date of Birth"
          />
        </a-form-item>

        <!-- Phone Number -->
        <a-form-item class="mb-10">
          <a-input
            v-decorator="[ 
              'phone_number', 
              { rules: [{ required: true, message: 'Please input your phone number!' }] } 
            ]"
            placeholder="Phone Number"
          />
        </a-form-item>

        <!-- Terms and Conditions -->
        <a-form-item class="mb-10">
          <a-checkbox
            v-decorator="[ 
              'remember', 
              { 
                valuePropName: 'checked', 
                initialValue: true 
              } 
            ]"
          >
            I agree to the <a href="#" class="font-bold text-dark">Terms and Conditions</a>
          </a-checkbox>
        </a-form-item>

        <!-- Submit Button -->
        <a-form-item>
          <a-button type="primary" block html-type="submit" class="login-form-button">
            SIGN UP
          </a-button>
        </a-form-item>
      </a-form>

      <p class="font-semibold text-muted text-center">
        Already have an account?
        <router-link to="/sign-in" class="font-bold text-dark">Sign In</router-link>
      </p>
    </a-card>
    <!-- / Sign Up Form -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {};
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'normal_login' });
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          try {
            // New user data to be sent to the backend
            const payload = {
              email: values.email,
              password: values.password,
              first_name: values.first_name,
              last_name: values.last_name,
              date_of_birth: values.date_of_birth,
              phone_number: values.phone_number
            };

            // Send POST request to register the new user
            await axios.post('https://posturaainodejs.onrender.com/users', payload);

            alert("User registered successfully!");
            this.$router.push('/sign-in');
          } catch (error) {
            console.error("Registration error:", error.response?.data || error.message);
            alert("Something went wrong during registration.");
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
</style>
