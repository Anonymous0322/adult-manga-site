import mongoose from 'mongoose';
import slugify from 'slugify';

const mangaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
      index: true
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000
    },
    coverImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true }
    },
    genres: {
      type: [String],
      default: [],
      index: true
    },
    chapterCount: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

mangaSchema.pre('validate', function preValidate(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

mangaSchema.index({ title: 'text' });

export const Manga = mongoose.model('Manga', mangaSchema);
