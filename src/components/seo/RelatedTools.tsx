import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ToolConfig } from "@/config/tools";

interface RelatedToolsProps {
  tools: ToolConfig[];
}

export default function RelatedTools({ tools }: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section className="w-full">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-5">
        Related Tools
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.slug}
            className="group flex items-center justify-between gap-3
                       p-4 rounded-xl
                       bg-white dark:bg-slate-800/40
                       border border-slate-200 dark:border-slate-700/60
                       hover:border-indigo-300 dark:hover:border-indigo-700
                       hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10
                       transition-all duration-200"
          >
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200
                            group-hover:text-indigo-600 dark:group-hover:text-indigo-400
                            transition-colors">
                {tool.title}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                {tool.description.slice(0, 70)}…
              </p>
            </div>
            <ArrowRight className="w-4 h-4 flex-shrink-0 text-slate-300
                                   group-hover:text-indigo-500 group-hover:translate-x-0.5
                                   transition-all duration-200" />
          </Link>
        ))}
      </div>
    </section>
  );
}
