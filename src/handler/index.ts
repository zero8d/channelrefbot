import { Composer, InlineKeyboard } from 'grammy'
import { MyContext } from '..'
import { startInit } from '../router/start'
import { showLangs } from '../router/main'
import { channelId, groupId } from '../config/config'
import Session from '../models/session'

export const handler = new Composer<MyContext>()

handler.on('my_chat_member:from', ctx => {
  if (
    ctx.myChatMember.new_chat_member.status === 'kicked' &&
    ctx.myChatMember.chat.type === 'private'
  ) {
    ctx.session.blocked = true
  }
})
handler.on('chat_join_request', async ctx => {
  console.log(ctx.chatJoinRequest.chat.id)
  const chatid = ctx.chatJoinRequest.chat.id
  const link = ctx.chatJoinRequest.invite_link?.invite_link
  if (chatid != Number(channelId)) {
    return
  }

  const session = await Session.findOne({ 'value.inviteLink': link })
  if (!session) {
    await ctx.api.sendMessage(
      ctx.chatJoinRequest.user_chat_id,
      'Assalomu alaykum, /start ni bosing'
    )
    ctx.approveChatJoinRequest(ctx.chatJoinRequest.from.id)
    return
  }
  session.set({
    'value.refers': [...session.value.refers, ctx.chatJoinRequest.from.id],
  })
  await session.save()
  await ctx.api.sendMessage(
    ctx.chatJoinRequest.user_chat_id,
    'Assalomu alaykum, /start ni bosing'
  )
  await ctx.api.sendMessage(
    Number(session.key),
    'Sizning linkingizdan kirganlar soni: ' + session.value.refers.length
  )
  if (session.value.refers.length == 5) {
    const link = await ctx.api.createChatInviteLink(groupId, {
      member_limit: 1,
    })
    session.set({ 'value.groupLink': link.invite_link })
    await session.save()
    await ctx.api.sendMessage(
      Number(session.key),
      'Sizning maxfiy guruh uchun linkingiz: ' + link.invite_link
    )
  }
  await ctx.approveChatJoinRequest(ctx.chatJoinRequest.from.id)
})
handler.command('lang', showLangs)
handler.callbackQuery(/lang_/, ctx => {
  const lang = ctx.callbackQuery.data.split('_')[1]
  ctx.session.__language_code = lang
  ctx.editMessageText(ctx.t('selected-lang', { lang }), {
    reply_markup: { inline_keyboard: [] },
  })
})

handler.command('start', startInit)
