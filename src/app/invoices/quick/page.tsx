// src/app/invoices/quick/page.tsx
"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";          // ← エイリアス推奨（tsconfigのpathsで @/* を設定）
import InvoicePdf from "@/pdf/InvoicePdf";
import { summarize, type Item as TaxItem } from "@/lib/tax";
import { downloadPdf } from "@/lib/pdf";

type Org = { name: string; address?: string; tel?: string; invoice_reg_no?: string };
type Invoice = { invoice_no: string; issue_date: string; due_date?: string };
type Line = { name: string; qty: number; unit_price: number; tax_rate: number; tax_included?: boolean };

export default function QuickInvoicePage() {
  const [org] = useState<Org>({
    name: "テスト株式会社",
    address: "東京都千代田区1-1-1",
    tel: "03-1234-5678",
    // invoice_reg_no: "T1234567890123",
  });

  const [inv, setInv] = useState<Invoice>({
    invoice_no: "INV-2025-001",
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: "",
  });

  const [items, setItems] = useState<Line[]>([
    { name: "商品A", qty: 2, unit_price: 5000, tax_rate: 10 },
    { name: "サービスB", qty: 1, unit_price: 12000, tax_rate: 10 },
  ]);

  // react-pdfには計算済サマリだけ渡す（税率バケツは tax.ts に準拠）
  const summary = summarize(
    items.map<TaxItem>((it) => ({
      qty: Number(it.qty) || 0,
      unit: Number(it.unit_price) || 0,
      taxRate: Number(it.tax_rate) || 0,
      taxIncluded: !!it.tax_included,
    }))
  );

  async function handleDownload() {
    try {
      await downloadPdf(
        <InvoicePdf org={org} inv={inv} items={items} summary={summary} />,
        `${inv.invoice_no}.pdf`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert("PDF作成でエラーが発生しました。\n" + msg + "\nブラウザのConsoleにも詳細が出ています。");
      console.error(err);
    }
  }

  const inputCls  = "w-full border rounded-md px-2 py-1 bg-white text-black";
  const numCls    = "text-right " + inputCls;
  const selectCls = "w-full border rounded-md px-2 py-1 bg-white text-black";

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">クイック請求書プレビュー</h1>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <label>
              請求書番号
              <input
                className={inputCls}
                value={inv.invoice_no}
                onChange={(e) => setInv({ ...inv, invoice_no: e.target.value })}
              />
            </label>
            <label>
              発行日
              <input
                type="date"
                className={inputCls}
                value={inv.issue_date}
                onChange={(e) => setInv({ ...inv, issue_date: e.target.value })}
              />
            </label>
            <label>
              支払期日
              <input
                type="date"
                className={inputCls}
                value={inv.due_date}
                onChange={(e) => setInv({ ...inv, due_date: e.target.value })}
              />
            </label>
          </div>
        </Card>

        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">品目</th>
                <th className="text-right">数量</th>
                <th className="text-right">単価</th>
                <th className="text-right">税率</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="border-t">
                  <td>
                    <input
                      className={inputCls}
                      value={it.name}
                      onChange={(e) => {
                        const v = [...items];
                        v[i].name = e.target.value;
                        setItems(v);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className={numCls + " w-24"}
                      value={it.qty}
                      onChange={(e) => {
                        const v = [...items];
                        v[i].qty = Number(e.target.value) || 0;
                        setItems(v);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className={numCls + " w-28"}
                      value={it.unit_price}
                      onChange={(e) => {
                        const v = [...items];
                        v[i].unit_price = Number(e.target.value) || 0;
                        setItems(v);
                      }}
                    />
                  </td>
                  <td>
                    <select
                      className={selectCls + " w-24"}
                      value={it.tax_rate}
                      onChange={(e) => {
                        const v = [...items];
                        v[i].tax_rate = Number(e.target.value) || 0;
                        setItems(v);
                      }}
                    >
                      <option value={10}>10%</option>
                      <option value={8}>8%</option>
                      <option value={0}>0%</option>
                    </select>
                  </td>
                  <td className="text-right">
                    <button
                      className="text-xs text-red-600"
                      onClick={() => {
                        const v = [...items];
                        v.splice(i, 1);
                        setItems(v);
                      }}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3">
            <Button
              variant="solid"
              onClick={() =>
                setItems([...items, { name: "新しい品目", qty: 1, unit_price: 0, tax_rate: 10 }])
              }
            >
              ＋ 行追加
            </Button>
          </div>
        </Card>

        <Card className="bg-gray-50">
          <div className="text-right space-y-1">
            <div>小計: <b>¥{summary.subtotal.toLocaleString("ja-JP")}</b></div>
            <div>消費税計: <b>¥{summary.taxTotal.toLocaleString("ja-JP")}</b></div>
            <div className="text-lg">合計: <b>¥{summary.total.toLocaleString("ja-JP")}</b></div>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button variant="solid" onClick={handleDownload}>PDFダウンロード</Button>
        </div>
      </div>
    </div>
  );
}
