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
$bd: #334155;
.bdb-1 {
  border-bottom: 1px solid $bd !important;
}
.bdl-1 {
  border-left: 1px solid $bd;
}
</style>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-dark text-white bdb-1">
      <div class="al-c pl-4 pr-4" style="height: 64px">
        <img src="/img/mossy.png" width="40" />
        <img class="ml-2" src="/img/mossy/mossy-text.svg" height="28" />
        <div class="ml-auto h100p bdl-1 pl-8 pr-4 al-c">
          <q-btn size="sm" rounded color="info" style="padding: 4px 6px">
            <img src="/img/icon/ic-coin.png" width="20" />
            <span class="text-white">100</span>
          </q-btn>
          <q-btn class="ml-4" round flat color="primary">
            <img src="/img/icon/ic-bell.svg" width="24" />
          </q-btn>
          <q-avatar class="ml-4" size="36px">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
        </div>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>