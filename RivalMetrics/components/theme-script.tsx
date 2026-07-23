import { site } from "@/lib/site";

/**
 * Inline theme bootstrap, run before paint to prevent a flash of the wrong
 * theme. Reads the stored preference (default: light) and sets
 * `data-theme` on <html>. Must be synchronous and side-effect free.
 */
export function ThemeScript() {
  const code = `(() => {
    try {
      var stored = localStorage.getItem("rm-theme");
      var theme = stored === "dark" || stored === "light" ? stored : "light";
      document.documentElement.setAttribute("data-theme", theme);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", theme === "dark" ? "${site.themeColor.dark}" : "${site.themeColor.light}");
    } catch (e) {
      document.documentElement.setAttribute("data-theme", "light");
    }
  })();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
