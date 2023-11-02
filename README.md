### How to ?

```
npm i
```

```
npm run polling
or
npm run long-polling
or
npm run sse
or
npm run ws
```

### QR


二维码的状态：

- 未扫描 unscanned

- 已扫描，等待用户确认 scanned-unconfirmed

- 已扫描，用户同意授权 scanned-confirmed

- 已扫描，用户取消授权 scanned-cancel

- 已过期 expired 

修改二维码的状态接口：

- 确认已经扫描

- 同意授权

- 取消授权
