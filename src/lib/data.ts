import type { Student } from '@/lib/types';

export const students: Student[] = [
  {
    id: 's1',
    name: 'Michael Johnson',
    attendance: [
      { date: '2024-05-01', status: 'Present' },
      { date: '2024-05-02', status: 'Present' },
      { date: '2024-05-03', status: 'Absent' },
      { date: '2024-05-06', status: 'Present' },
      { date: '2024-05-07', status: 'Late' },
    ],
  },
  {
    id: 's2',
    name: 'Emily Davis',
    attendance: [
      { date: '2024-05-01', status: 'Present' },
      { date: '2024-05-02', status: 'Present' },
      { date: '2024-05-03', status: 'Present' },
      { date: '2024-05-06', status: 'Present' },
      { date: '2024-05-07', status: 'Present' },
    ],
  },
  {
    id: 's3',
    name: 'Christopher Miller',
    attendance: [
      { date: '2024-05-01', status: 'Late' },
      { date: '2024-05-02', status: 'Absent' },
      { date: '2024-05-03', status: 'Absent' },
      { date: '2024-05-06', status: 'Present' },
      { date: '2024-05-07', status: 'Excused' },
    ],
  },
  {
    id: 's4',
    name: 'Jessica Wilson',
    attendance: [
      { date: '2024-05-01', status: 'Present' },
      { date: '2024-05-02', status: 'Present' },
      { date: '2024-05-03', status: 'Late' },
      { date: '2024-05-06', status: 'Late' },
      { date: '2024-05-07', status: 'Late' },
    ],
  },
  {
    id: 's5',
    name: 'David Martinez',
    attendance: [
      { date: '2024-05-01', status: 'Excused' },
      { date: '2024-05-02', status: 'Present' },
      { date: '2024-05-03', status: 'Present' },
      { date: '2024-05-06', status: 'Present' },
      { date: '2024-05-07', status: 'Present' },
    ],
  },
];
