"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCurrencies from "@/hooks/useCurrency";

interface CurrencySelectProps {
  value?: string;
  onChange: (value: string) => void;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({ value, onChange }) => {
  const { getAll } = useCurrencies();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Currency" />
      </SelectTrigger>
      <SelectContent>
        {getAll().map((currency) => (
          <SelectItem key={currency.value} value={currency.value}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{currency.flag}</span>
              <span>
                {currency.label} ({currency.symbol})
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelect;
