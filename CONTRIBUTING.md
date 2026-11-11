# 制作与贡献

本库欢迎新的整套服装和独立扩展动作。先确认参考来源可用于目标用途并补齐署名；提交不能扩大原有授权。本项目的角色衍生图继续采用CC BY-NC-SA 4.0的署名、非商业和相同方式共享要求，辅助代码采用MIT。

1. 固定角色参考：蓝发、蓝眼睛、鱼鳍、鲸鱼尾巴和头身比例。服装先定正面、侧面、背面与道具，不让每张图自由改变设计。
2. 生成完整立绘，再逐动作制作图集。使用支持透明背景的图像工具，固定帧数、位置、比例与脚底；不从别人的动画中抹掉署名冒充原创。
3. 全套服装提供16项动作、`outfit.json`、PNG旅行参考、轻量预览。原始PNG若已有请一并保留，运行WebP只保留当前版本。只做部分动作则提交到 `extensions`，不要用错误服装的动作补齐。
4. 实测填写grid，不靠固定数字猜。尤其检查走路方向、多行第二排、睡眠姿势、服装图案、遮挡关系、循环接缝和道具。`headpat`、`spin`通常单次播放。
5. 更新素材后运行 `node scripts/inventory.mjs` 重建文件哈希，再运行 `npm run validate` 和 `npm test`，用 `npm run preview` 逐项播放。自动检查不能判断“画得像不像”。
6. 在 `ATTRIBUTION.md` 增加来源、作者、许可、制作工具与改动说明；在 `catalog.json` 增加条目。给PR附预览和已检查动作，勿提交账号、令牌、Cookie、聊天、日记、照片、日志、备份或模型。

通用生成提示：Use the attached character and outfit reference exactly. [frame count] full-body animation frames at evenly spaced column centers. Preserve character identity, costume, scale, foot baseline and margins. Action: [具体动作]. True transparent RGBA background; no exterior haze, shadow, ground, grid or labels. 原地转圈要有前、侧、背角度；睡眠要明确躺下；吃白米饭时才拿饭碗；印花表情不能跟着人物表情改变。

制作记录：[卫衣](docs/CREAM_HOODIE.md)、[猫爪套装](docs/CAT_PAW.md)、[睡衣](docs/WHALE_PAJAMAS.md)。这些记录中小屋构建、缓存等段落描述的是配套小屋，不是本库预览页的必需步骤。
