import { useEffect } from 'react'

export function useSEO({ title, description, keywords = '' }) {
  useEffect(() => {
    document.title = title ? `${title} - CyberLock Tools` : 'CyberLock Tools'

    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      document.head.appendChild(metaDescription)
    }
    metaDescription.content = description

    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.name = 'keywords'
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.content = keywords
    }

    window.scrollTo(0, 0)
  }, [title, description, keywords])
}
