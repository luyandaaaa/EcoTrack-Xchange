import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CitizenSidebar } from '@/components/CitizenSidebar';
import { QuizGame } from '@/components/QuizGame';
import { quizData } from '@/data/quizQuestions';
import { LogOut, Trophy, Play, Volume2, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const quizzes = [
    { title: 'Recycling Basics', questions: 5, points: 50, difficulty: 'Easy' },
    { title: 'Composting 101', questions: 5, points: 75, difficulty: 'Medium' },
    { title: 'Waste Sorting Expert', questions: 5, points: 100, difficulty: 'Hard' },
    { title: 'E-Waste Management', questions: 5, points: 60, difficulty: 'Medium' },
  ];

  const handleStartQuiz = (quizTitle: string) => {
    setActiveQuiz(quizTitle);
  };

  const handleQuizComplete = () => {
    if (activeQuiz && !completedQuizzes.includes(activeQuiz)) {
      setCompletedQuizzes([...completedQuizzes, activeQuiz]);
    }
    setActiveQuiz(null);
  };

  if (activeQuiz) {
    const quiz = quizzes.find(q => q.title === activeQuiz);
    const questions = quizData[activeQuiz as keyof typeof quizData];
    
    return (
      <SidebarProvider>
        <div className="flex flex-col min-h-screen w-full">
          <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary via-accent to-secondary shadow-lg">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="text-primary-foreground" />
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-primary-foreground">Welcome, {user?.name}!</h1>
              </div>
              <Button variant="secondary" size="sm" className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20">
                <Volume2 className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20">
                <Languages className="w-4 h-4 mr-2" />
                EN
              </Button>
            </div>
          </header>

          <div className="flex flex-1 w-full">
            <CitizenSidebar />
            
            <main className="flex-1 p-6 bg-gradient-to-br from-background via-primary/5 to-accent/10">
              <div className="max-w-3xl mx-auto">
                <QuizGame
                  quizTitle={activeQuiz}
                  questions={questions.questions}
                  points={quiz?.points || 0}
                  onComplete={handleQuizComplete}
                />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary via-accent to-secondary shadow-lg">
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger className="text-primary-foreground" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-primary-foreground">Welcome, {user?.name}!</h1>
            </div>
            <Button variant="secondary" size="sm" className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20">
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20">
              <Languages className="w-4 h-4 mr-2" />
              EN
            </Button>
            <Button variant="secondary" size="sm" onClick={handleLogout} className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <div className="flex flex-1 w-full">
          <CitizenSidebar />
          
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-primary/5 to-accent/10">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                  <Trophy className="w-8 h-8 text-primary" />
                  EcoQuiz
                </h2>
                <p className="text-muted-foreground mt-2">Test your environmental knowledge and earn rewards</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Test Your Eco Knowledge</CardTitle>
                  <CardDescription>Complete quizzes to earn EcoPoints and learn about waste management</CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((quiz) => (
                  <Card key={quiz.title} className={`hover:shadow-lg transition-shadow ${completedQuizzes.includes(quiz.title) ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {quiz.questions} questions • {quiz.difficulty}
                          </CardDescription>
                        </div>
                        <Trophy className={`w-8 h-8 ${completedQuizzes.includes(quiz.title) ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-semibold text-primary">{quiz.points} points</span>
                        </div>
                        <Button onClick={() => handleStartQuiz(quiz.title)} disabled={completedQuizzes.includes(quiz.title)}>
                          <Play className="w-4 h-4 mr-2" />
                          {completedQuizzes.includes(quiz.title) ? 'Completed' : 'Start Quiz'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Your Quiz History</CardTitle>
                  <CardDescription>Track your progress and scores</CardDescription>
                </CardHeader>
                <CardContent>
                  {completedQuizzes.length > 0 ? (
                    <div className="space-y-3">
                      {completedQuizzes.map((quizTitle) => {
                        const quiz = quizzes.find(q => q.title === quizTitle);
                        return (
                          <div key={quizTitle} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-card to-card/50">
                            <div className="flex items-center gap-3">
                              <Trophy className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-semibold">{quizTitle}</p>
                                <p className="text-sm text-muted-foreground">Completed</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">+{quiz?.points} pts</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No quizzes completed yet. Start your first quiz to see your progress!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Quiz;
