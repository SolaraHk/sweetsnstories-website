export type Category = 'Seasonal' | 'Chiffon' | 'Mini' | 'Bespoke';

export type Product = {
  slug: string;
  story: string;
  name: string;
  jp?: string;
  notes: string;
  price: string;
  numericPrice: number;
  category: Category;
  badge?: string;
  image: string;
  description: string;
  tags: string[];
};

export const products: Product[] = [
  {
    slug: 'pear-earl-grey',
    story: 'Story C12',
    name: 'Pear & Earl Grey Chiffon',
    notes: 'Light · Floral',
    price: 'HK$438',
    numericPrice: 438,
    category: 'Chiffon',
    image: '/assets/products/pear-earl-grey.jpg',
    description: 'Soft Earl Grey chiffon layered with pear compote, vanilla cream and a quiet floral finish.',
    tags: ['Pear', 'Tea Cream', 'Light'],
  },
  {
    slug: 'mikan-mango-chiffon',
    story: 'Story C07',
    name: 'Mikan & Mango Chiffon',
    jp: 'みかん × マンゴー パンダンシフォン',
    notes: 'Citrus · Soft',
    price: 'HK$428',
    numericPrice: 428,
    category: 'Seasonal',
    badge: 'Seasonal',
    image: '/assets/products/mikan-mango.jpg',
    description: 'Feather-light pandan chiffon layered with mikan, mango and coconut water jelly. Bright, delicate and softly tropical.',
    tags: ['Citrus', 'Light Cream', 'Pandan'],
  },
  {
    slug: 'black-rice-taro',
    story: 'Story C18',
    name: 'Black Glutinous Rice Taro',
    notes: 'Nutty · Creamy',
    price: 'HK$468',
    numericPrice: 468,
    category: 'Chiffon',
    image: '/assets/products/black-rice-taro.jpg',
    description: 'Taro cream, black glutinous rice and a nutty chiffon base for a softly nostalgic celebration cake.',
    tags: ['Taro', 'Black Rice', 'Creamy'],
  },
  {
    slug: 'pistachio-genmaicha',
    story: 'Story C21',
    name: 'Pistachio Genmaicha',
    notes: 'Roasted · Nutty',
    price: 'HK$488',
    numericPrice: 488,
    category: 'Seasonal',
    badge: 'New',
    image: '/assets/products/pistachio-genmaicha.jpg',
    description: 'Roasted genmaicha cream, pistachio crumb and a mellow chiffon crumb with an elegant tea finish.',
    tags: ['Pistachio', 'Genmaicha', 'New'],
  },
  {
    slug: 'white-peach',
    story: 'Story C15',
    name: 'White Peach Chiffon',
    notes: 'Juicy · Fragrant',
    price: 'HK$458',
    numericPrice: 458,
    category: 'Seasonal',
    image: '/assets/products/white-peach.jpg',
    description: 'White peach, airy chantilly and vanilla chiffon for summer birthdays and thank-yous.',
    tags: ['Peach', 'Vanilla', 'Fragrant'],
  },
  {
    slug: 'strawberry-milk-cube',
    story: 'Story M04',
    name: 'Strawberry Milk Cube',
    notes: 'Berry · Milky',
    price: 'HK$398',
    numericPrice: 398,
    category: 'Mini',
    image: '/assets/products/strawberry-milk-cube.jpg',
    description: 'A small square chiffon layered with strawberry puree, milk cream and fresh berries.',
    tags: ['Strawberry', 'Mini', 'Milk Cream'],
  },
  {
    slug: 'floral-vanilla',
    story: 'Bespoke 01',
    name: 'Floral Vanilla Chiffon',
    notes: 'Custom · Vanilla',
    price: 'From HK$588',
    numericPrice: 588,
    category: 'Bespoke',
    image: '/assets/products/floral-vanilla.jpg',
    description: 'A custom celebration chiffon finished with seasonal florals, vanilla cream and hand-piped details.',
    tags: ['Custom', 'Floral', 'Vanilla'],
  },
  {
    slug: 'strawberry-chantilly',
    story: 'Story C03',
    name: 'Strawberry Chantilly',
    notes: 'Fresh · Classic',
    price: 'HK$428',
    numericPrice: 428,
    category: 'Chiffon',
    image: '/assets/products/strawberry-chantilly.jpg',
    description: 'Classic fresh strawberry chiffon with handmade cream and a soft birthday finish.',
    tags: ['Strawberry', 'Classic', 'Fresh'],
  },
  {
    slug: 'chestnut-log',
    story: 'Season 11',
    name: 'Chestnut Christmas Log',
    notes: 'Chestnut · Cocoa',
    price: 'HK$468',
    numericPrice: 468,
    category: 'Seasonal',
    badge: 'Limited',
    image: '/assets/products/chestnut-log.jpg',
    description: 'A seasonal chiffon roll with chestnut cream, cocoa notes and a festive finish.',
    tags: ['Chestnut', 'Cocoa', 'Limited'],
  },
  {
    slug: 'mikan-oval',
    story: 'Story C19',
    name: 'Mikan Oval Cake',
    notes: 'Citrus · Jelly',
    price: 'HK$448',
    numericPrice: 448,
    category: 'Seasonal',
    image: '/assets/products/mikan-oval.jpg',
    description: 'Mikan jelly and soft citrus cream arranged in an oval celebration cake.',
    tags: ['Mikan', 'Jelly', 'Citrus'],
  },
  {
    slug: 'black-sesame',
    story: 'Story C20',
    name: 'Black Sesame Praline',
    notes: 'Roasted · Mineral',
    price: 'HK$468',
    numericPrice: 468,
    category: 'Chiffon',
    image: '/assets/products/black-sesame.jpg',
    description: 'Black sesame cream, praline crunch and a roasted finish over soft chiffon layers.',
    tags: ['Sesame', 'Praline', 'Roasted'],
  },
  {
    slug: 'durian-tart',
    story: 'Story T02',
    name: 'Mon Thong Durian Tart',
    notes: 'Rich · Tropical',
    price: 'HK$498',
    numericPrice: 498,
    category: 'Mini',
    image: '/assets/products/durian-tart.jpg',
    description: 'Mon Thong durian cream and tropical fruit notes in a small tart-style celebration cake.',
    tags: ['Durian', 'Tropical', 'Rich'],
  },
];

export const featuredProduct = products.find((product) => product.slug === 'mikan-mango-chiffon')!;
export const favourites = products.slice(0, 3);
