import { useParams } from "react-router-dom"
import { useDirectory } from "../../plugin/src/client";
import Loading from "@/components/loading";
import PostList from "@/components/post-list";
import { ErrorDisplay } from "@/components/page-error";
import { RunningBar } from "@/components/running-bar";
import { Header } from "@/components/header";
import siteConfig from "virtual:veslx-config";

export function Home() {
  const { "*": path = "." } = useParams();
  const { directory, loading, error } = useDirectory(path)
  const config = siteConfig;

  if (error) {
    return <ErrorDisplay error={error} path={path} />;
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background noise-overlay">
      <RunningBar />
      <Header />
      <main className="flex-1 mx-auto w-full max-w-[var(--content-width)] px-[var(--page-padding)]">
        <title>{(path === "." || path === "") ? config.name : `${config.name} - ${path}`}</title>
        <main className="flex flex-col gap-8 mb-32 mt-32">
          {(path === "." || path === "") && (
            <div className="animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                {config.name}
              </h1>
              {config.description && (
                <p className="mt-2 text-muted-foreground">
                  {config.description}
                </p>
              )}
            </div>
          )}
          {directory && (
            <div className="animate-fade-in">
              <PostList directory={directory}/>
            </div>
          )}
        </main>
      </main>
    </div>
  )
}
