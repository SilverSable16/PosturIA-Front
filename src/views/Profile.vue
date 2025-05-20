<template>
  <div>
    <!-- Header Background Image -->
    <div class="profile-nav-bg" style="background-image: url('images/bg-profile.jpg')"></div>

    <!-- User Profile Card -->
    <a-card :bordered="false" class="card-profile-head" :bodyStyle="{ padding: 0 }">
      <template #title>
        <a-row type="flex" align="middle">
          <a-col :span="24" :md="12" class="col-info">
            <a-avatar :size="74" shape="square" src="images/face-1.jpg" />
            <div class="avatar-info">
              <h4 class="font-semibold m-0">{{ profile.first_name }} {{ profile.last_name }}</h4>
              <p>{{ profile.email }}</p>
            </div>
          </a-col>
        </a-row>
      </template>
    </a-card>

    <a-row type="flex" :gutter="24">
      <!-- Profile Information Column -->
      <a-col :span="24" :md="12" class="mb-24">
        <CardProfileInformation :profile="profile" />
      </a-col>

      <!-- Medical History Column -->
      <a-col :span="24" :md="12" class="mb-24">
        <!-- Include the Medical History Card -->
        <CardMedicalHistory :profile="profile" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import axios from "axios";
import CardProfileInformation from "../components/Cards/CardProfileInformation";
import CardMedicalHistory from "../components/Cards/CardMedicalHistory";  // Import the Medical History Card

export default {
  components: {
    CardProfileInformation,
    CardMedicalHistory,  // Register the Medical History Card component
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
      },
    };
  },
  mounted() {
    this.fetchProfileData();
  },
  methods: {
    async fetchProfileData() {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          this.$router.push('/sign-in');
          return;
        }

        const response = await axios.get(`https://posturaainodejs.onrender.com/users/${userId}`);
        this.profile = {
          first_name: response.data.first_name || "N/A",
          last_name: response.data.last_name || "N/A",
          email: response.data.email || "N/A",
          phone_number: response.data.phone_number || "N/A",
          date_of_birth: response.data.date_of_birth
            ? new Date(response.data.date_of_birth).toLocaleDateString()
            : "N/A",
          blood_type: response.data.blood_type || "N/A",
          allergies: response.data.allergies || "N/A",
          medical_conditions: response.data.medical_conditions || "N/A",
          medications: response.data.medications || "N/A",
          surgeries: response.data.surgeries || "N/A",
        };
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    },
  },
};
</script>

<style lang="scss">
</style>
