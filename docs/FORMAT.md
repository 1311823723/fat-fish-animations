# 图集格式

整套服装在 `outfits/<id>/outfit.json` 描述，`id` 是稳定标识，改展示名称不要改它。`actions` 必须覆盖检查脚本中的16项动作，`file`、`preview`、`photoReference` 都是包内文件名，不能含目录或 `..`。

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

不提供 `grid` 时每帧256×256、每行最多八帧，顺序先横后纵。矩形帧必须保留宽高比，不能拉成正方形。小屋使用帧高归一化和244/256处的脚底锚点；其他引擎可用自己的显示尺寸，但要逐帧检查落脚位置。

`once:true` 表示单次动作；结束后回到站立或当前活动。`fps` 是素材播放速率，不能拿渲染帧率直接递增素材帧。用实际经过时间计算帧序号。

`photoReference` 是旅行绘图参考，不用于加载衣柜卡片；卡片使用最大280×320的 `preview`。当前运行WebP的文件名含内容哈希，换图时应换文件名，不要让缓存继续返回旧图。原始PNG与运行图保持相同尺寸和帧布局。

扩展动作使用 `extensions/<id>/animations.json`，不要求全16项，只声明实际包含的动作；不能作为整套服装安装。
