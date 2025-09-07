
import fs from 'fs';
export type Theme = { orgName:string; primary:string; secondary:string; logoUrl?:string; homeTeam?:string; awayTeam?:string; };
export function getTheme(): Theme {
  try {
    const raw = fs.readFileSync(process.cwd()+"/data/theme.json","utf8");
    const j = JSON.parse(raw);
    return {
      orgName: j.orgName || process.env.ORG_NAME || "MNF Squares",
      primary: j.primary || process.env.ORG_PRIMARY || "#1f2937",
      secondary: j.secondary || process.env.ORG_SECONDARY || "#2563eb",
      logoUrl: j.logoUrl || process.env.ORG_LOGO_URL || "",
      homeTeam: j.homeTeam || process.env.ORG_HOME_TEAM || "Home",
      awayTeam: j.awayTeam || process.env.ORG_AWAY_TEAM || "Away",
    };
  } catch {
    return {
      orgName: process.env.ORG_NAME || "MNF Squares",
      primary: process.env.ORG_PRIMARY || "#1f2937",
      secondary: process.env.ORG_SECONDARY || "#2563eb",
      logoUrl: process.env.ORG_LOGO_URL || "",
      homeTeam: process.env.ORG_HOME_TEAM || "Home",
      awayTeam: process.env.ORG_AWAY_TEAM || "Away",
    };
  }
}
