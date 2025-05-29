<template>
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <AEmpty v-if="error" description="Invalid note ID or key" />

      <div v-else-if="pending" class="flex justify-center items-center min-h-[50vh]">
        <ASpin size="large" />
      </div>

      <div v-if="note">
        <header class="text-center mb-8">
          <h1
            class="pointer-events-none whitespace-pre-wrap bg-gradient-to-b bg-clip-text text-center text-6xl font-semibold leading-none text-transparent max-lg:-mt-12 from-blue-200 to-emerald-900/10 sm:text-7xl md:text-10xl lg:text-9xl xl:text-10xl">
            unseen
          </h1>
          <p class="text-muted-foreground text-sm">
            shared at
            <code>
              {{ new Date(note.createdAt).toLocaleString() }}
            </code>
            by
            <code>{{ note.author }}</code>
          </p>
        </header>

        <AAlert v-if="note.expiresAt || !note.destructive" type="info">
          <template #description>
            This note will be deleted at {{ new Date(note.expiresAt).toLocaleString() }}
          </template>
        </AAlert>

        <!-- al -->
        <ATextarea v-model:value="decryptedContent" readonly :rows="10" class="w-full mt-4" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "#app";
  import axios from "axios";
  import naclUtil from "tweetnacl-util";
  import { decryptContent } from "~/utils/kripto";
  import type { NoteDOM } from "~/shared/exports";
  import { AAlert } from "#components";

  export default {
    data() {
      return {
        error: null as string | null,
        pending: true,
        note: null as NoteDOM | null,
        decryptedContent: "",
      };
    },
    mounted() {
      const id = this.$route.params.id as string;
      const key = (import.meta.client ? window.location.hash.slice(1) : "") as string;

      if (!id || !key) {
        this.error = "Invalid key";
        return;
      }

      this.fetchNote(id, key);
    },
    methods: {
      async fetchNote(id: string, key: string) {
        try {
          const { data } = await axios.get<NoteDOM>(`/api/notes/${id}`);
          this.note = data;

          const bufferKey = naclUtil.decodeBase64(key);
          const decrypted = decryptContent(
            {
              encryptedContent: data.content,
              iv: data.iv,
            },
            bufferKey
          );
          this.decryptedContent = decrypted;
        } catch (err: any) {
          const isDecryptionError = err.cause === "decryption_error";
          this.error = isDecryptionError ? "Invalid decryption key" : err.response.data.message;
        } finally {
          this.pending = false;
        }
      },
    },
  };
</script>
