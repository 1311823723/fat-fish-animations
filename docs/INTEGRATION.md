# 接入方式

## 新服装

在素材仓库运行 `node scripts/install-to-game.mjs <id> <小屋game目录>`。此命令会完整检查服装包，再调用安装器写入目标 `public/assets/outfits/<id>` 和 `public/assets/outfits-v1.json`。不会修改模型、QQ白名单、账号或聊天存档，也不会自动重启进程。

然后在目标小屋运行 `npm run build`。按现有流程更新公开网页；后台也需在空闲时重载，让网页、QQ和旅行绘图看到同一份服装清单。安装器拒绝重复ID，避免误覆盖。

## 已有同ID的服装升级

先备份现有服装目录及 `outfits-v1.json`。将本库同ID包放入测试环境，更新该服装清单条目的名称、动作、preview、photoReference、photoDescription和inspiration；动作与预览路径需要加 `/assets/outfits/<id>/` 前缀。不要只覆盖图片却继续使用旧grid、旧哈希文件名或旧清单。

确认16项动作、换装、移动、睡眠正常，再同步正式环境并构建、部署和重载。保留角色当前穿着ID及其他存档，不导入本库作为游戏存档。

## 女仆装扩展动作

`extensions/maid-extra` 只有五项新增动作，不含基础服装包。复制需要的图集到目标静态资源目录，将其 `animations.json` 中对应动作合并到项目实际读取的动作清单，并调整文件URL。小屋当前使用 `public/assets/manifest-v4.json`；其他项目以自己的加载代码为准。

## 其他引擎

按 [FORMAT.md](FORMAT.md) 读取每帧矩形、fps和once，在自己的动画系统中播放。不要假设所有图片同尺寸、所有动作八帧或所有图集只有一行。预览页的裁切实现可作为参考。
