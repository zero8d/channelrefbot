import { Composer, InlineKeyboard } from 'grammy'
import { MyContext } from '..'
import Session from '../models/session'
const handler = new Composer<MyContext>()
handler.inlineQuery(['', /./], async ctx => {
  console.log({ session: ctx.session })
  if (!ctx.session.inviteLink) {
    return
  }
  const inviteLink = ctx.session.inviteLink

  const inlineKeyboard = new InlineKeyboard().url(
    "Kanalga a'zo bo'lish",
    inviteLink
  )

  await ctx.answerInlineQuery(
    [
      {
        type: 'article',
        id: String(Math.random() * 1000),
        title: 'Havola',
        input_message_content: {
          message_text: "Kanalga a'zo bo'lish",
        },
        reply_markup: {
          inline_keyboard: inlineKeyboard.inline_keyboard,
        },
      },
    ],
    { cache_time: 0 }
  )
})
export default handler
