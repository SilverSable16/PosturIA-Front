<template>
  <div class="sign-in">
    <!-- Botón Volver arriba derecha -->
    <router-link to="/Inicio" class="btn-volver">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Volver</span>
    </router-link>

    <a-row type="flex" :gutter="[24,24]" justify="space-around" align="middle">

      <!-- Sign In Form Column -->
      <a-col :span="24" :md="12" :lg="{span: 12, offset: 0}" :xl="{span: 6, offset: 2}" class="col-form">
        <h1 class="mb-15">INICIO DE SESIÓN</h1>
        <h5 class="font-regular text-muted">Ingresa tu correo electrónico y contraseña para iniciar sesión</h5>

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
          <a-form-item class="mb-5" label="Contraseña" :colon="false">
            <a-input
              v-decorator="[ 
                'password',
                { rules: [{ required: true, message: 'Please input your password!' }] },
              ]" type="password" placeholder="Contraseña" />
          </a-form-item>
          <a-form-item class="mb-10">
            <a-switch v-model="rememberMe" /> Recordarme
          </a-form-item>
          <a-form-item>
            <a-button type="primary" block html-type="submit" class="login-form-button">
              INICIAR SESIÓN
            </a-button>
          </a-form-item>
        </a-form>
        <!-- / Sign In Form -->

        <p class="font-semibold text-muted">
          No tienes una cuenta? 
          <router-link to="/sign-up" class="font-bold text-dark">Registrate</router-link>
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
import { message } from "ant-design-vue";

export default {
  data() {
    return {
      rememberMe: true,
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          try {
            const response = await axios.get(
              "https://posturaainodejs.onrender.com/users"
            );

            const user = response.data.find(
              (u) => u.email === values.email && u.password === values.password
            );

            if (user) {
              localStorage.setItem("userId", user.id);
              message.success("Inicio de sesión exitoso");
              this.$router.push(`/profile`);
            } else {
              message.error("Error en el inicio de sesión. Verifique sus credenciales.");
            }
          } catch (error) {
            console.error("Error during login:", error);
            message.error("Ocurrió un error. Intente nuevamente.");
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

.btn-volver {
  position: fixed;
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
  z-index: 1000;
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
