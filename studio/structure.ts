import type {StructureResolver} from 'sanity/structure'

// Document types that should only ever have ONE document
export const SINGLETONS = ['siteSettings']

// Controls the left-hand sidebar in the Studio
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Restaurant Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('menuCategory').title('Menu Categories'),
      S.documentTypeListItem('menuItem').title('Menu Items'),
      S.listItem()
        .title('Menu Items by Category')
        .child(
          S.documentTypeList('menuCategory')
            .title('Pick a category')
            .child((categoryId) =>
              S.documentList()
                .title('Items')
                .filter('_type == "menuItem" && category._ref == $categoryId')
                .params({categoryId}),
            ),
        ),
    ])
