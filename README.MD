# MUTEX TECH Bellow Generator V2

## Changelog

### 2026-06-01

- Added editable project name and unified export filenames.
- Added built-in config import script with list, delete, rename, and sort.
- Added minimum bounding rectangle preview/export layer.
- Added optional rotation by bounding rectangle.
- Updated `ODF / ODR` signed input behavior; exported configs still store positive offsets.
- Fixed rear mounting frame height to use the last `LHS` group, not the largest `LHS`.

## 简介

一个用于在线生成相机皮腔展开图的静态网页工具。页面左侧输入尺寸参数，右侧实时生成 SVG 矢量预览，并支持导出 SVG / PDF。

## 使用方式

直接用浏览器打开：

```text
index.html
```

项目不需要构建工具、后端服务或依赖安装。

## 主要功能

- 前框、后框内外尺寸输入
- 多组皮腔节配置，可添加不同 `LHS / NOS`
- 显示皮腔长度，也就是梯形 `M` 的高
- 支持生成皮腔骨架，可切换普通内缩梯形骨架或矩形骨架
- 粘合带生成、裁切与开关控制
- 增强粘合框开关
- 前后高度差 `FRHD` 调整
- SVG 矢量实时预览
- 鼠标滚轮缩放，左键拖拽平移
- 参数悬停说明和画布箭头指示
- 简体中文 / English 切换
- 配置 JSON 导入导出
- 图纸导出为 SVG / PDF

## 默认配置

内置配置名：

```text
Linhof master technika
```

默认单位为 `mm`。

## 配置 JSON 格式

导出的 JSON 大致如下：

```json
{
  "version": 1,
  "name": "Linhof master technika",
  "units": "mm",
  "params": {
    "wif": 95,
    "hif": 83.3,
    "wof": 110,
    "hof": 110,
    "wir": 123.7,
    "hir": 125.6,
    "wor": 150,
    "hor": 150,
    "woo": 15,
    "odf": 12,
    "odr": 100,
    "frhd": 8,
    "srd": 0.5,
    "ribCornerRadius": 0.5,
    "enableSupportRibs": false,
    "useRectangularRibs": true,
    "useCornerlessRibs": false,
    "enhanceMountFrame": true,
    "enableOverlap": true,
    "trimOverlapOutside": true,
    "sections": [
      { "lhs": 6, "nos": 4 },
      { "lhs": 10.3, "nos": 19 }
    ]
  }
}
```

## 参数说明

- `WIF / HIF`: 前框内宽、内高
- `WOF / HOF`: 前框外宽、外高，用于预览中的外尺寸参考
- `WIR / HIR`: 后框内宽、内高
- `WOR / HOR`: 后框外宽、外高，用于预览中的外尺寸参考
- `LHS`: 单组皮腔节半长
- `NOS`: 单组皮腔节数量
- `WOO`: 粘合带宽度
- `ODF`: 粘合带前边距
- `ODR`: 粘合带后边距
- `FRHD`: 前后组高度差
- `SRD`: 骨架边距，表示骨架与所在小梯形边界的距离
- `ribCornerRadius`: 骨架圆角半径，小于等于 `0` 时不启用圆角
- `enableSupportRibs`: 是否生成皮腔骨架
- `useRectangularRibs`: 是否将骨架裁剪为矩形
- `useCornerlessRibs`: 是否使用无角骨架，启用后优先于矩形骨架
- `enhanceMountFrame`: 是否增强前后粘合框
- `enableOverlap`: 是否生成粘合带
- `trimOverlapOutside`: 是否移除粘合带外侧多余部分

## 生成算法

### 1. 顶面 M

1. 计算皮腔总腰长：

```text
totalLeg = sum(2 * LHSi * NOSi)
```

2. 绘制等腰梯形 `M`：

```text
上底 = WIF
下底 = WIR
腰长 = totalLeg
```

3. 依次沿左右腰绘制皮腔折角。每个节使用一个等腰直角小三角形表示，斜边长度为：

```text
2 * LHS
```

4. 连接左右对应折点，生成水平折线。折线数量为：

```text
NOF = sum(2 * NOSi) + 1
```

5. 在顶面前后两端绘制前后粘合框：

```text
前粘合框高度 = LHS1
后粘合框高度 = max(LHSi)
```

### 2. 增强粘合框

开启 `enhanceMountFrame` 时，在每个前后粘合框两侧生成补强边：

1. 取粘合框内侧角点。
2. 找到与该角点相邻的皮腔小三角形边。
3. 从角点作该相邻边的法线。
4. 计算法线与粘合框外边的交点。
5. 绘制：

```text
内侧角点 -> 法线交点
外侧角点 -> 法线交点
```

### 3. 皮腔骨架

开启 `enableSupportRibs` 时，会在每个皮腔小梯形内生成黄色骨架线。

普通骨架：

1. 取小梯形的四条边。
2. 每条边向小梯形内部偏移 `SRD`。
3. 计算四条偏移线的交点，得到内部小梯形。
4. 用黄色线绘制该内部小梯形。

矩形骨架：

1. 先生成内部小梯形。
2. 找出内部小梯形较短的底边。
3. 以较短底为对齐边，将骨架裁剪为矩形。
4. 矩形骨架使用黄色线绘制，线宽为普通线宽的 70%。

无角骨架：

1. 先生成内部小梯形。
2. 找出内部小梯形较短的底边。
3. 将左右两条腰分别绕其与较短底的交点向内旋转 45 度。
4. 用较长底裁切旋转后的腰，移除超出较长底的多余线段。
5. 无角骨架使用黄色线绘制，线宽为普通线宽的 70%。

骨架圆角：

1. 当 `ribCornerRadius > 0` 时，对每个骨架角应用圆角。
2. 每个角会沿相邻两条边分别退让圆角半径。
3. 使用二次贝塞尔曲线连接退让点，角点作为控制点。
4. 圆角半径会自动限制在相邻边长的一半以内，避免圆角越过边界。

生成底面左半骨架时，会重新按左半底面的几何关系生成，不直接镜像底面右半骨架。启用移除粘合带以外额外部分时，骨架图形不会被裁切。

导出 SVG 时，所有骨架图形会放入独立图层：

```xml
<g id="support-ribs">
  ...
</g>
```

### 4. 右侧面 RS

1. 使用 `PMRT -> PMRB` 作为右侧面左腰。
2. 根据 `HIF / HIR` 绘制右侧面上、下底。
3. 调整上、下底方向，使其满足 `FRHD`。
4. 当 `FRHD = 0` 时，右侧面应为等腰梯形，即上下底中垂线重合。

实现中通过求侧面底边方向，使上下底中点连线在底边方向上的投影等于目标高度差。

### 5. 底面右半 M1

1. 复制顶面 `M`。
2. 将复制图形的 `PMLT` 移动到 `RSRT`。
3. 旋转并缩放复制图形，使 `PMLB` 对齐到 `RSRB`。
4. 连接顶面右侧折点与复制顶面左侧对应折点，生成右侧面折线。

### 6. 左侧面 LS 与底面左半 M2

将右侧面和底面右半沿顶面中线镜像，生成左侧面 `LS` 与底面左半 `M2`。

### 7. 粘合带

粘合带按步骤 10 分别计算，不使用简单镜像。

#### 右侧粘合带

1. 在 `M1` 顶边上，从其左顶点沿顶边量取 `ODF` 得到 `PORT`。
2. 在 `M1` 底边上，从其左顶点沿底边量取 `ODR` 得到 `PORB`。
3. 连接 `PORT -> PORB` 得到粘合带内侧线。
4. 沿该线法向向右偏移 `WOO`，得到粘合带外侧线。
5. 与前后粘合框外边求交，只保留皮腔区域内的粘合带。

#### 左侧粘合带

1. 在 `M2` 顶边上，从 `M2` 自身左顶点沿顶边量取 `ODF`。
2. 在 `M2` 底边上，从 `M2` 自身左顶点沿底边量取 `ODR`。
3. 同样向右偏移 `WOO`。
4. 与前后粘合框外边求交，只保留皮腔区域内的粘合带。

开启 `trimOverlapOutside` 时：

- 左侧按左粘合带外边界裁掉外侧多余部分
- 右侧按右粘合带外边界裁掉外侧多余部分

### 8. 清理与导出

生成完成后会进行：

- 删除文档要求移除的梯形腰线
- 去除重复线段
- 预览文字重叠检查
- SVG / PDF 导出时移除所有文字
- SVG / PDF 导出时移除外尺寸参考虚线

## 预览与导出差异

预览中会显示：

- 主图形线
- 折线
- 粘合带
- 皮腔骨架
- 外尺寸参考虚线
- 参数说明文字
- 悬停指示箭头

导出中只保留：

- 真实展开图线条
- 粘合带
- 增强粘合框
- 折线
- 皮腔骨架，位于独立 `support-ribs` 图层

导出中不会包含：

- 文字
- 外尺寸参考虚线
- 背景网格
- 悬停指示箭头

## 文件结构

```text
index.html      页面结构
styles.css      页面样式
app.js          参数、几何生成、交互与导出逻辑
bellowGenRule.md 原始规则说明
README.MD       项目说明
```
