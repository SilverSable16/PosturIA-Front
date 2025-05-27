<template>
  <div class="sign-up-container">
    <!-- Botón Volver arriba derecha -->
    <router-link to="/Inicio" class="btn-volver">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Volver</span>
    </router-link>

    <!-- Sign Up Image And Headings -->
    <div class="sign-up-header" style="background-image: url('images/bg-signup.jpg')">
      <div class="content">
        <h1 class="mb-5">Crear cuenta</h1>
        <p class="text-lg">Únete a este increíble proyecto que, con ayuda de la IA, te ayudará a llevar una vida saludable.</p>
      </div>
    </div>
    <!-- / Sign Up Image And Headings -->

    <!-- Sign Up Form -->
    <a-card :bordered="false" class="card-signup header-solid h-full" :bodyStyle="{ paddingTop: 0 }">
      <template #title>
        <h5 class="font-semibold text-center">Registrarme</h5>
      </template>
      <div class="sign-up-gateways">
       
      </div>
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
            placeholder="Nombre"
          />
        </a-form-item>

        <!-- Last Name -->
        <a-form-item class="mb-10">
          <a-input
            v-decorator="[ 
              'last_name', 
              { rules: [{ required: true, message: 'Please input your last name!' }] } 
            ]"
            placeholder="Apellido"
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
            placeholder="Contraseña"
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
            placeholder="Cumpleaños"
          />
        </a-form-item>

        <!-- Phone Number -->
        <a-form-item class="mb-10">
          <a-input
            v-decorator="[ 
              'phone_number', 
              { rules: [{ required: true, message: 'Please input your phone number!' }] } 
            ]"
            placeholder="Celular"
          />
        </a-form-item>

        <!-- Submit Button -->
        <a-form-item>
          <a-button type="primary" block html-type="submit" class="login-form-button">
            CREAR USUARIO
          </a-button>
        </a-form-item>
      </a-form>

      <p class="font-semibold text-muted text-center">
        Tienes una cuenta?
        <router-link to="/sign-in" class="font-bold text-dark">Iniciar Sesion</router-link>
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
.sign-up-container {
  position: relative;
}

.btn-volver {
  position: absolute;
  top: 20px;
  right: 20px;

  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: rgb(0, 0, 0);
  padding: 0.6rem 1.2rem;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-volver:hover {
  background: rgb(177, 177, 181);
  color: white;
}

.btn-volver svg {
  fill: none;
  stroke: currentColor;
}
</style>
