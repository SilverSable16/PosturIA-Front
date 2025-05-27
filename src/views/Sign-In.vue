<template>
  <div class="sign-in">
    <a-row type="flex" :gutter="[24,24]" justify="space-around" align="middle">

      <!-- Sign In Form Column -->
      <a-col :span="24" :md="12" :lg="{span: 12, offset: 0}" :xl="{span: 6, offset: 2}" class="col-form">
        <h1 class="mb-15">Sign In</h1>
        <h5 class="font-regular text-muted">Enter your email and password to sign in</h5>

        <!-- Sign In Form -->
        <a-form
          id="components-form-demo-normal-login"
          :form="form"
          class="login-form"
          @submit="handleSubmit"
          :hideRequiredMark="true"
        >
          <a-form-item class="mb-10" label="Email" :colon="false">
            <a-input 
              v-decorator="[ 
                'email',
                { rules: [{ required: true, message: 'Please input your email!' }] },
              ]" placeholder="Email" />
          </a-form-item>
          <a-form-item class="mb-5" label="Password" :colon="false">
            <a-input
              v-decorator="[ 
                'password',
                { rules: [{ required: true, message: 'Please input your password!' }] },
              ]" type="password" placeholder="Password" />
          </a-form-item>
          <a-form-item class="mb-10">
            <a-switch v-model="rememberMe" /> Remember Me
          </a-form-item>
          <a-form-item>
            <a-button type="primary" block html-type="submit" class="login-form-button">
              SIGN IN
            </a-button>
          </a-form-item>
        </a-form>
        <!-- / Sign In Form -->

        <p class="font-semibold text-muted">
          Don't have an account? 
          <router-link to="/sign-up" class="font-bold text-dark">Sign Up</router-link>
        </p>
      </a-col>
      <!-- / Sign In Form Column -->

      <!-- Sign In Image Column -->
      <a-col :span="24" :md="12" :lg="12" :xl="12" class="col-img">
        <img src="images/img-signin.png" alt="Sign In">
      </a-col>
      <!-- / Sign In Image Column -->

    </a-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      rememberMe: true,
    };
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
            // Petición POST al endpoint /login enviando email y password
            const response = await axios.post("https://posturaainodejs.onrender.com/login", {
              email: values.email,
              password: values.password
            });

            // Extraer token JWT recibido
            const { token } = response.data;

            // Guardar token en localStorage
            localStorage.setItem("token", token);

            // Redirigir al perfil
            this.$router.push(`/profile`);
          } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed. Please check your credentials.");
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
  body {
    background-color: #ffffff;
  }
</style>
