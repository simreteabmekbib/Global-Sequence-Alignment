"use client";
import { useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { CardContent } from "./components/ui/card-content";

export default function Home() {
  const [seq1, setSeq1] = useState("");
  const [seq2, setSeq2] = useState("");
  const [alignedSeq1, setAlignedSeq1] = useState("");
  const [alignedSeq2, setAlignedSeq2] = useState("");
  const [error, setError] = useState("");

  const handleAlign = async () => {
    setError("");
    setAlignedSeq1("");
    setAlignedSeq2("");

    if (!seq1 || !seq2) {
      setError("Please enter both sequences.");
      return;
    }

    try {
      const response = await fetch("https://global-sequence-alignment.vercel.app/align", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seq1, seq2 }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAlignedSeq1(data.aligned_seq1); 
        setAlignedSeq2(data.aligned_seq2);
      }
    } catch (err) {
      console.log(err)
      setError("Server error. Make sure Flask API is running.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent>
          <h2 className="text-xl font-bold text-center mb-4 text-black">Global Sequence Alignment</h2>
          <Input
            placeholder="Enter first sequence"
            value={seq1}
            onChange={(e) => setSeq1(e.target.value)}
          />
          <Input
            placeholder="Enter second sequence"
            value={seq2}
            onChange={(e) => setSeq2(e.target.value)}
            className="mt-2"
          />
          <Button onClick={handleAlign} className="mt-4 w-full">
            Align Sequences
          </Button>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          {alignedSeq1 && alignedSeq2 && (
            <div className="mt-4 p-2 border rounded bg-gray-50">
              <pre className="text-sm text-center text-black">{alignedSeq1}</pre>
              <pre className="text-sm text-center text-black">{alignedSeq2}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}