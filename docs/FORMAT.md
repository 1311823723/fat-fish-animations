# 图集格式

整套服装在 `outfits/<id>/outfit.json` 描述，`id` 是稳定标识，改展示名称不要改它。`actions` 必须覆盖检查脚本中的16项动作，`file`、`preview`、`photoReference` 都是包内文件名，不能含目录或 `..`。

每帧左右必须保留透明边距；检查器逐帧拒绝可见触边像素，整个图集四角透明不代表各帧安全。已修复的紧密单行图集使用 `grid.padding: 64`，宽度、步长和画布一并更新。绘图时尽量让各姿势从一开始就互相分开，后处理不能补回源图里已经缺失的身体细节。整理方法见小屋仓库的 `docs/SPRITE_FRAME_BOUNDS.md`。

```json
{
  "file": "idle-runtime-contenthash.webp",
  "frames": 8,
  "fps": 4,
  "once": false,
  "grid": {
    "columns": 8,
    "columnStep": 271.5,
    "offsetY": 38,
    "rowStep": 580,
    "width": 271,
    "height": 580
  }
}
```

这只是格式示例，不是可用于任意图集的裁切参数。第 i 帧（从0开始）：

```js
const x = Math.floor((i % grid.columns) * grid.columnStep);
const y = grid.offsetY + Math.floor(i / grid.columns) * grid.rowStep;
ctx.drawImage(image, x, y, grid.width, grid.height, dx, dy, dw, dh);
```

不提供 `grid` 时每帧256×256、每行最多八帧，顺序先横后纵。矩形帧必须保留宽高比，不能拉成正方形。新版小屋以同套服装的站立帧高度为显示基准，其他动作只按网格宽度的分辨率比例换算，保留244/256处的脚底锚点。不能按每个动作的裁切高度分别归一化，否则睡姿会被放大。摸头、转圈也须保存逻辑比例，不可对已换算的显示比例重复缩放。其他引擎请逐帧检查人物比例和落脚位置。

`once:true` 表示单次动作；结束后回到站立或当前活动。`fps` 是素材播放速率，不能拿渲染帧率直接递增素材帧。用实际经过时间计算帧序号。

`photoReference` 是旅行绘图参考，不用于加载衣柜卡片；卡片使用最大280×320的 `preview`。当前运行WebP的文件名含内容哈希，换图时应换文件名，不要让缓存继续返回旧图。原始PNG与运行图保持相同尺寸和帧布局。

扩展动作使用 `extensions/<id>/animations.json`，不要求全16项，只声明实际包含的动作；不能作为整套服装安装。

可选字段 description：100 字以内的中文外观描述，用于新版衣柜预览和当前穿着状态。检查和安装脚本会保留它；不填写时不编造。这里不写性格、强制台词或模型指令。

