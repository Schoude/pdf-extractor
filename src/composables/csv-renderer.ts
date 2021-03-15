import Axios from 'axios';
import { reactive } from 'vue';

const selectedCSV = reactive({
  name: '',
  headers: [],
  rows: [],
});
function useCSVRenderer() {
  async function fetchFileData(filename: string) {
    selectedCSV.name = filename;
    try {
      const res = await Axios.get(
        `http://localhost:4000/csv-preview/${filename}`
      );
      selectedCSV.headers = res.data.headers;
      selectedCSV.rows = res.data.rows;
    } catch (error) {
      console.log(error.message);
    }
  }
  return {
    selectedCSV,
    fetchFileData,
  };
}

export default useCSVRenderer;
