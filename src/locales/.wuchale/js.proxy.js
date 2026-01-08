
            
            /** @typedef {() => Promise<import("wuchale/runtime").CatalogModule>} CatalogMod
            /** @typedef {{[locale: string]: CatalogMod}} KeyCatalogs
            /** @type {{[loadID: string]: KeyCatalogs}} */
            const catalogs = {js: {id: () => import('./main.main.id.compiled.js'),en: () => import('./main.main.en.compiled.js')}}
            export const loadCatalog = (/** @type {string} */ loadID, /** @type {string} */ locale) => {
                return /** @type {CatalogMod} */ (/** @type {KeyCatalogs} */ (catalogs[loadID])[locale])()
            }
            export const loadIDs = ['js']
        