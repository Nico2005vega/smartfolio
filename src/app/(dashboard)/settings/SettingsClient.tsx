"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, MapPin, Building2, X, Check, ChevronDown, Loader2 } from "lucide-react";
import {
  type Institution,
  type InstitutionType,
  INSTITUTION_TYPE_LABELS,
  searchInstitutions,
} from "@/data/colombia-institutions";
import { DEPARTMENTS, getCities } from "@/data/colombia-cities";

const TYPE_COLORS: Record<InstitutionType, string> = {
  universidad:               "bg-blue-100 text-blue-700",
  institucion_universitaria: "bg-sky-100 text-sky-700",
  institucion_tecnologica:   "bg-green-100 text-green-700",
  institucion_tecnica:       "bg-amber-100 text-amber-700",
  escuela_tecnologica:       "bg-teal-100 text-teal-700",
  sena:                      "bg-orange-100 text-orange-700",
  colegio:                   "bg-gray-100 text-gray-600",
};

interface SearchResult {
  id?:        string;
  name:       string;
  shortName?: string;
  city:       string;
  department: string;
  type:       InstitutionType;
  sector?:    string;
  areas?:     string[];
}

interface Props {
  value:     string;
  onChange:  (value: string, institution?: Institution) => void;
  error?:    string;
  disabled?: boolean;
}

function useDebounce<T>(value: T, ms: number): T {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return d;
}

export function InstitutionSearch({ value, onChange, error, disabled = false }: Props) {
  const [query,        setQuery]      = useState(value ?? "");
  const [isOpen,       setIsOpen]     = useState(false);
  const [selectedDept, setDept]       = useState("");
  const [selectedCity, setCity]       = useState("");
  const [selectedType, setType]       = useState<InstitutionType | "">("");
  const [focusedIdx,   setFocusedIdx] = useState(-1);
  const [apiSchools,   setApiSchools] = useState<SearchResult[]>([]);
  const [loadingSchools, setLoading]  = useState(false);

  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef      = useRef<HTMLUListElement>(null);
  const debouncedQ   = useDebounce(query, 400);

  // Ciudades del departamento seleccionado — datos estáticos, instantáneo
  const cities = useMemo(() => selectedDept ? getCities(selectedDept) : [], [selectedDept]);

  // Sincronizar con valor externo
  useEffect(() => { setQuery(value ?? ""); }, [value]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false); setFocusedIdx(-1);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Scroll al ítem enfocado
  useEffect(() => {
    if (focusedIdx >= 0 && listRef.current) {
      (listRef.current.children[focusedIdx] as HTMLElement)?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIdx]);

  // Buscar colegios en el MEN cuando hay ciudad o texto ≥ 3 letras
  const fetchSchools = useCallback(async (dept: string, city: string, q: string) => {
    if (!city && q.length < 3) { setApiSchools([]); return; }
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (dept) p.set("dept", dept);
      if (city) p.set("city", city);
      if (q)    p.set("q",    q);
      const r    = await fetch(`/api/colombia/schools?${p}`);
      const data = await r.json();
      setApiSchools((data.schools ?? []).map((s: SearchResult, i: number) => ({
        ...s, id: `api-${i}`,
      })));
    } catch {
      setApiSchools([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools(selectedDept, selectedCity, debouncedQ);
  }, [selectedDept, selectedCity, debouncedQ, fetchSchools]);

  // Resultados combinados: universidades/SENA estáticos + colegios del MEN
  const results = useMemo<SearchResult[]>(() => {
    const statics = searchInstitutions(query, {
      department: selectedDept || undefined,
      city:       selectedCity || undefined,
      type:       selectedType || undefined,
    }, 25).filter((i) => apiSchools.length === 0 || i.type !== "colegio") as SearchResult[];

    const schools = (!selectedType || selectedType === "colegio") ? apiSchools : [];
    return [...statics, ...schools].slice(0, 50);
  }, [query, selectedDept, selectedCity, selectedType, apiSchools]);

  const handleSelect = (item: SearchResult) => {
    setQuery(item.name);
    onChange(item.name, item as unknown as Institution);
    setIsOpen(false); setFocusedIdx(-1);
  };

  const handleClear = () => {
    setQuery(""); onChange("", undefined);
    setDept(""); setCity(""); setType("");
    setApiSchools([]); setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) { if (e.key === "ArrowDown") setIsOpen(true); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIdx((p) => Math.min(p + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setFocusedIdx((p) => Math.max(p - 1, -1)); }
    if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIdx >= 0 && results[focusedIdx]) handleSelect(results[focusedIdx]);
      else if (query.trim()) { onChange(query.trim()); setIsOpen(false); }
    }
    if (e.key === "Escape") { setIsOpen(false); setFocusedIdx(-1); }
  };

  const isExactMatch = results.some((r) => r.name.toLowerCase() === query.toLowerCase());
  const showManual   = query.trim().length > 0 && !isExactMatch && isOpen;

  return (
    <div ref={containerRef} className="relative w-full">

      {/* Input */}
      <div className={[
        "flex items-center gap-2 px-4 py-3 border rounded-xl bg-white transition-all",
        isOpen && !disabled ? "border-green-500 ring-2 ring-green-100" : "",
        error              ? "border-red-400 ring-2 ring-red-100"    : "",
        !isOpen && !error  ? "border-gray-300 hover:border-gray-400" : "",
        disabled           ? "opacity-60 cursor-not-allowed bg-gray-50" : "",
      ].join(" ")}>
        {loadingSchools
          ? <Loader2 size={16} className="text-green-500 flex-shrink-0 animate-spin" />
          : <Search  size={16} className="text-gray-400 flex-shrink-0" />
        }
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          value={query}
          disabled={disabled}
          placeholder="Buscar universidad, colegio o institución..."
          onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setIsOpen(true); setFocusedIdx(-1); }}
          onFocus={() => !disabled && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent disabled:cursor-not-allowed"
        />
        {query && !disabled && (
          <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-b border-gray-100">

            {/* Departamento */}
            <div className="relative flex-1 min-w-[140px]">
              <select
                value={selectedDept}
                onChange={(e) => { setDept(e.target.value); setCity(""); }}
                className="w-full appearance-none text-xs px-2.5 py-2 pr-7 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer"
              >
                <option value="">Todos los departamentos</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Ciudad — datos estáticos, sin carga */}
            <div className="relative flex-1 min-w-[130px]">
              <select
                value={selectedCity}
                onChange={(e) => setCity(e.target.value)}
                disabled={!selectedDept}
                className="w-full appearance-none text-xs px-2.5 py-2 pr-7 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer disabled:opacity-50"
              >
                <option value="">
                  {selectedDept ? `${cities.length} ciudades` : "Selecciona departamento"}
                </option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Tipo */}
            <div className="relative flex-1 min-w-[150px]">
              <select
                value={selectedType}
                onChange={(e) => setType(e.target.value as InstitutionType | "")}
                className="w-full appearance-none text-xs px-2.5 py-2 pr-7 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer"
              >
                <option value="">Todos los tipos</option>
                {(Object.entries(INSTITUTION_TYPE_LABELS) as [InstitutionType, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Aviso cuando hay ciudad seleccionada */}
          {selectedCity && !loadingSchools && (
            <div className="px-4 py-2 bg-green-50 border-b border-green-100 flex items-center justify-between">
              <p className="text-xs text-green-700">
                {apiSchools.length > 0
                  ? `${apiSchools.length} colegio${apiSchools.length !== 1 ? "s" : ""} encontrado${apiSchools.length !== 1 ? "s" : ""} en ${selectedCity} (MEN)`
                  : `Buscando colegios en ${selectedCity}...`
                }
              </p>
              {loadingSchools && <Loader2 size={11} className="animate-spin text-green-500" />}
            </div>
          )}

          {/* Lista */}
          <ul ref={listRef} className="max-h-64 overflow-y-auto divide-y divide-gray-50">
            {loadingSchools && results.length === 0 ? (
              <li className="px-4 py-6 text-center">
                <Loader2 size={20} className="animate-spin text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Buscando en el registro del MEN...</p>
              </li>
            ) : results.length === 0 ? (
              <li className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500">No se encontraron instituciones</p>
                <p className="text-xs text-gray-400 mt-1">Puedes escribir el nombre manualmente</p>
              </li>
            ) : (
              results.map((inst, idx) => {
                const typeLabel  = INSTITUTION_TYPE_LABELS[inst.type] ?? inst.type;
                const typeColor  = TYPE_COLORS[inst.type] ?? "bg-gray-100 text-gray-600";
                const isSelected = query.toLowerCase() === inst.name.toLowerCase();
                const isFocused  = idx === focusedIdx;
                return (
                  <li
                    key={inst.id ?? `${inst.name}-${idx}`}
                    onClick={() => handleSelect(inst)}
                    onMouseEnter={() => setFocusedIdx(idx)}
                    className={["flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors",
                      isFocused ? "bg-green-50" : "hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 size={15} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {inst.name}
                        {inst.shortName && (
                          <span className="ml-1.5 font-normal text-gray-400">({inst.shortName})</span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-0.5 text-xs text-gray-400">
                          <MapPin size={10} />{inst.city}{inst.department ? `, ${inst.department}` : ""}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${typeColor}`}>
                          {typeLabel}
                        </span>
                        {inst.sector && (
                          <span className="text-xs text-gray-400 capitalize">{inst.sector.toLowerCase()}</span>
                        )}
                      </div>
                      {inst.areas && inst.areas.length > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {inst.areas.slice(0, 4).join(" · ")}
                        </p>
                      )}
                    </div>
                    {isSelected && <Check size={15} className="text-green-600 flex-shrink-0 mt-1" />}
                  </li>
                );
              })
            )}
          </ul>

          {/* Entrada manual */}
          {showManual && (
            <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
              <button
                type="button"
                onClick={() => { onChange(query.trim()); setIsOpen(false); }}
                className="text-xs text-green-600 hover:text-green-700 font-medium hover:underline"
              >
                Usar &ldquo;{query}&rdquo; como institución personalizada
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}