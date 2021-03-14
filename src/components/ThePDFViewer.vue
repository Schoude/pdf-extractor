<template lang="pug">
section.the-pdf-viewer
  .intro
    h2 PDF Preview
    p.fallback__empty(v-if='previewPDFFile == null') Keine Datei zur Vorschau geladen
    p.file__selected(v-else) 
      small Geladene Datei: {{ previewPDFFile.name }}
  .pdf-viewer(v-if='previewPDFFile')
    .pdf-viewer__actions
      button.btn--icon.btn--delete.btn--delete--single(
        @click='removePDFPreview',
        title='PDF-Vorschau leeren'
      )
        IconSVG(name='trash-alt')
      .pdf-viewer__actions__buttons
        button.btn--icon.btn__fullscreen(
          @click='toggleFullScreen',
          title='Im Vollbild anzeigen'
        )
          IconSVG(name='expand', color='white')
        button.btn--icon.btn__prev(
          @click='showPrevPage',
          title='Vorherige Seite'
        )
          IconSVG(name='arrow-left', color='white')
        button.btn--icon.btn__next(
          @click='showNextPage',
          title='Nächste Seite'
        )
          IconSVG(name='arrow-right', color='white')
      span.pages-info Seite {{ currentPage }} von {{ maxPages }}
    canvas#pdf-render(ref='theCanvas')
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, Ref, ref, watch } from 'vue';
import usePDFPreview from '../composables/pdf-preview';
declare const window: CustomWindow;
import { CustomWindow, PDFDocumentProxy, PDFPageProxy } from '../types/pdfjs';

import IconSVG from './vfx/icons/IconSVG.vue';
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  '//mozilla.github.io/pdf.js/build/pdf.worker.js';

export default defineComponent({
  name: 'ThePDFViewer',
  components: {
    IconSVG,
  },
  setup: () => {
    const { previewPDFFile } = usePDFPreview();

    const pdfDoc: Ref<PDFDocumentProxy | null> = ref(null);
    const currentPage = ref(1);
    const maxPages = ref(1);
    const pageIsRendering = ref(false);
    const pageNumIsPending: Ref<number | null> = ref(null);

    const scale = 1;
    const theCanvas: Ref<HTMLCanvasElement | null> = ref(null);
    const ctx: Ref<CanvasRenderingContext2D | null> = ref(null);

    async function getPDFDoc(file: File) {
      pdfDoc.value = (await pdfjsLib.getDocument(await file.arrayBuffer())
        .promise) as PDFDocumentProxy;
      maxPages.value = pdfDoc.value.numPages;

      renderPage(currentPage.value);
    }

    async function renderPage(number: number) {
      pageIsRendering.value = true;
      const page = (await pdfDoc.value?.getPage(number)) as PDFPageProxy;
      const viewPort = page?.getViewport({ scale });
      (theCanvas.value as HTMLCanvasElement).height = viewPort?.height as number;
      (theCanvas.value as HTMLCanvasElement).width = viewPort?.width as number;

      const renderContext = {
        canvasContext: ctx.value as CanvasRenderingContext2D,
        viewport: viewPort,
      };
      const renderTask = page.render(renderContext);
      renderTask.promise.then(() => {
        pageIsRendering.value = false;

        if (pageNumIsPending.value) {
          renderPage(pageNumIsPending.value as number);
          pageNumIsPending.value = null;
        }
      });

      currentPage.value = number;
    }

    function queueRenderPage(number: number) {
      if (pageIsRendering.value) {
        pageNumIsPending.value = number;
      } else {
        renderPage(number);
      }
    }

    function showPrevPage() {
      if (currentPage.value <= 1) {
        return;
      }

      currentPage.value--;
      queueRenderPage(currentPage.value);
    }

    function showNextPage() {
      if (currentPage.value >= maxPages.value) {
        return;
      }

      currentPage.value++;
      queueRenderPage(currentPage.value);
    }

    function removePDFPreview() {
      previewPDFFile.value = null;
    }

    async function toggleFullScreen() {
      await theCanvas.value?.requestFullscreen();
    }

    onMounted(() => {
      if (previewPDFFile.value) {
        ctx.value = (theCanvas.value as HTMLCanvasElement).getContext('2d');
        getPDFDoc(previewPDFFile.value);
      }
    });

    watch(
      () => previewPDFFile.value,
      async (newFile) => {
        if (newFile != null) {
          currentPage.value = 1;
          await nextTick();
          ctx.value = (theCanvas.value as HTMLCanvasElement).getContext('2d');
          getPDFDoc(newFile);
        } else {
          currentPage.value = 1;
          maxPages.value = 1;
        }
      }
    );

    return {
      theCanvas,
      previewPDFFile,
      currentPage,
      maxPages,
      showNextPage,
      showPrevPage,
      removePDFPreview,
      toggleFullScreen,
    };
  },
});
</script>

<style lang="scss" scoped>
.intro {
  margin: 0 auto;
  width: max-content;
}

h2 {
  text-align: center;
}

.fallback__empty {
  margin: 1em 0;
}

.pdf-viewer__actions {
  margin: 1em 0;
  position: relative;
}

.pdf-viewer__actions__buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  margin-left: auto;
}

.pages-info,
.btn--delete--single {
  position: absolute;
  top: 0;
}

.btn--delete--single {
  left: 0;
}

.pages-info {
  right: 0;
  transform: translateY(50%);
}

#pdf-render {
  width: 100%;
}
</style>