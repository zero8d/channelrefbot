import { Context, session as grammySession } from 'grammy'
import mongoose from 'mongoose'
import { MongoDBAdapter, ISession } from '@grammyjs/storage-mongodb'
import { MyContext } from '..'
export type SessionData = {
  state: 'start' | 'main'
  blocked: boolean
  inviteLink: string
  refers: Array<Number>
  groupLink?: String
  __language_code?: string
}
const collection = mongoose.connection.collection<ISession>('sessions')

export const session = grammySession({
  initial: (): SessionData => ({
    state: 'start',
    blocked: false,
    inviteLink: '',
    refers: [],
  }),
  storage: new MongoDBAdapter<SessionData>({ collection }),
  getSessionKey: function (ctx: Context): string | undefined {
    // Give every user their personal session storage
    // (will be shared across groups and in their private chat)
    return ctx.from?.id.toString() || ctx.inlineQuery?.from.id.toString()
  },
})
