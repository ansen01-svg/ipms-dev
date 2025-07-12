import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InfoCard() {
  return (
    <Card className="mb-8 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-900">How This Works:</CardTitle>
      </CardHeader>
      <CardContent className="text-blue-800 space-y-2">
        <p>1. ✅ Page loads with basic HTML structure</p>
        <p>2. ⏳ JavaScript runs and fetches data from API</p>
        <p>3. 🎯 Browser renders the products after data arrives</p>
        <p>4. 🖱️ All interactions happen instantly in your browser</p>
      </CardContent>
    </Card>
  );
}
