import { useState } from "react";
import { api } from "@/services/api";
import type { User } from "@/types";
import { Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchUsersProps {
  onClose?: () => void;
}

const SearchUsers = ({ onClose }: SearchUsersProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    api.searchUsers(value).then(setResults).catch(() => setResults([])).finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-secondary px-3 py-2">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          {query && (
            <button onClick={() => handleSearch("")} className="text-muted-foreground">
              <X size={14} />
            </button>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-sm font-medium text-foreground">
            Cancel
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {loading ? (
          <div className="space-y-3 py-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-3.5 w-28 rounded" />
              </div>
            ))}
          </div>
        ) : searched && results.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No users found.</p>
        ) : (
          <div className="space-y-1 py-2">
            {results.map((user) => (
              <div key={user.id} className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-secondary">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                      {user.username[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{user.username}</p>
                  {user.firstName && (
                    <p className="text-xs text-muted-foreground">{user.firstName} {user.lastName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUsers;
