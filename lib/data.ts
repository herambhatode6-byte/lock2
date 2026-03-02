import mongoose, { Schema, models, model } from "mongoose";

const dataSchema = new Schema(
  {
    appId: { type: String, required: true },
    remaining: { type: Number, default: 50 },
  },
  { timestamps: true }
);

export const Data = models.Data || model("Data", dataSchema);