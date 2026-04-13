import mongoose from 'mongoose';

const chapterImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, index: true },
    width: Number,
    height: Number,
    bytes: Number,
    format: String
  },
  { _id: false }
);

const chapterSchema = new mongoose.Schema(
  {
    mangaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manga',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 240
    },
    chapterNumber: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },
    images: {
      type: [chapterImageSchema],
      default: []
    },
    imageCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

chapterSchema.index({ mangaId: 1, chapterNumber: 1 }, { unique: true });

chapterSchema.pre('save', function preSave(next) {
  this.imageCount = this.images.length;
  next();
});

export const Chapter = mongoose.model('Chapter', chapterSchema);
