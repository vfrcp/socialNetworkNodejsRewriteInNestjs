import { Controller, Get, Post, Patch, Delete } from "@nestjs/common";

Controller("chat")
export class ChatController {
  @Get("/getLastMessagesByChatIdAndPage/:chatId/:page")
  getLastMessage () {

  }
  @Get("/getMyChatsByPage/:page")
  getMyChatsByPage () {

  }
  @Post("/sendMessageByChatId/::chatId")
  sendMessageByChatId () {

  }
  @Patch("/editMessageByMessageId/:messageId") 
  editMessageByMessageId () {

  }
  @Delete("/deleteMessageByMessageId/:messageId")
  deleteMessageByMessageId () {

  }
  @Post("/create/:interlocutorId")
  create () {

  }
}