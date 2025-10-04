'use client';

import { useState, useEffect } from 'react';
import type React from 'react';
import OpenAI from 'openai';

import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const Description = z.object({
  title: z.string(),
  description: z.string(),
});

const Commits = z.object({
  commit: z.array(Description),
  final_answer: z.string(),
});

interface Commit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  repository: string;
  url: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  commits: Commit[];
}

const Modal = ({ isOpen, onClose, title, commits }: ModalProps) => {
  const [summary, setSummary] = useState([
    {
      "title": "fix: Update skill percentages for improved accuracy in Skills section (Repo: Portfolio)",
      "description": "Se actualizó el porcentaje de habilidades en la sección de Skills para reflejar una mayor precisión. Este cambio mejora la representación de las competencias del usuario. El impacto es funcional, ya que proporciona información más confiable a los visitantes."
    },
    {
      "title": "fix: Replace <img> with <Image> component for optimized image loading in AboutMe, Home, and Portfolio sections (Repo: Portfolio)",
      "description": "Se reemplazó el componente <img> por el componente <Image> en las secciones AboutMe, Home y Portfolio. Este cambio optimiza la carga de imágenes, lo que puede resultar en un mejor rendimiento del sitio. El impacto es visual y de performance, ya que mejora la experiencia del usuario al navegar."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const controller = new AbortController();

  //   if (isOpen && commits.length > 0) {
  //     const generateSummary = async () => {
  //       setIsLoading(true);
  //       setSummary([]);

  //       const openai = new OpenAI({ apiKey: '', dangerouslyAllowBrowser: true });

  //       const formattedCommits = commits.map(c => `- ${c.message.split('\n')[0]} (Repo: ${c.repository})`).join('\n');

  //       const systemPromp = `
  //         Eres un analista técnico senior. Recibirás un bloque de texto con varios commits separados por el prefijo "- ". Para cada commit debes producir únicamente dos piezas de contenido: 
  //         1) "title": el título EXACTO del commit (sin modificar mayúsculas, etiquetas HTML ni paréntesis), 
  //         2) "descriptions": una lista de 2 a 5 frases en español que expliquen con claridad qué trata el commit (bugfix, mejora visual, optimización, actualización), qué cambió concretamente y el impacto esperado en el proyecto (funcional o visual). 
  //         Reglas:
  //         - Mantén el orden original de los commits.
  //         - No inventes commits ni detalles no presentes o altamente inferibles; si algo no se puede determinar, indica “No indicado” de forma breve.
  //         - No agregues campos, prefijos, comentarios, ni texto extra fuera de "title" y "descriptions".
  //         - Conserva cualquier etiqueta o snippet HTML tal cual (p. ej., <img>, <Image>).
  //         - Redacción en español, técnica y concisa.
  //         - La salida debe limitarse a los valores que mi plantilla espera: por commit, un "title" y una "descriptions" (lista). Nada más.
  //       `;

  //       const userPromp = `
  //         Analiza los siguientes commits (cada uno inicia con "- ") y devuelve, para cada commit, únicamente:
  //         - "title": el título exacto del commit.
  //         - "descriptions": lista de 2 a 5 frases en español explicando de qué trata, qué cambió y su impacto (visual/funcional/performance) según aplique.

  //         Commits:
  //         ${formattedCommits}
  //       `;

  //       try {
  //         const reponse = await openai.responses.parse({
  //           model: 'gpt-4o-mini',
  //           input: [
  //             {
  //               role: 'system',
  //               content: systemPromp,
  //             },
  //             {
  //               role: 'user',
  //               content: userPromp
  //             }
  //           ],
  //           text: {
  //             format: zodTextFormat(Commits, "math_reasoning"),
  //           },
  //         }, {
  //           signal: controller.signal,
  //         });

  //         const result = JSON.parse(reponse.output[0].content[0].text).commit;
  //         setSummary(result);
  //       } catch (error) {
  //         if (error instanceof Error && error.name === 'AbortError') {
  //           console.log("Request was cancelled");
  //           return;
  //         }
  //         console.error("Error generating summary with OpenAI:", error);
  //         setSummary([]);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };

  //     generateSummary();
  //   }

  //   return () => {
  //     controller.abort();
  //   };
  // }, [isOpen, commits]);

  if (!isOpen) return null;

  console.log('debug:commits details', summary);

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-5xl text-black shadow-xl">
        <div className="flex justify-between items-center mb-4 border-b border-b-white pb-3">
          <h3 className="text-2xl font-light text-white">{title}</h3>
          <button onClick={onClose} className="text-2xl font-light text-gray-500 hover:text-black cursor-pointer">&times;</button>
        </div>

        <div className="max-h-[70vh] overflow-y-aut py-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="mt-4 text-gray-600">Analyzing commits and generating summary...</p>
            </div>
          ) : (
            <div className="w-full space-y-10">
              {summary.map((item, index) => (
                <div key={`commit-${item.title}-${index}`} className='inset-shadow-2xs bg-gray-700 space-y-2 rounded-xl p-5 border border-gray-500'>
                  <p className='text-white font-semibold'>
                    {item.title}
                  </p>

                  <p className='text-sm text-gray-300 text-justify'>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end pt-4 mt-4 border-t border-t-white">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer">Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;