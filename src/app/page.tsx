'use client'

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image";
import Popover from "./components/Popover";
import { FormattedMessage, useIntl } from 'react-intl';
import { useI18n } from './context/I18nProvider';

/**
 * @summary The home page of the application.
 * @description This page allows the user to enter their GitHub and ChatGPT tokens to start analyzing their commits.
 * It includes form validation and popovers to provide information to the user.
 * @returns {JSX.Element} The rendered home page.
 */
export default function HomePage() {
  const [githubToken, setGithubToken] = useState("")
  const [chatgptToken, setChatgptToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
   * @summary Handles the form submission.
   * @description Validates the form, stores the tokens in localStorage, and navigates to the commits page.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
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
      return;
    }

    setIsLoading(true)

    localStorage.setItem("github_token", githubToken)
    localStorage.setItem("chatgpt_token", chatgptToken)

    router.push("/commits");
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
                            <Image src='/images/github.png' alt='github image' width={16} height={16} className="text-gray-400" />
                            <FormattedMessage id="form.githubToken.label" />
                          </div>
                          <Popover content={intl.formatMessage({ id: 'popover.githubToken' })}>
                            <Image src="/images/information.png" alt="Information" width={16} height={16} className="cursor-pointer" />
                          </Popover>
                        </label>
                        <input
                          id="github-token"
                          type="password"
                          placeholder={intl.formatMessage({ id: 'form.githubToken.placeholder' })}
                          value={githubToken}
                          onChange={handleGithubTokenChange}
                          className={`bg-gray-800 border-gray-700 rounded-md w-full text-white placeholder-gray-500 border px-4 py-1 ${errors.githubToken ? 'border-red-500' : ''}`}
                        />
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
                            <Image src="/images/chatgpt.png" alt="ChatGPT image" width={14} height={14} />
                            <FormattedMessage id="form.chatgptToken.label" />
                          </div>
                          <Popover content={intl.formatMessage({ id: 'popover.chatgptToken' })}>
                            <Image src="/images/information.png" alt="Information" width={16} height={16} className="cursor-pointer" />
                          </Popover>
                        </label>
                        <input
                          id="chatgpt-token"
                          type="password"
                          placeholder={intl.formatMessage({ id: 'form.chatgptToken.placeholder' })}
                          value={chatgptToken}
                          onChange={handleChatgptTokenChange}
                          className={`bg-gray-800 border-gray-700 rounded-md w-full text-white placeholder-gray-500 border px-4 py-1 ${errors.chatgptToken ? 'border-red-500' : ''}`}
                        />
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
                            <Image src="/images/right-arrow.png" alt="Arrow right image" width={16} height={16} className="ml-4" />
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