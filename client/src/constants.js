export const SUBJECTS = [
  { value: 'python', label: '🐍 Python' },
  { value: 'maths', label: '📐 Mathematics' },
  { value: 'networks', label: '🌐 Computer Networks' },
  { value: 'dbms', label: '🗄️ DBMS' },
  { value: 'os', label: '💻 Operating Systems' },
  { value: 'general', label: '📚 General Studies' },
];

// Quick lookup: subject value -> emoji + label
export const SUBJECT_MAP = SUBJECTS.reduce((acc, s) => {
  acc[s.value] = s.label;
  return acc;
}, {});
