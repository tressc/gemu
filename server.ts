import next from "next";
import { Server } from "boardgame.io/server";
import { TicTacToe } from "@/games/tictactoe";
import Router from "@koa/router";

const appPort = parseInt(process.env.APP_PORT!, 10) || 3000;
const apiPort = parseInt(process.env.API_PORT!, 10) || 8000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // boardgame.io boilerplate

  const server = Server({
    games: [TicTacToe],
    origins: [process.env.NEXT_PUBLIC_URL!],
    apiOrigins: [process.env.NEXT_PUBLIC_URL!],
  });
  const router = new Router();

  router.all("(.*)", async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.app.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.run({
    port: appPort,
    // lobbyConfig: { apiPort },
  });
  server.app.use(router.routes());
});
