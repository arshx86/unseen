<template>
  <div class="container">
    <header class="text-center mb-8">
      <h1
        class="pointer-events-none whitespace-pre-wrap bg-gradient-to-b bg-clip-text text-center text-6xl font-semibold leading-none text-transparent max-lg:-mt-12 from-blue-200 to-emerald-900/10 sm:text-7xl md:text-10xl lg:text-9xl xl:text-10xl">
        unseen
      </h1>
      <p class="text-muted-foreground text-sm">
        end to end encrypted note sharing service. No one can intercept your notes, even server,
        ISP.
        <br />
      </p>
      <div class="mt-2 text-muted-foreground text-sm items-center jutify-center">
        <code class="cursor-pointer" @click="howItWorks">How it works?</code>
        |
        <code class="cursor-pointer items-center" @click="openSource">
          <Icon name="mdi:github" />
          Open source
        </code>
      </div>
    </header>

    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Expiry</label>
          <ASelect v-model:value="form.expires" size="large" class="w-full">
            <ASelectOption v-for="option in AUTO_DELETE_SUFFIXS" :key="option" :value="option">
              {{ option }}
            </ASelectOption>
          </ASelect>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Share as</label>
          <AInput
            v-model:value="form.author"
            :maxlength="10"
            placeholder="Anonymous"
            size="large"
            class="w-full" />
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <ASwitch v-model:checked="form.destructive" />
        <span class="text-sm">Burn after read</span>
      </div>

      <div>
        <ATextarea
          v-model:value="form.content"
          size="large"
          placeholder="I have secrets..."
          class="w-full"
          :rows="8" />
      </div>

      <div class="flex justify-end">
        <AButton
          type="primary"
          size="large"
          :loading="loading"
          :disabled="form.content.length < MIN_CONTENT_LENGTH"
          block
          @click="createNote">
          Share
        </AButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import axios, { isAxiosError } from "axios";
  import nacl from "tweetnacl";
  import { AUTO_DELETE_SUFFIXS, type AutoDeleteSuffix } from "~/shared/exports";
  import { message } from "ant-design-vue";
  import naclUtil from "tweetnacl-util";

  const router = useRouter();
  const MIN_CONTENT_LENGTH = 1;
  const loading = ref(false);
  const form = ref({
    expires: "never" as AutoDeleteSuffix,
    content: "",
    destructive: false,
    author: "",
    iv: null as string | null,
  });

  const createNote = async () => {
    try {
      loading.value = true;
      // too short
      if (form.value.content.length < MIN_CONTENT_LENGTH) throw new Error("Content is too short");

      // create key
      const key = nacl.randomBytes(32);
      const keyb64 = naclUtil.encodeBase64(key);
      const encryption = encryptContent(form.value.content, key);

      // stores
      form.value.iv = encryption.iv;
      form.value.content = encryption.encryptedContent;

      const { data } = await axios.post("/api/notes", form.value);
      const finalUrl = `${window.location.origin}/notes/${data.id}#${keyb64}`;

      await navigator.clipboard.writeText(finalUrl);
      message.success("Link copied to clipboard", 5 * 1000);

      // reset
      form.value = {
        expires: "never",
        content: "",
        destructive: false,
        author: "",
        iv: null,
      };
    } catch (error: any) {
      const ax = isAxiosError(error) ? error.response?.data?.message : error.message;
      message.error(ax);
    } finally {
      loading.value = false;
    }
  };

  const howItWorks = () => {
    Modal.info({
      title: "E2E Encryption",
      content:
        "Notes are encrypted in your browser before being sent to the server. The decryption key is included in the shared URL to allow recipients to decrypt the note. The unencrypted content and key never touches the server, this means you don't need to trust the server.",
    });
  };

  const openSource = () => {
    window.open("https://github.com/arshx86/unseen", "_blank");
  };
</script>
