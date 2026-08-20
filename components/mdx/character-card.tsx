"use client";

import { cn } from "@/lib/utils";

export interface CharacterCardProps {
  name: string;
  greekName?: string;
  role?: string;
  aliases?: string[];
  imageUrl?: string;
  description?: string;
  family?: string[];
}

export function CharacterCard({
  name,
  greekName,
  role,
  aliases = [],
  imageUrl,
  description,
  family = [],
}: CharacterCardProps) {
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-4 p-5 border rounded-lg bg-card text-card-foreground shadow-sm"
      )}
    >
      <div
        className={cn(
          "relative flex-shrink-0 w-full sm:w-36 aspect-square rounded-lg overflow-hidden",
          !imageUrl &&
            "bg-gradient-to-br from-amber-200 via-amber-300 to-rose-300"
        )}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.6) 0%, transparent 35%)`,
                backgroundSize: "100% 100%",
              }}
            />
            <span className="font-serif text-6xl sm:text-5xl font-bold text-white/90 drop-shadow-md select-none">
              {firstLetter}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <h3 className="font-serif text-xl font-bold leading-tight">
              {name}
            </h3>
            {role && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border shrink-0">
                {role}
              </span>
            )}
          </div>
          {greekName && (
            <p className="text-sm text-muted-foreground italic font-serif">
              {greekName}
            </p>
          )}
        </div>

        {aliases.length > 0 && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">Also known as: </span>
            {aliases.join(", ")}
          </p>
        )}

        {family.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-medium text-foreground/80">
              Family:
            </span>
            {family.map((member, index) => (
              <span
                key={`${member}-${index}`}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-cream-50 text-cream-900 border border-cream-200"
              >
                {member}
              </span>
            ))}
          </div>
        )}

        {description && (
          <p className="text-sm leading-relaxed text-foreground/80 mt-auto">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default CharacterCard;
