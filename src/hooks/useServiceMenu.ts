import { useTranslation } from "react-i18next";
import type { NavChild } from "../components/shared/MainHeader";

export function useServiceMenu(): NavChild[] {
  const { t } = useTranslation("service");

  const ids = ["fintech", "erp", "management", "government"];

  return ids.map((id) => ({
    id,
    title: t(`${id}.title`),
    content: t(`${id}.content`, { returnObjects: true }) as string[],
  }));
}
