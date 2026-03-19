/**
 * Firestore seed script — populates all required collections with sample data.
 *
 * Usage:
 *   1. Download a service account key from Firebase Console →
 *      Project settings → Service accounts → Generate new private key
 *   2. Save the downloaded JSON as:  scripts/serviceAccountKey.json
 *   3. Run:  npm run seed
 *
 * WARNING: This script OVERWRITES existing documents with the same IDs.
 * Run it once per environment. Delete serviceAccountKey.json afterwards.
 */

import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const keyPath = resolve(__dirname, 'serviceAccountKey.json');

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
} catch {
  console.error(
    '\n❌  Could not read scripts/serviceAccountKey.json\n' +
      '    Download it from Firebase Console → Project settings → Service accounts\n' +
      '    and save it as scripts/serviceAccountKey.json\n',
  );
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const isoNow = new Date().toISOString();

async function upsert(collection, id, data) {
  await db.collection(collection).doc(id).set(data, { merge: false });
  console.log(`  ✓ ${collection}/${id}`);
}

async function clearCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  if (snapshot.empty) return;
  // Firestore batch limit is 500 ops
  const chunks = [];
  for (let i = 0; i < snapshot.docs.length; i += 500) {
    chunks.push(snapshot.docs.slice(i, i + 500));
  }
  for (const chunk of chunks) {
    const batch = db.batch();
    chunk.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
  console.log(`  🗑  Deleted ${snapshot.size} docs from ${collectionName}`);
}

// ---------------------------------------------------------------------------
// siteSettings — single document ID: global
// ---------------------------------------------------------------------------
async function seedSiteSettings() {
  console.log('\n📄 siteSettings');
  await upsert('siteSettings', 'global', {
    siteName: { ar: 'قرنايل', en: 'Qarnayel' },
    tagline: {
      ar: 'قرية في قلب جبل لبنان',
      en: 'A village in the heart of Mount Lebanon',
    },
    heroTitle: {
      ar: 'اكتشف قرنايل',
      en: 'Discover Qarnayel',
    },
    heroSubtitle: {
      ar: 'طبيعة خلّابة، تاريخ عريق، وأجواء لا تُنسى',
      en: 'Breathtaking nature, rich history, and unforgettable moments',
    },
    ctas: [
      {
        label: { ar: 'استكشف الأماكن', en: 'Explore Places' },
        href: '/places',
      },
      {
        label: { ar: 'اكتشف التاريخ', en: 'Discover History' },
        href: '/history',
      },
    ],
    townIntroduction: {
      ar: 'قرنايل بلدة لبنانية تقع في قضاء المتن الأعلى على ارتفاع يتجاوز 1400 متر، تتميز بمناخها المعتدل وطبيعتها الخضراء وتاريخها العريق.',
      en: 'Qarnayel is a Lebanese village in the Metn district, sitting above 1,400 m elevation. It is known for its mild climate, lush scenery, and deep historical roots.',
    },
    contactEmail: 'info@qarnayel.lb',
    contactPhone: null,
    socialLinks: {
      facebook: null,
      instagram: null,
      youtube: null,
    },
    navItems: [
      { label: { ar: 'الأماكن', en: 'Places' }, path: '/places' },
      { label: { ar: 'التاريخ', en: 'History' }, path: '/history' },
      { label: { ar: 'تواصل معنا', en: 'Contact' }, path: '/contact' },
    ],
    updatedAt: isoNow,
  });
}

// ---------------------------------------------------------------------------
// pageContent — history intro & contact
// ---------------------------------------------------------------------------
async function seedPageContent() {
  console.log('\n📄 pageContent');

  await upsert('pageContent', 'history', {
    id: 'history',
    slug: 'history',
    status: 'published',
    title: { ar: 'عن قرنايل', en: 'About Qarnayel' },
    body: {
      ar: 'قرنايل بلدة لبنانية عريقة تقع في المتن الأعلى، تتميز بمناخها الجبلي المعتدل وطبيعتها الخضراء المورقة.\n\nتضم البلدة مواقع أثرية وطبيعية تعكس تاريخاً ممتداً عبر العصور، إذ شهدت توطّن الحضارات الفينيقية والرومانية والبيزنطية.',
      en: 'Qarnayel is a historic Lebanese village in the Upper Metn district, distinguished by its temperate mountain climate and verdant scenery.\n\nThe village contains archaeological and natural sites reflecting a history stretching across the ages, having been home to Phoenician, Roman, and Byzantine civilisations.',
    },
    seo: {
      ar: {
        title: 'تاريخ قرنايل — عبر العصور',
        description:
          'اكتشف تاريخ قرنايل، موقعها الجغرافي، طبيعتها، وما يميزها عن سائر بلدات المتن.',
      },
      en: {
        title: 'History of Qarnayel — Through the Ages',
        description:
          'Learn about the history, geography, nature, and unique character of Qarnayel in the Upper Metn.',
      },
    },
    updatedAt: isoNow,
  });

  await upsert('pageContent', 'contact', {
    id: 'contact',
    slug: 'contact',
    status: 'published',
    title: { ar: 'تواصل معنا', en: 'Contact Us' },
    body: {
      ar: 'يسعدنا تلقّي استفساراتكم وملاحظاتكم. يمكنكم التواصل معنا عبر البريد الإلكتروني أو وسائل التواصل الاجتماعي.',
      en: 'We welcome your enquiries and feedback. You can reach us by email or through our social media channels.',
    },
    seo: {
      ar: {
        title: 'تواصل معنا — قرنايل',
        description: 'تواصل مع فريق موقع قرنايل لأي استفسار أو اقتراح.',
      },
      en: {
        title: 'Contact Us — Qarnayel',
        description:
          'Get in touch with the Qarnayel website team for any enquiry or suggestion.',
      },
    },
    updatedAt: isoNow,
  });
}

// ---------------------------------------------------------------------------
// places — sample entries
// ---------------------------------------------------------------------------
async function seedPlaces() {
  console.log('\n📄 places');

  const places = [
    {
      id: 'place-1',
      slug: 'jabal-kneisseh',
      placeType: 'attraction',
      category: 'forest',
      contactMode: 'none',
      status: 'published',
      featured: true,
      title: { ar: 'جبل كنيسة', en: 'Jabal Kneisseh' },
      subtitle: {
        ar: 'أعلى قمة في قرنايل',
        en: 'The highest peak in Qarnayel',
      },
      shortDescription: {
        ar: 'قمة جبلية خضراء تتيح مشياً طبيعياً وإطلالات بانورامية على البحر والجبل.',
        en: 'A lush mountain peak offering hiking trails and panoramic views of the sea and mountains.',
      },
      description: {
        ar: 'جبل كنيسة هو أعلى نقطة في قرنايل، يقع على ارتفاع يتجاوز 1600 متر. يُقصده المشّاؤون والطبيعيون لمساراته الخضراء وإطلالاته البانورامية الخلّابة على البحر الأبيض المتوسط وسلسلة جبال لبنان.',
        en: 'Jabal Kneisseh is the highest point in Qarnayel, rising above 1,600 m. Hikers and nature lovers visit for its verdant trails and breathtaking panoramic views stretching to the Mediterranean and the Lebanese mountain range.',
      },
      seo: {
        ar: {
          title: 'جبل كنيسة — قرنايل',
          description:
            'استكشف جبل كنيسة، أعلى قمة في قرنايل مع مسارات للمشي وإطلالات بانورامية.',
        },
        en: {
          title: 'Jabal Kneisseh — Qarnayel',
          description:
            'Explore Jabal Kneisseh, the highest peak in Qarnayel with hiking trails and panoramic views.',
        },
      },
      contact: {},
      location: {
        mapUrl: 'https://maps.google.com/?q=33.8900,35.7800',
        lat: 33.89,
        lng: 35.78,
        address: { ar: 'قرنايل، المتن', en: 'Qarnayel, Metn' },
      },
      images: [],
      resources: [],
      createdAt: isoNow,
      updatedAt: isoNow,
    },
    {
      id: 'place-2',
      slug: 'buhayrat-qaraoun',
      placeType: 'attraction',
      category: 'lake',
      contactMode: 'none',
      status: 'published',
      featured: false,
      title: { ar: 'بحيرة قرعون', en: 'Lake Qaraoun' },
      subtitle: {
        ar: 'أكبر بحيرة اصطناعية في لبنان',
        en: 'The largest artificial lake in Lebanon',
      },
      shortDescription: {
        ar: 'بحيرة مائية أخّاذة في البقاع تُشكّل وجهة سياحية مميزة.',
        en: 'A stunning reservoir in the Bekaa Valley, a remarkable tourist destination.',
      },
      description: {
        ar: 'بحيرة قرعون هي أكبر بحيرة اصطناعية في لبنان، تقع في سهل البقاع وتمتد على مساحة 11 كيلومتراً مربعاً. تُشكّل وجهة سياحية خلّابة تجمع بين الطبيعة والتاريخ.',
        en: 'Lake Qaraoun is the largest artificial reservoir in Lebanon, located in the Bekaa Valley and covering 11 square kilometres. It is a scenic destination combining nature and history.',
      },
      seo: {
        ar: {
          title: 'بحيرة قرعون — وجهة سياحية لبنانية',
          description: 'زُر بحيرة قرعون، أكبر بحيرة اصطناعية في لبنان.',
        },
        en: {
          title: 'Lake Qaraoun — Lebanese Tourist Destination',
          description:
            'Visit Lake Qaraoun, the largest artificial lake in Lebanon.',
        },
      },
      contact: {},
      location: {
        mapUrl: 'https://maps.google.com/?q=33.5600,35.6900',
        lat: 33.56,
        lng: 35.69,
        address: { ar: 'البقاع، لبنان', en: 'Bekaa, Lebanon' },
      },
      images: [],
      resources: [],
      createdAt: isoNow,
      updatedAt: isoNow,
    },
  ];

  for (const place of places) {
    const { id, ...data } = place;
    await upsert('places', id, { id, ...data });
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('🌱 Clearing existing data...');

  try {
    for (const col of ['siteSettings', 'pageContent', 'places', 'media']) {
      process.stdout.write(`  Clearing ${col}… `);
      await clearCollection(col);
    }

    console.log('\n🌱 Seeding Firestore...');
    await seedSiteSettings();
    await seedPageContent();
    await seedPlaces();

    console.log('\n✅ Seeding complete.\n');
    console.log(
      '⚠️  Remember to delete scripts/serviceAccountKey.json when done.\n',
    );
  } catch (err) {
    console.error('\n❌ Seeding failed:', err);
    process.exit(1);
  }

  process.exit(0);
}

main();
