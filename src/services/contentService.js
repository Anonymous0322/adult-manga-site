import {
  addChapterToContent,
  addContentItem,
  getAllContent,
  getMangaContent,
  getVideoContent
} from '../utils/contentStore';

export const contentService = {
  async getPopularContent() {
    return getMangaContent()
      .slice()
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 8)
      .map((item) => ({
        ...item,
        type: item.category
      }));
  },

  async getAllContent() {
    return getAllContent();
  },

  async getMangaContent() {
    return getMangaContent();
  },

  async getVideoContent() {
    return getVideoContent();
  },

  async uploadContent(contentData) {
    return addContentItem(contentData);
  },

  async addChapter(contentId, chapter) {
    return addChapterToContent(contentId, chapter);
  }
};
