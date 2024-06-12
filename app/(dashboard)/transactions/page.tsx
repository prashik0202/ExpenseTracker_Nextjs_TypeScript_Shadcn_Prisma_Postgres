"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";
import TransactionTable from "./_components/TransactionTable";

const TransactionPage = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="bg-card">
        <div className="container flex flex-wrap gap-6  items-center justify-between p-10">
          <h1 className="text-xl">Transaction History</h1>

          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(value) => {
              const { from, to } = value.range;
              // we update the date range only if both dates are set
              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `the selected date range is too big.Max allow range is ${MAX_DATE_RANGE_DAYS} days!`
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
        </div>
        <div className="container">
          <TransactionTable from={dateRange.from} to={dateRange.to} />
        </div>
      </div>
    </>
  );
};

export default TransactionPage;
