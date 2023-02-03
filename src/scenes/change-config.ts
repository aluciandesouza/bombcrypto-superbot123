import { Markup, Scenes } from "telegraf";
import { bot } from "..";
import { sendMessageWithButtonsTelegram, sortByRarityDesc } from "../lib";
import {
   SCENE_CHANGE_CONFIG,
   SCENE_CHANGE_CONFIG_ALERT_MATERIAL,
   SCENE_CHANGE_CONFIG_ALERT_SHIELD,
   SCENE_CHANGE_CONFIG_HOUSE_HEROES,
   SCENE_CHANGE_CONFIG_MAX_GAS_REPAIR_SHIELD,
   SCENE_CHANGE_CONFIG_NUM_HEROES,
   SCENE_CHANGE_CONFIG_PERCENTAGE,
   SCENE_CHANGE_CONFIG_RESET_SHIELD_AUTO,
   SCENE_CHANGE_CONFIG_SERVER,
   SCENE_CHANGE_CONFIG_TELEGRAM_CHAT_ID,
} from "./list";

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

export const sceneConfigMaxGasRepairShield: any = new Scenes.WizardScene(
   SCENE_CHANGE_CONFIG_MAX_GAS_REPAIR_SHIELD,
   async (ctx) => nextStep(ctx),
   async (ctx: any) => {
      try {
         const mode = getValue(ctx);
         if (mode) {
            await ctx.replyWithHTML(
               `Account: ${bot.getIdentify()}\n\nConfiguration changed, server will restarted`
            );
            await bot.saveConfig(
               bot.getIdentify(),
               "MAX_GAS_REPAIR_SHIELD",
               mode
            );
            return ctx.scene.leave();
         }

         await ctx.replyWithHTML(
            `Enter the maximum value in matic, example <b>0.004</b>`
         );
      } catch (e: any) {
         if (e.message == "exit") {
            throw e;
         }
         ctx.scene.leave();
         ctx.replyWithHTML("ERROR: \n" + e.message);
      }
   }
);
export const sceneConfigAlertShield: any = new Scenes.WizardScene(
   SCENE_CHANGE_CONFIG_ALERT_SHIELD,
   async (ctx) => nextStep(ctx),
   async (ctx: any) => {
      try {
         const mode = parseInt(getValue(ctx));
         if (mode) {
            if (mode < 0 || mode > 200) {
               await ctx.replyWithHTML(`Value not allowed: ${mode}`);
               return ctx.scene.leave();
            }
            await ctx.replyWithHTML(
               `Account: ${bot.getIdentify()}\n\nConfiguration changed, server will restarted`
            );
            await bot.saveConfig(bot.getIdentify(), "ALERT_SHIELD", mode);
            return ctx.scene.leave();
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            "How much shield does the hero have, for you to be notified?",
            [
               Markup.button.callback("10", "10"),
               Markup.button.callback("30", "30"),
               Markup.button.callback("50", "50"),
               Markup.button.callback("70", "70"),
               Markup.button.callback("100", "100"),
               Markup.button.callback("130", "130"),
               Markup.button.callback("150", "150"),
               Markup.button.callback("200", "200"),
            ]
         );
      } catch (e: any) {
         if (e.message == "exit") {
            throw e;
         }
         ctx.scene.leave();
         ctx.replyWithHTML("ERROR: \n" + e.message);
      }
   }
);
export const sceneConfigTelegramChatId: any = new Scenes.WizardScene(
   SCENE_CHANGE_CONFIG_TELEGRAM_CHAT_ID,
   async (ctx) => nextStep(ctx),
   async (ctx: any) => {
      try {
         const mode = getValue(ctx);
         if (mode) {
            await ctx.replyWithHTML(
               `Account: ${bot.getIdentify()}\n\nConfiguration changed, server will restarted`
            );
            await bot.saveConfig(bot.getIdentify(), "TELEGRAM_CHAT_ID", mode);
            return ctx.scene.leave();
         }

         await ctx.replyWithHTML(`Enter the TELEGRAM_CHAT_ID`);
      } catch (e: any) {
         if (e.message == "exit") {
            throw e;
         }
         ctx.scene.leave();
         ctx.replyWithHTML("ERROR: \n" + e.message);
      }
   }
);
export const sceneConfigAlertMaterial: any = new Scenes.WizardScene(
   SCENE_CHANGE_CONFIG_ALERT_MATERIAL,
   async (ctx) => nextStep(ctx),
   async (ctx: any) => {
      try {
         const mode = getValue(ctx);
         if (mode) {
            await ctx.replyWithHTML(
               `Account: ${bot.getIdentify()}\n\nConfiguration changed, server will restarted`
            );
            await bot.saveConfig(bot.getIdentify(), "ALERT_MATERIAL", mode);
            return ctx.scene.leave();
         }

         await ctx.replyWithHTML(
            `Inform how much material you want to receive notification with`
         );
      } catch (e: any) {
         if (e.message == "exit") {
            throw e;
         }
         ctx.scene.leave();
         ctx.replyWithHTML("ERROR: \n" + e.message);
      }
   }
);
export const sceneConfigResetShieldAuto: any = new Scenes.WizardScene(
   SCENE_CHANGE_CONFIG_RESET_SHIELD_AUTO,
   async (ctx) => nextStep(ctx),
   async (ctx: any) => {
      try {
         const mode = getValue(ctx);
         if (mode.length) {
            if (mode !== "0" && mode !== "1") {
               await ctx.replyWithHTML(`Value not allowed: ${mode}`);
               return ctx.scene.leave();
            }

            await ctx.replyWithHTML(
               `Account: ${bot.getIdentify()}\n\nConfiguration changed, server will restarted`
            );
            await bot.saveConfig(
               bot.getIdentify(),
               "RESET_SHIELD_AUTO",
               mode === "0" ? null : 1
            );
            return ctx.scene.leave();
         }

         if (bot.loginParams.type == "user") {
            await ctx.replyWithHTML(
               `Functionality only allowed when logging in with the wallet`
            );
            return ctx.scene.leave();
         }

         if (bot.loginParams.rede != "POLYGON") {
            await ctx.replyWithHTML(`Functionality only allowed for POLYGON`);
            return ctx.scene.leave();
         }

         await sendMessageWithButtonsTelegram(ctx, "Reset auto shield", [
            Markup.button.callback("Enable", "1"),
            Markup.button.callback("Disable", "0"),
         ]);
      } catch (e: any) {
         if (e.message == "exit") {
            throw e;
         }
         ctx.scene.leave();
         ctx.replyWithHTML("ERROR: \n" + e.message);
      }
   }
);
export const sceneConfigServer: any = new Scenes.WizardScene(
   SCENE_CHANGE_CONFIG_SERVER,
   async (ctx) => nextStep(ctx),
   async (ctx: any) => {
      try {
         const mode = getValue(ctx);
         if (mode) {
            if (!["na", "sea", "sa"].includes(mode)) {
               await ctx.replyWithHTML("Server not found: " + mode);
               return ctx.scene.leave();
            }

            await ctx.replyWithHTML(
               `Account: ${bot.getIdentify()}\n\nConfiguration changed, server will restarted`
            );
            await bot.saveConfig(bot.getIdentify(), "SERVER", mode);
            return ctx.scene.leave();
         }

         await sendMessageWithButtonsTelegram(ctx, "Select a server", [
            Markup.button.callback("na", "na"),
            Markup.button.callback("sea", "sea"),
            Markup.button.callback("sa", "sa"),
         ]);
      } catch (e: any) {
         if (e.message == "exit") {
            throw e;
         }
         ctx.scene.leave();
         ctx.replyWithHTML("ERROR: \n" + e.message);
      }
   }
);

const percentage = [2, 5, 8, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100];
export const sceneConfigPercentage: any = new Scenes.WizardScene(
   SCENE_CHANGE_CONFIG_PERCENTAGE,
   async (ctx) => nextStep(ctx),
   async (ctx: any) => {
      try {
         const mode = parseInt(getValue(ctx));
         if (mode) {
            if (!percentage.includes(mode)) {
               await ctx.replyWithHTML("Percentage not found: " + mode);
               return ctx.scene.leave();
            }

            await ctx.replyWithHTML(
               `Account: ${bot.getIdentify()}\n\nConfiguration changed, server will restarted`
            );
            await bot.saveConfig(
               bot.getIdentify(),
               "MIN_HERO_ENERGY_PERCENTAGE",
               mode
            );
            return ctx.scene.leave();
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            "Select a percentage",
            percentage.map((p) => Markup.button.callback(`${p}%`, p.toString()))
         );
      } catch (e: any) {
         if (e.message == "exit") {
            throw e;
         }
         ctx.scene.leave();
         ctx.replyWithHTML("ERROR: \n" + e.message);
      }
   }
);
const heroes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
export const sceneConfigNumHeroes: any = new Scenes.WizardScene(
   SCENE_CHANGE_CONFIG_NUM_HEROES,
   async (ctx) => nextStep(ctx),
   async (ctx: any) => {
      try {
         const mode = parseInt(getValue(ctx));
         if (mode) {
            if (!percentage.includes(mode)) {
               await ctx.replyWithHTML("Percentage not found: " + mode);
               return ctx.scene.leave();
            }

            await ctx.replyWithHTML(
               `Account: ${bot.getIdentify()}\n\nConfiguration changed, server will restarted`
            );
            await bot.saveConfig(bot.getIdentify(), "NUM_HERO_WORK", mode);
            return ctx.scene.leave();
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            "Select a qty",
            heroes.map((p) => Markup.button.callback(`${p}`, p.toString()))
         );
      } catch (e: any) {
         if (e.message == "exit") {
            throw e;
         }
         ctx.scene.leave();
         ctx.replyWithHTML("ERROR: \n" + e.message);
      }
   }
);
export const sceneConfigHouseHeroes: any = new Scenes.WizardScene(
   SCENE_CHANGE_CONFIG_HOUSE_HEROES,
   async (ctx) => nextStep(ctx),
   async (ctx: any) => {
      try {
         const mode = getValue(ctx);
         const heroes = sortByRarityDesc(bot.squad.activeHeroes);
         if (mode) {
            let selected = ctx.wizard.state.heroesSelected;

            if (mode == `submit`) {
               await ctx.replyWithHTML(
                  `Account: ${bot.getIdentify()}\n\nConfiguration changed, server will restarted`
               );
               await bot.saveConfig(
                  bot.getIdentify(),
                  "HOUSE_HEROES",
                  selected.join(":")
               );
               return ctx.scene.leave();
            }
            if (mode == `cancel`) {
               await ctx.replyWithHTML("Canceled");
               return ctx.scene.leave();
            }

            const hero = bot.squad.activeHeroes.find((h) => h.id == mode);
            if (!hero || !selected) {
               ctx.replyWithHTML(`Hero not found: ${hero}`);
               await ctx.replyWithHTML("Canceled");
               return ctx.scene.leave();
            }

            if (selected.includes(mode)) {
               selected = selected.filter((id: string) => id != mode);
            } else {
               selected.push(mode);
            }

            ctx.wizard.state.heroesSelected = selected;
            const button = ctx.wizard.state.button;
            const buttons = Markup.inlineKeyboard(
               [
                  ...bot.telegram.createButtonsHero(heroes, selected),
                  Markup.button.callback("cancel", "cancel"),
                  Markup.button.callback("submit", "submit"),
               ],
               { columns: 2 }
            );
            await bot.telegram.telegraf?.telegram.editMessageReplyMarkup(
               button.chat.id,
               button.message_id,
               button.text,
               {
                  inline_keyboard: buttons.reply_markup.inline_keyboard,
               }
            );
            return;
         }
         ctx.wizard.state.heroesSelected = bot.params.houseHeroes.split(":");
         ctx.wizard.state.button = await ctx.replyWithHTML(
            "Select the heroes",
            Markup.inlineKeyboard(
               [
                  ...bot.telegram.createButtonsHero(
                     heroes,
                     ctx.wizard.state.heroesSelected
                  ),
                  Markup.button.callback("cancel", "cancel"),
                  Markup.button.callback("submit", "submit"),
               ],
               { columns: 2 }
            )
         );
      } catch (e: any) {
         console.log(e);
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   }
);

export const sceneConfig: any = new Scenes.WizardScene(
   SCENE_CHANGE_CONFIG,
   async (ctx) => nextStep(ctx),
   async (ctx: any) => {
      try {
         if (!bot.shouldRun) {
            await ctx.replyWithHTML(
               `Account: ${bot.getIdentify()}\n\nAccount not working`
            );
            return ctx.scene.leave();
         }

         const mode = getValue(ctx);
         if (mode) {
            const scenes: any = {
               SERVER: SCENE_CHANGE_CONFIG_SERVER,
               MIN_HERO_ENERGY_PERCENTAGE: SCENE_CHANGE_CONFIG_PERCENTAGE,
               NUM_HERO_WORK: SCENE_CHANGE_CONFIG_NUM_HEROES,
               HOUSE_HEROES: SCENE_CHANGE_CONFIG_HOUSE_HEROES,
               TELEGRAM_CHAT_ID: SCENE_CHANGE_CONFIG_TELEGRAM_CHAT_ID,
               RESET_SHIELD_AUTO: SCENE_CHANGE_CONFIG_RESET_SHIELD_AUTO,
               MAX_GAS_REPAIR_SHIELD: SCENE_CHANGE_CONFIG_MAX_GAS_REPAIR_SHIELD,
               ALERT_MATERIAL: SCENE_CHANGE_CONFIG_ALERT_MATERIAL,
            };

            if (mode in scenes) {
               await ctx.scene.enter(scenes[mode]);
            }

            return;
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            "Select a config",
            [
               Markup.button.callback("SERVER", "SERVER"),
               Markup.button.callback(
                  "MIN_HERO_ENERGY_PERCENTAGE",
                  "MIN_HERO_ENERGY_PERCENTAGE"
               ),
               Markup.button.callback("NUM_HERO_WORK", "NUM_HERO_WORK"),
               Markup.button.callback("HOUSE_HEROES", "HOUSE_HEROES"),
               Markup.button.callback("TELEGRAM_CHAT_ID", "TELEGRAM_CHAT_ID"),
               Markup.button.callback("RESET_SHIELD_AUTO", "RESET_SHIELD_AUTO"),
               Markup.button.callback(
                  "MAX_GAS_REPAIR_SHIELD",
                  "MAX_GAS_REPAIR_SHIELD"
               ),
               Markup.button.callback("ALERT_SHIELD", "ALERT_SHIELD"),
               Markup.button.callback("ALERT_MATERIAL", "ALERT_MATERIAL"),
            ],
            1
         );
      } catch (e: any) {
         ctx.scene.leave();
         ctx.replyWithHTML("ERROR: \n" + e.message);
      }
   }
);
