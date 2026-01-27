/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R = void> {
      toBeInTheDocument(): R
    }
  }

  interface Window {
    dataLayer?: any[]
    gtag?: (...args: any[]) => void
  }
}

export {}
