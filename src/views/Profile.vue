<template>
  <div>
    <!-- Header Background Image -->
    <div class="profile-nav-bg" style="background-image: url('images/bg-profile.jpg')"></div>

    <!-- Mostrar JSON de profile para depuración -->
    <pre>{{ profile }}</pre>

    <!-- User Profile Card -->
    <a-card
      :bordered="false"
      class="card-profile-head"
      :bodyStyle="{ padding: 0 }"
      :headStyle="{ padding: '12px 24px' }"
    >
      <template #title>
        <a-row type="flex" align="middle">
          <a-col :span="24" :md="12" class="col-info">
            <!-- Avatar: styled for custom size -->
            <a-avatar
              shape="square"
              :src="profile.url_imagen || 'images/face-1.jpg'"
              icon="user"
              style="width: 74px; height: 74px; line-height: 74px;"
            />
            <div class="avatar-info" style="display: inline-block; margin-left: 16px; vertical-align: middle;">
              <h4 class="font-semibold m-0">{{ profile.first_name }} {{ profile.last_name }}</h4>
              <p>{{ profile.email }}</p>
            </div>
          </a-col>
        </a-row>
      </template>
      <template #extra>
        <a-button type="link" @click="openEditModal">Edit Profile</a-button>
      </template>
    </a-card>

    <!-- Edit Profile Modal -->
    <a-modal
      title="Edit Profile"
      :visible="editing"
      @ok="submitEdit"
      @cancel="editing = false"
      :okText="'Save'"
      :cancelText="'Cancel'"
    >
      <a-form layout="vertical">
        <!-- Image Upload -->
        <a-form-item label="Profile Image">
          <div style="text-align:center; margin-bottom:16px;">
            <a-avatar
              shape="square"
              :src="editImagePreview || editForm.url_imagen || 'images/face-1.jpg'"
              icon="user"
              style="width: 100px; height: 100px; line-height: 100px;"
            />
          </div>
          <input
            type="file"
            accept="image/png, image/jpeg"
            @change="handleImageChange"
          />
          <p class="text-muted" style="font-size:12px; text-align:center;">
            Imagen (máx. 5MB, .png o .jpg)
          </p>
        </a-form-item>
        <!-- Basic Info -->
        <a-form-item
          label="First Name"
          :rules="[{ required: true, message: 'Please input your first name!' }]"
        >
          <a-input v-model="editForm.first_name" />
        </a-form-item>
        <a-form-item
          label="Last Name"
          :rules="[{ required: true, message: 'Please input your last name!' }]"
        >
          <a-input v-model="editForm.last_name" />
        </a-form-item>
        <a-form-item
          label="Email"
          :rules="[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'The input is not valid E-mail!' }
          ]"
        >
          <a-input v-model="editForm.email" />
        </a-form-item>
        <a-form-item label="Phone Number">
          <a-input v-model="editForm.phone_number" />
        </a-form-item>
        <a-form-item label="Date of Birth (YYYY-MM-DD)">
          <a-input v-model="editForm.date_of_birth" />
        </a-form-item>
        <!-- Medical Fields -->
        <a-form-item label="Blood Type">
          <a-input v-model="editForm.blood_type" />
        </a-form-item>
        <a-form-item label="Allergies">
          <a-textarea v-model="editForm.allergies" auto-size />
        </a-form-item>
        <a-form-item label="Medical Conditions">
          <a-textarea v-model="editForm.medical_conditions" auto-size />
        </a-form-item>
        <a-form-item label="Medications">
          <a-textarea v-model="editForm.medications" auto-size />
        </a-form-item>
        <a-form-item label="Surgeries">
          <a-textarea v-model="editForm.surgeries" auto-size />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Profile and Medical Cards -->
    <a-row type="flex" :gutter="24">
      <a-col :span="24" :md="12" class="mb-24">
        <CardProfileInformation :profile="profile" />
      </a-col>
      <a-col :span="24" :md="12" class="mb-24">
        <CardMedicalHistory :profile="profile" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import axios from "axios";
import { message } from "ant-design-vue";
import CardProfileInformation from "../components/Cards/CardProfileInformation";
import CardMedicalHistory from "../components/Cards/CardMedicalHistory";

export default {
  components: {
    CardProfileInformation,
    CardMedicalHistory,
  },
  data() {
    return {
      profile: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        blood_type: "",
        allergies: "",
        medical_conditions: "",
        medications: "",
        surgeries: "",
        url_imagen: "",
      },
      editing: false,
      editForm: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        blood_type: "",
        allergies: "",
        medical_conditions: "",
        medications: "",
        surgeries: "",
        url_imagen: "",
      },
      editImagePreview: "",
    };
  },
  watch: {
    profile(newVal) {
      console.log("Perfil actualizado:", newVal);
    },
  },
  mounted() {
    this.fetchProfileData();
  },
  methods: {
    openEditModal() {
      // Preload editForm from profile and reset preview
      this.editForm = { ...this.profile };
      // Convert display date back to YYYY-MM-DD
      if (this.profile.date_of_birth && this.profile.date_of_birth.includes('/')) {
        const [d, m, y] = this.profile.date_of_birth.split('/');
        this.editForm.date_of_birth = `${y}-${m}-${d}`;
      }
      this.editImagePreview = '';
      this.editing = true;
    },
    handleImageChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        message.error('El archivo excede 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => { this.editImagePreview = reader.result; };
      reader.readAsDataURL(file);
    },
    async fetchProfileData() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) { this.$router.push('/sign-in'); return; }
        const response = await axios.get(`https://posturaainodejs.onrender.com/users/${userId}`);
        const data = response.data;
        this.profile = {
          first_name: data.first_name || "N/A",
          last_name: data.last_name || "N/A",
          email: data.email || "N/A",
          phone_number: data.phone_number || "N/A",
          date_of_birth: data.date_of_birth
            ? new Date(data.date_of_birth).toLocaleDateString()
            : "N/A",
          blood_type: data.blood_type || "N/A",
          allergies: data.allergies || "N/A",
          medical_conditions: data.medical_conditions || "N/A",
          medications: data.medications || "N/A",
          surgeries: data.surgeries || "N/A",
          url_imagen: data.url_imagen || "",
        };
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    },
    async submitEdit() {
      try {
        const userId = localStorage.getItem("userId");
        const payload = { ...this.editForm };
        if (this.editImagePreview) payload.url_imagen = this.editImagePreview;
        await axios.put(`https://posturaainodejs.onrender.com/users/${userId}`, payload);
        message.success("Perfil actualizado exitosamente");
        this.editing = false;
        this.fetchProfileData();
      } catch (error) {
        console.error(error);
        message.error("Error al actualizar el perfil");
      }
    },
  },
};
</script>

<style lang="scss">
</style>
