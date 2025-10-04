'use client'

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image";
import Popover from "./components/Popover";
import { FormattedMessage, useIntl } from 'react-intl';
import { useI18n } from './context/I18nProvider';
import { fetchUser } from "@/api/github";
import { testApiKeyOpenAI } from "@/api/openai";
import GithubSvg from "@/components/GithubSvg";
import ChatGptSvg from "@/components/ChatGptSvg";
import InfoSvg from "@/components/InfoSvg";
import ArrowRightSvg from "@/components/ArrowRightSvg";
import LockSvg from "@/components/LockSvg";
import ToggleVisibility from "@/components/ToggleVisibility";

/**
 * @summary The home page of the application.
 * @description This page allows the user to enter their GitHub and ChatGPT tokens to start analyzing their commits.
 * It includes form validation and popovers to provide information to the user.
 * @returns {JSX.Element} The rendered home page.
 */
export default function HomePage() {
  const [githubToken, setGithubToken] = useState("")
  const [chatgptToken, setChatgptToken] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [showChatgptToken, setShowChatgptToken] = useState(false);
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  const router = useRouter()
  const intl = useIntl();
  const { locale, setLocale } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'es' : 'en');
  };

  /**
   * @summary Handles the change event for the GitHub token input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleGithubTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGithubToken(e.target.value);
    if (errors.githubToken) {
      const newErrors = { ...errors };
      delete newErrors.githubToken;
      setErrors(newErrors);
    }
  };

  /**
   * @summary Handles the change event for the ChatGPT token input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleChatgptTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatgptToken(e.target.value);
    if (errors.chatgptToken) {
      const newErrors = { ...errors };
      delete newErrors.chatgptToken;
      setErrors(newErrors);
    }
  };

  /**
   * @summary Toggles the visibility of the GitHub token input
   */
  const toggleGithubTokenVisibility = () => {
    setShowGithubToken(!showGithubToken);
  };

  /**
   * @summary Toggles the visibility of the ChatGPT token input
   */
  const toggleChatgptTokenVisibility = () => {
    setShowChatgptToken(!showChatgptToken);
  };

  /**
   * @summary Handles the form submission.
   * @description Validates the form, stores the tokens in localStorage, and navigates to the commits page.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    const controller = new AbortController();
    try {
      setIsLoading(true);

      e.preventDefault()
      const newErrors: { [key: string]: string } = {};

      if (!githubToken) {
        newErrors.githubToken = intl.formatMessage({ id: 'form.githubToken.required' });
      }
      if (!chatgptToken) {
        newErrors.chatgptToken = intl.formatMessage({ id: 'form.chatgptToken.required' });
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      setShowGithubToken(false);
      setShowChatgptToken(false);

      const userGithub = await fetchUser(githubToken, controller.signal);
      await testApiKeyOpenAI(chatgptToken, controller.signal);

      localStorage.setItem("github_username", userGithub.login);
      localStorage.setItem("github_token", githubToken);
      localStorage.setItem("chatgpt_token", chatgptToken);

      router.push("/commits");
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-end">
          <button onClick={toggleLocale} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
            {locale === 'en' ? 'Español' : 'English'}
          </button>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight">
                  <FormattedMessage id="app.title" />
                </h1>
                <p className="text-lg text-gray-400 max-w-xl">
                  <FormattedMessage id="app.description" />
                </p>
              </div>

              <div className="bg-gray-900 border-gray-800 rounded-lg">
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="github-token" className="text-sm font-medium text-white flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GithubSvg height={20} width={20} color='#FFFFFF' />
                            <FormattedMessage id="form.githubToken.label" />
                          </div>
                          <Popover content={intl.formatMessage({ id: 'popover.githubToken' })}>
                            <InfoSvg className="cursor-pointer" height={18} width={18} color='#FFFFFF' />
                          </Popover>
                        </label>
                        <div className="relative">
                          <input
                            id="github-token"
                            type={showGithubToken ? "text" : "password"}
                            disabled={isLoading}
                            placeholder={intl.formatMessage({ id: 'form.githubToken.placeholder' })}
                            value={githubToken}
                            onChange={handleGithubTokenChange}
                            className={`bg-gray-800 border-gray-700 rounded-md w-full text-white placeholder-gray-500 border px-4 py-1 pr-12 ${errors.githubToken ? 'border-red-500' : ''}`}
                          />
                          <div className="absolute right-3 top-2">
                            <ToggleVisibility
                              isVisible={showGithubToken}
                              onToggle={setShowGithubToken}
                              size={18}
                              color="#3B82F6"
                            />
                          </div>
                        </div>
                        {errors.githubToken && <p className="text-xs text-red-500 mt-1">{errors.githubToken}</p>}
                        <p className="text-xs text-gray-500">
                          <FormattedMessage
                            id="form.githubToken.guide"
                            values={{
                              link: <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                <FormattedMessage id="guide.link" />
                              </a>
                            }}
                          />
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="chatgpt-token" className="text-sm font-medium text-white flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ChatGptSvg height={16} width={16} color='#FFFFFF' />
                            <FormattedMessage id="form.chatgptToken.label" />
                          </div>
                          <Popover content={intl.formatMessage({ id: 'popover.chatgptToken' })}>
                            <InfoSvg className="cursor-pointer" height={18} width={18} color='#FFFFFF' />
                          </Popover>
                        </label>
                        <div className="relative">
                          <input
                            id="chatgpt-token"
                            type={showChatgptToken ? "text" : "password"}
                            disabled={isLoading}
                            placeholder={intl.formatMessage({ id: 'form.chatgptToken.placeholder' })}
                            value={chatgptToken}
                            onChange={handleChatgptTokenChange}
                            className={`bg-gray-800 border-gray-700 rounded-md w-full text-white placeholder-gray-500 border px-4 py-1 pr-12 ${errors.chatgptToken ? 'border-red-500' : ''}`}
                          />
                          <div className="absolute right-3 top-2">
                            <ToggleVisibility
                              isVisible={showChatgptToken}
                              onToggle={setShowChatgptToken}
                              size={18}
                              color="#3B82F6"
                            />
                          </div>
                        </div>
                        {errors.chatgptToken && <p className="text-xs text-red-500 mt-1">{errors.chatgptToken}</p>}
                        <p className="text-xs text-gray-500">
                          <FormattedMessage
                            id="form.chatgptToken.guide"
                            values={{
                              link: <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                <FormattedMessage id="guide.link" />
                              </a>
                            }}
                          />
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? (
                          <FormattedMessage id="form.button.loading" />
                        ) : (
                          <>
                            <FormattedMessage id="form.button.submit" />
                            <ArrowRightSvg className="ml-2" height={16} width={16} color='#FFFFFF' />
                          </>
                        )}
                    </button>
                  </form>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <FormattedMessage id="footer.secure" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <FormattedMessage id="footer.realtime" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <FormattedMessage id="footer.ai_insights" />
                </div>
              </div>

              <div
                onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:bg-gray-900/80 hover:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <LockSvg width={20} height={20} color="#10B981" strokeWidth={2} />
                    Privacidad y Seguridad de la Información
                  </div>
                  <div className={`transition-transform duration-300 ${showPrivacyInfo ? 'rotate-90' : 'rotate-0'}`}>
                    <ArrowRightSvg height={16} width={16} color='#9CA3AF' />
                  </div>
                </h3>

                <div className={`text-justify space-y-0 text-sm text-gray-400 max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out ${showPrivacyInfo ? 'max-h-96 opacity-100 space-y-3 md:max-h-[500px]' : ''}`}>
                  <p>
                    La seguridad de tu información es nuestra máxima prioridad. Todos los datos que ingreses en esta aplicación se utilizan <span className="text-white font-medium">únicamente para generar el resultado esperado</span> y en ningún momento son almacenados ni compartidos con terceros.
                  </p>
                  <p>
                    En el inicio de la aplicación solicitamos <span className="text-white font-medium">tokens de GitHub y OpenAI</span> con el único propósito de autenticar y mostrar los resultados que tú mismo solicitas. Estos datos no son guardados, registrados ni usados con fines distintos a la ejecución de la funcionalidad de la aplicación.
                  </p>
                  <p>
                    Puedes tener la certeza de que <span className="text-white font-medium">ninguna información compromete tu privacidad</span> ni será utilizada fuera del contexto específico de tu consulta.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="/images/digital-enthusiasm.png"
              alt="Developer analytics dashboard"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}