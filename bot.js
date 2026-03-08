// bot.js
const express = require('express');
const { Telegraf } = require('telegraf');

// --- 请在这里输入你的机器人 Token ---
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_ACTUAL_BOT_TOKEN_HERE';

// 服务器监听的端口
const PORT = process.env.PORT || 3000;

// Telegram Webhook 的路径
const WEBHOOK_PATH = '/telegram';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'YOUR_RAILWAY_URL_HERE';

if (TELEGRAM_BOT_TOKEN === 'YOUR_ACTUAL_BOT_TOKEN_HERE' || WEBHOOK_URL === 'YOUR_RAILWAY_URL_HERE') {
  console.warn('请先在代码中或部署时通过环境变量设置 TELEGRAM_BOT_TOKEN 和 WEBHOOK_URL！');
}

// 创建机器人和服务器实例
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
const app = express();
app.use(express.json());

// 飞书 Webhook 路由
app.post('/feishu', (req, res) => {
  console.log("收到飞书请求:", req.body);
  res.json({ msg: 'ok' });
});

// 启动服务器
app.listen(PORT, async () => {
  console.log(`服务器运行在端口 ${PORT}`);
  try {
    await bot.telegram.setWebhook(`${WEBHOOK_URL}${WEBHOOK_PATH}`);
    console.log(`Webhook 已设置为: ${WEBHOOK_URL}${WEBHOOK_PATH}`);
  } catch (error) {
    console.error('设置 Webhook 时出错:', error);
  }
});

// 将 Telegram Webhook 连接到服务器路由
app.use(WEBHOOK_PATH, bot.webhookCallback(WEBHOOK_PATH));

// 处理 Telegram 消息
bot.on('text', (ctx) => {
  console.log('收到 Telegram 消息:', ctx.message.text);
  ctx.reply(`您发送了: ${ctx.message.text}\n此消息由云端机器人回复！`);
});

console.log("机器人已启动...");
