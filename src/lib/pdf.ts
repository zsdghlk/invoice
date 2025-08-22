// src/lib/pdf.ts
import React from "react";

/**
 * React-PDF をクライアントでだけ読み込み、Blob を作ってダウンロード。
 * - SSR 誤検出を回避（Next 15 / Turbopack でも安定）
 * - Safari 対応で <a> を append→click→remove
 */
export async function downloadPdf(
  component: React.ReactElement,
  filename = "invoice.pdf"
) {
  if (typeof window === "undefined") {
    // SSR では何もしない（安全に無視）
    return;
  }

  // ここでだけ @react-pdf/renderer を読み込む
  const { pdf } = await import("@react-pdf/renderer");

  // toBlob() はフォント読み込み後に安定する
  const blob = await pdf(component).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  // 一拍置いてから revoke（Safari 安定化）
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
