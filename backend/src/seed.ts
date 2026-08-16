/**
 * Seed script — inserts artisans and products into MongoDB.
 * Links each product to its artisan.
 *
 * Usage: npm run seed
 */
import mongoose from "mongoose";
import env from "./config/env.js";
import Product from "./models/Product.js";
import Artisan from "./models/Artisan.js";

const artisanData = [
  {
    name: "Meera Devi",
    bio: "A third-generation potter from the clay-rich banks of the Ganga in Uttar Pradesh.",
    story:
      "Meera Devi grew up watching her grandmother shape the earth with bare hands, turning raw terracotta into objects of quiet beauty. At age nine, she began her apprenticeship, learning that the potter's wheel is not just a tool — it is a conversation between the artisan and the earth. Today, Meera runs a small cooperative of 12 women potters in her village, keeping alive a tradition that stretches back 3,000 years. Each piece she creates carries the memory of her ancestors and the hope of her children.",
    craft: "Pottery",
    location: { city: "Khurja", state: "Uttar Pradesh" },
    profileImage:
      "https://villagesquare.in/jharkhand-woman-turns-entrepreneur-making-bamboo-handicrafts/",
    coverImage:
      "https://villagesquare.in/jharkhand-woman-turns-entrepreneur-making-bamboo-handicrafts/",
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
      "https://yourstory.com/smbstory/india-brands-reviving-handicrafts-artisans-smbs",
    coverImage:
      "https://yourstory.com/smbstory/india-brands-reviving-handicrafts-artisans-smbs",
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
      "https://www.thegoodloop.com/empowering-artisans-the-keepers-of-our-heritage/",
    coverImage:
      "https://www.thegoodloop.com/empowering-artisans-the-keepers-of-our-heritage/",
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
      "https://aksahomedecor.com/blogs/news/the-rise-of-indian-handicrafts-in-australia-a-look-at-the-growing-trend-and-where-to-find-them?srsltid=AfmBOoqxDpXYReQOwwLlTrYO0cxXIkOTHsazkHyHwbPqZXevhErJ9ja-",
    coverImage:
      "https://aksahomedecor.com/blogs/news/the-rise-of-indian-handicrafts-in-australia-a-look-at-the-growing-trend-and-where-to-find-them?srsltid=AfmBOoqxDpXYReQOwwLlTrYO0cxXIkOTHsazkHyHwbPqZXevhErJ9ja-",
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
      "https://www.originalbuddhas.com/blog/5-important-artisans-around-the-world?srsltid=AfmBOoqZ_v1ELsG4vEB4RcLwC7mbsWMNpPvlTVJI4eNtQMn6yHNwh-8C",
    coverImage:
      "https://www.originalbuddhas.com/blog/5-important-artisans-around-the-world?srsltid=AfmBOoqZ_v1ELsG4vEB4RcLwC7mbsWMNpPvlTVJI4eNtQMn6yHNwh-8C",
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
      "https://www.instagram.com/p/DXtORjukx3z/",
    coverImage:
      "https://www.instagram.com/p/DXtORjukx3z/",
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
      "https://byhandfromtheheart.wordpress.com/2017/05/19/meet-the-maker-subramani-the-potters-shed-kodaikanal-stoneware-potter/",
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
      "https://images.unsplash.com/photo-1595163623728-98e354923f54?auto=format&fit=crop&q=80&w=800",
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
      "https://images.unsplash.com/photo-1615461971485-9e3d93b45502?auto=format&fit=crop&q=80&w=800",
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
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
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
      "https://images.unsplash.com/photo-1610729790676-e8d9d44cf617?auto=format&fit=crop&q=80&w=800",
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
      "https://images.unsplash.com/photo-1576487248866-993d50849925?auto=format&fit=crop&q=80&w=800",
    ],
    glbAsset: "",
    stock: 8,
    ratings: { average: 4.6, count: 14 },
    artisanName: "Zainab Khatun",
  },
];

const seed = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("✅  Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    await Artisan.deleteMany({});
    console.log("🗑️   Cleared existing products and artisans");

    // Insert artisans
    const insertedArtisans = await Artisan.insertMany(
      artisanData.map(({ ...data }) => data)
    );
    console.log(`🎨  Seeded ${insertedArtisans.length} artisans`);

    // Build artisan name → id map
    const artisanMap = new Map<string, mongoose.Types.ObjectId>();
    for (let i = 0; i < artisanData.length; i++) {
      artisanMap.set(artisanData[i].name, insertedArtisans[i]._id as mongoose.Types.ObjectId);
    }

    // Insert products with artisan refs
    const productsToInsert = productData.map(({ artisanName, ...rest }) => ({
      ...rest,
      artisan: artisanMap.get(artisanName) || null,
    }));

    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`🌱  Seeded ${insertedProducts.length} products`);

    // Update artisans with product refs
    for (const product of insertedProducts) {
      const artisanId = (product as any).artisan;
      if (artisanId) {
        await Artisan.findByIdAndUpdate(artisanId, {
          $push: { products: product._id },
        });
      }
    }
    console.log("🔗  Linked products to artisans");

    console.log("\n✅  Seed complete!\n");
    console.log("Artisans:");
    for (const a of insertedArtisans) {
      console.log(`   • ${a.name}  (${a.craft}, ${a.location.state})`);
    }
    console.log("\nProducts:");
    for (const p of insertedProducts) {
      const artisanName = productData.find(
        (pd) => artisanMap.get(pd.artisanName)?.toString() === (p as any).artisan?.toString()
      )?.artisanName;
      console.log(`   • ${p.name}  — ₹${p.price.toLocaleString("en-IN")} → ${artisanName}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌  Seed failed:", (error as Error).message);
    process.exit(1);
  }
};

seed();
