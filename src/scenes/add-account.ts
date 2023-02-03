import { Markup, Scenes } from "telegraf";
import { bot } from "..";
import { sendMessageWithButtonsTelegram } from "../lib";
import { SCENE_ADD_ACCOUNT } from "./list";

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

const createButtonsCommand = (
   commands: string[],
   commandsSelected: string[]
) => {
   return [
      ...commands.map((command) => {
         const selected = commandsSelected.includes(command) ? "✅" : "";
         const text = `${selected} ${command}`;

         return Markup.button.callback(text, command);
      }),
      Markup.button.callback("next", "next"),
   ];
};

export const sceneAddAccount: any = new Scenes.WizardScene(
   SCENE_ADD_ACCOUNT,
   async (ctx) => nextStep(ctx), //0
   async (ctx: any) => {
      //1
      try {
         if (!bot.shouldRun) {
            await ctx.replyWithHTML(
               `Account: ${bot.getIdentify()}\n\nAccount not working`
            );
            return ctx.scene.leave();
         }

         const mode = getValue(ctx);
         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            if (!["wallet", "user"].includes(mode)) {
               ctx.replyWithHTML(`Command not found, exiting command...`);
               return ctx.scene.leave();
            }

            ctx.wizard.state.login = mode;
            if (mode == "user") {
               await nextStep(ctx);
            } else {
               await nextStep(ctx, 4);
            }
            return;
         }
         await ctx.replyWithHTML(
            "to cancel the registration action, type moment /meu_cu_arrombado"
         );
         await sendMessageWithButtonsTelegram(
            ctx,
            "Would you like to login to bomb via wallet or username",
            [
               Markup.button.callback("wallet", "wallet"),
               Markup.button.callback("user", "user"),
            ]
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //2
      try {
         const mode = getValue(ctx);
         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.username = mode;
            await nextStep(ctx);
            return;
         }
         await ctx.replyWithHTML(`Enter bomb username`);
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //3
      try {
         const mode = getValue(ctx);
         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.password = mode;
            await nextStep(ctx, 6);
            return;
         }
         await ctx.replyWithHTML(`Enter bomb password`);
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //4
      try {
         const mode = getValue(ctx);
         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.wallet = mode;
            await nextStep(ctx);
            return;
         }
         await ctx.replyWithHTML(`Enter wallet ID`);
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //5
      try {
         const mode = getValue(ctx);
         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.privateKey = mode;
            await nextStep(ctx);
            return;
         }
         await ctx.replyWithHTML(`Enter wallet private key`);
         await ctx.replyWithAnimation(
            `https://metamask.zendesk.com/hc/article_attachments/9025953096603/How_to_export_an_account_s_private_key.gif`
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //6
      await nextStep(ctx);
   },
   async (ctx: any) => {
      //7
      try {
         const mode = getValue(ctx);

         if (mode.length) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            if (mode === "1") {
               return nextStep(ctx);
            }
            return nextStep(ctx, 10);
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            "Does the account have a house?",
            [
               Markup.button.callback("No", "0"),
               Markup.button.callback("Yes", "1"),
            ]
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //8
      try {
         const mode = getValue(ctx);

         if (mode.length) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            if (mode === "1") {
               return nextStep(ctx);
            }
            return nextStep(ctx, 10);
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            "Would you like to inform the heroes who will have preference to use the house?",
            [
               Markup.button.callback("No", "0"),
               Markup.button.callback("Yes", "1"),
            ]
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //9
      try {
         const mode = getValue(ctx);

         if (mode.length) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.houseHeroes = mode;
            return nextStep(ctx);
         }

         await ctx.replyWithHTML(
            'inform the ids of the heroes separated by ":", \n\n example: \n\n 22324987:22824990:232824987'
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //10
      try {
         const mode = getValue(ctx);
         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.network = mode;
            return nextStep(ctx);
         }

         return await sendMessageWithButtonsTelegram(
            ctx,
            "Which network do you want to play?",
            [
               Markup.button.callback("BSC", "BSC"),
               Markup.button.callback("POLYGON", "POLYGON"),
            ]
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //11
      try {
         const mode = getValue(ctx);
         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.telegramKey = mode;
            return nextStep(ctx);
         }

         return await ctx.replyWithHTML(`Enter the TELEGRAM_KEY`);
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //12
      try {
         const mode = getValue(ctx);
         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.telegramChatId = mode;
            return nextStep(ctx);
         }

         await ctx.replyWithHTML(`Enter the TELEGRAM_CHAT_ID`);
         return await ctx.replyWithHTML(
            `Your TELEGRAM_CHAT_ID: ${ctx.update?.message.chat.id}`
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //13
      try {
         const mode = getValue(ctx);
         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.percentageWork = parseInt(mode);
            return nextStep(ctx);
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            "How many % of life will the hero work with?",
            [
               Markup.button.callback("2", "2"),
               Markup.button.callback("5", "5"),
               Markup.button.callback("10", "10"),
               Markup.button.callback("15", "15"),
               Markup.button.callback("20", "20"),
               Markup.button.callback("30", "30"),
               Markup.button.callback("50", "50"),
               Markup.button.callback("70", "70"),
               Markup.button.callback("90", "90"),
            ]
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //14
      try {
         const mode = getValue(ctx);

         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.alertShield = parseInt(mode);
            return nextStep(ctx);
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
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //15
      try {
         const mode = getValue(ctx);

         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.numHeroWork = parseInt(mode);
            return nextStep(ctx);
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            "How many heroes can work at the same time?",
            [
               Markup.button.callback("1", "1"),
               Markup.button.callback("2", "2"),
               Markup.button.callback("3", "3"),
               Markup.button.callback("4", "4"),
               Markup.button.callback("5", "5"),
               Markup.button.callback("6", "6"),
               Markup.button.callback("7", "7"),
               Markup.button.callback("8", "8"),
               Markup.button.callback("9", "9"),
               Markup.button.callback("10", "10"),
               Markup.button.callback("11", "11"),
               Markup.button.callback("12", "12"),
               Markup.button.callback("13", "13"),
               Markup.button.callback("14", "14"),
               Markup.button.callback("15", "15"),
            ]
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //16
      try {
         const mode = getValue(ctx);

         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.server = mode;
            return nextStep(ctx);
         }

         await sendMessageWithButtonsTelegram(ctx, "What server", [
            Markup.button.callback("sea", "sea"),
            Markup.button.callback("na", "na"),
            Markup.button.callback("sa", "sa"),
         ]);
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //17
      try {
         const mode = getValue(ctx);

         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.identify = mode;
            return nextStep(ctx);
         }

         await ctx.replyWithHTML(`Enter an identifying name for this account`);
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //18
      try {
         const mode = getValue(ctx);

         if (mode.length) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            if (mode === "1") {
               return nextStep(ctx);
            }
            return nextStep(ctx, 20);
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            `Would you like to receive reports automatically? /rewards`,
            [
               Markup.button.callback("No", "0"),
               Markup.button.callback("Yes", "1"),
            ]
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //19
      try {
         const mode = getValue(ctx);

         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.reportRewards = mode;
            return nextStep(ctx);
         }

         await ctx.replyWithHTML(
            `Type in minutes, how often it should be sent, example: 120 = 2 hours`
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //20
      try {
         if (
            ctx.wizard.state.login === "user" ||
            ctx.wizard.state.network == "BSC"
         ) {
            return nextStep(ctx);
         }
         const mode = getValue(ctx);

         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.resetShieldAuto = mode == "1";
            return nextStep(ctx);
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            `Would you like to enable automatic shield reset`,
            [
               Markup.button.callback("No", "0"),
               Markup.button.callback("Yes", "1"),
            ]
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //21
      try {
         if (
            ctx.wizard.state.login === "user" ||
            ctx.wizard.state.network == "BSC"
         ) {
            return nextStep(ctx);
         }
         const mode = getValue(ctx);

         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            if (mode == "1") {
               return nextStep(ctx);
            }

            return nextStep(ctx, 23);
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            `Do you want to inform the maximum value in matic to repair the shield?`,
            [
               Markup.button.callback("No", "0"),
               Markup.button.callback("Yes", "1"),
            ]
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //22
      try {
         if (
            ctx.wizard.state.login === "user" ||
            ctx.wizard.state.network == "BSC"
         ) {
            return nextStep(ctx);
         }
         const mode = getValue(ctx);

         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.maxGasRepairShield = parseFloat(mode);
            return nextStep(ctx);
         }

         await ctx.replyWithHTML(
            `Enter the maximum value in matic, example <b>0.004</b>`
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //23
      try {
         if (
            ctx.wizard.state.login === "user" ||
            ctx.wizard.state.network == "BSC"
         ) {
            return nextStep(ctx);
         }
         const mode = getValue(ctx);

         if (mode) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.alertMaterial = parseInt(mode);
            return nextStep(ctx);
         }

         await ctx.replyWithHTML(
            `Inform how much material you want to receive notification with`
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //24
      try {
         const mode = getValue(ctx);

         if (mode.length) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.ignoreNumHeroWork = mode == "1";
            return nextStep(ctx);
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            `You want when the hero reaches 100% energy, he is forced to work?`,
            [
               Markup.button.callback("No", "0"),
               Markup.button.callback("Yes", "1"),
            ]
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //25
      try {
         const mode = getValue(ctx);

         if (mode.length) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            ctx.wizard.state.telegramChatIdCheck = mode == "1";
            return nextStep(ctx);
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            `Do you want only the owner of the telegram chat id "${ctx.wizard.state.telegramChatId}" to be able to trigger commands on that account?`,
            [
               Markup.button.callback("No", "0"),
               Markup.button.callback("Yes", "1"),
            ]
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //26
      try {
         const mode = getValue(ctx);

         if (mode.length) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            if (mode === "1") {
               return nextStep(ctx);
            }
            return nextStep(ctx, 28);
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            `Do you want this account not to run any commands?`,
            [
               Markup.button.callback("No", "0"),
               Markup.button.callback("Yes", "1"),
            ]
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //27
      try {
         const commands = [
            "/rewards",
            "/shield",
            "/rewards_all",
            "/withdraw",
            "/deactivate_hero",
            "/add_account",
            "/remove_account",
            "/activate_hero",
         ];
         const mode = getValue(ctx);

         if (mode.length) {
            if (mode == "/meu_cu_arrombado") {
               await ctx.replyWithHTML(`Hmmm...`);
               return ctx.scene.leave();
            }
            if (mode == `next`) return nextStep(ctx);
            const button = ctx.wizard.state.buttons;
            let selected = ctx.wizard.state.ignoreCommands;

            if (selected.includes(mode)) {
               selected = selected.filter((id: string) => id != mode);
            } else {
               selected.push(mode);
            }

            ctx.wizard.state.ignoreCommands = selected;

            const buttons = Markup.inlineKeyboard(
               [...createButtonsCommand(commands, selected)],
               { columns: 1 }
            );

            await bot.telegram.telegraf?.telegram.editMessageReplyMarkup(
               button.chat.id,
               button.message_id,
               "Select the command",
               {
                  inline_keyboard: buttons.reply_markup.inline_keyboard,
               }
            );
            return;
         }
         ctx.wizard.state.ignoreCommands = [];

         ctx.wizard.state.buttons = await ctx.replyWithHTML(
            "Select the command",
            Markup.inlineKeyboard(
               commands.map((command) =>
                  Markup.button.callback(command, command)
               ),
               { columns: 1 }
            )
         );
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   },
   async (ctx: any) => {
      //28
      try {
         ctx.replyWithHTML(`Creating account...`);
         await bot.telegram.addAccount(ctx, ctx.wizard.state);
         await ctx.scene.leave();
         await bot.pm2Restart();
      } catch (e: any) {
         await ctx.replyWithHTML("ERROR: \n" + e.message);
         ctx.scene.leave();
      }
   }
);
