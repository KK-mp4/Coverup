<script setup lang="ts">
const {public:{base}} = useRuntimeConfig()
useHead({
  link: [
    {
      rel: "icon",
      href: `${base}favicon.ico`,
      type: "image/x-icon",
      id: "favicon"
    }
  ],
  htmlAttrs: {
      lang: 'en'
    },
  meta: [
    { name: 'description', content: 'Author: Fart scent, camouflage cosmetics finder for Team Fortress 2' }
  ],
});
</script>

<template>
    <div class="h-screen">
      <link rel="preload" href="/Coverup/tf2build.ttf" as="font" type="font/woff2" />
        <slot />
    </div>
</template>

<style>
body {
    margin: 0;
    background: linear-gradient(0deg, #312E29, #393631);
    font-size: 16px;
    color: #ECE3CB;
    font-family: TF2 Build;
}

@font-face {
  font-family: 'TF2 Build';
  src: url('/tf2build.ttf');
}
</style>