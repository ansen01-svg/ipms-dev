// components/UpdateDropdown.tsx or .jsx if using with TSX

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type UpdateDropdownProps = {
  selected: string;
  onSelect: (value: string) => void;
};

export default function UpdateDropdown({ selected, onSelect }: UpdateDropdownProps) {
  const options = ["Daily", "Weekly", "Monthly", "Annually", "All"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {selected ? `${selected} Updates` : "Overall Updates"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((freq) => (
          <DropdownMenuItem key={freq} onSelect={() => onSelect(freq)}>
            {freq}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
