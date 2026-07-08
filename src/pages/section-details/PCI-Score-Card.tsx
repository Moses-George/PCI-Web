/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Calculator,
  Clock,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Activity,
  History,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetSectionPCIHistoryQuery,
  useLazyCalcSectionPCIQuery,
} from "@/store/api/sectionsApi";
import type { PCIHistoryResponse, Section } from "@/types";
import Spinner from "@/components/common/spinner";
import { toast } from "react-toastify";
import { normalizeError } from "@/utils/helpers";

// ── Helpers & Theme ───────────────────────────────────────────────────────────

const RATING_COLOR: Record<string, string> = {
  Good: "text-emerald-600",
  Satisfactory: "text-sky-600",
  Fair: "text-amber-500",
  Poor: "text-orange-500",
  "Very Poor": "text-rose-500",
  Serious: "text-rose-700",
  Failed: "text-red-900",
};

const RATING_BG_GRADIENT: Record<string, string> = {
  Good: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100",
  Satisfactory: "bg-gradient-to-br from-sky-50 to-sky-100/50 border-sky-100",
  Fair: "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100",
  Poor: "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-100",
  "Very Poor": "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-100",
  Serious: "bg-gradient-to-br from-rose-100 to-rose-200/50 border-rose-200",
  Failed: "bg-gradient-to-br from-red-100 to-red-200/50 border-red-200",
};

const RATING_BADGE: Record<string, string> = {
  Good: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  Satisfactory: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
  Fair: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  Poor: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20",
  "Very Poor": "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
  Serious: "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-600/30",
  Failed: "bg-red-100 text-red-900 ring-1 ring-inset ring-red-600/30",
};

function pciTextGradient(pci: number) {
  if (pci >= 85) return "bg-gradient-to-br from-emerald-500 to-emerald-700";
  if (pci >= 70) return "bg-gradient-to-br from-sky-500 to-sky-700";
  if (pci >= 55) return "bg-gradient-to-br from-amber-400 to-amber-600";
  if (pci >= 40) return "bg-gradient-to-br from-orange-500 to-orange-700";
  return "bg-gradient-to-br from-rose-500 to-rose-700";
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

// ── Unified History & Detail Modal ────────────────────────────────────────────

function PCIHistoryModal({
  history,
  initialRecord,
  onClose,
}: {
  history: PCIHistoryResponse[];
  initialRecord: PCIHistoryResponse;
  onClose: () => void;
}) {
  const [activeRecord, setActiveRecord] =
    useState<PCIHistoryResponse>(initialRecord);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="font-jakarta !max-w-5xl h-[85vh] border-4 rounded-sm !p-0 overflow-hidden rounded-3xl border-slate-100 shadow-2xl bg-white flex flex-col md:flex-row">
        {/* Sidebar: History List */}
        <div className="w-full md:w-80 lg:w-[340px] bg-slate-50 border-r border-slate-100 flex flex-col shrink-0 h-1/3 md:h-full">
          <div className="p-5 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center gap-2">
            <History className="text-slate-400" size={20} />
            <div>
              <h2 className="font-bold text-slate-800 tracking-tight">
                History
              </h2>
              <p className="text-xs font-medium text-slate-500">
                {history.length} calculations
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-[12px] custom-scrollbar">
            {history.map((h) => {
              const isActive = activeRecord.id === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => setActiveRecord(h)}
                  className={`w-full group flex items-center justify-between p-3.5 rounded-2xl text-left transition-all ${
                    isActive
                      ? "bg-white ring-2 ring-emerald-500 shadow-sm"
                      : "bg-white/50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-lg shadow-sm ${pciTextGradient(
                        h.final_pci,
                      )} text-transparent bg-clip-text ring-1 ring-inset ${
                        isActive ? "ring-emerald-100" : "ring-slate-900/5"
                      }`}
                    >
                      {h.final_pci.toFixed(0)}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`text-[13px] font-bold ${RATING_COLOR[h.condition_rating]}`}
                      >
                        {h.condition_rating}
                      </span>
                      <span className="text-[12px] font-medium text-slate-400 mt-0.5">
                        {formatShortDate(h.created_at)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? "text-emerald-500 bg-emerald-50"
                        : "text-slate-300 group-hover:text-slate-600 group-hover:bg-slate-50"
                    }`}
                  >
                    <ChevronRight size={18} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content: Calculation Detail */}
        <div className="flex-1 overflow-y-auto py-6 px-2  custom-scrollbar bg-white relative h-2/3 md:h-full">
          <DialogHeader className="mb-6 mr-8">
            <DialogTitle className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <span className="text-xl font-medium tracking-tight text-slate-800">
                Calculation Detail
              </span>
              <span className="text-[12px] font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
                {formatDate(activeRecord.created_at)}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* Score Summary Card */}
            <div
              className={`rounded-3xl border p-6 flex flex-col md:flex-row items-center gap-8 md:gap-12 shadow-sm ${
                RATING_BG_GRADIENT[activeRecord.condition_rating] ??
                "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="text-center md:text-left flex flex-col items-center md:items-start shrink-0">
                <p className="text-[13px] font-semibold tracking-wider text-slate-500 uppercase mb-1">
                  Final PCI Score
                </p>
                <p
                  className={`text-5xl font-extrabold text-transparent bg-clip-text ${pciTextGradient(
                    activeRecord.final_pci,
                  )}`}
                >
                  {activeRecord.final_pci.toFixed(1)}
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full text-[12px]">
                <div className="bg-white/60 rounded-2xl p-4 shadow-sm border border-white/40">
                  <p className="text-slate-500 mb-1">Condition Rating</p>
                  <p
                    className={`text-lg font-bold ${RATING_COLOR[activeRecord.condition_rating]}`}
                  >
                    {activeRecord.condition_rating}
                  </p>
                </div>
                <div className="bg-white/60 rounded-2xl p-4 shadow-sm border border-white/40">
                  <p className="text-slate-500 mb-1">Max CDV</p>
                  <p className="text-lg font-bold text-slate-800">
                    {activeRecord.max_cdv.toFixed(1)}
                  </p>
                </div>
                <div className="bg-white/60 rounded-2xl p-4 shadow-sm border border-white/40">
                  <p className="text-slate-500 mb-1">TDV (start)</p>
                  <p className="text-lg font-bold text-slate-800">
                    {activeRecord.tdv_start.toFixed(1)}
                  </p>
                </div>
                <div className="bg-white/60 rounded-2xl p-4 shadow-sm border border-white/40">
                  <p className="text-slate-500 mb-1">Total DVs</p>
                  <p className="text-lg font-bold text-slate-800">
                    {activeRecord.deduct_values.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Observations Table */}
            {activeRecord.observations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="text-slate-400" size={18} />
                  <h3 className="text-base font-bold text-[15px] text-slate-800">
                    Distress Observations
                  </h3>
                </div>
                <div className="ring-1 ring-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="min-w-full text-[13px] border-collapse bg-white">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                      <tr>
                        {[
                          "Distress Type",
                          "Severity",
                          "Count",
                          "Density (%)",
                          "Deduct Value",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left font-semibold text-slate-600"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeRecord.observations.map((obs, i) => (
                        <tr
                          key={i}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {obs.distress_type}
                          </td>
                          <td className="px-4 py-3 capitalize text-slate-600">
                            {obs.severity}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {obs.count}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {(obs.density * 100).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800">
                            {obs.deduct_value.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CDV Iterations */}
            {activeRecord.all_cdvs.length > 0 && (
              <div>
                <h3 className="text-base text-[15px] font-bold text-slate-800 mb-3">
                  CDV Iteration Worksheet
                </h3>
                <div className="ring-1 ring-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="min-w-full text-[13px] border-collapse bg-white">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                      <tr>
                        {["Iteration", "TDV", "CDV", "DVs Replaced"].map(
                          (h) => (
                            <th
                              key={h}
                              className="px-4 py-3 text-center font-semibold text-slate-600"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeRecord.all_cdvs.map((cdv, i) => {
                        const isMax =
                          cdv === Math.max(...activeRecord.all_cdvs);
                        return (
                          <tr
                            key={i}
                            className={`transition-colors ${
                              isMax ? "bg-amber-50/60" : "hover:bg-slate-50/50"
                            }`}
                          >
                            <td className="px-4 py-3 text-center text-slate-600">
                              {i + 1}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-600">
                              {activeRecord.all_tdvs[i]?.toFixed(1) ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={
                                  isMax
                                    ? "font-bold text-amber-700"
                                    : "text-slate-700"
                                }
                              >
                                {cdv.toFixed(1)}
                              </span>
                              {isMax && (
                                <span
                                  className="ml-1.5 inline-block text-amber-500"
                                  title="Max CDV"
                                >
                                  ★
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-500">
                              {i}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs font-medium text-slate-400 mt-3 flex items-center gap-1.5">
                  <span className="text-amber-500">★</span> Max CDV used for
                  final calculation
                </p>
              </div>
            )}

            {/* Deduct values tags */}
            {activeRecord.deduct_values.length > 0 && (
              <div className="pt-2">
                <p className="text-sm font-bold text-slate-800 mb-3">
                  Applied Deduct Values
                </p>
                <div className="flex flex-wrap gap-2">
                  {[...activeRecord.deduct_values]
                    .sort((a, b) => b - a)
                    .map((dv, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200/60"
                      >
                        {dv.toFixed(1)}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  sectionId: string | undefined;
  refetchSection: any;
  section: Section;
}

export function PCIScoreCard({ sectionId, refetchSection, section }: Props) {
  const [modalInitialRecord, setModalInitialRecord] =
    useState<PCIHistoryResponse | null>(null);

  const {
    data: history,
    isLoading,
    refetch,
  } = useGetSectionPCIHistoryQuery(sectionId!);
  const [triggerPCI, { data: pciResult, isLoading: isCalculating }] =
    useLazyCalcSectionPCIQuery();
  console.log("pciResult", pciResult);

  const latest = pciResult ?? history?.[0];

  const trend =
    history && history.length >= 2
      ? history[0].final_pci - history[1].final_pci
      : null;

  const handleCalculatePCI = async () => {
    try {
      await triggerPCI(sectionId!).unwrap();
      toast.success("PCI calculated successfully");
      await refetchSection();
      await refetch();
    } catch (err) {
      const normalized = normalizeError(err);
      toast.error(normalized.message);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-4 flex flex-col gap-6 font-jakarta transition-all">
        {/* Header / Score Display */}
        <div className="flex flex-col items-center justify-center py-4">
          {isLoading ? (
            <div className="py-8">
              <Spinner size={36} />
            </div>
          ) : latest ? (
            <div className="text-center flex flex-col items-center">
              <span className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Current PCI
              </span>
              <p
                className={`text-5xl font-black tracking-tight text-transparent bg-clip-text pb-2 ${pciTextGradient(
                  latest.final_pci,
                )}`}
              >
                {latest.final_pci.toFixed(1)}
              </p>

              <span
                className={`mt-2 px-4 py-1 rounded-full text-sm font-bold ${
                  RATING_BADGE[latest.condition_rating]
                }`}
              >
                {latest.condition_rating}
              </span>

              {/* Trend Indicator */}
              {trend !== null && (
                <div
                  className={`flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    trend >= 0
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {trend >= 0 ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  <span>
                    {trend >= 0 ? "+" : ""}
                    {trend.toFixed(1)} vs previous
                  </span>
                </div>
              )}

              <p className="text-xs font-medium text-slate-400 mt-5">
                Last calculated: {formatDate(latest.created_at)}
              </p>

              {history && history.length > 0 && (
                <button
                  onClick={() => setModalInitialRecord(latest)}
                  className="mt-3 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors underline-offset-4 hover:underline"
                >
                  View full breakdown
                </button>
              )}
            </div>
          ) : (
            <div className="text-slate-400 text-center py-6 flex flex-col items-center">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Calculator size={40} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">
                No PCI score available.
              </p>
              <p className="text-sm mt-1">
                Run a calculation to view the rating.
              </p>
            </div>
          )}
        </div>

        {/* Calculate Action */}
        <div className="flex justify-center w-full">
          <button
            onClick={handleCalculatePCI}
            disabled={isCalculating || section.is_calculated}
            className={`
              relative overflow-hidden group flex items-center justify-center gap-2.5 w-full sm:w-auto min-w-[200px] px-6 py-3.5 
              rounded-2xl font-semibold text-white shadow-lg transition-all duration-300
              ${
                section.is_calculated || isCalculating
                  ? "bg-slate-300 shadow-none cursor-not-allowed text-slate-500"
                  : "bg-gradient-to-tr from-emerald-600 to-emerald-400 hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0"
              }
            `}
          >
            <Calculator
              size={18}
              className={isCalculating ? "animate-pulse" : ""}
            />
            <span>{isCalculating ? "Calculating..." : "Calculate PCI"}</span>
          </button>
        </div>

        {/* History Expandable Section */}
        {history && history.length > 1 && (
          <div className="mt-2 border-t border-slate-100 pt-4">
            <button
              onClick={() => setModalInitialRecord(history[0])}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors py-2 rounded-xl hover:bg-slate-50"
            >
              <Clock size={16} />
              Open History Log
              <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs">
                {history.length}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Unified History & Detail modal */}
      {modalInitialRecord && history && (
        <PCIHistoryModal
          history={history}
          initialRecord={modalInitialRecord}
          onClose={() => setModalInitialRecord(null)}
        />
      )}
    </>
  );
}

export default PCIScoreCard;
