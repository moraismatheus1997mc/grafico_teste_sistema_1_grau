import React, { useState, useCallback, useEffect } from 'react';
import { generateSurfScenario } from './services/geminiService';
import type { GameStage, Scenario, Point } from './types';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import Graph from './components/Graph';

const App: React.FC = () => {
  const [gameStage, setGameStage] = useState<GameStage>('intro');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [solution, setSolution] = useState<Point | null>(null);
  const [userAnswer, setUserAnswer] = useState<Point>({ x: 0, y: 0 });
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const calculateSolution = (currentScenario: Scenario): Point | null => {
    const { eq1, eq2 } = currentScenario;
    // a1*x + b1 = a2*x + b2  => (a1 - a2)*x = b2 - b1
    const denominator = eq1.a - eq2.a;
    if (Math.abs(denominator) < 1e-9) { // Parallel lines
      return null;
    }
    const x = (eq2.b - eq1.b) / denominator;
    const y = eq1.a * x + eq1.b;

    return { x, y };
  };

  const startNewGame = useCallback(async () => {
    setIsLoading(true);
    setScenario(null);
    setSolution(null);
    setIsCorrect(null);
    setUserAnswer({ x: 0, y: 0 });
    
    const newScenario = await generateSurfScenario();
    const newSolution = calculateSolution(newScenario);

    setScenario(newScenario);
    setSolution(newSolution);
    setIsLoading(false);
    setGameStage('playing');
  }, []);
  
  const handleCheckAnswer = () => {
    if (!solution) return;
    const tolerance = 0.1;
    const isXCorrect = Math.abs(userAnswer.x - solution.x) <= tolerance;
    const isYCorrect = Math.abs(userAnswer.y - solution.y) <= tolerance;
    
    setIsCorrect(isXCorrect && isYCorrect);
    setGameStage('result');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserAnswer(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    switch (gameStage) {
      case 'intro':
        return (
          <div className="text-center animate-fade-in">
            <p className="text-lg text-slate-200 mb-8">
              Use seus conhecimentos de matemática para descobrir a condição perfeita para surfar.
              <br/>
              Leia o cenário, resolva o sistema de equações e encontre o ponto ideal!
            </p>
            <button
              onClick={startNewGame}
              className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Começar o Desafio!
            </button>
          </div>
        );
      
      case 'playing':
        if (!scenario || !solution) return null;
        return (
          <div className="w-full animate-fade-in">
            <p className="text-lg bg-black/20 p-4 rounded-lg mb-6 leading-relaxed text-slate-200">{scenario.story}</p>
            
            <Graph eq1={scenario.eq1} eq2={scenario.eq2} solution={solution} showSolution={false} />

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div>
                <label htmlFor="x" className="block mb-2 font-semibold text-cyan-200">Altura da Maré Ideal (x) em metros:</label>
                <input
                  type="number"
                  name="x"
                  id="x"
                  step="0.1"
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label htmlFor="y" className="block mb-2 font-semibold text-cyan-200">Pico da Onda Ideal (y) em metros:</label>
                <input
                  type="number"
                  name="y"
                  id="y"
                  step="0.1"
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={handleCheckAnswer}
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                Verificar Resposta
              </button>
            </div>
          </div>
        );

      case 'result':
        if (!scenario || !solution) return null;
        return (
          <div className="w-full text-center animate-fade-in">
            {isCorrect ? (
              <h3 className="text-3xl font-bold text-green-400 mb-2">ALOHA! Você pegou a onda perfeita!</h3>
            ) : (
              <h3 className="text-3xl font-bold text-red-400 mb-2">WIPEOUT! Quase lá.</h3>
            )}
            <p className="text-lg text-slate-200 mb-4">
              A resposta correta é Maré (x) = <span className="font-bold text-yellow-300">{solution.x.toFixed(2)}m</span> e Pico da Onda (y) = <span className="font-bold text-yellow-300">{solution.y.toFixed(2)}m</span>.
            </p>
            <p className="text-slate-300">Veja no gráfico como as duas condições se encontram no ponto ideal.</p>
            <Graph eq1={scenario.eq1} eq2={scenario.eq2} solution={solution} showSolution={true} />
            <div className="text-center mt-8">
              <button
                onClick={startNewGame}
                className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                Jogar Novamente
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-sky-900 text-white flex flex-col items-center justify-center p-4">
       <main className="w-full max-w-3xl bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-white/10">
        <Header />
        <div className="mt-6">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center text-slate-400 mt-8 text-sm">
        <p>Desenvolvido para aprender e se divertir. Aloha!</p>
      </footer>
    </div>
  );
};

export default App;