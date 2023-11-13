<template>
  <div class="q-pa-md">
    <q-card class="my-card" v-for="i in 5" :key="i">
      <q-parallax
        :src="`https://fastly.jsdelivr.net/npm/@vant/assets/apple-${i}.jpeg`"
        :height="150"
      />

      <q-card-section>
        <div class="text-h6">Our Changing Planet</div>
        <div class="text-subtitle2">by John Doe</div>
      </q-card-section>
    </q-card>
  </div>
</template>