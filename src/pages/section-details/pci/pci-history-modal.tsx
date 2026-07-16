 import { useState } from "react";
import { ChevronRight, Activity, History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PCIHistoryResponse } from "@/types";
import {
  pciTextGradient,
  RATING_COLOR,
  formatShortDate,
  formatDate,
  RATING_BG_GRADIENT,
} from ".";

export default function PCIHistoryModal({
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
      <DialogContent className="font-jakarta !max-w-5xl h-[85vh] border-4 rounded-lg !p-0 overflow-hidden border-slate-100 shadow-2xl bg-white flex flex-col md:flex-row">
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

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-[12px] [scrollbar-width:none] [-ms-overflow-style:none] custom-scrollbar">
            {history?.map((h) => {
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
        <div className="flex-1 overflow-y-auto py-6 px-2 [scrollbar-width:none] [-ms-overflow-style:none]  custom-scrollbar bg-white relative h-2/3 md:h-full">
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
              className={`rounded-xl border p-6 flex flex-col md:flex-row items-center gap-8 md:gap-12 shadow-sm ${
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

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full text-[14px]">
                <div className="bg-white/60 rounded-2xl p-4 shadow-sm border border-white/40">
                  <p className="text-slate-500 mb-1">Rating</p>
                  <p
                    className={` font-bold ${RATING_COLOR[activeRecord.condition_rating]}`}
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
                <div className="ring-1 ring-slate-200 rounded-xl overflow-hidden shadow-sm">
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
                          <td className="px-4 py-3 capitalize font-medium text-slate-700">
                            {obs.distress_type.split("_").join(" ")}
                          </td>
                          <td className="px-4 py-3 capitalize text-slate-600">
                            {obs.severity}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {obs.count}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {(obs.density ).toFixed(2)}
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
                <div className="ring-1 ring-slate-200 rounded-xl overflow-hidden shadow-sm">
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
