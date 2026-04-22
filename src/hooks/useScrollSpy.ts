import { useState, useEffect, useCallback } from 'react'

interface Section {
  id: string
  ref: React.RefObject<HTMLElement | null>
}

export const useScrollSpy = (sections: Section[], offset: number = 100): string => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '')

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + offset

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i]
      if (section.ref.current) {
        const { offsetTop } = section.ref.current
        if (scrollPosition >= offsetTop) {
          setActiveSection(section.id)
          return
        }
      }
    }

    if (sections[0]?.ref.current && scrollPosition < offset) {
      setActiveSection(sections[0].id)
    }
  }, [sections, offset])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return activeSection
}