import { useEffect } from 'react'

const BRAND_NAME = "R0uty's Cyber Lab"

export function useSEO({ title, description, keywords = '' }) {
  useEffect(() => {
    document.title = !title
      ? BRAND_NAME
      : title.includes(BRAND_NAME)
        ? title
        : `${title} - ${BRAND_NAME}`

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
  }, [title, description, keywords])
}
