import {siteSettings} from './siteSettings'
import {menuCategory} from './menuCategory'
import {menuItem} from './menuItem'
import {openingHours} from './objects/openingHours'
import {imageWithAlt} from './objects/imageWithAlt'

// Every schema type must be registered here
export const schemaTypes = [
  // documents
  siteSettings,
  menuCategory,
  menuItem,
  // reusable objects
  openingHours,
  imageWithAlt,
]
