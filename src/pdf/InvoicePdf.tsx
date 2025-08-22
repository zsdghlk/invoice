// src/pdf/InvoicePdf.tsx
import "./fonts";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12, color: "#000", fontFamily: "NotoSansJP" },
  h1: { fontSize: 20, marginBottom: 10, fontWeight: 700, color: "#000" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  section: { marginTop: 10, paddingTop: 8, borderTop: 1, borderColor: "#000" },
  label: { fontWeight: 700, color: "#000" },
  tiny: { fontSize: 10, color: "#222" },
});

type Org = { name: string; address?: string; tel?: string; invoice_reg_no?: string };
type Invoice = { invoice_no: string; issue_date: string; due_date?: string };
type InvoiceItem = { name: string; qty: number; unit_price: number; tax_rate: number; tax_included?: boolean };
type Summary = { buckets: Record<string, { net: number; tax: number }>; subtotal: number; taxTotal: number; total: number };

export default function InvoicePdf({
  org, inv, items, summary,
}: { org: Org; inv: Invoice; items: InvoiceItem[]; summary: Summary }) {
  const ordered = Object.entries(summary.buckets).sort(
    (a, b) => Number(b[0].replace("%", "")) - Number(a[0].replace("%", ""))
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>請求書 / INVOICE</Text>

        <View style={styles.section}>
          <Text style={styles.label}>{org.name}</Text>
          {org.invoice_reg_no ? <Text>適格請求書発行事業者番号: {org.invoice_reg_no}</Text> : null}
          <Text>{(org.address || "") + (org.address && org.tel ? " / " : "")}{org.tel || ""}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}><Text style={styles.label}>請求書番号</Text><Text>{inv.invoice_no}</Text></View>
          <View style={styles.row}><Text style={styles.label}>発行日</Text><Text>{inv.issue_date}</Text></View>
          {inv.due_date ? <View style={styles.row}><Text style={styles.label}>支払期日</Text><Text>{inv.due_date}</Text></View> : null}
        </View>

        <View style={styles.section}>
          {items.map((it, i) => (
            <View key={i} style={styles.row}>
              <Text>{it.name}（{it.qty} × ¥{Number(it.unit_price).toLocaleString("ja-JP")}）</Text>
              <Text style={styles.label}>{it.tax_rate}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          {ordered.map(([rate, v]) => (
            <View key={rate} style={styles.row}>
              <Text style={styles.label}>小計（{rate}）</Text>
              <Text>¥{v.net.toLocaleString("ja-JP")}（税: ¥{v.tax.toLocaleString("ja-JP")}）</Text>
            </View>
          ))}
          <View style={styles.row}><Text style={styles.label}>消費税計</Text><Text>¥{summary.taxTotal.toLocaleString("ja-JP")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>合計</Text><Text>¥{summary.total.toLocaleString("ja-JP")}</Text></View>
        </View>

        <Text style={[styles.tiny, { marginTop: 12 }]}>
          ※表記金額は概算です。端数処理は帳票設定の規定に従います。
        </Text>
      </Page>
    </Document>
  );
}
