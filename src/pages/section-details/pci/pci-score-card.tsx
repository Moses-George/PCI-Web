/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Calculator, Clock, TrendingDown, TrendingUp } from "lucide-react";
import {
  useGetSectionPCIHistoryQuery,
  useLazyCalcSectionPCIQuery,
} from "@/store/api/sectionsApi";
import type { PCIHistoryResponse, Section } from "@/types";
import Spinner from "@/components/common/spinner";
import { toast } from "react-toastify";
import { normalizeError } from "@/utils/helpers";
import { pciTextGradient, RATING_BADGE, formatDate } from ".";
import PCIHistoryModal from "./pci-history-modal";

interface IPCIScoreCardProps {
  sectionId: string | undefined;
  refetchSection: any;
  section: Section;
}

function PCIScoreCard({
  sectionId,
  refetchSection,
  section,
}: IPCIScoreCardProps) {
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
  console.log("latest", latest)

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-8 flex flex-col gap-6 font-jakarta transition-all">
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
                  className="mt-3 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors underline-offset-4 hover:underline cursor-pointer"
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
              rounded-2xl font-semibold text-white shadow-md transition-all duration-300 transform active:scale-75 transition-transform cursor-pointer
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
