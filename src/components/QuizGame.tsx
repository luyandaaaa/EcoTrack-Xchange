import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizGameProps {
  quizTitle: string;
  questions: Question[];
  points: number;
  onComplete: () => void;
}

export function QuizGame({ quizTitle, questions, points, onComplete }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestion].correctAnswer;
    setAnsweredCorrectly(isCorrect);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnsweredCorrectly(null);
    } else {
      setShowResult(true);
    }
  };

  const earnedPoints = Math.round((score / questions.length) * points);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResult) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl">Quiz Complete!</CardTitle>
          <CardDescription className="text-center">
            You answered {score} out of {questions.length} questions correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">+{earnedPoints} Points</div>
            <p className="text-muted-foreground">Added to your EcoScore</p>
          </div>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
            <p className="text-sm text-center">
              Your score: <span className="font-bold">{Math.round((score / questions.length) * 100)}%</span>
            </p>
          </div>
          <Button 
            className="w-full" 
            onClick={() => {
              toast.success(`You earned ${earnedPoints} EcoPoints!`);
              onComplete();
            }}
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">Question {currentQuestion + 1}/{questions.length}</Badge>
          <Badge className="bg-primary">{points} Points</Badge>
        </div>
        <Progress value={progress} className="mb-4" />
        <CardTitle>{quizTitle}</CardTitle>
        <CardDescription className="text-base mt-2">
          {questions[currentQuestion].question}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {questions[currentQuestion].options.map((option, index) => (
          <Button
            key={index}
            variant={
              selectedAnswer === null
                ? 'outline'
                : index === questions[currentQuestion].correctAnswer
                ? 'default'
                : selectedAnswer === index
                ? 'destructive'
                : 'outline'
            }
            className={`w-full justify-start text-left h-auto py-4 ${
              selectedAnswer !== null ? 'pointer-events-none' : ''
            }`}
            onClick={() => handleAnswerSelect(index)}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex-shrink-0">
                {selectedAnswer !== null && index === questions[currentQuestion].correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {selectedAnswer === index && index !== questions[currentQuestion].correctAnswer && (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
                {selectedAnswer === null && (
                  <div className="w-5 h-5 rounded-full border-2 border-current" />
                )}
              </div>
              <span className="flex-1">{option}</span>
            </div>
          </Button>
        ))}
        
        {selectedAnswer !== null && (
          <div className="pt-4">
            <Button onClick={handleNext} className="w-full">
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
