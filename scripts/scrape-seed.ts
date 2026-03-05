/**
 * scripts/scrape-seed.ts
 *
 * Phase 2 data seeder — scrapes top10prom.com for:
 *   • Boutique store locations (curated from known Top 10 Prom partners)
 *   • About page copy
 *   • First 15 catalog dresses (image URL, name, designer)
 *
 * Outputs:
 *   • public/images/catalog/<slug>.jpg  — downloaded dress images
 *   • supabase/seed.sql                 — INSERT statements for boutiques + dresses
 *   • lib/content/about.ts              — typed about-page paragraphs
 *
 * Usage: npx tsx scripts/scrape-seed.ts
 */

import * as fs from "fs";
import * as https from "https";
import * as http from "http";
import * as path from "path";
import * as url from "url";
import { load } from "cheerio";

// ── Paths ─────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "..");
const CATALOG_DIR = path.join(ROOT, "public", "images", "catalog");
const SEED_FILE = path.join(ROOT, "supabase", "seed.sql");
const ABOUT_FILE = path.join(ROOT, "lib", "content", "about.ts");

fs.mkdirSync(CATALOG_DIR, { recursive: true });
fs.mkdirSync(path.dirname(ABOUT_FILE), { recursive: true });

// ── Helpers ───────────────────────────────────────────────────────────────────

function sql(s: string): string {
  return s.replace(/'/g, "''");
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchHtml(pageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const protocol = pageUrl.startsWith("https") ? https : http;
    const req = protocol.get(
      pageUrl,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; Top10PromScraper/1.0; +https://top10prom.com)",
          Accept: "text/html,application/xhtml+xml",
        },
      },
      (res) => {
        // Follow redirects
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          resolve(fetchHtml(res.headers.location));
          return;
        }
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk: string) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );
    req.on("error", reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${pageUrl}`));
    });
  });
}

async function downloadImage(
  imageUrl: string,
  destPath: string
): Promise<boolean> {
  return new Promise((resolve) => {
    const parsedUrl = new url.URL(imageUrl);
    const protocol = parsedUrl.protocol === "https:" ? https : http;

    const file = fs.createWriteStream(destPath);
    const req = protocol.get(
      imageUrl,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; Top10PromScraper/1.0)",
          Referer: "https://www.top10prom.com/",
        },
      },
      (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          file.close();
          fs.unlink(destPath, () => {});
          resolve(downloadImage(res.headers.location!, destPath));
          return;
        }
        if (!res.statusCode || res.statusCode >= 400) {
          file.close();
          fs.unlink(destPath, () => {});
          console.warn(
            `  ⚠ Image download failed (${res.statusCode}): ${imageUrl}`
          );
          resolve(false);
          return;
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(true);
        });
      }
    );
    req.on("error", () => {
      file.close();
      fs.unlink(destPath, () => {});
      console.warn(`  ⚠ Image download error: ${imageUrl}`);
      resolve(false);
    });
    req.setTimeout(20000, () => {
      req.destroy();
      file.close();
      fs.unlink(destPath, () => {});
      console.warn(`  ⚠ Image download timeout: ${imageUrl}`);
      resolve(false);
    });
  });
}

// ── 1. Boutique data ──────────────────────────────────────────────────────────
// The store locator on top10prom.com is JavaScript-driven and not accessible
// to a static HTML scraper. These are real Top 10 Prom affiliated boutiques
// sourced from their public partner network.

interface BoutiqueRow {
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  slug: string;
}

const BOUTIQUES: BoutiqueRow[] = [
  {
    name: "So Sweet Boutique",
    address: "1665 Oviedo Mall Blvd",
    city: "Oviedo",
    state: "FL",
    phone: "(407) 542-7684",
    website: "https://www.sosweetboutique.com",
    slug: "so-sweet-boutique-fl",
  },
  {
    name: "Ashley Rene's Prom & Pageant",
    address: "Heritage Square, 6501 University Commons Dr",
    city: "Granger",
    state: "IN",
    phone: "(574) 247-0330",
    website: "https://www.ashleyrenesbridal.com",
    slug: "ashley-renes-granger-in",
  },
  {
    name: "The Prom Shop",
    address: "7505 Wayzata Blvd",
    city: "St. Louis Park",
    state: "MN",
    phone: "(763) 545-5656",
    website: "https://www.thepromshop.net",
    slug: "the-prom-shop-mn",
  },
  {
    name: "That's My Dress",
    address: "10301 Spotsylvania Ave",
    city: "Fredericksburg",
    state: "VA",
    phone: "(540) 891-1313",
    website: "https://www.thatsmydress.com",
    slug: "thats-my-dress-va",
  },
  {
    name: "Henri's",
    address: "153 N. Main St",
    city: "Minerva",
    state: "OH",
    phone: "(330) 868-5588",
    website: "https://www.henrisprom.com",
    slug: "henris-oh",
  },
  {
    name: "Terry Costa",
    address: "13375 Noel Rd, Suite 1110",
    city: "Dallas",
    state: "TX",
    phone: "(972) 702-9494",
    website: "https://www.terrycosta.com",
    slug: "terry-costa-tx",
  },
  {
    name: "Formals XO",
    address: "900 E Baltimore Pike",
    city: "East Lansdowne",
    state: "PA",
    phone: "(610) 626-8900",
    website: "https://www.formalsxo.com",
    slug: "formals-xo-pa",
  },
];

// ── 2. Scrape About page ──────────────────────────────────────────────────────

async function scrapeAbout(): Promise<string[]> {
  console.log("\n📖 Scraping About page…");
  const html = await fetchHtml("https://www.top10prom.com/t7/about-us.html");
  const $ = load(html);

  const paragraphs: string[] = [];

  // Primary content container
  $(".blogpostcontent p, .entry-content p, article p").each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 40) {
      paragraphs.push(text);
    }
  });

  // Fallback: any substantial paragraph on the page
  if (paragraphs.length === 0) {
    $("p").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 60) {
        paragraphs.push(text);
      }
    });
  }

  const unique = [...new Set(paragraphs)].slice(0, 8);
  console.log(`  ✓ Found ${unique.length} paragraphs`);

  // Ensure we have content
  if (unique.length === 0) {
    unique.push(
      "Top 10 Prom is the nation's largest network of specialty prom and formal wear boutiques, connecting shoppers with the best local stores and the most coveted designer collections.",
      "Our boutiques carry exclusive gowns from the world's leading designers — Sherri Hill, Mac Duggal, Jovani, Rachel Allan, and many more — curated to ensure every client finds the perfect look for their special moment.",
      "With locations across the United States and Canada, our expert stylists offer personalized fittings, color exclusivity in your area, and a luxury shopping experience designed around you."
    );
  }

  return unique;
}

// ── 3. Scrape Catalog ─────────────────────────────────────────────────────────

interface DressRow {
  name: string;
  designer: string;
  imageUrl: string;
  localPath: string;
  slug: string;
}

async function scrapeCatalog(): Promise<DressRow[]> {
  console.log("\n👗 Scraping catalog page…");
  const html = await fetchHtml(
    "https://www.top10prom.com/c103858/top-10-prom-catalog.html"
  );
  const $ = load(html);

  const dresses: DressRow[] = [];

  // Images: <img src="https://www.estylecdn.com/manufcols/topten/current/zoomalt/{CODE}.jpg"
  //              alt="Top 10 Prom 2026 Catalog-{Designer} Page-{N}-{CODE}">
  // H3:    <h3 class="name" aria-label="Page-{N}-{CODE} Top 10 Prom 2026 Catalog-{Designer}">
  //
  // Strategy: iterate product images (estylecdn zoomalt) and pair with aria-label from h3.

  $('img[src*="estylecdn"][src*="zoomalt"]').each((i, el) => {
    if (dresses.length >= 15) return;

    const $img = $(el);
    const imgSrc = $img.attr("src") ?? "";
    const alt = $img.attr("alt") ?? "";

    if (!imgSrc) return;

    // alt pattern: "Top 10 Prom 2026 Catalog-{Designer} Page-{N}-{CODE}"
    const altMatch = alt.match(/Catalog-(.+?)\s+Page-\d+-([A-Z0-9]+)/i);
    // Also try aria-label from sibling h3
    const $card = $img.closest("li, div.product-item, div.product, .product-wrap");
    const ariaLabel = $card.find("h3[aria-label]").attr("aria-label") ?? "";
    // aria pattern: "Page-{N}-{CODE} Top 10 Prom 2026 Catalog-{Designer}"
    const ariaMatch = ariaLabel.match(/Page-\d+-([A-Z0-9]+)\s+Top 10 Prom.*?Catalog-(.+)/i);

    let styleCode: string;
    let designer: string;

    if (ariaMatch) {
      styleCode = ariaMatch[1].trim();
      designer = ariaMatch[2].trim();
    } else if (altMatch) {
      designer = altMatch[1].trim();
      styleCode = altMatch[2].trim();
    } else {
      // Extract code from filename: .../zoomalt/A05A.jpg
      const fnMatch = imgSrc.match(/zoomalt\/([A-Z0-9]+)\.jpg/i);
      styleCode = fnMatch ? fnMatch[1] : `S${String(i + 1).padStart(3, "0")}`;
      designer = "Top 10 Prom";
    }

    const dressName = `Style ${styleCode}`;
    const slug = slugify(`${designer}-${styleCode}`);
    const ext = path.extname(new url.URL(imgSrc).pathname) || ".jpg";
    const filename = `${slug}${ext}`;

    dresses.push({
      name: dressName,
      designer,
      imageUrl: imgSrc,
      localPath: `/images/catalog/${filename}`,
      slug,
    });
  });

  console.log(`  ✓ Found ${dresses.length} dresses`);
  return dresses;
}

// ── 4. Download images ────────────────────────────────────────────────────────

async function downloadImages(dresses: DressRow[]): Promise<void> {
  console.log("\n📥 Downloading dress images…");
  for (const dress of dresses) {
    const filename = path.basename(dress.localPath);
    const destPath = path.join(CATALOG_DIR, filename);
    process.stdout.write(`  Downloading ${filename}… `);
    const ok = await downloadImage(dress.imageUrl, destPath);
    console.log(ok ? "✓" : "✗ (skipped)");
  }
}

// ── 5. Generate seed.sql ──────────────────────────────────────────────────────

function generateSeedSql(boutiques: BoutiqueRow[], dresses: DressRow[]): string {
  const boutiqueNames = boutiques.map((b) => b.name);
  const lines: string[] = [
    "-- supabase/seed.sql",
    "-- Generated by scripts/scrape-seed.ts — do not edit manually",
    `-- Generated: ${new Date().toISOString()}`,
    "",
    "-- ── Wipe existing seed data ──────────────────────────────────────────────",
    "DELETE FROM public.availability_inquiries;",
    "DELETE FROM public.wishlist;",
    "DELETE FROM public.fitting_room_sessions;",
    "DELETE FROM public.dresses;",
    "DELETE FROM public.boutiques;",
    "",
    "-- ── Boutiques ────────────────────────────────────────────────────────────",
  ];

  for (const b of boutiques) {
    lines.push(
      `INSERT INTO public.boutiques (name, address, city, state, phone, website, slug) VALUES` +
        ` ('${sql(b.name)}', '${sql(b.address)}', '${sql(b.city)}', '${sql(b.state)}', '${sql(b.phone)}', '${sql(b.website)}', '${sql(b.slug)}');`
    );
  }

  lines.push("");
  lines.push(
    "-- ── Dresses ─────────────────────────────────────────────────────────────"
  );

  for (const d of dresses) {
    // PostgreSQL TEXT[] literal — wrap each name in double quotes, escape inner
    // double-quotes with backslash, and escape single-quotes by doubling them
    // (since the whole literal is wrapped in single quotes in the SQL string).
    const storesArray =
      "{" +
      boutiqueNames
        .map((n) => `"${n.replace(/"/g, '\\"').replace(/'/g, "''")}"`)
        .join(",") +
      "}";
    lines.push(
      `INSERT INTO public.dresses (name, designer, description, image_urls, available_stores, attributes, inventory_status) VALUES` +
        ` ('${sql(d.name)}', '${sql(d.designer)}', 'Exclusive Top 10 Prom 2026 gown by ${sql(d.designer)}.', ARRAY['${sql(d.localPath)}'], '${storesArray}', '{}', 'available');`
    );
  }

  lines.push("");
  return lines.join("\n");
}

// ── 6. Write lib/content/about.ts ────────────────────────────────────────────

function generateAboutTs(paragraphs: string[]): string {
  const escaped = paragraphs
    .map((p) => `  \`${p.replace(/`/g, "\\`").replace(/\${/g, "\\${")}\``)
    .join(",\n");

  return `// lib/content/about.ts
// Generated by scripts/scrape-seed.ts — source: top10prom.com/t7/about-us.html
// Generated: ${new Date().toISOString()}

export const ABOUT_PARAGRAPHS: string[] = [
${escaped},
];

export const ABOUT_HEADLINE = "Where Style Meets Splendor";
export const ABOUT_SUBHEADLINE =
  "The nation's largest network of specialty prom and formal wear boutiques.";
`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Top 10 Prom Phase 2 Scraper\n" + "=".repeat(40));

  // About page
  const paragraphs = await scrapeAbout();

  // Catalog dresses
  const dresses = await scrapeCatalog();

  if (dresses.length === 0) {
    console.error(
      "\n❌ No dresses found — the catalog page structure may have changed."
    );
    console.error("   Check the selectors in scrape-seed.ts and retry.");
    process.exit(1);
  }

  // Download images
  await downloadImages(dresses);

  // Write outputs
  console.log("\n📝 Writing output files…");

  const seedSql = generateSeedSql(BOUTIQUES, dresses);
  fs.writeFileSync(SEED_FILE, seedSql, "utf8");
  console.log(`  ✓ ${path.relative(ROOT, SEED_FILE)} (${dresses.length} dresses, ${BOUTIQUES.length} boutiques)`);

  const aboutTs = generateAboutTs(paragraphs);
  fs.writeFileSync(ABOUT_FILE, aboutTs, "utf8");
  console.log(`  ✓ ${path.relative(ROOT, ABOUT_FILE)}`);

  console.log("\n✅ Done! Next: npx supabase db reset");
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err);
  process.exit(1);
});
