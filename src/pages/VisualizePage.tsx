
import { Container } from "@/components/ui/container";
import NameVisualization from "@/components/NameVisualization";

const VisualizePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b py-6">
        <Container>
          <h1 className="text-2xl font-bold">Name Visualizer</h1>
          <p className="text-muted-foreground">Hover over names to see their position on the image</p>
        </Container>
      </header>
      
      <main className="flex-1 py-6 md:py-12">
        <Container>
          <NameVisualization />
        </Container>
      </main>
    </div>
  );
};

export default VisualizePage;
