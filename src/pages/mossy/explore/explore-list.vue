<style>
.q-checkbox--dense .q-checkbox__label {
  padding-left: 3px;
}
</style>

<template>
  <div class="mb-6 d-center">
    <div class="bg-info pa-2 bdrs-100">
      <q-btn-toggle
        class="rounded"
        v-model="type"
        unelevated
        toggle-color="primary"
        :options="[
          { label: 'For you', value: 'foryou' },
          { label: 'Popular', value: 'pop' },
          { label: 'Latest', value: 'latest' },
        ]"
      />
    </div>
  </div>

  <div class="row q-col-gutter-md">
    <div class="col-6 col-sm-4 col-md-3" v-for="(it, i) in list" :key="i">
      <div class="d-flex bg-black pa-3 bdrs-10 pos-r">
        <div class="flex-3 shrink-1 mr-2 h-flex">
          <div class="fz-15 fw-b line-2 wb-all mb-2">{{ it.title }}</div>
          <div class="al-c mt-auto">
            <q-checkbox
              v-model="it.star"
              dense
              checked-icon="star"
              unchecked-icon="star_border"
              indeterminate-icon="star_border"
              size="lg"
              :label="it.starNum"
              class="fz-12"
              :class="it.star ? 'color-1' : 'white-8'"
            />
          </div>
        </div>
        <div class="flex-2">
          <q-img :src="it.img" class="w100p" :ratio="1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkMap: {},
      type: "foryou",
      list: [
        {
          title: "The Progressive JavaScript Framework. Approachable. Versatile. Performant.",
          img: "https://qs3.4everland.store/logos/vue.svg",
          star: false,
          starNum: 120,
        },
        {
          title: "Preact is a fast 3kB alternative to React with the same modern API.",
          img: "https://qs3.4everland.store/logos/preact.svg",
          star: false,
          starNum: 49,
        },
        {
          title: "Deploy React apps on the platform its community loves.",
          img: "https://qs3.4everland.store/logos/storybook.svg",
          star: false,
          starNum: 32,
        },
        {
          title:
            "Sapper is a framework for building high-performance universal web apps with Svelte.",
          img: "https://qs3.4everland.store/logos/svelte.svg",
          star: false,
          starNum: 45,
        },
        {
          title: "Create React App allows you to get going with React in no time.",
          img: "https://qs3.4everland.store/logos/react.svg",
          star: false,
          starNum: 89,
        },
      ],
    };
  },
};
</script>