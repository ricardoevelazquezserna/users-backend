export const MONGO_DEFAULT_SCHEMA_OPTIONS = {
  _id: true,
  versionKey: false,
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: false,
    transform: (_, converted) => {
      converted.id = converted._id.toString();
      delete converted._id;
      return converted;
    },
  },
};
