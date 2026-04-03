import { ChecklistQuestion } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  question: ChecklistQuestion;
  onAnswer: (questionId: string, answer: 'si' | 'no') => void;
  index: number;
}

export default function QuestionCard({ question, onAnswer, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-xl border bg-card p-4 transition-all ${
        question.answer === 'si' ? 'border-success/30' : question.answer === 'no' ? 'border-warning/30' : ''
      }`}
    >
      <p className="text-sm font-medium text-foreground mb-3">{question.text}</p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={question.answer === 'si' ? 'default' : 'outline'}
          onClick={() => onAnswer(question.id, 'si')}
          className={`gap-1.5 ${question.answer === 'si' ? 'bg-success hover:bg-success/90 text-white' : ''}`}
        >
          <CheckCircle2 className="h-4 w-4" /> Sí
        </Button>
        <Button
          type="button"
          size="sm"
          variant={question.answer === 'no' ? 'default' : 'outline'}
          onClick={() => onAnswer(question.id, 'no')}
          className={`gap-1.5 ${question.answer === 'no' ? 'bg-warning hover:bg-warning/90 text-white' : ''}`}
        >
          <XCircle className="h-4 w-4" /> No
        </Button>
        {question.answeredBy && (
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            {question.answeredBy} — {question.answeredAt}
          </span>
        )}
      </div>
    </motion.div>
  );
}
