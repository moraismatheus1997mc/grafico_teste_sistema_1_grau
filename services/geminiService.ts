
import { GoogleGenAI, Type } from "@google/genai";
import type { Scenario } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development, but the environment must provide the key.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const prompt = `
Você é um game designer educacional criando problemas de matemática para um adolescente surfista. Sua tarefa é gerar um problema que envolve um sistema de duas equações lineares na forma y = ax + b.

O cenário deve ser relacionado ao surf. A variável 'x' deve representar a altura da maré em metros, e 'y' deve representar a altura final do pico da onda em metros.

O problema deve descrever duas relações diferentes que determinam a altura do pico da onda. Por exemplo:
1. Uma equação pode representar o efeito natural da maré no swell.
2. A segunda equação pode representar uma condição ideal para uma manobra específica ou um tipo de prancha.

A interseção dessas duas linhas será o "ponto ideal" - a altura perfeita da maré para a altura perfeita do pico da onda.

Restrições para os coeficientes 'a' e 'b':
- Os valores de 'a' devem estar entre 0.5 e 2.5 (podem ser decimais).
- Os valores de 'b' devem estar entre -1 e 2 (podem ser decimais).
- A solução para 'x' (altura da maré) e 'y' (altura do pico da onda) deve ser um número positivo entre 0.5 e 4.
- As inclinações 'a1' e 'a2' devem ser diferentes.
- Todos os números devem ser arredondados para uma casa decimal.

Forneça sua resposta apenas em um formato JSON válido, sem texto explicativo antes ou depois do bloco JSON.
`;

const schema = {
  type: Type.OBJECT,
  properties: {
    story: {
      type: Type.STRING,
      description: "Uma história criativa e envolvente que apresenta o problema.",
    },
    eq1: {
      type: Type.OBJECT,
      properties: {
        a: { type: Type.NUMBER },
        b: { type: Type.NUMBER },
      },
    },
    eq2: {
      type: Type.OBJECT,
      properties: {
        a: { type: Type.NUMBER },
        b: { type: Type.NUMBER },
      },
    },
  },
};

export const generateSurfScenario = async (): Promise<Scenario> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.9,
      },
    });

    const jsonText = response.text.trim();
    const parsedScenario = JSON.parse(jsonText) as Scenario;

    // Basic validation
    if (!parsedScenario.story || !parsedScenario.eq1 || !parsedScenario.eq2) {
      throw new Error("Invalid scenario structure received from API.");
    }
    
    return parsedScenario;
  } catch (error) {
    console.error("Error generating scenario with Gemini:", error);
    // Fallback to a default scenario in case of API error
    return {
      story: "A API falhou em gerar um novo desafio, mas não se preocupe! Use este cenário reserva: A previsão indica que as ondas seguem a relação onde o pico (y) é 1.2 vezes a maré (x) mais 0.5 metros. Sua prancha nova, no entanto, funciona melhor quando o pico (y) é o dobro da maré (x) menos 1 metro. Qual o ponto ideal?",
      eq1: { a: 1.2, b: 0.5 },
      eq2: { a: 2, b: -1 },
    };
  }
};
