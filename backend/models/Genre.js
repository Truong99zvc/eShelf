import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên thể loại là bắt buộc'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      default: '',
    },
    bookCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Create slug from name before saving
genreSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = createSlug(this.name);
  }
  next();
});

// Static method to create slug
genreSchema.statics.createSlug = createSlug;

const Genre = mongoose.model('Genre', genreSchema);

export default Genre;
