import { computed, ref, Ref } from 'vue';
import Axios from 'axios';

const files: Ref<File[]> = ref([]);
const exportedFiles: Ref<string[]> = ref([]);
const filesLoaded = computed(() => files.value.length > 0);

function useFileHandler() {
  const fetchExportedFiles = async () => {
    const res = await Axios.get('http://localhost:4000/export');
    exportedFiles.value = res.data.files ?? [];
  };
  const clearFiles = () => {
    files.value = [];
  };
  const deleteAllFiles = async () => {
    try {
      const res = await Axios.post('http://localhost:4000/export/delete-all');
      if (res.status === 200) exportedFiles.value = [];
    } catch (error) {
      return;
    }
  };

  return {
    files,
    exportedFiles,
    fetchExportedFiles,
    clearFiles,
    deleteAllFiles,
    filesLoaded,
  };
}

export default useFileHandler;
