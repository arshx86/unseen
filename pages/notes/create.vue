<template>
  <div class="container">
    <header class="text-center mb-8">
      <h1
        class="pointer-events-none whitespace-pre-wrap bg-gradient-to-b bg-clip-text text-center text-6xl font-semibold leading-none text-transparent max-lg:-mt-12 from-blue-200 to-emerald-900/10 sm:text-7xl md:text-10xl lg:text-9xl xl:text-10xl">
        unseen
      </h1>
      <p class="text-muted-foreground text-sm">
        end to end encrypted note sharing service. No one can read your notes even server, ISP.
        <br />
      </p>
      <div class="mt-2 text-muted-foreground text-sm items-center jutify-center">
        <code class="cursor-pointer" @click="howItWorks">how it works?</code>
        |
        <code class="cursor-pointer items-center" @click="openSource">
          <Icon name="mdi:github" />
          open source
        </code>
      </div>
    </header>

    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Expiration</label>
          <ASelect v-model:value="form.expires" size="large" class="w-full">
            <ASelectOption v-for="option in AUTO_DELETE_SUFFIXS" :key="option" :value="option">
              {{ option }}
            </ASelectOption>
          </ASelect>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Author</label>
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
        <span class="text-sm">Suicide after read</span>
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
          class="min-w-[120px]"
          @click="createNote">
          Create Note
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
    console.log(`kripto.js -- start enc`);
    loading.value = true;
    try {
      if (form.value.content.length < MIN_CONTENT_LENGTH) {
        throw new Error("Content is too short");
      }

      // gen client-side key and encrypt
      const key = nacl.randomBytes(32);
      const final = encryptContent(form.value.content, key);

      // store iv and encrypted content
      form.value.iv = final.iv;
      form.value.content = final.encryptedContent;

      // api
      const { data } = await axios.post("/api/notes", form.value);

      const finalUrl = `${window.location.origin}/notes/${data.id}#${naclUtil.encodeBase64(key)}`;
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
        "By using a encryption key created by you, in your browser the note is encrypted before it being sent to the server. The raw (unencrypted) data never touches to the server. When you share the link, key will be in the URL hash, this is required to decrypt the note, if you find URL is too long you can slice the key (before the #) and we will ask it in the note page.",
    });
  };

  const openSource = () => {
    router.push("https://github.com/arshx86/unseen");
  };
</script>
