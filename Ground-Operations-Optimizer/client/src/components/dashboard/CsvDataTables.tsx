import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import baggageCsv from "../../../../attached_assets/baggage_flow_1771577826129.csv?raw";
import cateringCsv from "../../../../attached_assets/catering_logs_1771577826129.csv?raw";
import fuelCsv from "../../../../attached_assets/fuel_operations_1771577826129.csv?raw";

type CsvTableData = {
  headers: string[];
  rows: string[][];
};

const parseCsv = (csvRaw: string): CsvTableData => {
  const [header, ...rows] = csvRaw.trim().split("\n");
  const headers = header.split(",").map((col) => col.trim());

  return {
    headers,
    rows: rows
      .filter(Boolean)
      .map((row) => row.split(",").map((value) => value.trim())),
  };
};

const CsvTable = ({ data }: { data: CsvTableData }) => (
  <div className="rounded-lg border border-white/10 bg-black/20 p-2">
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {data.headers.map((header) => (
            <TableHead key={header} className="whitespace-nowrap text-xs uppercase tracking-wider text-primary">
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.rows.map((row, idx) => (
          <TableRow key={`${row[0]}-${idx}`}>
            {data.headers.map((_, colIdx) => (
              <TableCell key={`${idx}-${colIdx}`} className="text-sm text-white/90">
                {row[colIdx] ?? "-"}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export function CsvDataTables() {
  const baggageData = useMemo(() => parseCsv(baggageCsv), []);
  const cateringData = useMemo(() => parseCsv(cateringCsv), []);
  const fuelData = useMemo(() => parseCsv(fuelCsv), []);

  return (
    <section className="py-16 px-4 md:px-6">
      <div className="container mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-display font-bold">CSV Table View</h2>
          <p className="text-muted-foreground">Browse baggage, catering, and fuel source data in one place.</p>
        </div>

        <Card className="glass-panel border-white/10 bg-black/40">
          <CardHeader>
            <CardTitle>Operations CSV Data Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="baggage" className="space-y-4">
              <TabsList className="bg-black/50 border border-white/10">
                <TabsTrigger value="baggage">Baggage CSV</TabsTrigger>
                <TabsTrigger value="catering">Catering CSV</TabsTrigger>
                <TabsTrigger value="fuel">Fuel CSV</TabsTrigger>
              </TabsList>

              <TabsContent value="baggage">
                <CsvTable data={baggageData} />
              </TabsContent>
              <TabsContent value="catering">
                <CsvTable data={cateringData} />
              </TabsContent>
              <TabsContent value="fuel">
                <CsvTable data={fuelData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
