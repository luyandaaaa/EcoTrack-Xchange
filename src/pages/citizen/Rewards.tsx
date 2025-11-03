import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CitizenSidebar } from '@/components/CitizenSidebar';
import { LogOut, Volume2, Languages, Award, Recycle, Trash2, Leaf, Trophy, MapPin, Users, TreePine, FlowerIcon, Zap, Lock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: any;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number; // in seconds
  xpReward: number;
  completed: boolean;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

interface BadgeType {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
}

const Rewards = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [totalBadges, setTotalBadges] = useState(0);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);
  
  // Quiz card background colors
  const getQuizBackgroundColor = (index: number) => {
    const colors = [
      'from-green-100 to-green-50',
      'from-blue-100 to-blue-50',
      'from-red-100 to-red-50',
      'from-purple-100 to-purple-50',
      'from-yellow-100 to-yellow-50',
      'from-teal-100 to-teal-50'
    ];
    return colors[index % colors.length];
  };

  // Timer effect
  useEffect(() => {
    if (gameStarted && timeRemaining > 0 && !showFeedback && !showResults) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && gameStarted && !showResults) {
      handleGameEnd();
    }
  }, [timeRemaining, gameStarted, showFeedback, showResults]);

  // Initialize games
  useEffect(() => {
    const initialGames: Game[] = [
      {
        id: '1',
        title: 'Recycling Basics',
        description: 'Learn fundamental recycling principles and proper waste sorting techniques.',
        icon: Recycle, // This is already a good icon for recycling
        difficulty: 'Easy',
        timeLimit: 60,
        xpReward: 100,
        completed: false,
        questions: [
          {
            question: 'Which bin should plastic bottles go into?',
            options: ['General Waste', 'Recycling Bin', 'Organic Waste', 'Hazardous Waste'],
            correctAnswer: 1
          },
          {
            question: 'What percentage of plastic waste is currently recycled globally?',
            options: ['9%', '50%', '75%', '90%'],
            correctAnswer: 0
          },
          {
            question: 'Which material can be recycled indefinitely?',
            options: ['Paper', 'Glass', 'Plastic', 'Cardboard'],
            correctAnswer: 1
          }
        ]
      },
      {
        id: '2',
        title: 'Composting Knowledge',
        description: 'Master organic waste management and composting techniques.',
        icon: TreePine, // Better icon for composting
        difficulty: 'Medium',
        timeLimit: 90,
        xpReward: 150,
        completed: false,
        questions: [
          {
            question: 'Which of these items can be composted?',
            options: ['Meat scraps', 'Fruit peels', 'Plastic bags', 'Glass bottles'],
            correctAnswer: 1
          },
          {
            question: 'How long does it typically take for compost to be ready?',
            options: ['1 week', '1 month', '2-6 months', '1 year'],
            correctAnswer: 2
          },
          {
            question: 'What is "green" material in composting?',
            options: ['Nitrogen-rich materials', 'Carbon-rich materials', 'Colored paper', 'Plastic waste'],
            correctAnswer: 0
          }
        ]
      },
      {
        id: '3',
        title: 'Waste Reduction Expert',
        description: 'Advanced waste management strategies and environmental impact assessment.',
        icon: Award, // More prestigious icon for expert level
        difficulty: 'Hard',
        timeLimit: 120,
        xpReward: 200,
        completed: false,
        questions: [
          {
            question: 'What is the concept of "Zero Waste"?',
            options: ['Burning all waste', 'Reducing waste to landfill and incinerator to zero', 'Recycling 50% of waste', 'Composting only'],
            correctAnswer: 1
          },
          {
            question: 'Which country has the highest recycling rate?',
            options: ['USA', 'Germany', 'Japan', 'South Africa'],
            correctAnswer: 1
          },
          {
            question: 'How many years does it take for a plastic bottle to decompose?',
            options: ['10 years', '50 years', '100 years', '450 years'],
            correctAnswer: 3
          }
        ]
      },
      {
        id: '4',
        title: 'E-Waste Management',
        description: 'Understand proper disposal of electronic waste and its environmental impact.',
        icon: Zap,
        difficulty: 'Medium',
        timeLimit: 90,
        xpReward: 150,
        completed: false,
        questions: [
          {
            question: 'What does e-waste stand for?',
            options: ['Energy waste', 'Electronic waste', 'Electrical waste', 'Environmental waste'],
            correctAnswer: 1
          },
          {
            question: 'Which component in electronics is most harmful to the environment?',
            options: ['Plastic casing', 'Screen glass', 'Circuit boards with heavy metals', 'Batteries only'],
            correctAnswer: 2
          },
          {
            question: 'Where should you dispose of old smartphones?',
            options: ['Regular trash bin', 'E-waste collection center', 'Recycling bin', 'Bury in backyard'],
            correctAnswer: 1
          }
        ]
      },
      {
        id: '5',
        title: 'Plastic Pollution',
        description: 'Learn about plastic waste impact and reduction strategies.',
        icon: Trash2, // More relevant icon for pollution
        difficulty: 'Easy',
        timeLimit: 60,
        xpReward: 100,
        completed: false,
        questions: [
          {
            question: 'Which type of plastic is most commonly used for water bottles?',
            options: ['PVC', 'PET', 'HDPE', 'PP'],
            correctAnswer: 1
          },
          {
            question: 'What is a major consequence of plastic pollution in oceans?',
            options: ['Water becomes clearer', 'Marine life ingests microplastics', 'Ocean temperature decreases', 'Nothing happens'],
            correctAnswer: 1
          },
          {
            question: 'What is the best way to reduce plastic waste?',
            options: ['Burn it', 'Use reusable alternatives', 'Hide it underground', 'Export it'],
            correctAnswer: 1
          }
        ]
      },
      {
        id: '6',
        title: 'Circular Economy',
        description: 'Explore advanced concepts of sustainable resource management and waste prevention.',
        icon: Recycle, // The recycling icon fits well with circular economy
        difficulty: 'Hard',
        timeLimit: 120,
        xpReward: 200,
        completed: false,
        questions: [
          {
            question: 'What is the main principle of a circular economy?',
            options: ['Linear consumption', 'Keep resources in use as long as possible', 'Dispose after single use', 'Export waste abroad'],
            correctAnswer: 1
          },
          {
            question: 'Which strategy is NOT part of circular economy?',
            options: ['Repair and reuse', 'Design for longevity', 'Single-use products', 'Recycling and upcycling'],
            correctAnswer: 2
          },
          {
            question: 'What does "upcycling" mean?',
            options: ['Throwing away items', 'Converting waste into higher-value products', 'Burning waste for energy', 'Exporting waste'],
            correctAnswer: 1
          }
        ]
      }
    ];
    setGames(initialGames);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const badges: BadgeType[] = [
    {
      id: '1',
      title: 'Eco Beginner',
      description: 'Complete your first quiz',
      icon: Leaf,
      unlocked: totalGamesPlayed >= 1
    },
    {
      id: '2',
      title: 'Recycling Hero',
      description: 'Complete all 3 quizzes',
      icon: Recycle,
      unlocked: totalGamesPlayed >= 3
    },
    {
      id: '3',
      title: 'Waste Warrior',
      description: 'Earn 300 XP',
      icon: Trophy,
      unlocked: totalXP >= 300
    },
    {
      id: '4',
      title: 'Green Ambassador',
      description: 'Get perfect score on any quiz',
      icon: Award,
      unlocked: false
    },
    {
      id: '5',
      title: 'Community Champion',
      description: 'Complete 5 community reports',
      icon: Users,
      unlocked: false
    },
    {
      id: '6',
      title: 'Sustainability Expert',
      description: 'Earn 1000 XP',
      icon: TreePine,
      unlocked: totalXP >= 1000
    }
  ];

  // Update badges count whenever badges change
  useEffect(() => {
    const unlockedCount = badges.filter(b => b.unlocked).length;
    setTotalBadges(unlockedCount);
  }, [totalGamesPlayed, totalXP]);

  const leaderboard = [
    { name: 'Thabo M.', xp: 1250, avatar: '🏆' },
    { name: 'Nomsa K.', xp: 890, avatar: '🥈' },
    { name: `${user?.name} (You)`, xp: totalXP, avatar: '🥉', isCurrentUser: true, gamesPlayed: totalGamesPlayed },
    { name: 'Mandla S.', xp: 420, avatar: '4' },
    { name: 'Zanele P.', xp: 180, avatar: '5' }
  ];

  const handlePlayGame = (game: Game) => {
    if (game.completed) {
      toast.info('You have already completed this quiz!');
      return;
    }
    setSelectedGame(game);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowResults(false);
    setTimeRemaining(game.timeLimit);
    setGameStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    // Prevent multiple selections on the same question
    if (!selectedGame || showFeedback || selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    const isCorrect = selectedGame.questions[currentQuestion].correctAnswer === answerIndex;
    
    if (isCorrect) {
      const xpForQuestion = Math.floor(selectedGame.xpReward / selectedGame.questions.length);
      setScore(score + xpForQuestion);
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  const handleNext = () => {
    if (!selectedGame) return;
    
    setShowFeedback(false);
    setSelectedAnswer(null);
    
    if (currentQuestion < selectedGame.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleGameEnd();
    }
  };

  const handleGameEnd = () => {
    if (!selectedGame) return;
    
    setShowResults(true);
    setGameStarted(false);
    
    // Update game as completed
    setGames(games.map(g => 
      g.id === selectedGame.id ? { ...g, completed: true } : g
    ));
    
    // Update total stats
    setTotalXP(totalXP + score);
    setTotalGamesPlayed(totalGamesPlayed + 1);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setSelectedGame(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-orange-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

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
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Rewards Banner */}
              <div className="relative bg-gradient-to-r from-primary via-accent to-secondary rounded-3xl p-8 text-primary-foreground overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Rewards & Play Games</h2>
                  </div>
                  <p className="text-primary-foreground/90 mb-6">Complete quizzes to earn XP and unlock badges!</p>
                  
                  <div className="grid grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">{totalXP}</div>
                      <div className="text-primary-foreground/80 text-sm">Total XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">{totalBadges}</div>
                      <div className="text-primary-foreground/80 text-sm">Badges</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">{totalGamesPlayed}</div>
                      <div className="text-primary-foreground/80 text-sm">Quizzes Completed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eco Waste Games Section */}
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-bold">Eco Waste Games</h3>
                  </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {games.map((game) => (
                    <Card 
                      key={game.id} 
                      className={`hover:shadow-xl transition-all relative overflow-hidden bg-gradient-to-br ${getQuizBackgroundColor(parseInt(game.id) - 1)} border-2 hover:border-primary`}
                    >
                      <CardContent className="p-6">
                        <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl"></div>
                        {game.completed && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-primary">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex justify-center mb-4">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center transform hover:scale-105 transition-transform shadow-lg border-2 border-primary/20">
                            <game.icon className="w-12 h-12 text-primary drop-shadow-md" />
                          </div>
                        </div>
                        
                        <h4 className="text-xl font-bold text-center mb-2">{game.title}</h4>
                        <p className="text-sm text-muted-foreground text-center mb-4 min-h-[60px]">
                          {game.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Difficulty:</span>
                            <span className={`font-semibold ${getDifficultyColor(game.difficulty)}`}>
                              {game.difficulty}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Time Limit:</span>
                            <span className="font-medium">{formatTime(game.timeLimit)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Questions:</span>
                            <span className="font-medium">{game.questions.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">XP Reward:</span>
                            <span className="font-bold text-primary">{game.xpReward} XP</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handlePlayGame(game)}
                          className={`w-full font-semibold transition-all duration-200 ${
                            game.completed 
                              ? 'bg-muted/50 text-muted-foreground hover:bg-muted/60' 
                              : 'bg-primary hover:bg-primary/90 hover:scale-105 text-primary-foreground shadow-lg hover:shadow-xl'
                          }`}
                          disabled={game.completed}
                        >
                          {game.completed ? (
                            <span className="flex items-center justify-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Already Completed
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <Zap className="w-4 h-4" />
                              Play Now
                            </span>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              </Card>

              {/* Your Badges Section */}
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <Award className="w-6 h-6 text-secondary" />
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Your Badges</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {badges.map((badge) => (
                      <Card 
                        key={badge.id} 
                        className={`text-center transition-all relative overflow-hidden hover:scale-105 transform duration-200 ${
                          badge.unlocked 
                            ? 'border-2 border-primary shadow-lg hover:shadow-xl bg-gradient-to-br from-background to-primary/5' 
                            : 'bg-muted/60 border border-muted-foreground/20'
                        }`}
                      >
                        <CardContent className="p-6">
                          {/* Background decoration */}
                          <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl"></div>
                          
                          <div className="flex justify-center mb-4 relative">
                            {badge.unlocked ? (
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center transform hover:scale-105 transition-transform shadow-lg border-2 border-primary/20">
                                <badge.icon className="w-10 h-10 text-primary drop-shadow-md" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted-foreground/20 to-muted flex items-center justify-center relative filter grayscale">
                                <Lock className="w-10 h-10 text-muted-foreground/50" />
                                <div className="absolute inset-0 rounded-full border-2 border-muted-foreground/20"></div>
                              </div>
                            )}
                          </div>

                          <h4 className={`text-base font-bold mb-2 ${badge.unlocked ? 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent' : 'text-muted-foreground'}`}>
                            {badge.title}
                          </h4>
                          
                          <p className="text-xs text-muted-foreground mb-3 min-h-[32px]">{badge.description}</p>
                          
                          <Badge 
                            variant={badge.unlocked ? "default" : "secondary"}
                            className={`${badge.unlocked ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'opacity-50'} transition-all`}
                          >
                            {badge.unlocked ? 'Unlocked 🎉' : 'Locked 🔒'}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Community Leaderboard */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-primary" />
                    <CardTitle className="text-2xl">Community Leaderboard</CardTitle>
                  </div>
                  <CardDescription>See how you rank among other eco warriors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.map((player, index) => (
                      <div 
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                          player.isCurrentUser 
                            ? 'bg-primary/10 border-2 border-primary' 
                            : 'bg-muted/50 hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                            'bg-primary/20 text-primary'
                          }`}>
                            {player.avatar}
                          </div>
                          <div>
                            <div className="font-bold text-lg">{player.name}</div>
                            <div className="text-sm text-muted-foreground">{player.xp} XP</div>
                            {player.isCurrentUser && player.gamesPlayed !== undefined && (
                              <div className="text-xs text-primary">Quizzes Completed: {player.gamesPlayed}</div>
                            )}
                          </div>
                        </div>
                        {player.isCurrentUser && (
                          <Badge>You</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Game Dialog */}
      <Dialog open={!!selectedGame && !showResults} onOpenChange={() => {
        setSelectedGame(null);
        setGameStarted(false);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">{selectedGame?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedGame && gameStarted && (
            <div className="space-y-6">
              {/* Game Progress */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Question {currentQuestion + 1}/{selectedGame.questions.length}</span>
                <span className="font-medium">Score: {score} XP</span>
                <span className={`font-bold ${timeRemaining < 10 ? 'text-destructive' : 'text-primary'}`}>
                  ⏱ {formatTime(timeRemaining)}
                </span>
              </div>
              
              <Progress 
                value={((currentQuestion + 1) / selectedGame.questions.length) * 100} 
                className="h-2"
              />
              
              {/* Question */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">
                  {selectedGame.questions[currentQuestion].question}
                </h3>
                
                <div className="grid gap-3">
                  {selectedGame.questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`justify-start text-left h-auto py-4 px-6 text-foreground hover:text-foreground hover:bg-accent/5 ${
                        showFeedback && selectedAnswer === index
                          ? selectedAnswer === selectedGame.questions[currentQuestion].correctAnswer
                            ? 'bg-primary/10 border-primary text-primary font-semibold'
                            : 'bg-destructive/10 border-destructive text-destructive font-semibold'
                          : showFeedback && index === selectedGame.questions[currentQuestion].correctAnswer
                          ? 'bg-primary/10 border-primary text-primary font-semibold'
                          : 'hover:border-primary transition-colors duration-200'
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showFeedback}
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>

                {showFeedback && (
                  <div className={`p-6 rounded-lg shadow-lg border-2 transition-all animate-in fade-in zoom-in ${
                    selectedAnswer === selectedGame.questions[currentQuestion].correctAnswer
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'bg-destructive/10 border-destructive/20 text-destructive'
                  }`}>
                    <div className="flex items-center gap-3">
                      {selectedAnswer === selectedGame.questions[currentQuestion].correctAnswer ? (
                        <>
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg mb-1">Excellent!</h4>
                            <p className="text-sm opacity-90">That's the correct answer! Keep up the great work!</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                            <XCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg mb-1">Not quite right</h4>
                            <p className="text-sm opacity-90">Don't worry! The correct answer is highlighted above. Learn from this!</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Navigation */}
              <div className="flex justify-between items-center pt-4 border-t">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedGame(null);
                    setGameStarted(false);
                  }}
                >
                  Quit Quiz
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!showFeedback}
                >
                  {currentQuestion < selectedGame.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={handleCloseResults}>
        <DialogContent className="max-w-md">
          <div className="space-y-6 py-4">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary mb-2">Game Complete!</h2>
              <p className="text-lg text-foreground">You earned {score} XP!</p>
              <p className="text-lg font-medium mt-2">
                You got <span className="text-primary font-bold">{correctAnswers} out of {selectedGame?.questions.length}</span> correct
              </p>
            </div>

            {/* Rewards Earned Box */}
            <div className="bg-[#fff9c4] rounded-lg p-4 border border-[#ffd54f]">
              <h3 className="font-bold text-[#f57c00] mb-3">Rewards Earned:</h3>
              <ul className="space-y-2 text-[#795548]">
                <li className="flex items-center gap-2">
                  <span>• {score} Health XP</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>• Progress towards badges</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>• Leaderboard points</span>
                </li>
              </ul>
            </div>

            {correctAnswers === selectedGame?.questions.length && (
              <div className="bg-accent/10 rounded-lg p-4">
                <p className="font-bold text-accent flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Perfect Score! 🎉
                </p>
              </div>
            )}
            
            <Button 
              onClick={handleCloseResults} 
              className="w-full bg-[#4caf50] hover:bg-[#43a047] text-white font-bold py-4"
            >
              Collect Rewards
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Rewards;
