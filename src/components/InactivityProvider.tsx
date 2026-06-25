"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, Clock, Shield } from "lucide-react";

const IDLE_MINUTES    = 20;   // minutos sin actividad → cierra sesión
const WARNING_SECONDS = 120;  // segundos de aviso antes del cierre

export default function InactivityProvider({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const supabase = createClient();

  const [showWarning, setShowWarning] = useState(false);
  const [secsLeft,    setSecsLeft]    = useState(WARNING_SECONDS);

  // Ref para saber si estamos en modo aviso — evita el problema de closures stale
  const isWarningRef = useRef(false);
  const idleTimer    = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const warnTimer    = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const countdown    = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. clearAll — definida PRIMERO porque las demás la usan
  const clearAll = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (warnTimer.current) clearTimeout(warnTimer.current);
    if (countdown.current) clearInterval(countdown.current);
  }, []);

  // 2. logout
  const logout = useCallback(async () => {
    clearAll();
    isWarningRef.current = false;
    await supabase.auth.signOut();
    router.push("/login");
  }, [clearAll, supabase, router]);

  // 3. startTimers — arranca los dos temporizadores desde cero
  const startTimers = useCallback(() => {
    clearAll();
    const warnAt = (IDLE_MINUTES * 60 - WARNING_SECONDS) * 1000;

    // Aviso
    warnTimer.current = setTimeout(() => {
      isWarningRef.current = true;
      setShowWarning(true);
      setSecsLeft(WARNING_SECONDS);

      countdown.current = setInterval(() => {
        setSecsLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdown.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, warnAt);

    // Cierre definitivo
    idleTimer.current = setTimeout(logout, IDLE_MINUTES * 60 * 1000);
  }, [clearAll, logout]);

  // 4. reset — solo actúa si no estamos en modo aviso
  const reset = useCallback(() => {
    if (isWarningRef.current) return;
    startTimers();
  }, [startTimers]);

  // Adjunta eventos de actividad
  useEffect(() => {
    const events: (keyof DocumentEventMap)[] = [
      "mousedown", "mousemove", "keydown", "scroll", "touchstart", "click",
    ];
    events.forEach(e => document.addEventListener(e, reset, { passive: true }));
    startTimers(); // arranca al montar

    return () => {
      events.forEach(e => document.removeEventListener(e, reset));
      clearAll();
    };
  }, [reset, startTimers, clearAll]);

  // Auto-logout cuando el contador llega a 0
  useEffect(() => {
    if (secsLeft === 0 && showWarning) logout();
  }, [secsLeft, showWarning, logout]);

  // Botón "Seguir conectado"
  const stayLoggedIn = () => {
    isWarningRef.current = false;
    setShowWarning(false);
    startTimers(); // llama startTimers directamente, no reset
  };

  const mins = Math.floor(secsLeft / 60);
  const secs = secsLeft % 60;
  const pct  = (secsLeft / WARNING_SECONDS) * 100;

  return (
    <>
      {children}

      {showWarning && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            style={{ animation: "popIn .25s cubic-bezier(.34,1.56,.64,1)" }}
          >
            {/* Barra de progreso superior */}
            <div className="h-1.5 bg-gray-100 relative overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="p-7 text-center">
              {/* Ícono */}
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{ background: "#fef3c7" }}
              >
                <Clock size={30} className="text-amber-500" />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                ¿Sigues ahí?
              </h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Tu sesión se cerrará automáticamente por inactividad en:
              </p>

              {/* Contador */}
              <div
                className="text-5xl font-mono font-extrabold mb-1"
                style={{ color: secsLeft <= 30 ? "#ef4444" : "#f59e0b" }}
              >
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </div>
              <p className="text-xs text-gray-400 mb-8">minutos : segundos</p>

              {/* Botones */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={stayLoggedIn}
                  className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[.98]"
                  style={{ background: "linear-gradient(135deg,#16a34a,#059669)" }}
                >
                  <Shield size={14} className="inline mr-2" />
                  Seguir conectado
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2.5 rounded-2xl text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogOut size={13} className="inline mr-1.5" />
                  Cerrar sesión ahora
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes popIn {
              from { opacity:0; transform:scale(.92) translateY(10px); }
              to   { opacity:1; transform:scale(1)   translateY(0);    }
            }
          `}</style>
        </div>
      )}
    </>
  );
}