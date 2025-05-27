<template>
  <!-- Medical History Card -->
  <a-card
    :bordered="false"
    class="header-solid h-full card-medical-history"
    :bodyStyle="{ paddingTop: 0, paddingBottom: '16px' }"
    :headStyle="{ paddingRight: 0 }"
  >
    <template #title>
      <h6 class="font-semibold m-0">Historia médica</h6>
    </template>

    <p class="text-dark">
      Historial medico de  {{ profile.first_name }} {{ profile.last_name }}.
    </p>
    <hr class="my-25" />
    <a-descriptions title="Detalles médicos" :column="1">
      <a-descriptions-item label="Tipo de sangre">
        {{ profile.blood_type }}
      </a-descriptions-item>
      <a-descriptions-item label="Alergias">
        {{ profile.allergies }}
      </a-descriptions-item>
      <a-descriptions-item label="Condiciones Médicas">
        {{ profile.medical_conditions }}
      </a-descriptions-item>
      <a-descriptions-item label="Medicamentos">
        {{ profile.medications }}
      </a-descriptions-item>
      <a-descriptions-item label="Cirugías">
        {{ profile.surgeries }}
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
  <!-- / Medical History Card -->
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
