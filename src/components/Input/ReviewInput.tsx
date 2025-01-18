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
import ColumnMappingForm from "@/components/Input/ColumnMapping";
import { useReviewData } from "@/zustand/state";
import Link from "next/link";
import Papa from "papaparse";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { supabaseClient } from "@/lib/supabase";

type ColumnMapping = {
  originalName: string;
  mappedType: string;
};

export default function ReviewInput() {
  const [csvData, setCSVData] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [showMapping, setShowMapping] = useState(false);
  const [jsonData, setJsonData] = useState<string | null>(null);
  const [formattedJSON, setFormattedJSON] = useState<any>(null);
  const [proceed, setProceed] = useState(false);
  const { getToken, userId } = useAuth();

  // const { reviewData, updateReviewData } = useReviewData((state: any) => state);

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
      setShowMapping(true);
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setImporting(false);
    }
  };

  const convertToJson = (mappings: ColumnMapping[]) => {
    if (!csvData) return;

    Papa.parse(csvData, {
      header: true, // Automatically parse the first row as headers
      skipEmptyLines: true,
      complete: (result: any) => {
        const parsedData = result.data as Record<string, string>[];
        const jsonArray = parsedData.map((row) => {
          const entry: Record<string, string> = {};
          Object.entries(row).forEach(([header, value]) => {
            const mapping = mappings.find((m) => m.originalName === header);
            if (mapping) {
              entry[mapping.mappedType] = value;
            } else {
              entry[header] = value;
            }
          });
          return entry;
        });
        setJsonData(JSON.stringify(jsonArray, null, 2));
      },
      error: (error: any) => {
        console.error("CSV Parsing Error:", error);
      },
    });
  };

  function flatMapByProductID(dataString: string) {
    try {
      const arr: Array<{
        product_id: string;
        [key: string]: any;
      }> = JSON.parse(dataString);

      if (!Array.isArray(arr)) {
        throw new Error("Input is not a valid array.");
      }

      const result = arr.reduce((acc, curr) => {
        const { product_id, ...rest } = curr;

        if (!acc[product_id]) {
          acc[product_id] = [];
        }
        acc[product_id].push(rest);
        return acc;
      }, {} as Record<string, Array<Record<string, any>>>);
      return Object.entries(result).map(([product_id, objects]) => ({
        product_id,
        objects,
      }));
    } catch (error) {
      console.error("Error parsing or processing the input:", error);
      return [];
    }
  }

  async function addToLib() {
    if (jsonData) {
      const formattedData = flatMapByProductID(jsonData);
      localStorage.setItem("reviews", JSON.stringify(formattedData))
      setProceed(true);
      const token = await getToken({ template: "supabase" });
      const supabase = await supabaseClient(token!);

      let parsedJSONData = JSON.parse(jsonData);

     parsedJSONData.forEach(async (entry: any) => {
      entry.user_id = userId
     })

      const { data, error } = await supabase
          .from("reviews")
          .insert(parsedJSONData)
          .select();
      
        if (data) {
          console.log(data);
          // return NextResponse.json(
          //   { message: "Reviews added successfully" },
          //   { status: 200 }
          // );
        } else {
          console.log(error);
          // return NextResponse.json(
          //   { message: "Reviews added failed" },
          //   { status: 500 }
          // );
        }

      // const resp = await axios.post(`/api/add-reviews?userId=${userId}`, formattedData, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //   })
      //   .then((res) => {
      //     console.log(res.status);
      //     if (res.status === 200) {
      //       console.log(res.data.message);
      //       // toast({ title: res.data.message, variant: "success" });
      //     } else {
      //       // toast({ title: "Something went wrong", variant: "destructive" });
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     // toast({
      //     //   title: "Something went wrong",
      //     //   description: err.response.data.error,
      //     //   variant: "destructive",
      //     // });
      //   });

        // console.log(resp)
    }
  }

  useEffect(() => {
    addToLib()
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
              value={csvData || ""}
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
          className={`${proceed ? "hidden" : "block"} w-full`}
        >
          {importing ? "Importing..." : "Import CSV Data"}
        </Button>

        <Link
          onClick={handleImport}
          href={"/reviews"}
          className={`${proceed ? "block" : "hidden"} w-full`}
        >
          See Analysis
        </Link>
      </CardFooter>
    </Card>
  );
}
