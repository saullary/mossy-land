<style lang="scss">
body.body--dark {
  background-image: url(/img/mossy/bg-top-1.png);
  background-position: 100% 0;
  background-repeat: no-repeat;
  background-size: contain;
}
.main-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}
.bg-active {
  background: #0000006e;
  color: #fff;
}
</style>

<template>
  <div class="pa-2"></div>
  <div class="pos-s z-100 top-0">
    <div class="main-wrap">
      <div class="bdrs-100 al-c bg-primary">
        <a href="./explore" class="al-c q-py-sm">
          <img src="/img/moss.svg" :height="asMobile ? 24 : 28" class="ml-5" />
          <img src="/img/mossy/mossyland.svg" :height="asMobile ? 22 : 28" class="ml-2" />
        </a>
        <div class="ml-5">
          <q-btn-dropdown
            v-if="asMobile"
            color="primary"
            rounded
            dense
            unelevated
            :label="menus.find((it) => it.path == path).label"
          >
            <q-list>
              <q-item v-for="it in menus" :key="it.path" clickable v-close-popup :to="it.path">
                <q-item-section>
                  <q-item-label>{{ it.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <template v-else>
            <q-btn
              v-for="it in menus"
              :key="it.path"
              rounded
              flat
              :class="{
                'bg-active': it.path == path,
              }"
              :to="it.path"
              >{{ it.label }}</q-btn
            >
          </template>
        </div>
      </div>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
import { useQuasar } from "quasar";

export default {
  computed: {
    path() {
      return this.$route.path;
    },
    asMobile() {
      return this.screen.width < 690;
    },
  },
  data() {
    const { screen } = useQuasar();
    return {
      screen,
      menus: [
        {
          path: "/moments",
          label: "Moments",
        },
        {
          path: "/",
          label: "Explore",
        },
        {
          path: "/collected",
          label: "Collected",
        },
      ],
    };
  },
};
</script>