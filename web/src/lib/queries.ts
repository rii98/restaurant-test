// GROQ = Sanity's query language. Test these live in the Studio → "Vision" tab.
// Cheat sheet:  *[filter] | order(field asc) [slice] { projection }

export const settingsQuery = /* groq */ `
  *[_id == "siteSettings"][0]
`

// Categories, each with its visible items nested inside.
// `references(^._id)` = items whose reference points at the parent category.
export const menuQuery = /* groq */ `
  *[_type == "menuCategory"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "items": *[_type == "menuItem" && references(^._id) && available != false] | order(order asc) {
      _id, name, description, price, dietary, image
    }
  }[count(items) > 0]
`

export const featuredQuery = /* groq */ `
  *[_type == "menuItem" && featured == true && available != false] | order(order asc) [0...6] {
    _id, name, description, price, dietary, image,
    "category": category->title
  }
`
