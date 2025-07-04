import { useEffect, useState, useRef } from "react";
import { getMonthlyReport } from "../api/testAPI";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MONTHS = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

function MonthlyReport() {
  const [report, setReport] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return String(now.getMonth() + 1).padStart(2, "0");
  });

  const reportRef = useRef(null);

  useEffect(() => {
    fetchReport(selectedMonth);
  }, [selectedMonth]);

  const fetchReport = async (month) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("⚠️ No access token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const data = await getMonthlyReport(token, month); // <-- pass month
      console.log("📊 Monthly report data:", data);

      const reportData = Object.entries(data)
        .filter(([key]) => key !== "total")
        .map(([key, value]) => ({
          category: key,
          total: value,
        }));

      setReport(reportData);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch report:", err.message);
      setError("⚠️ Failed to load report. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("Monthly_Report.pdf");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-base font-bold text-gray-800">📅 Monthly Report</h2>
        <div className="flex gap-2 items-center">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <button
            onClick={downloadPDF}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div ref={reportRef}>
        {loading ? (
          <p className="text-sm text-gray-500">Loading report...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : report.length === 0 ? (
          <p className="text-sm text-gray-500">No report data found.</p>
        ) : (
          <>
            <ul className="mb-4 space-y-2">
              {report.map((item, index) => (
                <li
                  key={index}
                  className="border px-4 py-2 rounded flex justify-between bg-gray-50"
                >
                  <span className="font-medium">{item.category}</span>
                  <span className="text-indigo-600 font-semibold">
                    ₹{item.total}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t pt-3 text-right font-bold text-lg">
              Total: ₹{total}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MonthlyReport;
