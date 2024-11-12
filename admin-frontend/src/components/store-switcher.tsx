"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useParams, useRouter } from "next/navigation";
import { useBusinessModal } from "@/hooks/use-business-modal";

interface Store {
  _id: string;
  name: string;
}

interface StoreSwitcherProps {
  items: Store[];
}

export default function StoreSwitcher({ items }: StoreSwitcherProps) {
  const params = useParams();
  const router = useRouter();

  const businessModal = useBusinessModal();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item._id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );

  const [open, setOpen] = useState(false);

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          role="combobox"
          aria-expanded={open}
          aria-label="Select a Business"
          className={cn("w-[200px] justify-between")}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label || "Select a Business"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search business..." />
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading="Businesses">
              {formattedItems.map((business) => (
                <CommandItem
                  key={business.value}
                  onSelect={() => onStoreSelect(business)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {business.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === business.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  businessModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Business
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
