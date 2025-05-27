<!-- filepath: c:\Users\aponc\OneDrive\Documentos\Proyecto ia\src\components\Cards\CardProfileInformation.vue -->
<template>
  <!-- Profile Information Card -->
  <a-card
    :bordered="false"
    class="header-solid h-full card-profile-information"
    :bodyStyle="{ paddingTop: 0, paddingBottom: '16px' }"
    :headStyle="{ paddingRight: 0 }"
  >
    <template #title>
      <h6 class="font-semibold m-0">Información del perfil</h6>
    </template>
    
    <p class="text-dark">
      Hola, soy {{ profile.first_name }} {{ profile.last_name }}, nacido en
      {{ profile.date_of_birth }}.
    </p>
    <hr class="my-25" />
    <a-descriptions title="Detalles del perfil" :column="1">
      <a-descriptions-item label="Nombre completo">
        {{ profile.first_name }} {{ profile.last_name }}
      </a-descriptions-item>
      <a-descriptions-item label="Teléfono">
        {{ profile.phone_number }}
      </a-descriptions-item>
      <a-descriptions-item label="Email">
        {{ profile.email }}
      </a-descriptions-item>
      <a-descriptions-item label="Cumpleaños">
        {{ profile.date_of_birth }}
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
  <!-- / Profile Information Card -->
</template>

<script>
export default {
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },
};
</script>
