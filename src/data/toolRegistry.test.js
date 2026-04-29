import { describe, expect, it } from 'vitest'
import { TOOL_CATALOG, TOOL_COMPONENT_KEYS, buildToolComponentsFromModules } from './toolRegistry'

const TOOL_MODULE_LOADERS = import.meta.glob('../tools/*.jsx')

function getComponentLoadersByName(moduleLoaders) {
  return Object.fromEntries(
    Object.entries(moduleLoaders).map(([modulePath, moduleLoader]) => {
      const filename = modulePath.split('/').pop() || ''
      const componentName = filename.replace(/\.(jsx|js|tsx|ts)$/u, '')
      return [componentName, moduleLoader]
    })
  )
}

describe('tool registry consistency', () => {
  it('maps every catalog tool title to a component key', () => {
    for (const tool of TOOL_CATALOG) {
      expect(TOOL_COMPONENT_KEYS[tool.title], `Missing component key for ${tool.title}`).toBeTruthy()
    }
  })

  it('builds tool components from registry module loaders', () => {
    expect(() => buildToolComponentsFromModules(TOOL_MODULE_LOADERS, (loader) => loader)).not.toThrow()
  })

  it('loads every mapped tool module successfully', async () => {
    const componentLoaders = getComponentLoadersByName(TOOL_MODULE_LOADERS)

    for (const [toolTitle, componentName] of Object.entries(TOOL_COMPONENT_KEYS)) {
      const loader = componentLoaders[componentName]
      expect(loader, `Missing module loader for ${toolTitle} (${componentName})`).toBeTypeOf('function')

      const module = await loader()
      expect(module.default, `Missing default export for ${toolTitle} (${componentName})`).toBeTruthy()
    }
  })
})
