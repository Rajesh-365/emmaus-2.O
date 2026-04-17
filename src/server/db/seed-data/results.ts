import type { ResultCategory } from "@/data/results";

export type ResultSeed = {
  admissionNo: string;
  name: string;
  location: string;
  firstSem: number | null;
  secondSem: number | null;
  percentage: number | null;
  result: ResultCategory;
  rank: 1 | 2 | 3 | null;
};

export const programme = {
  code: "C.Th",
  name: "Certificate in Theology",
  year: "2024",
  semesterMax: 50,
};

export const results: ResultSeed[] = [
  { admissionNo: "EC/001", name: "U. Trilokesh",               location: "Srikakulam",      firstSem: 44, secondSem: 28, percentage: 72, result: "2nd Class",   rank: null },
  { admissionNo: "EC/002", name: "Nagavarapu Chandar Rao",     location: "Srikakulam",      firstSem: 36, secondSem: 30, percentage: 66, result: "Pass",        rank: null },
  { admissionNo: "EC/003", name: "Ungarala Madhavi",           location: "Srikakulam",      firstSem: 44, secondSem: 32, percentage: 76, result: "2nd Class",   rank: null },
  { admissionNo: "EC/004", name: "Vanka Adilakshmi",           location: "Srikakulam",      firstSem: 42, secondSem: 28, percentage: 70, result: "2nd Class",   rank: null },
  { admissionNo: "EC/005", name: "Behara Prasad",              location: "Visakhapatnam",   firstSem: 30, secondSem: 26, percentage: 56, result: "Pass",        rank: null },
  { admissionNo: "EC/006", name: "Thota Yellayya",             location: "Visakhapatnam",   firstSem: 40, secondSem: 48, percentage: 80, result: "2nd Class",   rank: null },
  { admissionNo: "EC/007", name: "Nimmagadda Vijaya",          location: "Krishna",         firstSem: 46, secondSem: 34, percentage: 80, result: "2nd Class",   rank: null },
  { admissionNo: "EC/008", name: "Nagavarapu Ruthu",           location: "Chilakaluripet",  firstSem: 46, secondSem: 48, percentage: 94, result: "Distinction", rank: 1 },
  { admissionNo: "EC/009", name: "Thanneru Durga Prasad",      location: "Chilakaluripet",  firstSem: 38, secondSem: 24, percentage: 62, result: "Pass",        rank: null },
  { admissionNo: "EC/010", name: "Nagavarapu Rambabu",         location: "Machilipatnam",   firstSem: null, secondSem: null, percentage: null, result: "Absent", rank: null },
  { admissionNo: "EC/011", name: "M. Sirisha",                 location: "Katrapadu",       firstSem: 36, secondSem: 30, percentage: 66, result: "Pass",        rank: null },
  { admissionNo: "EC/012", name: "Prathipati Usha Rani",       location: "Katrapadu",       firstSem: 42, secondSem: 38, percentage: 80, result: "2nd Class",   rank: null },
  { admissionNo: "EC/013", name: "Vallabhapurapu Susmitha",    location: "Katrapadu",       firstSem: 32, secondSem: 42, percentage: 74, result: "2nd Class",   rank: null },
  { admissionNo: "EC/014", name: "Vallabhapurapu Selena Priyadarshi", location: "Katrapadu", firstSem: 28, secondSem: 44, percentage: 72, result: "2nd Class",  rank: null },
  { admissionNo: "EC/015", name: "Vallabhapurapu Shyam Prasad", location: "Katrapadu",      firstSem: 38, secondSem: 42, percentage: 80, result: "2nd Class",   rank: null },
  { admissionNo: "EC/016", name: "Dodda Pouleshu",             location: "Mothadaka",       firstSem: null, secondSem: null, percentage: null, result: "Absent", rank: null },
  { admissionNo: "EC/017", name: "Vallabhapurapu Venkatesh",   location: "Katrapadu",       firstSem: 38, secondSem: 36, percentage: 74, result: "2nd Class",   rank: null },
  { admissionNo: "EC/018", name: "Vallabhapurapu Krupavaram",  location: "Katrapadu",       firstSem: 42, secondSem: 42, percentage: 84, result: "1st Class",   rank: null },
  { admissionNo: "EC/019", name: "Vallabhapurapu Ribka",       location: "Katrapadu",       firstSem: 18, secondSem: 42, percentage: 60, result: "Pass",        rank: null },
  { admissionNo: "EC/020", name: "Lourdukumari",               location: "Chilakaluripet",  firstSem: 38, secondSem: 38, percentage: 76, result: "2nd Class",   rank: null },
  { admissionNo: "EC/021", name: "V. Roja Rani",               location: "Chilakaluripet",  firstSem: 44, secondSem: 44, percentage: 88, result: "Distinction", rank: 3 },
  { admissionNo: "EC/022", name: "V. Siva Narayanamma",        location: "Chilakaluripet",  firstSem: 44, secondSem: 42, percentage: 86, result: "1st Class",   rank: null },
  { admissionNo: "EC/023", name: "Thatimalla Vimala",          location: "Chilakaluripet",  firstSem: 44, secondSem: 42, percentage: 86, result: "1st Class",   rank: null },
  { admissionNo: "EC/024", name: "Venukuri Mallika",           location: "Chilakaluripet",  firstSem: 44, secondSem: 42, percentage: 86, result: "1st Class",   rank: null },
  { admissionNo: "EC/025", name: "T. Ramadevi",                location: "Chilakaluripet",  firstSem: 44, secondSem: 44, percentage: 88, result: "Distinction", rank: 3 },
  { admissionNo: "EC/026", name: "Janga Vimala",               location: "Chilakaluripet",  firstSem: 36, secondSem: 38, percentage: 74, result: "2nd Class",   rank: null },
  { admissionNo: "EC/027", name: "Turaka Tirupathi Rayudu",    location: "Chilakaluripet",  firstSem: 50, secondSem: 44, percentage: 94, result: "Distinction", rank: 1 },
  { admissionNo: "EC/028", name: "Thatimalla Ramesh",          location: "Chilakaluripet",  firstSem: 40, secondSem: 42, percentage: 82, result: "2nd Class",   rank: null },
  { admissionNo: "EC/029", name: "Turaka Santhi",              location: "Chilakaluripet",  firstSem: 46, secondSem: 44, percentage: 90, result: "Distinction", rank: 2 },
  { admissionNo: "EC/030", name: "Verapu Kamalakararao",       location: "Chilakaluripet",  firstSem: 46, secondSem: 40, percentage: 86, result: "1st Class",   rank: null },
  { admissionNo: "EC/031", name: "Nalukurthi Priyanka",        location: "Lingamguntapalem", firstSem: 34, secondSem: 36, percentage: 70, result: "2nd Class",  rank: null },
  { admissionNo: "EC/032", name: "Kavila Bhanu Prasad",        location: "Lingamguntapalem", firstSem: 26, secondSem: 40, percentage: 56, result: "Pass",       rank: null },
  { admissionNo: "EC/033", name: "Penumuli Vamsi Krishna",     location: "Lingamguntapalem", firstSem: 32, secondSem: 40, percentage: 72, result: "2nd Class",  rank: null },
  { admissionNo: "EC/034", name: "Chiruguri Poorna Prasanth",  location: "Katrapadu",       firstSem: 46, secondSem: 42, percentage: 88, result: "Distinction", rank: 3 },
  { admissionNo: "EC/035", name: "Chiruguri Esther Rani",      location: "Katrapadu",       firstSem: 46, secondSem: 44, percentage: 90, result: "Distinction", rank: 2 },
  { admissionNo: "EC/036", name: "Rebba Helen Traisy",         location: "Bhattiprolu",     firstSem: 46, secondSem: 26, percentage: 72, result: "2nd Class",   rank: null },
  { admissionNo: "EC/037", name: "Zampani Purushottam",        location: "Zampani",         firstSem: 46, secondSem: 42, percentage: 88, result: "Distinction", rank: 3 },
];
