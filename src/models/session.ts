import { Schema, SchemaTypes, model } from 'mongoose'

const sessionSchema = new Schema({
  key: String,
  value: {
    type: {
      state: String,
      blocked: Boolean,
      inviteLink: String,
      refers: [],
      groupLink: String,
    },
    required: true,
  },
})

export default model('Session', sessionSchema)
