import { ChecklistQuestion } from '@/lib/mockData';
import QuestionCard from './QuestionCard';
import { motion } from 'framer-motion';

interface Props {
  questions: ChecklistQuestion[];
  onAnswer: (questionId: string, answer: 'si' | 'no') => void;
}

export default function ChecklistSignIn({ questions, onAnswer }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      {questions.map((q, i) => (
        <QuestionCard key={q.id} question={q} onAnswer={onAnswer} index={i} />
      ))}
    </motion.div>
  );
}
