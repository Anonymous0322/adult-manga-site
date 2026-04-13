const STORAGE_KEY = 'mangauz_content_v2';

const parseSafe = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const write = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

const isDemoItem = (item) => {
  const text = `${item?.title || ''} ${item?.author || ''} ${item?.description || ''}`.toLowerCase();
  const hasDemoTitle =
    text.includes('berserk') ||
    text.includes('solo leveling') ||
    text.includes('anime moments');
  const hasPlaceholderCover = String(item?.cover || '').includes('placehold.co');
  return hasDemoTitle || hasPlaceholderCover;
};

export const ensureSeedContent = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    write([]);
    return;
  }

  const parsed = parseSafe(existing, []);
  if (Array.isArray(parsed) && parsed.some(isDemoItem)) {
    const cleaned = parsed.filter((item) => !isDemoItem(item));
    write(cleaned);
  }
};

export const getAllContent = () => {
  ensureSeedContent();
  return parseSafe(localStorage.getItem(STORAGE_KEY), []);
};

export const getContentById = (id) => {
  const all = getAllContent();
  return all.find((item) => Number(item.id) === Number(id)) || null;
};

export const saveAllContent = (items) => {
  write(items);
  return items;
};

export const addContentItem = (item) => {
  const all = getAllContent();
  const created = {
    ...item,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };
  write([created, ...all]);
  return created;
};

export const updateContentItem = (id, patch) => {
  const all = getAllContent();
  const updated = all.map((item) => (Number(item.id) === Number(id) ? { ...item, ...patch } : item));
  write(updated);
  return updated.find((item) => Number(item.id) === Number(id)) || null;
};

export const deleteContentItem = (id) => {
  const all = getAllContent();
  const filtered = all.filter((item) => Number(item.id) !== Number(id));
  write(filtered);
  return filtered;
};

export const addChapterToContent = (contentId, chapter) => {
  const all = getAllContent();
  const updated = all.map((item) => {
    if (Number(item.id) !== Number(contentId)) return item;
    const chapters = Array.isArray(item.chapters) ? item.chapters : [];
    const nextChapter = {
      id: Date.now(),
      number: chapter.number || chapters.length + 1,
      title: chapter.title || `Chapter ${chapters.length + 1}`,
      pages: chapter.pages || []
    };
    return { ...item, chapters: [...chapters, nextChapter] };
  });
  write(updated);
  return updated.find((item) => Number(item.id) === Number(contentId)) || null;
};

export const getMangaContent = () => getAllContent().filter((item) => item.contentType === 'manga');
export const getVideoContent = () => getAllContent().filter((item) => item.contentType === 'video');
