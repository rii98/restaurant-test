// DEMO MODE data, used only when PUBLIC_SANITY_PROJECT_ID is empty.
// Mirrors studio/seed/seed.ndjson so the site looks the same before and after connecting Sanity.
import type {MenuCategory, MenuItem, SiteSettings, Special} from './types'

export const demoSettings: SiteSettings = {
  "name": "Himalayan Table",
  "tagline": "Home-style Nepali cooking, made fresh daily",
  "announcement": "Now open for Sunday brunch, 10am – 2pm",
  "about": "Himalayan Table is a family-run kitchen serving the dishes we grew up with: hand-folded momo, slow-simmered dal bhat, and spice blends ground in-house every morning.",
  "cuisine": "Nepali",
  "currency": "USD",
  "priceRange": "$$",
  "reservationUrl": "https://example.com/reserve",
  "orderUrl": "https://example.com/order",
  "phone": "+1 (555) 123-4567",
  "email": "hello@example.com",
  "address": {
    "street": "123 Main Street",
    "city": "Springfield",
    "region": "IL",
    "postalCode": "62701",
    "country": "US"
  },
  "timezone": "America/Chicago",
  "hours": [
    {
      "_key": "h0",
      "_type": "openingHours",
      "day": "Monday",
      "closed": true
    },
    {
      "_key": "h1",
      "_type": "openingHours",
      "day": "Tuesday",
      "closed": false,
      "opens": "11:00",
      "closes": "21:30"
    },
    {
      "_key": "h2",
      "_type": "openingHours",
      "day": "Wednesday",
      "closed": false,
      "opens": "11:00",
      "closes": "21:30"
    },
    {
      "_key": "h3",
      "_type": "openingHours",
      "day": "Thursday",
      "closed": false,
      "opens": "11:00",
      "closes": "21:30"
    },
    {
      "_key": "h4",
      "_type": "openingHours",
      "day": "Friday",
      "closed": false,
      "opens": "11:00",
      "closes": "22:30"
    },
    {
      "_key": "h5",
      "_type": "openingHours",
      "day": "Saturday",
      "closed": false,
      "opens": "11:00",
      "closes": "22:30"
    },
    {
      "_key": "h6",
      "_type": "openingHours",
      "day": "Sunday",
      "closed": false,
      "opens": "10:00",
      "closes": "21:00"
    }
  ],
  "social": {
    "instagram": "https://instagram.com/",
    "facebook": "https://facebook.com/"
  },
  "seoTitle": "Himalayan Table – Nepali Restaurant in Springfield",
  "seoDescription": "Authentic Nepali food in Springfield: hand-made momo, dal bhat, thukpa and more. Dine in, order online or book a table."
}

export const demoMenu: MenuCategory[] = [
  {
    "_id": "cat-momo",
    "title": "Momo",
    "slug": "momo",
    "description": "Hand-folded dumplings, steamed or fried.",
    "items": [
      {
        "_id": "item-chicken-momo",
        "name": "Chicken Momo",
        "description": "Juicy minced chicken with ginger, garlic and cilantro. Served with tomato-sesame chutney.",
        "price": 12.5,
        "dietary": [
          "spicy"
        ]
      },
      {
        "_id": "item-veg-momo",
        "name": "Veg Momo",
        "description": "Cabbage, carrot, paneer and spring onion.",
        "price": 11,
        "dietary": [
          "vegetarian"
        ]
      },
      {
        "_id": "item-jhol-momo",
        "name": "Jhol Momo",
        "description": "Steamed momo in a tangy, warming sesame-tomato broth.",
        "price": 13.5,
        "dietary": [
          "spicy"
        ]
      }
    ]
  },
  {
    "_id": "cat-mains",
    "title": "Mains",
    "slug": "mains",
    "description": "Served with rice and seasonal achar.",
    "items": [
      {
        "_id": "item-dal-bhat-set",
        "name": "Dal Bhat Set",
        "description": "Lentil soup, rice, seasonal vegetable curry, greens and pickle.",
        "price": 16,
        "dietary": [
          "vegetarian",
          "gluten-free"
        ]
      },
      {
        "_id": "item-goat-curry",
        "name": "Goat Curry",
        "description": "Bone-in goat slow-cooked with Himalayan spices.",
        "price": 19,
        "dietary": [
          "gluten-free",
          "spicy"
        ]
      },
      {
        "_id": "item-chicken-thukpa",
        "name": "Chicken Thukpa",
        "description": "Hand-pulled noodle soup with vegetables and chicken.",
        "price": 15,
        "dietary": []
      }
    ]
  },
  {
    "_id": "cat-drinks",
    "title": "Drinks",
    "slug": "drinks",
    "description": "",
    "items": [
      {
        "_id": "item-masala-chiya",
        "name": "Masala Chiya",
        "description": "Spiced milk tea brewed the Kathmandu way.",
        "price": 4,
        "dietary": [
          "vegetarian"
        ]
      },
      {
        "_id": "item-mango-lassi",
        "name": "Mango Lassi",
        "description": "Yogurt, mango and a pinch of cardamom.",
        "price": 5.5,
        "dietary": [
          "vegetarian",
          "gluten-free"
        ]
      }
    ]
  }
]

export const demoFeatured: MenuItem[] = [
  {
    "_id": "item-chicken-momo",
    "name": "Chicken Momo",
    "description": "Juicy minced chicken with ginger, garlic and cilantro. Served with tomato-sesame chutney.",
    "price": 12.5,
    "dietary": [
      "spicy"
    ],
    "category": "Momo"
  },
  {
    "_id": "item-veg-momo",
    "name": "Veg Momo",
    "description": "Cabbage, carrot, paneer and spring onion.",
    "price": 11,
    "dietary": [
      "vegetarian"
    ],
    "category": "Momo"
  },
  {
    "_id": "item-dal-bhat-set",
    "name": "Dal Bhat Set",
    "description": "Lentil soup, rice, seasonal vegetable curry, greens and pickle.",
    "price": 16,
    "dietary": [
      "vegetarian",
      "gluten-free"
    ],
    "category": "Mains"
  }
]

export const demoSpecials = (today: string): Special[] => [
  {_id: 'demo-1', title: 'Sel Roti & Aloo Achar', description: 'Crispy rice-flour rings with spiced potato salad.', price: 9, date: today, soldOut: false},
  {_id: 'demo-2', title: 'Buff Choila', description: 'Smoky grilled buffalo with mustard oil and chilli.', price: 14, date: today, soldOut: true},
]
