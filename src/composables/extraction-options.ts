import { computed, ref } from 'vue';
const projectName = ref('elf-freunde');
const roomMatcher = ref('\\d-Zimmer');
const sizeMatcher = ref('Gesamt-Wohn-Nutzfläche');
const floorGuidString = ref(
  'f07d83ac-4cb3-4dba-8e6d-68111609ae2f\nd4656ce9-3137-46c7-b386-b2b67f4c673e\n74e9cf9b-9ec6-4d57-a26a-580dd1562d52\nb18e2bf6-0559-404a-ab11-155c6d30d278\n2140f5e6-8dfc-430a-ab75-b2f858a3c2f7\nbe1d7218-1e3d-432e-9567-dcb69fb2150b'
);
const floorsCount = computed(() => floorGuidString.value.split('\n').length);

export default function useExtractionOptions() {
  return {
    projectName,
    roomMatcher,
    sizeMatcher,
    floorGuidString,
    floorsCount,
  };
}
