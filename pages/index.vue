<template>
  <div class="container">
    <header class="text-center mb-8">
      <h1
        class="pointer-events-none whitespace-pre-wrap bg-gradient-to-b bg-clip-text text-center text-6xl font-semibold leading-none text-transparent max-lg:-mt-12 from-blue-200 to-emerald-900/10 sm:text-7xl md:text-10xl lg:text-9xl xl:text-10xl">
        unseen
      </h1>
      <p class="text-muted-foreground text-sm">create E2E encrypted notes and share them.</p>
    </header>

    <div class="max-w-4xl mx-auto space-y-6">
      <AButton type="primary" size="large" @click="navigateTo('/notes/create')">
        Create Note
      </AButton>
    </div>
  </div>
</template>
