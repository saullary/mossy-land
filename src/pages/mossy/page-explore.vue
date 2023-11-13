<style>
.bg-top {
  background: url(/img/mossy/bg-planet.png) 66% 50% no-repeat;
  background-size: 230px;
}
.m-search {
  width: 350px;
  padding: 10px 12px;
  padding-left: 50px;
  font-size: 15px;
}
</style>

<script setup>
import ExploreList from "./explore/explore-list.vue";
</script>

<template>
  <div class="ta-c bg-top pt-9 pb-9">
    <div class="">
      <div class="color-1 fz-30 fw-b">Welcome to Mossyland</div>
      <!-- <div>Enter</div> -->
      <div class="pos-r mt-5 d-ib">
        <img src="/img/mossy/ic-search.svg" width="32" class="y-center" style="left: 8px" />
        <input class="bdrs-100 m-search" type="text" placeholder="Enter stone keywords" />
      </div>
    </div>
  </div>
  <div class="main-wrap">
    <ExploreList></ExploreList>
  </div>
</template>