export const STATIONERY_CATEGORIES = [
  'Notebooks',
  'Pens & Pencils',
  'Paper & Notes',
  'Books & Study',
  'Office Supplies',
  'Art & Craft',
];

const products = [
  ['Classic Leather Journal', 'Notebooks', 399, 'Soft leather-look journal with ruled pages for daily writing.'],
  ['Spiral Bound A4 Notebook', 'Notebooks', 149, 'Durable A4 spiral notebook for school, college, and office notes.'],
  ['Hardcover Ruled Notebook', 'Notebooks', 249, 'Sturdy hardcover notebook with smooth writing paper.'],
  ['Pocket Memo Notebook', 'Notebooks', 89, 'Compact memo notebook for quick notes on the move.'],
  ['Dotted Bullet Journal', 'Notebooks', 299, 'Dot-grid journal for planning, habit tracking, and sketches.'],
  ['Subject Divider Notebook', 'Notebooks', 219, 'Multi-section notebook for organized class notes.'],
  ['Premium Kraft Notebook', 'Notebooks', 179, 'Eco kraft-cover notebook with clean ruled pages.'],
  ['Executive Meeting Notebook', 'Notebooks', 349, 'Professional notebook for meetings and work notes.'],
  ['Campus Long Notebook', 'Notebooks', 129, 'Long-size notebook for everyday classwork.'],
  ['Gel Pen Set 10 Pack', 'Pens & Pencils', 199, 'Smooth gel pens in assorted ink colors.'],
  ['Ballpoint Pen Blue Pack', 'Pens & Pencils', 99, 'Reliable blue ball pens for daily writing.'],
  ['Premium Fountain Pen', 'Pens & Pencils', 699, 'Elegant fountain pen with a smooth nib.'],
  ['Mechanical Pencil Set', 'Pens & Pencils', 169, 'Mechanical pencils with refill leads and erasers.'],
  ['Graphite Pencil Pack', 'Pens & Pencils', 79, 'Classic HB pencils for school and sketching.'],
  ['Colored Pencil Tin', 'Pens & Pencils', 249, 'Bright colored pencils packed in a reusable tin.'],
  ['Highlighter Set', 'Pens & Pencils', 189, 'Pastel highlighters for notes and study pages.'],
  ['Permanent Marker Trio', 'Pens & Pencils', 149, 'Black permanent markers for labeling and projects.'],
  ['Whiteboard Marker Set', 'Pens & Pencils', 229, 'Low-odor whiteboard markers in four colors.'],
  ['Sticky Notes Bundle', 'Paper & Notes', 119, 'Colorful sticky notes for reminders and page flags.'],
  ['A4 Copier Paper Ream', 'Paper & Notes', 329, 'Bright white copier paper for printing and writing.'],
  ['Index Cards Pack', 'Paper & Notes', 99, 'Ruled cards for study prompts and quick references.'],
  ['Pastel Memo Pad', 'Paper & Notes', 89, 'Tear-off memo pad for task lists and reminders.'],
  ['Graph Paper Pad', 'Paper & Notes', 139, 'Grid paper pad for math, diagrams, and planning.'],
  ['Loose Leaf Sheets', 'Paper & Notes', 159, 'Punched ruled sheets for binders and files.'],
  ['Revision Flash Cards', 'Paper & Notes', 129, 'Compact flash cards for exam preparation.'],
  ['Color Origami Paper', 'Paper & Notes', 149, 'Assorted square sheets for crafts and projects.'],
  ['Dictionary Compact Edition', 'Books & Study', 299, 'Handy reference dictionary for students.'],
  ['Exam Planner Book', 'Books & Study', 249, 'Study planner with calendars, goals, and trackers.'],
  ['Reading Log Book', 'Books & Study', 199, 'Track books, notes, ratings, and reading goals.'],
  ['Workbook Practice Set', 'Books & Study', 349, 'Practice workbook for exercises and revision.'],
  ['Subject Guide Book', 'Books & Study', 399, 'Study guide with summaries and quick revision pages.'],
  ['Book Cover Roll', 'Books & Study', 129, 'Transparent cover roll to protect textbooks.'],
  ['Bookmark Set', 'Books & Study', 79, 'Durable bookmarks for readers and students.'],
  ['Textbook Label Stickers', 'Books & Study', 69, 'Writable labels for books, notebooks, and study files.'],
  ['Desk Organizer', 'Office Supplies', 349, 'Multi-compartment organizer for pens, notes, and clips.'],
  ['Stapler With Pins', 'Office Supplies', 179, 'Compact stapler supplied with staple pins.'],
  ['Paper Clips Box', 'Office Supplies', 69, 'Rust-resistant clips for documents and reports.'],
  ['Binder Clips Assorted', 'Office Supplies', 119, 'Assorted binder clips for papers and files.'],
  ['Transparent Tape Roll', 'Office Supplies', 49, 'Clear tape for packing, crafts, and office use.'],
  ['Glue Stick Pack', 'Office Supplies', 99, 'Easy-glide glue sticks for paper and craft work.'],
  ['Document File Folder', 'Office Supplies', 149, 'Plastic file folder for certificates and paperwork.'],
  ['Desk Scissors', 'Office Supplies', 129, 'Sharp stainless-steel scissors for office use.'],
  ['Sketchbook A4', 'Art & Craft', 249, 'Heavy paper sketchbook for pencil and ink work.'],
  ['Watercolor Brush Set', 'Art & Craft', 299, 'Assorted brushes for watercolor and poster colors.'],
  ['Poster Color Set', 'Art & Craft', 229, 'Vivid poster colors for school and craft projects.'],
  ['Craft Paper Pack', 'Art & Craft', 179, 'Color craft sheets for cards and decorations.'],
  ['Washi Tape Set', 'Art & Craft', 199, 'Patterned tapes for journaling and gift wrapping.'],
  ['Oil Pastel Box', 'Art & Craft', 249, 'Smooth oil pastels in rich colors.'],
  ['Drawing Compass Kit', 'Art & Craft', 159, 'Geometry kit with compass, divider, and lead.'],
  ['Acrylic Paint Tubes', 'Art & Craft', 349, 'Acrylic color tubes for canvas and craft surfaces.'],
];

const categoryColors = {
  Notebooks: '0f766e',
  'Pens & Pencils': '2563eb',
  'Paper & Notes': 'ca8a04',
  'Books & Study': '7c3aed',
  'Office Supplies': '475569',
  'Art & Craft': 'db2777',
};

const accentColors = ['f59e0b', '14b8a6', '2563eb', 'db2777', '7c3aed', 'ef4444', '0f766e', '475569'];

function escapeSvgText(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getProductKind(title, categoryName) {
  const value = `${title} ${categoryName}`.toLowerCase();
  if (value.includes('compass')) return 'compass';
  if (value.includes('pastel') || value.includes('crayon')) return 'pastels';
  if (value.includes('paint') || value.includes('poster color') || value.includes('watercolor') || value.includes('brush')) return 'paint';
  if (value.includes('washi')) return 'washi';
  if (value.includes('folder') || value.includes('file')) return 'folder';
  if (value.includes('organizer')) return 'organizer';
  if (value.includes('calculator')) return 'calculator';
  if (value.includes('pen') || value.includes('pencil') || value.includes('marker') || value.includes('highlighter')) return 'writing';
  if (value.includes('sticky') || value.includes('memo') || value.includes('flash') || value.includes('card')) return 'notes';
  if (value.includes('paper') || value.includes('sheet') || value.includes('a4') || value.includes('origami')) return 'paper';
  if (value.includes('organizer') || value.includes('stapler') || value.includes('clip') || value.includes('folder') || value.includes('tape') || value.includes('glue') || value.includes('scissors')) return 'office';
  if (value.includes('sketch') || value.includes('craft')) return 'art';
  if (value.includes('dictionary') || value.includes('book') || value.includes('planner') || value.includes('label')) return 'study';
  return 'notebook';
}

function stableIndex(value, length) {
  let hash = 0;
  const source = String(value || '');
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash << 5) - hash + source.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash) % length;
}

function getSceneArtwork(kind, color, accent, title) {
  const tilt = stableIndex(title, 11) - 5;
  const shadow = `<ellipse cx="450" cy="555" rx="260" ry="34" fill="#0f172a" opacity="0.16"/>`;

  if (kind === 'writing') {
    return `
      ${shadow}
      <g transform="rotate(${tilt} 450 350)">
        <rect x="235" y="235" width="430" height="225" rx="30" fill="#f8fafc"/>
        <rect x="275" y="280" width="180" height="18" rx="9" fill="#${color}" opacity="0.24"/>
        <rect x="275" y="320" width="230" height="14" rx="7" fill="#cbd5e1"/>
        <rect x="275" y="355" width="155" height="14" rx="7" fill="#cbd5e1"/>
      </g>
      <g transform="rotate(-24 500 350)">
        <rect x="520" y="130" width="54" height="430" rx="27" fill="#${accent}"/>
        <rect x="520" y="130" width="54" height="82" rx="27" fill="#111827" opacity="0.9"/>
        <path d="M520 548h54l-27 66z" fill="#f8fafc"/>
        <path d="M540 594h14l-7 28z" fill="#111827"/>
      </g>
      <g transform="rotate(-18 405 350)">
        <rect x="395" y="170" width="42" height="390" rx="21" fill="#ffffff"/>
        <rect x="395" y="170" width="42" height="70" rx="21" fill="#${color}"/>
      </g>
    `;
  }

  if (kind === 'paper') {
    return `
      ${shadow}
      <g transform="rotate(${tilt} 450 350)">
        <rect x="285" y="130" width="340" height="455" rx="20" fill="#e2e8f0"/>
        <rect x="260" y="105" width="340" height="455" rx="20" fill="#f8fafc"/>
        <rect x="300" y="165" width="210" height="16" rx="8" fill="#${color}" opacity="0.45"/>
        <rect x="300" y="215" width="245" height="10" rx="5" fill="#cbd5e1"/>
        <rect x="300" y="255" width="220" height="10" rx="5" fill="#cbd5e1"/>
        <rect x="300" y="295" width="250" height="10" rx="5" fill="#cbd5e1"/>
        <rect x="300" y="335" width="190" height="10" rx="5" fill="#cbd5e1"/>
      </g>
      <rect x="540" y="385" width="105" height="140" rx="18" fill="#${accent}" opacity="0.9"/>
    `;
  }

  if (kind === 'notes') {
    return `
      ${shadow}
      <rect x="250" y="175" width="210" height="210" rx="24" fill="#fde68a"/>
      <rect x="435" y="220" width="210" height="210" rx="24" fill="#bfdbfe"/>
      <rect x="315" y="335" width="220" height="190" rx="24" fill="#fecdd3"/>
      <rect x="285" y="225" width="110" height="12" rx="6" fill="#92400e" opacity="0.28"/>
      <rect x="470" y="270" width="115" height="12" rx="6" fill="#1d4ed8" opacity="0.28"/>
      <rect x="350" y="385" width="120" height="12" rx="6" fill="#be123c" opacity="0.24"/>
    `;
  }

  if (kind === 'office') {
    return `
      ${shadow}
      <rect x="245" y="195" width="410" height="295" rx="34" fill="#f8fafc"/>
      <rect x="285" y="235" width="120" height="215" rx="18" fill="#${color}" opacity="0.16"/>
      <rect x="430" y="235" width="80" height="215" rx="18" fill="#${accent}" opacity="0.9"/>
      <rect x="535" y="235" width="80" height="215" rx="18" fill="#e2e8f0"/>
      <rect x="307" y="285" width="76" height="12" rx="6" fill="#${color}" opacity="0.5"/>
      <rect x="307" y="325" width="58" height="12" rx="6" fill="#${color}" opacity="0.32"/>
      <circle cx="575" cy="342" r="32" fill="#94a3b8"/>
      <rect x="454" y="275" width="32" height="130" rx="16" fill="#ffffff" opacity="0.7"/>
    `;
  }

  if (kind === 'folder') {
    return `
      ${shadow}
      <path d="M225 235h190l44 52h216v230H225z" fill="#${color}" opacity="0.92"/>
      <path d="M225 287h450v230H225z" fill="#f8fafc"/>
      <path d="M255 325h365" stroke="#cbd5e1" stroke-width="14" stroke-linecap="round"/>
      <path d="M255 375h285" stroke="#cbd5e1" stroke-width="14" stroke-linecap="round"/>
      <path d="M255 425h330" stroke="#cbd5e1" stroke-width="14" stroke-linecap="round"/>
      <rect x="560" y="235" width="72" height="52" rx="10" fill="#${accent}"/>
    `;
  }

  if (kind === 'organizer') {
    return `
      ${shadow}
      <rect x="245" y="245" width="410" height="265" rx="34" fill="#f8fafc"/>
      <rect x="285" y="300" width="94" height="168" rx="18" fill="#${color}" opacity="0.2"/>
      <rect x="405" y="300" width="94" height="168" rx="18" fill="#${accent}" opacity="0.88"/>
      <rect x="525" y="300" width="94" height="168" rx="18" fill="#e2e8f0"/>
      <rect x="305" y="165" width="28" height="190" rx="14" fill="#${color}"/>
      <rect x="443" y="155" width="28" height="200" rx="14" fill="#111827"/>
      <rect x="560" y="175" width="28" height="180" rx="14" fill="#${accent}"/>
    `;
  }

  if (kind === 'paint') {
    return `
      ${shadow}
      <rect x="235" y="210" width="430" height="290" rx="36" fill="#f8fafc"/>
      <rect x="300" y="250" width="72" height="190" rx="22" fill="#ef4444"/>
      <rect x="392" y="230" width="72" height="210" rx="22" fill="#f59e0b"/>
      <rect x="484" y="260" width="72" height="180" rx="22" fill="#2563eb"/>
      <rect x="315" y="285" width="42" height="78" rx="12" fill="#ffffff" opacity="0.72"/>
      <rect x="407" y="265" width="42" height="88" rx="12" fill="#ffffff" opacity="0.72"/>
      <rect x="499" y="295" width="42" height="68" rx="12" fill="#ffffff" opacity="0.72"/>
      <g transform="rotate(28 610 310)">
        <rect x="610" y="150" width="30" height="330" rx="15" fill="#7c2d12"/>
        <path d="M610 150h30l-15-58z" fill="#f8fafc"/>
        <path d="M620 110h10l-5-24z" fill="#111827"/>
      </g>
    `;
  }

  if (kind === 'pastels') {
    return `
      ${shadow}
      <rect x="210" y="230" width="480" height="275" rx="34" fill="#f8fafc"/>
      <rect x="255" y="295" width="72" height="145" rx="24" fill="#ef4444"/>
      <rect x="345" y="270" width="72" height="170" rx="24" fill="#f59e0b"/>
      <rect x="435" y="285" width="72" height="155" rx="24" fill="#22c55e"/>
      <rect x="525" y="255" width="72" height="185" rx="24" fill="#3b82f6"/>
      <rect x="255" y="345" width="342" height="20" rx="10" fill="#ffffff" opacity="0.42"/>
    `;
  }

  if (kind === 'washi') {
    return `
      ${shadow}
      <circle cx="335" cy="330" r="86" fill="#f8fafc"/>
      <circle cx="335" cy="330" r="38" fill="#e2e8f0"/>
      <circle cx="470" cy="310" r="86" fill="#${accent}"/>
      <circle cx="470" cy="310" r="38" fill="#f8fafc"/>
      <circle cx="565" cy="390" r="78" fill="#${color}"/>
      <circle cx="565" cy="390" r="34" fill="#f8fafc"/>
      <path d="M276 304h118M411 284h118M512 370h106" stroke="#0f172a" stroke-width="12" opacity="0.18" stroke-linecap="round"/>
    `;
  }

  if (kind === 'compass') {
    return `
      ${shadow}
      <rect x="245" y="210" width="410" height="290" rx="36" fill="#f8fafc"/>
      <circle cx="450" cy="245" r="28" fill="#${accent}"/>
      <path d="M450 274L340 515" stroke="#111827" stroke-width="18" stroke-linecap="round"/>
      <path d="M450 274L565 515" stroke="#${color}" stroke-width="18" stroke-linecap="round"/>
      <path d="M384 370h132" stroke="#94a3b8" stroke-width="14" stroke-linecap="round"/>
      <circle cx="450" cy="245" r="10" fill="#f8fafc"/>
      <path d="M330 515h36M547 515h36" stroke="#111827" stroke-width="12" stroke-linecap="round"/>
    `;
  }

  if (kind === 'calculator') {
    return `
      ${shadow}
      <rect x="315" y="150" width="270" height="390" rx="34" fill="#111827"/>
      <rect x="350" y="195" width="200" height="82" rx="16" fill="#e2e8f0"/>
      <rect x="350" y="315" width="42" height="42" rx="12" fill="#f8fafc"/>
      <rect x="410" y="315" width="42" height="42" rx="12" fill="#f8fafc"/>
      <rect x="470" y="315" width="42" height="42" rx="12" fill="#f8fafc"/>
      <rect x="350" y="375" width="42" height="42" rx="12" fill="#f8fafc"/>
      <rect x="410" y="375" width="42" height="42" rx="12" fill="#f8fafc"/>
      <rect x="470" y="375" width="42" height="42" rx="12" fill="#f8fafc"/>
      <rect x="530" y="315" width="42" height="102" rx="12" fill="#${accent}"/>
    `;
  }

  if (kind === 'art') {
    return `
      ${shadow}
      <rect x="235" y="190" width="430" height="310" rx="36" fill="#f8fafc"/>
      <circle cx="340" cy="315" r="42" fill="#ef4444"/>
      <circle cx="430" cy="300" r="42" fill="#f59e0b"/>
      <circle cx="520" cy="330" r="42" fill="#22c55e"/>
      <circle cx="455" cy="405" r="38" fill="#3b82f6"/>
      <g transform="rotate(24 560 320)">
        <rect x="570" y="150" width="34" height="330" rx="17" fill="#7c2d12"/>
        <path d="M570 150h34l-17-58z" fill="#f8fafc"/>
        <path d="M581 111h12l-6-26z" fill="#111827"/>
      </g>
    `;
  }

  if (kind === 'study') {
    return `
      ${shadow}
      <rect x="250" y="170" width="185" height="350" rx="18" fill="#${color}"/>
      <rect x="435" y="150" width="205" height="370" rx="18" fill="#f8fafc"/>
      <rect x="282" y="220" width="92" height="14" rx="7" fill="#ffffff" opacity="0.55"/>
      <rect x="282" y="260" width="118" height="12" rx="6" fill="#ffffff" opacity="0.34"/>
      <rect x="475" y="215" width="108" height="15" rx="8" fill="#${accent}" opacity="0.55"/>
      <rect x="475" y="270" width="125" height="10" rx="5" fill="#cbd5e1"/>
      <rect x="475" y="305" width="102" height="10" rx="5" fill="#cbd5e1"/>
    `;
  }

  return `
    ${shadow}
    <g transform="rotate(${tilt} 450 350)">
      <rect x="285" y="120" width="330" height="430" rx="28" fill="#f8fafc"/>
      <rect x="285" y="120" width="72" height="430" rx="28" fill="#${color}"/>
      <rect x="405" y="205" width="145" height="18" rx="9" fill="#${accent}" opacity="0.7"/>
      <rect x="405" y="255" width="112" height="12" rx="6" fill="#cbd5e1"/>
      <rect x="405" y="295" width="132" height="12" rx="6" fill="#cbd5e1"/>
      <rect x="405" y="335" width="98" height="12" rx="6" fill="#cbd5e1"/>
    </g>
  `;
}

export function getProductPlaceholderUrl(title, categoryName = 'Stationery') {
  const color = categoryColors[categoryName] || '0f766e';
  const accent = accentColors[stableIndex(`${title}-${categoryName}`, accentColors.length)];
  const kind = getProductKind(title, categoryName);
  const safeTitle = escapeSvgText(String(title || 'Stationery Product').slice(0, 42));
  const safeCategoryLabel = escapeSvgText(String(categoryName || 'Stationery').slice(0, 28).toUpperCase());
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
        <radialGradient id="glow" cx="70%" cy="22%" r="55%">
          <stop offset="0%" stop-color="#${accent}" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="900" height="700" fill="url(#bg)"/>
      <rect width="900" height="700" fill="url(#glow)"/>
      <rect x="58" y="56" width="784" height="588" rx="42" fill="#ffffff" opacity="0.72"/>
      <rect x="82" y="80" width="736" height="540" rx="34" fill="#ffffff" opacity="0.78"/>
      ${getSceneArtwork(kind, color, accent, title)}
      <rect x="122" y="584" width="656" height="1" fill="#e2e8f0"/>
      <text x="450" y="625" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="31" font-weight="800" fill="#0f172a">${safeTitle}</text>
      <text x="450" y="660" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="3" fill="#${color}">${safeCategoryLabel}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const STATIONERY_PRODUCTS = products.map(([title, category_name, price, description], index) => ({
  id: `stationery-${index + 1}`,
  title,
  category_name,
  price: price.toFixed(2),
  description,
  stock_quantity: 100 + index,
  brand: 'Sri Thanam Papers',
  is_featured: index < 8,
  image_url: getProductPlaceholderUrl(title, category_name),
}));
