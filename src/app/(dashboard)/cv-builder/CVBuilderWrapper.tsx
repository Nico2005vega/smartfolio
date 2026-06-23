// src/app/(dashboard)/cv-builder/CVBuilderWrapper.tsx
"use client";
import dynamic from "next/dynamic";
import type { Profile, AcademicRecord, Skill, CVTemplate, CVConfiguration } from "@/types";

const CVBuilderClient = dynamic(() => import("./CVBuilderClient"), { ssr: false });

interface Props {
  profile:             Profile | null;
  records:             AcademicRecord[];
  skills:              Skill[];
  templates:           CVTemplate[];
  config:              CVConfiguration | null;
  preSelectedTemplate?: string;
}

export default function CVBuilderWrapper(props: Props) {
  return <CVBuilderClient {...props} />;
}