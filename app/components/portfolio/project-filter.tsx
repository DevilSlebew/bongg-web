import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface ProjectFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const categories = [
  { value: "ALL", label: "All" },
  { value: "WEB", label: "Web" },
  { value: "ROBLOX", label: "Roblox" },
  { value: "IOT", label: "IoT" },
  { value: "DESIGN", label: "Design" },
];

export function ProjectFilter({ activeFilter, onFilterChange }: ProjectFilterProps) {
  return (
    <Tabs value={activeFilter} onValueChange={onFilterChange}>
      <TabsList className="grid w-full grid-cols-5">
        {categories.map((category) => (
          <TabsTrigger key={category.value} value={category.value}>
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
