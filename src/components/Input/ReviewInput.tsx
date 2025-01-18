"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
// import { importCSV } from '../actions/import-csv'
import ColumnMappingForm from "@/components/Input/ColumnMapping";

type ColumnMapping = {
  originalName: string;
  mappedType: string;
};

export default function ReviewInput() {
  const [csvData, setCSVData] = useState("");
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [showMapping, setShowMapping] = useState(false);
  const [jsonData, setJsonData] = useState<string | null>(null);
  const [formattedJSON, setFormattedJSON] = useState<any>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          setCSVData(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      // await importCSV(csvData)
      setShowMapping(true);
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setImporting(false);
    }
  };

  const convertToJson = (mappings: ColumnMapping[]) => {
    const lines = csvData.trim().split("\n");
    const headers = lines[0].split(",");
    const jsonArray = lines.slice(1).map((line) => {
      const values = line.split(",");
      const entry: Record<string, string> = {};
      headers.forEach((header, index) => {
        const mapping = mappings.find((m) => m.originalName === header);
        if (mapping) {
          entry[mapping.mappedType] = values[index];
        } else {
          entry[header] = values[index];
        }
      });
      return entry;
    });
    setJsonData(JSON.stringify(jsonArray, null, 2));
  };

  useEffect(() => {
    const flatMapByProductID = (arr: any) => {
      console.log(arr)
      const result = arr.reduce((acc, curr) => {
        const { product_ID, ...rest } = curr;
        if (!acc[product_ID]) {
          acc[product_ID] = [];
        }
        acc[product_ID].push(rest);
        return acc;
      }, {});

      return Object.entries(result).map(([product_ID, objects]) => ({
        product_ID,
        objects,
      }));
    };
    if (jsonData) {
      const formattedData = flatMapByProductID(jsonData);
      console.log(formattedData);

      setFormattedJSON(formattedData);
    }
  }, [jsonData]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Import CSV Data</CardTitle>
        <CardDescription>
          Upload a CSV file or paste your CSV data to start analyzing customer
          sentiment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste Data</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <Label
                htmlFor="csv-upload"
                className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Choose CSV File
              </Label>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              {fileName && (
                <p className="mt-2 text-sm text-gray-600">{fileName}</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="paste">
            <Textarea
              placeholder="Paste your CSV data here..."
              value={csvData}
              onChange={(e) => setCSVData(e.target.value)}
              rows={10}
              className="w-full"
            />
          </TabsContent>
        </Tabs>
        {showMapping && (
          <div className="mt-6">
            <ColumnMappingForm onMappingComplete={convertToJson} />
          </div>
        )}
        {jsonData && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Converted JSON Data</h3>
            <Textarea
              value={jsonData}
              readOnly
              rows={10}
              className="w-full font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleImport}
          disabled={!csvData || importing || showMapping}
          className="w-full"
        >
          {importing ? "Importing..." : "Import CSV Data"}
        </Button>
      </CardFooter>
    </Card>
  );
}
