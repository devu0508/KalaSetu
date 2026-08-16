/**
 * Auto-seed utility — checks if the Artisan and Product collections are empty
 * and populates them with default data on server startup.
 *
 * This ensures the app always has showcase data without requiring a manual
 * `npm run seed` step.
 */
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Artisan from "../models/Artisan.js";

const artisanData = [
  {
    name: "Meera Devi",
    bio: "A third-generation potter from the clay-rich banks of the Ganga in Uttar Pradesh.",
    story:
      "Meera Devi grew up watching her grandmother shape the earth with bare hands, turning raw terracotta into objects of quiet beauty. At age nine, she began her apprenticeship, learning that the potter's wheel is not just a tool — it is a conversation between the artisan and the earth. Today, Meera runs a small cooperative of 12 women potters in her village, keeping alive a tradition that stretches back 3,000 years. Each piece she creates carries the memory of her ancestors and the hope of her children.",
    craft: "Pottery",
    location: { city: "Khurja", state: "Uttar Pradesh" },
    profileImage:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=600",
    coverImage:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=1200",
    since: 1992,
    featured: true,
  },
  {
    name: "Rajan Mistry",
    bio: "A master weaver from Assam whose bamboo baskets have won national recognition.",
    story:
      "Rajan Mistry's hands have woven over ten thousand baskets in his lifetime — each one a meditation. Born in a small village on the edge of the Brahmaputra floodplains, he learned the art of bamboo weaving from his father at age seven. The bamboo itself, he says, teaches patience: you cannot force it. You must listen to the grain and the rhythm of the plant. Rajan now teaches at the district craft school, ensuring that the next generation learns this intricate art before it is lost to time.",
    craft: "Weaving",
    location: { city: "Sualkuchi", state: "Assam" },
    profileImage:
      "http://static1.squarespace.com/static/63489422aabcb306701a168a/6390b45b5d47f813bcf96a27/63ebf7b47511a36479e7a465/1741717837188/Siju+Shamji+Vishram73.jpeg?format=1500w",
    coverImage:
      "http://static1.squarespace.com/static/63489422aabcb306701a168a/6390b45b5d47f813bcf96a27/63ebf7b47511a36479e7a465/1741717837188/Siju+Shamji+Vishram73.jpeg?format=1500w",
    since: 1985,
    featured: true,
  },
  {
    name: "Suresh Vishwakarma",
    bio: "A Dhokra metal artisan from Bastar, Chhattisgarh, carrying 4,000 years of lost-wax casting tradition.",
    story:
      "Suresh Vishwakarma belongs to the Vishwakarma community, the traditional craftsmen of India who believe they are descendants of the divine architect himself. His studio in Bastar is a shrine of fire and molten metal. Using the ancient Dhokra (lost-wax) technique — unchanged for 4,000 years — he creates each piece by hand-rolling beeswax into intricate shapes, coating them in clay, then melting in brass. No two pieces are ever identical. Suresh's work has been exhibited in Paris, London, and New York, yet he continues to live and work in his ancestral village.",
    craft: "Metalwork",
    location: { city: "Bastar", state: "Chhattisgarh" },
    profileImage:
      "https://production.ruralindiaonline.org/uploads/IMG_8039_8a30f08d42.jpg",
    coverImage:
      "https://production.ruralindiaonline.org/uploads/IMG_8039_8a30f08d42.jpg",
    since: 1978,
    featured: true,
  },
  {
    name: "Fatima Begum",
    bio: "A master block-print artisan from Sanganer, Rajasthan, keeping alive the 500-year-old tradition.",
    story:
      "In the walled lanes of Sanganer, Fatima Begum's family has been printing fabric for over five centuries. The hand-carved wooden blocks that stamp intricate patterns onto fine cotton were made by her great-great-grandfather. Fatima learned by watching, then by doing — first helping mix the natural dyes from indigo, pomegranate and turmeric, then learning the careful art of block alignment that prevents overlapping. Today, her hand-block printed sarees are sought by collectors worldwide. She is one of only three artisans in India who can execute the legendary 108-block Sanganeri floral pattern.",
    craft: "Textile",
    location: { city: "Sanganer", state: "Rajasthan" },
    profileImage:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600",
    coverImage:
      "https://images.unsplash.com/photo-1610030469983-98e74d98c9b6?auto=format&fit=crop&q=80&w=1200",
    since: 1995,
    featured: false,
  },
  {
    name: "Govind Shetty",
    bio: "A sandalwood carver from Mysuru whose intricate sculptures are national treasures.",
    story:
      "The scent of sandalwood has followed Govind Shetty since childhood. His father, a royal craftsman for the Mysore palace, began teaching him to carve at age ten with a single chisel. Today, Govind can extract from a single block of sandalwood figures so fine that the fingers of a deity are no thicker than a blade of grass. Each carving takes between six months to two years to complete. Govind has received the National Award for Master Craftsperson and is recognized by UNESCO as a keeper of intangible cultural heritage. He uses only sustainably sourced sandalwood certified by the Karnataka Forest Department.",
    craft: "Woodwork",
    location: { city: "Mysuru", state: "Karnataka" },
    profileImage:
      "https://images.pexels.com/photos/37513688/pexels-photo-37513688.jpeg",
    coverImage:
      "https://images.pexels.com/photos/37513688/pexels-photo-37513688.jpeg",
    since: 1980,
    featured: true,
  },
  {
    name: "Zainab Khatun",
    bio: "A Pashmina embroiderer from Srinagar whose needlework is called 'painting with thread'.",
    story:
      "In Kashmir's long winters, Zainab Khatun's needles dance across the finest Pashmina wool, creating garden scenes so detailed they are indistinguishable from watercolour paintings. The art of Kashmiri Sozni embroidery, which Zainab has practiced for 35 years, requires a unique single-needle technique where both sides of the shawl are identical — so precise that the 'inside' is as beautiful as the 'outside'. Her shawls have been gifted to foreign dignitaries by the Indian government. Each shawl takes three to nine months to embroider and represents 2,000 to 8,000 hours of work.",
    craft: "Textile",
    location: { city: "Srinagar", state: "Jammu & Kashmir" },
    profileImage:
      "http://soznikashmir.com/cdn/shop/files/fb_bg_a41718b5-b27e-487d-95d3-1f7cc77a7712.jpg?v=1631084742",
    coverImage:
      "http://soznikashmir.com/cdn/shop/files/fb_bg_a41718b5-b27e-487d-95d3-1f7cc77a7712.jpg?v=1631084742",
    since: 1989,
    featured: false,
  },
];

const productData = [
  {
    name: "Terracotta Vase",
    description:
      "A beautifully handcrafted terracotta vase, shaped by the skilled hands of rural artisans using traditional techniques passed down through generations. The natural earthy tones and organic form make it a perfect centrepiece for any space.",
    price: 2400,
    category: "Pottery",
    images: [
      "https://exclusivelane.com/cdn/shop/files/download_0af9ca7f-e3d7-4b20-9741-06b694475426_1024x.jpg?v=1750356209",
    ],
    glbAsset: "/glb_assets/vase.glb",
    stock: 25,
    ratings: { average: 4.5, count: 18 },
    artisanName: "Meera Devi",
  },
  {
    name: "Woven Bamboo Basket",
    description:
      "An intricately woven bamboo basket, perfect for home décor or everyday use. Each basket is a testament to the weaver's patience and mastery of the ancient craft of bamboo weaving.",
    price: 1800,
    category: "Weaving",
    images: [
      "https://forestpost.in/wp-content/uploads/2026/04/bamboo-basket-brown-and-orange-border-m-9x-3-768x768.jpg",
    ],
    glbAsset: "",
    stock: 40,
    ratings: { average: 4.2, count: 12 },
    artisanName: "Rajan Mistry",
  },
  {
    name: "Brass Oil Lamp",
    description:
      "A magnificent brass oil lamp, hand-forged by master metalworkers using the 4,000-year-old Dhokra lost-wax casting technique. Its warm glow brings an aura of tradition and spirituality to any space.",
    price: 3200,
    category: "Metalwork",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo2RJSJfHz182oyRQYTzS2H72qQVm1nAa2KF4KoeyhYCTg8xLt4c3ICJ6I&s=10",
    ],
    glbAsset: "/glb_assets/owl_metal_sculpture.glb",
    stock: 15,
    ratings: { average: 4.8, count: 24 },
    artisanName: "Suresh Vishwakarma",
  },
  {
    name: "Hand-Block Print Saree",
    description:
      "A luxurious saree adorned with intricate hand-block prints, using the 500-year-old Sanganeri tradition from Rajasthan. Natural dyes from indigo and pomegranate give this piece its signature richness.",
    price: 8500,
    category: "Textile",
    images: [
      "https://shobitam.in/cdn/shop/files/RDR523_8.jpg?v=1757264516&width=1800",
    ],
    glbAsset: "",
    stock: 10,
    ratings: { average: 4.7, count: 31 },
    artisanName: "Fatima Begum",
  },
  {
    name: "Sandalwood Carving",
    description:
      "An exquisite sandalwood carving, painstakingly sculpted to bring out the natural beauty and fragrance of this precious wood. Crafted from sustainably sourced Karnataka sandalwood by a national award-winning artisan.",
    price: 12000,
    category: "Woodwork",
    images: [
      "https://www.ragaarts.com/cdn/shop/articles/sandal-elephant-blog.jpg?crop=center&height=900&v=1724132793&width=2400",
    ],
    glbAsset: "/glb_assets/christus_rex_christ_the_king.glb",
    stock: 5,
    ratings: { average: 4.9, count: 8 },
    artisanName: "Govind Shetty",
  },
  {
    name: "Kashmiri Shawl",
    description:
      "A hand-embroidered Kashmiri Pashmina shawl showcasing the legendary Sozni needlework of Kashmir. Each stitch is identical on both sides, a technique mastered over decades. Requires 2,000+ hours of work.",
    price: 15000,
    category: "Textile",
    images: [
      "https://www.shoppinginkashmir.com/cdn/shop/files/7_2_979fc186-4be3-4d0c-8b3a-bd9a6e58419a.png?v=1746084900&width=823",
    ],
    glbAsset: "",
    stock: 8,
    ratings: { average: 4.6, count: 14 },
    artisanName: "Zainab Khatun",
  },
];

/**
 * Check if artisans and products collections are empty, and seed them
 * if necessary. Called once on server startup after DB connection.
 */
export const autoSeed = async (): Promise<void> => {
  try {
    const artisanCount = await Artisan.countDocuments();
    const productCount = await Product.countDocuments();

    if (artisanCount > 0 && productCount > 0) {
      console.log(
        `📦  Database already has ${artisanCount} artisan(s) and ${productCount} product(s) — skipping auto-seed`
      );
      return;
    }

    console.log("🌱  Collections empty — auto-seeding artisans & products...");

    // Clear any partial data
    if (artisanCount === 0) await Product.deleteMany({});
    if (productCount === 0) await Artisan.deleteMany({});
    await Product.deleteMany({});
    await Artisan.deleteMany({});

    // Insert artisans
    const insertedArtisans = await Artisan.insertMany(artisanData);
    console.log(`   🎨  Seeded ${insertedArtisans.length} artisans`);

    // Build artisan name → id map
    const artisanMap = new Map<string, mongoose.Types.ObjectId>();
    for (let i = 0; i < artisanData.length; i++) {
      artisanMap.set(
        artisanData[i].name,
        insertedArtisans[i]._id as mongoose.Types.ObjectId
      );
    }

    // Insert products with artisan refs
    const productsToInsert = productData.map(({ artisanName, ...rest }) => ({
      ...rest,
      artisan: artisanMap.get(artisanName) || null,
    }));

    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`   🛍️   Seeded ${insertedProducts.length} products`);

    // Update artisans with product refs
    for (const product of insertedProducts) {
      const artisanId = (product as any).artisan;
      if (artisanId) {
        await Artisan.findByIdAndUpdate(artisanId, {
          $push: { products: product._id },
        });
      }
    }
    console.log("   🔗  Linked products to artisans");
    console.log("✅  Auto-seed complete!\n");
  } catch (error) {
    // Non-fatal: log the error but don't crash the server
    console.error(
      "⚠️   Auto-seed failed (non-fatal):",
      (error as Error).message
    );
  }
};
