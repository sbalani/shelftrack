"use client";

import { importProducts, importRetailers } from "@/app/(app)/master-data-actions";
import { AlertCircle, Check, FileDown, FileUp, LoaderCircle } from "lucide-react";
import { useActionState } from "react";

export function CsvImportForm({ kind }: { kind: "retailers" | "products" }) {
  const action = kind === "retailers" ? importRetailers : importProducts;
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <section className="csv-import panel">
      <div className="csv-copy"><span className="metric-icon aqua"><FileUp size={20} /></span><div><p className="eyebrow">Bulk import</p><h2>Upload {kind} CSV</h2><p>Existing records are skipped using normalized database keys. New child records can still be added beneath existing parents.</p></div></div>
      <form action={formAction}><input name="file" type="file" accept=".csv,text/csv" required /><button className="button button-primary" disabled={pending}>{pending ? <LoaderCircle className="spin" size={17} /> : <FileUp size={17} />}{pending ? "Importing" : "Import CSV"}</button><a className="button button-secondary" href={`/templates/${kind}.csv`} download><FileDown size={16} />Template</a></form>
      {state ? <div className="import-result"><span><Check size={14} />{state.imported} rows added</span><span>{state.duplicates} duplicates skipped</span>{state.errors.map((error) => <span className="import-error" key={error}><AlertCircle size={13} />{error}</span>)}</div> : null}
    </section>
  );
}
