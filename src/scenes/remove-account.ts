import { Markup, Scenes } from "telegraf";
import { bot } from "..";
import { sendMessageWithButtonsTelegram } from "../lib";
import { SCENE_REMOVE_ACCOUNT } from "./list";

const nextStep = (ctx: any, step?: number) => {
   if (ctx.message) {
      ctx.message.text = "";
   }
   if (ctx?.update?.callback_query?.data.length) {
      ctx.update.callback_query.data = "";
   }
   if (!step) {
      ctx.wizard.next();
   } else {
      ctx.wizard.cursor = step;
   }
   return ctx.wizard.steps[ctx.wizard.cursor](ctx);
};
const getValue = (ctx: any) => {
   if (ctx?.update?.callback_query?.data.length) {
      return ctx?.update?.callback_query?.data;
   }

   if (ctx.message?.text) return ctx.message?.text;
   return "";
};

export const sceneRemoveAccount: any = new Scenes.WizardScene(
   SCENE_REMOVE_ACCOUNT,
   async (ctx) => nextStep(ctx),
   async (ctx) => {
      try {
         if (!bot.shouldRun) {
            await ctx.replyWithHTML(
               `Account: ${bot.getIdentify()}\n\nAccount not working`
            );
            return ctx.scene.leave();
         }
         const config = require("../ecosystem.config");
         const mode = getValue(ctx);
         if (mode) {
            if (!config.apps.map((app: any) => app.name).includes(mode)) {
               await ctx.replyWithHTML(
                  `Account: ${bot.getIdentify()}\n\nAccount not found: ${mode}`
               );
               return ctx.scene.leave();
            }
            await ctx.replyWithHTML(`Removing account...`);
            await ctx.scene.leave();
            await bot.pm2RemoveAccount(mode);

            return;
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            "Select a account",
            config.apps.map((app: any) =>
               Markup.button.callback(app.name, app.name)
            )
         );
      } catch (e: any) {
         ctx.scene.leave();
         ctx.replyWithHTML("ERROR: \n" + e.message);
      }
   }
);
