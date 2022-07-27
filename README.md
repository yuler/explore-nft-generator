# explore-nft-generator

> Explore NFT Generator

## Explores

### 1. 参考 [nft-art-generator](https://github.com/fireship-io/nft-art-generator)

通过随机组合 `hair`, `eyes`, `mouth`, `nose`, `beard` 和 `bg` 类型的 svg 图层

然后再使用 [sharp](https://npm.im/sharp) 将 svg 生成图片, 同时保存 svg, png, json(图片元信息) 文件

运行示例

```bash
pnpm install
pnpm run gen
```
