<template>
  <!-- Medical History Card -->
  <a-card
    :bordered="false"
    class="header-solid h-full card-medical-history"
    :bodyStyle="{ paddingTop: 0, paddingBottom: '16px' }"
    :headStyle="{ paddingRight: 0 }"
  >
    <template #title>
      <h6 class="font-semibold m-0">Medical History</h6>
    </template>
    <a-button type="link" slot="extra">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="fill-muted"
          d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
          fill="#111827"
        />
        <path
          class="fill-muted"
          d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
          fill="#111827"
        />
      </svg>
    </a-button>
    <p class="text-dark">
      Medical History of {{ profile.first_name }} {{ profile.last_name }}.
    </p>
    <hr class="my-25" />
    <a-descriptions title="Medical Details" :column="1">
      <a-descriptions-item label="Blood Type">
        {{ profile.blood_type }}
      </a-descriptions-item>
      <a-descriptions-item label="Allergies">
        {{ profile.allergies }}
      </a-descriptions-item>
      <a-descriptions-item label="Medical Conditions">
        {{ profile.medical_conditions }}
      </a-descriptions-item>
      <a-descriptions-item label="Medications">
        {{ profile.medications }}
      </a-descriptions-item>
      <a-descriptions-item label="Surgeries">
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
