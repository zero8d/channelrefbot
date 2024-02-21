import { Composer, InlineKeyboard } from 'grammy'
import { MyContext } from '..'
import { channelId } from '../config/config'

export const start = new Composer<MyContext>()

export async function startInit(ctx: MyContext) {
  ctx.session.state = 'main' // send user to main state
  if (ctx.session.groupLink) {
    await ctx.reply('Sizning guruh uchun linkingiz: ' + ctx.session.groupLink)
    return
  }
  if (!ctx.session.inviteLink) {
    const link = await ctx.api.createChatInviteLink(channelId, {
      creates_join_request: true,
    })
    ctx.session.inviteLink = link.invite_link
  }
  const chatInviteLink = ctx.session.inviteLink
  const inlineKeyboard = new InlineKeyboard()
  inlineKeyboard.switchInline(ctx.t('share-link-button'), 'havola')
  ctx.reply(ctx.t('share-link', { inviteLink: chatInviteLink }), {
    reply_markup: {
      inline_keyboard: inlineKeyboard.inline_keyboard,
    },
  })
}
