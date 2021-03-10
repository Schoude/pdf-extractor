import { ref, Ref } from 'vue';
import Axios from 'axios';

const loadedFileNames: Ref<string[]> = ref([]);
const files: Ref<File[]> = ref([]);
const exportedFiles: Ref<string[]> = ref([]);

function useFileHandler() {
  const fetchExportedFiles = async () => {
    const res = await Axios.get('http://localhost:4000/export');
    exportedFiles.value = res.data.files ?? [];
  };
  const clearFiles = () => {
    files.value = [];
    loadedFileNames.value = [];
  };
  const deleteAllFiles = async () => {
    try {
      const res = await Axios.post('http://localhost:4000/export/delete-all');
      if (res.status === 200) fetchExportedFiles();
    } catch (error) {
      console.log(error.message);
    }
  };

  return {
    loadedFileNames,
    files,
    exportedFiles,
    fetchExportedFiles,
    clearFiles,
    deleteAllFiles,
  };
}

export default useFileHandler;
